import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Database } from "lucide-react"

export default function RefundPolicyPage() {
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
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
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

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-2">Refund Policy</h1>
        <p className="text-muted-foreground mb-8">Effective Date: November 20, 2025</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-3">Effective Date</h2>
            <p className="text-muted-foreground">
              This Refund Policy is effective as of November 20, 2025 and governs refunds for paid subscriptions and
              purchases made through PersistQ.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">14-Day Money-Back Guarantee</h2>
            <p className="text-muted-foreground">
              We offer a 14-day money-back guarantee from the date of the initial paid purchase for first-time
              subscribers to paid plans. To request a refund within this window, contact support@persistq.dev with your
              account details and reason.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Pro-Rated Cancellations</h2>
            <p className="text-muted-foreground">
              If you cancel a subscription after the 14-day window, you will retain access until the end of the current
              billing period. Refunds outside the 14-day window are granted at our discretion and may be prorated for
              material billing errors only.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Non-Refundable Situations</h2>
            <p className="text-muted-foreground">
              We do not provide refunds for the following: (a) violations of the Terms of Service (including abuse or
              fraud); (b) disputes with third-party integrations; (c) chargebacks reversed in our favor; (d) failure to export
              data prior to cancellation beyond the 30-day export window; (e) partial months unless explicitly stated in a
              written agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">How to Request a Refund</h2>
            <p className="text-muted-foreground">
              Email <a href="mailto:support@persistq.dev" className="text-accent-cyan hover:underline">support@persistq.dev</a> with subject 'Refund Request' including account email, date of purchase, and
              reason. We may request verification and will respond within 10 business days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Chargebacks</h2>
            <p className="text-muted-foreground">
              If you file a chargeback with your payment provider, we may suspend or terminate your account pending
              investigation. If the chargeback is resolved in our favor, you may be responsible for chargeback fees and
              we reserve the right to deny future refunds.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Disputes and Exceptions</h2>
            <p className="text-muted-foreground">
              We evaluate refunds case-by-case. For enterprise or custom agreements, refund terms are governed by
              the written contract between you and PersistQ.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Changes to this Policy</h2>
            <p className="text-muted-foreground">
              We may update this Refund Policy; material changes will be communicated to customers via email or
              dashboard notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Contact</h2>
            <p className="text-muted-foreground">
              <a href="mailto:support@persistq.dev" className="text-accent-cyan hover:underline">support@persistq.dev</a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex gap-4">
          <Link href="/terms" className="text-accent-cyan hover:underline">Terms of Service</Link>
          <Link href="/privacy-policy" className="text-accent-cyan hover:underline">Privacy Policy</Link>
        </div>
      </div>
    </div>
  )
}
