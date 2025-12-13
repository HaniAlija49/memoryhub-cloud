import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const NOW = new Date('2024-01-01T00:00:00Z')

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(NOW)
})

afterEach(() => {
  vi.useRealTimers()
  vi.resetModules()
  vi.clearAllMocks()
  delete process.env.UPSTASH_REDIS_REST_URL
  delete process.env.UPSTASH_REDIS_REST_TOKEN
})

describe('rate limiting without Redis (in-memory fallback)', () => {
  it('enforces limit of 100 requests per minute', async () => {
    const { checkRateLimit } = await import('@/lib/ratelimit')

    const first = await checkRateLimit('user-1')
    expect(first).toMatchObject({ success: true, limit: 100, remaining: 99 })

    for (let i = 0; i < 99; i++) {
      await checkRateLimit('user-1')
    }

    const overLimit = await checkRateLimit('user-1')
    expect(overLimit.success).toBe(false)
    expect(overLimit.remaining).toBe(0)
    expect(overLimit.reset && overLimit.reset).toBeGreaterThan(Date.now())
  })
})

describe('rate limiting with Redis configured', () => {
  it('delegates to Redis-backed limiter when credentials exist', async () => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://redis'
    process.env.UPSTASH_REDIS_REST_TOKEN = 'token'

    const limitMock = vi.fn(async () => ({ success: true, limit: 100, remaining: 50, reset: Date.now() + 1000 }))

    vi.doMock('@upstash/redis', () => ({
      Redis: vi.fn().mockImplementation(() => ({})),
    }))

    vi.doMock('@upstash/ratelimit', () => {
      const Ratelimit = vi.fn().mockImplementation(() => ({ limit: limitMock }))
      Ratelimit.slidingWindow = vi.fn(() => 'window')
      return { Ratelimit }
    })

    const { checkRateLimit } = await import('@/lib/ratelimit')

    const result = await checkRateLimit('user-redis')

    expect(limitMock).toHaveBeenCalledWith('user-redis')
    expect(result).toMatchObject({ success: true, remaining: 50 })
  })
})
