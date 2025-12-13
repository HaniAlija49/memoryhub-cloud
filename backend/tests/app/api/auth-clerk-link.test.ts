import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((body, init) => ({ body, status: init?.status ?? 200 })),
  },
}))

const prismaMock = {
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
}
vi.mock('@/lib/prisma', () => ({ prisma: prismaMock as any }))

vi.mock('@/lib/auth', () => ({
  generateApiKey: vi.fn(() => 'pq_generated'),
  hashApiKey: vi.fn(async () => 'hashed'),
  invalidateApiKeyCache: vi.fn(async () => {}),
}))

const authMock = vi.fn(async () => ({ userId: null }))
vi.mock('@clerk/nextjs/server', () => ({ auth: authMock }))

vi.mock('@/app/_utils/app-router-sentry.config', () => ({ withSentryTracing: (fn: any) => fn }))

describe('clerk-link route', () => {
  beforeEach(() => {
    vi.resetModules()
    prismaMock.user.findUnique.mockReset()
    prismaMock.user.create.mockReset()
    authMock.mockResolvedValue({ userId: null })
  })

  it('returns 401 when no clerk user', async () => {
    const { GET } = await import('@/app/api/auth/clerk-link/route')
    const res = await GET({} as any)
    expect(res.status).toBe(401)
  })

  it('returns existing user key when found', async () => {
    authMock.mockResolvedValue({ userId: 'clerk-1' })
    prismaMock.user.findUnique.mockResolvedValue({ id: 'u1', email: 'a@b.com', apiKey: 'pq_key' })
    const { GET } = await import('@/app/api/auth/clerk-link/route')
    const res = await GET({} as any)
    expect(res.status).toBe(200)
    expect(res.body.data.apiKey).toBe('pq_key')
  })
})
