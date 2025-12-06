/**
 * TypeScript Type Definitions for PersistQ SDK
 */

export interface Memory {
  id: string
  userId: string
  project: string | null
  content: string
  metadata: Record<string, any> | null
  createdAt: string
}

export interface MemoryStats {
  totalMemories: number
  memoriesByProject: Record<string, number>
  recentMemories: Memory[]
}

export interface SearchResult {
  id: string
  content: string
  project: string | null
  metadata: Record<string, any> | null
  similarity: number
  createdAt: string
}

export interface ApiResponse<T> {
  status: 'success' | 'error'
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  status: 'success' | 'error'
  data?: {
    memories: T[]
    total: number
    offset: number
    limit: number
  }
  error?: string
}

export interface MemoryHubConfig {
  baseUrl: string
  apiKey?: string
}

export interface CreateMemoryParams {
  content: string
  project?: string
  metadata?: Record<string, any>
}

export interface UpdateMemoryParams {
  content?: string
  project?: string
  metadata?: Record<string, any>
}

export interface ListMemoriesParams {
  offset?: number
  limit?: number
  project?: string
}

export interface SearchMemoriesParams {
  limit?: number
  project?: string
  threshold?: number
}

export interface CheckoutParams {
  planId: string
  interval: 'monthly' | 'yearly'
}

export interface ApiKeyStatus {
  hasApiKey: boolean
  apiKey: string | null
  userId?: string
  email: string | null
}

export interface GeneratedApiKey {
  apiKey: string
  userId: string
  email: string
}

export interface HealthCheckResponse {
  status: string
  database: string
  redis: string
  timestamp: string
}

export interface PortalUrlResponse {
  url: string
}

export interface CheckoutResponse {
  url: string
  sessionId: string
}
