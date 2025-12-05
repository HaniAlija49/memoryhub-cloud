/**
 * Webhook Cleanup Cron Job
 *
 * Deletes expired webhook events from the database to prevent unbounded growth.
 * Should be run periodically (e.g., daily via a cron service).
 */

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log("[Cron] Starting webhook cleanup...");

    // Delete webhook events older than their expiration date
    const result = await prisma.webhookEvent.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    console.log(`[Cron] Cleaned up ${result.count} expired webhook events`);

    return NextResponse.json({
      success: true,
      deleted: result.count,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Cron] Webhook cleanup error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Cleanup failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
