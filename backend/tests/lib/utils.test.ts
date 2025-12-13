import { describe, it, expect, vi } from 'vitest'

vi.mock('next/server', () => {
  return {
    NextResponse: {
      json: vi.fn((body, init) => ({ body, init })),
    },
  }
})

import { createErrorResponse, createSuccessResponse, sanitizeInput, validateEmail } from '@/lib/utils'
import { NextResponse } from 'next/server'

describe('utils responses', () => {
  it('creates error response with status', () => {
    const res = createErrorResponse('boom', 418)
    const jsonSpy = NextResponse.json as unknown as ReturnType<typeof vi.fn>

    expect(jsonSpy).toHaveBeenCalledWith({ error: 'boom', status: 'error' }, { status: 418 })
    expect(res).toEqual({ body: { error: 'boom', status: 'error' }, init: { status: 418 } })
  })

  it('creates success response with status', () => {
    const payload = { data: 'ok' }
    const res = createSuccessResponse(payload, 201)
    const jsonSpy = NextResponse.json as unknown as ReturnType<typeof vi.fn>

    expect(jsonSpy).toHaveBeenCalledWith({ ...payload, status: 'success' }, { status: 201 })
    expect(res.body.status).toBe('success')
  })
})

describe('utils helpers', () => {
  it('validates email format', () => {
    expect(validateEmail('user@example.com')).toBe(true)
    expect(validateEmail('bad-email')).toBe(false)
  })

  it('sanitizes input and truncates', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello')
    expect(sanitizeInput('', 5)).toBe('')
    expect(sanitizeInput('abcdef', 3)).toBe('abc')
  })
})
