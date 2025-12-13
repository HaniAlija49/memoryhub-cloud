import Link from "next/link"
import { SharedHeader } from "@/components/shared-header"

export default function DoNotSellPage() {
  return (
    <div className="min-h-screen bg-background">
      <SharedHeader />

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-2">Do Not Sell or Share My Personal Information</h1>
        <p className="text-muted-foreground mb-8">California Consumer Privacy Act (CCPA/CPRA) Rights</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-3">Our Commitment</h2>
            <p className="text-muted-foreground">
              PersistQ respects your privacy rights under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA). We want to be clear: <strong>We do not sell your personal information for monetary consideration, and we do not share your personal information for cross-context behavioral advertising</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">What Does "Sell" and "Share" Mean?</h2>
            <p className="text-muted-foreground">
              Under California law:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3">
              <li><strong>"Sell"</strong> means disclosing personal information to a third party for monetary or other valuable consideration.</li>
              <li><strong>"Share"</strong> means disclosing personal information to a third party for cross-context behavioral advertising (targeted ads based on your activity across different websites).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">How We Use Your Information</h2>
            <p className="text-muted-foreground">
              We collect and use personal information solely to provide our Service:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3">
              <li><strong>Service Delivery:</strong> Store and retrieve your memories, manage your account, process payments</li>
              <li><strong>Service Improvement:</strong> Analyze aggregated usage data to improve performance and features</li>
              <li><strong>Security:</strong> Detect fraud, abuse, and security incidents</li>
              <li><strong>Legal Compliance:</strong> Comply with legal obligations and respond to lawful requests</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              We do not disclose your personal information to third parties for their own marketing purposes or for cross-context behavioral advertising.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Third-Party Service Providers</h2>
            <p className="text-muted-foreground">
              We use third-party service providers to operate our Service, including:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3">
              <li><strong>Clerk:</strong> Authentication and user management</li>
              <li><strong>Neon:</strong> PostgreSQL database hosting</li>
              <li><strong>Upstash:</strong> Redis caching</li>
              <li><strong>Vercel/Render:</strong> Application hosting</li>
              <li><strong>Highlight.io:</strong> Monitoring and error tracking</li>
              <li><strong>Stripe:</strong> Payment processing (if applicable)</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              These service providers are contractually obligated to use your information only to provide services to us and are prohibited from selling or sharing your information. Their access is limited to performing their specific functions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Your California Privacy Rights</h2>
            <p className="text-muted-foreground">
              If you are a California resident, you have the following rights under CCPA/CPRA:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3">
              <li><strong>Right to Know:</strong> Request disclosure of the categories and specific pieces of personal information we have collected, the sources, purposes, and third parties with whom we share it</li>
              <li><strong>Right to Delete:</strong> Request deletion of your personal information (subject to legal exceptions)</li>
              <li><strong>Right to Correct:</strong> Request correction of inaccurate personal information</li>
              <li><strong>Right to Opt-Out:</strong> Opt out of the sale or sharing of your personal information (though we do not engage in these activities)</li>
              <li><strong>Right to Limit:</strong> Limit the use and disclosure of sensitive personal information</li>
              <li><strong>Right to Non-Discrimination:</strong> You will not receive discriminatory treatment for exercising your privacy rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">How to Exercise Your Rights</h2>
            <p className="text-muted-foreground">
              To exercise any of your California privacy rights, you may:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3">
              <li>Email us at <a href="mailto:privacy@persistq.com" className="text-accent-cyan hover:underline">privacy@persistq.com</a> with subject line "California Privacy Rights Request"</li>
              <li>Include your account email and specify which right(s) you wish to exercise</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              We will verify your identity before processing your request and respond within 45 days. We may extend this period by an additional 45 days if necessary, in which case we will inform you of the extension and the reason.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Verification Process</h2>
            <p className="text-muted-foreground">
              To protect your privacy and security, we will verify your identity before fulfilling requests to know, delete, or correct personal information. We may request:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3">
              <li>Your account email address</li>
              <li>Verification of account ownership (e.g., login confirmation)</li>
              <li>Additional information to match our records</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Authorized Agents</h2>
            <p className="text-muted-foreground">
              You may designate an authorized agent to make requests on your behalf. The authorized agent must provide:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3">
              <li>Proof of authorization (signed permission from you)</li>
              <li>Verification of your identity</li>
              <li>Verification of the agent's identity</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              We may deny requests from agents who cannot provide sufficient proof of authorization.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Sensitive Personal Information</h2>
            <p className="text-muted-foreground">
              We do not collect or use sensitive personal information (as defined by CPRA) except as necessary to provide the Service. If you have concerns about sensitive information, contact us at <a href="mailto:privacy@persistq.com" className="text-accent-cyan hover:underline">privacy@persistq.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Contact Information</h2>
            <p className="text-muted-foreground">
              For questions about your California privacy rights or this notice:
            </p>
            <p className="text-muted-foreground mt-3">
              Email: <a href="mailto:privacy@persistq.com" className="text-accent-cyan hover:underline">privacy@persistq.com</a><br />
              Subject Line: "California Privacy Rights Request"
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Updates to This Notice</h2>
            <p className="text-muted-foreground">
              We may update this notice periodically. Material changes will be communicated via email or dashboard notification. The "Effective Date" at the top indicates when the notice was last updated.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex gap-4">
          <Link href="/privacy-policy" className="text-accent-cyan hover:underline">Privacy Policy</Link>
          <Link href="/terms" className="text-accent-cyan hover:underline">Terms of Service</Link>
          <Link href="/cookie-policy" className="text-accent-cyan hover:underline">Cookie Policy</Link>
        </div>
      </div>
    </div>
  )
}
