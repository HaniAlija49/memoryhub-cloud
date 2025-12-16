"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Star } from "lucide-react"
import Link from "next/link"

interface PricingPlan {
  name: string
  monthlyPrice: number
  yearlyPrice: number
  features: string[]
  highlighted?: boolean
  badge?: string
  apiCalls: string
  memories: string
  storage: string
}

const plans: PricingPlan[] = [
  {
    name: "Hobby",
    monthlyPrice: 0,
    yearlyPrice: 0,
    apiCalls: "5,000",
    memories: "500",
    storage: "25MB",
    features: [
      "Basic semantic search",
      "Local embeddings",
      "Community support only"
    ]
  },
  {
    name: "Builder",
    monthlyPrice: 5,
    yearlyPrice: 48,
    apiCalls: "50K",
    memories: "2,500",
    storage: "250MB",
    features: [
      "Everything in Hobby",
      "Advanced search filters",
      "Email support (best-effort)",
      "99% uptime SLA"
    ]
  },
  {
    name: "RAG Apps",
    monthlyPrice: 12,
    yearlyPrice: 115,
    apiCalls: "500K",
    memories: "25,000",
    storage: "5GB",
    highlighted: true,
    badge: "Most Popular",
    features: [
      "Everything in Builder",
      "Priority email support (24-48h)",
      "Advanced analytics",
      "99.9% uptime SLA"
    ]
  },
  {
    name: "Team / Scale",
    monthlyPrice: 29,
    yearlyPrice: 278,
    apiCalls: "2M",
    memories: "100K",
    storage: "50GB",
    features: [
      "Everything in RAG Apps",
      "Priority support + SLA",
      "Advanced analytics",
      "99.9% uptime guaranteed"
    ]
  }
]

export default function PricingToggle() {
  const [isYearly, setIsYearly] = useState(false)

  const getDisplayPrice = (plan: PricingPlan) => {
    const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice
    return price === 0 ? "Free" : `$${price}`
  }

  const getBillingPeriod = () => {
    return isYearly ? "/year" : "/mo"
  }

  const getSavings = () => {
    return "Save 20% with yearly"
  }

  return (
    <section className="py-32 container mx-auto px-4 bg-surface/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">Simple, transparent pricing</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start free. Scale as you grow. No hidden fees.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-medium transition-colors ${
              !isYearly ? "text-foreground" : "text-muted-foreground"
            }`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isYearly ? "bg-accent-cyan" : "bg-muted"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                  isYearly ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-sm font-medium transition-colors ${
              isYearly ? "text-foreground" : "text-muted-foreground"
            }`}>
              Yearly
            </span>
            {isYearly && (
              <Badge variant="secondary" className="ml-2 bg-green-500/10 text-green-500 border-green-500/20">
                {getSavings()}
              </Badge>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative bg-background/50 border-border/50 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 flex flex-col ${
                plan.highlighted
                  ? "border-2 border-accent-cyan ring-2 ring-accent-cyan/20"
                  : "hover:border-border"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="bg-accent-cyan text-black px-3 py-1 text-xs font-medium rounded-full">
                    <Star className="w-3 h-3 mr-1" />
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="pt-2">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">
                      {getDisplayPrice(plan)}
                    </span>
                    {plan.monthlyPrice > 0 && (
                      <span className="text-lg text-muted-foreground">
                        {getBillingPeriod()}
                      </span>
                    )}
                  </div>
                  {plan.monthlyPrice > 0 && isYearly && (
                    <div className="text-sm text-green-500 mt-1">
                      Save ${(plan.monthlyPrice * 12 - plan.yearlyPrice)} yearly
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4 flex-grow">
                {/* Key Metrics */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">API calls</span>
                    <span className="font-medium">{plan.apiCalls}/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Memories</span>
                    <span className="font-medium">{plan.memories}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Storage</span>
                    <span className="font-medium">{plan.storage}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 pt-4 border-t border-border/30">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="mt-auto">
                <Link href="/signup" className="w-full">
                  <Button
                    className={`w-full h-11 ${
                      plan.highlighted
                        ? "bg-accent-cyan hover:bg-accent-cyan/90 text-black"
                        : "bg-background hover:bg-surface border-border"
                    }`}
                    variant={plan.highlighted ? "default" : "outline"}
                  >
                    {plan.name === "Hobby" ? "Get Started" : "Start Free Trial"}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center space-y-4">
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>14-day money-back guarantee</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            All plans include zero embedding costs and local processing
          </p>
          <div className="pt-4">
            <Link href="/pricing">
              <Button variant="outline" size="lg">
                View detailed comparison
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}