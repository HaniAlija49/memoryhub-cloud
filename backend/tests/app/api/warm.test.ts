import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((body, init) => ({ body, status: init?.status ?? 200 })),
  },
}))

const generateEmbeddingMock = vi.fn()
vi.mock('@/lib/embeddings', () => ({ generateEmbedding: generateEmbeddingMock }))

describe('warm route', () => {
  beforeEach(() => {
    vi.resetModules()
    generateEmbeddingMock.mockReset()
  })

  it('returns 401 when cron secret mismatch', async () => {
    process.env.CRON_SECRET = 'secret'
    const { GET } = await import('@/app/api/warm/route')
    const res = await GET(new Request('http://test', { headers: { authorization: 'Bearer wrong' } }) as any)
    expect(res.status).toBe(401)
  })

  it('warms model and returns duration', async () => {
    process.env.CRON_SECRET = ''
    generateEmbeddingMock.mockResolvedValue([0.1])
    const { GET } = await import('@/app/api/warm/route')
    const res = await GET(new Request('http://test') as any)
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('warm')
    expect(generateEmbeddingMock).toHaveBeenCalled()
  })
})
