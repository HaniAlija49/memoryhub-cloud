/**
 * Cron Job: Expire Subscriptions
 *
 * This endpoint checks for subscriptions that have been cancelled
 * and have passed their period end date, then downgrades them to free.
 *
 * Should be called daily via a cron service (Vercel Cron, cron-job.org, etc.)
 */

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[Cron] Starting subscription expiration check...");

    // Find users with:
    // - cancelAtPeriodEnd = true
    // - currentPeriodEnd < now
    // - subscriptionStatus = "canceled"
    const now = new Date();
    const expiredUsers = await prisma.user.findMany({
      where: {
        cancelAtPeriodEnd: true,
        currentPeriodEnd: {
          lt: now,
        },
        subscriptionStatus: "canceled",
        planId: {
          not: "free",
        },
      },
    });

    console.log(`[Cron] Found ${expiredUsers.length} expired subscriptions`);

    // Downgrade each user to free plan
    const results = [];
    for (const user of expiredUsers) {
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            planId: "free",
            subscriptionStatus: null,
            subscriptionId: null,
            cancelAtPeriodEnd: false,
            currentPeriodEnd: null,
            billingInterval: null,
          },
        });

        console.log(
          `[Cron] Downgraded user ${user.id} (${user.email}) to free plan`
        );
        results.push({
          userId: user.id,
          email: user.email,
          status: "downgraded",
        });

        // TODO: Send email notification about downgrade
      } catch (error) {
        console.error(
          `[Cron] Error downgrading user ${user.id}:`,
          error instanceof Error ? error.message : String(error)
        );
        results.push({
          userId: user.id,
          email: user.email,
          status: "error",
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return NextResponse.json({
      status: "success",
      processed: expiredUsers.length,
      results,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error(
      "[Cron] Unexpected error:",
      error instanceof Error ? error.message : String(error)
    );

    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
