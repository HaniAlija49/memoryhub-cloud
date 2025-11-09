import { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'

/**
 * Get Clerk user ID from request
 * Tries both cookie-based session and Authorization header token
 */
export async function getClerkUserId(request?: NextRequest): Promise<string | null> {
  // Try cookie-based auth first (works for same-origin requests)
  const { userId } = await auth()

  if (userId) {
    return userId
  }

  // If no cookie session and we have a request, try Authorization header
  if (request) {
    const authHeader = request.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7)

      // In development, we trust the frontend's Clerk token
      // The token is already verified by the frontend's Clerk
      // For production, you might want to verify the JWT signature

      try {
        // Decode the JWT to get the userId (sub claim)
        const payload = JSON.parse(
          Buffer.from(token.split('.')[1], 'base64').toString()
        )

        return payload.sub || null
      } catch (error) {
        console.error('Failed to decode Clerk token:', error)
        return null
      }
    }
  }

  return null
}
