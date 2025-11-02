"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Database, Copy, Check } from "lucide-react"
import { useState } from "react"

export default function GettingStartedPage() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null)

  const copyCode = (code: string, section: string) => {
    navigator.clipboard.writeText(code)
    setCopiedSection(section)
    setTimeout(() => setCopiedSection(null), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold">Memory Layer</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Docs
            </Link>
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
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

      <div className="border-b border-border/40 bg-accent-cyan/5">
        <div className="container mx-auto px-4 py-3">
          <p className="text-sm text-center">
            <span className="font-semibold text-accent-cyan">Preview Documentation</span> - Code examples shown are
            illustrative. Actual implementation may vary.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/docs" className="hover:text-foreground">
              Docs
            </Link>
            <span>/</span>
            <span className="text-foreground">Getting Started</span>
          </div>

          {/* Content */}
          <article className="prose prose-invert max-w-none">
            <h1 className="text-4xl font-bold mb-4">Getting Started</h1>
            <p className="text-xl text-muted-foreground mb-12">
              Learn how to integrate Memory Layer into your AI application in under 5 minutes.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-4">Installation</h2>
            <p className="text-muted-foreground mb-4">Install the Memory Layer SDK for your preferred language:</p>

            <div className="rounded-lg border border-border bg-surface p-4 mb-8 relative group">
              <button
                onClick={() => copyCode("npm install @memorylayer/sdk", "npm")}
                className="absolute top-4 right-4 p-2 rounded hover:bg-background transition-colors"
              >
                {copiedSection === "npm" ? (
                  <Check className="w-4 h-4 text-accent-cyan" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              <pre className="text-sm overflow-x-auto">
                <code>npm install @memorylayer/sdk</code>
              </pre>
            </div>

            <div className="rounded-lg border border-border bg-surface p-4 mb-8 relative group">
              <button
                onClick={() => copyCode("pip install memorylayer", "pip")}
                className="absolute top-4 right-4 p-2 rounded hover:bg-background transition-colors"
              >
                {copiedSection === "pip" ? (
                  <Check className="w-4 h-4 text-accent-cyan" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              <pre className="text-sm overflow-x-auto">
                <code>pip install memorylayer</code>
              </pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Authentication</h2>
            <p className="text-muted-foreground mb-4">
              Get your API key from the{" "}
              <Link href="/dashboard/api-keys" className="text-accent-cyan hover:underline">
                dashboard
              </Link>{" "}
              and set it as an environment variable:
            </p>

            <div className="rounded-lg border border-border bg-surface p-4 mb-8 relative group">
              <button
                onClick={() => copyCode("export MEMORYLAYER_API_KEY=ml_your_api_key_here", "env")}
                className="absolute top-4 right-4 p-2 rounded hover:bg-background transition-colors"
              >
                {copiedSection === "env" ? (
                  <Check className="w-4 h-4 text-accent-cyan" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              <pre className="text-sm overflow-x-auto">
                <code>export MEMORYLAYER_API_KEY=ml_your_api_key_here</code>
              </pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Your First Request</h2>
            <p className="text-muted-foreground mb-4">Store your first memory:</p>

            <div className="rounded-lg border border-border bg-surface p-4 mb-8 relative group">
              <button
                onClick={() =>
                  copyCode(
                    `import { MemoryLayer } from '@memorylayer/sdk';

const ml = new MemoryLayer(process.env.MEMORYLAYER_API_KEY);

// Store a memory
const memory = await ml.memories.create({
  content: 'User prefers dark mode and compact layouts',
  group: 'preferences',
  tags: ['ui', 'settings']
});

console.log('Memory stored:', memory.id);`,
                    "first",
                  )
                }
                className="absolute top-4 right-4 p-2 rounded hover:bg-background transition-colors"
              >
                {copiedSection === "first" ? (
                  <Check className="w-4 h-4 text-accent-cyan" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              <pre className="text-sm overflow-x-auto">
                <code>{`import { MemoryLayer } from '@memorylayer/sdk';

const ml = new MemoryLayer(process.env.MEMORYLAYER_API_KEY);

// Store a memory
const memory = await ml.memories.create({
  content: 'User prefers dark mode and compact layouts',
  group: 'preferences',
  tags: ['ui', 'settings']
});

console.log('Memory stored:', memory.id);`}</code>
              </pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Retrieve Memories</h2>
            <p className="text-muted-foreground mb-4">Query memories by group or search semantically:</p>

            <div className="rounded-lg border border-border bg-surface p-4 mb-8 relative group">
              <button
                onClick={() =>
                  copyCode(
                    `// Get all memories in a group
const preferences = await ml.memories.list({
  group: 'preferences'
});

// Semantic search
const results = await ml.memories.search({
  query: 'What are the user UI preferences?',
  limit: 5
});`,
                    "retrieve",
                  )
                }
                className="absolute top-4 right-4 p-2 rounded hover:bg-background transition-colors"
              >
                {copiedSection === "retrieve" ? (
                  <Check className="w-4 h-4 text-accent-cyan" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              <pre className="text-sm overflow-x-auto">
                <code>{`// Get all memories in a group
const preferences = await ml.memories.list({
  group: 'preferences'
});

// Semantic search
const results = await ml.memories.search({
  query: 'What are the user UI preferences?',
  limit: 5
});`}</code>
              </pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Next Steps</h2>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <Link
                href="/docs/api-reference"
                className="p-6 rounded-lg border border-border bg-surface hover:border-accent-cyan transition-colors"
              >
                <h3 className="font-semibold mb-2">API Reference</h3>
                <p className="text-sm text-muted-foreground">Explore all available endpoints and parameters</p>
              </Link>
              <Link
                href="/docs/guides"
                className="p-6 rounded-lg border border-border bg-surface hover:border-accent-purple transition-colors"
              >
                <h3 className="font-semibold mb-2">Guides</h3>
                <p className="text-sm text-muted-foreground">Learn best practices and advanced patterns</p>
              </Link>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}
