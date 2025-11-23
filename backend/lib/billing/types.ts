/**
 * Provider-agnostic billing types and interfaces
 *
 * This abstraction layer allows switching between payment providers
 * (Dodo, Stripe, etc.) without changing business logic or API contracts.
 */

// ============================================================================
// Normalized Event Types
// ============================================================================

export type BillingEventType =
  | "subscription.created"
  | "subscription.updated"
  | "subscription.canceled"
  | "subscription.paused"
  | "subscription.resumed"
  | "payment.succeeded"
  | "payment.failed"
  | "payment.refunded"
  | "customer.updated"
  | "customer.deleted";

export interface BillingEvent {
  type: BillingEventType;
  provider: string;
  customerId: string;
  subscriptionId?: string;
  data: SubscriptionData | PaymentData | CustomerData;
  timestamp: Date;
  rawEvent?: any; // Original provider event for debugging
}

// ============================================================================
// Subscription Types
// ============================================================================

export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "paused"
  | "incomplete"
  | "incomplete_expired";

export type BillingInterval = "monthly" | "yearly";

export interface SubscriptionData {
  id: string;
  customerId: string;
  planId: string; // Our internal plan ID (free, starter, pro, premium)
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  interval: BillingInterval;
  amount: number; // in cents
  currency: string;
}

// ============================================================================
// Payment Types
// ============================================================================

export interface PaymentData {
  id: string;
  customerId: string;
  subscriptionId?: string;
  amount: number; // in cents
  currency: string;
  status: "succeeded" | "failed" | "refunded";
  failureReason?: string;
  createdAt: Date;
}

// ============================================================================
// Customer Types
// ============================================================================

export interface CustomerData {
  id: string;
  email: string;
  name?: string;
  metadata?: Record<string, string>;
}

// ============================================================================
// Checkout Types
// ============================================================================

export interface CreateCheckoutSessionParams {
  planId: string; // Our internal plan ID
  interval: BillingInterval;
  userId: string;
  userEmail: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export interface CheckoutSession {
  url: string;
  sessionId: string;
}

// ============================================================================
// Portal Types
// ============================================================================

export interface CreatePortalSessionParams {
  customerId: string;
  returnUrl: string;
}

export interface PortalSession {
  url: string;
}

// ============================================================================
// Billing Provider Interface
// ============================================================================

export interface IBillingProvider {
  /**
   * Provider name (e.g., "dodo", "stripe")
   */
  readonly name: string;

  /**
   * Create a checkout session for a new subscription
   */
  createCheckoutSession(
    params: CreateCheckoutSessionParams
  ): Promise<CheckoutSession>;

  /**
   * Create a customer portal session for managing subscription
   */
  createPortalSession(
    params: CreatePortalSessionParams
  ): Promise<PortalSession>;

  /**
   * Get subscription details
   */
  getSubscription(subscriptionId: string): Promise<SubscriptionData>;

  /**
   * Cancel a subscription
   * @param immediate If true, cancel immediately. If false, cancel at period end.
   */
  cancelSubscription(
    subscriptionId: string,
    immediate?: boolean
  ): Promise<SubscriptionData>;

  /**
   * Update a subscription (upgrade/downgrade)
   */
  updateSubscription(
    subscriptionId: string,
    newPlanId: string,
    newInterval: BillingInterval
  ): Promise<SubscriptionData>;

  /**
   * Verify webhook signature and parse event
   */
  verifyWebhook(
    payload: string | Buffer,
    headers: Record<string, string>,
    secret: string
  ): Promise<BillingEvent>;
}

// ============================================================================
// Provider Configuration
// ============================================================================

export interface ProviderConfig {
  name: string;
  apiKey: string;
  webhookSecret: string;
  mode: "test" | "live";
}
