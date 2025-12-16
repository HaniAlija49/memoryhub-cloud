/**
 * Centralized plan configuration
 *
 * Define plans once with features, limits, and pricing.
 * Map to provider-specific product IDs for easy provider switching.
 */

import type { BillingInterval } from "../lib/billing/types";

// ============================================================================
// Plan Feature Limits
// ============================================================================

export interface PlanLimits {
  apiCallsPerMonth: number;
  maxMemories: number;
  maxMemorySize: number; // in bytes
  rateLimit: {
    requestsPerMinute: number;
    requestsPerDay: number;
  };
}

// ============================================================================
// Plan Metadata
// ============================================================================

export interface PlanMetadata {
  id: string;
  name: string;
  description: string;
  limits: PlanLimits;
  pricing: {
    monthly: number; // in cents
    yearly: number; // in cents
  };
  features: string[];
  recommended?: boolean;
  providers: {
    dodo?: {
      test?: {
        monthly?: string; // Dodo test product ID for monthly billing
        yearly?: string; // Dodo test product ID for yearly billing
      };
      live?: {
        monthly?: string; // Dodo live product ID for monthly billing
        yearly?: string; // Dodo live product ID for yearly billing
      };
    };
    stripe?: {
      test?: {
        monthly?: string; // Stripe test price ID for monthly billing
        yearly?: string; // Stripe test price ID for yearly billing
      };
      live?: {
        monthly?: string; // Stripe live price ID for monthly billing
        yearly?: string; // Stripe live price ID for yearly billing
      };
    };
  };
}

// ============================================================================
// Plan Definitions
// ============================================================================

