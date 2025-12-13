import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((body, init) => ({ body, status: init?.status ?? 200 })),
  },
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}))

vi.mock('@/lib/clerk-auth', () => ({
  getClerkUserId: vi.fn(),
}))

vi.mock('@clerk/nextjs/server', () => ({
  currentUser: vi.fn(),
}))

const invalidateApiKeyCache = vi.fn()

vi.mock('@/lib/auth', () => ({
  generateApiKey: vi.fn(() => 'pq_testkey'),
  hashApiKey: vi.fn(async (key: string) => `hashed_${key}`),
  getApiKeyPrefix: vi.fn((key: string) => key.substring(0, 12)),
  invalidateApiKeyCache,
}))

describe('api-keys routes', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('GET returns unauthorized when no Clerk user', async () => {
    const { NextResponse } = await import('next/server')
    const { getClerkUserId } = await import('@/lib/clerk-auth')
    ;(NextResponse.json as any).mockClear()
    ;(getClerkUserId as any).mockResolvedValue(null)

    const { GET } = await import('@/app/api/api-keys/route')
    const res = await GET({} as any)

    expect(res.status).toBe(401)
    expect(res.body.status).toBe('error')
  })

  it('GET returns hasApiKey=false when none set', async () => {
    const { NextResponse } = await import('next/server')
    const { getClerkUserId } = await import('@/lib/clerk-auth')
    const { prisma } = await import('@/lib/prisma')
    ;(NextResponse.json as any).mockClear()
    ;(getClerkUserId as any).mockResolvedValue('clerk-1')
    prisma.user.findUnique.mockResolvedValue({ id: 'u1', email: 'u@example.com', apiKey: null })

    const { GET } = await import('@/app/api/api-keys/route')
    const res = await GET({} as any)

    expect(res.status).toBe(200)
    expect(res.body.data.hasApiKey).toBe(false)
  })

  it('GET returns existing key', async () => {
    const { getClerkUserId } = await import('@/lib/clerk-auth')
    const { prisma } = await import('@/lib/prisma')
    ;(getClerkUserId as any).mockResolvedValue('clerk-1')
    prisma.user.findUnique.mockResolvedValue({ id: 'u1', email: 'u@example.com', apiKey: 'pq_key' })

    const { GET } = await import('@/app/api/api-keys/route')
    const res = await GET({} as any)

    expect(res.body.data.hasApiKey).toBe(true)
    expect(res.body.data.apiKey).toBe('pq_key')
  })

  it('POST rejects when already has API key', async () => {
    const { getClerkUserId } = await import('@/lib/clerk-auth')
    const { prisma } = await import('@/lib/prisma')
    ;(getClerkUserId as any).mockResolvedValue('clerk-1')
    prisma.user.findUnique.mockResolvedValue({ id: 'u1', apiKey: 'existing' })

    const { POST } = await import('@/app/api/api-keys/route')
    const res = await POST({} as any)

    expect(res.status).toBe(409)
    expect(res.body.status).toBe('error')
  })

  it('POST creates new user and returns key', async () => {
    const { getClerkUserId } = await import('@/lib/clerk-auth')
    const { currentUser } = await import('@clerk/nextjs/server')
    const { prisma } = await import('@/lib/prisma')
    ;(getClerkUserId as any).mockResolvedValue('clerk-2')
    ;(currentUser as any).mockResolvedValue({
      primaryEmailAddressId: 'email-1',
      emailAddresses: [{ id: 'email-1', emailAddress: 'new@example.com' }],
    })
    prisma.user.findUnique.mockResolvedValue(null)
    prisma.user.create.mockResolvedValue({ id: 'u2', email: 'new@example.com' })

    const { POST } = await import('@/app/api/api-keys/route')
    const res = await POST({} as any)

    expect(res.status).toBe(200)
    expect(res.body.data.apiKey).toBe('pq_testkey')
    expect(prisma.user.create).toHaveBeenCalled()
  })

  it('PUT regenerates key and invalidates cache', async () => {
    const { getClerkUserId } = await import('@/lib/clerk-auth')
    const { prisma } = await import('@/lib/prisma')
    ;(getClerkUserId as any).mockResolvedValue('clerk-3')
    prisma.user.findUnique.mockResolvedValue({ id: 'u3', apiKey: 'old-key' })
    prisma.user.update.mockResolvedValue({ id: 'u3', email: 'u3@example.com' })

    const { PUT } = await import('@/app/api/api-keys/route')
    const res = await PUT({} as any)

    expect(res.status).toBe(200)
    expect(res.body.data.apiKey).toBe('pq_testkey')
    expect(invalidateApiKeyCache).toHaveBeenCalledWith('old-key')
  })
})
