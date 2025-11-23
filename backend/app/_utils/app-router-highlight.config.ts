import { NextRequest, NextResponse } from 'next/server'
import { H, Highlight } from '@highlight-run/next/server'

// Highlight backend configuration for App Router
export const HIGHLIGHT_CONFIG = {
  projectID: process.env.HIGHLIGHT_PROJECT_ID || '5g5y914e',
  serviceName: 'memoryhub-backend',
  serviceVersion: '1.0.0',
  environment: process.env.NODE_ENV || 'development', // 'development' or 'production'
}

// Only enable Highlight.io in production and if project ID is configured
const isProduction = process.env.NODE_ENV === 'production'
const highlightEnabled = isProduction && !!process.env.HIGHLIGHT_PROJECT_ID

// Initialize Highlight once
let highlightInitialized = false

function initializeHighlight() {
  if (!highlightInitialized && highlightEnabled) {
    try {
      H.init(HIGHLIGHT_CONFIG)
      highlightInitialized = true
      console.log('[Highlight] Initialized for project:', HIGHLIGHT_CONFIG.projectID)
    } catch (error) {
      console.error('[Highlight] Failed to initialize:', error)
      // Don't throw - allow app to continue without Highlight
    }
  }
}

// Enhanced console logging that sends to Highlight
const originalConsoleLog = console.log
const originalConsoleError = console.error
const originalConsoleWarn = console.warn

// Intercept console methods to send to Highlight (only in production)
export function enableHighlightLogging() {
  if (!highlightEnabled) return // Skip if not enabled

  console.log = (...args: unknown[]) => {
    originalConsoleLog(...args)
    if (highlightInitialized) {
      try {
        H.log('info', args.join(' '))
      } catch (e) {
        // Fail silently if Highlight not ready
      }
    }
  }

  console.error = (...args: unknown[]) => {
    originalConsoleError(...args)
    if (highlightInitialized) {
      try {
        // If first arg is an Error object, use consumeError
        if (args[0] instanceof Error) {
          H.consumeError(args[0], args.slice(1).join(' '))
        } else {
          H.log('error', args.join(' '))
        }
      } catch (e) {
        // Fail silently if Highlight not ready
      }
    }
  }

  console.warn = (...args: unknown[]) => {
    originalConsoleWarn(...args)
    if (highlightInitialized) {
      try {
        H.log('warn', args.join(' '))
      } catch (e) {
        // Fail silently if Highlight not ready
      }
    }
  }
}

// Call this once to enable logging (only if enabled)
if (highlightEnabled && process.env.NODE_ENV !== 'test') {
  enableHighlightLogging()
}

// Wrapper for App Router route handlers
export function withAppRouterHighlight(
  handler: (request: NextRequest, context?: any) => Promise<Response | NextResponse>
) {
  return async (request: NextRequest, context?: any) => {
    // Skip Highlight.io if not enabled
    if (!highlightEnabled) {
      return handler(request, context)
    }

    initializeHighlight()

    // Only use Highlight if initialization succeeded
    if (!highlightInitialized) {
      return handler(request, context)
    }

    try {
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
        try {
          H.consumeError(
            error instanceof Error ? error : new Error(String(error)),
            `${request.method} ${request.nextUrl.pathname}`
          )
          span.recordException(error instanceof Error ? error : new Error(String(error)))
        } catch (highlightError) {
          // Ignore Highlight errors
        }
        throw error
      } finally {
        span.end()
      }
    } catch (highlightError) {
      // If Highlight fails, still run the handler
      return handler(request, context)
    }
  }
}

// Helper to log errors with context
export function logError(error: Error, context?: Record<string, any>) {
  if (highlightInitialized) {
    try {
      H.consumeError(error)
    } catch (e) {
      // Ignore Highlight errors
    }
  }
  // Log context separately if provided
  if (context) {
    console.error('Error context:', context)
  }
}
