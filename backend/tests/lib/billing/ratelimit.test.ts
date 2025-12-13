import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((body, init) => ({ body, status: init?.status ?? 200, headers: init?.headers })),
  },
}))

const limitMock = vi.fn()

vi.mock('@upstash/redis', () => ({ Redis: vi.fn() }))
vi.mock('@upstash/ratelimit', () => {
  const Ratelimit = vi.fn().mockImplementation(() => ({ limit: limitMock }))
  Ratelimit.slidingWindow = vi.fn(() => 'window')
  return { Ratelimit }
})

describe('billing rate limit', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
    limitMock.mockReset()
  })

  it('allows when redis not configured', async () => {
    delete process.env.UPSTASH_REDIS_REST_URL
    delete process.env.UPSTASH_REDIS_REST_TOKEN
    const { checkBillingRateLimit } = await import('@/lib/billing/ratelimit')
    const res = await checkBillingRateLimit('u1')
    expect(res).toBeNull()
  })

  it('returns 429 when exceeded', async () => {
    process.env.UPSTASH_REDIS_REST_URL = 'http://redis'
    process.env.UPSTASH_REDIS_REST_TOKEN = 'token'
    limitMock.mockResolvedValue({ success: false, limit: 10, remaining: 0, reset: Date.now() + 1000 })

    const { checkBillingRateLimit } = await import('@/lib/billing/ratelimit')
    const res = await checkBillingRateLimit('u2')

    expect(res?.status).toBe(429)
    expect(res?.headers['Retry-After']).toBeDefined()
  })

  it('returns null when under limit', async () => {
    process.env.UPSTASH_REDIS_REST_URL = 'http://redis'
    process.env.UPSTASH_REDIS_REST_TOKEN = 'token'
    limitMock.mockResolvedValue({ success: true, limit: 10, remaining: 5, reset: Date.now() + 1000 })

    const { checkBillingRateLimit } = await import('@/lib/billing/ratelimit')
    const res = await checkBillingRateLimit('u3')
    expect(res).toBeNull()
  })
})
