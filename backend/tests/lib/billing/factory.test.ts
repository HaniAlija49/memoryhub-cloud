import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const dodoCtor = vi.fn()
vi.mock('@/lib/billing/providers/dodo', () => ({
  DodoProvider: function (...args: any[]) {
    dodoCtor(...args)
    return { ok: true }
  },
}))

const realEnv = { ...process.env }

async function loadFactoryWithEnv(envMock: Record<string, string | undefined>) {
  // Ensure required vars exist to satisfy env validation during import
  process.env = {
    ...realEnv,
    MEMORYHUB_DATABASE_URL: 'postgres://test',
    NODE_ENV: 'test',
    ...envMock,
  }

  const factory = await import('@/lib/billing/factory')
  return factory
}

describe('billing factory', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    dodoCtor.mockClear()
  })

  afterEach(() => {
    process.env = { ...realEnv }
  })

  it('creates dodo provider when configured', async () => {
    const factory = await loadFactoryWithEnv({
      BILLING_PROVIDER: 'dodo',
      DODO_API_KEY: 'key',
      DODO_WEBHOOK_SECRET: 'secret',
      DODO_MODE: 'test',
    })
    const provider = factory.getBillingProvider()
    expect(provider).toMatchObject({ ok: true })
    expect(dodoCtor).toHaveBeenCalled()
    expect(factory.getCurrentProvider()).toBe('dodo')
  })

  it('isBillingConfigured returns false when missing creds', async () => {
    const factory = await loadFactoryWithEnv({
      BILLING_PROVIDER: 'dodo',
      DODO_API_KEY: '',
      DODO_WEBHOOK_SECRET: '',
    })
    expect(factory.isBillingConfigured()).toBe(false)
  })
})
