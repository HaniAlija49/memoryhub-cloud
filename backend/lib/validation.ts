import { z } from 'zod'

// Email validation schema
export const emailSchema = z.string().email().max(255).trim().toLowerCase()

// Memory content validation
// Note: Embedding model (all-MiniLM-L6-v2) handles ~512 tokens optimally
// Keeping 10K chars limit but recommend <2K for best results
export const memoryContentSchema = z.string().min(1, 'Content cannot be empty').max(10000, 'Content must be less than 10,000 characters')

// Project name validation
export const projectNameSchema = z.string().min(1).max(100).trim()

// Metadata validation (JSON object with size limit)
export const metadataSchema = z.record(z.unknown()).optional()

// Pagination schemas
export const limitSchema = z.coerce.number().int().min(1).max(100).default(50)
export const offsetSchema = z.coerce.number().int().min(0).max(1000, 'Maximum offset is 1000 to prevent excessive pagination').default(0)

// Search query validation
export const searchQuerySchema = z.string().min(1).max(500)

// API key format validation
export const apiKeySchema = z.string().regex(/^mh_[a-f0-9]{64}$/, 'Invalid API key format')

// Register request schema
export const registerSchema = z.object({
  email: emailSchema,
})

// Login request schema
export const loginSchema = z.object({
  email: emailSchema,
})

// Save memory request schema
export const saveMemorySchema = z.object({
  project: projectNameSchema.optional(),
  content: memoryContentSchema,
  metadata: metadataSchema,
})

// Search memory request schema
export const searchMemorySchema = z.object({
  query: searchQuerySchema,
  limit: limitSchema.optional(),
})

// List memories query schema
export const listMemoriesSchema = z.object({
  project: projectNameSchema.optional(),
  limit: limitSchema.optional(),
  offset: offsetSchema.optional(),
})

// Validation helper
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  try {
    const validated = schema.parse(data)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      return { success: false, error: messages }
    }
    return { success: false, error: 'Validation failed' }
  }
}
