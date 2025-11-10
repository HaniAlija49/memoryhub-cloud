import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Create custom middleware that combines Clerk auth with CORS
export default clerkMiddleware(async (auth, request: NextRequest) => {
  // Handle OPTIONS preflight requests FIRST (before auth check)
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 200 })

    const origin = request.headers.get('origin')

    // Get allowed origins from env (production) or use localhost (development)
    const allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
      : [
          'http://localhost:3001',
          'http://localhost:3000',
          'http://127.0.0.1:3001',
          'http://127.0.0.1:3000',
        ]

    // Check if origin is allowed
    // Note: MCP servers don't send Origin header, so this only affects browser requests
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
      response.headers.set('Vary', 'Origin')
    }

    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-highlight-request, x-highlight-session, traceparent, tracestate, baggage')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Max-Age', '86400') // 24 hours

    return response
  }

  // Note: We don't use auth.protect() here anymore
  // Each route handler will check authentication manually using auth()
  // This prevents middleware from blocking API requests prematurely

  // Add CORS headers for all API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    const response = NextResponse.next()

    const origin = request.headers.get('origin')

    // Get allowed origins from env (production) or use localhost (development)
    const allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
      : [
          'http://localhost:3001',
          'http://localhost:3000',
          'http://127.0.0.1:3001',
          'http://127.0.0.1:3000',
        ]

    // Check if origin is allowed
    // Note: MCP servers don't send Origin header, so this only affects browser requests
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
      response.headers.set('Vary', 'Origin')
    }

    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-highlight-request, x-highlight-session, traceparent, tracestate, baggage')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Max-Age', '86400') // 24 hours

    return response
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
