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

const prisma = new PrismaClient();

/**
 * GET /api/billing/subscription
 * Fetch current subscription details
 */
export async function GET(request: Request) {
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
    const user = await prisma.user.findUnique({
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
    console.error("[Billing] Get subscription error:", error);

    return NextResponse.json(
      {
        status: "error",
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch subscription",
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
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has an active subscription
    if (!user.subscriptionId) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { planId, interval } = body;

    // Validate inputs
    if (!planId || !interval) {
      return NextResponse.json(
        { error: "Missing required fields: planId, interval" },
        { status: 400 }
      );
    }

    if (!isValidPlanId(planId)) {
      return NextResponse.json({ error: "Invalid plan ID" }, { status: 400 });
    }

    if (interval !== "monthly" && interval !== "yearly") {
      return NextResponse.json(
        { error: "Invalid interval. Must be 'monthly' or 'yearly'" },
        { status: 400 }
      );
    }

    // Get billing provider
    const provider = getBillingProvider();

    // Update subscription
    const updatedSubscription = await provider.updateSubscription(
      user.subscriptionId,
      planId,
      interval
    );

    // Update user in database immediately (don't wait for webhook)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        planId: updatedSubscription.planId,
        billingInterval: updatedSubscription.interval,
        subscriptionStatus: updatedSubscription.status,
        currentPeriodEnd: updatedSubscription.currentPeriodEnd || null,
        cancelAtPeriodEnd: updatedSubscription.cancelAtPeriodEnd || false,
      },
    });

    // Return updated subscription
    return NextResponse.json({
      status: "success",
      data: {
        subscription: updatedSubscription,
        message: "Subscription updated successfully",
      },
    });
  } catch (error) {
    console.error("[Billing] Update subscription error:", error);

    return NextResponse.json(
      {
        status: "error",
        error:
          error instanceof Error
            ? error.message
            : "Failed to update subscription",
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
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

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

    // Update user in database immediately (don't wait for webhook)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: canceledSubscription.status,
        cancelAtPeriodEnd: canceledSubscription.cancelAtPeriodEnd || false,
        currentPeriodEnd: canceledSubscription.currentPeriodEnd || null,
        // If immediate cancellation, also update plan to free
        ...(immediate && {
          planId: 'free',
          billingInterval: null,
          subscriptionId: null,
          billingCustomerId: null,
        }),
      },
    });

    // Return canceled subscription
    return NextResponse.json({
      status: "success",
      data: {
        subscription: canceledSubscription,
        message: immediate
          ? "Subscription canceled immediately"
          : "Subscription will be canceled at the end of the billing period",
      },
    });
  } catch (error) {
    console.error("[Billing] Cancel subscription error:", error);

    return NextResponse.json(
      {
        status: "error",
        error:
          error instanceof Error
            ? error.message
            : "Failed to cancel subscription",
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
