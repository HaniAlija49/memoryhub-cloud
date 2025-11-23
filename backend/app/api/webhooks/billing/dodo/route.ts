/**
 * Dodo Payments Webhook Endpoint
 *
 * Receives and processes webhook events from Dodo Payments.
 * Verifies signature, normalizes events, and routes to business logic handlers.
 */

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getBillingProvider } from "@/lib/billing/factory";
import { handleBillingEvent } from "@/lib/billing/events";
import { env } from "@/lib/env";

export async function POST(request: Request) {
  try {
    console.log("[Webhook] Received Dodo webhook request");

    // Get webhook secret
    const webhookSecret = env.DODO_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("[Webhook] DODO_WEBHOOK_SECRET not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    console.log("[Webhook] Webhook secret is configured");

    // Get raw body for signature verification
    const rawBody = await request.text();
    console.log("[Webhook] Received payload length:", rawBody.length);

    // Get webhook headers
    const headersList = await headers();
    const webhookId = headersList.get("webhook-id");
    const webhookSignature = headersList.get("webhook-signature");
    const webhookTimestamp = headersList.get("webhook-timestamp");

    console.log("[Webhook] Headers:", {
      webhookId,
      hasSignature: !!webhookSignature,
      webhookTimestamp,
    });

    // Validate required headers
    if (!webhookId || !webhookSignature || !webhookTimestamp) {
      console.error("[Webhook] Missing required webhook headers");
      return NextResponse.json(
        { error: "Missing webhook headers" },
        { status: 400 }
      );
    }

    // Construct Standard Webhooks compatible headers object
    const whHeaders = {
      "webhook-id": webhookId,
      "webhook-signature": webhookSignature,
      "webhook-timestamp": webhookTimestamp,
    };

    // Get provider and verify webhook
    const provider = getBillingProvider();

    let billingEvent;
    try {
      console.log("[Webhook] Attempting to verify signature...");
      // Verify webhook signature and normalize event
      // Pass the headers object directly (Standard Webhooks spec)
      billingEvent = await provider.verifyWebhook(
        rawBody,
        whHeaders,
        webhookSecret
      );
      console.log("[Webhook] Signature verified successfully");
    } catch (error) {
      console.error(
        "[Webhook] Signature verification failed:",
        error instanceof Error ? error.message : String(error)
      );
      console.error("[Webhook] Error stack:", error instanceof Error ? error.stack : "");
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    // Log the event
    console.log(
      `[Webhook] Received ${billingEvent.type} event from ${billingEvent.provider}`
    );

    // Handle the event using provider-agnostic business logic
    try {
      await handleBillingEvent(billingEvent);
    } catch (error) {
      // Log error but still return 200 to prevent retries
      // The webhook delivery should succeed even if our processing fails
      console.error(
        "[Webhook] Error processing event:",
        error instanceof Error ? error.message : String(error)
      );

      // For critical errors, you might want to send alerts here
      // TODO: Send alert to monitoring system (e.g., Highlight.io)
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(
      "[Webhook] Unexpected error:",
      error instanceof Error ? error.message : String(error)
    );

    // Return 500 for unexpected errors
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
