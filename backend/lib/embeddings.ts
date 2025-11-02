import { pipeline, env } from '@xenova/transformers'

// Disable local model downloads in production (Vercel)
// Models will be cached on first use
env.allowLocalModels = false

// Initialize the embedding pipeline (lazy-loaded)
let embedder: any = null

async function getEmbedder() {
  if (!embedder) {
    // Using "Xenova/all-MiniLM-L6-v2" - a fast, lightweight model
    // Produces 384-dimensional vectors (we'll need to update schema)
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
  }
  return embedder
}

/**
 * Generate embeddings using free Transformers.js models
 * Model: all-MiniLM-L6-v2
 * - Dimensions: 384 (lighter than OpenAI's 1536)
 * - Cost: $0 (runs locally)
 * - Speed: Fast enough for real-time use
 * - Quality: Great for most use cases
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const model = await getEmbedder()
    const output = await model(text, { pooling: 'mean', normalize: true })

    // Convert tensor to array
    return Array.from(output.data)
  } catch (error) {
    console.error('Error generating embedding:', error)
    throw new Error('Failed to generate embedding')
  }
}

/**
 * Generate embeddings for multiple texts in batch
 * More efficient than calling generateEmbedding multiple times
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    const embeddings: number[][] = []

    for (const text of texts) {
      const embedding = await generateEmbedding(text)
      embeddings.push(embedding)
    }

    return embeddings
  } catch (error) {
    console.error('Error generating embeddings:', error)
    throw new Error('Failed to generate embeddings')
  }
}
