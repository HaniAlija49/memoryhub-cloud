import { describe, it, expect, vi, beforeEach } from 'vitest'

const queryRawMock = vi.fn()
vi.mock('@/lib/prisma', () => ({ prisma: { $queryRaw: queryRawMock } }))

vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((body, init) => ({ body, status: init?.status ?? 200 })),
  },
}))

describe('status route', () => {
  beforeEach(() => {
    vi.resetModules()
    queryRawMock.mockReset()
  })

  it('returns healthy when DB and pgvector succeed', async () => {
    queryRawMock.mockResolvedValue({})
    const { GET } = await import('@/app/api/status/route')
    const res = await GET()
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('healthy')
  })

  it('returns 503 when DB query fails', async () => {
    queryRawMock.mockRejectedValueOnce(new Error('db down'))
    const { GET } = await import('@/app/api/status/route')
    const res = await GET()
    expect(res.status).toBe(503)
    expect(res.body.status).toBe('unhealthy')
  })
})
