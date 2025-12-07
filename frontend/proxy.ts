import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/login(.*)',
  '/signup(.*)',
  '/pricing',
  '/docs(.*)',
  '/terms',
  '/privacy-policy',
  '/refund-policy',
  '/cookie-policy',
  '/do-not-sell',
  '/accessibility',
  '/features',
  '/sitemap.xml',
  '/robots.txt',
  '/api/webhooks(.*)',
])

export default clerkMiddleware(async (auth, request) => {
  // Protect all routes except public ones
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Only run on dashboard and API routes
    '/dashboard/:path*',
    '/(api|trpc)(.*)',
  ],
}
