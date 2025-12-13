import Link from "next/link"
import { SharedHeader } from "@/components/shared-header"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <SharedHeader />

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
              PersistQ (the operator of persistq.com) is the data controller for personal data collected in connection with
              this Service unless otherwise specified. Contact: support@persistq.com.
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
              We retain account and content data for as long as your account exists and as necessary to provide the Service. Upon account deletion we delete primary data within 30 days and cascade-delete memories immediately; database backups may retain deleted data for up to 90 days for disaster recovery purposes. Usage logs and API call metadata are retained for 12 months for security monitoring and abuse detection. Payment records are retained for 7 years to comply with tax and financial obligations. You may export your data at any time via the <span className="font-mono text-sm">/api/memory/export</span> endpoint or dashboard export feature.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Your Rights (EEA)</h2>
            <p className="text-muted-foreground">
              EU/EEA residents have rights including access, rectification, deletion (right to be forgotten), restriction,
              data portability, and objection. To exercise these rights, contact support@persistq.com. We will respond
              within legal timeframes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">California Privacy Rights (CCPA/CPRA)</h2>
            <p className="text-muted-foreground">
              California residents have rights including: (a) Right to Know what personal information we collect, use, disclose, and sell; (b) Right to Delete personal information (subject to legal exceptions); (c) Right to Opt-Out of the sale or sharing of personal information; (d) Right to Correct inaccurate information; (e) Right to Limit use of sensitive personal information; (f) Right to Non-Discrimination for exercising these rights. We do not sell personal information for monetary consideration and do not share personal information for cross-context behavioral advertising. To exercise your California privacy rights, contact <a href="mailto:privacy@persistq.com" className="text-accent-cyan hover:underline">privacy@persistq.com</a> with subject line "California Privacy Rights Request". We will verify your identity and respond within 45 days. You may also visit our <Link href="/do-not-sell" className="text-accent-cyan hover:underline">Do Not Sell or Share My Personal Information</Link> page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Security Measures</h2>
            <p className="text-muted-foreground">
              We use reasonable administrative, technical, and physical safeguards, including encrypted connections
              (HTTPS), hashed API keys (bcrypt), rate limiting, and access controls. However no system is perfectly
              secure; promptly report suspected breaches to support@persistq.com. We will notify affected users and
              authorities as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Cookies and Tracking</h2>
            <p className="text-muted-foreground">
              We use cookies and similar tracking technologies for authentication, session management, and analytics. We categorize cookies as: (a) Strictly Necessary (essential for authentication and security); (b) Functional (preferences and settings); (c) Analytics (aggregated usage data via Vercel Analytics and Highlight.io); and (d) Marketing (currently none). You consent to non-essential cookies via our cookie banner on first visit. Strictly necessary cookies are set automatically as they are essential for the Service to function. You may withdraw consent or manage preferences in your browser settings or via the cookie banner. We maintain records of your consent including timestamp, banner version displayed, and specific choices made. For complete details see our <Link href="/cookie-policy" className="text-accent-cyan hover:underline">Cookie Policy</Link>.
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
              For privacy inquiries or to exercise rights, contact: <a href="mailto:support@persistq.com" className="text-accent-cyan hover:underline">support@persistq.com</a>. If you are an EU data subject
              and want to escalate, specify 'Data Subject Request' in the subject line.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-wrap gap-4">
            <Link href="/terms" className="text-accent-cyan hover:underline">Terms of Service</Link>
            <Link href="/refund-policy" className="text-accent-cyan hover:underline">Refund Policy</Link>
            <Link href="/cookie-policy" className="text-accent-cyan hover:underline">Cookie Policy</Link>
            <Link href="/do-not-sell" className="text-accent-cyan hover:underline">Do Not Sell</Link>
            <Link href="/accessibility" className="text-accent-cyan hover:underline">Accessibility</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
