/**
 * Authentication Service
 *
 * Handles API key retrieval and management for authenticated Clerk users.
 */

import { apiClient } from '@/lib/api-client'

export interface ApiKeyData {
  apiKey: string
  userId: string
  email: string
}

export class AuthService {
  /**
   * Get API key for the current Clerk user
   * This should be called once when the user logs in
   */
  static async getApiKey(): Promise<ApiKeyData | null> {
    try {
      const response = await apiClient.linkClerkUser()

      if (response.status === 'error') {
        console.error('Failed to get API key:', response.error)
        return null
      }

      if (response.data) {
        // Set the API key for all future requests
        apiClient.setApiKey(response.data.apiKey)
        return response.data
      }

      return null
    } catch (error) {
      console.error('Error getting API key:', error)
      return null
    }
  }

  /**
   * Regenerate the user's API key
   * This will invalidate the old key
   */
  static async regenerateApiKey(): Promise<ApiKeyData | null> {
    try {
      const response = await apiClient.regenerateApiKey()

      if (response.status === 'error') {
        console.error('Failed to regenerate API key:', response.error)
        return null
      }

      if (response.data) {
        // Update the API key for all future requests
        apiClient.setApiKey(response.data.apiKey)
        return response.data
      }

      return null
    } catch (error) {
      console.error('Error regenerating API key:', error)
      return null
    }
  }

  /**
   * Check if user has an API key set
   */
  static hasApiKey(): boolean {
    return apiClient.getApiKey() !== null
  }

  /**
   * Get the current API key (if set)
   */
  static getCurrentApiKey(): string | null {
    return apiClient.getApiKey()
  }
}
