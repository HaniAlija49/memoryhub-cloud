import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

/**
 * POST /api/internal/events
 *
 * Internal endpoint for tracking user analytics events.
 * Called by frontend analytics.ts to log events.
 *
 * This endpoint:
 * - Requires authentication
 * - Only works if OBSERVABILITY_ENABLED=true
 * - Sends events to backend API for storage
 * - Never blocks the UI (fire-and-forget from client)
 */
export async function POST(request: NextRequest) {
  try {
    // Check if observability is enabled
    if (process.env.NEXT_PUBLIC_OBSERVABILITY_ENABLED !== 'true') {
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

    // Forward event to backend API
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

    try {
      await fetch(`${backendUrl}/api/internal/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, event }),
      });
    } catch (backendError) {
      // Silently fail if backend is unreachable
      console.warn('Failed to send event to backend:', backendError);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error tracking event:', error);

    // Return success even on error to avoid breaking UI
    // Analytics should be fire-and-forget
    return NextResponse.json({ success: true });
  }
}
