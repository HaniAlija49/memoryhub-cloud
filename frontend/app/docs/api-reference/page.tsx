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
                    <a href="#search-memories" className="text-muted-foreground hover:text-foreground">
                      Search Memories
                    </a>
                  </li>
                  <li>
                    <a href="#get-stats" className="text-muted-foreground hover:text-foreground">
                      Get Memory Stats
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
                </ul>
              </div>
            </aside>

            {/* Content */}
            <article className="space-y-12">
              <div>
                <h1 className="text-4xl font-bold mb-4">API Reference</h1>
                <p className="text-xl text-muted-foreground">Complete reference for the PersistQ REST API</p>
              </div>

              {/* Base URL */}
              <div className="p-6 rounded-lg border border-border bg-surface">
                <h3 className="font-semibold mb-2">Base URL</h3>
                <code className="text-accent-cyan">https://memoryhub-cloud.onrender.com</code>
              </div>

              {/* Authentication */}
              <div className="p-6 rounded-lg border border-accent-cyan/30 bg-accent-cyan/5">
                <h3 className="font-semibold mb-3">Authentication</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  All API requests require an API key in the Authorization header:
                </p>
                <div className="rounded bg-background p-3">
                  <code className="text-sm">Authorization: Bearer YOUR_API_KEY</code>
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  Get your API key from the{" "}
                  <Link href="/dashboard" className="text-accent-cyan hover:underline">
                    dashboard
                  </Link>
                  . Your API key starts with <code className="bg-background px-2 py-1 rounded">mh_</code>
                </p>
              </div>

              {/* Create Memory */}
              <div id="create-memory" className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded bg-accent-cyan/10 text-accent-cyan text-sm font-mono">POST</span>
                  <h2 className="text-2xl font-bold">Create Memory</h2>
                </div>
                <p className="text-muted-foreground">Store a new memory in your account</p>

                <div className="rounded-lg border border-border bg-surface p-4">
                  <code className="text-sm">POST /api/memory</code>
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
                          <td className="p-3 font-mono">project</td>
                          <td className="p-3 text-muted-foreground">string</td>
                          <td className="p-3 text-muted-foreground">Project/group name (optional)</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono">metadata</td>
                          <td className="p-3 text-muted-foreground">object</td>
                          <td className="p-3 text-muted-foreground">Additional metadata including tags (optional)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Example Request</h3>
                  <div className="rounded-lg border border-border bg-surface p-4">
                    <pre className="text-sm overflow-x-auto">
                      <code>{`curl -X POST https://memoryhub-cloud.onrender.com/api/memory \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "content": "User prefers dark mode",
    "project": "preferences",
    "metadata": {
      "tags": ["ui", "settings"]
    }
  }'`}</code>
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Response</h3>
                  <div className="rounded-lg border border-border bg-surface p-4">
                    <pre className="text-sm overflow-x-auto">
                      <code>{`{
  "status": "success",
  "data": {
    "memoryId": "cm123456789",
    "content": "User prefers dark mode",
    "project": "preferences",
    "createdAt": "2025-12-07T..."
  }
}`}</code>
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
                  <code className="text-sm">GET /api/memory/list</code>
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
                          <td className="p-3 font-mono">project</td>
                          <td className="p-3 text-muted-foreground">string</td>
                          <td className="p-3 text-muted-foreground">Filter by project name (optional)</td>
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="p-3 font-mono">limit</td>
                          <td className="p-3 text-muted-foreground">integer</td>
                          <td className="p-3 text-muted-foreground">Number of results (default: 10)</td>
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

                <div>
                  <h3 className="font-semibold mb-3">Example Request</h3>
                  <div className="rounded-lg border border-border bg-surface p-4">
                    <pre className="text-sm overflow-x-auto">
                      <code>{`curl -X GET "https://memoryhub-cloud.onrender.com/api/memory/list?limit=10&offset=0" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</code>
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Response</h3>
                  <div className="rounded-lg border border-border bg-surface p-4">
                    <pre className="text-sm overflow-x-auto">
                      <code>{`{
  "status": "success",
  "data": {
    "memories": [
      {
        "id": "cm123456789",
        "content": "User prefers dark mode",
        "project": "preferences",
        "createdAt": "2025-12-07T...",
        "updatedAt": "2025-12-07T..."
      }
    ],
    "total": 1,
    "limit": 10,
    "offset": 0
  }
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>

              {/* Search Memories */}
              <div id="search-memories" className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded bg-accent-cyan/10 text-accent-cyan text-sm font-mono">POST</span>
                  <h2 className="text-2xl font-bold">Search Memories</h2>
                </div>
                <p className="text-muted-foreground">Perform semantic search across your memories using vector similarity</p>

                <div className="rounded-lg border border-border bg-surface p-4">
                  <code className="text-sm">POST /api/memory/search</code>
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
                        <tr className="border-b border-border/50">
                          <td className="p-3 font-mono">limit</td>
                          <td className="p-3 text-muted-foreground">integer</td>
                          <td className="p-3 text-muted-foreground">Number of results (default: 10)</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono">threshold</td>
                          <td className="p-3 text-muted-foreground">number</td>
                          <td className="p-3 text-muted-foreground">Minimum similarity score 0-1 (default: 0.7)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Example Request</h3>
                  <div className="rounded-lg border border-border bg-surface p-4">
                    <pre className="text-sm overflow-x-auto">
                      <code>{`curl -X POST https://memoryhub-cloud.onrender.com/api/memory/search \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "user interface preferences",
    "limit": 10,
    "threshold": 0.7
  }'`}</code>
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Response</h3>
                  <div className="rounded-lg border border-border bg-surface p-4">
                    <pre className="text-sm overflow-x-auto">
                      <code>{`{
  "status": "success",
  "data": [
    {
      "id": "cm123456789",
      "content": "User prefers dark mode",
      "project": "preferences",
      "similarity": 0.89,
      "createdAt": "2025-12-07T..."
    }
  ]
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>

              {/* Get Memory Stats */}
              <div id="get-stats" className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded bg-accent-purple/10 text-accent-purple text-sm font-mono">
                    GET
                  </span>
                  <h2 className="text-2xl font-bold">Get Memory Stats</h2>
                </div>
                <p className="text-muted-foreground">Get statistics about your stored memories</p>

                <div className="rounded-lg border border-border bg-surface p-4">
                  <code className="text-sm">GET /api/memory/stats</code>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Example Request</h3>
                  <div className="rounded-lg border border-border bg-surface p-4">
                    <pre className="text-sm overflow-x-auto">
                      <code>{`curl -X GET https://memoryhub-cloud.onrender.com/api/memory/stats \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</code>
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Response</h3>
                  <div className="rounded-lg border border-border bg-surface p-4">
                    <pre className="text-sm overflow-x-auto">
                      <code>{`{
  "status": "success",
  "data": {
    "total": 42,
    "byProject": {
      "preferences": 10,
      "code-snippets": 15,
      "notes": 17
    }
  }
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>

              {/* Get Memory */}
              <div id="get-memory" className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded bg-accent-purple/10 text-accent-purple text-sm font-mono">
                    GET
                  </span>
                  <h2 className="text-2xl font-bold">Get Memory</h2>
                </div>
                <p className="text-muted-foreground">Retrieve a specific memory by ID</p>

                <div className="rounded-lg border border-border bg-surface p-4">
                  <code className="text-sm">GET /api/memory/:id</code>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Example Request</h3>
                  <div className="rounded-lg border border-border bg-surface p-4">
                    <pre className="text-sm overflow-x-auto">
                      <code>{`curl -X GET https://memoryhub-cloud.onrender.com/api/memory/cm123456789 \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</code>
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Response</h3>
                  <div className="rounded-lg border border-border bg-surface p-4">
                    <pre className="text-sm overflow-x-auto">
                      <code>{`{
  "status": "success",
  "data": {
    "id": "cm123456789",
    "content": "User prefers dark mode",
    "project": "preferences",
    "metadata": {
      "tags": ["ui", "settings"]
    },
    "createdAt": "2025-12-07T...",
    "updatedAt": "2025-12-07T..."
  }
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>

              {/* Update Memory */}
              <div id="update-memory" className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded bg-accent-cyan/10 text-accent-cyan text-sm font-mono">PUT</span>
                  <h2 className="text-2xl font-bold">Update Memory</h2>
                </div>
                <p className="text-muted-foreground">Update an existing memory</p>

                <div className="rounded-lg border border-border bg-surface p-4">
                  <code className="text-sm">PUT /api/memory/:id</code>
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
                          <td className="p-3 text-muted-foreground">Updated memory content (optional)</td>
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="p-3 font-mono">project</td>
                          <td className="p-3 text-muted-foreground">string</td>
                          <td className="p-3 text-muted-foreground">Updated project name (optional)</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono">metadata</td>
                          <td className="p-3 text-muted-foreground">object</td>
                          <td className="p-3 text-muted-foreground">Updated metadata (optional)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Example Request</h3>
                  <div className="rounded-lg border border-border bg-surface p-4">
                    <pre className="text-sm overflow-x-auto">
                      <code>{`curl -X PUT https://memoryhub-cloud.onrender.com/api/memory/cm123456789 \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "content": "User prefers dark mode and compact layouts"
  }'`}</code>
                    </pre>
                  </div>
                </div>
              </div>

              {/* Delete Memory */}
              <div id="delete-memory" className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded bg-red-500/10 text-red-500 text-sm font-mono">DELETE</span>
                  <h2 className="text-2xl font-bold">Delete Memory</h2>
                </div>
                <p className="text-muted-foreground">Permanently delete a memory</p>

                <div className="rounded-lg border border-border bg-surface p-4">
                  <code className="text-sm">DELETE /api/memory/:id</code>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Example Request</h3>
                  <div className="rounded-lg border border-border bg-surface p-4">
                    <pre className="text-sm overflow-x-auto">
                      <code>{`curl -X DELETE https://memoryhub-cloud.onrender.com/api/memory/cm123456789 \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</code>
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Response</h3>
                  <div className="rounded-lg border border-border bg-surface p-4">
                    <pre className="text-sm overflow-x-auto">
                      <code>{`{
  "status": "success",
  "data": {
    "deleted": true
  }
}`}</code>
                    </pre>
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
