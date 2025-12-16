import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * POST /api/internal/events
 *
 * Internal endpoint for tracking user analytics events.
 * Called by frontend analytics.ts to store events in usage_events table.
 *
 * This endpoint:
 * - Requires authentication
 * - Only works if OBSERVABILITY_ENABLED=true
 * - Stores events for analytics and debugging
 * - Never blocks the UI (fire-and-forget from client)
 */
export async function POST(request: NextRequest) {
  try {
    // Check if observability is enabled
    if (process.env.OBSERVABILITY_ENABLED !== 'true') {
      return NextResponse.json(
        { error: 'Observability is disabled' },
        { status: 403 }
      );
    }

    // Verify user is authenticated
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { event } = body;

    if (!event || typeof event !== 'string') {
      return NextResponse.json(
        { error: 'Invalid event data' },
        { status: 400 }
      );
    }

    // Store event in database
    await prisma.usageEvent.create({
      data: {
        userId,
        event,
      },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error tracking event:', error);

    // Return success even on error to avoid breaking UI
    // Analytics should be fire-and-forget
    return NextResponse.json({ success: true });
  }
}
