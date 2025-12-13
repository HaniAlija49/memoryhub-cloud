import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((body, init) => ({ body, status: init?.status ?? 200 })),
  },
}))

const prismaMock = {
  user: {
    findUnique: vi.fn(),
  },
}
vi.mock('@/lib/prisma', () => ({ prisma: prismaMock as any }))

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

describe('auth login route', () => {
  beforeEach(() => {
    vi.resetModules()
    prismaMock.user.findUnique.mockReset()
  })

  it('returns 400 on validation error', async () => {
    const { POST } = await import('@/app/api/auth/login/route')
    const res = await POST({ json: async () => ({}) } as any)
    expect(res.status).toBe(400)
  })

  it('returns 404 when user not found', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null)
    const { POST } = await import('@/app/api/auth/login/route')
    const res = await POST({ json: async () => ({ email: 'a@b.com' }) } as any)
    expect(res.status).toBe(404)
  })

  it('returns user on success', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 'u1', email: 'a@b.com', apiKey: 'key', createdAt: new Date() })
    const { POST } = await import('@/app/api/auth/login/route')
    const res = await POST({ json: async () => ({ email: 'a@b.com' }) } as any)
    expect(res.status).toBe(200)
    expect(res.body.user.id).toBe('u1')
  })
})
