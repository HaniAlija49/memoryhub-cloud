import { NextRequest, NextResponse } from 'next/server'
import { authenticate, AuthError } from '@/lib/auth'
import { searchMemories } from '@/lib/search'
import { createErrorResponse, createSuccessResponse } from '@/lib/utils'
import { searchMemorySchema, validateRequest } from '@/lib/validation'
import { withSentryTracing } from '@/app/_utils/app-router-sentry.config'
import { enforceQuota } from '@/lib/billing/quotas'
import * as Sentry from '@sentry/nextjs'

export const POST = withSentryTracing(async function POST(request: NextRequest) {
  try {
    // Authenticate user (supports both Clerk and API key)
    const { user, method } = await authenticate(request)

    // Check API call quota (only track if using API key, not Clerk auth)
    const shouldTrack = method === 'api_key'
    const quotaError = await enforceQuota(user.id, 'api_call', shouldTrack)
    if (quotaError) {
      return NextResponse.json(
        { error: quotaError.error, usage: quotaError.usage },
        { status: quotaError.status }
      )
    }

    // Parse and validate request body
    const body = await request.json()

    const validation = validateRequest(searchMemorySchema, body)
    if (!validation.success) {
      return createErrorResponse(validation.error, 400)
    }

    const { query, limit = 10 } = validation.data

// Search using semantic search
    const results = await searchMemories(user.id, query, limit)

    // Add Sentry breadcrumb for search (only if observability enabled)
    if (process.env.OBSERVABILITY_ENABLED === 'true') {
      Sentry.addBreadcrumb({
        category: 'search',
        message: 'Memory search performed',
        level: 'info',
        data: {
          queryLength: query.length,
          resultCount: results?.length || 0,
          limit,
          authMethod: method,
        }
      });
    }

    return NextResponse.json({
      status: 'success',
      data: results || []
    })

} catch (error) {
    if (error instanceof AuthError) {
      return createErrorResponse(error.message, error.statusCode)
    }
    
    // Add Sentry breadcrumb for search failure (only if observability enabled)
    if (process.env.OBSERVABILITY_ENABLED === 'true') {
      Sentry.addBreadcrumb({
        category: 'search',
        message: 'Memory search failed',
        level: 'error',
        data: {
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      });
    }
    
    console.error('Error searching memories:', error)
    return createErrorResponse('Failed to search memories', 500)
  }
}, { op: 'api.memory.search', name: 'POST /api/memory/search' })
