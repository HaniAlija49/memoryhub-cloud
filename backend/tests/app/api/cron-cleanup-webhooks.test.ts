import { describe, it, expect, vi, beforeEach } from 'vitest'

const deleteManyMock = vi.fn()
vi.mock('@prisma/client', () => ({ PrismaClient: vi.fn(() => ({ webhookEvent: { deleteMany: deleteManyMock } })) }))

vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((body, init) => ({ body, status: init?.status ?? 200 })),
  },
}))

describe('cron cleanup webhooks', () => {
  beforeEach(() => {
    vi.resetModules()
    deleteManyMock.mockReset()
  })

  it('rejects unauthorized request', async () => {
    process.env.CRON_SECRET = 'secret'
    const { GET } = await import('@/app/api/cron/cleanup-webhooks/route')
    const res = await GET(new Request('http://test', { headers: { authorization: 'Bearer wrong' } }))
    expect(res.status).toBe(401)
  })

  it('returns deleted count on success', async () => {
    process.env.CRON_SECRET = ''
    deleteManyMock.mockResolvedValue({ count: 2 })
    const { GET } = await import('@/app/api/cron/cleanup-webhooks/route')
    const res = await GET(new Request('http://test'))
    expect(res.status).toBe(200)
    expect(res.body.deleted).toBe(2)
  })
})
