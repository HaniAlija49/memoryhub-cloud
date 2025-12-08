"use client"

import { useState } from "react"
import Link from "next/link"
import { SharedHeader } from "@/components/shared-header"
import { Button } from "@/components/ui/button"
import { Check, X, ArrowRight } from "lucide-react"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { BillingService } from "@/services/billing.service"
import { useToast } from "@/hooks/use-toast"

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly")
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const { isSignedIn, getToken } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleCheckout = async (planId: string, interval: "monthly" | "yearly") => {
    // Redirect to signup if not authenticated
    if (!isSignedIn) {
      router.push("/signup")
      return
    }

    setIsLoading(`${planId}-${interval}`)

    try {
      const checkoutSession = await BillingService.createCheckout(planId, interval, getToken)

      if (!checkoutSession || !checkoutSession.url) {
        throw new Error("Failed to create checkout session")
      }

      // Redirect to Dodo checkout
      window.location.href = checkoutSession.url
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout Failed",
        description: error instanceof Error ? error.message : "Failed to start checkout. Please try again.",
        variant: "destructive",
      })
      setIsLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SharedHeader activeLink="pricing" />

      {/* Hero */}
      <section className="container mx-auto px-4 pt-20 pb-8 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Simple, transparent pricing</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Start free and scale as you grow. No hidden fees, no surprises.
        </p>
      </section>

      {/* Billing Toggle */}
      <section className="container mx-auto px-4 pb-12">
        <div className="flex items-center justify-center gap-4">
          <span className={`text-sm ${billingPeriod === "monthly" ? "font-semibold" : "text-muted-foreground"}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "yearly" : "monthly")}
            className="relative w-14 h-7 bg-border rounded-full transition-colors hover:bg-border/80"
            aria-label="Toggle billing period"
          >
            <div
              className={`absolute top-1 left-1 w-5 h-5 bg-accent-cyan rounded-full transition-transform ${
                billingPeriod === "yearly" ? "translate-x-7" : ""
              }`}
            />
          </button>
          <span className={`text-sm ${billingPeriod === "yearly" ? "font-semibold" : "text-muted-foreground"}`}>
            Yearly
            <span className="ml-1.5 text-xs text-accent-cyan font-medium">Save up to 17%</span>
          </span>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 pb-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Free Plan */}
          <div className="p-6 rounded-lg border border-border bg-surface">
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <p className="text-muted-foreground mb-6 text-sm">Perfect for testing</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-muted-foreground text-sm">/month</span>
            </div>
            <Link href="/signup">
              <Button variant="outline" className="w-full mb-6 bg-transparent">
                Get started
              </Button>
            </Link>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">5,000 API calls/month</p>
                  <p className="text-xs text-muted-foreground">~165/day</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">250 stored memories</p>
                  <p className="text-xs text-muted-foreground">50KB each, 12.5MB total</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
                <p className="text-sm font-medium">Community support</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
                <p className="text-sm font-medium">Basic analytics</p>
              </div>
            </div>
          </div>

          {/* Starter Plan */}
          <div className="p-6 rounded-lg border border-border bg-surface">
            <h3 className="text-2xl font-bold mb-2">Starter</h3>
            <p className="text-muted-foreground mb-6 text-sm">For small applications</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">${billingPeriod === "monthly" ? "5" : "50"}</span>
              <span className="text-muted-foreground text-sm">/{billingPeriod === "monthly" ? "month" : "year"}</span>
              {billingPeriod === "yearly" && (
                <p className="text-xs text-accent-cyan mt-1">Save $10/year</p>
              )}
            </div>
            <Button
              className="w-full mb-6 bg-accent-cyan hover:bg-accent-cyan/90 text-black"
              onClick={() => handleCheckout("starter", billingPeriod)}
              disabled={isLoading === `starter-${billingPeriod}`}
            >
              {isLoading === `starter-${billingPeriod}` ? "Loading..." : "Get started"}
            </Button>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">50,000 API calls/month</p>
                  <p className="text-xs text-muted-foreground">~1,650/day</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">2,500 stored memories</p>
                  <p className="text-xs text-muted-foreground">100KB each, 250MB total</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Email support</p>
                  <p className="text-xs text-muted-foreground">48hr response</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
                <p className="text-sm font-medium">Basic analytics</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
                <p className="text-sm font-medium">99% uptime SLA</p>
              </div>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="p-6 rounded-lg border-2 border-accent-cyan bg-surface relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent-cyan text-black text-xs font-medium rounded-full">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <p className="text-muted-foreground mb-6 text-sm">For production apps</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">${billingPeriod === "monthly" ? "12" : "120"}</span>
              <span className="text-muted-foreground text-sm">/{billingPeriod === "monthly" ? "month" : "year"}</span>
              {billingPeriod === "yearly" && (
                <p className="text-xs text-accent-cyan mt-1">Save $24/year</p>
              )}
            </div>
            <Button
              className="w-full mb-6 bg-accent-cyan hover:bg-accent-cyan/90 text-black"
              onClick={() => handleCheckout("pro", billingPeriod)}
              disabled={isLoading === `pro-${billingPeriod}`}
            >
              {isLoading === `pro-${billingPeriod}` ? "Loading..." : "Get started"}
            </Button>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">500,000 API calls/month</p>
                  <p className="text-xs text-muted-foreground">~16,500/day</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">25,000 stored memories</p>
                  <p className="text-xs text-muted-foreground">200KB each, 5GB total</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Priority support</p>
                  <p className="text-xs text-muted-foreground">24hr response</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
                <p className="text-sm font-medium">Advanced analytics</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
                <p className="text-sm font-medium">99.9% uptime SLA</p>
              </div>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="p-6 rounded-lg border border-border bg-surface">
            <h3 className="text-2xl font-bold mb-2">Premium</h3>
            <p className="text-muted-foreground mb-6 text-sm">For growing businesses</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">${billingPeriod === "monthly" ? "29" : "290"}</span>
              <span className="text-muted-foreground text-sm">/{billingPeriod === "monthly" ? "month" : "year"}</span>
              {billingPeriod === "yearly" && (
                <p className="text-xs text-accent-cyan mt-1">Save $58/year</p>
              )}
            </div>
            <Button
              className="w-full mb-6 bg-accent-cyan hover:bg-accent-cyan/90 text-black"
              onClick={() => handleCheckout("premium", billingPeriod)}
              disabled={isLoading === `premium-${billingPeriod}`}
            >
              {isLoading === `premium-${billingPeriod}`  ? "Loading..." : "Get started"}
            </Button>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">2M API calls/month</p>
                  <p className="text-xs text-muted-foreground">~66,000/day</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">100,000 stored memories</p>
                  <p className="text-xs text-muted-foreground">500KB each, 50GB total</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Priority support</p>
                  <p className="text-xs text-muted-foreground">12hr response</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
                <p className="text-sm font-medium">Advanced analytics</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
                <p className="text-sm font-medium">99.9% uptime SLA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="container mx-auto px-4 pb-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Feature comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-medium">Feature</th>
                  <th className="text-center py-4 px-4 font-medium">Free</th>
                  <th className="text-center py-4 px-4 font-medium">Starter</th>
                  <th className="text-center py-4 px-4 font-medium">Pro</th>
                  <th className="text-center py-4 px-4 font-medium">Premium</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-4 px-4">API calls per month</td>
                  <td className="text-center py-4 px-4">5,000</td>
                  <td className="text-center py-4 px-4">50,000</td>
                  <td className="text-center py-4 px-4">500,000</td>
                  <td className="text-center py-4 px-4">2,000,000</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-4 px-4">Stored memories</td>
                  <td className="text-center py-4 px-4">250</td>
                  <td className="text-center py-4 px-4">2,500</td>
                  <td className="text-center py-4 px-4">25,000</td>
                  <td className="text-center py-4 px-4">100,000</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-4 px-4">Memory size limit</td>
                  <td className="text-center py-4 px-4">50 KB</td>
                  <td className="text-center py-4 px-4">100 KB</td>
                  <td className="text-center py-4 px-4">200 KB</td>
                  <td className="text-center py-4 px-4">500 KB</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-4 px-4">Total storage cap</td>
                  <td className="text-center py-4 px-4">12.5 MB</td>
                  <td className="text-center py-4 px-4">250 MB</td>
                  <td className="text-center py-4 px-4">5 GB</td>
                  <td className="text-center py-4 px-4">50 GB</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-4 px-4">Support</td>
                  <td className="text-center py-4 px-4">Community</td>
                  <td className="text-center py-4 px-4">Email (48hr)</td>
                  <td className="text-center py-4 px-4">Priority (24hr)</td>
                  <td className="text-center py-4 px-4">Priority (12hr)</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-4 px-4">Analytics</td>
                  <td className="text-center py-4 px-4">Basic</td>
                  <td className="text-center py-4 px-4">Basic</td>
                  <td className="text-center py-4 px-4">Advanced</td>
                  <td className="text-center py-4 px-4">Advanced</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-4 px-4">SLA</td>
                  <td className="text-center py-4 px-4">
                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4">99%</td>
                  <td className="text-center py-4 px-4">99.9%</td>
                  <td className="text-center py-4 px-4">99.9%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 pb-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently asked questions</h2>
          <div className="space-y-6">
            <div className="p-6 rounded-lg border border-border bg-surface">
              <h3 className="font-semibold mb-2">Can I change plans later?</h3>
              <p className="text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll
                prorate any charges.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-surface">
              <h3 className="font-semibold mb-2">What happens if I exceed my plan limits?</h3>
              <p className="text-muted-foreground">
                We'll notify you when you're approaching your limits. Each tier has hard storage caps to ensure fair usage.
                If you hit your storage or API call limit, you'll need to upgrade your plan or delete old memories.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-surface">
              <h3 className="font-semibold mb-2">Why are there storage caps?</h3>
              <p className="text-muted-foreground">
                Storage caps ensure sustainable pricing and fair usage across all customers. Most memories are under 5KB,
                so our limits are designed to be generous for typical use cases while preventing abuse.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-surface">
              <h3 className="font-semibold mb-2">How much can I save with annual billing?</h3>
              <p className="text-muted-foreground">
                Annual plans save you approximately 17% compared to monthly billing - equivalent to getting 2 months free
                per year. You can switch to annual billing at any time from your dashboard.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-surface">
              <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-muted-foreground">
                Yes, we offer a 14-day money-back guarantee for all paid plans. If you're not satisfied, contact support
                for a full refund within the first 14 days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-24">
        <div className="max-w-4xl mx-auto text-center space-y-6 p-12 rounded-2xl border border-border bg-gradient-to-br from-accent-cyan/5 to-accent-purple/5">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to get started?</h2>
          <p className="text-lg text-muted-foreground">
            Start building with PersistQ today. No credit card required.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-accent-cyan hover:bg-accent-cyan/90 text-black font-medium">
              Start building for free
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
