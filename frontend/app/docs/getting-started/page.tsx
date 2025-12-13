"use client"

import Link from "next/link"
import { SharedHeader } from "@/components/shared-header"
import { Copy, Check } from "lucide-react"
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
      <SharedHeader activeLink="docs" />

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
              Learn how to integrate PersistQ into your AI application in under 5 minutes.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-4">Choose Your Integration</h2>
            <p className="text-muted-foreground mb-4">
              PersistQ offers two ways to integrate:
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="p-6 rounded-lg border border-border bg-surface">
                <h3 className="font-semibold mb-2 text-accent-cyan">TypeScript/JavaScript SDK</h3>
                <p className="text-sm text-muted-foreground mb-3">For web apps, Node.js backends, and serverless functions</p>
                <code className="text-xs bg-background px-2 py-1 rounded">persistq-sdk</code>
              </div>
              <div className="p-6 rounded-lg border border-border bg-surface">
                <h3 className="font-semibold mb-2 text-accent-purple">MCP Server</h3>
                <p className="text-sm text-muted-foreground mb-3">For Claude Code, GitHub Copilot CLI, Cursor IDE, OpenCode IDE, and VS Code integration</p>
                <code className="text-xs bg-background px-2 py-1 rounded">persistq</code>
              </div>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Installation</h2>

            <h3 className="text-xl font-semibold mt-8 mb-3">TypeScript/JavaScript SDK</h3>
            <p className="text-muted-foreground mb-4">Install via npm:</p>

            <div className="rounded-lg border border-border bg-surface p-4 mb-8 relative group">
              <button
                onClick={() => copyCode("npm install persistq-sdk", "npm")}
                className="absolute top-4 right-4 p-2 rounded hover:bg-background transition-colors"
              >
                {copiedSection === "npm" ? (
                  <Check className="w-4 h-4 text-accent-cyan" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              <pre className="text-sm overflow-x-auto">
                <code>npm install persistq-sdk</code>
              </pre>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-3">MCP Server (for AI tools)</h3>
            <p className="text-muted-foreground mb-4">Use with npx (recommended):</p>

            <div className="rounded-lg border border-border bg-surface p-4 mb-4 relative group">
              <button
                onClick={() => copyCode("npx -y persistq", "npx")}
                className="absolute top-4 right-4 p-2 rounded hover:bg-background transition-colors"
              >
                {copiedSection === "npx" ? (
                  <Check className="w-4 h-4 text-accent-cyan" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              <pre className="text-sm overflow-x-auto">
                <code>npx -y persistq</code>
              </pre>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Or install globally:
            </p>

            <div className="rounded-lg border border-border bg-surface p-4 mb-8">
              <pre className="text-sm overflow-x-auto">
                <code>{`{
  "mcpServers": {
    "persistq": {
      "command": "npx",
      "args": ["-y", "persistq"],
      "env": {
        "PERSISTQ_URL": "https://api.persistq.com",
        "PERSISTQ_API_KEY": process.env.PERSISTQ_API_KEY,
      }
    }
  }
}`}</code>
              </pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Authentication</h2>
            <p className="text-muted-foreground mb-4">
              Get your API key from the{" "}
              <Link href="/dashboard" className="text-accent-cyan hover:underline">
                dashboard
              </Link>{" "}
              after signing up:
            </p>

            <div className="p-4 rounded-lg border border-border bg-accent-cyan/5 mb-8">
              <p className="text-sm">
                <strong className="text-accent-cyan">Tip:</strong> Your API key starts with{" "}
                <code className="bg-background px-2 py-1 rounded text-xs">pq_</code>
              </p>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Quick Start: TypeScript SDK</h2>

            <h3 className="text-xl font-semibold mt-8 mb-3">1. Initialize Client</h3>
            <div className="rounded-lg border border-border bg-surface p-4 mb-8 relative group">
              <button
                onClick={() =>
                  copyCode(
                    `import { createClient } from 'persistq-sdk'

const client = createClient({
  baseUrl: 'https://api.persistq.com',
  apiKey: 'your-api-key-here',
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
  baseUrl: 'https://api.persistq.com',
  apiKey: 'your-api-key-here',
})`}</code>
              </pre>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-3">2. Store a Memory</h3>
            <div className="rounded-lg border border-border bg-surface p-4 mb-8 relative group">
              <button
                onClick={() =>
                  copyCode(
                    `const result = await client.createMemory(
  'User prefers dark mode and compact layouts',
  'preferences',
  { tags: ['ui', 'settings'] }
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
  { tags: ['ui', 'settings'] }
)

if (result.status === 'success') {
  console.log('Memory created:', result.data?.memoryId)
}`}</code>
              </pre>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-3">3. Search Memories</h3>
            <div className="rounded-lg border border-border bg-surface p-4 mb-8 relative group">
              <button
                onClick={() =>
                  copyCode(
                    `const results = await client.searchMemories('user interface preferences', {
  limit: 5,
  threshold: 0.7,
})

if (results.status === 'success') {
  results.data?.forEach(memory => {
    console.log(memory.content, 'Similarity:', memory.similarity)
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
    console.log(memory.content, 'Similarity:', memory.similarity)
  })
}`}</code>
              </pre>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-3">4. List Memories</h3>
            <div className="rounded-lg border border-border bg-surface p-4 mb-8 relative group">
              <button
                onClick={() =>
                  copyCode(
                    `const memories = await client.listMemories({
  project: 'preferences',
  limit: 10,
  offset: 0,
})

if (memories.status === 'success' && memories.data) {
  console.log('Total memories:', memories.data.total)
  console.log('Memories:', memories.data.memories)
}`,
                    "list",
                  )
                }
                className="absolute top-4 right-4 p-2 rounded hover:bg-background transition-colors"
              >
                {copiedSection === "list" ? (
                  <Check className="w-4 h-4 text-accent-cyan" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              <pre className="text-sm overflow-x-auto">
                <code>{`const memories = await client.listMemories({
  project: 'preferences',
  limit: 10,
  offset: 0,
})

if (memories.status === 'success' && memories.data) {
  console.log('Total memories:', memories.data.total)
  console.log('Memories:', memories.data.memories)
}`}</code>
              </pre>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Quick Start: MCP Server</h2>
            <p className="text-muted-foreground mb-4">
              For Claude Code, GitHub Copilot CLI, Cursor IDE, OpenCode IDE, or VS Code users:
            </p>

            <h3 className="text-xl font-semibold mt-8 mb-3">1. Configure Claude Code</h3>
            <p className="text-muted-foreground mb-4">
              Add to your <code className="bg-background px-2 py-1 rounded text-xs">~/.claude/mcp.json</code>:
            </p>

            <div className="rounded-lg border border-border bg-surface p-4 mb-8 relative group">
              <button
                onClick={() =>
                  copyCode(
                    `{
  "mcpServers": {
    "persistq": {
      "command": "persistq",
      "env": {
        "PERSISTQ_URL": "https://api.persistq.com",
        "PERSISTQ_API_KEY": "your-api-key-here"
      }
    }
  }
}`,
                    "claude-config",
                  )
                }
                className="absolute top-4 right-4 p-2 rounded hover:bg-background transition-colors"
              >
                {copiedSection === "claude-config" ? (
                  <Check className="w-4 h-4 text-accent-cyan" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              <pre className="text-sm overflow-x-auto">
                <code>{`{
  "mcpServers": {
    "persistq": {
      "command": "persistq",
      "env": {
        "PERSISTQ_URL": "https://api.persistq.com",
        "PERSISTQ_API_KEY": "your-api-key-here"
      }
    }
  }
}`}</code>
              </pre>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-3">2. Use in Claude Code</h3>
            <p className="text-muted-foreground mb-4">
              Claude Code will automatically detect the MCP server and you can use it naturally:
            </p>

            <div className="p-4 rounded-lg border border-border bg-surface mb-8">
              <p className="text-sm text-muted-foreground">
                "Store this information: The user prefers TypeScript and uses Next.js"
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                "What do you remember about my tech stack preferences?"
              </p>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Next Steps</h2>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <Link
                href="/docs/typescript-sdk"
                className="p-6 rounded-lg border border-border bg-surface hover:border-accent-cyan transition-colors"
              >
                <h3 className="font-semibold mb-2">TypeScript SDK</h3>
                <p className="text-sm text-muted-foreground">Explore the complete SDK documentation and API methods</p>
              </Link>
              <Link
                href="/docs/mcp-integration"
                className="p-6 rounded-lg border border-border bg-surface hover:border-accent-purple transition-colors"
              >
                <h3 className="font-semibold mb-2">MCP Integration</h3>
                <p className="text-sm text-muted-foreground">Set up PersistQ with Claude Code or GitHub Copilot CLI</p>
              </Link>
            </div>

            <div className="p-6 rounded-lg border border-accent-cyan/30 bg-accent-cyan/5 mt-8">
              <h3 className="font-semibold mb-2 text-accent-cyan">Need Help?</h3>
              <p className="text-sm text-muted-foreground">
                Check out the{" "}
                <Link href="/docs/api-reference" className="text-accent-cyan hover:underline">
                  API reference
                </Link>{" "}
                for detailed endpoint documentation.
              </p>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}
