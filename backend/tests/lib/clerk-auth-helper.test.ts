import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}))

vi.mock('@clerk/backend', () => ({
  verifyToken: vi.fn(),
}))

describe('authenticateRequest', () => {
  let authMock: any
  let verifyTokenMock: any

  beforeEach(async () => {
    vi.resetModules()
    ;({ auth: authMock } = await import('@clerk/nextjs/server') as any)
    ;({ verifyToken: verifyTokenMock } = await import('@clerk/backend') as any)
    authMock.mockReset()
    verifyTokenMock.mockReset()
    process.env.CLERK_SECRET_KEY = 'secret'
  })

  it('returns cookie auth when present', async () => {
    authMock.mockResolvedValue({ userId: 'u1', sessionId: 's1' })
    const { authenticateRequest } = await import('@/lib/clerk-auth-helper')
    const res = await authenticateRequest(new Request('http://test'))
    expect(res.userId).toBe('u1')
    expect(res.sessionId).toBe('s1')
  })

  it('returns null when no bearer and cookie missing', async () => {
    authMock.mockResolvedValue({ userId: null, sessionId: null })
    const { authenticateRequest } = await import('@/lib/clerk-auth-helper')
    const res = await authenticateRequest(new Request('http://test'))
    expect(res.userId).toBeNull()
  })

  it('verifies bearer token when provided', async () => {
    authMock.mockResolvedValue({ userId: null, sessionId: null })
    verifyTokenMock.mockResolvedValue({ sub: 'u2', sid: 's2' })
    const { authenticateRequest } = await import('@/lib/clerk-auth-helper')
    const req = new Request('http://test', { headers: { authorization: 'Bearer token' } })
    const res = await authenticateRequest(req)
    expect(verifyTokenMock).toHaveBeenCalled()
    expect(res.userId).toBe('u2')
    expect(res.sessionId).toBe('s2')
  })

  it('returns null if secret missing', async () => {
    process.env.CLERK_SECRET_KEY = ''
    authMock.mockResolvedValue({ userId: null, sessionId: null })
    const { authenticateRequest } = await import('@/lib/clerk-auth-helper')
    const req = new Request('http://test', { headers: { authorization: 'Bearer token' } })
    const res = await authenticateRequest(req)
    expect(res.userId).toBeNull()
  })
})
