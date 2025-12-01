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

    return response.json();
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
    const response = await this.request<{ url: string }>(
      `/customers/${params.customerId}/customer-portal/session`,
      {
        method: "POST",
        body: JSON.stringify({
          return_url: params.returnUrl,
        }),
      }
    );

    return { url: response.url };
  }

  async getSubscription(
    subscriptionId: string
  ): Promise<{
    id: string;
    customer_id: string;
    product_id: string;
    status: string;
    current_period_start: number;
    current_period_end: number;
    cancel_at_period_end: boolean;
    billing_interval: string;
    amount: number;
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
    // Use PATCH on the subscription endpoint to update the product
    return this.request(`/subscriptions/${subscriptionId}`, {
      method: "PATCH",
      body: JSON.stringify({
        product_id: newProductId,
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

    // Map Dodo product ID back to our plan ID
    const planInfo = getPlanIdFromProductId("dodo", sub.product_id);

    return {
      id: sub.id,
      customerId: sub.customer_id,
      planId: planInfo?.planId || "free",
      status: this.normalizeDodoStatus(sub.status),
      currentPeriodStart: new Date(sub.current_period_start * 1000),
      currentPeriodEnd: new Date(sub.current_period_end * 1000),
      cancelAtPeriodEnd: sub.cancel_at_period_end,
      interval: (planInfo?.interval || "monthly") as "monthly" | "yearly",
      amount: sub.amount,
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

    await this.client.updateSubscription(subscriptionId, newProductId);
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

      // Verify signature - this will throw if invalid
      await webhook.verify(rawPayload, headers as any);

      // Parse the event
      const event = JSON.parse(rawPayload);

      // Normalize the event to our standard format
      return this.normalizeDodoEvent(event);
    } catch (error) {
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

    // Parse dates - they could be ISO strings or timestamps
    const parseDate = (dateValue: any): Date => {
      if (!dateValue) return new Date();
      if (typeof dateValue === 'string') return new Date(dateValue);
      if (typeof dateValue === 'number') return new Date(dateValue * 1000);
      return new Date();
    };

    // Extract subscription ID - it might be subscription_id, id, or we generate a fallback
    const subscriptionId = dodoSub.subscription_id || dodoSub.id || `sub_${dodoSub.customer?.customer_id}_${Date.now()}`;

    return {
      id: subscriptionId,
      customerId: dodoSub.customer?.customer_id || dodoSub.customer_id,
      planId: planInfo?.planId || "free",
      status: this.normalizeDodoStatus(dodoSub.status),
      currentPeriodStart: parseDate(dodoSub.previous_billing_date || dodoSub.current_period_start),
      currentPeriodEnd: parseDate(dodoSub.next_billing_date || dodoSub.current_period_end),
      cancelAtPeriodEnd: dodoSub.cancel_at_next_billing_date || dodoSub.cancel_at_period_end || false,
      interval: (planInfo?.interval || "monthly") as "monthly" | "yearly",
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
