import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getClerkUserId } from '@/lib/clerk-auth';
import { checkRateLimit } from '@/lib/ratelimit';
import { sendFeedbackNotification, sendFeedbackConfirmation } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const clerkUserId = await getClerkUserId(request);
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check rate limit (5 requests per minute per user)
    const { success } = await checkRateLimit(`feedback:${clerkUserId}`);
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse request body
    const { content, category = 'feedback' } = await request.json();

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Feedback content is required' },
        { status: 400 }
      );
    }

    // Get user email from Clerk
    const userEmail = clerkUser.emailAddresses?.[0]?.emailAddress || '';

    // Create feedback in database
    const feedback = await prisma.feedback.create({
      data: {
        userId: clerkUserId,
        userEmail: userEmail,
        content: content.trim(),
        category,
        technicalContext: {
          userAgent: request.headers.get('user-agent'),
          ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
          timestamp: new Date(),
        },
      },
    });

    // Send notifications
    const adminResult = await sendFeedbackNotification(feedback.content, {
      email: userEmail,
      id: clerkUserId
    });
    const userResult = await sendFeedbackConfirmation(userEmail, feedback.content);

    console.log('Feedback submitted:', {
      feedbackId: feedback.id,
      userId: clerkUserId,
      adminNotification: adminResult,
      userConfirmation: userResult,
    });

    return NextResponse.json(
      {
        success: true,
        feedbackId: feedback.id,
        message: 'Feedback submitted successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}