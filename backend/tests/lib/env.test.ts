import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const baseEnv = { ...process.env }

beforeEach(() => {
  vi.resetModules()
  process.env = { ...baseEnv }
})

afterEach(() => {
  process.env = { ...baseEnv }
  vi.restoreAllMocks()
})

describe('env validation', () => {
  it('returns parsed env when required vars are present', async () => {
    process.env.MEMORYHUB_DATABASE_URL = 'postgres://test'
    process.env.NODE_ENV = 'development'

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const envModule = await import('@/lib/env')

    expect(envModule.env.MEMORYHUB_DATABASE_URL).toBe('postgres://test')
    expect(logSpy).toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalled() // missing Upstash creds triggers warning
  })

  it('calls process.exit when DB url is missing outside build phase', async () => {
    delete process.env.MEMORYHUB_DATABASE_URL
    process.env.NODE_ENV = 'development'

    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => undefined) as any)
    vi.spyOn(console, 'error').mockImplementation(() => {})

    await import('@/lib/env')

    expect(exitSpy).toHaveBeenCalledWith(1)
  })

  it('skips exit during build phase even if required vars missing', async () => {
    delete process.env.MEMORYHUB_DATABASE_URL
    process.env.NEXT_PHASE = 'phase-production-build'

    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => undefined) as any)
    vi.spyOn(console, 'error').mockImplementation(() => {})

    const envModule = await import('@/lib/env')

    expect(exitSpy).not.toHaveBeenCalled()
    expect(envModule.env.MEMORYHUB_DATABASE_URL).toBe('')
  })
})
