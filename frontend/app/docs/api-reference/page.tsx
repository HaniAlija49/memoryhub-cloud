"use client"

import Link from "next/link"
import { SharedHeader } from "@/components/shared-header"
import { useEffect, useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 p-2 rounded-md bg-surface hover:bg-border transition-colors text-muted-foreground hover:text-foreground"
      title="Copy to clipboard"
    >
      {copied ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  )
}

export default function APIReferencePage() {
  const [activeSection, setActiveSection] = useState<string>("")

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, endpoint: string) => {
    e.preventDefault()
    setActiveSection(endpoint)

    // Find and open the accordion
    const element = document.getElementById(endpoint)
    if (element) {
      // Find the accordion trigger button within this element
      const trigger = element.querySelector('button[data-state]') as HTMLElement

      // Click the trigger to open the accordion if it's closed
      if (trigger && trigger.getAttribute('data-state') === 'closed') {
        trigger.click()
      }

      // Scroll to the element after opening
      setTimeout(() => {
        const elementPosition = element.getBoundingClientRect().top + window.scrollY
        window.scrollTo({
          top: elementPosition - 100,
          behavior: 'smooth'
        })
      }, 300) // Wait for accordion animation
    }
  }

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "")
      if (hash) {
        setActiveSection(hash)

        const element = document.getElementById(hash)
        if (element) {
          // Find and click the accordion trigger to open it
          const trigger = element.querySelector('button[data-state]') as HTMLElement
          if (trigger && trigger.getAttribute('data-state') === 'closed') {
            trigger.click()
          }

          // Scroll after opening
          setTimeout(() => {
            const elementPosition = element.getBoundingClientRect().top + window.scrollY
            window.scrollTo({
              top: elementPosition - 100,
              behavior: 'smooth'
            })
          }, 300)
        }
      }
    }

    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <SharedHeader activeLink="docs" />

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
                    <a
                      href="#create-memory"
                      onClick={(e) => handleNavClick(e, "create-memory")}
                      className={`text-muted-foreground hover:text-foreground transition-colors ${
                        activeSection === "create-memory" ? "text-accent-cyan font-medium" : ""
                      }`}
                    >
                      Create Memory
                    </a>
                  </li>
                  <li>
                    <a
                      href="#list-memories"
                      onClick={(e) => handleNavClick(e, "list-memories")}
                      className={`text-muted-foreground hover:text-foreground transition-colors ${
                        activeSection === "list-memories" ? "text-accent-cyan font-medium" : ""
                      }`}
                    >
                      List Memories
                    </a>
                  </li>
                  <li>
                    <a
                      href="#search-memories"
                      onClick={(e) => handleNavClick(e, "search-memories")}
                      className={`text-muted-foreground hover:text-foreground transition-colors ${
                        activeSection === "search-memories" ? "text-accent-cyan font-medium" : ""
                      }`}
                    >
                      Search Memories
                    </a>
                  </li>
                  <li>
                    <a
                      href="#get-stats"
                      onClick={(e) => handleNavClick(e, "get-stats")}
                      className={`text-muted-foreground hover:text-foreground transition-colors ${
                        activeSection === "get-stats" ? "text-accent-cyan font-medium" : ""
                      }`}
                    >
                      Get Memory Stats
                    </a>
                  </li>
                  <li>
                    <a
                      href="#get-memory"
                      onClick={(e) => handleNavClick(e, "get-memory")}
                      className={`text-muted-foreground hover:text-foreground transition-colors ${
                        activeSection === "get-memory" ? "text-accent-cyan font-medium" : ""
                      }`}
                    >
                      Get Memory
                    </a>
                  </li>
                  <li>
                    <a
                      href="#update-memory"
                      onClick={(e) => handleNavClick(e, "update-memory")}
                      className={`text-muted-foreground hover:text-foreground transition-colors ${
                        activeSection === "update-memory" ? "text-accent-cyan font-medium" : ""
                      }`}
                    >
                      Update Memory
                    </a>
                  </li>
                  <li>
                    <a
                      href="#delete-memory"
                      onClick={(e) => handleNavClick(e, "delete-memory")}
                      className={`text-muted-foreground hover:text-foreground transition-colors ${
                        activeSection === "delete-memory" ? "text-accent-cyan font-medium" : ""
                      }`}
                    >
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
                <code className="text-accent-cyan">https://api.persistq.com</code>
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
                  . Your API key starts with <code className="bg-background px-2 py-1 rounded">pq_</code>
                </p>
              </div>

              {/* Core Operations Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent-cyan"></div>
                  <h2 className="text-2xl font-bold">Core Operations</h2>
                </div>

                <Accordion type="single" collapsible className="w-full flex flex-col gap-4">
                  {/* Create Memory */}
                  <AccordionItem value="create-memory" id="create-memory" className="border border-border rounded-lg last:border-b">
                    <AccordionTrigger className="text-lg font-semibold px-6 py-5 hover:no-underline">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded bg-accent-cyan/10 text-accent-cyan text-sm font-mono">POST</span>
                        <span>Create Memory</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-8 pt-2 space-y-6">
                      <p className="text-muted-foreground">Store a new memory in your account</p>

                      <div className="rounded-lg border border-border bg-surface p-4">
                        <code className="text-sm">POST /api/memory</code>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">Request Body</h4>
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
                          <h4 className="font-semibold mb-3">Example Request</h4>
                          <div className="rounded-lg border border-border bg-surface p-4 relative">
                            <CopyButton code={`curl -X POST https://api.persistq.com/api/memory \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "content": "User prefers dark mode",
    "project": "preferences",
    "metadata": {
      "tags": ["ui", "settings"]
    }
  }'`} />
                            <pre className="text-sm overflow-x-auto">
                              <code>{`curl -X POST https://api.persistq.com/api/memory \\
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
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Response</h4>
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
                    </AccordionContent>
                  </AccordionItem>

                  {/* List Memories */}
                  <AccordionItem value="list-memories" id="list-memories" className="border border-border rounded-lg last:border-b">
                    <AccordionTrigger className="text-lg font-semibold px-6 py-5 hover:no-underline">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded bg-accent-purple/10 text-accent-purple text-sm font-mono">GET</span>
                        <span>List Memories</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-8 pt-2 space-y-6">
                      <p className="text-muted-foreground">Retrieve a list of memories with optional filtering</p>

                      <div className="rounded-lg border border-border bg-surface p-4">
                        <code className="text-sm">GET /api/memory/list</code>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">Query Parameters</h4>
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
                          <h4 className="font-semibold mb-3">Example Request</h4>
                          <div className="rounded-lg border border-border bg-surface p-4 relative">
                            <CopyButton code={`curl -X GET "https://api.persistq.com/api/memory/list?limit=10&offset=0" \\
  -H "Authorization: Bearer YOUR_API_KEY"`} />
                            <pre className="text-sm overflow-x-auto">
                              <code>{`curl -X GET "https://api.persistq.com/api/memory/list?limit=10&offset=0" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</code>
                            </pre>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Response</h4>
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
                    </AccordionContent>
                  </AccordionItem>

                  {/* Search Memories */}
                  <AccordionItem value="search-memories" id="search-memories" className="border border-border rounded-lg last:border-b">
                    <AccordionTrigger className="text-lg font-semibold px-6 py-5 hover:no-underline">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded bg-accent-cyan/10 text-accent-cyan text-sm font-mono">POST</span>
                        <span>Search Memories</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-8 pt-2 space-y-6">
                      <p className="text-muted-foreground">Perform semantic search across your memories using vector similarity</p>

                      <div className="rounded-lg border border-border bg-surface p-4">
                        <code className="text-sm">POST /api/memory/search</code>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">Request Body</h4>
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
                          <h4 className="font-semibold mb-3">Example Request</h4>
                          <div className="rounded-lg border border-border bg-surface p-4 relative">
                            <CopyButton code={`curl -X POST https://api.persistq.com/api/memory/search \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "user interface preferences",
    "limit": 10,
    "threshold": 0.7
  }'`} />
                            <pre className="text-sm overflow-x-auto">
                              <code>{`curl -X POST https://api.persistq.com/api/memory/search \\
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
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Response</h4>
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
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              {/* Utility Operations Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-600"></div>
                  <h2 className="text-2xl font-bold">Utility Operations</h2>
                </div>

                <Accordion type="single" collapsible className="w-full flex flex-col gap-4">
                  {/* Get Memory Stats */}
                  <AccordionItem value="get-stats" id="get-stats" className="border border-border rounded-lg last:border-b">
                    <AccordionTrigger className="text-lg font-semibold px-6 py-5 hover:no-underline">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded bg-accent-purple/10 text-accent-purple text-sm font-mono">GET</span>
                        <span>Get Memory Stats</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-8 pt-2 space-y-6">
                      <p className="text-muted-foreground">Get statistics about your stored memories</p>

                      <div className="rounded-lg border border-border bg-surface p-4">
                        <code className="text-sm">GET /api/memory/stats</code>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">Example Request</h4>
                          <div className="rounded-lg border border-border bg-surface p-4 relative">
                            <CopyButton code={`curl -X GET https://api.persistq.com/api/memory/stats \\
  -H "Authorization: Bearer YOUR_API_KEY"`} />
                            <pre className="text-sm overflow-x-auto">
                              <code>{`curl -X GET https://api.persistq.com/api/memory/stats \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</code>
                            </pre>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3">Response</h4>
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
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              {/* Management Operations Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent-purple"></div>
                  <h2 className="text-2xl font-bold">Management Operations</h2>
                </div>

                <Accordion type="single" collapsible className="w-full flex flex-col gap-4">
                  {/* Get Memory */}
                  <AccordionItem value="get-memory" id="get-memory" className="border border-border rounded-lg last:border-b">
                    <AccordionTrigger className="text-lg font-semibold px-6 py-5 hover:no-underline">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded bg-accent-purple/10 text-accent-purple text-sm font-mono">GET</span>
                        <span>Get Memory</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-8 pt-2 space-y-6">
                      <p className="text-muted-foreground">Retrieve a specific memory by ID</p>

                      <div className="rounded-lg border border-border bg-surface p-4">
                        <code className="text-sm">GET /api/memory/:id</code>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">Example Request</h4>
                          <div className="rounded-lg border border-border bg-surface p-4 relative">
                            <CopyButton code={`curl -X GET https://api.persistq.com/api/memory/cm123456789 \\
  -H "Authorization: Bearer YOUR_API_KEY"`} />
                            <pre className="text-sm overflow-x-auto">
                              <code>{`curl -X GET https://api.persistq.com/api/memory/cm123456789 \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</code>
                            </pre>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3">Response</h4>
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
                    </AccordionContent>
                  </AccordionItem>

                  {/* Update Memory */}
                  <AccordionItem value="update-memory" id="update-memory" className="border border-border rounded-lg last:border-b">
                    <AccordionTrigger className="text-lg font-semibold px-6 py-5 hover:no-underline">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded bg-accent-cyan/10 text-accent-cyan text-sm font-mono">PUT</span>
                        <span>Update Memory</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-8 pt-2 space-y-6">
                      <p className="text-muted-foreground">Update an existing memory</p>

                      <div className="rounded-lg border border-border bg-surface p-4">
                        <code className="text-sm">PUT /api/memory/:id</code>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">Request Body</h4>
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
                          <h4 className="font-semibold mb-3">Example Request</h4>
                          <div className="rounded-lg border border-border bg-surface p-4 relative">
                            <CopyButton code={`curl -X PUT https://api.persistq.com/api/memory/cm123456789 \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "content": "User prefers dark mode and compact layouts"
  }'`} />
                            <pre className="text-sm overflow-x-auto">
                              <code>{`curl -X PUT https://api.persistq.com/api/memory/cm123456789 \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "content": "User prefers dark mode and compact layouts"
  }'`}</code>
                            </pre>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Response</h4>
                        <div className="rounded-lg border border-border bg-surface p-4">
                          <pre className="text-sm overflow-x-auto">
                            <code>{`{
  "status": "success",
  "data": {
    "id": "cm123456789",
    "content": "User prefers dark mode and compact layouts",
    "project": "preferences",
    "updatedAt": "2025-12-07T..."
  }
}`}</code>
                          </pre>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Delete Memory */}
                  <AccordionItem value="delete-memory" id="delete-memory" className="border border-border rounded-lg last:border-b">
                    <AccordionTrigger className="text-lg font-semibold px-6 py-5 hover:no-underline">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded bg-red-500/10 text-red-500 text-sm font-mono">DELETE</span>
                        <span>Delete Memory</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-8 pt-2 space-y-6">
                      <p className="text-muted-foreground">Permanently delete a memory</p>

                      <div className="rounded-lg border border-border bg-surface p-4">
                        <code className="text-sm">DELETE /api/memory/:id</code>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">Example Request</h4>
                          <div className="rounded-lg border border-border bg-surface p-4 relative">
                            <CopyButton code={`curl -X DELETE https://api.persistq.com/api/memory/cm123456789 \\
  -H "Authorization: Bearer YOUR_API_KEY"`} />
                            <pre className="text-sm overflow-x-auto">
                              <code>{`curl -X DELETE https://api.persistq.com/api/memory/cm123456789 \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</code>
                            </pre>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3">Response</h4>
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
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  )
}
