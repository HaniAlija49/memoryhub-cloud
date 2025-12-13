import Link from "next/link"
import { SharedHeader } from "@/components/shared-header"

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-background">
      <SharedHeader />

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-2">Accessibility Statement</h1>
        <p className="text-muted-foreground mb-8">Last Updated: November 20, 2025</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-3">Our Commitment</h2>
            <p className="text-muted-foreground">
              PersistQ is committed to ensuring digital accessibility for all users, including those with disabilities. We continuously work to improve the accessibility and usability of our Service and strive to adhere to accepted standards and best practices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Accessibility Standards</h2>
            <p className="text-muted-foreground">
              We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards published by the World Wide Web Consortium (W3C). These guidelines explain how to make web content more accessible for people with disabilities and more user-friendly for everyone.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Accessibility Features</h2>
            <p className="text-muted-foreground">
              Our Service includes the following accessibility features:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3">
              <li><strong>Keyboard Navigation:</strong> All interactive elements are accessible via keyboard (Tab, Enter, Arrow keys)</li>
              <li><strong>Screen Reader Compatibility:</strong> Semantic HTML and ARIA labels for assistive technologies</li>
              <li><strong>High Contrast Mode:</strong> Dark theme with sufficient color contrast ratios</li>
              <li><strong>Focus Indicators:</strong> Clear visual focus states for interactive elements</li>
              <li><strong>Responsive Design:</strong> Adapts to different screen sizes and zoom levels</li>
              <li><strong>Alt Text:</strong> Descriptive alternative text for images and icons</li>
              <li><strong>Clear Typography:</strong> Readable font sizes and line spacing</li>
              <li><strong>Form Labels:</strong> Clearly labeled form fields with error messaging</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Known Limitations</h2>
            <p className="text-muted-foreground">
              We acknowledge that some areas of our Service may not yet be fully accessible. Known limitations include:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3">
              <li>Some third-party integrations (Clerk authentication) may have their own accessibility limitations</li>
              <li>Certain complex interactive elements may require additional assistive technology support</li>
              <li>PDF documents or exported files may not always meet accessibility standards</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              We are actively working to address these limitations and improve accessibility across all aspects of our Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Assistive Technologies</h2>
            <p className="text-muted-foreground">
              Our Service is designed to be compatible with the following assistive technologies:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3">
              <li>Screen readers (JAWS, NVDA, VoiceOver)</li>
              <li>Screen magnification software</li>
              <li>Speech recognition software</li>
              <li>Keyboard-only navigation</li>
              <li>Browser-based zoom and text size adjustments</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Browser Compatibility</h2>
            <p className="text-muted-foreground">
              For the best accessible experience, we recommend using the latest versions of:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3">
              <li>Google Chrome</li>
              <li>Mozilla Firefox</li>
              <li>Apple Safari</li>
              <li>Microsoft Edge</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Feedback and Support</h2>
            <p className="text-muted-foreground">
              We welcome feedback on the accessibility of our Service. If you encounter accessibility barriers or have suggestions for improvement, please contact us:
            </p>
            <div className="bg-surface p-4 rounded-lg mt-4">
              <p className="text-muted-foreground">
                <strong>Email:</strong> <a href="mailto:support@persistq.com" className="text-accent-cyan hover:underline">support@persistq.com</a><br />
                <strong>Subject Line:</strong> "Accessibility Feedback"<br />
                <strong>Include:</strong> Description of the issue, URL/page affected, assistive technology used (if applicable)
              </p>
            </div>
            <p className="text-muted-foreground mt-3">
              We will respond to accessibility feedback within 5 business days and work to address reported issues as quickly as possible.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Third-Party Content</h2>
            <p className="text-muted-foreground">
              Some content or functionality on our Service may be provided by third parties (e.g., Clerk authentication, payment processors). While we strive to ensure all third-party integrations meet accessibility standards, we cannot guarantee the accessibility of external content or services. If you encounter accessibility issues with third-party content, please contact us so we can work with the provider to address the issue.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Continuous Improvement</h2>
            <p className="text-muted-foreground">
              Accessibility is an ongoing effort. We regularly:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3">
              <li>Conduct accessibility audits and testing</li>
              <li>Train our development team on accessibility best practices</li>
              <li>Incorporate accessibility into our design and development process</li>
              <li>Monitor and implement updates to accessibility standards</li>
              <li>Gather and act on user feedback</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Accessibility Roadmap</h2>
            <p className="text-muted-foreground">
              Our ongoing accessibility improvements include:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3">
              <li><strong>Q1 2026:</strong> Complete WCAG 2.1 Level AA audit and remediation</li>
              <li><strong>Q2 2026:</strong> Enhanced keyboard navigation patterns</li>
              <li><strong>Q3 2026:</strong> Screen reader optimization for dashboard components</li>
              <li><strong>Q4 2026:</strong> User testing with assistive technology users</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Alternative Formats</h2>
            <p className="text-muted-foreground">
              If you require documentation or content in an alternative format (e.g., large print, Braille, audio), please contact us at <a href="mailto:support@persistq.com" className="text-accent-cyan hover:underline">support@persistq.com</a>. We will work to provide the requested format within a reasonable timeframe.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Legal Compliance</h2>
            <p className="text-muted-foreground">
              We are committed to complying with applicable accessibility laws and regulations, including:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3">
              <li>Americans with Disabilities Act (ADA) - Title III</li>
              <li>Section 508 of the Rehabilitation Act</li>
              <li>European Accessibility Act (EAA)</li>
              <li>EN 301 549 (European accessibility standard)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Updates to This Statement</h2>
            <p className="text-muted-foreground">
              This Accessibility Statement will be updated periodically to reflect changes to our Service and accessibility improvements. The "Last Updated" date at the top indicates when this statement was last revised.
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
