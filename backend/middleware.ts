import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define which routes require Clerk authentication
const isProtectedRoute = createRouteMatcher([
  '/api/auth/clerk-link(.*)',
])

// Create custom middleware that combines Clerk auth with CORS
export default clerkMiddleware(async (auth, request: NextRequest) => {
  // Protect routes that need Clerk authentication
  if (isProtectedRoute(request)) {
    await auth.protect()
  }

  // Add CORS headers for all API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    const response = NextResponse.next()

    // Get allowed origins from environment variable or use wildcard for development
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['*']
    const origin = request.headers.get('origin')

    // Check if origin is allowed
    if (allowedOrigins.includes('*')) {
      response.headers.set('Access-Control-Allow-Origin', '*')
    } else if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
      response.headers.set('Vary', 'Origin')
    }

    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Max-Age', '86400') // 24 hours

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: response.headers,
      })
    }

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
