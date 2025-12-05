"use client"

import { useEffect, useState } from "react"
import { useApi } from "@/hooks/use-api"
import { useAuth } from "@clerk/nextjs"
import { BillingService } from "@/services/billing.service"
import { SubscriptionCard } from "@/components/billing/subscription-card"
import { UsageCard } from "@/components/billing/usage-card"
import { PlanChangeDialog } from "@/components/billing/plan-change-dialog"
import { CancelSubscriptionDialog } from "@/components/billing/cancel-subscription-dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { BillingData } from "@/lib/billing-types"

export default function BillingPage() {
  const api = useApi()
  const { getToken } = useAuth()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [billingData, setBillingData] = useState<BillingData | null>(null)

  const [showChangePlanDialog, setShowChangePlanDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(false)

  // Check for success redirect from checkout
  useEffect(() => {
    if (typeof window === 'undefined') return

    const params = new URLSearchParams(window.location.search)
    const success = params.get('success')
    const subscriptionId = params.get('subscription_id')
    const status = params.get('status')

    if (success === 'true' && subscriptionId) {
      toast({
        title: "Payment Successful!",
        description: `Your subscription is now ${status || 'active'}. Refreshing your plan details...`,
      })

      // Clean up URL
      window.history.replaceState({}, '', '/dashboard/billing')

      // Reload billing data after a short delay to allow webhook processing
      setTimeout(() => {
        if (api.isReady) {
          loadBillingData()
        }
      }, 2000)
    }
  }, [toast, api.isReady])

  // Load billing data
  useEffect(() => {
    if (api.isReady) {
      loadBillingData()
    }
  }, [api.isReady])

  // Reload billing data when user returns to the page (e.g., after visiting portal)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && api.isReady) {
        console.log('[Billing] Page became visible, refreshing billing data...')
        loadBillingData()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [api.isReady])

  const loadBillingData = async () => {
    setIsLoading(true)
    setError(null)

    const data = await BillingService.getSubscriptionData(getToken)

    if (!data) {
      setError('Failed to load billing data. Please try again.')
    } else {
      setBillingData(data)
    }

    setIsLoading(false)
  }

  // Handle plan change
  const handleChangePlan = async (planId: string, interval: 'monthly' | 'yearly') => {
    setIsActionLoading(true)

    // If user is on free plan, redirect to checkout instead of updating
    if (billingData?.subscription.planId === 'free') {
      const checkout = await BillingService.createCheckout(planId, interval, getToken)

      if (checkout?.url) {
        // Redirect to checkout page
        window.location.href = checkout.url
      } else {
        toast({
          title: "Checkout Failed",
          description: "Failed to create checkout session. Please try again.",
          variant: "destructive",
        })
        setIsActionLoading(false)
      }
      return
    }

    // For existing subscribers, update the plan
    const result = await BillingService.updatePlan(planId, interval, getToken)

    if (result.success) {
      toast({
        title: "Plan Updated",
        description: `Your subscription has been changed successfully.`,
      })
      await loadBillingData() // Refresh data
      setIsActionLoading(false)
    } else {
      toast({
        title: "Update Failed",
        description: result.error || "Failed to update plan. Please try again.",
        variant: "destructive",
      })
      setIsActionLoading(false)
    }
  }

  // Handle subscription cancellation
  const handleCancelSubscription = async (immediate: boolean) => {
    setIsActionLoading(true)

    const result = await BillingService.cancelSubscription(immediate, getToken)

    if (result.success) {
      toast({
        title: "Subscription Canceled",
        description: immediate
          ? "Your subscription has been canceled immediately."
          : "Your subscription will be canceled at the end of the billing period.",
      })

      // Wait a moment for webhook to process, then refresh
      setTimeout(async () => {
        await loadBillingData()
        setIsActionLoading(false)
      }, 2000)
    } else {
      toast({
        title: "Cancellation Failed",
        description: result.error || "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      })
      setIsActionLoading(false)
    }
  }

  // Handle portal redirect
  const handleManagePortal = async () => {
    try {
      await BillingService.openPortal(getToken)
    } catch (error) {
      toast({
        title: "Portal Error",
        description: "Failed to open billing portal. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle reactivation
  const handleReactivate = async () => {
    setIsActionLoading(true)

    const result = await BillingService.reactivateSubscription(getToken)

    if (result.success) {
      toast({
        title: "Subscription Reactivated",
        description: "Your subscription has been reactivated successfully.",
      })
      await loadBillingData()
    } else {
      toast({
        title: "Reactivation Failed",
        description: result.error || "Failed to reactivate subscription. Please try again.",
        variant: "destructive",
      })
    }

    setIsActionLoading(false)
  }

  // Loading state
  if (api.isLoading || isLoading) {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-semibold text-foreground">Billing & Usage</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-2">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">Loading billing data...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (api.error || error) {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-semibold text-foreground">Billing & Usage</h1>
        <div className="flex items-center justify-center h-64">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || api.error}
              <Button
                variant="link"
                className="ml-2 p-0 h-auto"
                onClick={loadBillingData}
              >
                Try again
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  // No API key state
  if (!api.hasApiKey) {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-semibold text-foreground">Billing & Usage</h1>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please generate an API key first to access billing features.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // No billing data
  if (!billingData) {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Billing & Usage</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your subscription and monitor usage
          </p>
        </div>
        {billingData.subscription.planId !== 'free' && (
          <Button variant="outline" onClick={handleManagePortal}>
            <ExternalLink className="w-4 h-4 mr-2" />
            Manage Billing
          </Button>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <SubscriptionCard
          subscription={billingData.subscription}
          plan={billingData.plan}
          onChangePlan={() => setShowChangePlanDialog(true)}
          onCancel={() => setShowCancelDialog(true)}
          onManagePortal={handleManagePortal}
          onReactivate={handleReactivate}
          isLoading={isActionLoading}
        />

        <UsageCard
          usage={billingData.usage}
          plan={billingData.plan}
          onUpgrade={() => setShowChangePlanDialog(true)}
        />
      </div>

      {/* Dialogs */}
      <PlanChangeDialog
        open={showChangePlanDialog}
        onOpenChange={setShowChangePlanDialog}
        currentPlanId={billingData.subscription.planId}
        currentInterval={billingData.subscription.interval}
        onConfirm={handleChangePlan}
      />

      <CancelSubscriptionDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        currentPeriodEnd={billingData.subscription.currentPeriodEnd}
        onConfirm={handleCancelSubscription}
      />
    </div>
  )
}
