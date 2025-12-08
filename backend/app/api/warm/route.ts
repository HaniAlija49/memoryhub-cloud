import { NextResponse } from 'next/server'
import { generateEmbedding } from '@/lib/embeddings'

// Force dynamic rendering (don't pre-render during build)
export const dynamic = 'force-dynamic'

/**
 * Model Warming Endpoint
 *
 * This endpoint preloads the embedding model to avoid cold start delays.
 * Should be called:
 * 1. On deployment (via Vercel cron or post-deploy hook)
 * 2. Periodically to keep model in memory (every 4-5 minutes)
 *
 * Can be triggered via:
 * - Vercel Cron Job (requires Pro plan)
 * - External cron service (e.g., cron-job.org, EasyCron)
 * - API call from your monitoring service
 */
export async function GET(request: Request) {
  try {
    // Security: Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const startTime = Date.now()

    // Generate a dummy embedding to load the model
    await generateEmbedding('warming up the model')

    const duration = Date.now() - startTime

    return NextResponse.json({
      status: 'warm',
      message: 'Model loaded successfully',
      durationMs: duration,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Model warming failed:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to warm model',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
