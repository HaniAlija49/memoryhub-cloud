import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { generateApiKey, hashApiKey, invalidateApiKeyCache } from '@/lib/auth'
import { getClerkUserId } from '@/lib/clerk-auth'

/**
 * GET /api/api-keys
 *
 * Get the current user's API key.
 * Returns null if user hasn't generated an API key yet.
 *
 * Requires: Clerk authentication
 * Returns: { apiKey: string | null, hasApiKey: boolean, email: string }
 */
export async function GET(request: NextRequest) {
  try {
    const clerkUserId = await getClerkUserId(request)

    if (!clerkUserId) {
      return NextResponse.json(
        { status: 'error', error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user exists in our database
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
      select: {
        id: true,
        email: true,
        apiKey: true,
      },
    })

    if (!user) {
      // User hasn't generated an API key yet
      return NextResponse.json({
        status: 'success',
        data: {
          hasApiKey: false,
          apiKey: null,
          email: null,
        },
      })
    }

    return NextResponse.json({
      status: 'success',
      data: {
        hasApiKey: true,
        apiKey: user.apiKey,
        email: user.email,
        userId: user.id,
      },
    })
  } catch (error) {
    console.error('Error fetching API key:', error)
    return NextResponse.json(
      { status: 'error', error: 'Failed to fetch API key' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/api-keys
 *
 * Generate a new API key for the authenticated user.
 * Creates the user in the database if they don't exist yet.
 *
 * Requires: Clerk authentication
 * Returns: { apiKey: string, userId: string, email: string }
 */
export async function POST(request: NextRequest) {
  try {
    const clerkUserId = await getClerkUserId(request)
    const clerkUser = await currentUser()

    if (!clerkUserId) {
      return NextResponse.json(
        { status: 'error', error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user already exists
    let existingUser = await prisma.user.findUnique({
      where: { clerkUserId },
    })

    // If user already has an API key, return error
    if (existingUser && existingUser.apiKey) {
      return NextResponse.json(
        {
          status: 'error',
          error: 'API key already exists. Use PUT /api/api-keys to regenerate.'
        },
        { status: 409 }
      )
    }

    // Generate API key
    const apiKey = generateApiKey()
    const apiKeyHash = await hashApiKey(apiKey)

    // If user exists but has no API key, update them
    // Otherwise create new user
    const user = existingUser
      ? await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            apiKey,
            apiKeyHash,
          },
          select: {
            id: true,
            email: true,
            apiKey: true,
          },
        })
      : await prisma.user.create({
          data: {
            email: clerkUser?.emailAddresses.find(
              (e) => e.id === clerkUser.primaryEmailAddressId
            )?.emailAddress || `user-${clerkUserId}@memoryhub.app`,
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

    console.log('Generated API key for user:', user.id)

    return NextResponse.json({
      status: 'success',
      data: {
        apiKey: user.apiKey,
        userId: user.id,
        email: user.email,
      },
    })
  } catch (error) {
    console.error('Error generating API key:', error)
    return NextResponse.json(
      { status: 'error', error: 'Failed to generate API key' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/api-keys
 *
 * Regenerate the API key for the authenticated user.
 * Invalidates the old key and generates a new one.
 *
 * Requires: Clerk authentication
 * Returns: { apiKey: string, userId: string, email: string }
 */
export async function PUT(request: NextRequest) {
  try {
    const clerkUserId = await getClerkUserId(request)

    if (!clerkUserId) {
      return NextResponse.json(
        { status: 'error', error: 'Unauthorized' },
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
          error: 'No API key found. Use POST /api/api-keys to generate one.'
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
      { status: 'error', error: 'Failed to regenerate API key' },
      { status: 500 }
    )
  }
}
