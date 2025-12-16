'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

/**
 * Component to set Sentry user context from Clerk authentication
 * This ensures all Sentry errors include user information for correlation
 */
export function SentryUserContext() {
  const { user, isLoaded } = useUser()

  useEffect(() => {
    // Only set Sentry context if observability is enabled
    const isObservabilityEnabled = process.env.NEXT_PUBLIC_OBSERVABILITY_ENABLED === 'true';
    
    if (isLoaded && user && isObservabilityEnabled) {
      // Set user context in Sentry
      Sentry.setUser({
        id: user.id,
        email: user.emailAddresses?.[0]?.emailAddress,
        username: user.username,
      })
    } else if (isLoaded && (!user || !isObservabilityEnabled)) {
      // Clear user context when signed out or observability disabled
      Sentry.setUser(null)
    }
  }, [user, isLoaded])

  // This component doesn't render anything
  return null
}