import { describe, it, expect, vi, beforeEach } from 'vitest'

const deleteManyMock = vi.fn()
const findManyMock = vi.fn()
const transactionMock = vi.fn(async (cb) => cb({ user: { update: vi.fn() } } as any))
vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => ({
    webhookEvent: { deleteMany: deleteManyMock },
    user: { findMany: findManyMock },
    $transaction: transactionMock,
  })),
}))

vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((body, init) => ({ body, status: init?.status ?? 200 })),
  },
}))

vi.mock('@/lib/billing/audit', () => ({ logBillingEvent: vi.fn(async () => {}) }))

// Cleanup cron test already exists; this is for expire-subscriptions

describe('cron expire subscriptions', () => {
  beforeEach(() => {
    vi.resetModules()
    deleteManyMock.mockReset()
    findManyMock.mockReset()
    transactionMock.mockReset()
  })

  it('rejects unauthorized request', async () => {
    process.env.CRON_SECRET = 'secret'
    const { GET } = await import('@/app/api/cron/expire-subscriptions/route')
    const res = await GET(new Request('http://test', { headers: { authorization: 'Bearer wrong' } }))
    expect(res.status).toBe(401)
  })

  it('processes cancelled subscriptions and reports counts', async () => {
    process.env.CRON_SECRET = ''
    findManyMock
      .mockResolvedValueOnce([]) // orphaned
      .mockResolvedValueOnce([{ id: 'u1', email: 'a@b.com', planId: 'starter', subscriptionId: 'sub1', subscriptionStatus: 'canceled', currentPeriodEnd: new Date(), cancelAtPeriodEnd: true }])

    const { GET } = await import('@/app/api/cron/expire-subscriptions/route')
    const res = await GET(new Request('http://test'))
    expect(res.status).toBe(200)
    expect(res.body.processed).toBe(1)
    expect(transactionMock).toHaveBeenCalled()
  })
})
