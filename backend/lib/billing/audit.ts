/**
 * Billing Audit Log Utility
 *
 * Provides helper functions for logging billing events to the audit trail.
 * Supports both standalone and transaction-based logging.
 */

import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export interface LogBillingEventOptions {
  ipAddress?: string;
  userAgent?: string;
  errorId?: string;
  tx?: Prisma.TransactionClient; // Support transaction context
}

/**
 * Log a billing event to the audit trail
 *
 * @param userId - The user ID associated with the event
 * @param eventType - The type of billing event (e.g., "subscription.created")
 * @param eventData - The event data to log
 * @param options - Optional parameters like IP address, user agent, error ID, or transaction client
 */
export async function logBillingEvent(
  userId: string,
  eventType: string,
  eventData: Record<string, any>,
  options?: LogBillingEventOptions
): Promise<void> {
  const client = options?.tx || prisma;

  await client.billingAuditLog.create({
    data: {
      userId,
      eventType,
      eventData,
      ipAddress: options?.ipAddress,
      userAgent: options?.userAgent,
      errorId: options?.errorId,
    },
  });
}

/**
 * Get audit logs for a specific user
 *
 * @param userId - The user ID to fetch logs for
 * @param limit - Maximum number of logs to return (default: 50)
 */
export async function getUserAuditLogs(
  userId: string,
  limit: number = 50
) {
  return prisma.billingAuditLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

/**
 * Get audit logs for a specific event type
 *
 * @param eventType - The event type to filter by
 * @param limit - Maximum number of logs to return (default: 100)
 */
export async function getAuditLogsByEventType(
  eventType: string,
  limit: number = 100
) {
  return prisma.billingAuditLog.findMany({
    where: { eventType },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });
}

/**
 * Get audit log by error ID
 *
 * @param errorId - The error ID to search for
 */
export async function getAuditLogByErrorId(errorId: string) {
  return prisma.billingAuditLog.findFirst({
    where: { errorId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          planId: true,
        },
      },
    },
  });
}
