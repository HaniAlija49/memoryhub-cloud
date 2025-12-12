import { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { verifyToken } from '@clerk/backend'

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

      const allowUnverifiedFlag = process.env.CLERK_ALLOW_UNVERIFIED_JWT === 'true'
      const isProduction = process.env.NODE_ENV === 'production'
      const allowUnverified = allowUnverifiedFlag && !isProduction
      if (allowUnverifiedFlag && isProduction) {
        console.warn('[Auth] CLERK_ALLOW_UNVERIFIED_JWT is ignored in production')
      }
      const audience = process.env.CLERK_JWT_AUDIENCE || undefined

      // Verify the JWT signature unless explicitly bypassed (e.g., local dev)
      if (!allowUnverified) {
        try {
          const secretKey = process.env.CLERK_SECRET_KEY

          if (!secretKey) {
            console.error('[Auth] CLERK_SECRET_KEY not configured')
            return null
          }

          const verified = await verifyToken(token, {
            secretKey,
            audience,
          })

          const issuer =
            process.env.CLERK_JWT_ISSUER_DOMAIN || process.env.CLERK_ISSUER
          if (issuer && verified.iss !== issuer) {
            console.error(
              `[Auth] Clerk token issuer mismatch: expected ${issuer}, got ${verified.iss}`
            )
            return null
          }

          return verified.sub || null
        } catch (error) {
          console.error(
            '[Auth] Clerk token verification failed:',
            error instanceof Error ? error.message : String(error)
          )
          return null
        }
      }

      // Explicitly-allowed unverified decoding (development only)
      try {
        const [, payload] = token.split('.')

        if (!payload) {
          console.error('Failed to decode Clerk token: malformed JWT')
          return null
        }

        const decoded = Buffer.from(payload, 'base64url').toString()
        const parsed = JSON.parse(decoded)

        return parsed.sub || null
      } catch (error) {
        console.error('Failed to decode Clerk token:', error)
        return null
      }
    }
  }

  return null
}
