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
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Track processed webhook IDs to prevent duplicate processing
const processedWebhooks = new Map<string, number>();

// Clean up old webhook IDs (older than 24 hours)
setInterval(() => {
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  for (const [id, timestamp] of processedWebhooks.entries()) {
    if (timestamp < oneDayAgo) {
      processedWebhooks.delete(id);
    }
  }
}, 60 * 60 * 1000); // Run every hour

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
    console.log("[Webhook] Secret length:", webhookSecret.length);
    console.log("[Webhook] Secret prefix:", webhookSecret.substring(0, 10) + "...");

    // Get raw body for signature verification
    const rawBody = await request.text();
    console.log("[Webhook] Received payload length:", rawBody.length);

    // Get webhook headers - Note: Next.js headers() returns lowercase keys
    const headersList = await headers();
    const webhookId = headersList.get("webhook-id");
    const webhookSignature = headersList.get("webhook-signature");
    const webhookTimestamp = headersList.get("webhook-timestamp");

    console.log("[Webhook] Headers:", {
      webhookId,
      webhookSignature: webhookSignature ? `${webhookSignature.substring(0, 20)}...` : null,
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

    // Check if we've already processed this webhook (idempotency)
    if (processedWebhooks.has(webhookId)) {
      console.log(`[Webhook] Already processed webhook ${webhookId}, returning success`);
      return NextResponse.json({ received: true, note: "Already processed" });
    }

    // Construct Standard Webhooks compatible headers object
    const whHeaders = {
      "webhook-id": webhookId,
      "webhook-signature": webhookSignature,
      "webhook-timestamp": webhookTimestamp,
    };

    // Get provider and verify webhook
    const provider = getBillingProvider();

    // Parse the payload to log it
    let parsedPayload;
    try {
      parsedPayload = JSON.parse(rawBody);
      console.log("[Webhook] Parsed payload:", JSON.stringify(parsedPayload, null, 2));
    } catch (e) {
      console.error("[Webhook] Failed to parse payload for logging");
    }

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
      console.log("[Webhook] Normalized event:", JSON.stringify(billingEvent, null, 2));
    } catch (error) {
      console.error(
        "[Webhook] Signature verification failed:",
        error instanceof Error ? error.message : String(error)
      );
      console.error("[Webhook] Error stack:", error instanceof Error ? error.stack : "");
      console.error("[Webhook] Raw body length:", rawBody.length);
      console.error("[Webhook] Headers:", JSON.stringify(whHeaders));

      // For debugging: log first/last 100 chars of body
      console.error("[Webhook] Body preview:", rawBody.substring(0, 100), "...", rawBody.substring(rawBody.length - 100));

      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    // Log the event
    console.log(
      `[Webhook] Received ${billingEvent.type} event from ${billingEvent.provider}`
    );

    // Mark webhook as processed
    processedWebhooks.set(webhookId, Date.now());

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
      console.error("[Webhook] Event processing stack:", error instanceof Error ? error.stack : "");

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
