"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Check, Loader2 } from "lucide-react"
import type { BillingInterval } from "@/lib/billing-types"

// Plan data (should match backend config/plans.ts)
const PLANS = [
  {
    id: 'starter',
    name: 'Builder',
    pricing: { monthly: 500, yearly: 5000 }, // in cents
    limits: { apiCalls: 50000, memories: 2500 },
    features: ['50K API calls/month', '2.5K memories', 'Email support (best-effort)'],
  },
  {
    id: 'pro',
    name: 'RAG Apps',
    pricing: { monthly: 1200, yearly: 12000 },
    limits: { apiCalls: 500000, memories: 25000 },
    features: ['500K API calls/month', '25K memories', 'Priority email support (24-48h)', 'Advanced analytics'],
    recommended: true,
  },
  {
    id: 'premium',
    name: 'Team / Scale',
    pricing: { monthly: 2900, yearly: 29000 },
    limits: { apiCalls: 2000000, memories: 100000 },
    features: ['2M API calls/month', '100K memories', 'Priority support + SLA'],
  },
]

interface PlanChangeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentPlanId: string
  currentInterval: BillingInterval | null
  onConfirm: (planId: string, interval: BillingInterval) => Promise<void>
}

export function PlanChangeDialog({
  open,
  onOpenChange,
  currentPlanId,
  currentInterval,
  onConfirm,
}: PlanChangeDialogProps) {
  const [selectedPlanId, setSelectedPlanId] = useState(currentPlanId)
  const [isYearly, setIsYearly] = useState(currentInterval === 'yearly')
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await onConfirm(selectedPlanId, isYearly ? 'yearly' : 'monthly')
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to change plan:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const selectedPlan = PLANS.find(p => p.id === selectedPlanId)
  const currentPlan = PLANS.find(p => p.id === currentPlanId)
  const interval: BillingInterval = isYearly ? 'yearly' : 'monthly'

  // Determine if this is an upgrade or downgrade
  const isUpgrade = selectedPlan && currentPlan &&
    selectedPlan.pricing.monthly > currentPlan.pricing.monthly
  const isDowngrade = selectedPlan && currentPlan &&
    selectedPlan.pricing.monthly < currentPlan.pricing.monthly

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Change Your Plan</DialogTitle>
          <DialogDescription>
            Select a new plan and billing interval
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Billing Interval Toggle */}
          <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
            <div className="flex items-center gap-3">
              <Label htmlFor="interval-toggle">Billing Interval</Label>
              <span className="text-sm text-muted-foreground">
                {isYearly ? 'Yearly' : 'Monthly'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Monthly</span>
              <Switch
                id="interval-toggle"
                checked={isYearly}
                onCheckedChange={setIsYearly}
              />
              <span className="text-sm">Yearly</span>
              {isYearly && (
                <Badge variant="secondary" className="ml-2">Save 17%</Badge>
              )}
            </div>
          </div>

          {/* Plan Selection */}
          <RadioGroup value={selectedPlanId} onValueChange={setSelectedPlanId}>
            <div className="space-y-3">
              {PLANS.map((plan) => {
                const price = plan.pricing[interval] / 100
                const isCurrent = plan.id === currentPlanId

                return (
                  <div
                    key={plan.id}
                    className={`relative border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedPlanId === plan.id
                        ? 'border-accent-cyan bg-accent-cyan/5'
                        : 'border-border hover:border-accent-cyan/50'
                    }`}
                    onClick={() => setSelectedPlanId(plan.id)}
                  >
                    <div className="flex items-start gap-3">
                      <RadioGroupItem value={plan.id} id={plan.id} className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={plan.id} className="text-base font-semibold cursor-pointer">
                            {plan.name}
                          </Label>
                          {plan.recommended && (
                            <Badge className="bg-gradient-to-r from-accent-cyan to-accent-purple text-white border-none">
                              Recommended
                            </Badge>
                          )}
                          {isCurrent && (
                            <Badge variant="outline">Current Plan</Badge>
                          )}
                        </div>
                        <p className="text-2xl font-bold mt-1">
                          ${price}
                          <span className="text-sm font-normal text-muted-foreground">
                            /{interval === 'monthly' ? 'mo' : 'yr'}
                          </span>
                        </p>
                        <ul className="mt-3 space-y-1">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Check className="w-4 h-4 text-accent-cyan" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </RadioGroup>

          {/* Change Info */}
          {(isUpgrade || isDowngrade) && (
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-sm text-blue-600 dark:text-blue-400">
                {isUpgrade && "Your plan will be upgraded immediately with prorated billing."}
                {isDowngrade && "Your plan will be downgraded at the end of your current billing period."}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading || (selectedPlanId === currentPlanId && interval === currentInterval)}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Confirm Change'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
