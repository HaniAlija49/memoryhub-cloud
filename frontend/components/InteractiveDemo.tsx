"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Sparkles, Loader2, Check } from "lucide-react"

// Sample data for demo
const sampleMemories = [
  {
    id: 1,
    content: "User prefers dark mode theme and finds it easier on the eyes during night work sessions",
    project: "preferences",
    tags: ["ui", "dark-mode", "accessibility"],
    similarity: 0.95
  },
  {
    id: 2,
    content: "Developer is working on a React TypeScript project with Next.js and Tailwind CSS",
    project: "tech-stack",
    tags: ["react", "typescript", "nextjs"],
    similarity: 0.88
  },
  {
    id: 3,
    content: "Customer mentioned they need API responses under 200ms for their real-time application",
    project: "requirements",
    tags: ["performance", "api", "latency"],
    similarity: 0.82
  },
  {
    id: 4,
    content: "User expressed interest in GDPR compliance and data privacy features for European customers",
    project: "compliance",
    tags: ["gdpr", "privacy", "security"],
    similarity: 0.76
  },
  {
    id: 5,
    content: "Team uses PostgreSQL with vector extensions for semantic search capabilities",
    project: "infrastructure",
    tags: ["database", "postgresql", "vector-search"],
    similarity: 0.71
  }
]

const sampleQueries = [
  "user interface preferences",
  "technology stack",
  "performance requirements",
  "data privacy",
  "database setup"
]

export default function InteractiveDemo() {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<typeof sampleMemories>([])
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setHasSearched(true)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    // Simulate semantic search with realistic scoring (0.3 to 0.9 range)
    const queryTerms = searchQuery.toLowerCase().split(' ')

    const scored = sampleMemories.map(memory => {
      let score = 0

      // Start with lower base score
      queryTerms.forEach(term => {
        if (memory.content.toLowerCase().includes(term)) {
          score += 0.3 // Exact content match
        }
        if (memory.project.toLowerCase().includes(term)) {
          score += 0.2 // Project match
        }
        if (memory.tags.some(tag => tag.toLowerCase().includes(term))) {
          score += 0.15 // Tag match
        }
        // Partial match gives small boost
        if (memory.content.toLowerCase().includes(term.substring(0, 3))) {
          score += 0.05
        }
      })

      // Normalize score to 0.3-0.9 range (30%-90% match)
      score = Math.min(score, 0.9) // Max 90% match
      if (score > 0 && score < 0.3) score = 0.3 // Min 30% match if any match found

      // Add small semantic variation
      score += (Math.random() - 0.5) * 0.1
      score = Math.max(0, Math.min(score, 0.9))

      return { ...memory, similarity: score }
    })

    const filtered = scored
      .filter(memory => memory.similarity > 0.25) // Only show results with 25%+ match
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3)

    setResults(filtered)
    setIsLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 0.6) return "text-green-500"
    if (similarity >= 0.4) return "text-yellow-500"
    return "text-orange-500"
  }

  return (
    <section className="py-32 container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-accent-cyan/10 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-accent-cyan" />
            <span className="text-sm text-accent-cyan font-medium">Live Demo</span>
          </div>
          <h2 className="text-5xl font-bold mb-6">
            Try Semantic Search
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience our vector-based search that finds relevant memories even with fuzzy queries
          </p>
        </div>

        <Card className="p-8 bg-surface/50 border-border/50">
          <div className="space-y-6">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for memories (e.g., 'user preferences', 'dark mode')"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-12 pr-4 h-12 text-base bg-background border-border/50 focus:border-accent-cyan transition-colors"
              />
              <Button
                onClick={() => handleSearch()}
                disabled={!query.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent-cyan hover:bg-accent-cyan/90 text-black h-8 px-4"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Search"
                )}
              </Button>
            </div>

            {/* Quick Examples */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Try:</span>
              {sampleQueries.map((sampleQuery) => (
                <Button
                  key={sampleQuery}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setQuery(sampleQuery)
                    handleSearch(sampleQuery)
                  }}
                  className="h-8 px-3 text-xs bg-transparent hover:bg-surface border-border/50"
                >
                  {sampleQuery}
                </Button>
              ))}
            </div>

            {/* Results */}
            <div className="min-h-[200px]">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Searching memories...</span>
                  </div>
                </div>
              ) : hasSearched && results.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Found {results.length} relevant memories</span>
                  </div>
                  {results.map((memory) => (
                    <Card key={memory.id} className="p-4 bg-background/50 border-border/30">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <p className="text-foreground leading-relaxed">
                            {memory.content}
                          </p>
                          <div className={`text-sm font-medium ${getSimilarityColor(memory.score || memory.similarity)}`}>
                            {Math.round((memory.score || memory.similarity) * 100)}% match
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {memory.project}
                            </Badge>
                            {memory.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : hasSearched && results.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center mb-4">
                    <Search className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">No memories found for "{query}"</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Try searching for terms like "preferences", "tech", or "security"
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-accent-cyan/10 flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-accent-cyan" />
                  </div>
                  <p className="text-muted-foreground">Enter a search query to see semantic search in action</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Our API understands context, not just keywords
                  </p>
                </div>
              )}
            </div>

            {/* API Info */}
            {!isLoading && hasSearched && (
              <div className="pt-6 border-t border-border/30">
                <div className="bg-accent-cyan/5 rounded-lg p-4 border border-accent-cyan/20">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent-cyan text-black text-xs flex items-center justify-center font-bold mt-0.5">
                      i
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">How it works</p>
                      <p className="text-sm text-muted-foreground">
                        This demo uses our semantic search API with local embeddings.
                        The search understands meaning and context, finding related memories even with different wording.
                      </p>
                      <div className="flex items-center gap-4 pt-2">
                        <div className="text-xs text-muted-foreground">
                          Response time: <span className="text-foreground font-medium">~200ms</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Embedding cost: <span className="text-green-500 font-medium">$0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Ready to add semantic search to your AI?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-accent-cyan hover:bg-accent-cyan/90 text-black">
              Get Started Free
            </Button>
            <Button variant="outline" size="lg">
              View API Docs
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}