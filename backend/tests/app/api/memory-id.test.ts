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
    findUnique: vi.fn(),
    delete: vi.fn(),
    update: vi.fn(),
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

describe('memory delete route', () => {
  beforeEach(() => {
    vi.resetModules()
    prismaMock.memory.findUnique.mockReset()
    prismaMock.memory.delete.mockReset()
    prismaMock.memory.update.mockReset()
  })

  it('returns 404 when memory not found', async () => {
    prismaMock.memory.findUnique.mockResolvedValue(null)
    const { DELETE } = await import('@/app/api/memory/[id]/route')
    const res = await DELETE({} as any, { params: Promise.resolve({ id: 'missing' }) } as any)
    expect(res.status).toBe(404)
  })

  it('deletes memory when found', async () => {
    prismaMock.memory.findUnique.mockResolvedValue({ id: 'm1', userId: 'user-1' })
    prismaMock.memory.delete.mockResolvedValue({ id: 'm1' })
    const { DELETE } = await import('@/app/api/memory/[id]/route')
    const res = await DELETE({} as any, { params: Promise.resolve({ id: 'm1' }) } as any)
    expect(res.status).toBe(200)
    expect(prismaMock.memory.delete).toHaveBeenCalled()
  })

  it('GET returns 403 when accessing another user memory', async () => {
    prismaMock.memory.findUnique.mockResolvedValue({ id: 'm1', userId: 'other-user' })
    const { GET } = await import('@/app/api/memory/[id]/route')
    const res = await GET({} as any, { params: Promise.resolve({ id: 'm1' }) } as any)
    expect(res.status).toBe(403)
  })

  it('GET returns memory when authorized', async () => {
    prismaMock.memory.findUnique.mockResolvedValue({ id: 'm1', userId: 'user-1', content: 'c', project: null, metadata: {}, createdAt: new Date() })
    const { GET } = await import('@/app/api/memory/[id]/route')
    const res = await GET({} as any, { params: Promise.resolve({ id: 'm1' }) } as any)
    expect(res.status).toBe(200)
    expect(res.body.data.id).toBe('m1')
  })

  it('PUT updates memory when authorized', async () => {
    prismaMock.memory.findUnique.mockResolvedValue({ id: 'm1', userId: 'user-1' })
    prismaMock.memory.update.mockResolvedValue({ id: 'm1' })
    const { PUT } = await import('@/app/api/memory/[id]/route')
    const res = await PUT({ json: async () => ({ content: 'new' }) } as any, { params: Promise.resolve({ id: 'm1' }) } as any)
    expect(res.status).toBe(200)
    expect(prismaMock.memory.update).toHaveBeenCalled()
  })
})
