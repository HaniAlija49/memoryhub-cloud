/**
 * Custom React Hook for MemoryHub API
 *
 * Automatically manages API key retrieval using Clerk authentication.
 * Provides initialization state for components that need API access.
 *
 * For actual API calls, use the service layer:
 * - MemoryService for memory operations
 * - AuthService for authentication
 * - StatsService for statistics
 */

import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { AuthService } from '@/services'
import { useToast } from '@/hooks/use-toast'
import { apiClient } from '@/lib/api-client'

interface UseApiState {
  isLoading: boolean
  isReady: boolean
  hasApiKey: boolean
  apiKey: string | null
  error: string | null
}

export function useApi() {
  const { isLoaded, isSignedIn, getToken } = useAuth()
  const { toast } = useToast()
  const [state, setState] = useState<UseApiState>({
    isLoading: true,
    isReady: false,
    hasApiKey: false,
    apiKey: null,
    error: null,
  })

  // Initialize API client when user is authenticated
  useEffect(() => {
    async function initializeApi() {
      if (!isLoaded) return

      if (!isSignedIn) {
        setState({
          isLoading: false,
          isReady: false,
          hasApiKey: false,
          apiKey: null,
          error: 'Not signed in',
        })
        return
      }

      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }))

        // Get Clerk session token
        const token = await getToken()

        // Set Clerk token in API client for authentication
        apiClient.setClerkToken(token)

        // Check if user has generated an API key yet
        const status = await AuthService.checkApiKeyStatus()

        if (!status) {
          throw new Error('Failed to check API key status')
        }

        setState({
          isLoading: false,
          isReady: status.hasApiKey, // Only ready if API key exists
          hasApiKey: status.hasApiKey,
          apiKey: status.apiKey,
          error: null,
        })
      } catch (error) {
        console.error('Failed to initialize API:', error)
        const errorMessage = error instanceof Error ? error.message : 'Failed to connect to API'
        setState({
          isLoading: false,
          isReady: false,
          hasApiKey: false,
          apiKey: null,
          error: errorMessage,
        })
        toast({
          title: 'API Error',
          description: errorMessage,
          variant: 'destructive',
        })
      }
    }

    initializeApi()
  }, [isLoaded, isSignedIn, getToken, toast])

  // Listen for session updates and refresh token
  useEffect(() => {
    async function refreshToken() {
      if (!isLoaded || !isSignedIn) return

      const token = await getToken()
      apiClient.setClerkToken(token)
    }

    // Refresh token periodically (every 5 minutes)
    const interval = setInterval(refreshToken, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [isLoaded, isSignedIn, getToken])

  return state
}
