"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check, Shield, Brain, Lock } from "lucide-react"
import { useState } from "react"

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("node")

  const codeExamples = {
    node: `import { MemoryLayer } from '@memorylayer/sdk';

const memory = new MemoryLayer(process.env.MEMORY_API_KEY);

// Store a memory
await memory.store({
  content: 'User prefers dark mode',
  group: 'preferences',
  tags: ['ui', 'settings']
});

// Retrieve memories
const memories = await memory.search({
  query: 'user preferences',
  group: 'preferences'
});`,
    python: `from memorylayer import MemoryLayer

memory = MemoryLayer(api_key=os.getenv('MEMORY_API_KEY'))

# Store a memory
memory.store(
    content='User prefers dark mode',
    group='preferences',
    tags=['ui', 'settings']
)

# Retrieve memories
memories = memory.search(
    query='user preferences',
    group='preferences'
)`,
    curl: `# Store a memory
curl -X POST https://api.memorylayer.dev/v1/memories \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "content": "User prefers dark mode",
    "group": "preferences",
    "tags": ["ui", "settings"]
  }'

# Retrieve memories
curl https://api.memorylayer.dev/v1/memories?group=preferences \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold">Memory Layer</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
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
                Sign Up
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-24 pb-32 md:pt-40 md:pb-48">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-none">
            Build smarter AI with{" "}
            <span className="bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-cyan bg-clip-text text-transparent">
              persistent memory
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            The API that gives your AI agents long-term memory. Store context, retrieve insights, and build truly
            intelligent applications.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-accent-cyan hover:bg-accent-cyan/90 text-black font-medium text-base h-12 px-8"
              >
                Start for Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/docs">
              <Button size="lg" variant="outline" className="text-base h-12 px-8 bg-transparent">
                Read Docs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border/40 bg-surface/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-accent-cyan mb-2">&lt; 50ms</div>
              <div className="text-sm text-muted-foreground">Response time</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-accent-purple mb-2">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime SLA</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-accent-cyan mb-2">300+</div>
              <div className="text-sm text-muted-foreground">Edge locations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-accent-purple mb-2">SOC 2</div>
              <div className="text-sm text-muted-foreground">Type 2</div>
            </div>
          </div>
        </div>
      </section>

      {/* Instant Setup Section */}
      <section className="container mx-auto px-4 py-32">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl font-bold mb-6 leading-tight">
              Instant setup.
              <br />
              <span className="text-muted-foreground">No config.</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Get started in seconds with our simple REST API. No complex setup, no infrastructure to manage.
            </p>
            <Link href="/docs/getting-started">
              <Button variant="link" className="text-accent-cyan p-0 h-auto text-lg">
                View quickstart guide →
              </Button>
            </Link>
          </div>
          <div className="rounded-lg border border-border bg-surface p-6">
            <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-2">terminal</span>
            </div>
            <pre className="text-sm overflow-x-auto">
              <code className="text-accent-cyan">$ </code>
              <code className="text-foreground">npm install @memorylayer/sdk</code>
              <br />
              <br />
              <code className="text-muted-foreground"># Ready to use in 2 seconds</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Works with your stack */}
      <section className="container mx-auto px-4 py-32 bg-surface/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">Works with your stack</h2>
            <p className="text-xl text-muted-foreground">
              Integrate Memory Layer into your language or framework within minutes
            </p>
          </div>

          {/* Language Tabs */}
          <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
            {[
              { id: "node", label: "Node.js" },
              { id: "python", label: "Python" },
              { id: "curl", label: "cURL" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-accent-cyan text-black"
                    : "bg-surface text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Code Example */}
          <div className="rounded-lg border border-border bg-background p-6 max-w-3xl mx-auto">
            <pre className="text-sm overflow-x-auto">
              <code className="text-foreground">{codeExamples[activeTab as keyof typeof codeExamples]}</code>
            </pre>
          </div>

          <div className="text-center mt-8">
            <Link href="/docs/api-reference">
              <Button variant="link" className="text-accent-cyan text-base">
                View full API reference →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Sections */}
      <section id="features" className="container mx-auto px-4 py-32">
        <div className="max-w-6xl mx-auto space-y-32">
          {/* Semantic Search */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-bold mb-6 leading-tight">
                Semantic search.
                <br />
                <span className="text-muted-foreground">Built-in.</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Vector-based search finds relevant memories even with fuzzy queries. No need to remember exact phrases.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-accent-cyan shrink-0 mt-1" />
                  <div>
                    <div className="font-medium mb-1">Automatic embeddings</div>
                    <div className="text-sm text-muted-foreground">We handle vector generation for you</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-accent-cyan shrink-0 mt-1" />
                  <div>
                    <div className="font-medium mb-1">Hybrid search</div>
                    <div className="text-sm text-muted-foreground">Combines semantic and keyword search</div>
                  </div>
                </li>
              </ul>
            </div>
            <div className="rounded-lg border border-border bg-surface p-8">
              <div className="space-y-4">
                <div className="p-4 rounded bg-accent-cyan/10 border border-accent-cyan/20">
                  <div className="text-sm font-medium mb-2">Query: "user color preferences"</div>
                  <div className="text-xs text-muted-foreground">Finds: "User prefers dark mode"</div>
                </div>
                <div className="p-4 rounded bg-accent-purple/10 border border-accent-purple/20">
                  <div className="text-sm font-medium mb-2">Query: "what does the user like"</div>
                  <div className="text-xs text-muted-foreground">Finds: "User enjoys sci-fi movies"</div>
                </div>
              </div>
            </div>
          </div>

          {/* Global Scale */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 rounded-lg border border-border bg-surface p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">North America</span>
                  <span className="text-accent-cyan font-medium">12ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Europe</span>
                  <span className="text-accent-cyan font-medium">18ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Asia Pacific</span>
                  <span className="text-accent-cyan font-medium">24ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">South America</span>
                  <span className="text-accent-cyan font-medium">31ms</span>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-5xl font-bold mb-6 leading-tight">
                Lightning fast.
                <br />
                <span className="text-muted-foreground">Edge ready.</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Deployed across 300+ edge locations worldwide. Your memories are always close to your users.
              </p>
              <Link href="/docs">
                <Button variant="link" className="text-accent-cyan p-0 h-auto text-lg">
                  Learn about our infrastructure →
                </Button>
              </Link>
            </div>
          </div>

          {/* Security */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-bold mb-6 leading-tight">
                Enterprise security.
                <br />
                <span className="text-muted-foreground">By default.</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                SOC 2 Type 2 compliant with end-to-end encryption. Your data is always secure.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-border bg-surface">
                  <Lock className="w-8 h-8 text-accent-cyan mb-2" />
                  <div className="font-medium">Encrypted at rest</div>
                </div>
                <div className="p-4 rounded-lg border border-border bg-surface">
                  <Shield className="w-8 h-8 text-accent-purple mb-2" />
                  <div className="font-medium">SOC 2 Type 2</div>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-surface p-8">
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-accent-cyan shrink-0" />
                  <span>End-to-end encryption</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-accent-cyan shrink-0" />
                  <span>Role-based access control</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-accent-cyan shrink-0" />
                  <span>Audit logs</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-accent-cyan shrink-0" />
                  <span>GDPR compliant</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-accent-cyan shrink-0" />
                  <span>Data residency options</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-5xl md:text-6xl font-bold leading-tight">Ready to build smarter AI?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start building with Memory Layer today. No credit card required.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-accent-cyan hover:bg-accent-cyan/90 text-black font-medium text-base h-14 px-10"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-surface/30">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="hover:text-foreground transition-colors">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link href="/docs/api-reference" className="hover:text-foreground transition-colors">
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link href="/docs/getting-started" className="hover:text-foreground transition-colors">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Status
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-lg">Memory Layer</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 Memory Layer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
