import { NextRequest } from 'next/server'
import { validateApiKey, AuthError } from '@/lib/auth'
import { searchMemories } from '@/lib/search'
import { createErrorResponse, createSuccessResponse } from '@/lib/utils'
import { searchMemorySchema, validateRequest } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await validateApiKey()

    // Parse and validate request body
    const body = await request.json()

    const validation = validateRequest(searchMemorySchema, body)
    if (!validation.success) {
      return createErrorResponse(validation.error, 400)
    }

    const { query, limit = 10 } = validation.data

    // Search using semantic search
    const results = await searchMemories(user.id, query, limit)

    return createSuccessResponse({
      query,
      count: Array.isArray(results) ? results.length : 0,
      memories: results || [],
    })

  } catch (error) {
    if (error instanceof AuthError) {
      return createErrorResponse(error.message, error.statusCode)
    }
    console.error('Error searching memories:', error)
    return createErrorResponse('Failed to search memories', 500)
  }
}
