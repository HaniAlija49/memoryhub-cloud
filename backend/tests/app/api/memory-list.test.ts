import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((body, init) => ({ body, status: init?.status ?? 200 })),
  },
}))

vi.mock('next/headers', () => ({
  headers: vi.fn(async () => new Headers([['authorization', 'Bearer test']])),
}))

vi.mock('@/app/_utils/app-router-sentry.config', () => ({ withSentryTracing: (fn: any) => fn }))

const prismaMock = {
  memory: {
    findMany: vi.fn(),
    count: vi.fn(),
  },
}

vi.mock('@/lib/prisma', () => ({ prisma: prismaMock as any }))

vi.mock('@/lib/auth', () => ({
  validateApiKey: vi.fn(async () => ({ id: 'user-1' })),
  AuthError: class AuthError extends Error { statusCode = 401 },
}))

vi.mock('@/lib/billing/quotas', () => ({
  enforceQuota: vi.fn(async () => null),
}))

vi.mock('@/lib/validation', async () => {
  const actual = await vi.importActual<typeof import('@/lib/validation')>('@/lib/validation')
  return {
    ...actual,
    validateRequest: vi.fn((schema: any, data: any) => {
      if (!data || data.limit === 'bad') return { success: false, error: 'invalid' }
      return { success: true, data: { project: data.project, limit: data.limit ? Number(data.limit) : undefined, offset: data.offset ? Number(data.offset) : undefined } }
    }),
  }
})

vi.mock('@/lib/utils', () => ({
  createErrorResponse: vi.fn((message: string, status = 500) => ({ body: { error: message, status: 'error' }, status })),
}))

describe('memory list route', () => {
  beforeEach(() => {
    vi.resetModules()
    prismaMock.memory.findMany.mockReset()
    prismaMock.memory.count.mockReset()
  })

  it('returns 400 on validation error', async () => {
    const { GET } = await import('@/app/api/memory/list/route')
    const res = await GET(new Request('http://test/memory/list?limit=bad') as any)
    expect(res.status).toBe(400)
  })

  it('returns memories with pagination', async () => {
    prismaMock.memory.findMany.mockResolvedValue([{ id: 'm1' }])
    prismaMock.memory.count.mockResolvedValue(1)
    const { GET } = await import('@/app/api/memory/list/route')
    const res = await GET(new Request('http://test/memory/list?limit=10&offset=0') as any)
    expect(res.status).toBe(200)
    expect(res.body.data.total).toBe(1)
  })
})
