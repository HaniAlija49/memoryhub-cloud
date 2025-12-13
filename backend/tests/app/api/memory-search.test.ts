import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((body, init) => ({ body, status: init?.status ?? 200 })),
  },
}))

vi.mock('next/headers', () => ({ headers: vi.fn(async () => new Headers([['authorization', 'Bearer test']])) }))
vi.mock('@/app/_utils/app-router-sentry.config', () => ({ withSentryTracing: (fn: any) => fn }))

vi.mock('@/lib/auth', () => ({
  validateApiKey: vi.fn(async () => ({ id: 'user-1' })),
  AuthError: class AuthError extends Error { statusCode = 401 },
}))

vi.mock('@/lib/billing/quotas', () => ({ enforceQuota: vi.fn(async () => null) }))

vi.mock('@/lib/validation', async () => {
  const actual = await vi.importActual<typeof import('@/lib/validation')>('@/lib/validation')
  return {
    ...actual,
    validateRequest: vi.fn((schema: any, data: any) => {
      if (!data || !data.query) return { success: false, error: 'invalid' }
      return { success: true, data: { query: data.query, limit: data.limit ? Number(data.limit) : undefined } }
    }),
  }
})

vi.mock('@/lib/utils', () => ({
  createErrorResponse: vi.fn((message: string, status = 500) => ({ body: { error: message, status: 'error' }, status })),
  createSuccessResponse: vi.fn((data: any, status = 200) => ({ body: { ...data, status: 'success' }, status })),
}))

const searchResult = [{ id: 'm1', text: 'hit', metadata: {}, score: 0.9 }]
vi.mock('@/lib/search', () => ({ searchMemories: vi.fn(async () => searchResult) }))
vi.mock('@/lib/embeddings', () => ({ generateEmbedding: vi.fn(async () => [0.1, 0.2]) }))

describe('memory search route', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('returns 400 on validation error', async () => {
    const { POST } = await import('@/app/api/memory/search/route')
    const res = await POST({ json: async () => ({}) } as any)
    expect(res.status).toBe(400)
  })

  it('returns search results', async () => {
    const { POST } = await import('@/app/api/memory/search/route')
    const res = await POST({ json: async () => ({ query: 'hello', limit: 5 }) } as any)
    expect(res.status).toBe(200)
    expect(res.body.data).toEqual(searchResult)
  })
})
