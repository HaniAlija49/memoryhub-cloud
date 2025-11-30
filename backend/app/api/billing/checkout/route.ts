/**
 * Checkout API Endpoint
 *
 * Creates a checkout session for subscribing to a paid plan.
 * Provider-agnostic - works with any billing provider via the factory.
 */

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { getBillingProvider, isBillingConfigured } from "@/lib/billing/factory";
import { isValidPlanId, isPaidPlan } from "@/config/plans";
import { env } from "@/lib/env";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // Check if billing is configured
    if (!isBillingConfigured()) {
      return NextResponse.json(
        { error: "Billing is not configured on this server" },
        { status: 503 }
      );
    }

    // Authenticate user
    const { userId: clerkUserId } = await auth();

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

    // Check if user is trying to subscribe to free plan
    if (!isPaidPlan(planId)) {
      return NextResponse.json(
        { error: "Cannot checkout for free plan" },
        { status: 400 }
      );
    }

    // Check if user already has an active PAID subscription
    // Free tier users (planId === "free") should be allowed to upgrade
    if (
      user.subscriptionId &&
      user.subscriptionStatus === "active" &&
      !user.cancelAtPeriodEnd &&
      user.planId !== "free" &&
      isPaidPlan(user.planId)
    ) {
      return NextResponse.json(
        {
          error:
            "You already have an active subscription. Please cancel or update your existing subscription.",
        },
        { status: 400 }
      );
    }

    // Get billing provider
    const provider = getBillingProvider();

    // Determine success and cancel URLs
    const appUrl = env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) {
      console.error("[Billing] NEXT_PUBLIC_APP_URL is not configured");
      return NextResponse.json(
        { error: "Server configuration error: Missing app URL" },
        { status: 500 }
      );
    }

    const successUrl = `${appUrl}/dashboard/billing?success=true&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${appUrl}/pricing?canceled=true`;

    // Create checkout session
    const checkoutSession = await provider.createCheckoutSession({
      planId,
      interval,
      userId: user.id,
      userEmail: user.email,
      successUrl,
      cancelUrl,
      metadata: {
        userId: user.id,
        clerkUserId: user.clerkUserId || "",
        planId,
        interval,
      },
    });

    // Return checkout URL
    return NextResponse.json({
      status: "success",
      data: {
        url: checkoutSession.url,
        sessionId: checkoutSession.sessionId,
      },
    });
  } catch (error) {
    console.error("[Billing] Checkout error:", error);

    return NextResponse.json(
      {
        status: "error",
        error:
          error instanceof Error ? error.message : "Failed to create checkout session",
      },
      { status: 500 }
    );
  }
}
