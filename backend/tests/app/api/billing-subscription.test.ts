import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((body, init) => ({ body, status: init?.status ?? 200 })),
  },
}))

const authRequestMock = vi.fn()
vi.mock('@/lib/clerk-auth-helper', () => ({ authenticateRequest: authRequestMock }))

let providerMock: any
vi.mock('@/lib/billing/factory', () => {
  providerMock = {
    getSubscription: vi.fn(async () => ({ status: 'active', planId: 'starter' })),
    updateSubscription: vi.fn(async () => ({ status: 'active', planId: 'pro' })),
    cancelSubscription: vi.fn(async () => ({ status: 'canceled' })),
  }
  return {
    getBillingProvider: vi.fn(() => providerMock),
    isBillingConfigured: vi.fn(() => true),
  }
})

vi.mock('@/lib/billing/ratelimit', () => ({ checkBillingRateLimit: vi.fn(async () => null) }))
vi.mock('@/lib/billing/errors', () => ({ createGenericErrorResponse: (e: any) => ({ error: String(e) }) }))
vi.mock('@/lib/billing/validation', () => ({
  UpdateSubscriptionSchema: { parse: (data: any) => data },
  formatValidationErrors: vi.fn(),
}))
vi.mock('@/config/plans', () => ({ getPlan: vi.fn(() => ({ id: 'starter', limits: { apiCallsPerMonth: 1 } })), isValidPlanId: vi.fn(() => true), isPaidPlan: vi.fn(() => true) }))

const prismaMock = {
  user: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  memory: {
    count: vi.fn(),
  },
}
vi.mock('@prisma/client', () => ({ PrismaClient: vi.fn(() => prismaMock) }))


describe('billing subscription route', () => {
  beforeEach(() => {
    vi.resetModules()
    prismaMock.user.findUnique.mockReset()
    prismaMock.user.update.mockReset()
    prismaMock.memory.count.mockReset()
    authRequestMock.mockReset()
    providerMock?.getSubscription.mockReset()
    providerMock?.updateSubscription.mockReset()
    providerMock?.cancelSubscription.mockReset()
  })

  it('GET returns 401 when unauthorized', async () => {
    authRequestMock.mockResolvedValue({ userId: null })
    const { GET } = await import('@/app/api/billing/subscription/route')
    const res = await GET(new Request('http://test'))
    expect(res.status).toBe(401)
  })

  it('GET returns subscription data', async () => {
    authRequestMock.mockResolvedValue({ userId: 'clerk-1' })
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'u1',
      email: 'a@b.com',
      billingCustomerId: 'cust_1',
      subscriptionId: 'sub_1',
      planId: 'starter',
      billingInterval: 'monthly',
      subscriptionStatus: 'active',
      cancelAtPeriodEnd: false,
      currentPeriodEnd: new Date(),
      usageRecords: [{ apiCalls: 1 }],
    })
    prismaMock.memory.count.mockResolvedValue(0)
    const { GET } = await import('@/app/api/billing/subscription/route')
    const res = await GET(new Request('http://test'))
    expect(res.status).toBe(200)
    expect(res.body.data.subscription.status).toBe('active')
  })

  it('POST updates subscription', async () => {
    authRequestMock.mockResolvedValue({ userId: 'clerk-1' })
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'u1',
      email: 'a@b.com',
      billingCustomerId: 'cust_1',
      subscriptionId: 'sub_1',
      planId: 'starter',
      subscriptionStatus: 'active',
      cancelAtPeriodEnd: false,
    })
    const { POST } = await import('@/app/api/billing/subscription/route')
    // Ensure provider mock returns full object expected by route
    providerMock.updateSubscription.mockResolvedValue({
      id: 'sub_1',
      planId: 'pro',
      interval: 'monthly',
      status: 'active',
    })
    const res = await POST({ json: async () => ({ planId: 'pro', interval: 'monthly' }), headers: new Headers() } as any)
    expect(res.status).toBe(200)
    expect(providerMock.updateSubscription).toHaveBeenCalled()
  })

  it('DELETE cancels subscription', async () => {
    authRequestMock.mockResolvedValue({ userId: 'clerk-1' })
    prismaMock.user.findUnique.mockResolvedValue({ id: 'u1', email: 'a@b.com', billingCustomerId: 'cust_1', subscriptionId: 'sub_1', planId: 'starter', subscriptionStatus: 'active', cancelAtPeriodEnd: false })
    providerMock.cancelSubscription.mockResolvedValue({ status: 'canceled' })
    const { DELETE } = await import('@/app/api/billing/subscription/route')
    const res = await DELETE(new Request('http://test'))
    expect(res.status).toBe(200)
    expect(providerMock.cancelSubscription).toHaveBeenCalled()
  })
})
