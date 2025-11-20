"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, X, ArrowRight, Database } from "lucide-react"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold">PersistQ</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-sm text-foreground font-medium">
              Pricing
            </Link>
            <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Docs
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-accent-cyan hover:bg-accent-cyan/90 text-black">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 pt-20 pb-12 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Simple, transparent pricing</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Start free and scale as you grow. No hidden fees, no surprises.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 pb-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="p-8 rounded-lg border border-border bg-surface">
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <p className="text-muted-foreground mb-6">Perfect for testing and small projects</p>
            <div className="mb-8">
              <span className="text-5xl font-bold">$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <Link href="/signup">
              <Button variant="outline" className="w-full mb-8 bg-transparent">
                Get started
              </Button>
            </Link>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent-cyan shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">10,000 API calls/month</p>
                  <p className="text-sm text-muted-foreground">~330 calls per day</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent-cyan shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">1,000 stored memories</p>
                  <p className="text-sm text-muted-foreground">Up to 1MB per memory</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent-cyan shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Community support</p>
                  <p className="text-sm text-muted-foreground">Discord & GitHub</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent-cyan shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Basic analytics</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-muted-foreground">Priority support</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="p-8 rounded-lg border-2 border-accent-cyan bg-surface relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent-cyan text-black text-xs font-medium rounded-full">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <p className="text-muted-foreground mb-6">For production applications</p>
            <div className="mb-8">
              <span className="text-5xl font-bold">$49</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <Link href="/signup">
              <Button className="w-full mb-8 bg-accent-cyan hover:bg-accent-cyan/90 text-black">
                Start 14-day free trial
              </Button>
            </Link>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent-cyan shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">1M API calls/month</p>
                  <p className="text-sm text-muted-foreground">$0.05 per 1K after</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent-cyan shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Unlimited memories</p>
                  <p className="text-sm text-muted-foreground">Up to 10MB per memory</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent-cyan shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Priority support</p>
                  <p className="text-sm text-muted-foreground">24-hour response time</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent-cyan shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Advanced analytics</p>
                  <p className="text-sm text-muted-foreground">Usage insights & trends</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent-cyan shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Team collaboration</p>
                  <p className="text-sm text-muted-foreground">Up to 5 team members</p>
                </div>
              </div>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="p-8 rounded-lg border border-border bg-surface">
            <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
            <p className="text-muted-foreground mb-6">For large-scale deployments</p>
            <div className="mb-8">
              <span className="text-5xl font-bold">Custom</span>
            </div>
            <Button variant="outline" className="w-full mb-8 bg-transparent">
              Contact sales
            </Button>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent-cyan shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Unlimited API calls</p>
                  <p className="text-sm text-muted-foreground">Volume discounts available</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent-cyan shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Unlimited memories</p>
                  <p className="text-sm text-muted-foreground">Custom size limits</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent-cyan shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Dedicated support</p>
                  <p className="text-sm text-muted-foreground">Slack channel & phone</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent-cyan shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Custom SLA</p>
                  <p className="text-sm text-muted-foreground">99.99% uptime guarantee</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent-cyan shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">On-premise deployment</p>
                  <p className="text-sm text-muted-foreground">Self-hosted option</p>
                </div>
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
                  <th className="text-center py-4 px-4 font-medium">Pro</th>
                  <th className="text-center py-4 px-4 font-medium">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-4 px-4">API calls per month</td>
                  <td className="text-center py-4 px-4">10,000</td>
                  <td className="text-center py-4 px-4">1,000,000</td>
                  <td className="text-center py-4 px-4">Unlimited</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-4 px-4">Stored memories</td>
                  <td className="text-center py-4 px-4">1,000</td>
                  <td className="text-center py-4 px-4">Unlimited</td>
                  <td className="text-center py-4 px-4">Unlimited</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-4 px-4">Memory size limit</td>
                  <td className="text-center py-4 px-4">1 MB</td>
                  <td className="text-center py-4 px-4">10 MB</td>
                  <td className="text-center py-4 px-4">Custom</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-4 px-4">Team members</td>
                  <td className="text-center py-4 px-4">1</td>
                  <td className="text-center py-4 px-4">5</td>
                  <td className="text-center py-4 px-4">Unlimited</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-4 px-4">Support</td>
                  <td className="text-center py-4 px-4">Community</td>
                  <td className="text-center py-4 px-4">Priority</td>
                  <td className="text-center py-4 px-4">Dedicated</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-4 px-4">SLA</td>
                  <td className="text-center py-4 px-4">
                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4">99.9%</td>
                  <td className="text-center py-4 px-4">99.99%</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-4 px-4">On-premise deployment</td>
                  <td className="text-center py-4 px-4">
                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <Check className="w-5 h-5 text-accent-cyan mx-auto" />
                  </td>
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
                For API calls, we'll charge overage fees at $0.05 per 1,000 calls. For storage, we'll notify you and you
                can upgrade your plan or delete old memories.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-surface">
              <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-muted-foreground">
                Yes, we offer a 30-day money-back guarantee for annual plans. Monthly plans are non-refundable but you
                can cancel anytime.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-surface">
              <h3 className="font-semibold mb-2">Is there a free trial for Pro?</h3>
              <p className="text-muted-foreground">
                Yes, we offer a 14-day free trial for the Pro plan. No credit card required to start.
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
