/**
 * Statistics Service
 *
 * Handles user statistics and analytics data.
 */

import { apiClient, type MemoryStats } from '@/lib/api-client'

export interface UserStats {
  totalMemories: number
  memoriesByProject: Record<string, number>
  recentMemories: Array<{
    id: string
    content: string
    project: string | null
    createdAt: string
  }>
}

export interface HealthStatus {
  status: string
  database: string
  redis: string
  timestamp: string
}

export class StatsService {
  /**
   * Get user statistics
   */
  static async getUserStats(): Promise<UserStats | null> {
    try {
      const response = await apiClient.getStats()

      if (response.status === 'error') {
        console.error('Failed to get stats:', response.error)
        return null
      }

      return response.data || null
    } catch (error) {
      console.error('Error getting stats:', error)
      return null
    }
  }

  /**
   * Get total number of memories
   */
  static async getTotalMemories(): Promise<number> {
    try {
      const stats = await this.getUserStats()
      return stats?.totalMemories || 0
    } catch (error) {
      console.error('Error getting total memories:', error)
      return 0
    }
  }

  /**
   * Get memories grouped by project
   */
  static async getMemoriesByProject(): Promise<Record<string, number>> {
    try {
      const stats = await this.getUserStats()
      return stats?.memoriesByProject || {}
    } catch (error) {
      console.error('Error getting memories by project:', error)
      return {}
    }
  }

  /**
   * Get recent memories
   */
  static async getRecentMemories(limit: number = 5): Promise<UserStats['recentMemories']> {
    try {
      const stats = await this.getUserStats()
      return stats?.recentMemories.slice(0, limit) || []
    } catch (error) {
      console.error('Error getting recent memories:', error)
      return []
    }
  }

  /**
   * Get project statistics
   */
  static async getProjectStats(): Promise<{
    totalProjects: number
    projects: Array<{ name: string; count: number }>
  }> {
    try {
      const memoriesByProject = await this.getMemoriesByProject()

      const projects = Object.entries(memoriesByProject)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)

      return {
        totalProjects: projects.length,
        projects,
      }
    } catch (error) {
      console.error('Error getting project stats:', error)
      return { totalProjects: 0, projects: [] }
    }
  }

  /**
   * Get dashboard metrics
   */
  static async getDashboardMetrics(): Promise<{
    totalMemories: number
    totalProjects: number
    recentActivity: number
    topProject: { name: string; count: number } | null
  }> {
    try {
      const stats = await this.getUserStats()

      if (!stats) {
        return {
          totalMemories: 0,
          totalProjects: 0,
          recentActivity: 0,
          topProject: null,
        }
      }

      const projects = Object.entries(stats.memoriesByProject)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)

      const topProject = projects[0] || null

      // Recent activity = memories created in last 7 days (simplified)
      const recentActivity = stats.recentMemories.length

      return {
        totalMemories: stats.totalMemories,
        totalProjects: projects.length,
        recentActivity,
        topProject,
      }
    } catch (error) {
      console.error('Error getting dashboard metrics:', error)
      return {
        totalMemories: 0,
        totalProjects: 0,
        recentActivity: 0,
        topProject: null,
      }
    }
  }

  /**
   * Check API health status
   */
  static async checkHealth(): Promise<HealthStatus | null> {
    try {
      const response = await apiClient.healthCheck()

      if (response.status === 'error') {
        console.error('Health check failed:', response.error)
        return null
      }

      return response.data || null
    } catch (error) {
      console.error('Error checking health:', error)
      return null
    }
  }

  /**
   * Check if API is available
   */
  static async isApiAvailable(): Promise<boolean> {
    try {
      const health = await this.checkHealth()
      return health?.status === 'ok'
    } catch (error) {
      return false
    }
  }
}
