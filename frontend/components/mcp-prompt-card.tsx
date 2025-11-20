"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Check, Copy, Terminal, ExternalLink } from "lucide-react"

const getMcpPrompt = (apiKey?: string | null, apiUrl?: string) => {
  const key = apiKey || 'YOUR_API_KEY'
  const baseUrl = apiUrl || 'http://localhost:3000'

  return `# PersistQ MCP Integration

You now have access to the PersistQ API for persistent long-term memory storage.

## API Endpoint
${baseUrl}

## Authentication
All requests must include the API key in the Authorization header:
Authorization: Bearer ${key}

## Available Operations

### 1. Store a Memory
POST ${baseUrl}/api/memory
Content-Type: application/json
Authorization: Bearer ${key}

{
  "content": "Memory content to store",
  "project": "project-name",
  "metadata": {
    "tags": ["important", "user-preference"]
  }
}

### 2. List All Memories
GET ${baseUrl}/api/memory/list?limit=10&offset=0
Authorization: Bearer ${key}

### 3. Search Memories (Semantic)
POST ${baseUrl}/api/memory/search
Content-Type: application/json
Authorization: Bearer ${key}

{
  "query": "search query",
  "limit": 10,
  "threshold": 0.7
}

### 4. Get Memory Statistics
GET ${baseUrl}/api/memory/stats
Authorization: Bearer ${key}

### 5. Delete a Memory
DELETE ${baseUrl}/api/memory/{memory-id}
Authorization: Bearer ${key}

## Usage Example
When a user shares important information, store it:
- User preferences (name, email, preferences)
- Past conversation context
- Important facts or decisions
- Project-specific context

This allows you to provide personalized, context-aware responses across multiple conversations.

## Response Format
All successful responses return:
{
  "status": "success",
  "data": { ... }
}

Error responses return:
{
  "status": "error",
  "error": "Error message"
}`
}

interface McpPromptCardProps {
  apiKey?: string | null
  apiUrl?: string
}

export function McpPromptCard({ apiKey, apiUrl }: McpPromptCardProps = {}) {
  const [copied, setCopied] = useState(false)
  const [copiedCard, setCopiedCard] = useState(false)

  const prompt = getMcpPrompt(apiKey, apiUrl)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCardCopy = async () => {
    await navigator.clipboard.writeText(prompt)
    setCopiedCard(true)
    setTimeout(() => setCopiedCard(false), 2000)
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-glow">
            <Terminal className="h-5 w-5 text-accent-purple" />
          </div>
          <div>
            <h2 className="text-base font-medium text-foreground">Claude MCP Integration</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Copy the prompt to give Claude access to PersistQ API
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleCardCopy}
            size="sm"
            variant="outline"
            className="bg-accent-purple/10 hover:bg-accent-purple/20 text-accent-purple border-accent-purple/30"
          >
            {copiedCard ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy prompt
              </>
            )}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-accent-cyan/10 hover:bg-accent-cyan/20 text-accent-cyan border-accent-cyan/30"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View prompt
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col bg-surface border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">Claude MCP Integration Prompt</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Copy this prompt to give Claude access to the PersistQ API for persistent memory storage.
                </DialogDescription>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                <div className="rounded-lg border border-border bg-background p-4 overflow-x-auto">
                  <pre className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap font-mono">
                    {prompt}
                  </pre>
                </div>

                <div className="flex items-start gap-2 rounded-lg bg-accent-cyan/5 border border-accent-cyan/20 p-3">
                  <svg
                    className="h-5 w-5 text-accent-cyan flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-xs text-foreground leading-relaxed">
                    {apiKey ? (
                      <>
                        This prompt is ready to use! Your API key and endpoint are already included. Simply paste it at the start of your conversation with Claude.
                      </>
                    ) : (
                      <>
                        Paste this prompt at the start of your conversation with Claude. Replace{" "}
                        <code className="px-1.5 py-0.5 rounded bg-background text-accent-cyan">YOUR_API_KEY</code> with your
                        actual API key from the API Keys section.
                      </>
                    )}
                  </p>
                </div>
              </div>

              <DialogFooter className="mt-4">
                <Button
                  onClick={handleCopy}
                  className="w-full bg-accent-cyan/10 hover:bg-accent-cyan/20 text-accent-cyan border-accent-cyan/30"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied to clipboard!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy prompt to clipboard
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
