/**
 * PersistQ SDK
 *
 * Official TypeScript/JavaScript SDK for PersistQ - AI-powered persistent memory storage
 *
 * @example
 * ```typescript
 * import { createClient } from 'persistq-sdk'
 *
 * const client = createClient({
 *   baseUrl: 'https://your-backend.onrender.com',
 *   apiKey: 'your-api-key-here',
 * })
 *
 * // Create a memory
 * const result = await client.createMemory(
 *   'Meeting notes: Discussed Q4 roadmap',
 *   'work-meetings'
 * )
 *
 * // Search memories
 * const results = await client.searchMemories('roadmap', {
 *   limit: 5,
 *   project: 'work-meetings',
 * })
 * ```
 */

// Export the client class and factory function
export { MemoryHubClient, createClient } from './client'

// Export all types
export type {
  Memory,
  MemoryStats,
  SearchResult,
  ApiResponse,
  PaginatedResponse,
  MemoryHubConfig,
  CreateMemoryParams,
  UpdateMemoryParams,
  ListMemoriesParams,
  SearchMemoriesParams,
  CheckoutParams,
  ApiKeyStatus,
  GeneratedApiKey,
  HealthCheckResponse,
  PortalUrlResponse,
  CheckoutResponse,
} from './types'
