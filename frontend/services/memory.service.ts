/**
 * Memory Service
 *
 * Handles all memory-related operations including CRUD and search.
 */

import { apiClient, type Memory, type SearchResult } from '@/lib/api-client'

export interface CreateMemoryInput {
  content: string
  project?: string
  metadata?: Record<string, any>
}

export interface UpdateMemoryInput {
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
  query: string
  limit?: number
  project?: string
  threshold?: number
}

export interface PaginatedMemories {
  memories: Memory[]
  total: number
  offset: number
  limit: number
  hasMore: boolean
}

export class MemoryService {
  /**
   * Create a new memory
   */
  static async create(input: CreateMemoryInput): Promise<string | null> {
    try {
      const response = await apiClient.createMemory(
        input.content,
        input.project,
        input.metadata
      )

      if (response.status === 'error') {
        console.error('Failed to create memory:', response.error)
        return null
      }

      return response.data?.memoryId || null
    } catch (error) {
      console.error('Error creating memory:', error)
      return null
    }
  }

  /**
   * Get a specific memory by ID
   */
  static async getById(id: string): Promise<Memory | null> {
    try {
      const response = await apiClient.getMemory(id)

      if (response.status === 'error') {
        console.error('Failed to get memory:', response.error)
        return null
      }

      return response.data || null
    } catch (error) {
      console.error('Error getting memory:', error)
      return null
    }
  }

  /**
   * Update a memory
   */
  static async update(id: string, updates: UpdateMemoryInput): Promise<boolean> {
    try {
      const response = await apiClient.updateMemory(id, updates)

      if (response.status === 'error') {
        console.error('Failed to update memory:', response.error)
        return false
      }

      return response.data?.success || false
    } catch (error) {
      console.error('Error updating memory:', error)
      return false
    }
  }

  /**
   * Delete a memory
   */
  static async delete(id: string): Promise<boolean> {
    try {
      const response = await apiClient.deleteMemory(id)

      if (response.status === 'error') {
        console.error('Failed to delete memory:', response.error)
        return false
      }

      return response.data?.success || false
    } catch (error) {
      console.error('Error deleting memory:', error)
      return false
    }
  }

  /**
   * List memories with pagination
   */
  static async list(params?: ListMemoriesParams): Promise<PaginatedMemories | null> {
    try {
      const response = await apiClient.listMemories(params)

      if (response.status === 'error') {
        console.error('Failed to list memories:', response.error)
        return null
      }

      if (!response.data) {
        return null
      }

      const { memories, total, offset, limit } = response.data

      return {
        memories,
        total,
        offset,
        limit,
        hasMore: offset + memories.length < total,
      }
    } catch (error) {
      console.error('Error listing memories:', error)
      return null
    }
  }

  /**
   * Search memories using semantic search
   */
  static async search(params: SearchMemoriesParams): Promise<SearchResult[] | null> {
    try {
      const response = await apiClient.searchMemories(params.query, {
        limit: params.limit,
        project: params.project,
        threshold: params.threshold,
      })

      if (response.status === 'error') {
        console.error('Failed to search memories:', response.error)
        return null
      }

      return response.data || null
    } catch (error) {
      console.error('Error searching memories:', error)
      return null
    }
  }

  /**
   * Get all unique projects from user's memories
   */
  static async getProjects(): Promise<string[]> {
    try {
      // Get all memories and extract unique projects
      const result = await this.list({ limit: 1000 })

      if (!result) {
        return []
      }

      const projects = new Set<string>()
      result.memories.forEach((memory) => {
        if (memory.project) {
          projects.add(memory.project)
        }
      })

      return Array.from(projects).sort()
    } catch (error) {
      console.error('Error getting projects:', error)
      return []
    }
  }

  /**
   * Get memories by project
   */
  static async getByProject(
    project: string,
    params?: { offset?: number; limit?: number }
  ): Promise<PaginatedMemories | null> {
    return this.list({
      ...params,
      project,
    })
  }

  /**
   * Bulk delete memories
   */
  static async bulkDelete(ids: string[]): Promise<{
    success: number
    failed: number
  }> {
    let success = 0
    let failed = 0

    for (const id of ids) {
      const result = await this.delete(id)
      if (result) {
        success++
      } else {
        failed++
      }
    }

    return { success, failed }
  }
}

// Export types
export type { Memory, SearchResult }
