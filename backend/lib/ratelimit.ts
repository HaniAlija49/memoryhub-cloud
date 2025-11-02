import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Check if Upstash credentials are available
const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

let ratelimit: Ratelimit | null = null

if (UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({
    url: UPSTASH_REDIS_REST_URL,
    token: UPSTASH_REDIS_REST_TOKEN,
  })

  // Create a rate limiter
  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
    analytics: true,
    prefix: 'memoryhub:ratelimit',
  })

  console.log('✅ Rate limiting enabled (100 req/min per API key)')
} else {
  console.warn('⚠️  Rate limiting disabled - set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to enable')
}

export async function checkRateLimit(identifier: string): Promise<{ success: boolean; limit?: number; remaining?: number; reset?: number }> {
  if (!ratelimit) {
    // Rate limiting disabled - allow all requests
    return { success: true }
  }

  try {
    const { success, limit, remaining, reset } = await ratelimit.limit(identifier)
    return { success, limit, remaining, reset }
  } catch (error) {
    console.error('Rate limit check failed:', error)
    // On error, allow the request (fail open)
    return { success: true }
  }
}
