import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('next/headers', () => ({
  headers: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
  },
}))

vi.mock('@/lib/ratelimit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ success: true }),
}))

vi.mock('bcrypt', () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn(),
  },
}))

const headersMock = (await import('next/headers')).headers as unknown as ReturnType<typeof vi.fn>
const prismaMock = (await import('@/lib/prisma')).prisma as any
const rateLimitMock = (await import('@/lib/ratelimit')).checkRateLimit as unknown as ReturnType<typeof vi.fn>
const bcryptMock = (await import('bcrypt') as any).default.compare as ReturnType<typeof vi.fn>

const buildHeaders = (auth?: string) => {
  const h = new Headers()
  if (auth) h.set('authorization', auth)
  return h
}

describe('validateApiKey', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    rateLimitMock.mockResolvedValue({ success: true })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('throws on missing header', async () => {
    headersMock.mockResolvedValue(buildHeaders())
    const { validateApiKey, AuthError } = await import('@/lib/auth')

    await expect(validateApiKey()).rejects.toBeInstanceOf(AuthError)
  })

  it('returns user from plaintext match and checks rate limit', async () => {
    headersMock.mockResolvedValue(buildHeaders('Bearer pq_plain'))
    prismaMock.user.findUnique.mockResolvedValueOnce({ id: 'u1', apiKey: 'pq_plain' })

    const { validateApiKey } = await import('@/lib/auth')
    const user = await validateApiKey()

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { apiKey: 'pq_plain' } })
    expect(rateLimitMock).toHaveBeenCalledWith('u1')
    expect(user.id).toBe('u1')
  })

  it('falls back to bcrypt hash comparison when plaintext not found', async () => {
    const apiKey = 'pq_' + 'a'.repeat(20)
    headersMock.mockResolvedValue(buildHeaders(`Bearer ${apiKey}`))
    prismaMock.user.findUnique.mockResolvedValueOnce(null)
    const { validateApiKey, getApiKeyPrefix } = await import('@/lib/auth')
    const prefix = getApiKeyPrefix(apiKey)

    prismaMock.user.findMany.mockResolvedValueOnce([
      { id: 'u2', apiKeyHash: 'hash', apiKeyPrefix: prefix },
    ])
    bcryptMock.mockResolvedValueOnce(true)

    const user = await validateApiKey()

    expect(prismaMock.user.findMany).toHaveBeenCalled()
    expect(user.id).toBe('u2')
  })

  it('throws when rate limit exceeded', async () => {
    headersMock.mockResolvedValue(buildHeaders('Bearer pq_limit'))
    prismaMock.user.findUnique.mockResolvedValueOnce({ id: 'u3', apiKey: 'pq_limit' })
    rateLimitMock.mockResolvedValueOnce({ success: false, reset: Date.now() + 1000 })

    const { validateApiKey, AuthError } = await import('@/lib/auth')

    await expect(validateApiKey()).rejects.toBeInstanceOf(AuthError)
  })
})

describe('API key helpers', () => {
  it('generates keys with prefix', async () => {
    const { generateApiKey, getApiKeyPrefix } = await import('@/lib/auth')
    const key = generateApiKey()
    expect(key.startsWith('pq_')).toBe(true)
    expect(getApiKeyPrefix(key)).toBe(key.substring(0, 12))
  })
})
