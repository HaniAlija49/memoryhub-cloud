import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((body, init) => ({ body, status: init?.status ?? 200 })),
  },
}))

const prismaMock = {
  user: {
    findUnique: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
  },
  usageRecord: {
    upsert: vi.fn(),
  },
}

vi.mock('@/lib/prisma', () => ({ prisma: prismaMock }))

vi.mock('@/lib/billing/quotas', () => ({
  checkQuota: vi.fn(async () => ({ allowed: true })),
  enforceQuota: vi.fn(async () => null),
}))

vi.mock('@/lib/validation', async () => {
  const actual = await vi.importActual<typeof import('@/lib/validation')>('@/lib/validation')
  return {
    ...actual,
    validateRequest: vi.fn((schema: any, data: any) => {
      if (!data || !data.email) return { success: false, error: 'invalid' }
      return { success: true, data }
    }),
  }
})

vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn(async () => 'hashed'),
    compare: vi.fn(async () => true),
  },
}))

vi.mock('@/lib/search', () => ({ searchMemories: vi.fn(async () => []) }))

vi.mock('@/lib/auth', () => ({
  validateApiKey: vi.fn(async () => ({ id: 'user-1' })),
  AuthError: class AuthError extends Error { statusCode = 401 },
  generateApiKey: vi.fn(() => 'pq_generated'),
  hashApiKey: vi.fn(async () => 'hashed_key'),
  invalidateApiKeyCache: vi.fn(async () => {}),
}))

const createErrorResponse = vi.fn((message: string, status = 500) => ({ body: { error: message, status: 'error' }, status }))
vi.mock('@/lib/utils', () => ({
  createErrorResponse,
  createSuccessResponse: vi.fn((data: any, status = 200) => ({ body: { ...data, status: 'success' }, status })),
}))

const clerkAuthMock = vi.fn(async () => ({ userId: null }))
vi.mock('@clerk/nextjs/server', () => ({
  auth: clerkAuthMock,
}))

describe('auth routes', () => {
  beforeEach(() => {
    vi.resetModules()
    prismaMock.user.findUnique.mockReset()
    prismaMock.user.update.mockReset()
    prismaMock.user.create.mockReset()
    createErrorResponse.mockClear()
    clerkAuthMock.mockResolvedValue({ userId: null })
  })

  it('register returns 400 on invalid email', async () => {
    const { POST } = await import('@/app/api/auth/register/route')
    const res = await POST({ json: async () => ({}) } as any)
    expect(res.status).toBe(400)
  })

  it('register creates user when valid', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null)
    prismaMock.user.create.mockResolvedValue({ id: 'u1', email: 'a@b.com', apiKey: 'pq_generated', createdAt: new Date() })
    const { POST } = await import('@/app/api/auth/register/route')
    const res = await POST({ json: async () => ({ email: 'a@b.com' }) } as any)
    expect(res.status).toBe(201)
    expect(res.body.user.apiKey).toBe('pq_generated')
  })

  it('login returns 400 on invalid', async () => {
    const { POST } = await import('@/app/api/auth/login/route')
    const res = await POST({ json: async () => ({}) } as any)
    expect(res.status).toBe(400)
  })

  it('clerk-link returns 401 when auth fails', async () => {
    clerkAuthMock.mockResolvedValue({ userId: null })
    const { GET } = await import('@/app/api/auth/clerk-link/route')
    const res = await GET({} as any)
    expect(res.status).toBe(401)
  })
})
