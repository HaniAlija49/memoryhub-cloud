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

export interface PersistQConfig {
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
  apiKey: string | null  // Full key always available for copying
  userId?: string
  email: string | null
}

export interface GeneratedApiKey {
  apiKey: string  // Full key
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

export interface DocumentChunk {
  content: string;
  metadata: {
    source: string;
    fileName: string;
    fileType: 'pdf' | 'docx';
    originalSize: number;
    chunkIndex: number;
    totalChunks: number;
    processingMethod: 'recursive' | 'semantic' | 'fixed';
    extractedAt: string;
    documentTitle?: string;
    author?: string;
    project?: string;
  };
}

export interface ProcessingStats {
  totalChunks: number;
  totalCharacters: number;
  processingTime: number;
  fileType: string;
  fileName: string;
}

export interface ProcessDocumentParams {
  file: File;
  chunkSize?: number;
  chunkOverlap?: number;
  processingMethod?: 'recursive' | 'semantic' | 'fixed';
  project?: string;
}

export interface ProcessDocumentResponse {
  success: boolean;
  chunks: DocumentChunk[];
  stats: ProcessingStats;
}
