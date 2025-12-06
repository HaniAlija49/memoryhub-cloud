"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Database, Copy, Check, Code2, CheckCircle2, ExternalLink } from "lucide-react"
import { useState } from "react"

export default function TypeScriptSDKPage() {
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
            <span className="text-xl font-semibold">PersistQ</span>
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

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/docs" className="hover:text-foreground">
              Docs
            </Link>
            <span>/</span>
            <span className="text-foreground">TypeScript SDK</span>
          </div>

          {/* Hero */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-accent-cyan/10 flex items-center justify-center">
                <Code2 className="w-6 h-6 text-accent-cyan" />
              </div>
              <h1 className="text-4xl font-bold">TypeScript SDK</h1>
            </div>
            <p className="text-xl text-muted-foreground mb-6">
              Official TypeScript/JavaScript client for PersistQ. Build memory-powered applications with full type safety.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.npmjs.com/package/persistq-sdk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-accent-cyan hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                View on npm
              </a>
              <span className="text-sm text-muted-foreground">v1.0.0</span>
            </div>
          </div>

          {/* Key Features */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            <div className="p-4 rounded-lg border border-border bg-surface">
              <CheckCircle2 className="w-5 h-5 text-accent-cyan mb-2" />
              <h3 className="font-semibold mb-1">Zero Dependencies</h3>
              <p className="text-sm text-muted-foreground">Uses native fetch API. Only 10.7 KB gzipped.</p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-surface">
              <CheckCircle2 className="w-5 h-5 text-accent-cyan mb-2" />
              <h3 className="font-semibold mb-1">Full TypeScript</h3>
              <p className="text-sm text-muted-foreground">Complete type definitions and IntelliSense support.</p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-surface">
              <CheckCircle2 className="w-5 h-5 text-accent-cyan mb-2" />
              <h3 className="font-semibold mb-1">Universal</h3>
              <p className="text-sm text-muted-foreground">Works in Node.js, browsers, Deno, and edge runtimes.</p>
            </div>
          </div>

          <article className="prose prose-invert max-w-none space-y-12">
            {/* Installation */}
            <section>
              <h2 className="text-3xl font-bold mb-4">Installation</h2>
              <div className="rounded-lg border border-border bg-surface p-4 mb-4 relative group">
                <button
                  onClick={() => copyCode("npm install persistq-sdk", "install")}
                  className="absolute top-4 right-4 p-2 rounded hover:bg-background transition-colors"
                >
                  {copiedSection === "install" ? (
                    <Check className="w-4 h-4 text-accent-cyan" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                <pre className="text-sm overflow-x-auto">
                  <code>npm install persistq-sdk</code>
                </pre>
              </div>
              <p className="text-sm text-muted-foreground">
                Also available via yarn, pnpm, or directly from a CDN for browser usage.
              </p>
            </section>

            {/* Quick Start */}
            <section>
              <h2 className="text-3xl font-bold mb-4">Quick Start</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">1. Initialize the Client</h3>
              <div className="rounded-lg border border-border bg-surface p-4 mb-6 relative group">
                <button
                  onClick={() =>
                    copyCode(
                      `import { createClient } from 'persistq-sdk'

const client = createClient({
  baseUrl: 'https://memoryhub-cloud.onrender.com',
  apiKey: process.env.PERSISTQ_API_KEY,
})`,
                      "init",
                    )
                  }
                  className="absolute top-4 right-4 p-2 rounded hover:bg-background transition-colors"
                >
                  {copiedSection === "init" ? (
                    <Check className="w-4 h-4 text-accent-cyan" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                <pre className="text-sm overflow-x-auto">
                  <code>{`import { createClient } from 'persistq-sdk'

const client = createClient({
  baseUrl: 'https://memoryhub-cloud.onrender.com',
  apiKey: process.env.PERSISTQ_API_KEY,
})`}</code>
                </pre>
              </div>

              <h3 className="text-xl font-semibold mt-6 mb-3">2. Store a Memory</h3>
              <div className="rounded-lg border border-border bg-surface p-4 mb-6 relative group">
                <button
                  onClick={() =>
                    copyCode(
                      `const result = await client.createMemory(
  'User prefers dark mode and compact layouts',
  'preferences',
  { category: 'ui', timestamp: new Date().toISOString() }
)

if (result.status === 'success') {
  console.log('Memory created:', result.data?.memoryId)
}`,
                      "create",
                    )
                  }
                  className="absolute top-4 right-4 p-2 rounded hover:bg-background transition-colors"
                >
                  {copiedSection === "create" ? (
                    <Check className="w-4 h-4 text-accent-cyan" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                <pre className="text-sm overflow-x-auto">
                  <code>{`const result = await client.createMemory(
  'User prefers dark mode and compact layouts',
  'preferences',
  { category: 'ui', timestamp: new Date().toISOString() }
)

if (result.status === 'success') {
  console.log('Memory created:', result.data?.memoryId)
}`}</code>
                </pre>
              </div>

              <h3 className="text-xl font-semibold mt-6 mb-3">3. Search Memories</h3>
              <div className="rounded-lg border border-border bg-surface p-4 mb-6 relative group">
                <button
                  onClick={() =>
                    copyCode(
                      `const results = await client.searchMemories('user interface preferences', {
  limit: 5,
  threshold: 0.7,
})

if (results.status === 'success') {
  results.data?.forEach(memory => {
    console.log(\`\${memory.content} (similarity: \${memory.similarity})\`)
  })
}`,
                      "search",
                    )
                  }
                  className="absolute top-4 right-4 p-2 rounded hover:bg-background transition-colors"
                >
                  {copiedSection === "search" ? (
                    <Check className="w-4 h-4 text-accent-cyan" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                <pre className="text-sm overflow-x-auto">
                  <code>{`const results = await client.searchMemories('user interface preferences', {
  limit: 5,
  threshold: 0.7,
})

if (results.status === 'success') {
  results.data?.forEach(memory => {
    console.log(\`\${memory.content} (similarity: \${memory.similarity})\`)
  })
}`}</code>
                </pre>
              </div>
            </section>

            {/* API Reference */}
            <section>
              <h2 className="text-3xl font-bold mb-4">API Methods</h2>

              <div className="space-y-6">
                <div className="p-4 rounded-lg border border-border bg-surface">
                  <h3 className="font-semibold mb-2">createMemory(content, project?, metadata?)</h3>
                  <p className="text-sm text-muted-foreground mb-3">Store a new memory with optional project and metadata</p>
                  <div className="text-xs bg-background p-3 rounded">
                    <code className="text-accent-cyan">content:</code> string (required)<br/>
                    <code className="text-accent-cyan">project:</code> string (optional)<br/>
                    <code className="text-accent-cyan">metadata:</code> object (optional)<br/>
                    <code className="text-muted-foreground">Returns:</code> ApiResponse&lt;&#123; memoryId: string &#125;&gt;
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border bg-surface">
                  <h3 className="font-semibold mb-2">searchMemories(query, options?)</h3>
                  <p className="text-sm text-muted-foreground mb-3">Semantic search across your memories</p>
                  <div className="text-xs bg-background p-3 rounded">
                    <code className="text-accent-cyan">query:</code> string (required)<br/>
                    <code className="text-accent-cyan">options.limit:</code> number (default: 10)<br/>
                    <code className="text-accent-cyan">options.project:</code> string<br/>
                    <code className="text-accent-cyan">options.threshold:</code> number (0-1)<br/>
                    <code className="text-muted-foreground">Returns:</code> ApiResponse&lt;SearchResult[]&gt;
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border bg-surface">
                  <h3 className="font-semibold mb-2">listMemories(params?)</h3>
                  <p className="text-sm text-muted-foreground mb-3">List memories with pagination and filtering</p>
                  <div className="text-xs bg-background p-3 rounded">
                    <code className="text-accent-cyan">params.offset:</code> number (default: 0)<br/>
                    <code className="text-accent-cyan">params.limit:</code> number (default: 20)<br/>
                    <code className="text-accent-cyan">params.project:</code> string<br/>
                    <code className="text-muted-foreground">Returns:</code> PaginatedResponse&lt;Memory&gt;
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border bg-surface">
                  <h3 className="font-semibold mb-2">getMemory(id)</h3>
                  <p className="text-sm text-muted-foreground mb-3">Retrieve a specific memory by ID</p>
                  <div className="text-xs bg-background p-3 rounded">
                    <code className="text-accent-cyan">id:</code> string (required)<br/>
                    <code className="text-muted-foreground">Returns:</code> ApiResponse&lt;Memory&gt;
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border bg-surface">
                  <h3 className="font-semibold mb-2">updateMemory(id, updates)</h3>
                  <p className="text-sm text-muted-foreground mb-3">Update an existing memory</p>
                  <div className="text-xs bg-background p-3 rounded">
                    <code className="text-accent-cyan">id:</code> string (required)<br/>
                    <code className="text-accent-cyan">updates.content:</code> string<br/>
                    <code className="text-accent-cyan">updates.project:</code> string<br/>
                    <code className="text-accent-cyan">updates.metadata:</code> object<br/>
                    <code className="text-muted-foreground">Returns:</code> ApiResponse&lt;&#123; success: boolean &#125;&gt;
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border bg-surface">
                  <h3 className="font-semibold mb-2">deleteMemory(id)</h3>
                  <p className="text-sm text-muted-foreground mb-3">Delete a memory permanently</p>
                  <div className="text-xs bg-background p-3 rounded">
                    <code className="text-accent-cyan">id:</code> string (required)<br/>
                    <code className="text-muted-foreground">Returns:</code> ApiResponse&lt;&#123; success: boolean &#125;&gt;
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border bg-surface">
                  <h3 className="font-semibold mb-2">getStats()</h3>
                  <p className="text-sm text-muted-foreground mb-3">Get memory statistics for your account</p>
                  <div className="text-xs bg-background p-3 rounded">
                    <code className="text-muted-foreground">Returns:</code> ApiResponse&lt;MemoryStats&gt;
                  </div>
                </div>
              </div>
            </section>

            {/* TypeScript Types */}
            <section>
              <h2 className="text-3xl font-bold mb-4">TypeScript Types</h2>
              <p className="text-muted-foreground mb-4">
                The SDK includes full TypeScript definitions for all methods and responses.
              </p>
              <div className="rounded-lg border border-border bg-surface p-4 mb-4">
                <pre className="text-xs overflow-x-auto">
                  <code>{`import type {
  Memory,
  MemoryStats,
  SearchResult,
  ApiResponse,
  PaginatedResponse,
  MemoryHubConfig,
} from 'persistq-sdk'`}</code>
                </pre>
              </div>
            </section>

            {/* Use Cases */}
            <section>
              <h2 className="text-3xl font-bold mb-4">Use Cases</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-border bg-surface">
                  <h3 className="font-semibold mb-2">Next.js Applications</h3>
                  <p className="text-sm text-muted-foreground">Use in API routes, Server Components, or client-side</p>
                </div>
                <div className="p-4 rounded-lg border border-border bg-surface">
                  <h3 className="font-semibold mb-2">Node.js Backends</h3>
                  <p className="text-sm text-muted-foreground">Express, Fastify, Hono - any Node.js framework</p>
                </div>
                <div className="p-4 rounded-lg border border-border bg-surface">
                  <h3 className="font-semibold mb-2">Serverless Functions</h3>
                  <p className="text-sm text-muted-foreground">AWS Lambda, Vercel Edge, Cloudflare Workers</p>
                </div>
                <div className="p-4 rounded-lg border border-border bg-surface">
                  <h3 className="font-semibold mb-2">Browser Applications</h3>
                  <p className="text-sm text-muted-foreground">React, Vue, Svelte, or vanilla JavaScript</p>
                </div>
              </div>
            </section>

            {/* Requirements */}
            <section>
              <h2 className="text-3xl font-bold mb-4">Requirements</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong>Node.js:</strong> 18.0.0 or higher (for native fetch support)</li>
                <li>• <strong>Browsers:</strong> All modern browsers with fetch API</li>
                <li>• <strong>TypeScript:</strong> 5.0+ (optional, but recommended)</li>
              </ul>
            </section>

            {/* Next Steps */}
            <section>
              <h2 className="text-3xl font-bold mb-4">Next Steps</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <Link
                  href="/docs/api-reference"
                  className="p-6 rounded-lg border border-border bg-surface hover:border-accent-cyan transition-colors"
                >
                  <h3 className="font-semibold mb-2">API Reference</h3>
                  <p className="text-sm text-muted-foreground">Complete HTTP API documentation</p>
                </Link>
                <Link
                  href="/docs/getting-started"
                  className="p-6 rounded-lg border border-border bg-surface hover:border-accent-purple transition-colors"
                >
                  <h3 className="font-semibold mb-2">Getting Started</h3>
                  <p className="text-sm text-muted-foreground">Quick installation and setup guide</p>
                </Link>
                <Link
                  href="/docs/mcp-integration"
                  className="p-6 rounded-lg border border-border bg-surface hover:border-accent-cyan transition-colors"
                >
                  <h3 className="font-semibold mb-2">MCP Integration</h3>
                  <p className="text-sm text-muted-foreground">Claude Code & Copilot setup</p>
                </Link>
              </div>
            </section>
          </article>
        </div>
      </div>
    </div>
  )
}
