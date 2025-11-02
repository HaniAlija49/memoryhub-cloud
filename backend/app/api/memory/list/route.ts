import { NextRequest } from 'next/server'
import { validateApiKey, AuthError } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createErrorResponse, createSuccessResponse } from '@/lib/utils'
import { listMemoriesSchema, validateRequest } from '@/lib/validation'

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const user = await validateApiKey()

    // Get and validate query parameters
    const { searchParams } = new URL(request.url)
    const queryParams = {
      project: searchParams.get('project') || undefined,
      limit: searchParams.get('limit') || undefined,
      offset: searchParams.get('offset') || undefined,
    }

    const validation = validateRequest(listMemoriesSchema, queryParams)
    if (!validation.success) {
      return createErrorResponse(validation.error, 400)
    }

    const { project, limit, offset } = validation.data

    // Build query
    const where: any = { userId: user.id }
    if (project) {
      where.project = project
    }

    // Get memories from database
    const [memories, total] = await Promise.all([
      prisma.memory.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          content: true,
          project: true,
          metadata: true,
          createdAt: true,
        },
      }),
      prisma.memory.count({ where }),
    ])

    return createSuccessResponse({
      memories,
      pagination: {
        total,
        limit: limit || 0,
        offset: offset || 0,
        hasMore: (offset || 0) + (limit || 0) < total,
      },
    })

  } catch (error) {
    if (error instanceof AuthError) {
      return createErrorResponse(error.message, error.statusCode)
    }
    console.error('Error listing memories:', error)
    return createErrorResponse('Failed to list memories', 500)
  }
}
