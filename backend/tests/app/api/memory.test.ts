import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((body, init) => ({ body, status: init?.status ?? 200 })),
  },
}))

vi.mock('next/headers', () => ({
  headers: vi.fn(async () => new Headers([['authorization', 'Bearer test']])),
}))

vi.mock('@/app/_utils/app-router-sentry.config', () => ({
  withSentryTracing: (fn: any) => fn,
}))

vi.mock('@/lib/billing/quotas', () => ({
  enforceQuota: vi.fn(async () => null),
}))

vi.mock('@/lib/validation', async () => {
  const actual = await vi.importActual<typeof import('@/lib/validation')>('@/lib/validation')
  const validateRequest = vi.fn((schema: any, data: any) => {
    if (!data || !data.content) return { success: false, error: 'invalid' }
    return { success: true, data }
  })
  return { ...actual, validateRequest }
})

vi.mock('@/lib/utils', () => ({
  createErrorResponse: vi.fn((message: string, status = 500) => ({ body: { error: message, status: 'error' }, status })),
  createSuccessResponse: vi.fn((data: any, status = 200) => ({ body: { ...data, status: 'success' }, status })),
}))

vi.mock('@/lib/embeddings', () => ({
  generateEmbedding: vi.fn(async () => [0.1, 0.2]),
}))

class MockAuthError extends Error { statusCode = 401 }
vi.mock('@/lib/auth', () => ({
  validateApiKey: vi.fn(async () => ({ id: 'user-1' })),
  AuthError: MockAuthError,
}))

const queryRawMock = vi.fn()
vi.mock('@/lib/prisma', () => ({
  prisma: {
    $queryRaw: queryRawMock,
  },
}))

describe('memory route POST', () => {
  beforeEach(() => {
    vi.resetModules()
    queryRawMock.mockReset()
  })

  it('returns 400 on validation failure', async () => {
    const { POST } = await import('@/app/api/memory/route')
    const res = await POST({ json: async () => ({}) } as any)
    expect(res.status).toBe(400)
  })

  it('saves memory and returns id', async () => {
    queryRawMock.mockResolvedValue([{ id: 'm1', content: 'text', project: null, metadata: {}, created_at: new Date() }])
    const { POST } = await import('@/app/api/memory/route')
    const res = await POST({ json: async () => ({ content: 'text', project: null, metadata: {} }) } as any)
    expect(res.status).toBe(201)
    expect(res.body.data.memoryId).toBe('m1')
  })
})
