import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Database } from "lucide-react"

export default function PrivacyPolicyPage() {
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
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Effective Date: November 20, 2025</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-3">Effective Date</h2>
            <p className="text-muted-foreground">
              This Privacy Policy is effective as of November 20, 2025. It explains how PersistQ collects, uses, shares
              and protects personal data when you use our Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Controller</h2>
            <p className="text-muted-foreground">
              PersistQ (the operator of persistq.dev) is the data controller for personal data collected in connection with
              this Service unless otherwise specified. Contact: support@persistq.dev.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">What We Collect</h2>
            <p className="text-muted-foreground">
              We may collect: (a) Account information (email, name); (b) Usage data (API call logs, timestamps, IP
              addresses, request metadata); (c) Content you upload ("Memories"); (d) Payment information via our
              payment processor (we do not store full card numbers); (e) Cookies and similar tracking for the dashboard
              experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">How We Use Personal Data</h2>
            <p className="text-muted-foreground">
              We use data to: provide and operate the Service; authenticate and manage accounts; bill and process
              payments; detect abuse and enforce policies; improve and develop features; provide customer support;
              and comply with legal obligations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Legal Bases (for EU / GDPR)</h2>
            <p className="text-muted-foreground">
              If you are in the EEA, our legal bases for processing include: (a) performance of a contract (to provide the
              Service); (b) legitimate interests (fraud prevention, service improvement); (c) consent where applicable;
              and (d) compliance with legal obligations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Data Processors and Third Parties</h2>
            <p className="text-muted-foreground">
              We use subprocessors to operate the Service: Neon (PostgreSQL + pgvector), Upstash (Redis), Clerk
              (auth), Vercel/Render (hosting), Highlight.io (monitoring), Stripe or chosen payment processor, and other
              vendors. We require subprocessors to protect data in line with this Policy. We generate embeddings
              locally (Transformers.js) and do not send content to third-party AI providers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Data Retention and Deletion</h2>
            <p className="text-muted-foreground">
              We retain account and content data for as long as your account exists and as necessary to provide the
              Service. Upon account deletion we will delete your primary data and cascade-delete memories; backups
              may be retained for a limited period. You may export your data via the export endpoint. Data retention
              schedules and exact durations may be provided upon request.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Your Rights (EEA)</h2>
            <p className="text-muted-foreground">
              EU/EEA residents have rights including access, rectification, deletion (right to be forgotten), restriction,
              data portability, and objection. To exercise these rights, contact support@persistq.dev. We will respond
              within legal timeframes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Security Measures</h2>
            <p className="text-muted-foreground">
              We use reasonable administrative, technical, and physical safeguards, including encrypted connections
              (HTTPS), hashed API keys (bcrypt), rate limiting, and access controls. However no system is perfectly
              secure; promptly report suspected breaches to support@persistq.dev. We will notify affected users and
              authorities as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Cookies and Tracking</h2>
            <p className="text-muted-foreground">
              We use minimal cookies for authentication and session management. We may use analytics and
              monitoring tools (Vercel analytics, Highlight.io). To manage cookies, use browser settings or the
              dashboard controls where available.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Children's Privacy</h2>
            <p className="text-muted-foreground">
              The Service is not directed to children under 16. We do not knowingly collect personal data from children.
              If we learn we collected data from a child under 16, we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">International Transfers</h2>
            <p className="text-muted-foreground">
              We operate infrastructure in various jurisdictions. Personal data may be transferred to and processed in
              countries outside your jurisdiction (including the USA and EU). Where required, we use appropriate
              safeguards for transfers (e.g., SCCs).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Data Breach Response</h2>
            <p className="text-muted-foreground">
              We maintain an incident response plan. In the event of a material data breach we will notify affected users
              and relevant authorities within applicable timeframes and provide remediation steps.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Changes to this Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy; we will post the revised policy with an updated effective date and notify
              users in the dashboard or by email as appropriate.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Contact & DPO</h2>
            <p className="text-muted-foreground">
              For privacy inquiries or to exercise rights, contact: <a href="mailto:support@persistq.dev" className="text-accent-cyan hover:underline">support@persistq.dev</a>. If you are an EU data subject
              and want to escalate, specify 'Data Subject Request' in the subject line.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex gap-4">
          <Link href="/terms" className="text-accent-cyan hover:underline">Terms of Service</Link>
          <Link href="/refund-policy" className="text-accent-cyan hover:underline">Refund Policy</Link>
        </div>
      </div>
    </div>
  )
}
