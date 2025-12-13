import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

class PrismaClientMock {
  user = {
    findUnique: vi.fn(),
  }
  memory = {
    count: vi.fn(),
  }
  usageRecord = {
    upsert: vi.fn(),
    findUnique: vi.fn(),
  }
}

// Shared mock instance returned whenever PrismaClient is constructed
const prismaInstance = new PrismaClientMock()
vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => prismaInstance),
}))

describe('billing quotas', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.useFakeTimers().setSystemTime(new Date('2024-01-15T00:00:00Z'))
    prismaInstance.user.findUnique.mockReset()
    prismaInstance.memory.count.mockReset()
    prismaInstance.usageRecord.upsert.mockReset()
    prismaInstance.usageRecord.findUnique.mockReset()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('denies when user not found', async () => {
    prismaInstance.user.findUnique.mockResolvedValueOnce(null)
    const { checkQuota } = await import('@/lib/billing/quotas')

    const result = await checkQuota('missing', 'api_call')
    expect(result.allowed).toBe(false)
    expect(result.reason).toBe('User not found')
  })

  it('enforces api_call limit and returns usage', async () => {
    prismaInstance.user.findUnique.mockResolvedValueOnce({
      id: 'u1',
      planId: 'starter',
      usageRecords: [{ apiCalls: 5 }],
    })

    const { checkQuota } = await import('@/lib/billing/quotas')
    const ok = await checkQuota('u1', 'api_call')
    expect(ok.allowed).toBe(true)
    expect(ok.usage?.current).toBe(5)
  })

  it('blocks api_call when over limit', async () => {
    prismaInstance.user.findUnique.mockResolvedValueOnce({
      id: 'u1',
      planId: 'free',
      usageRecords: [{ apiCalls: 5000 }],
    })

    const { checkQuota } = await import('@/lib/billing/quotas')
    const result = await checkQuota('u1', 'api_call')
    expect(result.allowed).toBe(false)
    expect(result.reason).toContain('API call quota exceeded')
    expect(result.usage?.percentage).toBe(100)
  })

  it('blocks memory when over limit', async () => {
    prismaInstance.user.findUnique.mockResolvedValueOnce({
      id: 'u1',
      planId: 'free',
      usageRecords: [],
    })
    prismaInstance.memory.count.mockResolvedValueOnce(300)

    const { checkQuota } = await import('@/lib/billing/quotas')
    const result = await checkQuota('u1', 'memory')
    expect(result.allowed).toBe(false)
    expect(result.reason).toContain('Memory storage quota exceeded')
  })

  it('fails open on exception', async () => {
    prismaInstance.user.findUnique.mockRejectedValueOnce(new Error('db down'))
    const { checkQuota } = await import('@/lib/billing/quotas')

    const result = await checkQuota('u1', 'api_call')
    expect(result.allowed).toBe(true)
    expect(result.reason).toContain('Quota check failed')
  })

  it('enforceQuota returns null when allowed and 429 payload when blocked', async () => {
    prismaInstance.user.findUnique.mockResolvedValueOnce({
      id: 'u1',
      planId: 'free',
      usageRecords: [{ apiCalls: 0 }],
    })

    const { enforceQuota } = await import('@/lib/billing/quotas')
    const allowed = await enforceQuota('u1', 'api_call')
    expect(allowed).toBeNull()

    prismaInstance.user.findUnique.mockResolvedValueOnce({
      id: 'u2',
      planId: 'free',
      usageRecords: [{ apiCalls: 5000 }],
    })
    const blocked = await enforceQuota('u2', 'api_call')
    expect(blocked?.status).toBe(429)
    expect(blocked?.error).toContain('quota exceeded')
  })
})
