/**
 * Provider-Agnostic Billing Event Handlers
 *
 * Business logic for handling billing events from any payment provider.
 * These handlers work with normalized BillingEvent types, not provider-specific events.
 */

import { PrismaClient } from "@prisma/client";
import type { BillingEvent, PaymentData, SubscriptionData } from "./types";

const prisma = new PrismaClient();

// ============================================================================
// Subscription Event Handlers
// ============================================================================

/**
 * Handle subscription created/activated event
 * This is called when a new subscription is created or becomes active
 */
export async function handleSubscriptionCreated(
  event: BillingEvent
): Promise<void> {
  const data = event.data as SubscriptionData;

  console.log(
    `[Billing] Subscription created: ${data.id} for customer ${event.customerId}`
  );

  // Find user by billing customer ID or by metadata
  let user = await prisma.user.findUnique({
    where: { billingCustomerId: event.customerId },
  });

  // If not found by customer ID, try to find by metadata (for first-time subscribers)
  if (!user) {
    // Metadata is in different locations depending on the event
    const metadata = event.rawEvent?.data?.metadata || event.rawEvent?.metadata;

    if (metadata) {
      const userId = metadata.userId || metadata.user_id;
      const clerkUserId = metadata.clerkUserId || metadata.clerk_user_id;

      console.log(`[Billing] Trying to find user by metadata:`, { userId, clerkUserId, metadata });

      if (userId) {
        user = await prisma.user.findUnique({
          where: { id: userId },
        });
      } else if (clerkUserId) {
        user = await prisma.user.findUnique({
          where: { clerkUserId: clerkUserId },
        });
      }
    }
  }

  if (!user) {
    console.error(
      `[Billing] No user found for customer ${event.customerId}, subscription ${data.id}, metadata:`,
      event.rawEvent?.data?.metadata || event.rawEvent?.metadata
    );
    return;
  }

  console.log(`[Billing] Found user ${user.id} (${user.email}) for subscription ${data.id}`);

  // Update user with subscription details
  await prisma.user.update({
    where: { id: user.id },
    data: {
      billingProvider: event.provider,
      billingCustomerId: event.customerId,
      subscriptionId: data.id,
      planId: data.planId,
      subscriptionStatus: data.status,
      currentPeriodEnd: data.currentPeriodEnd,
      billingInterval: data.interval,
      cancelAtPeriodEnd: data.cancelAtPeriodEnd,
    },
  });

  console.log(
    `[Billing] User ${user.id} upgraded to ${data.planId} (${data.interval})`
  );
}

/**
 * Handle subscription updated event
 * This is called when a subscription is modified (plan change, interval change, etc.)
 */
export async function handleSubscriptionUpdated(
  event: BillingEvent
): Promise<void> {
  const data = event.data as SubscriptionData;

  console.log(
    `[Billing] Subscription updated: ${data.id} for customer ${event.customerId}`
  );

  const user = await prisma.user.findUnique({
    where: { billingCustomerId: event.customerId },
  });

  if (!user) {
    console.warn(
      `[Billing] No user found for customer ${event.customerId}, subscription ${data.id}`
    );
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      planId: data.planId,
      subscriptionStatus: data.status,
      currentPeriodEnd: data.currentPeriodEnd,
      billingInterval: data.interval,
      cancelAtPeriodEnd: data.cancelAtPeriodEnd,
    },
  });

  console.log(
    `[Billing] User ${user.id} subscription updated to ${data.planId} (${data.interval})`
  );
}

/**
 * Handle subscription canceled event
 * This is called when a subscription is canceled
 */
export async function handleSubscriptionCanceled(
  event: BillingEvent
): Promise<void> {
  const data = event.data as SubscriptionData;

  console.log(
    `[Billing] Subscription canceled: ${data.id} for customer ${event.customerId}`
  );

  const user = await prisma.user.findUnique({
    where: { billingCustomerId: event.customerId },
  });

  if (!user) {
    console.warn(
      `[Billing] No user found for customer ${event.customerId}, subscription ${data.id}`
    );
    return;
  }

  // If immediate cancellation, downgrade to free plan
  // If cancel at period end, keep plan until period ends
  if (!data.cancelAtPeriodEnd) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        planId: "free",
        subscriptionStatus: "canceled",
        cancelAtPeriodEnd: false,
      },
    });

    console.log(`[Billing] User ${user.id} downgraded to free plan`);
  } else {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: "canceled",
        cancelAtPeriodEnd: true,
      },
    });

    console.log(
      `[Billing] User ${user.id} will be downgraded at period end: ${data.currentPeriodEnd}`
    );
  }
}

/**
 * Handle subscription paused/on hold event
 * This is called when a subscription is paused (usually due to payment failure)
 */
export async function handleSubscriptionPaused(
  event: BillingEvent
): Promise<void> {
  const data = event.data as SubscriptionData;

  console.log(
    `[Billing] Subscription paused: ${data.id} for customer ${event.customerId}`
  );

  const user = await prisma.user.findUnique({
    where: { billingCustomerId: event.customerId },
  });

  if (!user) {
    console.warn(
      `[Billing] No user found for customer ${event.customerId}, subscription ${data.id}`
    );
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionStatus: "past_due",
    },
  });

  console.log(
    `[Billing] User ${user.id} subscription is past due - needs payment method update`
  );

  // TODO: Send email notification to user about payment failure
}

/**
 * Handle subscription resumed event
 */
