'use client'

import { useUser } from '@clerk/nextjs'
import * as Sentry from '@sentry/nextjs'

// Import event types from backend (we'll need to share these)
type PersistQEvent = 
  // Memory operations
  | 'memory_created'
  | 'memory_searched' 
  | 'memory_updated'
  | 'memory_deleted'
  | 'document_uploaded'
  | 'document_processed'
  | 'document_failed'

  // API Keys
  | 'api_key_generated'
  | 'api_key_regenerated'
  | 'api_key_copied'

  // Billing
  | 'billing_opened'
  | 'checkout_started'
  | 'subscription_activated'
  | 'subscription_cancelled'
  | 'plan_upgraded'

  // Search
  | 'search_performed'
  | 'search_failed'

  // Feedback
  | 'feedback_submitted'

  // Dashboard
  | 'dashboard_opened'
  | 'settings_opened'

/**
 * Check if observability is enabled
 */
function isObservabilityEnabled(): boolean {
  // Check for the environment variable (works in both browser and Node.js)
  if (typeof window !== 'undefined') {
    // Browser environment - check NEXT_PUBLIC_ prefixed variable
    return process.env.NEXT_PUBLIC_OBSERVABILITY_ENABLED === 'true';
  } else {
    // Server environment - check regular variable
    return process.env.OBSERVABILITY_ENABLED === 'true';
  }
}

/**
 * Track an analytics event
 * 
 * This function:
 * 1. Checks if observability is enabled
 * 2. Adds a Sentry breadcrumb for correlation with errors
 * 3. Sends event to backend for storage in usage_events table
 * 4. Is fire-and-forget (never blocks UI)
 * 
 * @param event - The event name to track
 * 
 * @example
 * ```tsx
 * import { trackEvent } from '@/lib/analytics'
 * 
 * // Track memory creation
 * trackEvent('memory_created')
 * 
 * // Track API key generation
 * trackEvent('api_key_generated')
 * ```
 */
export function trackEvent(event: PersistQEvent): void {
  // Skip all tracking if observability is disabled
  if (!isObservabilityEnabled()) {
    return;
  }

  try {
    // Add Sentry breadcrumb for correlation with errors
    Sentry.addBreadcrumb({
      category: 'user-action',
      message: event,
      level: 'info',
      data: {
        event,
      }
    });

    // Send event to backend (fire-and-forget)
    // Don't await - analytics should never block UI
    fetch('/api/internal/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ event }),
    }).catch((error) => {
      // Silently fail - don't let analytics errors break the app
      console.warn('Failed to track event:', error);
    });

  } catch (error) {
    // Silently fail - don't let analytics errors break the app
    console.warn('Error in trackEvent:', error);
  }
}

/**
 * Hook for tracking events with automatic user context
 * 
 * @returns {trackEvent} - Function to track events
 * 
 * @example
 * ```tsx
 * import { useTrackEvent } from '@/lib/analytics'
 * 
 * function MyComponent() {
 *   const trackEvent = useTrackEvent()
 *   
 *   const handleClick = () => {
 *     trackEvent('memory_created')
 *   }
 *   
 *   return <button onClick={handleClick}>Create Memory</button>
 * }
 * ```
 */
export function useTrackEvent() {
  const { user } = useUser();

  return (event: PersistQEvent) => {
    // Only track events for authenticated users and if observability is enabled
    if (user && isObservabilityEnabled()) {
      trackEvent(event);
    }
  };
}

/**
 * Track an event only if user is authenticated and observability is enabled
 * 
 * @param event - The event name to track
 * @param user - Clerk user object (optional)
 * 
 * @example
 * ```tsx
 * import { trackEventIfAuthenticated } from '@/lib/analytics'
 * import { useUser } from '@clerk/nextjs'
 * 
 * function MyComponent() {
 *   const { user } = useUser()
 *   
 *   const handleClick = () => {
 *     trackEventIfAuthenticated('memory_created', user)
 *   }
 *   
 *   return <button onClick={handleClick}>Create Memory</button>
 * }
 * ```
 */
export function trackEventIfAuthenticated(event: PersistQEvent, user?: any): void {
  if (user && isObservabilityEnabled()) {
    trackEvent(event);
  }
}