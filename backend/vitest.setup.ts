import { vi } from 'vitest'

// Set test environment
vi.stubEnv('NODE_ENV', 'test')

// Stub Sentry to avoid network calls during tests
vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
  withScope: (fn: any) => fn({ setExtra: vi.fn(), setTag: vi.fn() }),
}))
