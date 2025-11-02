"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Database } from "lucide-react"

export default function APIReferencePage() {
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
            <span className="font-semibold text-accent-cyan">Preview API Reference</span> - Endpoints and parameters
            subject to change during beta
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/docs" className="hover:text-foreground">
              Docs
            </Link>
            <span>/</span>
            <span className="text-foreground">API Reference</span>
          </div>

          <div className="grid lg:grid-cols-[250px_1fr] gap-12">
            {/* Sidebar */}
            <aside className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Endpoints</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#create-memory" className="text-muted-foreground hover:text-foreground">
                      Create Memory
                    </a>
                  </li>
                  <li>
                    <a href="#list-memories" className="text-muted-foreground hover:text-foreground">
                      List Memories
                    </a>
                  </li>
                  <li>
                    <a href="#get-memory" className="text-muted-foreground hover:text-foreground">
                      Get Memory
                    </a>
                  </li>
                  <li>
                    <a href="#update-memory" className="text-muted-foreground hover:text-foreground">
                      Update Memory
                    </a>
                  </li>
                  <li>
                    <a href="#delete-memory" className="text-muted-foreground hover:text-foreground">
                      Delete Memory
                    </a>
                  </li>
                  <li>
                    <a href="#search-memories" className="text-muted-foreground hover:text-foreground">
                      Search Memories
                    </a>
                  </li>
                </ul>
              </div>
            </aside>

            {/* Content */}
            <article className="space-y-12">
              <div>
                <h1 className="text-4xl font-bold mb-4">API Reference</h1>
                <p className="text-xl text-muted-foreground">Complete reference for the Memory Layer REST API</p>
              </div>

              {/* Base URL */}
              <div className="p-6 rounded-lg border border-border bg-surface">
                <h3 className="font-semibold mb-2">Base URL</h3>
                <code className="text-accent-cyan">https://api.memorylayer.dev/v1</code>
              </div>

              {/* Create Memory */}
              <div id="create-memory" className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded bg-accent-cyan/10 text-accent-cyan text-sm font-mono">POST</span>
                  <h2 className="text-2xl font-bold">Create Memory</h2>
                </div>
                <p className="text-muted-foreground">Store a new memory in your account</p>

                <div className="rounded-lg border border-border bg-surface p-4">
                  <code className="text-sm">POST /memories</code>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Request Body</h3>
                  <div className="rounded-lg border border-border bg-surface overflow-hidden">
                    <table className="w-full">
                      <thead className="border-b border-border">
                        <tr>
                          <th className="text-left p-3 text-sm font-medium">Parameter</th>
                          <th className="text-left p-3 text-sm font-medium">Type</th>
                          <th className="text-left p-3 text-sm font-medium">Description</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        <tr className="border-b border-border/50">
                          <td className="p-3 font-mono">content</td>
                          <td className="p-3 text-muted-foreground">string</td>
                          <td className="p-3 text-muted-foreground">The memory content (required)</td>
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="p-3 font-mono">group</td>
                          <td className="p-3 text-muted-foreground">string</td>
                          <td className="p-3 text-muted-foreground">Memory group name (optional)</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono">tags</td>
                          <td className="p-3 text-muted-foreground">array</td>
                          <td className="p-3 text-muted-foreground">Array of tag strings (optional)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Example Request</h3>
                  <div className="rounded-lg border border-border bg-surface p-4">
                    <pre className="text-sm overflow-x-auto">
                      <code>{`curl -X POST https://api.memorylayer.dev/v1/memories \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "content": "User prefers dark mode",
    "group": "preferences",
    "tags": ["ui", "settings"]
  }'`}</code>
                    </pre>
                  </div>
                </div>
              </div>

              {/* List Memories */}
              <div id="list-memories" className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded bg-accent-purple/10 text-accent-purple text-sm font-mono">
                    GET
                  </span>
                  <h2 className="text-2xl font-bold">List Memories</h2>
                </div>
                <p className="text-muted-foreground">Retrieve a list of memories with optional filtering</p>

                <div className="rounded-lg border border-border bg-surface p-4">
                  <code className="text-sm">GET /memories</code>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Query Parameters</h3>
                  <div className="rounded-lg border border-border bg-surface overflow-hidden">
                    <table className="w-full">
                      <thead className="border-b border-border">
                        <tr>
                          <th className="text-left p-3 text-sm font-medium">Parameter</th>
                          <th className="text-left p-3 text-sm font-medium">Type</th>
                          <th className="text-left p-3 text-sm font-medium">Description</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        <tr className="border-b border-border/50">
                          <td className="p-3 font-mono">group</td>
                          <td className="p-3 text-muted-foreground">string</td>
                          <td className="p-3 text-muted-foreground">Filter by group name</td>
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="p-3 font-mono">limit</td>
                          <td className="p-3 text-muted-foreground">integer</td>
                          <td className="p-3 text-muted-foreground">Number of results (default: 20, max: 100)</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono">offset</td>
                          <td className="p-3 text-muted-foreground">integer</td>
                          <td className="p-3 text-muted-foreground">Pagination offset (default: 0)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Search Memories */}
              <div id="search-memories" className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded bg-accent-cyan/10 text-accent-cyan text-sm font-mono">POST</span>
                  <h2 className="text-2xl font-bold">Search Memories</h2>
                </div>
                <p className="text-muted-foreground">Perform semantic search across your memories</p>

                <div className="rounded-lg border border-border bg-surface p-4">
                  <code className="text-sm">POST /memories/search</code>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Request Body</h3>
                  <div className="rounded-lg border border-border bg-surface overflow-hidden">
                    <table className="w-full">
                      <thead className="border-b border-border">
                        <tr>
                          <th className="text-left p-3 text-sm font-medium">Parameter</th>
                          <th className="text-left p-3 text-sm font-medium">Type</th>
                          <th className="text-left p-3 text-sm font-medium">Description</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        <tr className="border-b border-border/50">
                          <td className="p-3 font-mono">query</td>
                          <td className="p-3 text-muted-foreground">string</td>
                          <td className="p-3 text-muted-foreground">Search query (required)</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono">limit</td>
                          <td className="p-3 text-muted-foreground">integer</td>
                          <td className="p-3 text-muted-foreground">Number of results (default: 10, max: 50)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  )
}
