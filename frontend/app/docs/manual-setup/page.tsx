"use client"

import Link from "next/link"
import { SharedHeader } from "@/components/shared-header"
import { Copy, Check, Terminal, AlertCircle, Settings, ExternalLink } from "lucide-react"
import { useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function ManualSetupPage() {
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
            <span className="text-foreground">Manual Setup</span>
          </div>

          {/* Hero */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Manual MCP Server Setup</h1>
            <p className="text-xl text-muted-foreground mb-6">
              Complete control over your PersistQ MCP server configuration for any AI tool
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

          {/* Overview */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">When to Use Manual Setup</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="p-6 rounded-lg border border-border bg-surface">
                <Settings className="w-8 h-8 text-accent-cyan mb-3" />
                <h3 className="font-semibold mb-2">Manual Configuration</h3>
                <p className="text-sm text-muted-foreground">
                  Full control over MCP server settings, environment variables, and configuration paths
                </p>
              </div>
              <div className="p-6 rounded-lg border border-border bg-surface">
                <AlertCircle className="w-8 h-8 text-accent-purple mb-3" />
                <h3 className="font-semibold mb-2">Auto-Setup Limitations</h3>
                <p className="text-sm text-muted-foreground">
                  Some AI tools may not support all configuration options or require specific file formats
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-accent-cyan/30 bg-accent-cyan/5 mb-6">
              <p className="text-sm">
                <strong className="text-accent-cyan">Prerequisites:</strong> Node.js 16+ installed and your PersistQ API key from the{" "}
                <Link href="/dashboard" className="text-accent-cyan hover:underline">
                  dashboard
                </Link>
                . Your API key starts with <code className="bg-background px-2 py-1 rounded text-xs">mh_</code>
              </p>
            </div>
          </section>

          {/* Manual Setup by Platform */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Manual Setup by Platform</h2>
            <p className="text-muted-foreground mb-6">
              Click on your platform below to view detailed setup instructions:
            </p>

            <Accordion type="multiple" className="w-full space-y-4 mb-8">
              {/* Claude Code */}
              <AccordionItem value="claude-code" className="border border-border rounded-lg px-6 bg-surface">
                <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent-cyan"></div>
                    <span>Claude Code</span>
                    <span className="text-xs px-2 py-1 rounded bg-accent-cyan/20 text-accent-cyan">Recommended</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="font-medium mb-2">Configuration File</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        <code className="bg-background px-2 py-1 rounded text-xs">~/.claude/mcp.json</code> (macOS/Linux)<br/>
                        <code className="bg-background px-2 py-1 rounded text-xs">C:\Users\YourUsername\.claude\mcp.json</code> (Windows)
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">JSON Structure</h4>
                      <p className="text-sm text-muted-foreground">
                        Uses <code className="bg-background px-1 rounded text-xs">mcpServers</code> format
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border bg-surface p-4 mb-6 relative group">
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

                  <div className="space-y-4">
                    <h4 className="font-medium mb-2">Verification Steps</h4>
                    <ol className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>1. Save the configuration file</li>
                      <li>2. Restart Claude Code completely</li>
                      <li>3. Check for MCP server connection confirmation</li>
                      <li>4. Test with: "List my memories" or "Show memory statistics"</li>
                    </ol>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* GitHub Copilot CLI & VS Code */}
              <AccordionItem value="copilot" className="border border-border rounded-lg px-6 bg-surface">
                <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent-purple"></div>
                    <span>GitHub Copilot CLI & VS Code</span>
                    <span className="text-xs px-2 py-1 rounded bg-accent-purple/20 text-accent-purple">Tools Only</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  <div className="p-4 rounded-lg border border-accent-purple/30 bg-accent-purple/5 mb-6">
                    <p className="text-sm">
                      <strong className="text-accent-purple">Note:</strong> GitHub Copilot CLI currently supports MCP tools only.
                      Resources and prompts are not yet available.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="font-medium mb-2">Configuration Files</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Copilot CLI:</strong> <code className="bg-background px-2 py-1 rounded text-xs">~/.copilot/mcp-config.json</code><br/>
                        <strong>VS Code:</strong> <code className="bg-background px-2 py-1 rounded text-xs">%APPDATA%/Code/User/mcp.json</code> (Windows)<br/>
                        <code className="bg-background px-2 py-1 rounded text-xs">~/.config/Code/User/mcp.json</code> (macOS/Linux)
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">JSON Structure</h4>
                      <p className="text-sm text-muted-foreground">
                        Copilot CLI uses <code className="bg-background px-1 rounded text-xs">mcpServers</code>, VS Code uses <code className="bg-background px-1 rounded text-xs">servers</code>
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border bg-surface p-4 mb-6 relative group">
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

                  <div className="space-y-4">
                    <h4 className="font-medium mb-2">Verification Steps</h4>
                    <ol className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>1. Save the appropriate configuration file</li>
                      <li>2. Restart GitHub Copilot CLI or VS Code</li>
                      <li>3. Type <code className="bg-background px-1 rounded text-xs">/mcp</code> to see available servers</li>
                      <li>4. Test with: "Use persistq to store this information"</li>
                    </ol>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Cursor IDE */}
              <AccordionItem value="cursor" className="border border-border rounded-lg px-6 bg-surface">
                <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                    <span>Cursor IDE</span>
                    <span className="text-xs px-2 py-1 rounded bg-green-600/20 text-green-600">Full Support</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="font-medium mb-2">Configuration File</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        <code className="bg-background px-2 py-1 rounded text-xs">~/.cursor/mcp.json</code> (macOS/Linux)<br/>
                        <code className="bg-background px-2 py-1 rounded text-xs">%USERPROFILE%\.cursor\mcp.json</code> (Windows)
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">JSON Structure</h4>
                      <p className="text-sm text-muted-foreground">
                        Uses <code className="bg-background px-1 rounded text-xs">mcpServers</code> format
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border bg-surface p-4 mb-6 relative group">
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

                  <div className="space-y-4">
                    <h4 className="font-medium mb-2">Verification Steps</h4>
                    <ol className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>1. Save the configuration file</li>
                      <li>2. Restart Cursor IDE completely</li>
                      <li>3. Check MCP server status in Cursor's settings</li>
                      <li>4. Test with: "Remember that I prefer TypeScript"</li>
                    </ol>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* OpenCode IDE */}
              <AccordionItem value="opencode" className="border border-border rounded-lg px-6 bg-surface">
                <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    <span>OpenCode IDE</span>
                    <span className="text-xs px-2 py-1 rounded bg-blue-600/20 text-blue-600">Full Support</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="font-medium mb-2">Configuration File</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        <code className="bg-background px-2 py-1 rounded text-xs">~/.opencode/mcp.json</code> (macOS/Linux)<br/>
                        <code className="bg-background px-2 py-1 rounded text-xs">%USERPROFILE%\.opencode\mcp.json</code> (Windows)
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">JSON Structure</h4>
                      <p className="text-sm text-muted-foreground">
                        Uses <code className="bg-background px-1 rounded text-xs">mcpServers</code> format (similar to Claude Code)
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border bg-surface p-4 mb-6 relative group">
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

                  <div className="space-y-4">
                    <h4 className="font-medium mb-2">Verification Steps</h4>
                    <ol className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>1. Save the configuration file</li>
                      <li>2. Restart OpenCode IDE completely</li>
                      <li>3. Check for MCP server connection confirmation</li>
                      <li>4. Test with: "Store this: I prefer TypeScript"</li>
                    </ol>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* Configuration Options */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Configuration Options</h2>

            <Accordion type="single" collapsible className="w-full space-y-4">
              {/* Primary Method */}
              <AccordionItem value="npx-method" className="border border-border rounded-lg px-6 bg-surface">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent-cyan"></div>
                    <span>Using npx (Recommended)</span>
                    <span className="text-xs px-2 py-1 rounded bg-accent-cyan/20 text-accent-cyan">Primary</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="p-4 rounded-lg border border-accent-cyan/30 bg-accent-cyan/5">
                    <h3 className="font-semibold mb-3 text-accent-cyan">Primary Method: Using npx (Recommended)</h3>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Use <code className="bg-background px-2 py-1 rounded text-xs">npx -y persistq</code> to run PersistQ without global installation:
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Always uses the latest version</li>
                        <li>• No need to update manually</li>
                        <li>• Works across all platforms</li>
                        <li>• Recommended for most users</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Alternative Method */}
              <AccordionItem value="global-install" className="border border-border rounded-lg px-6 bg-surface">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
                    <span>Global Installation</span>
                    <span className="text-xs px-2 py-1 rounded bg-muted/20 text-muted-foreground">Alternative</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Install PersistQ globally and use the <code className="bg-background px-2 py-1 rounded text-xs">persistq</code> command directly:
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
                    <p className="text-sm text-muted-foreground mb-2">
                      Then update your configuration to use:
                    </p>
                    <div className="rounded-lg border border-border bg-surface p-4">
                      <pre className="text-sm overflow-x-auto">
                        <code>{`"command": "persistq"`}</code>
                      </pre>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• Use when you need offline capability</li>
                      <li>• Requires manual updates for new features</li>
                      <li>• Good for CI/CD environments</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* Environment Variables */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Environment Variables</h2>
            
            <Accordion type="multiple" className="w-full space-y-4">
              {/* Variable Overview */}
              <AccordionItem value="variables-overview" className="border border-border rounded-lg px-6 bg-surface">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent-cyan"></div>
                    <span>Required Variables</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border border-border bg-surface">
                      <h3 className="font-semibold mb-2">PERSISTQ_URL</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        The base URL for your PersistQ server
                      </p>
                      <div className="rounded bg-background p-3">
                        <code className="text-sm">https://api.persistq.com</code>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg border border-border bg-surface">
                      <h3 className="font-semibold mb-2">PERSISTQ_API_KEY</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Your authentication API key
                      </p>
                      <div className="rounded bg-background p-3">
                        <code className="text-sm">mh_your_api_key_here</code>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Get your API key from the{" "}
                        <Link href="/dashboard" className="text-accent-cyan hover:underline">
                          dashboard
                        </Link>
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Setting Variables */}
              <AccordionItem value="setting-variables" className="border border-border rounded-lg px-6 bg-surface">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent-purple"></div>
                    <span>How to Set Variables</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="p-4 rounded-lg border border-accent-cyan/30 bg-accent-cyan/5">
                    <h3 className="font-semibold mb-2 text-accent-cyan">Setting Environment Variables</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        <strong>Temporary (for current session):</strong>
                      </p>
                      <div className="rounded-lg border border-border bg-surface p-3">
                        <pre className="text-sm overflow-x-auto">
                          <code>{`export PERSISTQ_URL="https://api.persistq.com"
export PERSISTQ_API_KEY="your-api-key-here"`}</code>
                        </pre>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mt-3">
                        <strong>Permanent (add to shell profile):</strong>
                      </p>
                      <div className="rounded-lg border border-border bg-surface p-3">
                        <pre className="text-sm overflow-x-auto">
                          <code>{`# Add to ~/.bashrc, ~/.zshrc, or ~/.profile
export PERSISTQ_URL="https://api.persistq.com"
export PERSISTQ_API_KEY="your-api-key-here"

# Reload shell
source ~/.bashrc  # or ~/.zshrc`}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* Troubleshooting */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Troubleshooting</h2>
            
            <Accordion type="multiple" className="w-full space-y-3">
              <AccordionItem value="config-issues" className="border border-border rounded-lg last:border-b">
                <AccordionTrigger className="text-base font-medium px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span>⚙️ Configuration Issues</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Configuration File Not Found</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• Verify the file path is correct for your platform</li>
                      <li>• Check that hidden directories are visible</li>
                      <li>• Ensure the file has proper JSON syntax</li>
                      <li>• Restart the AI tool after making changes</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">JSON Syntax Errors</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• Use a JSON validator to check syntax</li>
                      <li>• Ensure all strings are in double quotes</li>
                      <li>• Check for trailing commas</li>
                      <li>• Verify brackets and braces are balanced</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="auth-issues" className="border border-border rounded-lg last:border-b">
                <AccordionTrigger className="text-base font-medium px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span>🔐 Authentication Issues</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div>
                    <h4 className="font-semibold mb-2">Authentication Failures</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• Verify your API key starts with <code className="bg-background px-1 rounded text-xs">mh_</code></li>
                      <li>• Check that the API key hasn't expired</li>
                      <li>• Ensure <code className="bg-background px-1 rounded text-xs">PERSISTQ_API_KEY</code> is set correctly</li>
                      <li>• Test the API key directly with curl</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="connection-issues" className="border border-border rounded-lg last:border-b">
                <AccordionTrigger className="text-base font-medium px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span>🌐 Connection Issues</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div>
                    <h4 className="font-semibold mb-2">MCP Server Not Detected</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• Restart the AI tool completely</li>
                      <li>• Check the tool's logs for MCP server errors</li>
                      <li>• Verify Node.js is installed and accessible</li>
                      <li>• Test with <code className="bg-background px-1 rounded text-xs">npx -y persistq --version</code></li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="platform-issues" className="border border-border rounded-lg last:border-b">
                <AccordionTrigger className="text-base font-medium px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span>🖥️ Platform-Specific Issues</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-3">
                    <div className="p-3 rounded border border-border bg-surface">
                      <h4 className="font-medium mb-1">Claude Code</h4>
                      <p className="text-sm text-muted-foreground">
                        Check <code className="bg-background px-1 rounded text-xs">~/.claude/</code> directory permissions
                      </p>
                    </div>
                    <div className="p-3 rounded border border-border bg-surface">
                      <h4 className="font-medium mb-1">GitHub Copilot</h4>
                      <p className="text-sm text-muted-foreground">
                        Ensure <code className="bg-background px-1 rounded text-xs">~/.copilot/</code> directory exists
                      </p>
                    </div>
                    <div className="p-3 rounded border border-border bg-surface">
                      <h4 className="font-medium mb-1">Cursor IDE</h4>
                      <p className="text-sm text-muted-foreground">
                        Check Cursor's MCP server status in settings
                      </p>
                    </div>
                    <div className="p-3 rounded border border-border bg-surface">
                      <h4 className="font-medium mb-1">OpenCode IDE</h4>
                      <p className="text-sm text-muted-foreground">
                        Verify <code className="bg-background px-1 rounded text-xs">~/.opencode/</code> directory exists and has proper permissions
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* Verification Steps */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Verification Steps</h2>
            
            <Accordion type="multiple" className="w-full space-y-3">
              <AccordionItem value="claude-verification" className="border border-border rounded-lg last:border-b">
                <AccordionTrigger className="text-base font-medium px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent-cyan"></div>
                    <span>Claude Code Verification</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <ol className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>1. Restart Claude Code</li>
                    <li>2. Look for "PersistQ MCP server connected" message</li>
                    <li>3. Test: "Show my memory statistics"</li>
                    <li>4. Test: "Store this information: I prefer dark mode"</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="copilot-verification" className="border border-border rounded-lg last:border-b">
                <AccordionTrigger className="text-base font-medium px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent-purple"></div>
                    <span>GitHub Copilot CLI Verification</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <ol className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>1. Restart GitHub Copilot CLI</li>
                    <li>2. Type <code className="bg-background px-1 rounded text-xs">/mcp</code> to list servers</li>
                    <li>3. Verify <code className="bg-background px-1 rounded text-xs">persistq</code> appears in the list</li>
                    <li>4. Test: "Use persistq to store this information"</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="cursor-verification" className="border border-border rounded-lg last:border-b">
                <AccordionTrigger className="text-base font-medium px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                    <span>Cursor IDE Verification</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <ol className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>1. Restart Cursor IDE</li>
                    <li>2. Check MCP server status in Cursor settings</li>
                    <li>3. Verify <code className="bg-background px-1 rounded text-xs">persistq</code> appears as connected</li>
                    <li>4. Test: "Remember that I use TypeScript for web projects"</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="opencode-verification" className="border border-border rounded-lg last:border-b">
                <AccordionTrigger className="text-base font-medium px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    <span>OpenCode IDE Verification</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <ol className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>1. Restart OpenCode IDE</li>
                    <li>2. Look for PersistQ MCP server connection confirmation</li>
                    <li>3. Verify <code className="bg-background px-1 rounded text-xs">persistq</code> appears as connected</li>
                    <li>4. Test: "Store this information: I prefer async/await"</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* Next Steps */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Next Steps</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                href="/docs/mcp-integration"
                className="p-6 rounded-lg border border-border bg-surface hover:border-accent-cyan transition-colors"
              >
                <h3 className="font-semibold mb-2">Platform-Specific Guides</h3>
                <p className="text-sm text-muted-foreground">
                  Detailed setup instructions for Claude Code, GitHub Copilot, and Cursor IDE
                </p>
              </Link>
              
              <Link
                href="/docs/api-reference"
                className="p-6 rounded-lg border border-border bg-surface hover:border-accent-purple transition-colors"
              >
                <h3 className="font-semibold mb-2">API Reference</h3>
                <p className="text-sm text-muted-foreground">
                  Complete HTTP API documentation for direct integration
                </p>
              </Link>
            </div>

            <div className="p-6 rounded-lg border border-accent-cyan/30 bg-accent-cyan/5">
              <h3 className="font-semibold mb-2 text-accent-cyan">Need Help?</h3>
              <p className="text-sm text-muted-foreground">
                Check out our{" "}
                <Link href="/docs/getting-started" className="text-accent-cyan hover:underline">
                  getting started guide
                </Link>
                {" "}for automated setup options, or{" "}
                <Link href="/docs/api-reference" className="text-accent-cyan hover:underline">
                  API reference
                </Link>
                {" "}for direct HTTP integration.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}