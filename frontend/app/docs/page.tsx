"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { BookOpen, Code2, Lightbulb, ArrowRight, Terminal, Puzzle } from "lucide-react"

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <Image
                src="/logo-small.png"
                alt="PersistQ Logo"
                width={32}
                height={32}
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-semibold">PersistQ</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="/docs" className="text-sm text-foreground font-medium">
              Docs
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
            <span className="font-semibold text-accent-cyan">Preview Documentation</span> - API endpoints and SDK
            packages are currently in development
          </p>
        </div>
      </div>

      {/* Hero */}
      <section className="container mx-auto px-4 pt-20 pb-12">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold">Documentation</h1>
          <p className="text-xl text-muted-foreground">
            Everything you need to integrate PersistQ into your AI applications
          </p>
        </div>
      </section>

      {/* Quick Links */}
      <section className="container mx-auto px-4 pb-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          <Link
            href="/docs/getting-started"
            className="p-8 rounded-lg border border-border bg-surface hover:border-accent-cyan transition-colors group"
          >
            <div className="w-12 h-12 rounded-lg bg-accent-cyan/10 flex items-center justify-center mb-4 group-hover:bg-accent-cyan/20 transition-colors">
              <BookOpen className="w-6 h-6 text-accent-cyan" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Getting Started</h3>
            <p className="text-muted-foreground mb-4">
              Learn the basics and make your first API call in under 5 minutes
            </p>
            <div className="flex items-center gap-2 text-accent-cyan font-medium">
              Start learning
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            href="/docs/typescript-sdk"
            className="p-8 rounded-lg border border-border bg-surface hover:border-accent-purple transition-colors group"
          >
            <div className="w-12 h-12 rounded-lg bg-accent-purple/10 flex items-center justify-center mb-4 group-hover:bg-accent-purple/20 transition-colors">
              <Terminal className="w-6 h-6 text-accent-purple" />
            </div>
            <h3 className="text-2xl font-bold mb-2">TypeScript SDK</h3>
            <p className="text-muted-foreground mb-4">
              Official TypeScript/JavaScript SDK for web apps, Node.js, and serverless
            </p>
            <div className="flex items-center gap-2 text-accent-purple font-medium">
              View SDK docs
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            href="/docs/mcp-integration"
            className="p-8 rounded-lg border border-border bg-surface hover:border-accent-cyan transition-colors group"
          >
            <div className="w-12 h-12 rounded-lg bg-accent-cyan/10 flex items-center justify-center mb-4 group-hover:bg-accent-cyan/20 transition-colors">
              <Puzzle className="w-6 h-6 text-accent-cyan" />
            </div>
            <h3 className="text-2xl font-bold mb-2">MCP Integration</h3>
            <p className="text-muted-foreground mb-4">
              Integrate with Claude Code and GitHub Copilot CLI via Model Context Protocol
            </p>
            <div className="flex items-center gap-2 text-accent-cyan font-medium">
              Setup MCP
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            href="/docs/api-reference"
            className="p-8 rounded-lg border border-border bg-surface hover:border-accent-purple transition-colors group"
          >
            <div className="w-12 h-12 rounded-lg bg-accent-purple/10 flex items-center justify-center mb-4 group-hover:bg-accent-purple/20 transition-colors">
              <Code2 className="w-6 h-6 text-accent-purple" />
            </div>
            <h3 className="text-2xl font-bold mb-2">API Reference</h3>
            <p className="text-muted-foreground mb-4">
              Complete reference for all endpoints, parameters, and responses
            </p>
            <div className="flex items-center gap-2 text-accent-purple font-medium">
              View API docs
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            href="/docs/guides"
            className="p-8 rounded-lg border border-border bg-surface hover:border-accent-cyan transition-colors group"
          >
            <div className="w-12 h-12 rounded-lg bg-accent-cyan/10 flex items-center justify-center mb-4 group-hover:bg-accent-cyan/20 transition-colors">
              <Lightbulb className="w-6 h-6 text-accent-cyan" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Guides & Tutorials</h3>
            <p className="text-muted-foreground mb-4">Step-by-step guides for common use cases and best practices</p>
            <div className="flex items-center gap-2 text-accent-cyan font-medium">
              Browse guides
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            href="/docs/examples"
            className="p-8 rounded-lg border border-border bg-surface hover:border-accent-purple transition-colors group"
          >
            <div className="w-12 h-12 rounded-lg bg-accent-purple/10 flex items-center justify-center mb-4 group-hover:bg-accent-purple/20 transition-colors">
              <Code2 className="w-6 h-6 text-accent-purple" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Code Examples</h3>
            <p className="text-muted-foreground mb-4">Ready-to-use code snippets in Python, Node.js, and more</p>
            <div className="flex items-center gap-2 text-accent-purple font-medium">
              View examples
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="container mx-auto px-4 pb-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Popular topics</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Quick Start</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/docs/getting-started#installation" className="hover:text-foreground">
                    Installation
                  </Link>
                </li>
                <li>
                  <Link href="/docs/getting-started#authentication" className="hover:text-foreground">
                    Authentication
                  </Link>
                </li>
                <li>
                  <Link href="/docs/getting-started#first-request" className="hover:text-foreground">
                    Making your first request
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Core Concepts</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/docs/guides#memories" className="hover:text-foreground">
                    Understanding memories
                  </Link>
                </li>
                <li>
                  <Link href="/docs/guides#groups" className="hover:text-foreground">
                    Memory groups
                  </Link>
                </li>
                <li>
                  <Link href="/docs/guides#search" className="hover:text-foreground">
                    Semantic search
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Advanced</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/docs/guides#webhooks" className="hover:text-foreground">
                    Webhooks
                  </Link>
                </li>
                <li>
                  <Link href="/docs/guides#rate-limits" className="hover:text-foreground">
                    Rate limiting
                  </Link>
                </li>
                <li>
                  <Link href="/docs/guides#best-practices" className="hover:text-foreground">
                    Best practices
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
