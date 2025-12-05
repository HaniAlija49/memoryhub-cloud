/**
 * Dodo Payments Provider Implementation
 *
 * Implements IBillingProvider interface for Dodo Payments.
 * Uses the @dodopayments/nextjs adapter for checkout and portal sessions.
 */

import { Webhook } from "standardwebhooks";
import { getPlanIdFromProductId, getProviderProductId } from "../../../config/plans";
import type {
  BillingEvent,
  CheckoutSession,
  CreateCheckoutSessionParams,
  CreatePortalSessionParams,
  IBillingProvider,
  PaymentData,
  PortalSession,
  SubscriptionData,
  SubscriptionStatus,
} from "../types";

// ============================================================================
// Dodo API Client
// ============================================================================

interface DodoConfig {
  apiKey: string;
  webhookSecret: string;
  mode: "test" | "live";
}

class DodoAPIClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, mode: "test" | "live") {
    this.apiKey = apiKey;
    this.baseUrl =
      mode === "live"
        ? "https://live.dodopayments.com"
        : "https://test.dodopayments.com";
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Dodo API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    // Handle empty responses (204 No Content or empty body)
    const text = await response.text();
    if (!text || text.trim() === '') {
      return {} as T;
    }

    try {
      return JSON.parse(text);
    } catch (error) {
      console.error('[Dodo] Failed to parse response:', text);
      throw new Error(`Invalid JSON response from Dodo API: ${text}`);
    }
  }

  async createCheckoutSession(params: {
    productId: string;
    customerId?: string;
    customerEmail?: string;
    successUrl: string;
    cancelUrl: string;
    metadata?: Record<string, string>;
  }): Promise<{ url: string; sessionId: string }> {
    const requestBody: any = {
      product_cart: [
        {
          product_id: params.productId,
          quantity: 1,
        },
      ],
      return_url: params.successUrl,
    };

    // Add customer info if provided
    if (params.customerEmail) {
      requestBody.customer = {
        email: params.customerEmail,
      };
    }

    // Add metadata if provided
    if (params.metadata) {
      requestBody.metadata = params.metadata;
    }

    const response = await this.request<{ checkout_url: string; session_id: string }>(
      "/checkouts",
      {
        method: "POST",
        body: JSON.stringify(requestBody),
      }
    );

    return {
      url: response.checkout_url,
      sessionId: response.session_id,
    };
  }

  async createPortalSession(params: {
    customerId: string;
    returnUrl: string;
  }): Promise<{ url: string }> {
    const response = await this.request<{ link: string }>(
      `/customers/${params.customerId}/customer-portal/session`,
      {
        method: "POST",
        body: JSON.stringify({
          return_url: params.returnUrl,
        }),
      }
    );

    // Dodo returns "link" not "url"
    return { url: response.link };
  }

  async getSubscription(
    subscriptionId: string
  ): Promise<{
    subscription_id: string;
    customer: {
      customer_id: string;
      email: string;
      name: string;
    };
    product_id: string;
    status: string;
    next_billing_date: string | null;
    previous_billing_date: string | null;
    cancel_at_next_billing_date: boolean;
    payment_frequency_interval: string;
    recurring_pre_tax_amount: number;
    currency: string;
  }> {
    return this.request(`/subscriptions/${subscriptionId}`, {
      method: "GET",
    });
  }

  async cancelSubscription(
    subscriptionId: string,
    immediate: boolean = false
  ): Promise<any> {
    // Dodo uses PATCH with cancel_at_next_billing_date parameter
    // When true: cancel at period end (graceful)
    // When false with status=cancelled: cancel immediately
    const body: any = {};

    if (immediate) {
      // Immediate cancellation: set status to cancelled
      body.status = "cancelled";
      body.cancel_at_next_billing_date = false;
    } else {
      // Cancel at period end: set cancel_at_next_billing_date flag
      body.cancel_at_next_billing_date = true;
    }

    return this.request(`/subscriptions/${subscriptionId}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  async updateSubscription(
    subscriptionId: string,
    newProductId: string
  ): Promise<any> {
    console.log("[Dodo] Sending POST change-plan request to Dodo:", {
      endpoint: `/subscriptions/${subscriptionId}/change-plan`,
      body: {
        product_id: newProductId,
        proration_billing_mode: "prorated_immediately",
        quantity: 1,
      },
    });

    // Use the dedicated change-plan endpoint to update the product
    const response = await this.request(`/subscriptions/${subscriptionId}/change-plan`, {
      method: "POST",
      body: JSON.stringify({
        product_id: newProductId,
        proration_billing_mode: "prorated_immediately", // Fair billing for upgrades/downgrades
        quantity: 1, // Standard for SaaS subscriptions
      }),
    });

    console.log("[Dodo] Change-plan response from Dodo:", JSON.stringify(response, null, 2));

    return response;
  }

  async reactivateSubscription(subscriptionId: string): Promise<any> {
    // Use PATCH to remove the cancellation flag and reactivate
    return this.request(`/subscriptions/${subscriptionId}`, {
      method: "PATCH",
      body: JSON.stringify({
        cancel_at_next_billing_date: false,
      }),
    });
  }
}

// ============================================================================
// Dodo Provider
// ============================================================================

export class DodoProvider implements IBillingProvider {
  readonly name = "dodo";
  private client: DodoAPIClient;
  private webhookSecret: string;

  constructor(config: DodoConfig) {
    this.client = new DodoAPIClient(config.apiKey, config.mode);
    this.webhookSecret = config.webhookSecret;
  }

  async createCheckoutSession(
    params: CreateCheckoutSessionParams
  ): Promise<CheckoutSession> {
    // Get Dodo product ID from our plan configuration
    const productId = getProviderProductId(
      params.planId,
      "dodo",
      params.interval
    );

    if (!productId) {
      throw new Error(
        `No Dodo product ID configured for plan ${params.planId} with interval ${params.interval}`
      );
    }

    const session = await this.client.createCheckoutSession({
      productId,
      customerEmail: params.userEmail,
      successUrl: params.successUrl,
      cancelUrl: params.cancelUrl,
      metadata: {
        userId: params.userId,
        planId: params.planId,
        interval: params.interval,
        ...params.metadata,
      },
    });

    return session;
  }

  async createPortalSession(
    params: CreatePortalSessionParams
  ): Promise<PortalSession> {
    return this.client.createPortalSession({
      customerId: params.customerId,
      returnUrl: params.returnUrl,
    });
  }

  async getSubscription(subscriptionId: string): Promise<SubscriptionData> {
    const sub = await this.client.getSubscription(subscriptionId);

    console.log("[Dodo] Raw subscription data from Dodo:", JSON.stringify(sub, null, 2));

    // Map Dodo product ID back to our plan ID
    const planInfo = getPlanIdFromProductId("dodo", sub.product_id);

    // Helper to safely parse dates
    const parseDate = (value: any): Date | null => {
      if (!value) return null;
      if (typeof value === 'number') {
        const date = new Date(value * 1000);
        return isNaN(date.getTime()) ? null : date;
      }
      if (typeof value === 'string') {
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date;
      }
      return null;
    };

    if (!planInfo) {
      console.error(`[CRITICAL] Unknown Dodo product ID: ${sub.product_id}`);
      console.error(`[CRITICAL] Subscription details:`, {
        subscriptionId: sub.subscription_id,
        customerId: sub.customer.customer_id,
        productId: sub.product_id,
      });

      // Send alert to monitoring if available
      if (typeof global !== "undefined" && (global as any).monitoring) {
        (global as any).monitoring.captureMessage(
          `Unknown Dodo product ID: ${sub.product_id}`,
          {
            level: "critical",
            extra: { subscription: sub },
          }
        );
      }

      throw new Error(`Unknown Dodo product ID: ${sub.product_id}. Cannot determine plan.`);
    }

    return {
      id: sub.subscription_id,
      customerId: sub.customer.customer_id,
      planId: planInfo.planId,
      status: this.normalizeDodoStatus(sub.status),
      currentPeriodStart: parseDate(sub.previous_billing_date),
      currentPeriodEnd: parseDate(sub.next_billing_date),
      cancelAtPeriodEnd: sub.cancel_at_next_billing_date,
      interval: (planInfo.interval || "monthly") as "monthly" | "yearly",
      amount: sub.recurring_pre_tax_amount,
      currency: sub.currency,
    };
  }

  async cancelSubscription(
    subscriptionId: string,
    immediate?: boolean
  ): Promise<SubscriptionData> {
    await this.client.cancelSubscription(subscriptionId, immediate);
    return this.getSubscription(subscriptionId);
  }

  async updateSubscription(
    subscriptionId: string,
    newPlanId: string,
    newInterval: "monthly" | "yearly"
  ): Promise<SubscriptionData> {
    const newProductId = getProviderProductId(newPlanId, "dodo", newInterval);

    if (!newProductId) {
      throw new Error(
        `No Dodo product ID configured for plan ${newPlanId} with interval ${newInterval}`
      );
    }

    console.log("[Dodo] Updating subscription with Dodo API:", {
      subscriptionId,
      newPlanId,
      newInterval,
      newProductId,
    });

    // Check if subscription is scheduled for cancellation
    // If so, un-cancel it before changing the plan
    try {
      const currentSub = await this.getSubscription(subscriptionId);

      if (currentSub.cancelAtPeriodEnd) {
        console.log("[Dodo] Subscription is scheduled for cancellation, removing cancellation flag first...");

        // Use the client's reactivateSubscription method
        await this.client.reactivateSubscription(subscriptionId);

        console.log("[Dodo] Cancellation flag removed successfully");
      }
    } catch (error) {
      console.warn("[Dodo] Failed to check/remove cancellation flag:", error);
      // Continue anyway - the change-plan call will fail if needed
    }

    const updateResponse = await this.client.updateSubscription(subscriptionId, newProductId);

    console.log("[Dodo] Dodo API update response:", JSON.stringify(updateResponse, null, 2));

    const refreshedSub = await this.getSubscription(subscriptionId);

    console.log("[Dodo] Fetched subscription after update, product_id:", refreshedSub.id);

    return refreshedSub;
  }

  async reactivateSubscription(subscriptionId: string): Promise<SubscriptionData> {
    console.log("[Dodo] Reactivating subscription:", subscriptionId);

    // Use the client's reactivateSubscription method
    await this.client.reactivateSubscription(subscriptionId);

    console.log("[Dodo] Subscription reactivated successfully");

    return this.getSubscription(subscriptionId);
  }

  async verifyWebhook(
    payload: string | Buffer,
    headers: Record<string, string>,
    secret: string
  ): Promise<BillingEvent> {
    const webhook = new Webhook(secret);

    try {
      // Verify the webhook signature using Standard Webhooks library
      // The library expects the raw payload and headers object
      const rawPayload = typeof payload === "string" ? payload : payload.toString();

      console.log("[Dodo] Verifying webhook signature...");
      console.log("[Dodo]   - Payload length:", rawPayload.length);

      // Verify signature - this will throw if invalid
      await webhook.verify(rawPayload, headers as any);

      console.log("[Dodo] Signature verification successful!");

      // Parse the event
      const event = JSON.parse(rawPayload);

      // Normalize the event to our standard format
      return this.normalizeDodoEvent(event);
    } catch (error) {
      console.error("[Dodo] Verification error details:", {
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
        payloadPreview: typeof payload === "string" ? payload.substring(0, 200) : "Buffer",
        headersReceived: headers,
      });
      throw new Error(
        `Webhook verification failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  private normalizeDodoStatus(dodoStatus: string): SubscriptionStatus {
    const statusMap: Record<string, SubscriptionStatus> = {
      active: "active",
      trialing: "trialing",
      past_due: "past_due",
      canceled: "canceled",
      cancelled: "canceled", // UK spelling
      paused: "paused",
      on_hold: "past_due",
      incomplete: "incomplete",
      incomplete_expired: "incomplete_expired",
    };

    return statusMap[dodoStatus.toLowerCase()] || "canceled";
  }

  private normalizeDodoEvent(dodoEvent: any): BillingEvent {
    const eventType = dodoEvent.type || dodoEvent.event;

    switch (eventType) {
      case "subscription.created":
      case "subscription.active":
        return {
          type: "subscription.created",
          provider: "dodo",
          customerId: dodoEvent.data.customer?.customer_id || dodoEvent.data.customer_id,
          subscriptionId: dodoEvent.data.subscription_id,
          data: this.normalizeSubscriptionData(dodoEvent.data),
          timestamp: new Date(dodoEvent.timestamp || dodoEvent.created_at || dodoEvent.created || Date.now()),
          rawEvent: dodoEvent,
        };

      case "subscription.updated":
      case "subscription.plan_changed":
        return {
          type: "subscription.updated",
          provider: "dodo",
          customerId: dodoEvent.data.customer?.customer_id || dodoEvent.data.customer_id,
          subscriptionId: dodoEvent.data.subscription_id || dodoEvent.data.id,
          data: this.normalizeSubscriptionData(dodoEvent.data),
          timestamp: new Date(dodoEvent.timestamp || dodoEvent.created || Date.now()),
          rawEvent: dodoEvent,
        };

      case "subscription.canceled":
      case "subscription.cancelled":
        return {
          type: "subscription.canceled",
          provider: "dodo",
          customerId: dodoEvent.data.customer?.customer_id || dodoEvent.data.customer_id,
          subscriptionId: dodoEvent.data.subscription_id || dodoEvent.data.id,
          data: this.normalizeSubscriptionData(dodoEvent.data),
          timestamp: new Date(dodoEvent.timestamp || dodoEvent.created || Date.now()),
          rawEvent: dodoEvent,
        };

      case "subscription.paused":
      case "subscription.on_hold":
      case "subscription.failed":
        return {
          type: "subscription.paused",
          provider: "dodo",
          customerId: dodoEvent.data.customer?.customer_id || dodoEvent.data.customer_id,
          subscriptionId: dodoEvent.data.subscription_id || dodoEvent.data.id,
          data: this.normalizeSubscriptionData(dodoEvent.data),
          timestamp: new Date(dodoEvent.timestamp || dodoEvent.created_at || dodoEvent.created || Date.now()),
          rawEvent: dodoEvent,
        };

      case "subscription.renewed":
        return {
          type: "subscription.updated",
          provider: "dodo",
          customerId: dodoEvent.data.customer?.customer_id || dodoEvent.data.customer_id,
          subscriptionId: dodoEvent.data.subscription_id || dodoEvent.data.id,
          data: this.normalizeSubscriptionData(dodoEvent.data),
          timestamp: new Date(dodoEvent.timestamp || dodoEvent.created_at || dodoEvent.created || Date.now()),
          rawEvent: dodoEvent,
        };

      case "subscription.expired":
        return {
          type: "subscription.canceled",
          provider: "dodo",
          customerId: dodoEvent.data.customer?.customer_id || dodoEvent.data.customer_id,
          subscriptionId: dodoEvent.data.subscription_id || dodoEvent.data.id,
          data: this.normalizeSubscriptionData(dodoEvent.data),
          timestamp: new Date(dodoEvent.timestamp || dodoEvent.created_at || dodoEvent.created || Date.now()),
          rawEvent: dodoEvent,
        };

      case "payment.succeeded":
        return {
          type: "payment.succeeded",
          provider: "dodo",
          customerId: dodoEvent.data.customer?.customer_id || dodoEvent.data.customer_id,
          subscriptionId: dodoEvent.data.subscription_id || undefined,
          data: this.normalizePaymentData(dodoEvent.data),
          timestamp: new Date(dodoEvent.timestamp || dodoEvent.created || Date.now()),
          rawEvent: dodoEvent,
        };

      case "payment.failed":
        return {
          type: "payment.failed",
          provider: "dodo",
          customerId: dodoEvent.data.customer?.customer_id || dodoEvent.data.customer_id,
          subscriptionId: dodoEvent.data.subscription_id || undefined,
          data: this.normalizePaymentData(dodoEvent.data),
          timestamp: new Date(dodoEvent.timestamp || dodoEvent.created || Date.now()),
          rawEvent: dodoEvent,
        };

      // Additional payment events (log but don't require action)
      case "payment.processing":
      case "payment.cancelled":
        console.log(`[Dodo] Ignoring ${eventType} event - not actionable`);
        return {
          type: "payment.succeeded", // Map to succeeded for logging purposes
          provider: "dodo",
          customerId: dodoEvent.data.customer?.customer_id || dodoEvent.data.customer_id,
          subscriptionId: dodoEvent.data.subscription_id || undefined,
          data: this.normalizePaymentData(dodoEvent.data),
          timestamp: new Date(dodoEvent.timestamp || dodoEvent.created || Date.now()),
          rawEvent: dodoEvent,
        };

      // Refund events (log for now, can implement handlers later)
      case "refund.succeeded":
      case "refund.failed":
        console.log(`[Dodo] Received ${eventType} - implement refund handling if needed`);
        return {
          type: "payment.refunded",
          provider: "dodo",
          customerId: dodoEvent.data.customer?.customer_id || dodoEvent.data.customer_id,
          subscriptionId: dodoEvent.data.subscription_id || undefined,
          data: this.normalizePaymentData(dodoEvent.data),
          timestamp: new Date(dodoEvent.timestamp || dodoEvent.created || Date.now()),
          rawEvent: dodoEvent,
        };

      // Dispute events (log for monitoring, handle manually)
      case "dispute.opened":
      case "dispute.expired":
      case "dispute.accepted":
      case "dispute.cancelled":
      case "dispute.challenged":
      case "dispute.won":
      case "dispute.lost":
        console.warn(`[Dodo] Dispute event received: ${eventType} - manual review required`);
        return {
          type: "payment.failed", // Map to failed for alert purposes
          provider: "dodo",
          customerId: dodoEvent.data.customer?.customer_id || dodoEvent.data.customer_id,
          subscriptionId: dodoEvent.data.subscription_id || undefined,
          data: this.normalizePaymentData(dodoEvent.data),
          timestamp: new Date(dodoEvent.timestamp || dodoEvent.created || Date.now()),
          rawEvent: dodoEvent,
        };

      // License key events (not applicable for this use case)
      case "license_key.created":
        console.log(`[Dodo] Ignoring ${eventType} - not using license keys`);
        return {
          type: "payment.succeeded",
          provider: "dodo",
          customerId: dodoEvent.data.customer?.customer_id || dodoEvent.data.customer_id,
          subscriptionId: undefined,
          data: {} as any,
          timestamp: new Date(dodoEvent.timestamp || dodoEvent.created || Date.now()),
          rawEvent: dodoEvent,
        };

      default:
        console.warn(`[Dodo] Unknown event type: ${eventType} - ignoring`);
        throw new Error(`Unknown Dodo event type: ${eventType}`);
    }
  }

  private normalizeSubscriptionData(dodoSub: any): SubscriptionData {
    const planInfo = getPlanIdFromProductId("dodo", dodoSub.product_id);

    // Parse dates - they could be ISO strings, timestamps, or null
    const parseDate = (dateValue: any): Date | null => {
      if (!dateValue) return null;

      let date: Date;
      if (typeof dateValue === 'string') {
        date = new Date(dateValue);
      } else if (typeof dateValue === 'number') {
        date = new Date(dateValue * 1000);
      } else {
        return null;
      }

      // Check if date is valid
      return isNaN(date.getTime()) ? null : date;
    };

    // Extract subscription ID - it might be subscription_id, id, or we generate a fallback
    const subscriptionId = dodoSub.subscription_id || dodoSub.id || `sub_${dodoSub.customer?.customer_id}_${Date.now()}`;

    if (!planInfo) {
      console.error(`[CRITICAL] Unknown Dodo product ID in webhook: ${dodoSub.product_id}`);
      console.error(`[CRITICAL] Webhook subscription details:`, {
        subscriptionId,
        customerId: dodoSub.customer?.customer_id,
        productId: dodoSub.product_id,
      });

      // Send alert to monitoring if available
      if (typeof global !== "undefined" && (global as any).monitoring) {
        (global as any).monitoring.captureMessage(
          `Unknown Dodo product ID in webhook: ${dodoSub.product_id}`,
          {
            level: "critical",
            extra: { subscription: dodoSub },
          }
        );
      }

      throw new Error(`Unknown Dodo product ID: ${dodoSub.product_id}. Cannot determine plan.`);
    }

    return {
      id: subscriptionId,
      customerId: dodoSub.customer?.customer_id || dodoSub.customer_id,
      planId: planInfo.planId,
      status: this.normalizeDodoStatus(dodoSub.status),
      currentPeriodStart: parseDate(dodoSub.previous_billing_date || dodoSub.current_period_start),
      currentPeriodEnd: parseDate(dodoSub.next_billing_date || dodoSub.current_period_end),
      cancelAtPeriodEnd: dodoSub.cancel_at_next_billing_date || dodoSub.cancel_at_period_end || false,
      interval: (planInfo.interval || "monthly") as "monthly" | "yearly",
      amount: dodoSub.recurring_pre_tax_amount || dodoSub.amount || 0,
      currency: (dodoSub.currency || "usd").toLowerCase(),
    };
  }

  private normalizePaymentData(dodoPayment: any): PaymentData {
    return {
      id: dodoPayment.payment_id || dodoPayment.id,
      customerId: dodoPayment.customer?.customer_id || dodoPayment.customer_id,
      subscriptionId: dodoPayment.subscription_id || undefined,
      amount: dodoPayment.total_amount || dodoPayment.amount || 0,
      currency: (dodoPayment.currency || "usd").toLowerCase(),
      status: dodoPayment.status === "succeeded" ? "succeeded" : "failed",
      failureReason: dodoPayment.error_message || dodoPayment.failure_reason,
      createdAt: new Date(dodoPayment.created_at || dodoPayment.created || Date.now()),
    };
  }
}
