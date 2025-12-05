/**
 * Subscription Management API Endpoint
 *
 * GET: Fetch current subscription details
 * POST: Update subscription (upgrade/downgrade)
 * DELETE: Cancel subscription
 */

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getBillingProvider, isBillingConfigured } from "@/lib/billing/factory";
import { getPlan, isValidPlanId } from "@/config/plans";
import { authenticateRequest } from "@/lib/clerk-auth-helper";
import { checkBillingRateLimit } from "@/lib/billing/ratelimit";
import { UpdateSubscriptionSchema, formatValidationErrors } from "@/lib/billing/validation";
import { createGenericErrorResponse } from "@/lib/billing/errors";
import { z } from "zod";

const prisma = new PrismaClient();

/**
 * GET /api/billing/subscription
 * Fetch current subscription details
 */
export async function GET(request: Request) {
  let user: any = null;

  try {
    // Check if billing is configured
    if (!isBillingConfigured()) {
      return NextResponse.json(
        { error: "Billing is not configured on this server" },
        { status: 503 }
      );
    }

    // Authenticate user (supports both cookies and Bearer token)
    const { userId: clerkUserId } = await authenticateRequest(request);

    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    user = await prisma.user.findUnique({
      where: { clerkUserId },
      include: {
        usageRecords: {
          where: {
            period: getCurrentPeriod(),
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Rate limit check
    const rateLimitError = await checkBillingRateLimit(user.id);
    if (rateLimitError) return rateLimitError;

    console.log("[Billing] GET subscription - user data from DB:", {
      userId: user.id,
      planId: user.planId,
      billingInterval: user.billingInterval,
      subscriptionStatus: user.subscriptionStatus,
      subscriptionId: user.subscriptionId,
    });

    // Get plan details
    const plan = getPlan(user.planId);

    if (!plan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 500 });
    }

    // Calculate current usage
    const currentUsage = user.usageRecords[0];
    const apiCallsUsed = currentUsage?.apiCalls || 0;
    const memoriesUsed = await prisma.memory.count({
      where: { userId: user.id },
    });

    // Return subscription data
    return NextResponse.json({
      status: "success",
      data: {
        subscription: {
          planId: user.planId,
          planName: plan.name,
          status: user.subscriptionStatus || "active",
          interval: user.billingInterval,
          currentPeriodEnd: user.currentPeriodEnd,
          cancelAtPeriodEnd: user.cancelAtPeriodEnd,
        },
        plan: {
          id: plan.id,
          name: plan.name,
          description: plan.description,
          limits: plan.limits,
          pricing: plan.pricing,
          features: plan.features,
        },
        usage: {
          apiCalls: {
            used: apiCallsUsed,
            limit: plan.limits.apiCallsPerMonth,
            percentage: Math.round(
              (apiCallsUsed / plan.limits.apiCallsPerMonth) * 100
            ),
          },
          memories: {
            used: memoriesUsed,
            limit: plan.limits.maxMemories,
            percentage: Math.round((memoriesUsed / plan.limits.maxMemories) * 100),
          },
        },
      },
    });
  } catch (error) {
    const errorResponse = createGenericErrorResponse(error, user?.id, "get_subscription");

    return NextResponse.json(
      {
        status: "error",
        ...errorResponse,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/billing/subscription
 * Update subscription (upgrade/downgrade)
 */
export async function POST(request: Request) {
  let user: any = null;

  try {
    // Check if billing is configured
    if (!isBillingConfigured()) {
      return NextResponse.json(
        { error: "Billing is not configured on this server" },
        { status: 503 }
      );
    }

    // Authenticate user (supports both cookies and Bearer token)
    const { userId: clerkUserId } = await authenticateRequest(request);

    if (!clerkUserId) {
      console.error("[Billing] Authentication failed - no userId from Clerk");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Rate limit check
    const rateLimitError = await checkBillingRateLimit(user.id);
    if (rateLimitError) return rateLimitError;

    // Check if user has an active subscription
    if (!user.subscriptionId) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 400 }
      );
    }

    // Check if subscription is cancelled or scheduled for cancellation
    if (user.subscriptionStatus === "canceled" || user.cancelAtPeriodEnd) {
      return NextResponse.json(
        {
          error: "Cannot change plans on a cancelled subscription. Please reactivate your subscription first, then change plans.",
          code: "SUBSCRIPTION_CANCELLED",
          action: "reactivate_first",
          currentPlan: user.planId,
          subscriptionId: user.subscriptionId,
        },
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body = await request.json();

    let validatedInput;
    try {
      validatedInput = UpdateSubscriptionSchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = formatValidationErrors(error);
        return NextResponse.json(
          {
            error: formattedErrors.message,
            details: formattedErrors.fields,
          },
          { status: 400 }
        );
      }
      throw error;
    }

    const { planId, interval } = validatedInput;

    // Get billing provider
    const provider = getBillingProvider();

    console.log("[Billing] Current user state before update:", {
      userId: user.id,
      currentPlanId: user.planId,
      currentInterval: user.billingInterval,
      subscriptionId: user.subscriptionId,
      requestedPlanId: planId,
      requestedInterval: interval,
    });

    // Update subscription
    const updatedSubscription = await provider.updateSubscription(
      user.subscriptionId,
      planId,
      interval
    );

    console.log("[Billing] Subscription updated with Dodo, response:", {
      id: updatedSubscription.id,
      planId: updatedSubscription.planId,
      interval: updatedSubscription.interval,
      status: updatedSubscription.status,
    });

    // Update sync timestamp only (webhook will handle actual data update)
    // This prevents race conditions between API and webhook updates
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastBillingSyncAt: new Date(),
      },
    });

    console.log("[Billing] Subscription update initiated, waiting for webhook confirmation");

    // Return success - webhook will update the database
    return NextResponse.json({
      status: "success",
      data: {
        subscription: updatedSubscription,
        message: "Subscription update initiated. Changes will be reflected shortly.",
        note: "Waiting for payment provider confirmation via webhook"
      },
    });
  } catch (error) {
    const errorResponse = createGenericErrorResponse(error, user?.id, "update_subscription");

    return NextResponse.json(
      {
        status: "error",
        ...errorResponse,
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/billing/subscription
 * Cancel subscription
 */
export async function DELETE(request: Request) {
  let user: any = null;

  try {
    // Check if billing is configured
    if (!isBillingConfigured()) {
      return NextResponse.json(
        { error: "Billing is not configured on this server" },
        { status: 503 }
      );
    }

    // Authenticate user (supports both cookies and Bearer token)
    const { userId: clerkUserId } = await authenticateRequest(request);

    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Rate limit check
    const rateLimitError = await checkBillingRateLimit(user.id);
    if (rateLimitError) return rateLimitError;

    // Check if user has an active subscription
    if (!user.subscriptionId) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 400 }
      );
    }

    // Parse query parameters
    const url = new URL(request.url);
    const immediate = url.searchParams.get("immediate") === "true";

    // Get billing provider
    const provider = getBillingProvider();

    // Cancel subscription
    const canceledSubscription = await provider.cancelSubscription(
      user.subscriptionId,
      immediate
    );

    // Update sync timestamp only (webhook will handle actual data update)
    // This prevents race conditions between API and webhook updates
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastBillingSyncAt: new Date(),
      },
    });

    console.log("[Billing] Subscription cancellation initiated, waiting for webhook confirmation");

    // Return success - webhook will update the database
    return NextResponse.json({
      status: "success",
      data: {
        subscription: canceledSubscription,
        message: immediate
          ? "Subscription cancellation initiated"
          : "Subscription will be canceled at the end of the billing period",
        note: "Changes will be reflected shortly"
      },
    });
  } catch (error) {
    const errorResponse = createGenericErrorResponse(error, user?.id, "cancel_subscription");

    return NextResponse.json(
      {
        status: "error",
        ...errorResponse,
      },
      { status: 500 }
    );
  }
}

/**
 * Helper function to get current period in YYYY-MM format
 */
function getCurrentPeriod(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}
