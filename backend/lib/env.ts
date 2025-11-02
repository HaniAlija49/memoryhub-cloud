// Environment validation - runs at startup to ensure all required vars are set

interface RequiredEnvVars {
  MEMORYHUB_DATABASE_URL: string
}

interface OptionalEnvVars {
  NODE_ENV?: string
  UPSTASH_REDIS_REST_URL?: string
  UPSTASH_REDIS_REST_TOKEN?: string
}

type EnvVars = RequiredEnvVars & OptionalEnvVars

export function validateEnv(): EnvVars {
  const errors: string[] = []

  // Required variables
  const MEMORYHUB_DATABASE_URL = process.env.MEMORYHUB_DATABASE_URL
  if (!MEMORYHUB_DATABASE_URL) {
    errors.push('MEMORYHUB_DATABASE_URL is required')
  }

  // Optional but recommended
  const NODE_ENV = process.env.NODE_ENV || 'development'

  const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL
  const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
    console.warn('⚠️  UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN not set - rate limiting will be disabled')
  }

  if (errors.length > 0) {
    console.error('❌ Environment validation failed:')
    errors.forEach(error => console.error(`   - ${error}`))
    process.exit(1)
  }

  console.log('✅ Environment validation passed')

  return {
    MEMORYHUB_DATABASE_URL: MEMORYHUB_DATABASE_URL!,
    NODE_ENV,
    UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN,
  }
}

// Validate on module load
export const env = validateEnv()
