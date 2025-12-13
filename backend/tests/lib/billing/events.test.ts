import { beforeEach, describe, expect, it, vi } from 'vitest'

const findUniqueMock = vi.fn()
const updateMock = vi.fn()
const transactionMock = vi.fn(async (fn: any) => fn({ user: { update: updateMock } }))
const logBillingEventMock = vi.fn()

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn().mockImplementation(() => ({
    user: {
      findUnique: findUniqueMock,
      update: updateMock,
    },
    $transaction: transactionMock,
  })),
}))

vi.mock('@/lib/billing/audit', () => ({
  logBillingEvent: logBillingEventMock,
}))

describe('billing events', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    findUniqueMock.mockReset()
    updateMock.mockReset()
    transactionMock.mockClear()
    logBillingEventMock.mockReset()
  })

  it('routes unknown events without throwing', async () => {
    const { handleBillingEvent } = await import('@/lib/billing/events')
    await expect(
      handleBillingEvent({
        type: 'unknown.event',
        provider: 'dodo',
        customerId: 'c1',
        data: {},
      } as any),
    ).resolves.toBeUndefined()
  })

  it('marks payment failed and logs audit when user found', async () => {
    findUniqueMock.mockResolvedValue({ id: 'u1', planId: 'pro' })
    const { handleBillingEvent } = await import('@/lib/billing/events')

    await handleBillingEvent({
      type: 'payment.failed',
      provider: 'dodo',
      customerId: 'c1',
      data: { id: 'p1', amount: 1000, currency: 'usd', failureReason: 'card' },
    } as any)

    expect(findUniqueMock).toHaveBeenCalled()
    expect(transactionMock).toHaveBeenCalled()
    expect(updateMock).toHaveBeenCalledWith({
      where: { id: 'u1' },
      data: { subscriptionStatus: 'past_due', version: { increment: 1 } },
    })
    expect(logBillingEventMock).toHaveBeenCalledWith(
      'u1',
      'payment.failed',
      expect.objectContaining({ paymentId: 'p1', failureReason: 'card' }),
      { tx: expect.any(Object) },
    )
  })

  it('ignores payment failed when user missing', async () => {
    findUniqueMock.mockResolvedValue(null)
    const { handleBillingEvent } = await import('@/lib/billing/events')

    await handleBillingEvent({
      type: 'payment.failed',
      provider: 'dodo',
      customerId: 'missing',
      data: { id: 'p2', amount: 500, currency: 'usd' },
    } as any)

    expect(transactionMock).not.toHaveBeenCalled()
    expect(logBillingEventMock).not.toHaveBeenCalled()
  })

  it('deletes customer billing data when customer deleted', async () => {
    findUniqueMock.mockResolvedValue({ id: 'u2', planId: 'pro' })
    const { handleBillingEvent } = await import('@/lib/billing/events')

    await handleBillingEvent({
      type: 'customer.deleted',
      provider: 'dodo',
      customerId: 'c-del',
      data: {},
    } as any)

    expect(transactionMock).toHaveBeenCalled()
    expect(updateMock).toHaveBeenCalledWith({
      where: { id: 'u2' },
      data: expect.objectContaining({
        billingProvider: null,
        billingCustomerId: null,
        subscriptionId: null,
        planId: 'free',
        cancelAtPeriodEnd: false,
      }),
    })
    expect(logBillingEventMock).toHaveBeenCalledWith(
      'u2',
      'customer.deleted',
      expect.objectContaining({ customerId: 'c-del' }),
      { tx: expect.any(Object) },
    )
  })

  it('returns existing billing customer id from user', async () => {
    findUniqueMock.mockResolvedValue({ id: 'u3', billingCustomerId: 'cust-123' })
    const { getOrCreateBillingCustomer } = await import('@/lib/billing/events')

    const result = await getOrCreateBillingCustomer('u3', 'a@b.com')
    expect(result).toBe('cust-123')
  })

  it('throws when user not found while creating billing customer', async () => {
    findUniqueMock.mockResolvedValue(null)
    const { getOrCreateBillingCustomer } = await import('@/lib/billing/events')
    await expect(getOrCreateBillingCustomer('missing', 'a@b.com')).rejects.toThrow(
      'User missing not found',
    )
  })
})
