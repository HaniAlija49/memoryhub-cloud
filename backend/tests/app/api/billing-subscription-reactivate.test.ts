import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((body, init) => ({ body, status: init?.status ?? 200 })),
  },
}))

const authRequestMock = vi.fn()
vi.mock('@/lib/clerk-auth-helper', () => ({ authenticateRequest: authRequestMock }))

let providerRef: any = null
vi.mock('@/lib/billing/factory', () => {
  providerRef = {
    reactivateSubscription: vi.fn(async () => ({})),
  }
  return {
    getBillingProvider: vi.fn(() => providerRef),
    isBillingConfigured: vi.fn(() => true),
  }
})

vi.mock('@/lib/billing/ratelimit', () => ({ checkBillingRateLimit: vi.fn(async () => null) }))
vi.mock('@/lib/billing/errors', () => ({ createGenericErrorResponse: (e: any) => ({ error: String(e) }) }))

const prismaMock = {
  user: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
}
vi.mock('@prisma/client', () => ({ PrismaClient: vi.fn(() => prismaMock) }))

describe('billing subscription reactivate route', () => {
  beforeEach(() => {
    vi.resetModules()
    prismaMock.user.findUnique.mockReset()
    prismaMock.user.update.mockReset()
    authRequestMock.mockReset()
  })

  it('returns 401 when unauthorized', async () => {
    authRequestMock.mockResolvedValue({ userId: null })
    const { POST } = await import('@/app/api/billing/subscription/reactivate/route')
    const res = await POST(new Request('http://test'))
    expect(res.status).toBe(401)
  })

  it('returns 400 when no subscription', async () => {
    authRequestMock.mockResolvedValue({ userId: 'clerk-1' })
    prismaMock.user.findUnique.mockResolvedValue({ id: 'u1', subscriptionId: null })
    const { POST } = await import('@/app/api/billing/subscription/reactivate/route')
    const res = await POST(new Request('http://test'))
    expect(res.status).toBe(400)
  })

  it('initiates reactivation when scheduled for cancellation', async () => {
    authRequestMock.mockResolvedValue({ userId: 'clerk-1' })
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'u1',
      subscriptionId: 'sub_1',
      subscriptionStatus: 'active',
      cancelAtPeriodEnd: true,
    })
    const { POST } = await import('@/app/api/billing/subscription/reactivate/route')
    const res = await POST(new Request('http://test'))
    expect(res.status).toBe(200)
    expect(providerRef.reactivateSubscription).toHaveBeenCalledWith('sub_1')
  })
})
