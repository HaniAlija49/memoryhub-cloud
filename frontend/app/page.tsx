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
  baseUrl: 'https://api.persistq.com',
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
curl -X POST https://api.persistq.com/api/memory \\
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
curl -X POST https://api.persistq.com/api/memory/search \\
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
        "PERSISTQ_URL": "https://api.persistq.com",
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
      <section ref={heroRef} className="container mx-auto px-4 pt-20 pb-16 md:pt-24 md:pb-20 animate-fade-in">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            Add persistent, private memory to your AI — with{" "}
            <span className="bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-cyan bg-clip-text text-transparent animated-gradient">
              ZERO embedding cost
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Build smarter AI agents in minutes — with full privacy and zero embedding fees.
          </p>

          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            MCP-ready for Claude, GPT, and local LLM agents.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-accent-cyan hover:bg-accent-cyan/90 hover:scale-105 text-black font-medium text-base h-12 px-8 transition-transform duration-200 shadow-lg hover:shadow-xl cta-glow"
              >
                Start Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/docs">
              <Button
                size="lg"
                variant="outline"
                className="text-base h-12 px-8 bg-transparent hover:bg-surface transition-colors duration-200"
              >
                View Docs
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground pt-2">No credit card required.</p>
        </div>
      </section>

      {/* Value Props - Above the Fold */}
      <section className="border-y border-border/40 bg-surface/30 py-16 animate-on-scroll">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center space-y-3">
              <div className="text-3xl md:text-4xl font-bold text-accent-cyan mb-2">$0</div>
              <div className="font-semibold text-base">Zero Embedding Cost</div>
              <div className="text-sm text-muted-foreground leading-relaxed">
                Never pay OpenAI embedding fees again. Local Transformers.js embeddings included.
              </div>
            </div>
            <div className="text-center space-y-3">
              <div className="text-3xl md:text-4xl font-bold text-accent-purple mb-2">
                <Shield className="w-10 h-10 mx-auto" />
              </div>
              <div className="font-semibold text-base">Privacy-First Architecture</div>
              <div className="text-sm text-muted-foreground leading-relaxed">
                Your data never touches OpenAI, Anthropic, or third-party AI services.
              </div>
            </div>
            <div className="text-center space-y-3">
              <div className="text-3xl md:text-4xl font-bold text-accent-cyan mb-2">~200ms</div>
              <div className="font-semibold text-base">Built for AI Agents</div>
              <div className="text-sm text-muted-foreground leading-relaxed">
                Fast semantic search optimized for real-time agent loops (~200ms).
              </div>
            </div>
            <div className="text-center space-y-3">
              <div className="text-3xl md:text-4xl font-bold text-accent-purple mb-2">
                <Check className="w-10 h-10 mx-auto" />
              </div>
              <div className="font-semibold text-base">Claude MCP Ready</div>
              <div className="text-sm text-muted-foreground leading-relaxed">
                Plug PersistQ into Claude Code with a single configuration.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo GIF Placeholder Section */}
      <section className="container mx-auto px-4 py-16 animate-on-scroll">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">See PersistQ in Action</h2>
          <p className="text-lg text-muted-foreground">30-second demo</p>

          {/* Demo GIF Placeholder */}
          <div className="rounded-lg border-2 border-dashed border-border bg-surface/50 aspect-video flex items-center justify-center">
            <div className="text-center space-y-4 p-8">
              <div className="text-6xl">🎬</div>
              <div className="text-lg font-medium text-muted-foreground">
                Your demo video or GIF will go here
              </div>
              <div className="text-sm text-muted-foreground max-w-md mx-auto">
                Example: store → search → retrieve
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Benefit Driven */}
      <section id="features" className="container mx-auto px-4 py-16 animate-on-scroll">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Built for Developers, Optimized for AI</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to add semantic memory to your AI agents.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 rounded-lg border border-border bg-surface/50">
              <div className="text-accent-cyan mb-4">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Save money and increase privacy with local embedding generation</h3>
              <p className="text-muted-foreground">
                Generate embeddings locally with Transformers.js (384d). Never pay OpenAI or Anthropic for embeddings again.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border bg-surface/50">
              <div className="text-accent-purple mb-4">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Find the right memory instantly with lightning-fast semantic search</h3>
              <p className="text-muted-foreground">
                Powered by pgvector with cosine similarity. Query your memories naturally and get relevant results every time.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border bg-surface/50">
              <div className="text-accent-cyan mb-4">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Combine semantic and exact matching for the most relevant results</h3>
              <p className="text-muted-foreground">
                Hybrid keyword + vector search ensures you never miss important memories, whether the query is fuzzy or exact.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border bg-surface/50">
              <div className="text-accent-purple mb-4">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Fast enough for real-time agent loops</h3>
              <p className="text-muted-foreground">
                Average latency of ~200ms means your AI agents never wait. Optimized for production workloads at scale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MCP Integration Section */}
      <section className="container mx-auto px-4 py-16 animate-on-scroll">
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
      <section className="container mx-auto px-4 py-16 bg-surface/30 animate-on-scroll">
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

      {/* Use Cases Section (Renamed from Success Stories) */}
      <section className="container mx-auto px-4 py-16 bg-surface/30 animate-on-scroll">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Use Cases</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Add persistent memory to any AI application
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-lg border border-border bg-surface hover:border-accent-cyan/50 transition-colors">
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="text-lg font-semibold mb-3">AI Assistants</h3>
              <p className="text-sm text-muted-foreground">
                Give your assistant long-term memory of preferences, tasks, and interactions.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border bg-surface hover:border-accent-purple/50 transition-colors">
              <div className="text-3xl mb-4">⚙️</div>
              <h3 className="text-lg font-semibold mb-3">Agent Frameworks</h3>
              <p className="text-sm text-muted-foreground">
                Add a persistent knowledge layer to multi-step agents.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border bg-surface hover:border-accent-cyan/50 transition-colors">
              <div className="text-3xl mb-4">💡</div>
              <h3 className="text-lg font-semibold mb-3">Custom AI Apps</h3>
              <p className="text-sm text-muted-foreground">
                Store contextual data, notes, summaries, and conversation history.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border bg-surface hover:border-accent-purple/50 transition-colors">
              <div className="text-3xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold mb-3">RAG Enhancements</h3>
              <p className="text-sm text-muted-foreground">
                Improve retrieval quality with structured semantic memory.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder's Note Section */}
      <section className="container mx-auto px-4 py-16 animate-on-scroll">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-lg border border-border bg-surface p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">From the Founder</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed mb-4">
                PersistQ is new — but it was built from real frustration with expensive embeddings, privacy concerns, and overly complex vector databases.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Developers deserve a memory layer that is fast, private, affordable, and easy to integrate.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                PersistQ gives you semantic memory with zero embedding cost, no vendor lock-in, and full Claude MCP support.
              </p>
              <p className="text-muted-foreground leading-relaxed font-medium">
                If you're building an AI agent, PersistQ is designed for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingToggle />

      {/* Powerful Features Section */}
      <TechnicalSpecs />

      {/* Interactive Demo Section */}
      <InteractiveDemo />

      {/* Cost Calculator Section */}
      <CostCalculator />

  
      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 animate-on-scroll">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">Ready to add memory to your AI?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start building with PersistQ today. No credit card required.
          </p>
          <div className="flex flex-col items-center justify-center gap-6">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-accent-cyan hover:bg-accent-cyan/90 text-black font-medium text-base h-14 px-10"
              >
                Start Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-accent-cyan" />
                <span>Zero embedding costs</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-accent-cyan" />
                <span>Privacy-first</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-accent-cyan" />
                <span>Claude MCP ready</span>
              </div>
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
