import { NextRequest, NextResponse } from 'next/server'
import { validateApiKey, AuthError } from '@/lib/auth'
import { searchMemories } from '@/lib/search'
import { createErrorResponse, createSuccessResponse } from '@/lib/utils'
import { searchMemorySchema, validateRequest } from '@/lib/validation'
import { withSentryTracing } from '@/app/_utils/app-router-sentry.config'
import { enforceQuota } from '@/lib/billing/quotas'

export const POST = withSentryTracing(async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await validateApiKey()

    // Check API call quota
    const quotaError = await enforceQuota(user.id, 'api_call')
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

    return NextResponse.json({
      status: 'success',
      data: results || []
    })

  } catch (error) {
    if (error instanceof AuthError) {
      return createErrorResponse(error.message, error.statusCode)
    }
    console.error('Error searching memories:', error)
    return createErrorResponse('Failed to search memories', 500)
  }
}, { op: 'api.memory.search', name: 'POST /api/memory/search' })
