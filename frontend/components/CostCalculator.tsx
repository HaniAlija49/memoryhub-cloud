"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Calculator, TrendingDown, Zap, Shield } from "lucide-react"

interface CompetitorData {
  name: string
  costPerEmbedding: number
  description: string
}

const competitors: CompetitorData[] = [
  { name: "OpenAI", costPerEmbedding: 0.0001, description: "text-embedding-ada-002" },
  { name: "Cohere", costPerEmbedding: 0.00013, description: "embed-english-v3.0" },
  { name: "Anthropic", costPerEmbedding: 0.00015, description: "claude embeddings" }
]

export default function CostCalculator() {
  const [memories, setMemories] = useState([100000])
  const [selectedCompetitor, setSelectedCompetitor] = useState(0)

  const memoryCount = memories[0]
  const competitor = competitors[selectedCompetitor]
  const competitorCost = memoryCount * competitor.costPerEmbedding
  const persistqCost = 0
  const monthlySavings = competitorCost
  const yearlySavings = monthlySavings * 12

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`
    return `$${num.toFixed(2)}`
  }

  const formatMemoryCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`
    return count.toString()
  }

  const getSavingsPercentage = (): number => {
    return 100 // Since PersistQ is $0, it's 100% savings
  }

  return (
    <section className="py-32 container mx-auto px-4 bg-surface/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-full mb-6">
            <TrendingDown className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-500 font-medium">Calculate Your Savings</span>
          </div>
          <h2 className="text-5xl font-bold mb-6">
            Stop Paying for Embeddings
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how much you'll save with local embeddings vs competitors who charge per token
          </p>
        </div>

        <Card className="p-8 bg-background/50 border-border/50">
          <div className="space-y-8">
            {/* Memory Count Slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-lg font-medium">Number of memories per month</label>
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {formatMemoryCount(memoryCount)}
                </Badge>
              </div>
              <Slider
                value={memories}
                onValueChange={setMemories}
                max={5000000}
                min={1000}
                step={10000}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1K</span>
                <span>100K</span>
                <span>1M</span>
                <span>5M</span>
              </div>
            </div>

            {/* Competitor Selection */}
            <div className="space-y-4">
              <label className="text-lg font-medium">Compare with competitor</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {competitors.map((comp, index) => (
                  <Card
                    key={comp.name}
                    className={`p-4 cursor-pointer transition-all duration-200 ${
                      selectedCompetitor === index
                        ? 'border-accent-cyan bg-accent-cyan/5'
                        : 'border-border/30 hover:border-border/60'
                    }`}
                    onClick={() => setSelectedCompetitor(index)}
                  >
                    <div className="space-y-2">
                      <div className="font-medium">{comp.name}</div>
                      <div className="text-xs text-muted-foreground">{comp.description}</div>
                      <div className="text-sm font-mono">
                        ${comp.costPerEmbedding}/embedding
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Cost Comparison */}
            <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-border/30">
              {/* Competitor Cost */}
              <Card className="p-6 bg-red-500/5 border-red-500/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-red-400">{competitor.name}</h3>
                    <TrendingDown className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-foreground">
                      {formatNumber(competitorCost)}
                      <span className="text-lg text-muted-foreground font-normal">/month</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {memoryCount.toLocaleString()} embeddings × ${competitor.costPerEmbedding}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-red-500/20">
                    <div className="text-sm text-red-400">
                      Yearly cost: {formatNumber(yearlySavings)}
                    </div>
                  </div>
                </div>
              </Card>

              {/* PersistQ Cost */}
              <Card className="p-6 bg-green-500/5 border-green-500/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-green-400">PersistQ</h3>
                    <Zap className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-green-400">
                      $0
                      <span className="text-lg text-muted-foreground font-normal">/month</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Local embeddings with Transformers.js
                    </div>
                  </div>
                  <div className="pt-4 border-t border-green-500/20">
                    <div className="text-sm text-green-400">
                      Yearly cost: $0
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Savings Summary */}
            <div className="bg-gradient-to-r from-accent-cyan/10 to-accent-purple/10 rounded-lg p-6 border border-accent-cyan/20">
              <div className="text-center space-y-4">
                <div className="text-sm text-muted-foreground">Your total savings</div>
                <div className="text-5xl font-bold">
                  {formatNumber(monthlySavings)}
                  <span className="text-xl text-muted-foreground font-normal">/month</span>
                </div>
                <div className="text-lg text-green-400">
                  {formatNumber(yearlySavings)} yearly savings ({getSavingsPercentage()}% cost reduction)
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>Plus: Better privacy with local processing</span>
                </div>
              </div>
            </div>

            {/* Feature Comparison */}
            <div className="grid md:grid-cols-3 gap-4 pt-6 border-t border-border/30">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-accent-cyan" />
                </div>
                <h4 className="font-medium">Zero Latency</h4>
                <p className="text-sm text-muted-foreground">
                  No external API calls for embeddings
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-accent-purple" />
                </div>
                <h4 className="font-medium">100% Private</h4>
                <p className="text-sm text-muted-foreground">
                  Your data never leaves your infrastructure
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center mx-auto mb-3">
                  <Calculator className="w-6 h-6 text-green-500" />
                </div>
                <h4 className="font-medium">Predictable Costs</h4>
                <p className="text-sm text-muted-foreground">
                  No per-token surprises or usage spikes
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Ready to start saving?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-accent-cyan hover:bg-accent-cyan/90 text-black">
              Start Saving Today
            </Button>
            <Button variant="outline" size="lg">
              View Pricing Plans
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}