import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { generateApiKey, hashApiKey, invalidateApiKeyCache } from '@/lib/auth'

/**
 * GET /api/auth/clerk-link
 *
 * Returns the MemoryHub API key for an authenticated Clerk user.
 * If the user doesn't exist in our database yet, creates them automatically.
 *
 * Requires: Clerk authentication (JWT in Authorization header or cookies)
 * Returns: { apiKey: string, userId: string }
 */
export async function GET(request: NextRequest) {
  try {
    // Get the authenticated Clerk user
    const { userId: clerkUserId } = await auth()

    if (!clerkUserId) {
      return NextResponse.json(
        {
          status: 'error',
          error: 'Unauthorized - No Clerk session found'
        },
        { status: 401 }
      )
    }

    // Check if user exists in our database
    let user = await prisma.user.findUnique({
      where: { clerkUserId },
      select: {
        id: true,
        email: true,
        apiKey: true,
      },
    })

    // If user doesn't exist, the webhook might not have fired yet
    // Wait briefly with exponential backoff for webhook to create user
    if (!user) {
      console.log('User not found for Clerk ID:', clerkUserId, '- polling for webhook...')

      const maxRetries = 5
      const delays = [500, 1000, 2000, 3000, 5000] // Total ~11.5 seconds

      for (let i = 0; i < maxRetries; i++) {
        await new Promise(resolve => setTimeout(resolve, delays[i]))

        user = await prisma.user.findUnique({
          where: { clerkUserId },
          select: {
            id: true,
            email: true,
            apiKey: true,
          },
        })

        if (user) {
          console.log('Webhook created user after', delays.slice(0, i + 1).reduce((a, b) => a + b, 0), 'ms')
          break
        }
      }

      // If still not found after polling, create as fallback
      if (!user) {
        console.log('Webhook did not fire after 11.5s - creating fallback user')

        const apiKey = generateApiKey()
        const apiKeyHash = await hashApiKey(apiKey)

        user = await prisma.user.create({
          data: {
            email: `user-${clerkUserId}@clerk.temp`, // Temporary, will be updated by webhook
            clerkUserId,
            apiKey,
            apiKeyHash,
          },
          select: {
            id: true,
            email: true,
            apiKey: true,
          },
        })

        console.log('Created fallback user:', user.id)
      }
    }

    return NextResponse.json({
      status: 'success',
      data: {
        apiKey: user.apiKey,
        userId: user.id,
        email: user.email,
      },
    })
  } catch (error) {
    console.error('Error in /api/auth/clerk-link:', error)
    return NextResponse.json(
      {
        status: 'error',
        error: 'Failed to link Clerk user'
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/auth/clerk-link/regenerate
 *
 * Regenerates the API key for an authenticated Clerk user.
 * Useful if a user's API key is compromised.
 *
 * Requires: Clerk authentication
 * Returns: { apiKey: string, userId: string }
 */
export async function POST(request: NextRequest) {
  try {
    // Get the authenticated Clerk user
    const { userId: clerkUserId } = await auth()

    if (!clerkUserId) {
      return NextResponse.json(
        {
          status: 'error',
          error: 'Unauthorized - No Clerk session found'
        },
        { status: 401 }
      )
    }

    // Find user
    const existingUser = await prisma.user.findUnique({
      where: { clerkUserId },
    })

    if (!existingUser) {
      return NextResponse.json(
        {
          status: 'error',
          error: 'User not found'
        },
        { status: 404 }
      )
    }

    // Invalidate old API key cache
    await invalidateApiKeyCache(existingUser.apiKey)

    // Generate new API key
    const newApiKey = generateApiKey()
    const newApiKeyHash = await hashApiKey(newApiKey)

    // Update user with new API key
    const user = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        apiKey: newApiKey,
        apiKeyHash: newApiKeyHash,
      },
      select: {
        id: true,
        email: true,
        apiKey: true,
      },
    })

    console.log('Regenerated API key for user:', user.id)

    return NextResponse.json({
      status: 'success',
      data: {
        apiKey: user.apiKey,
        userId: user.id,
        email: user.email,
      },
    })
  } catch (error) {
    console.error('Error regenerating API key:', error)
    return NextResponse.json(
      {
        status: 'error',
        error: 'Failed to regenerate API key'
      },
      { status: 500 }
    )
  }
}