export async function handleSubscriptionResumed(
  event: BillingEvent
): Promise<void> {
  const data = event.data as SubscriptionData;

  console.log(
    `[Billing] Subscription resumed: ${data.id} for customer ${event.customerId}`
  );

  const user = await prisma.user.findUnique({
    where: { billingCustomerId: event.customerId },
  });

  if (!user) {
    console.warn(
      `[Billing] No user found for customer ${event.customerId}, subscription ${data.id}`
    );
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionStatus: "active",
      currentPeriodEnd: data.currentPeriodEnd,
    },
  });

  console.log(`[Billing] User ${user.id} subscription resumed successfully`);
}

// ============================================================================
// Payment Event Handlers
// ============================================================================

/**
 * Handle payment succeeded event
 */
export async function handlePaymentSucceeded(
  event: BillingEvent
): Promise<void> {
  const data = event.data as PaymentData;

  console.log(
    `[Billing] Payment succeeded: ${data.id} for customer ${event.customerId} - ${data.amount / 100} ${data.currency.toUpperCase()}`
  );

  // Payment success doesn't usually require action - subscription.updated handles plan changes
  // But we log it for audit trail and could send receipt email

  // TODO: Send payment receipt email
}

/**
 * Handle payment failed event
 */
export async function handlePaymentFailed(
  event: BillingEvent
): Promise<void> {
  const data = event.data as PaymentData;

  console.error(
    `[Billing] Payment failed: ${data.id} for customer ${event.customerId} - Reason: ${data.failureReason || "Unknown"}`
  );

  const user = await prisma.user.findUnique({
    where: { billingCustomerId: event.customerId },
  });

  if (!user) {
    console.warn(
      `[Billing] No user found for customer ${event.customerId}, payment ${data.id}`
    );
    return;
  }

  // Mark subscription as past_due
  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionStatus: "past_due",
    },
  });

  console.log(
    `[Billing] User ${user.id} marked as past_due due to payment failure`
  );

  // TODO: Send email notification about payment failure and action required
}

/**
 * Handle payment refunded event
 */
export async function handlePaymentRefunded(
  event: BillingEvent
): Promise<void> {
  const data = event.data as PaymentData;

  console.log(
    `[Billing] Payment refunded: ${data.id} for customer ${event.customerId}`
  );

  // TODO: Handle refund logic if needed (e.g., revoke access if full refund)
}

// ============================================================================
// Customer Event Handlers
// ============================================================================

/**
 * Handle customer updated event
 */
export async function handleCustomerUpdated(
  event: BillingEvent
): Promise<void> {
  console.log(`[Billing] Customer updated: ${event.customerId}`);

  // Usually doesn't require action, but could sync customer data if needed
}

/**
 * Handle customer deleted event
 */
export async function handleCustomerDeleted(
  event: BillingEvent
): Promise<void> {
  console.log(`[Billing] Customer deleted: ${event.customerId}`);

  const user = await prisma.user.findUnique({
    where: { billingCustomerId: event.customerId },
  });

  if (!user) {
    return;
  }

  // Clear billing data but don't delete user account
  await prisma.user.update({
    where: { id: user.id },
    data: {
      billingProvider: null,
      billingCustomerId: null,
      subscriptionId: null,
      planId: "free",
      subscriptionStatus: null,
      currentPeriodEnd: null,
      billingInterval: null,
      cancelAtPeriodEnd: false,
    },
  });

  console.log(`[Billing] User ${user.id} billing data cleared`);
}

// ============================================================================
// Main Event Router
// ============================================================================

/**
 * Route a billing event to the appropriate handler
 * This is the single entry point for all billing events from any provider
 */
export async function handleBillingEvent(event: BillingEvent): Promise<void> {
  console.log(
    `[Billing] Processing event: ${event.type} from ${event.provider}`
  );

  try {
    switch (event.type) {
      case "subscription.created":
        await handleSubscriptionCreated(event);
        break;

      case "subscription.updated":
        await handleSubscriptionUpdated(event);
        break;

      case "subscription.canceled":
        await handleSubscriptionCanceled(event);
        break;

      case "subscription.paused":
        await handleSubscriptionPaused(event);
        break;

      case "subscription.resumed":
        await handleSubscriptionResumed(event);
        break;

      case "payment.succeeded":
        await handlePaymentSucceeded(event);
        break;

      case "payment.failed":
        await handlePaymentFailed(event);
        break;

      case "payment.refunded":
        await handlePaymentRefunded(event);
        break;

      case "customer.updated":
        await handleCustomerUpdated(event);
        break;

      case "customer.deleted":
        await handleCustomerDeleted(event);
        break;

      default:
        console.warn(`[Billing] Unknown event type: ${event.type}`);
    }

    console.log(`[Billing] Event ${event.type} processed successfully`);
  } catch (error) {
    console.error(
      `[Billing] Error processing event ${event.type}:`,
      error instanceof Error ? error.message : String(error)
    );
    throw error;
  }
}

/**
 * Create or get a customer in the billing provider
 * This is called during the first checkout to link our user to a billing customer
 */
export async function getOrCreateBillingCustomer(
  userId: string,
  email: string
): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error(`User ${userId} not found`);
  }

  // If user already has a billing customer ID, return it
  if (user.billingCustomerId) {
    return user.billingCustomerId;
  }

  // For Dodo Payments, the customer is created automatically during checkout
  // We just return a placeholder - the actual customer ID will be set when the webhook fires
  // Other providers like Stripe might require explicit customer creation here
  return "";
}
