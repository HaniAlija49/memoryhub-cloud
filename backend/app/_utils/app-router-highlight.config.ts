import { NextRequest, NextResponse } from 'next/server'
import { H, Highlight } from '@highlight-run/next/server'

// Highlight backend configuration for App Router
export const HIGHLIGHT_CONFIG = {
  projectID: process.env.HIGHLIGHT_PROJECT_ID || '5g5y914e',
  serviceName: 'memoryhub-backend',
  serviceVersion: '1.0.0',
  environment: process.env.NODE_ENV || 'development', // 'development' or 'production'
}

// Only enable Highlight.io in production
const isProduction = process.env.NODE_ENV === 'production'

// Initialize Highlight once
let highlightInitialized = false

function initializeHighlight() {
  if (!highlightInitialized && isProduction) {
    H.init(HIGHLIGHT_CONFIG)
    highlightInitialized = true
    console.log('[Highlight] Initialized for project:', HIGHLIGHT_CONFIG.projectID)
  }
}

// Enhanced console logging that sends to Highlight
const originalConsoleLog = console.log
const originalConsoleError = console.error
const originalConsoleWarn = console.warn

// Intercept console methods to send to Highlight (only in production)
export function enableHighlightLogging() {
  if (!isProduction) return // Skip in development

  console.log = (...args: any[]) => {
    originalConsoleLog(...args)
    try {
      H.log('info', ...args)
    } catch (e) {
      // Fail silently if Highlight not ready
    }
  }

  console.error = (...args: any[]) => {
    originalConsoleError(...args)
    try {
      // If first arg is an Error object, use consumeError
      if (args[0] instanceof Error) {
        H.consumeError(args[0], args.slice(1).join(' '))
      } else {
        H.log('error', ...args)
      }
    } catch (e) {
      // Fail silently if Highlight not ready
    }
  }

  console.warn = (...args: any[]) => {
    originalConsoleWarn(...args)
    try {
      H.log('warn', ...args)
    } catch (e) {
      // Fail silently if Highlight not ready
    }
  }
}

// Call this once to enable logging (only in production)
if (isProduction && process.env.NODE_ENV !== 'test') {
  enableHighlightLogging()
}

// Wrapper for App Router route handlers
export function withAppRouterHighlight(
  handler: (request: NextRequest, context?: any) => Promise<Response | NextResponse>
) {
  return async (request: NextRequest, context?: any) => {
    // Skip Highlight.io in development
    if (!isProduction) {
      return handler(request, context)
    }

    initializeHighlight()

    // Create span for this request
    const { span } = H.startWithHeaders(
      `${request.method} ${request.nextUrl.pathname}`,
      Object.fromEntries(request.headers.entries())
    )

    try {
      // Execute the handler
      const response = await handler(request, context)

      // Add response status to span
      if (response instanceof NextResponse || response instanceof Response) {
        span.setAttribute('http.status_code', response.status)
      }

      return response
    } catch (error) {
      // Record error in Highlight
      H.consumeError(
        error instanceof Error ? error : new Error(String(error)),
        `${request.method} ${request.nextUrl.pathname}`
      )
      span.recordException(error instanceof Error ? error : new Error(String(error)))
      throw error
    } finally {
      span.end()
    }
  }
}

// Helper to log errors with context
export function logError(error: Error, context?: Record<string, any>) {
  H.consumeError(error, undefined, context)
}

// Helper to add custom attributes to current span
export function addSpanAttributes(attributes: Record<string, any>) {
  // This will add attributes to the current active span
  Object.entries(attributes).forEach(([key, value]) => {
    H.recordMetric(key, value)
  })
}
