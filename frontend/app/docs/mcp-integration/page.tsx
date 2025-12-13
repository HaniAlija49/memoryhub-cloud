"use client"

import Link from "next/link"
import { SharedHeader } from "@/components/shared-header"
import { Copy, Check, Terminal, Puzzle, Code2 } from "lucide-react"
import { useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function MCPIntegrationPage() {
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
            <span className="text-foreground">MCP Integration</span>
          </div>

          {/* Hero */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">MCP Integration</h1>
            <p className="text-xl text-muted-foreground mb-6">
              Integrate PersistQ with AI coding assistants using the Model Context Protocol
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.npmjs.com/package/persistq"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <Terminal className="w-4 h-4" />
                <span>persistq@1.1.0</span>
              </a>
            </div>
          </div>

          {/* What is MCP */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">What is Model Context Protocol?</h2>
            <p className="text-muted-foreground mb-4">
              The Model Context Protocol (MCP) is an open standard that enables AI assistants to connect to external tools and data sources.
              PersistQ's MCP server allows AI coding assistants like Claude Code and GitHub Copilot CLI to store and retrieve memories
              directly during conversations.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-6 rounded-lg border border-border bg-surface">
                <Puzzle className="w-8 h-8 text-accent-cyan mb-3" />
                <h3 className="font-semibold mb-2">Seamless Integration</h3>
                <p className="text-sm text-muted-foreground">
                  AI assistants automatically detect and use PersistQ without any code changes
                </p>
              </div>
              <div className="p-6 rounded-lg border border-border bg-surface">
                <Code2 className="w-8 h-8 text-accent-purple mb-3" />
                <h3 className="font-semibold mb-2">Natural Language</h3>
                <p className="text-sm text-muted-foreground">
                  Store and retrieve memories using natural conversation with your AI assistant
                </p>
              </div>
            </div>
          </section>

          {/* Supported AI Tools */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Supported AI Tools</h2>
            <div className="space-y-4">
              <div className="p-6 rounded-lg border border-accent-cyan/30 bg-accent-cyan/5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-accent-cyan">Claude Code</h3>
                  <span className="text-xs px-2 py-1 rounded bg-accent-cyan/20 text-accent-cyan">Full Support</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Anthropic's official CLI tool with complete MCP support including tools, resources, and prompts.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ All MCP tools available</li>
                  <li>✓ Auto-detection of MCP servers</li>
                  <li>✓ Natural conversation integration</li>
                </ul>
              </div>

              <div className="p-6 rounded-lg border border-accent-purple/30 bg-accent-purple/5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-accent-purple">GitHub Copilot CLI & VS Code</h3>
                  <span className="text-xs px-2 py-1 rounded bg-accent-purple/20 text-accent-purple">Tools Only</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  GitHub's command-line AI assistant and VS Code extension with partial MCP support (tools only, no resources/prompts yet).
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ MCP tools available</li>
                  <li>⚠ Resources not yet supported</li>
                  <li>⚠ Prompts not yet supported</li>
                </ul>
              </div>

              <div className="p-6 rounded-lg border border-green-600/30 bg-green-600/5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-green-600">Cursor IDE</h3>
                  <span className="text-xs px-2 py-1 rounded bg-green-600/20 text-green-600">Full Support</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  AI-first code editor with complete MCP support including tools, resources, and natural language integration.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ All MCP tools available</li>
                  <li>✓ Auto-detection of MCP servers</li>
                  <li>✓ Natural conversation integration</li>
                </ul>
              </div>

              <div className="p-6 rounded-lg border border-blue-600/30 bg-blue-600/5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-blue-600">OpenCode IDE</h3>
                  <span className="text-xs px-2 py-1 rounded bg-blue-600/20 text-blue-600">Full Support</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Modern code editor with built-in MCP support for seamless integration with PersistQ.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ All MCP tools available</li>
                  <li>✓ Auto-detection of MCP servers</li>
                  <li>✓ Natural conversation integration</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Installation */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Installation</h2>
            <p className="text-muted-foreground mb-4">
              Install PersistQ MCP server for your AI tool:
            </p>
            
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-accent-cyan/30 bg-accent-cyan/5">
                <h3 className="font-semibold mb-2 text-accent-cyan">Recommended: Using npx (No Installation)</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Use npx to run PersistQ without global installation:
                </p>
                <div className="rounded-lg border border-border bg-surface p-4 mb-4 relative group">
                  <button
                    onClick={() => copyCode("npx -y persistq", "npx-install")}
                    className="absolute top-4 right-4 p-2 rounded hover:bg-background transition-colors"
                  >
                    {copiedSection === "npx-install" ? (
                      <Check className="w-4 h-4 text-accent-cyan" />
                    ) : (
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                  <pre className="text-sm overflow-x-auto">
                    <code>npx -y persistq</code>
                  </pre>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Always uses the latest version</li>
                  <li>• No need to update manually</li>
                  <li>• Works across all platforms</li>
                  <li>• Recommended for most users</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border border-border bg-surface">
                <h3 className="font-semibold mb-2">Alternative: Global Installation</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Or install globally and use the <code className="bg-background px-2 py-1 rounded text-xs">persistq</code> command directly:
                </p>
                <div className="rounded-lg border border-border bg-surface p-4 mb-4 relative group">
                  <button
                    onClick={() => copyCode("npm install -g persistq", "global-install")}
                    className="absolute top-4 right-4 p-2 rounded hover:bg-background transition-colors"
                  >
                    {copiedSection === "global-install" ? (
                      <Check className="w-4 h-4 text-accent-cyan" />
                    ) : (
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                  <pre className="text-sm overflow-x-auto">
                    <code>npm install -g persistq</code>
                  </pre>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Use when you need offline capability</li>
                  <li>• Requires manual updates for new features</li>
                  <li>• Good for CI/CD environments</li>
                </ul>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              For detailed manual setup instructions, see the{" "}
              <Link href="/docs/manual-setup" className="text-accent-cyan hover:underline">
                manual setup guide
              </Link>
              {" "}for complete control over configuration options.
            </p>
          </section>

          {/* Platform Setup Guides */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Platform Setup Guides</h2>
            <p className="text-muted-foreground mb-6">
              Click on your platform below to view detailed setup instructions:
            </p>

            <Accordion type="single" collapsible className="w-full space-y-4">
              {/* Setup for Claude Code */}
              <AccordionItem value="claude" className="border border-border rounded-lg px-6 bg-surface">
                <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent-cyan"></div>
                    <span>Setup for Claude Code</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">

            <h3 className="text-xl font-semibold mb-3">1. Get Your API Key</h3>
            <p className="text-muted-foreground mb-4">
              Sign up at PersistQ and copy your API key from the{" "}
              <Link href="/dashboard" className="text-accent-cyan hover:underline">
                dashboard
              </Link>
              . Your API key starts with <code className="bg-background px-2 py-1 rounded text-xs">pq_</code>
            </p>

            <h3 className="text-xl font-semibold mb-3">2. Configure MCP Server</h3>
            <p className="text-muted-foreground mb-4">
              Add PersistQ to your Claude Code MCP configuration at{" "}
              <code className="bg-background px-2 py-1 rounded text-xs">~/.claude/mcp.json</code>:
            </p>
            <div className="rounded-lg border border-border bg-surface p-4 mb-8 relative group">
              <button
                onClick={() =>
                  copyCode(
                    `{
  "mcpServers": {
    "persistq": {
      "command": "npx",
      "args": ["-y", "persistq"],
      "env": {
        "PERSISTQ_URL": "https://api.persistq.com",
        "PERSISTQ_API_KEY": "your-api-key-here"
      }
    }
  }
}`,
                    "claude-config"
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
      "command": "npx",
      "args": ["-y", "persistq"],
      "env": {
        "PERSISTQ_URL": "https://api.persistq.com",
        "PERSISTQ_API_KEY": "your-api-key-here"
      }
    }
  }
}`}</code>
              </pre>
            </div>

            <h3 className="text-xl font-semibold mb-3">3. Restart Claude Code</h3>
            <p className="text-muted-foreground mb-4">
              Restart Claude Code to load the MCP server. You should see a confirmation that the PersistQ MCP server is connected.
            </p>

            <h3 className="text-xl font-semibold mb-3">4. Start Using</h3>
            <p className="text-muted-foreground mb-4">
              You can now use PersistQ naturally in conversations:
            </p>
            <div className="p-4 rounded-lg border border-border bg-surface space-y-3">
              <div>
                <p className="text-sm font-medium mb-1">Store information:</p>
                <p className="text-sm text-muted-foreground italic">
                  "Remember that I prefer TypeScript and use Next.js for web projects"
                </p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Retrieve information:</p>
                <p className="text-sm text-muted-foreground italic">
                  "What do you know about my tech stack preferences?"
                </p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Search memories:</p>
                <p className="text-sm text-muted-foreground italic">
                  "Search for any information about my coding style"
                </p>
              </div>
            </div>
                </AccordionContent>
              </AccordionItem>

              {/* Setup for GitHub Copilot CLI & VS Code */}
              <AccordionItem value="copilot" className="border border-border rounded-lg px-6 bg-surface">
                <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent-purple"></div>
                    <span>Setup for GitHub Copilot CLI & VS Code</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">

            <div className="p-4 rounded-lg border border-accent-purple/30 bg-accent-purple/5 mb-6">
              <p className="text-sm">
                <strong className="text-accent-purple">Note:</strong> GitHub Copilot CLI currently supports MCP tools only.
                Resources and prompts are not yet available.
              </p>
            </div>

            <h3 className="text-xl font-semibold mb-3">1. Get Your API Key</h3>
            <p className="text-muted-foreground mb-4">
              Same as Claude Code - get your API key from the{" "}
              <Link href="/dashboard" className="text-accent-cyan hover:underline">
                dashboard
              </Link>
            </p>

            <h3 className="text-xl font-semibold mb-3">2. Configure MCP Server</h3>
            <p className="text-muted-foreground mb-4">
              Add PersistQ to your Copilot CLI MCP configuration. The exact location depends on your setup:
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
                    "copilot-config"
                  )
                }
                className="absolute top-4 right-4 p-2 rounded hover:bg-background transition-colors"
              >
                {copiedSection === "copilot-config" ? (
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

            <h3 className="text-xl font-semibold mb-3">3. Use MCP Tools</h3>
            <p className="text-muted-foreground mb-4">
              With Copilot CLI, you'll need to explicitly invoke MCP tools:
            </p>
            <div className="p-4 rounded-lg border border-border bg-surface">
              <p className="text-sm text-muted-foreground italic">
                "Use the persistq MCP tool to store this information..."
              </p>
            </div>
                </AccordionContent>
              </AccordionItem>

              {/* Setup for Cursor IDE */}
              <AccordionItem value="cursor" className="border border-border rounded-lg px-6 bg-surface">
                <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                    <span>Setup for Cursor IDE</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">

            <h3 className="text-xl font-semibold mb-3">1. Get Your API Key</h3>
            <p className="text-muted-foreground mb-4">
              Same as other tools - get your API key from{" "}
              <Link href="/dashboard" className="text-accent-cyan hover:underline">
                dashboard
              </Link>
            </p>

            <h3 className="text-xl font-semibold mb-3">2. Configure MCP Server</h3>
            <p className="text-muted-foreground mb-4">
              Add PersistQ to your Cursor MCP configuration at{" "}
              <code className="bg-background px-2 py-1 rounded text-xs">~/.cursor/mcp.json</code> (macOS/Linux) or{" "}
              <code className="bg-background px-2 py-1 rounded text-xs">%USERPROFILE%\.cursor\mcp.json</code> (Windows):
            </p>
            <div className="rounded-lg border border-border bg-surface p-4 mb-8 relative group">
              <button
                onClick={() =>
                  copyCode(
                    `{
  "mcpServers": {
    "persistq": {
      "command": "npx",
      "args": ["-y", "persistq"],
      "env": {
        "PERSISTQ_URL": "https://api.persistq.com",
        "PERSISTQ_API_KEY": "your-api-key-here"
      }
    }
  }
}`,
                    "cursor-config"
                  )
                }
                className="absolute top-4 right-4 p-2 rounded hover:bg-background transition-colors"
              >
                {copiedSection === "cursor-config" ? (
                  <Check className="w-4 h-4 text-accent-cyan" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              <pre className="text-sm overflow-x-auto">
                <code>{`{
  "mcpServers": {
    "persistq": {
      "command": "npx",
      "args": ["-y", "persistq"],
      "env": {
        "PERSISTQ_URL": "https://api.persistq.com",
        "PERSISTQ_API_KEY": "your-api-key-here"
      }
    }
  }
}`}</code>
              </pre>
            </div>

            <h3 className="text-xl font-semibold mb-3">3. Restart Cursor</h3>
            <p className="text-muted-foreground mb-4">
              Restart Cursor IDE to load the MCP server configuration. You should see PersistQ appear in the MCP server list.
            </p>

            <h3 className="text-xl font-semibold mb-3">4. Start Using</h3>
            <p className="text-muted-foreground mb-4">
              Cursor will automatically detect and use PersistQ tools naturally in conversations:
            </p>
            <div className="p-4 rounded-lg border border-border bg-surface mb-8">
              <p className="text-sm text-muted-foreground">
                "Remember that I prefer TypeScript and use Next.js for web projects"
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                "What do you know about my coding preferences?"
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                "Search for information about my project setup"
              </p>
            </div>
                </AccordionContent>
              </AccordionItem>

              {/* Setup for OpenCode IDE */}
              <AccordionItem value="opencode" className="border border-border rounded-lg px-6 bg-surface">
                <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    <span>Setup for OpenCode IDE</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">

            <h3 className="text-xl font-semibold mb-3">1. Get Your API Key</h3>
            <p className="text-muted-foreground mb-4">
              Get your API key from the{" "}
              <Link href="/dashboard" className="text-accent-cyan hover:underline">
                dashboard
              </Link>
            </p>

            <h3 className="text-xl font-semibold mb-3">2. Configure MCP Server</h3>
            <p className="text-muted-foreground mb-4">
              Add PersistQ to your OpenCode MCP configuration at{" "}
              <code className="bg-background px-2 py-1 rounded text-xs">~/.opencode/mcp.json</code> (macOS/Linux) or{" "}
              <code className="bg-background px-2 py-1 rounded text-xs">%USERPROFILE%\.opencode\mcp.json</code> (Windows):
            </p>
            <div className="rounded-lg border border-border bg-surface p-4 mb-8 relative group">
              <button
                onClick={() =>
                  copyCode(
                    `{
  "mcpServers": {
    "persistq": {
      "command": "npx",
      "args": ["-y", "persistq"],
      "env": {
        "PERSISTQ_URL": "https://api.persistq.com",
        "PERSISTQ_API_KEY": "your-api-key-here"
      }
    }
  }
}`,
                    "opencode-config"
                  )
                }
                className="absolute top-4 right-4 p-2 rounded hover:bg-background transition-colors"
              >
                {copiedSection === "opencode-config" ? (
                  <Check className="w-4 h-4 text-accent-cyan" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              <pre className="text-sm overflow-x-auto">
                <code>{`{
  "mcpServers": {
    "persistq": {
      "command": "npx",
      "args": ["-y", "persistq"],
      "env": {
        "PERSISTQ_URL": "https://api.persistq.com",
        "PERSISTQ_API_KEY": "your-api-key-here"
      }
    }
  }
}`}</code>
              </pre>
            </div>

            <h3 className="text-xl font-semibold mb-3">3. Restart OpenCode</h3>
            <p className="text-muted-foreground mb-4">
              Restart OpenCode IDE to load the MCP server configuration. PersistQ should automatically connect.
            </p>

            <h3 className="text-xl font-semibold mb-3">4. Start Using</h3>
            <p className="text-muted-foreground mb-4">
              OpenCode will automatically detect and use PersistQ tools naturally in conversations:
            </p>
            <div className="p-4 rounded-lg border border-border bg-surface mb-8">
              <p className="text-sm text-muted-foreground">
                "Store this information: I prefer using async/await over promises"
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                "What do you remember about my coding style?"
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                "Search my memories for TypeScript preferences"
              </p>
            </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* Available MCP Tools */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Available MCP Tools</h2>
            <p className="text-muted-foreground mb-6">
              The PersistQ MCP server provides these tools to AI assistants:
            </p>

            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="available-tools" className="border border-border rounded-lg px-6 bg-surface">
                <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent-cyan"></div>
                    <span>Available MCP Tools (4)</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <Accordion type="single" collapsible className="w-full space-y-4">
                    <AccordionItem value="add-memory-tool" className="border border-border rounded-lg last:border-b">
                      <AccordionTrigger className="text-base font-medium px-4 hover:no-underline">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span>add_memory</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 space-y-3">
                        <p className="text-sm text-muted-foreground">
                          Store a new memory with optional topic and metadata
                        </p>
                        <div className="text-xs bg-background p-3 rounded">
                          <code>text (required), topic (optional), metadata (optional)</code>
                        </div>
                        <div className="p-3 rounded border border-border bg-surface">
                          <p className="text-xs text-muted-foreground mb-2">
                            <strong>Example usage:</strong>
                          </p>
                          <p className="text-xs text-muted-foreground italic">
                            "Remember that I prefer TypeScript for web development"
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="search-memory-tool" className="border border-border rounded-lg last:border-b">
                      <AccordionTrigger className="text-base font-medium px-4 hover:no-underline">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <span>search_memory</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 space-y-3">
                        <p className="text-sm text-muted-foreground">
                          Search memories using semantic similarity
                        </p>
                        <div className="text-xs bg-background p-3 rounded">
                          <code>query (required), topic (optional), limit (optional)</code>
                        </div>
                        <div className="p-3 rounded border border-border bg-surface">
                          <p className="text-xs text-muted-foreground mb-2">
                            <strong>Example usage:</strong>
                          </p>
                          <p className="text-xs text-muted-foreground italic">
                            "Search for information about my coding preferences"
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="list-memories-tool" className="border border-border rounded-lg last:border-b">
                      <AccordionTrigger className="text-base font-medium px-4 hover:no-underline">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                          <span>list_memories</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 space-y-3">
                        <p className="text-sm text-muted-foreground">
                          List memories with optional filtering by project/tag
                        </p>
                        <div className="text-xs bg-background p-3 rounded">
                          <code>project (optional), limit (optional), offset (optional)</code>
                        </div>
                        <div className="p-3 rounded border border-border bg-surface">
                          <p className="text-xs text-muted-foreground mb-2">
                            <strong>Example usage:</strong>
                          </p>
                          <p className="text-xs text-muted-foreground italic">
                            "Show me all my memories from the 'preferences' project"
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="get-stats-tool" className="border border-border rounded-lg last:border-b">
                      <AccordionTrigger className="text-base font-medium px-4 hover:no-underline">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                          <span>get_memory_stats</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 space-y-3">
                        <p className="text-sm text-muted-foreground">
                          Get statistics about stored memories
                        </p>
                        <div className="text-xs bg-background p-3 rounded">
                          <code>No parameters required</code>
                        </div>
                        <div className="p-3 rounded border border-border bg-surface">
                          <p className="text-xs text-muted-foreground mb-2">
                            <strong>Example usage:</strong>
                          </p>
                          <p className="text-xs text-muted-foreground italic">
                            "Show my memory statistics"
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* Troubleshooting */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Troubleshooting</h2>

            <Accordion type="multiple" className="w-full space-y-3 mb-8">
              <AccordionItem value="connection-issues" className="border border-border rounded-lg last:border-b">
                <AccordionTrigger className="text-base font-medium px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span>Connection Issues</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div>
                    <h4 className="font-semibold mb-2">MCP server not detected</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• Verify the <code className="bg-background px-1 rounded text-xs">persistq</code> command is in your PATH</li>
                      <li>• Check the MCP configuration file location is correct</li>
                      <li>• Restart your AI assistant after configuration changes</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="auth-issues" className="border border-border rounded-lg last:border-b">
                <AccordionTrigger className="text-base font-medium px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span>Authentication Issues</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div>
                    <h4 className="font-semibold mb-2">Authentication errors</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• Verify your API key is correct and starts with <code className="bg-background px-1 rounded text-xs">mh_</code></li>
                      <li>• Check that <code className="bg-background px-1 rounded text-xs">PERSISTQ_API_KEY</code> is set in the env configuration</li>
                      <li>• Ensure your API key hasn't expired (check the dashboard)</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="network-issues" className="border border-border rounded-lg last:border-b">
                <AccordionTrigger className="text-base font-medium px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span>Network Issues</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div>
                    <h4 className="font-semibold mb-2">Connection issues</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• Verify the <code className="bg-background px-1 rounded text-xs">PERSISTQ_URL</code> is set correctly</li>
                      <li>• Check your internet connection</li>
                      <li>• Try accessing the API URL directly in your browser</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* Next Steps */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Next Steps</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                href="/docs/typescript-sdk"
                className="p-6 rounded-lg border border-border bg-surface hover:border-accent-cyan transition-colors"
              >
                <h3 className="font-semibold mb-2">TypeScript SDK</h3>
                <p className="text-sm text-muted-foreground">
                  Use PersistQ directly in your applications with the TypeScript SDK
                </p>
              </Link>
              <Link
                href="/docs/api-reference"
                className="p-6 rounded-lg border border-border bg-surface hover:border-accent-purple transition-colors"
              >
                <h3 className="font-semibold mb-2">API Reference</h3>
                <p className="text-sm text-muted-foreground">
                  Explore the complete API documentation
                </p>
              </Link>
            </div>
          </section>

          {/* Help */}
          <div className="p-6 rounded-lg border border-accent-cyan/30 bg-accent-cyan/5">
            <h3 className="font-semibold mb-2 text-accent-cyan">Need Help?</h3>
            <p className="text-sm text-muted-foreground">
              Check out the{" "}
              <Link href="/docs/getting-started" className="text-accent-cyan hover:underline">
                getting started guide
              </Link>{" "}
              or{" "}
              <Link href="/docs/api-reference" className="text-accent-cyan hover:underline">
                API reference
              </Link>{" "}
              if you encounter any issues.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
