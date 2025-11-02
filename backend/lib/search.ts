import { prisma } from './prisma'
import { generateEmbedding } from './embeddings'

/**
 * Semantic search using pgvector + OpenAI embeddings
 * Provides similar functionality to Mem0 but fully integrated with Postgres
 */

export async function searchMemories(userId: string, query: string, limit: number = 10) {
  try {
    // Generate embedding for the search query
    const queryEmbedding = await generateEmbedding(query)

    // Convert embedding to pgvector format (array string)
    const vectorString = `[${queryEmbedding.join(',')}]`

    // Perform cosine similarity search using raw SQL
    // Cosine distance: 1 - cosine similarity (lower is better)
    const results = await prisma.$queryRaw<Array<{
      id: string
      content: string
      project: string | null
      metadata: any
      created_at: Date
      similarity: number
    }>>`
      SELECT
        id,
        content,
        project,
        metadata,
        created_at,
        1 - (embedding <=> ${vectorString}::vector) as similarity
      FROM memories
      WHERE user_id = ${userId}
        AND embedding IS NOT NULL
      ORDER BY embedding <=> ${vectorString}::vector
      LIMIT ${limit}
    `

    return results.map(r => ({
      id: r.id,
      text: r.content,
      metadata: r.metadata,
      score: r.similarity,
      created_at: r.created_at.toISOString(),
    }))
  } catch (error) {
    console.error('Error searching memories:', error)
    throw new Error('Failed to search memories')
  }
}
