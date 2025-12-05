/**
 * Billing Error Handling Utilities
 *
 * Provides functions for generating error IDs and creating generic error responses
 * that don't leak internal system information to users.
 */

import { randomBytes } from "crypto";

/**
 * Generate a unique error ID for tracking
 *
 * @returns A short, unique error ID in format "ERR-XXXXXXXX"
 */
export function generateErrorId(): string {
  const randomId = randomBytes(4).toString("hex").toUpperCase();
  return `ERR-${randomId}`;
}

/**
 * Create a generic error response for users
 *
 * Logs the detailed error internally but returns a safe message to the user.
 * Integrates with monitoring if available.
 *
 * @param error - The error that occurred
 * @param userId - Optional user ID for logging context
 * @param context - Optional context string (e.g., "checkout", "subscription_update")
 * @returns An object with error message and error ID
 */
export function createGenericErrorResponse(
  error: unknown,
  userId?: string,
  context?: string
) {
  const errorId = generateErrorId();

  // Log detailed error internally
  console.error(`[Billing] Error ${errorId}:`, {
    error,
    userId,
    context,
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString(),
  });

  // Send to monitoring if configured
  if (typeof global !== "undefined" && (global as any).monitoring) {
    try {
      (global as any).monitoring.captureException(error, {
        tags: {
          errorId,
          context: context || "billing",
        },
        user: userId ? { id: userId } : undefined,
      });
    } catch (monitoringError) {
      console.error("[Billing] Failed to send error to monitoring:", monitoringError);
    }
  }

  // Return generic message to user
  return {
    error: "Unable to process your request. Please try again or contact support.",
    errorId,
    ...(context && { context }),
  };
}

/**
 * Check if an error is a Prisma unique constraint violation
 *
 * @param error - The error to check
 * @returns True if it's a unique constraint violation
 */
export function isPrismaUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

/**
 * Check if an error is a Prisma record not found error
 *
 * @param error - The error to check
 * @returns True if it's a record not found error
 */
export function isPrismaRecordNotFoundError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2025"
  );
}

/**
 * Check if an error is an optimistic locking conflict
 *
 * @param error - The error to check
 * @returns True if it's an optimistic locking conflict (record not found due to version mismatch)
 */
export function isOptimisticLockingConflict(error: unknown): boolean {
  return isPrismaRecordNotFoundError(error);
}
