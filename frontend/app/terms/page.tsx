import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Database } from "lucide-react"

export default function TermsPage() {
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
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Effective Date: November 20, 2025</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-3">Effective Date</h2>
            <p className="text-muted-foreground">
              These Terms of Service ("Terms") are effective as of November 20, 2025. They govern your access to and
              use of PersistQ ("Service"), operated by the account owner ("we", "us", "PersistQ"). By using the Service
              you agree to these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Service Description</h2>
            <p className="text-muted-foreground">
              PersistQ provides a semantic memory storage API and related developer tools and dashboards. The
              Service includes APIs for storing, searching, listing and deleting 'memories', local embedding generation
              using Transformers.js, SDKs and a web dashboard. Exact features, quotas and pricing are described on
              the pricing page and documentation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Accounts, API Keys and Security</h2>
            <p className="text-muted-foreground">
              To use core API endpoints you must possess and keep secure an API key. You are responsible for all
              activity that occurs using your API key. If an API key is compromised you must rotate it immediately and
              notify us. We may suspend or revoke keys for abuse or security reasons. We recommend storing keys in a
              secure secrets manager and not committing them to public code repositories.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Acceptable Use Policy</h2>
            <p className="text-muted-foreground">
              You must not use the Service to store, process, or transmit content that: (a) is illegal; (b) infringes
              intellectual property rights; (c) is defamatory, obscene, or harassing; (d) contains targeted PII collected
              without consent; (e) facilitates wrongdoing (e.g., fraud, phishing, malware); or (f) attempts to
              reverse-engineer, overload, or benchmark our systems without consent. You must not bypass rate limits,
              create multiple accounts to circumvent limits, or resell the Service unless you have an express reseller
              agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Data Ownership and Rights</h2>
            <p className="text-muted-foreground">
              You retain all ownership rights in the content ("Memories") you submit to PersistQ. By submitting content
              you grant PersistQ a non-exclusive, worldwide, royalty-free license to store, process, cache, and otherwise
              use that content solely to provide the Service (including generating embeddings and search indexes). We
              do not claim ownership of your content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Privacy and Data Processing</h2>
            <p className="text-muted-foreground">
              Our Privacy Policy governs how we collect, use, disclose, and retain personal data. We generate
              embeddings locally (Transformers.js) and do not send your content to third-party AI providers. We may
              use third party processors (Neon/PostgreSQL, Upstash, Clerk, Vercel, Render, Highlight.io) to operate the
              Service; their access is limited to performing their functions. You are responsible for ensuring you have the
              right to upload any personal data and for complying with applicable privacy laws (including GDPR and
              CCPA) where you operate.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Pricing, Billing and Refunds</h2>
            <p className="text-muted-foreground">
              Use of paid features requires a subscription or payment method on file. You authorize us to charge the
              payment method for all fees incurred. Prices, tiers, and quotas are published on our pricing page and may
              be changed with notice. For details about refunds see our <Link href="/refund-policy" className="text-accent-cyan hover:underline">Refund Policy</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Term, Suspension and Termination</h2>
            <p className="text-muted-foreground">
              Subscriptions continue until canceled. We may suspend or terminate your account immediately for
              violations of these Terms, security incidents, or illegal activity. Upon termination for convenience by you,
              we will retain your data for a limited period (30 days) to allow export. For terminations due to breach, we
              may permanently delete data after notice. Any accrued but unpaid fees survive termination.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Backup and Data Retention</h2>
            <p className="text-muted-foreground">
              We maintain backups and reasonable data retention policies but do not guarantee against loss. You
              should export or backup critical data independently. We may retain backups for operational reasons for a
              limited period even after account deletion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Intellectual Property</h2>
            <p className="text-muted-foreground">
              PersistQ and its licensors retain all intellectual property rights in the Service, documentation, and SDKs.
              You retain ownership of your content. You are granted a limited, non-exclusive license to use the Service
              and associated SDKs in accordance with these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Third-party Services and Links</h2>
            <p className="text-muted-foreground">
              The Service may include links to third-party services and integrate with third-party vendors (e.g., Clerk for
              auth, Neon for DB, Upstash for Redis). We are not responsible for their policies or services. Use of
              third-party services may be subject to additional terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Warranties and Disclaimers</h2>
            <p className="text-muted-foreground">
              The Service is provided "as is" and "as available" without warranties of any kind, express or implied. We
              do not warrant that the Service will be uninterrupted, secure, or error-free. We make commercially
              reasonable efforts to run the Service and maintain backups but disclaim liability to the maximum extent
              permitted by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Limitation of Liability</h2>
            <p className="text-muted-foreground">
              To the maximum extent permitted by applicable law, PersistQ's total liability for any claim arising out of or
              related to these Terms shall not exceed the total amount paid by you to PersistQ in the 12 months
              preceding the claim, or $100 if you paid nothing. We are not liable for indirect, incidental, consequential,
              special, or punitive damages, including lost profits or lost data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Indemnification</h2>
            <p className="text-muted-foreground">
              You agree to indemnify, defend and hold harmless PersistQ, its officers, employees, and agents from and
              against any claims arising from your violation of these Terms, your content, or your negligent or willful acts.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Modifications to Service and Terms</h2>
            <p className="text-muted-foreground">
              We may modify or discontinue features of the Service or update these Terms. We will provide notice of
              material changes via email or dashboard; continued use after notice constitutes acceptance. For major
              changes that adversely affect users, we will provide at least 30 days' notice where practicable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Governing Law and Dispute Resolution</h2>
            <p className="text-muted-foreground">
              These Terms are governed by the laws of the Republic of North Macedonia without regard to conflicts of
              law rules. Any dispute arising hereunder will be resolved in the courts located in Skopje, North Macedonia,
              unless otherwise agreed. You and PersistQ waive trial by jury to the maximum extent permitted by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Miscellaneous</h2>
            <p className="text-muted-foreground">
              These Terms constitute the entire agreement between you and PersistQ regarding the Service. If any
              provision is held invalid, the remainder shall continue in full force. Failure to enforce a right is not a waiver.
              For support, contact support@persistq.dev.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Contact</h2>
            <p className="text-muted-foreground">
              PersistQ<br />
              Email: <a href="mailto:support@persistq.dev" className="text-accent-cyan hover:underline">support@persistq.dev</a><br />
              Website: <a href="https://persistq.dev" className="text-accent-cyan hover:underline">https://persistq.dev</a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex gap-4">
          <Link href="/privacy-policy" className="text-accent-cyan hover:underline">Privacy Policy</Link>
          <Link href="/refund-policy" className="text-accent-cyan hover:underline">Refund Policy</Link>
        </div>
      </div>
    </div>
  )
}
