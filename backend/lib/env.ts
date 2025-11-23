// Environment validation - runs at startup to ensure all required vars are set

interface RequiredEnvVars {
  MEMORYHUB_DATABASE_URL: string
}

interface OptionalEnvVars {
  NODE_ENV?: string
  UPSTASH_REDIS_REST_URL?: string
  UPSTASH_REDIS_REST_TOKEN?: string

  // Billing configuration
  BILLING_PROVIDER?: string
  DODO_API_KEY?: string
  DODO_WEBHOOK_SECRET?: string
  DODO_MODE?: string
  NEXT_PUBLIC_APP_URL?: string
}

type EnvVars = RequiredEnvVars & OptionalEnvVars

export function validateEnv(): EnvVars {
  const errors: string[] = []

  // Skip validation during build phase
  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build'

  // Required variables
  const MEMORYHUB_DATABASE_URL = process.env.MEMORYHUB_DATABASE_URL
  if (!MEMORYHUB_DATABASE_URL && !isBuildPhase) {
    errors.push('MEMORYHUB_DATABASE_URL is required')
  }

  // Optional but recommended
  const NODE_ENV = process.env.NODE_ENV || 'development'

  const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL
  const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
    console.warn('⚠️  UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN not set - rate limiting will be disabled')
  }

  // Billing configuration
  const BILLING_PROVIDER = process.env.BILLING_PROVIDER || 'dodo'
  const DODO_API_KEY = process.env.DODO_API_KEY
  const DODO_WEBHOOK_SECRET = process.env.DODO_WEBHOOK_SECRET
  const DODO_MODE = process.env.DODO_MODE || 'test'
  const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL

  // Validate billing configuration in production
  if (NODE_ENV === 'production') {
    if (!DODO_API_KEY || !DODO_WEBHOOK_SECRET) {
      console.warn('⚠️  Billing not configured: DODO_API_KEY and DODO_WEBHOOK_SECRET required for production')
    }
    if (DODO_MODE === 'test') {
      console.warn('⚠️  DODO_MODE is set to "test" in production - ensure this is intentional')
    }
    if (!NEXT_PUBLIC_APP_URL) {
      console.warn('⚠️  NEXT_PUBLIC_APP_URL not set - billing redirects may not work correctly')
    }
  } else {
    // Development mode - billing is optional
    if (!DODO_API_KEY || !DODO_WEBHOOK_SECRET) {
      console.warn('⚠️  Billing not configured - payment features will be disabled')
    }
  }

  if (errors.length > 0 && !isBuildPhase) {
    console.error('❌ Environment validation failed:')
    errors.forEach(error => console.error(`   - ${error}`))
    process.exit(1)
  }

  if (!isBuildPhase) {
    console.log('✅ Environment validation passed')
  }

  return {
    MEMORYHUB_DATABASE_URL: MEMORYHUB_DATABASE_URL || '',
    NODE_ENV,
    UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN,
    BILLING_PROVIDER,
    DODO_API_KEY,
    DODO_WEBHOOK_SECRET,
    DODO_MODE,
    NEXT_PUBLIC_APP_URL,
  }
}

// Validate on module load
export const env = validateEnv()
