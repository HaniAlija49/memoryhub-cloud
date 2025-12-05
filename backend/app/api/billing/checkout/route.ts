/**
 * Checkout API Endpoint
 *
 * Creates a checkout session for subscribing to a paid plan.
 * Provider-agnostic - works with any billing provider via the factory.
 */

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getBillingProvider, isBillingConfigured } from "@/lib/billing/factory";
import { isValidPlanId, isPaidPlan } from "@/config/plans";
import { env } from "@/lib/env";
import { authenticateRequest } from "@/lib/clerk-auth-helper";
import { checkBillingRateLimit } from "@/lib/billing/ratelimit";
import { CheckoutSessionSchema, formatValidationErrors } from "@/lib/billing/validation";
import { createGenericErrorResponse } from "@/lib/billing/errors";
import { z } from "zod";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  let user: { id: string; clerkUserId: string | null; email: string; subscriptionId: string | null; subscriptionStatus: string | null; cancelAtPeriodEnd: boolean; planId: string } | null = null;

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

    // Parse and validate request body
    const body = await request.json();

    let validatedInput;
    try {
      validatedInput = CheckoutSessionSchema.parse(body);
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
    let appUrl = env.NEXT_PUBLIC_APP_URL;

    if (!appUrl) {
      // Fallback: try to detect frontend URL from Referer header
      const referer = request.headers.get("referer");
      if (referer) {
        const refererUrl = new URL(referer);
        appUrl = `${refererUrl.protocol}//${refererUrl.host}`;
        console.log(`[Billing] NEXT_PUBLIC_APP_URL not set, using referer: ${appUrl}`);
      } else {
        console.error("[Billing] NEXT_PUBLIC_APP_URL is not configured and no referer header");
        return NextResponse.json(
          { error: "Server configuration error: Missing app URL" },
          { status: 500 }
        );
      }
    }

    // Dodo automatically appends subscription_id and status to the return URL
    const successUrl = `${appUrl}/dashboard/billing?success=true`;
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
    const errorResponse = createGenericErrorResponse(error, user?.id, "checkout");

    return NextResponse.json(
      {
        status: "error",
        ...errorResponse,
      },
      { status: 500 }
    );
  }
}
