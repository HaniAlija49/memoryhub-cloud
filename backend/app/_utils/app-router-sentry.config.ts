import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";

/**
 * Wrapper for Next.js App Router API routes with Sentry tracing and error tracking
 * Replaces withAppRouterHighlight from highlight.io
 */
export function withSentryTracing<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T,
  options?: { op?: string; name?: string }
): T {
  return (async (...args: Parameters<T>) => {
    const request = args[0] as NextRequest;

    // Only enable in production
    if (process.env.NODE_ENV !== 'production') {
      return handler(...args);
    }

    const method = request.method;
    const pathname = request.nextUrl.pathname;

    return await Sentry.startSpan(
      {
        op: options?.op || 'http.server',
        name: options?.name || `${method} ${pathname}`,
        attributes: {
          'http.method': method,
          'http.url': request.url,
          'http.path': pathname,
        },
      },
      async (span) => {
        try {
          const response = await handler(...args);

          span.setAttribute('http.status_code', response.status);

          return response;
        } catch (error) {
          span.setAttribute('error', true);

          Sentry.captureException(error, {
            contexts: {
              request: {
                method,
                url: request.url,
                headers: Object.fromEntries(request.headers.entries()),
              },
            },
          });

          throw error;
        }
      }
    );
  }) as T;
}

/**
 * Helper function to log errors to Sentry
 * Replaces logError from highlight.io
 */
export function logError(error: Error, context?: Record<string, any>) {
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, {
      extra: context,
    });
  }
}
