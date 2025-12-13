import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((body, init) => ({ body, status: init?.status ?? 200 })),
  },
}))

vi.mock('next/headers', () => ({ headers: vi.fn(async () => new Headers([['authorization', 'Bearer test']])) }))
vi.mock('@/app/_utils/app-router-sentry.config', () => ({ withSentryTracing: (fn: any) => fn }))

const prismaMock = {
  memory: {
    aggregate: vi.fn(),
    count: vi.fn(),
    groupBy: vi.fn(),
    findMany: vi.fn(),
  },
}
vi.mock('@/lib/prisma', () => ({ prisma: prismaMock as any }))

vi.mock('@/lib/auth', () => ({
  validateApiKey: vi.fn(async () => ({ id: 'user-1' })),
  AuthError: class AuthError extends Error { statusCode = 401 },
}))

vi.mock('@/lib/billing/quotas', () => ({ enforceQuota: vi.fn(async () => null) }))

vi.mock('@/lib/utils', () => ({
  createErrorResponse: vi.fn((message: string, status = 500) => ({ body: { error: message, status: 'error' }, status })),
  createSuccessResponse: vi.fn((data: any, status = 200) => ({ body: { ...data, status: 'success' }, status })),
}))

describe('memory stats route', () => {
  beforeEach(() => {
    vi.resetModules()
    prismaMock.memory.aggregate.mockReset()
    prismaMock.memory.count.mockReset()
    prismaMock.memory.groupBy.mockReset()
    prismaMock.memory.findMany.mockReset()
  })

  it('returns stats', async () => {
    prismaMock.memory.count.mockResolvedValue(3)
    prismaMock.memory.groupBy.mockResolvedValue([{ project: null, _count: { id: 3 } }])
    prismaMock.memory.findMany.mockResolvedValue([{ id: 'm1', content: 'text', project: null, createdAt: new Date() }])
    const { GET } = await import('@/app/api/memory/stats/route')
    const res = await GET({} as any)
    expect(res.status).toBe(200)
    expect(res.body.data.totalMemories).toBe(3)
  })
})
