import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/embeddings', () => ({
  generateEmbedding: vi.fn(async () => [0.1, 0.2]),
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    $queryRaw: vi.fn(),
  },
}))

const prismaMock = (await import('@/lib/prisma')).prisma as any
const generateEmbedding = (await import('@/lib/embeddings')).generateEmbedding as unknown as ReturnType<typeof vi.fn>

describe('searchMemories', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('returns mapped search results', async () => {
    prismaMock.$queryRaw.mockResolvedValueOnce([
      { id: 'm1', content: 'text', project: 'p', metadata: { a: 1 }, created_at: new Date('2024-01-01'), similarity: 0.9 },
    ])

    const { searchMemories } = await import('@/lib/search')
    const results = await searchMemories('user-1', 'query', 5)

    expect(generateEmbedding).toHaveBeenCalledWith('query')
    expect(prismaMock.$queryRaw).toHaveBeenCalled()
    expect(results[0]).toMatchObject({ id: 'm1', text: 'text', score: 0.9 })
  })

  it('throws friendly error on failure', async () => {
    prismaMock.$queryRaw.mockRejectedValueOnce(new Error('db down'))
    const { searchMemories } = await import('@/lib/search')

    await expect(searchMemories('u', 'q')).rejects.toThrow('Failed to search memories')
  })
})
