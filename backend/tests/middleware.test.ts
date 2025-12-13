import { describe, it, expect, vi, beforeEach } from 'vitest'

class MockNextResponse {
  headers: Headers
  status: number
  body: any
  constructor(body: any, init?: { status?: number }) {
    this.body = body
    this.status = init?.status ?? 200
    this.headers = new Headers()
  }
  static json = vi.fn((body, init) => {
    const res = new MockNextResponse(body, init)
    return res
  })
  static next = vi.fn(() => new MockNextResponse(null, { status: 200 }))
}

vi.mock('next/server', () => ({
  NextResponse: MockNextResponse,
}))

vi.mock('@clerk/nextjs/server', () => ({ clerkMiddleware: (fn: any) => fn, createRouteMatcher: vi.fn() }))

describe('middleware CORS', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('handles OPTIONS with CORS headers', async () => {
    const mw = (await import('@/middleware')).default
    const req = {
      method: 'OPTIONS',
      headers: new Headers({ origin: 'http://localhost:3000' }),
      nextUrl: { pathname: '/api/foo' },
    } as any
    const res = await mw(() => ({} as any), req)
    expect(res.status).toBe(200)
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000')
  })

  it('adds CORS/security headers for API routes', async () => {
    const mw = (await import('@/middleware')).default
    const req = {
      method: 'GET',
      headers: new Headers({ origin: 'http://localhost:3000' }),
      nextUrl: { pathname: '/api/foo' },
    } as any
    const res = await mw(() => ({} as any), req)
    expect(res.headers.get('Access-Control-Allow-Methods')).toBe('GET, POST, PUT, DELETE, OPTIONS')
    expect(res.headers.get('X-Frame-Options')).toBe('DENY')
  })
})
