import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/ratelimit';
import { isValidEvent, PersistQEvent } from '@/lib/analytics/events';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user (Clerk or API key)
    const { user } = await authenticate(request);

    // Parse and validate request body
    const body = await request.json().catch(() => ({}));
    const { event } = body;
    
    if (!event || typeof event !== 'string') {
      return NextResponse.json(
        { error: 'Event name is required' },
        { status: 400 }
      );
    }

    // Validate against allowed events
    if (!isValidEvent(event)) {
      return NextResponse.json(
        { error: 'Invalid event name' },
        { status: 400 }
      );
    }

    // Check rate limiting for events (100 events per minute)
    const rateLimitResult = await checkRateLimit(user.id);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Too many events',
          resetAfter: rateLimitResult.reset
        },
        { status: 429 }
      );
    }

    // Store the event
    await prisma.usageEvent.create({
      data: {
        userId: user.id,
        event,
      },
    });

    // Return 204 No Content on success
    return new NextResponse(null, { status: 204 });

  } catch (error) {
    // Log error but don't expose details to client
    console.error('Events API error:', error);
    
    // Don't block user flow - return 204 even on failure
    // This ensures analytics never breaks the main app
    return new NextResponse(null, { status: 204 });
  }
}