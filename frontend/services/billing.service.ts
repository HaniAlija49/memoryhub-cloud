/**
 * Billing Service
 *
 * Handles all billing-related operations including subscription management,
 * plan changes, and portal access.
 */

import { apiClient, type ApiResponse } from '@/lib/api-client'
import type { BillingData, CheckoutSession } from '@/lib/billing-types'

export class BillingService {
  /**
   * Get current subscription data
   */
  static async getSubscriptionData(getToken?: () => Promise<string | null>): Promise<BillingData | null> {
    try {
      // Refresh token before API call
      if (getToken) {
        const token = await getToken()
        if (token) apiClient.setClerkToken(token)
      }

      const response = await apiClient.getBilling()

      if (response.status === 'error') {
        console.error('Failed to fetch billing data:', response.error)
        return null
      }

      return response.data || null
    } catch (error) {
      console.error('Error fetching billing data:', error)
      return null
    }
  }

  /**
   * Update plan (upgrade/downgrade)
   */
  static async updatePlan(
    planId: string,
    interval: 'monthly' | 'yearly',
    getToken?: () => Promise<string | null>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Refresh token before API call
      if (getToken) {
        const token = await getToken()
        if (token) apiClient.setClerkToken(token)
      }

      const response = await apiClient.updateSubscription(planId, interval)

      if (response.status === 'error') {
        return { success: false, error: response.error }
      }

      return { success: true }
    } catch (error) {
      console.error('Error updating plan:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(
    immediate: boolean = false,
    getToken?: () => Promise<string | null>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Refresh token before API call
      if (getToken) {
        const token = await getToken()
        if (token) apiClient.setClerkToken(token)
      }

      const response = await apiClient.cancelSubscription(immediate)

      if (response.status === 'error') {
        return { success: false, error: response.error }
      }

      return { success: true }
    } catch (error) {
      console.error('Error canceling subscription:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Reactivate a cancelled subscription
   */
  static async reactivateSubscription(
    getToken?: () => Promise<string | null>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Refresh token before API call
      if (getToken) {
        const token = await getToken()
        if (token) apiClient.setClerkToken(token)
      }

      const response = await apiClient.reactivateSubscription()

      if (response.status === 'error') {
        return { success: false, error: response.error }
      }

      return { success: true }
    } catch (error) {
      console.error('Error reactivating subscription:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Open customer portal (redirects user)
   */
  static async openPortal(getToken?: () => Promise<string | null>): Promise<void> {
    try {
      // Refresh token before API call
      if (getToken) {
        const token = await getToken()
        if (token) apiClient.setClerkToken(token)
      }

      const response = await apiClient.getPortalUrl()

      if (response.status === 'error') {
        console.error('Failed to get portal URL:', response.error)
        throw new Error(response.error)
      }

      if (response.data?.url) {
        window.location.href = response.data.url
      }
    } catch (error) {
      console.error('Error opening portal:', error)
      throw error
    }
  }

  /**
   * Create checkout session
   */
  static async createCheckout(
    planId: string,
    interval: 'monthly' | 'yearly',
    getToken?: () => Promise<string | null>
  ): Promise<CheckoutSession | null> {
    try {
      // Refresh token before API call
      if (getToken) {
        const token = await getToken()
        if (token) apiClient.setClerkToken(token)
      }

      const response = await apiClient.createCheckout(planId, interval)

      if (response.status === 'error') {
        console.error('Failed to create checkout:', response.error)
        return null
      }

      return response.data || null
    } catch (error) {
      console.error('Error creating checkout:', error)
      return null
    }
  }
}