export const PLANS: Record<string, PlanMetadata> = {
  free: {
    id: "free",
    name: "Hobby",
    description: "For solo devs testing agents",
    limits: {
      apiCallsPerMonth: 5_000,
      maxMemories: 500,
      maxMemorySize: 50 * 1024, // 50 KB per memory
      rateLimit: {
        requestsPerMinute: 10,
        requestsPerDay: 1_000,
      },
    },
    pricing: {
      monthly: 0,
      yearly: 0,
    },
    features: [
      "5,000 API calls/month",
      "500 memories",
      "50 KB per memory",
      "Community support only",
      "Basic analytics",
    ],
    providers: {
      // Free plan has no provider products
    },
  },

  starter: {
    id: "starter",
    name: "Builder",
    description: "For side projects and small apps",
    limits: {
      apiCallsPerMonth: 50_000,
      maxMemories: 2_500,
      maxMemorySize: 100 * 1024, // 100 KB per memory
      rateLimit: {
        requestsPerMinute: 50,
        requestsPerDay: 10_000,
      },
    },
    pricing: {
      monthly: 500, // $5.00
      yearly: 5_000, // $50.00 (17% discount)
    },
    features: [
      "50,000 API calls/month",
      "2,500 memories",
      "100 KB per memory",
      "Email support (best-effort)",
      "Basic analytics",
      "99% uptime SLA",
    ],
    providers: {
      dodo: {
        test: {
          monthly: "pdt_LEfuxMLpqXftMdl2jXL4d",
          yearly: "pdt_hqU4rsdHUNC1WQXu8zv84",
        },
        live: {
          monthly: "", // TODO: Add live product ID from Dodo dashboard
          yearly: "", // TODO: Add live product ID from Dodo dashboard
        },
      },
      // stripe: {
      //   test: {
      //     monthly: "price_xxx",
      //     yearly: "price_yyy",
      //   },
      //   live: {
      //     monthly: "price_xxx",
      //     yearly: "price_yyy",
      //   },
      // },
    },
  },

  pro: {
    id: "pro",
    name: "RAG Apps",
    description: "For apps indexing docs & knowledge",
    limits: {
      apiCallsPerMonth: 500_000,
      maxMemories: 25_000,
      maxMemorySize: 200 * 1024, // 200 KB per memory
      rateLimit: {
        requestsPerMinute: 200,
        requestsPerDay: 100_000,
      },
    },
    pricing: {
      monthly: 1_200, // $12.00
      yearly: 12_000, // $120.00 (17% discount)
    },
    features: [
      "500,000 API calls/month",
      "25,000 memories",
      "200 KB per memory",
      "Priority email support (24-48h)",
      "Advanced analytics",
      "99.9% uptime SLA",
    ],
    recommended: true,
    providers: {
      dodo: {
        test: {
          monthly: "pdt_vHY6aM1pRkyaWlOpa7jXm",
          yearly: "pdt_6t2RgwiZIj66AhODVInwa",
        },
        live: {
          monthly: "", // TODO: Add live product ID from Dodo dashboard
          yearly: "", // TODO: Add live product ID from Dodo dashboard
        },
      },
    },
  },

  premium: {
    id: "premium",
    name: "Team / Scale",
    description: "For teams and heavy workloads",
    limits: {
      apiCallsPerMonth: 2_000_000,
      maxMemories: 100_000,
      maxMemorySize: 500 * 1024, // 500 KB per memory
      rateLimit: {
        requestsPerMinute: 1000,
        requestsPerDay: 500_000,
      },
    },
    pricing: {
      monthly: 2_900, // $29.00
      yearly: 29_000, // $290.00 (17% discount)
    },
    features: [
      "2,000,000 API calls/month",
      "100,000 memories",
      "500 KB per memory",
      "Priority support + SLA",
      "Advanced analytics",
      "99.9% uptime guaranteed",
    ],
    providers: {
      dodo: {
        test: {
          monthly: "pdt_gVSrgAFcOWaErAvdQglFr",
          yearly: "pdt_NUWmE7JuWEo4TUykkaic4",
        },
        live: {
          monthly: "", // TODO: Add live product ID from Dodo dashboard
          yearly: "", // TODO: Add live product ID from Dodo dashboard
        },
      },
    },
  },
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get plan by ID
 */
export function getPlan(planId: string): PlanMetadata | undefined {
  return PLANS[planId];
}

/**
 * Get provider product ID for a plan and interval
 */
export function getProviderProductId(
  planId: string,
  provider: string,
  interval: BillingInterval,
  mode?: "test" | "live"
): string | undefined {
  const plan = PLANS[planId];
  if (!plan) return undefined;

  const providerConfig = plan.providers[provider as keyof typeof plan.providers];
  if (!providerConfig) return undefined;

  // If mode is specified, use mode-specific product ID
  if (mode && typeof providerConfig === 'object' && mode in providerConfig) {
    const modeConfig = providerConfig[mode as keyof typeof providerConfig];
    if (modeConfig && typeof modeConfig === 'object') {
      return modeConfig[interval];
    }
  }

  // Fallback: if no mode specified or mode not found, try direct access (backward compatibility)
  if (typeof providerConfig === 'object' && interval in providerConfig) {
    return (providerConfig as any)[interval];
  }

  return undefined;
}

/**
 * Get plan ID from provider product ID
 * Searches across both test and live product IDs
 */
export function getPlanIdFromProductId(
  provider: string,
  productId: string
): { planId: string; interval: BillingInterval } | undefined {
  for (const [planId, plan] of Object.entries(PLANS)) {
    const providerConfig = plan.providers[provider as keyof typeof plan.providers];
    if (!providerConfig) continue;

    // Check if providerConfig has test/live structure
    if (typeof providerConfig === 'object') {
      // Check test mode products
      if ('test' in providerConfig && providerConfig.test) {
        if (providerConfig.test.monthly === productId) {
          return { planId, interval: "monthly" };
        }
        if (providerConfig.test.yearly === productId) {
          return { planId, interval: "yearly" };
        }
      }

      // Check live mode products
      if ('live' in providerConfig && providerConfig.live) {
        if (providerConfig.live.monthly === productId) {
          return { planId, interval: "monthly" };
        }
        if (providerConfig.live.yearly === productId) {
          return { planId, interval: "yearly" };
        }
      }

      // Backward compatibility: check direct monthly/yearly properties
      if ('monthly' in providerConfig && (providerConfig as any).monthly === productId) {
        return { planId, interval: "monthly" };
      }
      if ('yearly' in providerConfig && (providerConfig as any).yearly === productId) {
        return { planId, interval: "yearly" };
      }
    }
  }
  return undefined;
}

/**
 * Get all plan IDs
 */
export function getAllPlanIds(): string[] {
  return Object.keys(PLANS);
}

/**
 * Validate if a plan ID is valid
 */
export function isValidPlanId(planId: string): boolean {
  return planId in PLANS;
}

/**
 * Check if a plan is paid
 */
export function isPaidPlan(planId: string): boolean {
  const plan = PLANS[planId];
  return plan ? plan.pricing.monthly > 0 || plan.pricing.yearly > 0 : false;
}
