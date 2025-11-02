import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateApiKey, hashApiKey } from '@/lib/auth'
import { createErrorResponse, createSuccessResponse } from '@/lib/utils'
import { registerSchema, validateRequest } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request with Zod
    const validation = validateRequest(registerSchema, body)
    if (!validation.success) {
      return createErrorResponse(validation.error, 400)
    }

    const { email } = validation.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return createErrorResponse('User with this email already exists', 409)
    }

    // Generate API key (plaintext to return once)
    const apiKey = generateApiKey()

    // Hash the API key for secure storage
    const apiKeyHash = await hashApiKey(apiKey)

    // Create user with hashed API key
    // Keep plaintext for backward compatibility during transition
    const user = await prisma.user.create({
      data: {
        email,
        apiKey, // Keep for backward compat (TODO: remove in future)
        apiKeyHash, // New secure hash
      },
      select: {
        id: true,
        email: true,
        apiKey: true,
        createdAt: true,
      },
    })

    return createSuccessResponse({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        apiKey: user.apiKey, // Return plaintext once - user must save this!
      },
    }, 201)

  } catch (error) {
    console.error('Registration error:', error)
    return createErrorResponse('Registration failed', 500)
  }
}
