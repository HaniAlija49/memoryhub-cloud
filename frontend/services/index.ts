/**
 * Services Index
 *
 * Central export point for all service modules.
 * Import services from here instead of individual files.
 *
 * Example:
 * import { MemoryService, AuthService, StatsService } from '@/services'
 */

export { AuthService } from './auth.service'
export type { ApiKeyData } from './auth.service'

export { MemoryService } from './memory.service'
export type {
  CreateMemoryInput,
  UpdateMemoryInput,
  ListMemoriesParams,
  SearchMemoriesParams,
  PaginatedMemories,
  Memory,
  SearchResult,
} from './memory.service'

export { StatsService } from './stats.service'
export type { UserStats, HealthStatus } from './stats.service'
