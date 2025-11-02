import { NextRequest } from 'next/server'
import { validateApiKey, AuthError } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createErrorResponse, createSuccessResponse } from '@/lib/utils'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate user
    const user = await validateApiKey()

    // Get memory ID from URL
    const { id } = await params

    if (!id) {
      return createErrorResponse('Memory ID is required', 400)
    }

    // Check if memory exists and belongs to user
    const memory = await prisma.memory.findUnique({
      where: { id },
    })

    if (!memory) {
      return createErrorResponse('Memory not found', 404)
    }

    if (memory.userId !== user.id) {
      return createErrorResponse('Unauthorized to delete this memory', 403)
    }

    // Delete from database (pgvector embedding is deleted automatically via CASCADE)
    await prisma.memory.delete({
      where: { id },
    })

    return createSuccessResponse({
      message: 'Memory deleted successfully',
      id,
    })

  } catch (error) {
    if (error instanceof AuthError) {
      return createErrorResponse(error.message, error.statusCode)
    }
    console.error('Error deleting memory:', error)
    return createErrorResponse('Failed to delete memory', 500)
  }
}
