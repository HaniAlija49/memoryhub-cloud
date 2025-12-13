/**
 * PersistQ API Client
 *
 * Handles all communication with the PersistQ API backend.
 * Automatically manages API key authentication and error handling.
 */

import type {
  Memory,
  MemoryStats,
  SearchResult,
  ApiResponse,
  PaginatedResponse,
  PersistQConfig,
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
  DocumentChunk,
  ProcessingStats,
  ProcessDocumentParams,
  ProcessDocumentResponse,
} from './types'

/**
 * API Client Class
 * Manages all API calls with automatic authentication
 */
export class PersistQClient {
  private apiKey: string | null = null
  private clerkToken: string | null = null
  private baseUrl: string

  constructor(config: PersistQConfig) {
    this.baseUrl = config.baseUrl
    if (config.apiKey) {
      this.apiKey = config.apiKey
    }
  }

  /**
   * Set the API key for authentication
   */
  setApiKey(apiKey: string) {
    this.apiKey = apiKey
  }

  /**
   * Get the current API key
   */
  getApiKey(): string | null {
    return this.apiKey
  }

  /**
   * Set the Clerk session token for Clerk-protected routes
   */
  setClerkToken(token: string | null) {
    this.clerkToken = token
  }

  /**
   * Make an authenticated request to the API
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    useClerkAuth: boolean = false
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    }
    
    // Only set Content-Type to application/json if not FormData
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }

    // For Clerk-protected routes (like /api/auth/clerk-link), use Clerk token
    if (useClerkAuth && this.clerkToken) {
      headers['Authorization'] = `Bearer ${this.clerkToken}`
    }
    // For regular API routes, use API key
    else if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include', // Include cookies for cross-origin requests
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          status: 'error',
          error: data.error || `HTTP ${response.status}: ${response.statusText}`,
        }
      }

      return data
    } catch (error) {
      console.error('API request failed:', error)
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Network error',
      }
    }
  }

  /**
   * Check if user has an API key (returns null if not generated yet)
   */
  async getApiKeyStatus(): Promise<ApiResponse<ApiKeyStatus>> {
    return this.request('/api/api-keys', {
      method: 'GET',
    }, true) // Use Clerk authentication
  }

  /**
   * Generate API key for authenticated Clerk user (first time)
   */
  async generateApiKey(): Promise<ApiResponse<GeneratedApiKey>> {
    return this.request('/api/api-keys', {
      method: 'POST',
    }, true) // Use Clerk authentication
  }

  /**
   * Regenerate API key for authenticated Clerk user (replaces existing)
   */
  async regenerateApiKey(): Promise<ApiResponse<GeneratedApiKey>> {
    return this.request('/api/api-keys', {
      method: 'PUT',
    }, true) // Use Clerk authentication
  }

  /**
   * Save a new memory
   */
  async createMemory(
    content: string,
    project?: string,
    metadata?: Record<string, any>
  ): Promise<ApiResponse<{ memoryId: string }>> {
    return this.request('/api/memory', {
      method: 'POST',
      body: JSON.stringify({ content, project, metadata }),
    })
  }

  /**
   * Get a specific memory by ID
   */
  async getMemory(id: string): Promise<ApiResponse<Memory>> {
    return this.request(`/api/memory/${id}`, {
      method: 'GET',
    })
  }

  /**
   * Update a memory
   */
  async updateMemory(
    id: string,
    updates: UpdateMemoryParams
  ): Promise<ApiResponse<{ success: boolean }>> {
    return this.request(`/api/memory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  /**
   * Delete a memory
   */
  async deleteMemory(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.request(`/api/memory/${id}`, {
      method: 'DELETE',
    })
  }

  /**
   * List memories with pagination
   */
  async listMemories(params?: ListMemoriesParams): Promise<PaginatedResponse<Memory>> {
    const queryParams = new URLSearchParams()
    if (params?.offset) queryParams.append('offset', params.offset.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.project) queryParams.append('project', params.project)

    const query = queryParams.toString()
    return this.request(`/api/memory/list${query ? `?${query}` : ''}`, {
      method: 'GET',
    })
  }

  /**
   * Search memories semantically
   */
  async searchMemories(
    query: string,
    options?: SearchMemoriesParams
  ): Promise<ApiResponse<SearchResult[]>> {
    return this.request('/api/memory/search', {
      method: 'POST',
      body: JSON.stringify({
        query,
        limit: options?.limit,
        project: options?.project,
        threshold: options?.threshold,
      }),
    })
  }

  /**
   * Get memory statistics
   */
  async getStats(): Promise<ApiResponse<MemoryStats>> {
    return this.request('/api/memory/stats', {
      method: 'GET',
    })
  }

  /**
   * Check API health
   */
  async healthCheck(): Promise<ApiResponse<HealthCheckResponse>> {
    return this.request('/api/status', {
      method: 'GET',
    })
  }

  /**
   * Get billing subscription and usage data
   */
  async getBilling(): Promise<ApiResponse<any>> {
    return this.request('/api/billing/subscription', {
      method: 'GET',
    }, true) // Use Clerk auth
  }

  /**
   * Create checkout session for plan purchase
   */
  async createCheckout(
    planId: string,
    interval: 'monthly' | 'yearly'
  ): Promise<ApiResponse<CheckoutResponse>> {
    return this.request('/api/billing/checkout', {
      method: 'POST',
      body: JSON.stringify({ planId, interval }),
    }, true)
  }

  /**
   * Update subscription (upgrade/downgrade)
   */
  async updateSubscription(
    planId: string,
    interval: 'monthly' | 'yearly'
  ): Promise<ApiResponse<any>> {
    return this.request('/api/billing/subscription', {
      method: 'POST',
      body: JSON.stringify({ planId, interval }),
    }, true)
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(immediate: boolean = false): Promise<ApiResponse<any>> {
    return this.request(
      `/api/billing/subscription?immediate=${immediate}`,
      { method: 'DELETE' },
      true
    )
  }

  /**
   * Reactivate subscription
   */
  async reactivateSubscription(): Promise<ApiResponse<any>> {
    return this.request(
      `/api/billing/subscription/reactivate`,
      { method: 'POST' },
      true
    )
  }

  /**
   * Get customer portal URL
   */
  async getPortalUrl(): Promise<ApiResponse<PortalUrlResponse>> {
    return this.request('/api/billing/portal', {
      method: 'GET',
    }, true)
  }

  /**
   * Process document and extract text chunks
   */
  async processDocument(
    params: ProcessDocumentParams
  ): Promise<ApiResponse<ProcessDocumentResponse>> {
    const formData = new FormData()
    formData.append('file', params.file)
    
    if (params.chunkSize) {
      formData.append('chunkSize', params.chunkSize.toString())
    }
    
    if (params.chunkOverlap) {
      formData.append('chunkOverlap', params.chunkOverlap.toString())
    }
    
    if (params.processingMethod) {
      formData.append('processingMethod', params.processingMethod)
    }
    
    if (params.project) {
      formData.append('project', params.project)
    }

    return this.request('/api/memory/process-document', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    })
  }
}

/**
 * Create a new API client instance
 */
export function createClient(config: PersistQConfig): PersistQClient {
  return new PersistQClient(config)
}
