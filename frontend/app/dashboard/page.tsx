"use client"

import { useEffect, useState } from "react"
import { useApi } from "@/hooks/use-api"
import { StatsService, MemoryService, type Memory } from "@/services"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Database, Folder, Clock, TrendingUp, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { McpPromptCard } from "@/components/mcp-prompt-card"

export default function DashboardPage() {
  const api = useApi()
  const [isLoading, setIsLoading] = useState(true)
  const [metrics, setMetrics] = useState({
    totalMemories: 0,
    totalProjects: 0,
    recentActivity: 0,
    topProject: null as { name: string; count: number } | null,
  })
  const [recentMemories, setRecentMemories] = useState<Memory[]>([])
  const [projectStats, setProjectStats] = useState<Array<{ name: string; count: number }>>([])

  useEffect(() => {
    if (api.isReady) {
      loadDashboardData()
    }
  }, [api.isReady])

  const loadDashboardData = async () => {
    setIsLoading(true)

    // Load metrics
    const metricsData = await StatsService.getDashboardMetrics()
    setMetrics(metricsData)

    // Load recent memories
    const recentData = await StatsService.getRecentMemories(5)
    // Convert to Memory format
    const memories: Memory[] = recentData.map((m) => ({
      id: m.id,
      userId: '',
      content: m.content,
      project: m.project,
      metadata: null,
      createdAt: m.createdAt,
    }))
    setRecentMemories(memories)

    // Load project stats
    const projectData = await StatsService.getProjectStats()
    setProjectStats(projectData.projects.slice(0, 5))

    setIsLoading(false)
  }

  // Show loading state
  if (api.isLoading) {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-2">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (api.error) {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <div className="flex items-center justify-center h-64">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{api.error}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  // Show "Generate API Key" state
  if (!api.hasApiKey) {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <div className="flex items-center justify-center h-64">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Welcome to PersistQ!</CardTitle>
              <CardDescription>
                You need to generate an API key to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Click the "API Keys" link in the sidebar to generate your first API key.
                This will activate your account and allow you to store memories.
              </p>
              <Link href="/dashboard/api-keys">
                <button className="w-full px-4 py-2 bg-gradient-to-r from-accent-cyan to-accent-purple text-white rounded-lg hover:opacity-90 transition-opacity">
                  Generate API Key →
                </button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Overview of your memory storage</p>
        </div>
      </div>

      {/* Metrics Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-surface rounded w-1/2"></div>
                  <div className="h-8 bg-surface rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Memories"
            value={metrics.totalMemories}
            icon={<Database className="w-5 h-5 text-accent-cyan" />}
            description="Stored memories"
          />
          <MetricCard
            title="Projects"
            value={metrics.totalProjects}
            icon={<Folder className="w-5 h-5 text-accent-purple" />}
            description="Unique projects"
          />
          <MetricCard
            title="Recent Activity"
            value={metrics.recentActivity}
            icon={<TrendingUp className="w-5 h-5 text-green-400" />}
            description="Recent memories"
          />
          {metrics.topProject && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Project</CardTitle>
                <Folder className="w-5 h-5 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.topProject.name}</div>
                <p className="text-xs text-muted-foreground">
                  {metrics.topProject.count} {metrics.topProject.count === 1 ? 'memory' : 'memories'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Memories */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Memories</CardTitle>
              <Link
                href="/dashboard/memories"
                className="text-xs text-accent-cyan hover:underline"
              >
                View all
              </Link>
            </div>
            <CardDescription>Your most recently created memories</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse space-y-2">
                    <div className="h-4 bg-surface rounded"></div>
                    <div className="h-3 bg-surface rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : recentMemories.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No memories yet. <Link href="/dashboard/memories" className="text-accent-cyan hover:underline">Create your first memory</Link>
              </p>
            ) : (
              <div className="space-y-4">
                {recentMemories.map((memory) => (
                  <div key={memory.id} className="space-y-1">
                    <p className="text-sm text-foreground line-clamp-2">{memory.content}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{formatDistanceToNow(new Date(memory.createdAt), { addSuffix: true })}</span>
                      {memory.project && (
                        <Badge variant="secondary" className="text-xs">
                          {memory.project}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Project Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>Memories by project</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex items-center justify-between">
                    <div className="h-4 bg-surface rounded w-1/3"></div>
                    <div className="h-4 bg-surface rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            ) : projectStats.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No projects yet
              </p>
            ) : (
              <div className="space-y-4">
                {projectStats.map((project, index) => {
                  const total = metrics.totalMemories
                  const percentage = total > 0 ? (project.count / total) * 100 : 0

                  return (
                    <div key={project.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{project.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {project.count} ({Math.round(percentage)}%)
                        </span>
                      </div>
                      <div className="h-2 bg-surface rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-accent-cyan to-accent-purple"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* MCP Integration */}
      <McpPromptCard
        apiKey={api.apiKey}
        apiUrl={process.env.NEXT_PUBLIC_API_URL}
      />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
          <CardDescription>Get started with PersistQ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <QuickActionCard
              title="Create Memory"
              description="Add a new memory to your storage"
              href="/dashboard/memories"
              action="Create"
            />
            <QuickActionCard
              title="View API Keys"
              description="Manage your API authentication keys"
              href="/dashboard/api-keys"
              action="View"
            />
            <QuickActionCard
              title="Documentation"
              description="Learn how to integrate PersistQ"
              href="/docs"
              action="Read"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function MetricCard({
  title,
  value,
  icon,
  description,
}: {
  title: string
  value: number
  icon: React.ReactNode
  description: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function QuickActionCard({
  title,
  description,
  href,
  action,
}: {
  title: string
  description: string
  href: string
  action: string
}) {
  return (
    <Link href={href}>
      <Card className="hover:border-accent-cyan/50 transition-colors cursor-pointer h-full">
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-accent-cyan hover:underline">{action} →</p>
        </CardContent>
      </Card>
    </Link>
  )
}
