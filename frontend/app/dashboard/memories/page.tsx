"use client"

import { useState, useEffect, useMemo } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Trash2, RefreshCw, AlertCircle, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useApi } from "@/hooks/use-api"
import { MemoryService, type Memory } from "@/services"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatDistanceToNow } from "date-fns"

export default function MemoriesPage() {
  const api = useApi()
  const { toast } = useToast()

  const [memories, setMemories] = useState<Memory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [projects, setProjects] = useState<string[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // Load memories when API is ready
  useEffect(() => {
    if (api.isReady) {
      loadMemories()
      loadProjects()
    }
  }, [api.isReady])

  const loadMemories = async (project?: string) => {
    setIsLoading(true)
    const result = await MemoryService.list({
      limit: 100,
      project: project || undefined,
    })
    setIsLoading(false)

    if (result) {
      setMemories(result.memories)
    } else {
      toast({
        title: 'Error',
        description: 'Failed to load memories',
        variant: 'destructive',
      })
    }
  }

  const loadProjects = async () => {
    const projectList = await MemoryService.getProjects()
    setProjects(projectList)
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadMemories(selectedProject || undefined)
      return
    }

    setIsSearching(true)
    const results = await MemoryService.search({
      query: searchQuery,
      limit: 50,
      project: selectedProject || undefined,
    })
    setIsSearching(false)

    if (results) {
      // Convert search results to Memory format
      setMemories(
        results.map((r) => ({
          id: r.id,
          userId: '',
          content: r.content,
          project: r.project,
          metadata: r.metadata,
          createdAt: r.createdAt,
        }))
      )
    }
  }

  const handleProjectFilter = (project: string | null) => {
    setSelectedProject(project)
    loadMemories(project || undefined)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this memory?')) {
      return
    }

    const success = await MemoryService.delete(id)
    if (success) {
      setMemories(memories.filter((m) => m.id !== id))
      toast({
        title: 'Success',
        description: 'Memory deleted successfully',
      })
    } else {
      toast({
        title: 'Error',
        description: 'Failed to delete memory',
        variant: 'destructive',
      })
    }
  }

  const handleRefresh = () => {
    loadMemories(selectedProject || undefined)
  }

  if (!api.isReady) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          {api.isLoading ? (
            <div className="text-center space-y-2">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">Connecting to API...</p>
            </div>
          ) : (
            <Alert variant="destructive" className="max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{api.error}</AlertDescription>
            </Alert>
          )}
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Memories</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {memories.length} {memories.length === 1 ? 'memory' : 'memories'} stored
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Memory
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1 flex gap-2">
                <Input
                  placeholder="Search memories semantically..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button onClick={handleSearch} disabled={isSearching}>
                  {isSearching ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <select
                value={selectedProject || 'all'}
                onChange={(e) => handleProjectFilter(e.target.value === 'all' ? null : e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="all">All Projects</option>
                {projects.map((project) => (
                  <option key={project} value={project}>
                    {project}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Memories List */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : memories.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {searchQuery ? 'No memories found matching your search.' : 'No memories yet. Create your first memory!'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {memories.map((memory) => (
              <MemoryCard key={memory.id} memory={memory} onDelete={handleDelete} />
            ))}
          </div>
        )}

        {/* Add Memory Dialog */}
        <AddMemoryDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSuccess={() => {
            loadMemories(selectedProject || undefined)
            loadProjects()
          }}
          projects={projects}
        />
      </div>
    </DashboardLayout>
  )
}

function MemoryCard({ memory, onDelete }: { memory: Memory; onDelete: (id: string) => void }) {
  return (
    <Card className="hover:border-accent-cyan/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <p className="text-foreground">{memory.content}</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{formatDistanceToNow(new Date(memory.createdAt), { addSuffix: true })}</span>
              {memory.project && (
                <Badge variant="secondary" className="text-xs">
                  {memory.project}
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(memory.id)}
            className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function AddMemoryDialog({
  open,
  onOpenChange,
  onSuccess,
  projects,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  projects: string[]
}) {
  const { toast } = useToast()
  const [content, setContent] = useState('')
  const [project, setProject] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      toast({
        title: 'Error',
        description: 'Memory content is required',
        variant: 'destructive',
      })
      return
    }

    setIsCreating(true)
    const memoryId = await MemoryService.create({
      content: content.trim(),
      project: project.trim() || undefined,
    })
    setIsCreating(false)

    if (memoryId) {
      toast({
        title: 'Success',
        description: 'Memory created successfully',
      })
      setContent('')
      setProject('')
      onOpenChange(false)
      onSuccess()
    } else {
      toast({
        title: 'Error',
        description: 'Failed to create memory',
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Memory</DialogTitle>
          <DialogDescription>Create a new memory that will be stored persistently.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Enter the memory content..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project">Project (Optional)</Label>
              <Input
                id="project"
                placeholder="e.g., my-app, research, personal"
                value={project}
                onChange={(e) => setProject(e.target.value)}
                list="projects"
              />
              <datalist id="projects">
                {projects.map((p) => (
                  <option key={p} value={p} />
                ))}
              </datalist>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isCreating}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Memory'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
