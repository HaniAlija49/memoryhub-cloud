/**
 * Usage Quota Enforcement
 *
 * Provider-agnostic quota checking and tracking.
 * Enforces plan limits for API calls and memory storage.
 */

import { PrismaClient } from "@prisma/client";
import { getPlan } from "@/config/plans";

const prisma = new PrismaClient();

/**
 * Resource types that can be quota-limited
 */
export type QuotaResource = "api_call" | "memory";

/**
 * Result of a quota check
 */
export interface QuotaCheckResult {
  allowed: boolean;
  reason?: string;
  usage?: {
    current: number;
    limit: number;
    percentage: number;
  };
}

/**
 * Get current period in YYYY-MM format
 */
function getCurrentPeriod(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

/**
 * Check if a user can perform an action based on their quota
 */
export async function checkQuota(
  userId: string,
  resource: QuotaResource
): Promise<QuotaCheckResult> {
  try {
    // Get user with their plan
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        usageRecords: {
          where: {
            period: getCurrentPeriod(),
          },
        },
      },
    });

    if (!user) {
      return {
        allowed: false,
        reason: "User not found",
      };
    }

    // Get plan limits
    const plan = getPlan(user.planId);

    if (!plan) {
      return {
        allowed: false,
        reason: "Invalid plan",
      };
    }

    // Check quota based on resource type
    switch (resource) {
      case "api_call": {
        const currentUsage = user.usageRecords[0];
        const apiCallsUsed = currentUsage?.apiCalls || 0;
        const limit = plan.limits.apiCallsPerMonth;

        if (apiCallsUsed >= limit) {
          return {
            allowed: false,
            reason: "API call quota exceeded for this month",
            usage: {
              current: apiCallsUsed,
              limit,
              percentage: 100,
            },
          };
        }

        return {
          allowed: true,
          usage: {
            current: apiCallsUsed,
            limit,
            percentage: Math.round((apiCallsUsed / limit) * 100),
          },
        };
      }

      case "memory": {
        const memoriesCount = await prisma.memory.count({
          where: { userId },
        });
        const limit = plan.limits.maxMemories;

        if (memoriesCount >= limit) {
          return {
            allowed: false,
            reason: "Memory storage quota exceeded",
            usage: {
              current: memoriesCount,
              limit,
              percentage: 100,
            },
          };
        }

        return {
          allowed: true,
          usage: {
            current: memoriesCount,
            limit,
            percentage: Math.round((memoriesCount / limit) * 100),
          },
        };
      }

      default:
        return {
          allowed: false,
          reason: "Unknown resource type",
        };
    }
  } catch (error) {
    console.error("[Quota] Error checking quota:", error);

    // On error, allow the request (fail open) but log the error
    return {
      allowed: true,
      reason: "Quota check failed - allowing request",
    };
  }
}

/**
 * Track API call usage for a user
 */
export async function trackApiCall(userId: string): Promise<void> {
  try {
    const period = getCurrentPeriod();

    // Upsert usage record
    await prisma.usageRecord.upsert({
      where: {
        userId_period: {
          userId,
          period,
        },
      },
      create: {
        userId,
        period,
        apiCalls: 1,
      },
      update: {
        apiCalls: {
          increment: 1,
        },
      },
    });
  } catch (error) {
    // Don't throw - just log. We don't want usage tracking failures to break requests.
    console.error("[Quota] Error tracking API call:", error);
  }
}

/**
 * Get current usage for a user
 */
export async function getUsage(userId: string): Promise<{
  apiCalls: number;
  memories: number;
  period: string;
}> {
  const period = getCurrentPeriod();

  const [usageRecord, memoriesCount] = await Promise.all([
    prisma.usageRecord.findUnique({
      where: {
        userId_period: {
          userId,
          period,
        },
      },
    }),
    prisma.memory.count({
      where: { userId },
    }),
  ]);

  return {
    apiCalls: usageRecord?.apiCalls || 0,
    memories: memoriesCount,
    period,
  };
}

/**
 * Check if user has enough quota and track usage in a single operation
 * This is the recommended way to enforce quotas
 */
export async function checkAndTrackQuota(
  userId: string,
  resource: QuotaResource
): Promise<QuotaCheckResult> {
  const result = await checkQuota(userId, resource);

  // If allowed and it's an API call, track it
  if (result.allowed && resource === "api_call") {
    // Track asynchronously (don't await) to not slow down the request
    trackApiCall(userId).catch((error) => {
      console.error("[Quota] Error tracking quota:", error);
    });
  }

  return result;
}

/**
 * Middleware-friendly quota checker
 * Returns null if quota is OK, or error response if quota exceeded
 */
export async function enforceQuota(
  userId: string,
  resource: QuotaResource
): Promise<{ status: number; error: string; usage?: any } | null> {
  const result = await checkAndTrackQuota(userId, resource);

  if (!result.allowed) {
    return {
      status: 429, // Too Many Requests
      error: result.reason || "Quota exceeded",
      usage: result.usage,
    };
  }

  return null;
}
