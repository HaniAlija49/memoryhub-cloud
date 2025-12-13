import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockEmbed = vi.fn()

vi.mock('@xenova/transformers', () => ({
  pipeline: vi.fn(async () => mockEmbed),
  env: { allowLocalModels: true },
}))

describe('embeddings', () => {
  beforeEach(() => {
    mockEmbed.mockReset()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('generates embedding via pipeline', async () => {
    mockEmbed.mockResolvedValueOnce({ data: [1, 2, 3] })

    const { generateEmbedding } = await import('@/lib/embeddings')
    const result = await generateEmbedding('hello')

    expect(result).toEqual([1, 2, 3])
  })

  it('batches embeddings', async () => {
    mockEmbed.mockResolvedValue({ data: [0] })
    const { generateEmbeddings } = await import('@/lib/embeddings')

    const result = await generateEmbeddings(['a', 'b'])
    expect(result).toEqual([[0], [0]])
    expect(mockEmbed).toHaveBeenCalledTimes(2)
  })

  it('wraps errors with friendly message', async () => {
    mockEmbed.mockRejectedValueOnce(new Error('model missing'))
    const { generateEmbedding } = await import('@/lib/embeddings')

    await expect(generateEmbedding('oops')).rejects.toThrow('Failed to generate embedding')
  })
})
