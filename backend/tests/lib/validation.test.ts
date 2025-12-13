import { describe, it, expect } from 'vitest'
import { validateRequest, saveMemorySchema, listMemoriesSchema, apiKeySchema } from '@/lib/validation'

describe('validateRequest helper', () => {
  it('returns parsed data on success', () => {
    const result = validateRequest(saveMemorySchema, {
      project: 'proj-1',
      content: 'hello world',
      metadata: { topic: 'test' },
    })

    expect(result).toEqual({
      success: true,
      data: {
        project: 'proj-1',
        content: 'hello world',
        metadata: { topic: 'test' },
      },
    })
  })

  it('returns error message on validation failure', () => {
    const result = validateRequest(saveMemorySchema, {
      project: '',
      content: '',
      metadata: 'not-an-object',
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toContain('Content cannot be empty')
    }
  })

  it('coerces pagination params and applies bounds', () => {
    const result = validateRequest(listMemoriesSchema, { limit: '10', offset: '0' })

    expect(result).toEqual({
      success: true,
      data: { limit: 10, offset: 0 },
    })
  })

  it('validates api key format', () => {
    const success = validateRequest(apiKeySchema, 'mh_'.padEnd(67, 'a'))
    const failure = validateRequest(apiKeySchema, 'invalid-key')

    expect(success.success).toBe(true)
    expect(failure.success).toBe(false)
  })
})
