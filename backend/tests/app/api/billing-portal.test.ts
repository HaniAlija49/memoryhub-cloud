import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((body, init) => ({ body, status: init?.status ?? 200 })),
  },
}))

const authRequestMock = vi.fn()
vi.mock('@/lib/clerk-auth-helper', () => ({ authenticateRequest: authRequestMock }))

let providerCreate: any
vi.mock('@/lib/billing/factory', () => {
  providerCreate = vi.fn(async () => ({ url: 'http://portal' }))
  return {
    getBillingProvider: vi.fn(() => ({ createPortalSession: providerCreate })),
    isBillingConfigured: vi.fn(() => true),
  }
})

vi.mock('@/lib/billing/ratelimit', () => ({ checkBillingRateLimit: vi.fn(async () => null) }))
vi.mock('@/lib/billing/errors', () => ({ createGenericErrorResponse: (e: any) => ({ error: String(e) }) }))
vi.mock('@/lib/env', () => ({ env: { NEXT_PUBLIC_APP_URL: 'http://app' } }))

const prismaMock = {
  user: {
    findUnique: vi.fn(),
  },
}
vi.mock('@prisma/client', () => ({ PrismaClient: vi.fn(() => prismaMock) }))

describe('billing portal route', () => {
  beforeEach(() => {
    vi.resetModules()
    prismaMock.user.findUnique.mockReset()
    authRequestMock.mockReset()
    providerCreate?.mockClear()
  })

  it('returns 401 when unauthorized', async () => {
    authRequestMock.mockResolvedValue({ userId: null })
    const { GET } = await import('@/app/api/billing/portal/route')
    const res = await GET(new Request('http://test'))
    expect(res.status).toBe(401)
  })

  it('returns 400 when no billing customer', async () => {
    authRequestMock.mockResolvedValue({ userId: 'clerk-1' })
    prismaMock.user.findUnique.mockResolvedValue({ id: 'u1', billingCustomerId: null })
    const { GET } = await import('@/app/api/billing/portal/route')
    const res = await GET(new Request('http://test'))
    expect(res.status).toBe(400)
  })

  it('returns portal url when user has customer id', async () => {
    authRequestMock.mockResolvedValue({ userId: 'clerk-1' })
    prismaMock.user.findUnique.mockResolvedValue({ id: 'u1', billingCustomerId: 'cust_1', email: 'a@b.com', clerkUserId: 'clerk-1', subscriptionId: null, subscriptionStatus: null, cancelAtPeriodEnd: false, planId: 'starter' })
    const { GET } = await import('@/app/api/billing/portal/route')
    const res = await GET(new Request('http://test'))
    expect(res.status).toBe(200)
    expect(res.body.data.url).toBe('http://portal')
  })
})
