/**
 * Customer Portal API Endpoint
 *
 * Redirects users to the billing provider's customer portal
 * where they can manage subscription, payment methods, and view invoices.
 */

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getBillingProvider, isBillingConfigured } from "@/lib/billing/factory";
import { env } from "@/lib/env";
import { authenticateRequest } from "@/lib/clerk-auth-helper";

const prisma = new PrismaClient();

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
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has a billing customer ID
    if (!user.billingCustomerId) {
      return NextResponse.json(
        { error: "No billing customer found. Please subscribe to a plan first." },
        { status: 400 }
      );
    }

    // Get billing provider
    const provider = getBillingProvider();

    // Determine return URL - use request headers if env var not set
    let appUrl = env.NEXT_PUBLIC_APP_URL;

    if (!appUrl) {
      // Fallback to request origin in production
      const url = new URL(request.url);
      appUrl = `${url.protocol}//${url.host}`;
      console.log(`[Billing] NEXT_PUBLIC_APP_URL not set, using request origin: ${appUrl}`);
    }

    const returnUrl = `${appUrl}/dashboard/billing`;

    // Create portal session
    console.log(`[Billing] Creating portal session for customer ${user.billingCustomerId}`);
    console.log(`[Billing] Return URL: ${returnUrl}`);

    const portalSession = await provider.createPortalSession({
      customerId: user.billingCustomerId,
      returnUrl,
    });

    console.log(`[Billing] Portal session response:`, portalSession);

    if (!portalSession?.url) {
      throw new Error(`Portal session URL is missing or invalid: ${JSON.stringify(portalSession)}`);
    }

    console.log(`[Billing] Redirecting to portal: ${portalSession.url}`);

    // Redirect to portal
    return NextResponse.redirect(portalSession.url);
  } catch (error) {
    console.error("[Billing] Portal error:", error);

    return NextResponse.json(
      {
        status: "error",
        error:
          error instanceof Error
            ? error.message
            : "Failed to create portal session",
      },
      { status: 500 }
    );
  }
}
