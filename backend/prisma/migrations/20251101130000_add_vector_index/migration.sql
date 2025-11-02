-- Add HNSW index for fast vector similarity search
-- HNSW (Hierarchical Navigable Small World) is better than IVFFlat for most use cases
-- Parameters:
--   m = 16 (number of connections per layer, higher = better recall but more memory)
--   ef_construction = 64 (size of dynamic candidate list, higher = better index quality but slower build)
CREATE INDEX IF NOT EXISTS memories_embedding_idx
ON memories
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Set ef_search for query time (higher = better recall but slower queries)
-- This is a session setting that clients can adjust based on their accuracy/speed needs
-- Default is 40, we'll document this for users to tune
