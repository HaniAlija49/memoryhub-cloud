"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Quote, TrendingUp, Zap, Shield } from "lucide-react"

interface CaseStudy {
  title: string
  company: string
  industry: string
  description: string
  results: string[]
  metrics: {
    label: string
    value: string
    change?: string
  }[]
  tags: string[]
  icon: React.ComponentType<{ className?: string }>
}

const caseStudies: CaseStudy[] = [
  {
    title: "AI Assistant Platform Reduces Costs by 85%",
    company: "ChatFlow AI",
    industry: "SaaS",
    description: "Leading AI assistant platform switched from OpenAI embeddings to PersistQ for their memory layer, significantly reducing operational costs while improving response times.",
    results: [
      "Zero embedding costs on 2M monthly API calls",
      "Sub-200ms semantic search performance",
      "Improved privacy with local processing"
    ],
    metrics: [
      { label: "Cost Savings", value: "$2,400/month", change: "-85%" },
      { label: "Response Time", value: "~180ms", change: "-40%" },
      { label: "User Satisfaction", value: "94%", change: "+12%" }
    ],
    tags: ["AI Assistant", "High Volume", "Cost Optimization"],
    icon: TrendingUp
  },
  {
    title: "Enterprise Knowledge Base Scales 10x",
    company: "DataCorp Solutions",
    industry: "Enterprise Software",
    description: "Fortune 500 company implemented PersistQ for their internal knowledge base, enabling semantic search across 50 million documents with zero embedding costs.",
    results: [
      "Scaled from 5M to 50M documents",
      "Maintained sub-200ms search performance",
      "Reduced infrastructure complexity"
    ],
    metrics: [
      { label: "Document Volume", value: "50M", change: "+900%" },
      { label: "Search Latency", value: "~195ms", change: "Consistent" },
      { label: "Infrastructure Cost", value: "$0/month", change: "-100%" }
    ],
    tags: ["Enterprise", "Knowledge Management", "Large Scale"],
    icon: Shield
  },
  {
    title: "Customer Support Bot Personalization",
    company: "SupportLogic",
    industry: "Customer Service",
    description: "Customer support platform uses PersistQ to maintain conversation context and user preferences, resulting in more personalized and efficient support interactions.",
    results: [
      "Stored 10M+ customer interactions",
      "Real-time semantic similarity matching",
      "30% faster ticket resolution"
    ],
    metrics: [
      { label: "Resolution Time", value: "2.1 min", change: "-30%" },
      { label: "Customer Satisfaction", value: "91%", change: "+18%" },
      { label: "Agent Efficiency", value: "45%", change: "+25%" }
    ],
    tags: ["Customer Support", "Personalization", "Real-time"],
    icon: Zap
  }
]

export default function CaseStudies() {
  return (
    <section className="py-32 container mx-auto px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-accent-purple/10 px-4 py-2 rounded-full mb-6">
            <Quote className="w-4 h-4 text-accent-purple" />
            <span className="text-sm text-accent-purple font-medium">Success Stories</span>
          </div>
          <h2 className="text-5xl font-bold mb-6">
            See How Teams Succeed with PersistQ
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real companies saving thousands and improving performance with our zero-cost memory API
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {caseStudies.map((study, index) => {
            const Icon = study.icon
            return (
              <Card
                key={index}
                className="bg-surface/50 border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-accent-cyan/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-accent-cyan" />
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      {study.industry}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl leading-tight mb-2">
                    {study.title}
                  </CardTitle>
                  <CardDescription className="font-medium text-foreground">
                    {study.company}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {study.description}
                  </p>

                  {/* Results */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Key Results</h4>
                    <ul className="space-y-2">
                      {study.results.map((result, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan mt-2 shrink-0" />
                          {result}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Metrics */}
                  <div className="space-y-3 pt-4 border-t border-border/30">
                    <h4 className="font-medium text-sm">Impact Metrics</h4>
                    <div className="space-y-2">
                      {study.metrics.map((metric, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{metric.label}</span>
                          <div className="text-right">
                            <span className="text-sm font-medium">{metric.value}</span>
                            {metric.change && (
                              <span className={`ml-2 text-xs ${
                                metric.change.startsWith('+') ? 'text-green-500' :
                                metric.change.startsWith('-') ? 'text-accent-cyan' : 'text-muted-foreground'
                              }`}>
                                {metric.change}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-border/30">
                    {study.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-accent-cyan/10 to-accent-purple/10 rounded-lg p-8 border border-accent-cyan/20">
            <h3 className="text-2xl font-bold mb-4">Ready to write your success story?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join hundreds of companies saving thousands on embedding costs while building smarter AI applications.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-accent-cyan hover:bg-accent-cyan/90 text-black">
                Start Your Free Trial
              </Button>
              <Button variant="outline" size="lg">
                Read More Case Studies
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}