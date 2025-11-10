import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const checks = {
    database: 'unknown',
    pgvector: 'unknown',
    redis: 'unknown',
  }

  let isHealthy = true

  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`
    checks.database = 'connected'

    // Check pgvector extension
    try {
      // Cast result to avoid deserialization error
      await prisma.$queryRaw`SELECT '[1,2,3]'::vector(3)::text as vector_test`
      checks.pgvector = 'enabled'
    } catch (vectorError) {
      checks.pgvector = 'disabled'
      // Don't mark as unhealthy - pgvector is optional for basic operations
    }

    // Check Redis connection (optional)
    const hasRedis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    if (hasRedis) {
      try {
        // Simple check - if env vars exist, assume connected
        // Actual connection test would require importing Redis client
        checks.redis = 'configured'
      } catch (redisError) {
        checks.redis = 'error'
      }
    } else {
      checks.redis = 'not-configured'
    }

    return NextResponse.json({
      status: isHealthy ? 'healthy' : 'degraded',
      service: 'MemoryHub API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      checks,
    }, { status: isHealthy ? 200 : 503 })

  } catch (error) {
    console.error('Health check failed:', error)
    checks.database = 'disconnected'

    return NextResponse.json(
      {
        status: 'unhealthy',
        service: 'MemoryHub API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        checks,
        error: 'Database connection failed',
      },
      { status: 503 }
    )
  }
}
