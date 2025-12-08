"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Server,
  Shield,
  Zap,
  Database,
  Globe,
  Lock,
  Check,
  ArrowRight
} from "lucide-react"

interface SpecCategory {
  title: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  specs: {
    label: string
    value: string
    detail?: string
  }[]
}

const specCategories: SpecCategory[] = [
  {
    title: "Performance",
    icon: Zap,
    description: "Fast and reliable for real-time applications",
    specs: [
      { label: "Search Speed", value: "~200ms", detail: "Average search response" },
      { label: "Scalability", value: "Millions", detail: "Memories per project" },
      { label: "Availability", value: "99.9%", detail: "Uptime guarantee" },
      { label: "Processing", value: "Local", detail: "No external dependencies" }
    ]
  },
  {
    title: "Memory Features",
    icon: Database,
    description: "Powerful capabilities for AI applications",
    specs: [
      { label: "Storage", value: "Flexible", detail: "JSON metadata support" },
      { label: "Search", value: "Semantic", detail: "Understands meaning and context" },
      { label: "Operations", value: "Full CRUD", detail: "Create, read, update, delete" },
      { label: "Projects", value: "Unlimited", detail: "Organize by topic/use case" }
    ]
  },
  {
    title: "Privacy & Security",
    icon: Shield,
    description: "Your data stays private and secure",
    specs: [
      { label: "Encryption", value: "AES-256", detail: "Data protection at rest" },
      { label: "Processing", value: "Local", detail: "Embeddings never leave your system" },
      { label: "Compliance", value: "GDPR Ready", detail: "Privacy by design" },
      { label: "Control", value: "Full", detail: "Your data, your rules" }
    ]
  },
  {
    title: "Developer Tools",
    icon: Globe,
    description: "Everything you need to get started quickly",
    specs: [
      { label: "TypeScript SDK", value: "Included", detail: "Full type support" },
      { label: "REST API", value: "Simple", detail: "Standard HTTP endpoints" },
      { label: "Documentation", value: "Complete", detail: "Guides and examples" },
      { label: "Integration", value: "Easy", detail: "Works with any tech stack" }
    ]
  }
]

const developerFeatures = [
  "Simple TypeScript SDK",
  "Easy REST API integration",
  "Real-time usage analytics",
  "Flexible metadata support",
  "Smart semantic search",
  "Zero embedding costs",
  "Privacy by design",
  "Predictable pricing"
]

export default function TechnicalSpecs() {
  return (
    <section className="py-32 container mx-auto px-4 bg-surface/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-accent-cyan/10 px-4 py-2 rounded-full mb-6">
            <Server className="w-4 h-4 text-accent-cyan" />
            <span className="text-sm text-accent-cyan font-medium">Built for Scale</span>
          </div>
          <h2 className="text-5xl font-bold mb-6">
            Powerful Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to build AI applications with persistent memory
          </p>
        </div>

        {/* Specifications Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {specCategories.map((category, index) => {
            const Icon = category.icon
            return (
              <Card key={index} className="bg-background/50 border-border/50 hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent-cyan/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-accent-cyan" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                      <CardDescription className="text-sm mt-1">
                        {category.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.specs.map((spec, specIndex) => (
                      <div key={specIndex} className="flex items-start justify-between gap-4">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{spec.label}</span>
                          </div>
                          {spec.detail && (
                            <p className="text-xs text-muted-foreground">{spec.detail}</p>
                          )}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {spec.value}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Enterprise Features */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-2xl font-bold mb-6">Developer Features</h3>
            <p className="text-muted-foreground mb-6">
              Everything developers need to build intelligent AI applications with persistent memory
            </p>
            <div className="space-y-3">
              {developerFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-accent-cyan/10 to-accent-purple/10 rounded-lg p-8 border border-accent-cyan/20">
            <h3 className="text-xl font-bold mb-4">Simple, Transparent Pricing</h3>
            <p className="text-muted-foreground mb-6">
              Focus on building your application, not managing infrastructure. Our straightforward pricing scales with your needs.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-accent-cyan" />
                <span className="text-sm">Zero embedding costs forever</span>
              </div>
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-accent-purple" />
                <span className="text-sm">Privacy-first by design</span>
              </div>
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-accent-cyan" />
                <span className="text-sm">Scale from startup to enterprise</span>
              </div>
            </div>
            <Link href="/signup">
              <Button size="lg" className="w-full mt-6 bg-accent-cyan hover:bg-accent-cyan/90 text-black">
                Get Started Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Ready to deploy at enterprise scale?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="bg-accent-cyan hover:bg-accent-cyan/90 text-black">
                Start Building Free
              </Button>
            </Link>
            <Link href="/docs">
              <Button variant="outline" size="lg">
                View Documentation
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}