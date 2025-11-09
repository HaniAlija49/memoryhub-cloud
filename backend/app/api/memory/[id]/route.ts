import { NextRequest, NextResponse } from 'next/server'
import { validateApiKey, AuthError } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createErrorResponse, createSuccessResponse } from '@/lib/utils'

export async function GET(
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

    // Get memory from database
    const memory = await prisma.memory.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        content: true,
        project: true,
        metadata: true,
        createdAt: true,
      },
    })

    if (!memory) {
      return createErrorResponse('Memory not found', 404)
    }

    if (memory.userId !== user.id) {
      return createErrorResponse('Unauthorized to access this memory', 403)
    }

    return NextResponse.json({
      status: 'success',
      data: memory
    })

  } catch (error) {
    if (error instanceof AuthError) {
      return createErrorResponse(error.message, error.statusCode)
    }
    console.error('Error getting memory:', error)
    return createErrorResponse('Failed to get memory', 500)
  }
}

export async function PUT(
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

    // Parse request body
    const body = await request.json()
    const { content, project, metadata } = body

    // Check if memory exists and belongs to user
    const memory = await prisma.memory.findUnique({
      where: { id },
    })

    if (!memory) {
      return createErrorResponse('Memory not found', 404)
    }

    if (memory.userId !== user.id) {
      return createErrorResponse('Unauthorized to update this memory', 403)
    }

    // Update the memory
    const updateData: any = {}
    if (content !== undefined) updateData.content = content
    if (project !== undefined) updateData.project = project
    if (metadata !== undefined) updateData.metadata = metadata

    await prisma.memory.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      status: 'success',
      data: {
        success: true
      }
    })

  } catch (error) {
    if (error instanceof AuthError) {
      return createErrorResponse(error.message, error.statusCode)
    }
    console.error('Error updating memory:', error)
    return createErrorResponse('Failed to update memory', 500)
  }
}

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

    return NextResponse.json({
      status: 'success',
      data: {
        success: true
      }
    })

  } catch (error) {
    if (error instanceof AuthError) {
      return createErrorResponse(error.message, error.statusCode)
    }
    console.error('Error deleting memory:', error)
    return createErrorResponse('Failed to delete memory', 500)
  }
}
