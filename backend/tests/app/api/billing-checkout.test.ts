import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((body, init) => ({ body, status: init?.status ?? 200 })),
  },
}))

vi.mock('@/lib/billing/factory', () => ({
  getBillingProvider: vi.fn(() => ({ createCheckoutSession: vi.fn(async () => ({ url: 'http://pay', sessionId: 'sess_1' })) })),
  isBillingConfigured: vi.fn(() => true),
}))

const authenticateRequestMock = vi.fn()
vi.mock('@/lib/clerk-auth-helper', () => ({ authenticateRequest: authenticateRequestMock }))

vi.mock('@/lib/billing/ratelimit', () => ({ checkBillingRateLimit: vi.fn(async () => null) }))

vi.mock('@/lib/billing/errors', () => ({ createGenericErrorResponse: (e: any) => ({ error: String(e) }) }))

vi.mock('@/lib/env', () => ({ env: { NEXT_PUBLIC_APP_URL: 'http://app' } }))

vi.mock('@/config/plans', () => ({ isValidPlanId: vi.fn(() => true), isPaidPlan: vi.fn(() => true) }))

const prismaMock = {
  user: {
    findUnique: vi.fn(),
  },
}
vi.mock('@prisma/client', () => ({ PrismaClient: vi.fn(() => prismaMock) }))

vi.mock('@/lib/billing/validation', () => ({
  CheckoutSessionSchema: {
    parse: (data: any) => data,
  },
  formatValidationErrors: vi.fn(),
}))

let providerCreate: any
vi.mock('@/lib/billing/factory', async () => {
  providerCreate = vi.fn(async () => ({ url: 'http://pay', sessionId: 'sess_1' }))
  return {
    getBillingProvider: vi.fn(() => ({ createCheckoutSession: providerCreate })),
    isBillingConfigured: vi.fn(() => true),
  }
})

describe('billing checkout route', () => {
  beforeEach(() => {
    vi.resetModules()
    prismaMock.user.findUnique.mockReset()
    authenticateRequestMock.mockReset()
    providerCreate?.mockClear()
  })

  it('returns 401 when unauthenticated', async () => {
    authenticateRequestMock.mockResolvedValue({ userId: null })
    const { POST } = await import('@/app/api/billing/checkout/route')
    const res = await POST({ json: async () => ({ planId: 'starter', interval: 'monthly' }), headers: new Headers() } as any)
    expect(res.status).toBe(401)
  })

  it('creates checkout session for valid request', async () => {
    authenticateRequestMock.mockResolvedValue({ userId: 'clerk-1' })
    prismaMock.user.findUnique.mockResolvedValue({ id: 'u1', email: 'a@b.com', clerkUserId: 'clerk-1', subscriptionId: null, subscriptionStatus: null, cancelAtPeriodEnd: false, planId: 'free' })
    const { POST } = await import('@/app/api/billing/checkout/route')
    const res = await POST({ json: async () => ({ planId: 'starter', interval: 'monthly' }), headers: new Headers() } as any)
    expect(res.status).toBe(200)
    expect(res.body.data.url).toBe('http://pay')
    expect(providerCreate).toHaveBeenCalled()
  })

  it('returns 400 when already subscribed to paid plan', async () => {
    authenticateRequestMock.mockResolvedValue({ userId: 'clerk-1' })
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'u1',
      email: 'a@b.com',
      clerkUserId: 'clerk-1',
      subscriptionId: 'sub_1',
      subscriptionStatus: 'active',
      cancelAtPeriodEnd: false,
      planId: 'starter',
    })
    const { POST } = await import('@/app/api/billing/checkout/route')
    const res = await POST({ json: async () => ({ planId: 'pro', interval: 'monthly' }), headers: new Headers() } as any)
    expect(res.status).toBe(400)
    expect(providerCreate).toHaveBeenCalledTimes(0)
  })
})
