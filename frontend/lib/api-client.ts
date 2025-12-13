/**
 * Frontend API Client Wrapper
 *
 * This file maintains backward compatibility with existing code.
 * It wraps the @memoryhub/sdk package with Next.js-specific environment variable handling.
 */

// Re-export all types from SDK
export type {
  Memory,
  MemoryStats,
  SearchResult,
  ApiResponse,
  PaginatedResponse,
} from 'persistq-sdk'

// Re-export the client class
export { PersistQClient } from 'persistq-sdk'

// Validate API URL is configured (Next.js specific)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_BASE_URL) {
  throw new Error(
    'NEXT_PUBLIC_API_URL environment variable is required. ' +
    'Please set it in your .env.local file (e.g., https://your-backend.onrender.com)'
  )
}

// Create and export configured client instances
import { createClient as createSDKClient, PersistQClient } from 'persistq-sdk'

/**
 * Singleton client instance
 * Can be used throughout the app after setting API key
 */
export const apiClient = createSDKClient({
  baseUrl: API_BASE_URL,
})

/**
 * Create a new API client instance
 */
export function createClient(apiKey?: string): PersistQClient {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not configured')
  }
  return createSDKClient({
    baseUrl: API_BASE_URL,
    apiKey,
  })
}
