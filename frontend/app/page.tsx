"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check, Shield, Lock, Menu, X } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import InteractiveDemo from "@/components/InteractiveDemo"
import CostCalculator from "@/components/CostCalculator"
import CodeBlock from "@/components/CodeBlock"
import PricingToggle from "@/components/PricingToggle"
import CaseStudies from "@/components/CaseStudies"
import TechnicalSpecs from "@/components/TechnicalSpecs"
import WhatsNew from "@/components/WhatsNew"
import BackToTop from "@/components/BackToTop"

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("node")
  const [showStickyCTA, setShowStickyCTA] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  // Sticky CTA on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom
        setShowStickyCTA(heroBottom < 0)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    )

    const elements = document.querySelectorAll(".animate-on-scroll")
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const codeExamples = {
    node: `import { createClient } from 'persistq-sdk';

const client = createClient({
  baseUrl: 'https://memoryhub-cloud.onrender.com',
  apiKey: process.env.PERSISTQ_API_KEY,
});

// Store a memory
await client.createMemory(
  'User prefers dark mode',
  'preferences',
  { tags: ['ui', 'settings'] }
);

// Search memories
const results = await client.searchMemories(
  'user preferences',
  { limit: 10 }
);`,
    curl: `# Store a memory
curl -X POST https://memoryhub-cloud.onrender.com/api/memory \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "content": "User prefers dark mode",
    "project": "preferences",
    "metadata": {
      "tags": ["ui", "settings"]
    }
  }'

# Search memories
curl -X POST https://memoryhub-cloud.onrender.com/api/memory/search \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "user preferences",
    "limit": 10
  }'`,
    mcp: `# Install MCP server globally
npm install -g persistq

# Configure for Claude Code (~/.claude/mcp.json)
{
  "mcpServers": {
    "persistq": {
      "command": "persistq",
      "env": {
        "PERSISTQ_URL": "https://memoryhub-cloud.onrender.com",
        "PERSISTQ_API_KEY": "your-api-key"
      }
    }
  }
}

# Then use naturally in Claude Code:
# "Remember: user prefers TypeScript and Next.js"`,
  }

  return (
    <div className="min-h-screen bg-background scroll-smooth">
      {/* Sticky CTA */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-border/40 transition-all duration-300 ${
          showStickyCTA ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <Image src="/logo-small.png" alt="PersistQ" width={32} height={32} className="object-contain" priority />
            </div>
            <span className="text-xl font-semibold">PersistQ</span>
          </div>
          <Link href="/signup">
            <Button size="sm" className="bg-accent-cyan hover:bg-accent-cyan/90 text-black animate-pulse-subtle">
              Start for Free
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Docs
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-accent-cyan hover:bg-accent-cyan/90 text-black">
                Sign Up
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-surface rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <Link
                href="#features"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/docs"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Docs
              </Link>
              <div className="border-t border-border/40 pt-4 flex flex-col gap-3">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full">
                    Log in
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full bg-accent-cyan hover:bg-accent-cyan/90 text-black">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="container mx-auto px-4 pt-24 pb-32 md:pt-40 md:pb-48 animate-fade-in">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-none">
            Build smarter AI with{" "}
            <span className="bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-cyan bg-clip-text text-transparent animated-gradient">
              persistent memory
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            The semantic memory API for AI applications. Store, search, and retrieve context with zero embedding costs and local processing for maximum privacy.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-accent-cyan hover:bg-accent-cyan/90 hover:scale-105 text-black font-medium text-base h-12 px-8 transition-transform duration-200 shadow-lg hover:shadow-xl cta-glow"
              >
                Start Building Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/docs">
              <Button
                size="lg"
                variant="outline"
                className="text-base h-12 px-8 bg-transparent hover:bg-surface transition-colors duration-200"
              >
                Read Docs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border/40 bg-surface/30 py-12 animate-on-scroll">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-accent-cyan mb-2 floating-icon">~200ms</div>
              <div className="text-sm text-muted-foreground">Avg response time</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-accent-purple mb-2 floating-icon-delayed">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime SLA (Pro+)</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-accent-cyan mb-2 floating">$0</div>
              <div className="text-sm text-muted-foreground">Embedding costs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-accent-purple mb-2 floating-icon">GDPR</div>
              <div className="text-sm text-muted-foreground">Compliant</div>
            </div>
          </div>
        </div>
      </section>

      {/* Instant Setup Section */}
      <section className="container mx-auto px-4 py-32 animate-on-scroll">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl font-bold mb-6 leading-tight">
              Instant setup.
              <br />
              <span className="text-muted-foreground">No config.</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Get started in seconds with our TypeScript SDK or REST API. No complex setup, no infrastructure to
              manage.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/docs/typescript-sdk">
                <Button variant="link" className="text-accent-cyan p-0 h-auto text-lg">
                  TypeScript SDK docs →
                </Button>
              </Link>
              <Link href="/docs/getting-started">
                <Button variant="link" className="text-accent-purple p-0 h-auto text-lg">
                  Quickstart guide →
                </Button>
              </Link>
            </div>
          </div>
          <CodeBlock
            code={`$ npm install persistq-sdk

# Ready to use in 2 seconds`}
            language="bash"
            title="terminal"
          />
        </div>
      </section>

      {/* Zero Embedding Costs Section */}
      <section className="container mx-auto px-4 py-32 bg-surface/30 animate-on-scroll">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl font-bold mb-6 leading-tight">
              Zero embedding costs.
              <br />
              <span className="text-muted-foreground">Save thousands.</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Unlike competitors who charge for OpenAI embeddings, we generate vectors locally using open-source models.
              No per-token fees. No surprise bills.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-accent-cyan shrink-0 mt-1" />
                <div>
                  <div className="font-medium mb-1">Free embeddings forever</div>
                  <div className="text-sm text-muted-foreground">Transformers.js runs locally - no API costs</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-accent-cyan shrink-0 mt-1" />
                <div>
                  <div className="font-medium mb-1">Privacy-first</div>
                  <div className="text-sm text-muted-foreground">
                    Your data never leaves your infrastructure for embeddings
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-accent-cyan shrink-0 mt-1" />
                <div>
                  <div className="font-medium mb-1">Transparent pricing</div>
                  <div className="text-sm text-muted-foreground">Flat rates based on storage, not usage</div>
                </div>
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-surface p-8">
            <h3 className="font-semibold mb-6 text-lg">Cost Comparison</h3>
            <div className="space-y-4">
              <div className="p-4 rounded bg-red-500/10 border border-red-500/20">
                <div className="text-sm font-medium mb-2 text-red-400">Competitor (OpenAI embeddings)</div>
                <div className="text-xs text-muted-foreground">
                  1M memories × $0.0001/embedding = <strong className="text-foreground">$100+/month</strong>
                </div>
              </div>
              <div className="p-4 rounded bg-accent-cyan/10 border border-accent-cyan/20">
                <div className="text-sm font-medium mb-2 text-accent-cyan">PersistQ (local embeddings)</div>
                <div className="text-xs text-muted-foreground">
                  1M memories = <strong className="text-foreground">$0 embedding costs</strong>
                </div>
              </div>
              <div className="pt-4 text-center">
                <div className="text-2xl font-bold text-accent-cyan">Save $100+/month</div>
                <div className="text-xs text-muted-foreground mt-1">on every million memories</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MCP Integration Section */}
      <section className="container mx-auto px-4 py-32 animate-on-scroll">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 rounded-lg border border-border bg-surface p-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2">Claude Code</span>
              </div>
              <div className="text-sm font-mono">
                <div className="text-accent-cyan mb-2">&gt; One prompt, instant setup</div>
                <div className="text-muted-foreground mb-4">
                  "Add PersistQ memory to my AI agent using MCP"
                </div>
                <div className="text-green-400 mb-1">✓ MCP server configured</div>
                <div className="text-green-400 mb-1">✓ Memory tools available</div>
                <div className="text-green-400">✓ Ready to use in seconds</div>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-5xl font-bold mb-6 leading-tight">
              Works with AI tools.
              <br />
              <span className="text-muted-foreground">MCP ready.</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Integrates seamlessly with Claude Code and GitHub Copilot CLI via Model Context Protocol. Simple setup,
              powerful memory.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-accent-cyan shrink-0 mt-1" />
                <div>
                  <div className="font-medium mb-1">Claude Code integration</div>
                  <div className="text-sm text-muted-foreground">Full MCP support with tools and resources</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-accent-cyan shrink-0 mt-1" />
                <div>
                  <div className="font-medium mb-1">GitHub Copilot CLI</div>
                  <div className="text-sm text-muted-foreground">MCP tools integration available</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-accent-cyan shrink-0 mt-1" />
                <div>
                  <div className="font-medium mb-1">Quick setup</div>
                  <div className="text-sm text-muted-foreground">Install globally and configure in minutes</div>
                </div>
              </li>
            </ul>
            <Link href="/docs/mcp-integration" className="inline-block mt-6">
              <Button variant="link" className="text-accent-cyan p-0 h-auto text-lg">
                View MCP setup guide →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Integration Options */}
      <section className="container mx-auto px-4 py-32 bg-surface/30 animate-on-scroll">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">Three ways to integrate</h2>
            <p className="text-xl text-muted-foreground">
              Choose the integration that works best for your workflow
            </p>
          </div>

          {/* Language Tabs */}
          <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
            {[
              { id: "node", label: "TypeScript SDK" },
              { id: "mcp", label: "MCP Server" },
              { id: "curl", label: "REST API" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-accent-cyan text-black"
                    : "bg-surface text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Code Example */}
          <div className="max-w-3xl mx-auto">
            <CodeBlock
              code={codeExamples[activeTab as keyof typeof codeExamples]}
              language={activeTab === "curl" ? "bash" : activeTab === "mcp" ? "json" : "javascript"}
              title={activeTab === "node" ? "TypeScript" : activeTab === "curl" ? "REST API" : "MCP Configuration"}
            />
          </div>

          <div className="text-center mt-8">
            <Link href="/docs/api-reference">
              <Button variant="link" className="text-accent-cyan text-base">
                View full API reference →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Sections */}
      <section id="features" className="container mx-auto px-4 py-32 animate-on-scroll">
        <div className="max-w-6xl mx-auto space-y-32">
          {/* Semantic Search */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-bold mb-6 leading-tight">
                Semantic search.
                <br />
                <span className="text-muted-foreground">Built-in.</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Vector-based search finds relevant memories even with fuzzy queries. No need to remember exact phrases.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-accent-cyan shrink-0 mt-1" />
                  <div>
                    <div className="font-medium mb-1">Automatic embeddings</div>
                    <div className="text-sm text-muted-foreground">We handle vector generation for you</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-accent-cyan shrink-0 mt-1" />
                  <div>
                    <div className="font-medium mb-1">Hybrid search</div>
                    <div className="text-sm text-muted-foreground">Combines semantic and keyword search</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-accent-cyan shrink-0 mt-1" />
                  <div>
                    <div className="font-medium mb-1">Zero embedding costs</div>
                    <div className="text-sm text-muted-foreground">Local Transformers.js - no per-token charges</div>
                  </div>
                </li>
              </ul>
            </div>
            <div className="rounded-lg border border-border bg-surface p-8">
              <div className="space-y-4">
                <div className="p-4 rounded bg-accent-cyan/10 border border-accent-cyan/20">
                  <div className="text-sm font-medium mb-2">Query: "user color preferences"</div>
                  <div className="text-xs text-muted-foreground">Finds: "User prefers dark mode"</div>
                </div>
                <div className="p-4 rounded bg-accent-purple/10 border border-accent-purple/20">
                  <div className="text-sm font-medium mb-2">Query: "what does the user like"</div>
                  <div className="text-xs text-muted-foreground">Finds: "User enjoys sci-fi movies"</div>
                </div>
              </div>
            </div>
          </div>

          {/* Global Scale */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 rounded-lg border border-border bg-surface p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">North America</span>
                  <span className="text-accent-cyan font-medium">12ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Europe</span>
                  <span className="text-accent-cyan font-medium">18ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Asia Pacific</span>
                  <span className="text-accent-cyan font-medium">24ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">South America</span>
                  <span className="text-accent-cyan font-medium">31ms</span>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-5xl font-bold mb-6 leading-tight">
                Lightning fast.
                <br />
                <span className="text-muted-foreground">Built for scale.</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                PostgreSQL with pgvector extension ensures sub-200ms semantic search across millions of memories.
                Optimized for real-time applications.
              </p>
              <Link href="/docs">
                <Button variant="link" className="text-accent-cyan p-0 h-auto text-lg">
                  Learn about our infrastructure →
                </Button>
              </Link>
            </div>
          </div>

          {/* Security */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-bold mb-6 leading-tight">
                Security first.
                <br />
                <span className="text-muted-foreground">Privacy built-in.</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                GDPR compliant with secure authentication. Your data stays private with local embedding generation.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-border bg-surface">
                  <Lock className="w-8 h-8 text-accent-cyan mb-2" />
                  <div className="font-medium">Encrypted storage</div>
                </div>
                <div className="p-4 rounded-lg border border-border bg-surface">
                  <Shield className="w-8 h-8 text-accent-purple mb-2" />
                  <div className="font-medium">GDPR compliant</div>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-surface p-8">
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-accent-cyan shrink-0" />
                  <span>Secure API key authentication</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-accent-cyan shrink-0" />
                  <span>Local embedding generation</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-accent-cyan shrink-0" />
                  <span>GDPR compliant data handling</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-accent-cyan shrink-0" />
                  <span>User data deletion on request</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-accent-cyan shrink-0" />
                  <span>No third-party AI dependencies</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingToggle />

      {/* Case Studies Section */}
      <CaseStudies />

      {/* Powerful Features Section */}
      <TechnicalSpecs />

      {/* Interactive Demo Section */}
      <InteractiveDemo />

      {/* Cost Calculator Section */}
      <CostCalculator />

      {/* What's New & Roadmap Section */}
      <WhatsNew />

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-32 animate-on-scroll">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-5xl md:text-6xl font-bold leading-tight">Ready to add memory to your AI?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start building with PersistQ today. Zero embedding costs, privacy-first design, and simple pricing.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-accent-cyan hover:bg-accent-cyan/90 text-black font-medium text-base h-14 px-10"
              >
                Start Building Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-green-500" />
              <span>Zero embedding costs</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-green-500" />
              <span>Local processing</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-green-500" />
              <span>Simple pricing</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-surface/30">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="hover:text-foreground transition-colors">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link href="/docs/api-reference" className="hover:text-foreground transition-colors">
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link href="/docs/getting-started" className="hover:text-foreground transition-colors">
                    Guides
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link href="/privacy-policy" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/refund-policy" className="hover:text-foreground transition-colors">
                    Refund Policy
                  </Link>
                </li>
                <li>
                  <Link href="/cookie-policy" className="hover:text-foreground transition-colors">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="/do-not-sell" className="hover:text-foreground transition-colors">
                    Do Not Sell
                  </Link>
                </li>
                <li>
                  <Link href="/accessibility" className="hover:text-foreground transition-colors">
                    Accessibility
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="relative w-7 h-7">
                <Image
                  src="/logo-small.png"
                  alt="PersistQ Logo"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              <span className="font-semibold text-lg">PersistQ</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 PersistQ. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  )
}
