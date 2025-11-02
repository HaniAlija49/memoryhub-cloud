import { NextRequest } from 'next/server'
import { validateApiKey, AuthError } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateEmbedding } from '@/lib/embeddings'
import { createErrorResponse, createSuccessResponse } from '@/lib/utils'
import { saveMemorySchema, validateRequest } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await validateApiKey()

    // Parse and validate request body
    const body = await request.json()

    const validation = validateRequest(saveMemorySchema, body)
    if (!validation.success) {
      return createErrorResponse(validation.error, 400)
    }

    const { content, project, metadata } = validation.data

    // Generate embedding for semantic search
    const embedding = await generateEmbedding(content)
    const embeddingString = `[${embedding.join(',')}]`

    // Save to Postgres with embedding using raw SQL
    // (Prisma doesn't fully support vector type yet)
    const memory = await prisma.$queryRaw<Array<{
      id: string
      content: string
      project: string | null
      metadata: any
      created_at: Date
    }>>`
      INSERT INTO memories (id, user_id, content, project, metadata, embedding, created_at)
      VALUES (
        gen_random_uuid()::text,
        ${user.id},
        ${content},
        ${project || null},
        ${JSON.stringify(metadata || null)}::jsonb,
        ${embeddingString}::vector,
        NOW()
      )
      RETURNING id, content, project, metadata, created_at
    `

    const savedMemory = memory[0]

    return createSuccessResponse({
      message: 'Memory saved successfully',
      memory: {
        id: savedMemory.id,
        content: savedMemory.content,
        project: savedMemory.project,
        metadata: savedMemory.metadata,
        createdAt: savedMemory.created_at,
      },
    }, 201)

  } catch (error) {
    if (error instanceof AuthError) {
      return createErrorResponse(error.message, error.statusCode)
    }
    console.error('Error saving memory:', error)
    return createErrorResponse('Failed to save memory', 500)
  }
}
