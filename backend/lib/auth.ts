import { headers } from 'next/headers'
import { prisma } from './prisma'
import { User } from '@prisma/client'
import { checkRateLimit } from './ratelimit'
import bcrypt from 'bcrypt'
import { Redis } from '@upstash/redis'

export class AuthError extends Error {
  constructor(message: string, public statusCode: number = 401) {
    super(message)
    this.name = 'AuthError'
  }
}

const BCRYPT_ROUNDS = 10

// Redis cache for API key -> User ID mapping
let redis: Redis | null = null
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })
}

const CACHE_TTL = 300 // 5 minutes

export async function validateApiKey(): Promise<User> {
  const headersList = await headers()
  const authHeader = headersList.get('authorization')

  if (!authHeader) {
    throw new AuthError('Missing authorization header', 401)
  }

  // Support both "Bearer token" and "token" formats
  const apiKey = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader

  if (!apiKey) {
    throw new AuthError('Invalid authorization format', 401)
  }

  try {
    // Check Redis cache first
    let userId: string | null = null
    if (redis) {
      const cacheKey = `memoryhub:apikey:${apiKey}`
      userId = await redis.get<string>(cacheKey)

      if (userId) {
        // Get user from database
        const user = await prisma.user.findUnique({
          where: { id: userId },
        })

        if (user) {
          // Check rate limit
          const rateLimitResult = await checkRateLimit(user.id)
          if (!rateLimitResult.success) {
            throw new AuthError(
              `Rate limit exceeded. Try again in ${rateLimitResult.reset ? Math.ceil((rateLimitResult.reset - Date.now()) / 1000) : 60} seconds`,
              429
            )
          }
          return user
        } else {
          // User deleted, clear cache
          await redis.del(cacheKey)
        }
      }
    }

    // Cache miss - validate from database
    // First, try to find user by plain API key (backward compatibility)
    let user = await prisma.user.findUnique({
      where: { apiKey },
    })

    // If not found by plain key, check if key matches a hash
    if (!user) {
      // Create hash of the provided API key
      const keyHash = await hashApiKey(apiKey)

      // Try to find user by hash (this uses the unique index)
      user = await prisma.user.findUnique({
        where: { apiKeyHash: keyHash },
      })

      // If still not found, do a bcrypt comparison fallback
      // (for keys that were hashed with different salts)
      if (!user) {
        const usersWithHash = await prisma.user.findMany({
          where: {
            apiKeyHash: { not: null }
          },
          take: 100, // Limit to prevent excessive queries
        })

        for (const u of usersWithHash) {
          if (u.apiKeyHash && await bcrypt.compare(apiKey, u.apiKeyHash)) {
            user = u
            break
          }
        }
      }
    }

    if (!user) {
      throw new AuthError('Invalid API key', 401)
    }

    // Cache the result in Redis
    if (redis) {
      const cacheKey = `memoryhub:apikey:${apiKey}`
      await redis.setex(cacheKey, CACHE_TTL, user.id)
    }

    // Check rate limit
    const rateLimitResult = await checkRateLimit(user.id)
    if (!rateLimitResult.success) {
      throw new AuthError(
        `Rate limit exceeded. Try again in ${rateLimitResult.reset ? Math.ceil((rateLimitResult.reset - Date.now()) / 1000) : 60} seconds`,
        429
      )
    }

    return user
  } catch (error) {
    if (error instanceof AuthError) {
      throw error
    }
    console.error('Error validating API key:', error)
    throw new AuthError('Authentication failed', 500)
  }
}

/**
 * Invalidate API key cache (call when API key is regenerated or user is deleted)
 */
export async function invalidateApiKeyCache(apiKey: string): Promise<void> {
  if (redis) {
    const cacheKey = `memoryhub:apikey:${apiKey}`
    await redis.del(cacheKey)
  }
}

export function generateApiKey(): string {
  // Generate a secure random API key with prefix
  const randomBytes = crypto.getRandomValues(new Uint8Array(32))
  const randomString = Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

  return `mh_${randomString}`
}

export async function hashApiKey(apiKey: string): Promise<string> {
  return bcrypt.hash(apiKey, BCRYPT_ROUNDS)
}
