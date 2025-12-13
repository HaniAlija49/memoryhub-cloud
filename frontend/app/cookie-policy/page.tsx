import Link from "next/link"
import { SharedHeader } from "@/components/shared-header"

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <SharedHeader />

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-2">Cookie Policy</h1>
        <p className="text-muted-foreground mb-8">Effective Date: November 20, 2025</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-3">What Are Cookies</h2>
            <p className="text-muted-foreground">
              Cookies are small text files placed on your device when you visit our website. They help us provide essential functionality, remember your preferences, understand how you use our Service, and improve your experience. Cookies contain information that is transferred to your device's hard drive and stored in your browser.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">How We Use Cookies</h2>
            <p className="text-muted-foreground">
              We use cookies for several purposes: (a) Authentication and security (ensuring you remain logged in and protecting against unauthorized access); (b) Session management (maintaining your session state across pages); (c) Preferences (remembering your settings and choices); (d) Analytics (understanding how visitors interact with our Service); and (e) Performance optimization (improving load times and user experience).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Types of Cookies We Use</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-accent-cyan">1. Strictly Necessary Cookies</h3>
                <p className="text-muted-foreground mb-2">
                  These cookies are essential for the Service to function and cannot be disabled. They enable core functionality such as authentication, security, and session management.
                </p>
                <div className="bg-surface p-4 rounded-lg">
                  <p className="font-mono text-sm mb-2"><strong>Cookie Name:</strong> __session (Clerk Auth)</p>
                  <p className="text-sm text-muted-foreground mb-1"><strong>Purpose:</strong> Authentication and session management</p>
                  <p className="text-sm text-muted-foreground mb-1"><strong>Duration:</strong> Session (expires when browser closes)</p>
                  <p className="text-sm text-muted-foreground"><strong>Provider:</strong> Clerk (clerk.com)</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2 text-accent-cyan">2. Functional Cookies</h3>
                <p className="text-muted-foreground mb-2">
                  These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.
                </p>
                <div className="bg-surface p-4 rounded-lg">
                  <p className="font-mono text-sm mb-2"><strong>Cookie Name:</strong> cookie-consent</p>
                  <p className="text-sm text-muted-foreground mb-1"><strong>Purpose:</strong> Store your cookie consent preferences</p>
                  <p className="text-sm text-muted-foreground mb-1"><strong>Duration:</strong> 12 months</p>
                  <p className="text-sm text-muted-foreground"><strong>Provider:</strong> PersistQ (first-party)</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2 text-accent-cyan">3. Analytics Cookies</h3>
                <p className="text-muted-foreground mb-2">
                  These cookies help us understand how visitors interact with our Service by collecting and reporting information anonymously. We use this data to improve performance and user experience.
                </p>
                <div className="space-y-3">
                  <div className="bg-surface p-4 rounded-lg">
                    <p className="font-mono text-sm mb-2"><strong>Cookie Name:</strong> _va (Vercel Analytics)</p>
                    <p className="text-sm text-muted-foreground mb-1"><strong>Purpose:</strong> Anonymous page view tracking and performance monitoring</p>
                    <p className="text-sm text-muted-foreground mb-1"><strong>Duration:</strong> 24 hours</p>
                    <p className="text-sm text-muted-foreground"><strong>Provider:</strong> Vercel (vercel.com)</p>
                  </div>
                  <div className="bg-surface p-4 rounded-lg">
                    <p className="font-mono text-sm mb-2"><strong>Cookie Name:</strong> highlight-session (Highlight.io)</p>
                    <p className="text-sm text-muted-foreground mb-1"><strong>Purpose:</strong> Session replay and error monitoring for debugging</p>
                    <p className="text-sm text-muted-foreground mb-1"><strong>Duration:</strong> 30 days</p>
                    <p className="text-sm text-muted-foreground"><strong>Provider:</strong> Highlight.io (highlight.io)</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2 text-accent-cyan">4. Marketing Cookies</h3>
                <p className="text-muted-foreground">
                  We currently do not use marketing or advertising cookies. If we introduce them in the future, we will update this policy and obtain your explicit consent.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Third-Party Cookies</h2>
            <p className="text-muted-foreground">
              We use the following third-party services that may set cookies: (a) <strong>Clerk</strong> (authentication and user management); (b) <strong>Vercel</strong> (hosting and analytics); (c) <strong>Highlight.io</strong> (monitoring and error tracking). These providers may use cookies to deliver their services. Their use of cookies is governed by their respective privacy policies. We do not control third-party cookies and recommend reviewing their privacy policies for more information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Your Cookie Choices</h2>
            <p className="text-muted-foreground">
              You have several options to manage cookies:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3">
              <li><strong>Cookie Banner:</strong> When you first visit our site, you can accept all cookies, accept only necessary cookies, or customize your preferences.</li>
              <li><strong>Browser Settings:</strong> Most browsers allow you to refuse cookies or delete existing cookies. Instructions vary by browser (Chrome, Firefox, Safari, Edge). Note that disabling necessary cookies may affect site functionality.</li>
              <li><strong>Opt-Out Links:</strong> You can opt out of analytics tracking through provider-specific mechanisms (Vercel Analytics, Highlight.io).</li>
              <li><strong>Do Not Track:</strong> We respect Do Not Track (DNT) signals for analytics cookies where technically feasible.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Cookie Consent Management</h2>
            <p className="text-muted-foreground">
              We maintain records of your cookie consent preferences, including: (a) Timestamp of consent; (b) Cookie banner version displayed; (c) Categories of cookies accepted or rejected; (d) Method of consent (accept all, necessary only, or custom). You may withdraw or modify your consent at any time by clearing your browser cookies and revisiting our site, or by contacting us at <a href="mailto:support@persistq.com" className="text-accent-cyan hover:underline">support@persistq.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Updates to This Cookie Policy</h2>
            <p className="text-muted-foreground">
              We may update this Cookie Policy periodically to reflect changes in our use of cookies or changes in legal requirements. We will notify you of material changes by updating the "Effective Date" at the top of this page and, where appropriate, by displaying a notice or seeking renewed consent via our cookie banner.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about our use of cookies, contact us at <a href="mailto:support@persistq.com" className="text-accent-cyan hover:underline">support@persistq.com</a>.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex gap-4">
          <Link href="/privacy-policy" className="text-accent-cyan hover:underline">Privacy Policy</Link>
          <Link href="/terms" className="text-accent-cyan hover:underline">Terms of Service</Link>
          <Link href="/refund-policy" className="text-accent-cyan hover:underline">Refund Policy</Link>
        </div>
      </div>
    </div>
  )
}
