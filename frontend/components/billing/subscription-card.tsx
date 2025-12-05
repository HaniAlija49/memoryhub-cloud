"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, CreditCard } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { Subscription, Plan } from "@/lib/billing-types"

interface SubscriptionCardProps {
  subscription: Subscription
  plan: Plan
  onChangePlan: () => void
  onCancel: () => void
  onManagePortal: () => void
  onReactivate: () => void
  isLoading?: boolean
}

export function SubscriptionCard({
  subscription,
  plan,
  onChangePlan,
  onCancel,
  onManagePortal,
  onReactivate,
  isLoading = false,
}: SubscriptionCardProps) {
  // Status badge color logic
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-500'
      case 'canceled':
        return 'bg-yellow-500/10 text-yellow-500'
      case 'past_due':
        return 'bg-red-500/10 text-red-500'
      default:
        return 'bg-blue-500/10 text-blue-500'
    }
  }

  // Format billing interval display
  const formatInterval = () => {
    if (!subscription.interval) return ''
    const price = plan.pricing[subscription.interval] / 100
    return `${subscription.interval === 'monthly' ? 'Monthly' : 'Yearly'} ($${price}/${subscription.interval === 'monthly' ? 'mo' : 'yr'})`
  }

  const isFree = plan.id === 'free'
  const isCanceled = subscription.status === 'canceled' || subscription.cancelAtPeriodEnd

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Plan</CardTitle>
        <CardDescription>Your subscription details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Plan Name */}
        <div>
          <Badge
            variant="outline"
            className="bg-gradient-to-r from-accent-cyan to-accent-purple text-white border-none text-lg px-4 py-1"
          >
            {plan.name}
          </Badge>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Status:</span>
          <Badge variant="outline" className={getStatusColor(subscription.status)}>
            {subscription.status === 'active' && '● Active'}
            {subscription.status === 'canceled' && '○ Canceled'}
            {subscription.status === 'past_due' && '⚠ Past Due'}
          </Badge>
        </div>

        {/* Billing Interval (for paid plans) */}
        {!isFree && subscription.interval && (
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{formatInterval()}</span>
            {subscription.interval === 'yearly' && (
              <Badge variant="secondary" className="text-xs">Save 17%</Badge>
            )}
          </div>
        )}

        {/* Next Billing Date */}
        {!isFree && subscription.currentPeriodEnd && !isCanceled && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Renews {formatDistanceToNow(new Date(subscription.currentPeriodEnd), { addSuffix: true })}
            </span>
          </div>
        )}

        {/* Cancellation Notice */}
        {subscription.cancelAtPeriodEnd && subscription.currentPeriodEnd && (
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              Your subscription will end on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={onChangePlan}
            disabled={isLoading}
            className="flex-1"
          >
            {isFree ? 'Upgrade Plan' : 'Change Plan'}
          </Button>

          {!isFree && !isCanceled && (
            <Button
              onClick={onCancel}
              variant="outline"
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}

          {!isFree && isCanceled && (
            <Button
              onClick={onReactivate}
              variant="default"
              disabled={isLoading}
            >
              Reactivate
            </Button>
          )}

          {!isFree && !isCanceled && (
            <Button
              onClick={onManagePortal}
              variant="outline"
              disabled={isLoading}
            >
              Manage
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
