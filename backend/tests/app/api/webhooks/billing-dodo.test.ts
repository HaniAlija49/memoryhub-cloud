import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((body, init) => ({ body, status: init?.status ?? 200 })),
  },
}))

// Default headers mock; can be overridden per test
const headersMock = vi.fn()
vi.mock('next/headers', () => ({ headers: headersMock }))

const providerMock = {
  verifyWebhook: vi.fn(),
}

vi.mock('@/lib/billing/factory', () => ({
  getBillingProvider: vi.fn(() => providerMock),
}))

vi.mock('@/lib/env', () => ({ env: { DODO_WEBHOOK_SECRET: 'secret' } }))

const handleBillingEventMock = vi.fn()
vi.mock('@/lib/billing/events', () => ({ handleBillingEvent: handleBillingEventMock }))

const prismaMock = {
  webhookEvent: {
    create: vi.fn(),
  },
}
vi.mock('@prisma/client', () => ({ PrismaClient: vi.fn(() => prismaMock as any) }))

describe.skip('dodo webhook route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.DODO_WEBHOOK_SECRET = 'secret'
    const h = new Headers()
    h.set('webhook-id', 'wh_1')
    h.set('webhook-signature', 'sig')
    h.set('webhook-timestamp', `${Math.floor(Date.now() / 1000)}`)
    headersMock.mockResolvedValue(h)
    providerMock.verifyWebhook = vi.fn().mockResolvedValue({
      type: 'subscription.created',
      provider: 'dodo',
      rawEvent: { id: 'e1' },
    })
    handleBillingEventMock.mockReset()
    prismaMock.webhookEvent.create.mockReset()
    prismaMock.webhookEvent.create.mockResolvedValue({})
  })

  it.skip('returns 400 when headers missing', async () => {
    headersMock.mockResolvedValue(new Headers())
    const { POST } = await import('@/app/api/webhooks/billing/dodo/route')
    const res = await POST(new Request('http://test', { method: 'POST', body: 'payload' }))
    expect(res.status).toBe(400)
  })

  it.skip('returns 401 on invalid signature', async () => {
    providerMock.verifyWebhook = vi.fn(() => {
      throw new Error('bad signature')
    })
    const { POST } = await import('@/app/api/webhooks/billing/dodo/route')
    const res = await POST(new Request('http://test', { method: 'POST', body: 'payload' }))
    expect(res.status).toBe(401)
  })

  it.skip('acknowledges valid event', async () => {
    providerMock.verifyWebhook = vi.fn().mockResolvedValue({
      type: 'subscription.created',
      provider: 'dodo',
      rawEvent: { id: 'e1' },
    })
    const { POST } = await import('@/app/api/webhooks/billing/dodo/route')
    const res = await POST(new Request('http://test', { method: 'POST', body: 'payload' }))
    expect(res.status).toBe(200)
    expect(handleBillingEventMock).toHaveBeenCalled()
    expect(prismaMock.webhookEvent.create).toHaveBeenCalled()
  })
})
