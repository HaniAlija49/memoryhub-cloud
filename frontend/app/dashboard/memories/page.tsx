"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Grid3x3, List, Plus, MoreVertical, Tag, Calendar, LinkIcon, X, Loader2, AlertCircle, RefreshCw, Upload } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import { useApi } from "@/hooks/use-api"
import { MemoryService, type Memory } from "@/services"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DocumentUploadModal } from "@/components/document-upload-modal"
import { useTrackEvent } from "@/lib/analytics"

export default function MemoriesPage() {
  const api = useApi()
  const { toast } = useToast()
  const trackEvent = useTrackEvent()

  const [view, setView] = useState<"list" | "grid">("list")
  const [selectedGroup, setSelectedGroup] = useState("All Memories")
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newMemory, setNewMemory] = useState({
    content: "",
    group: "",
    tags: "",
  })
  const [isCreatingNewGroup, setIsCreatingNewGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all")
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  // Real data from API
  const [memories, setMemories] = useState<Memory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  // Load memories when API is ready
  useEffect(() => {
    if (api.isReady) {
      loadMemories()
    }
  }, [api.isReady])

  const loadMemories = async () => {
    setIsLoading(true)
    const result = await MemoryService.list({
      limit: 100,
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

  const handleRefresh = () => {
    loadMemories()
  }

const handleDocumentUploadSuccess = (chunksCount: number) => {
    // Track document upload
    trackEvent('document_uploaded')
    
    toast({
      title: "Document processed successfully!",
      description: `Created ${chunksCount} memories from your document.`,
    })
    loadMemories()
  }

  // Extract groups from memories (using project field)
  const memoryGroups = [
    {
      name: "All Memories",
      count: memories.length,
      color: "text-foreground"
    },
    ...Array.from(new Set(memories.map(m => m.project).filter(Boolean)))
      .map(project => ({
        name: project as string,
        count: memories.filter(m => m.project === project).length,
        color: "text-accent-cyan"
      }))
  ]

  // Extract all unique tags from metadata
  const allTags = Array.from(
    new Set(
      memories
        .flatMap(m => m.metadata?.tags || [])
        .filter(Boolean)
    )
  ) as string[]

  const filteredMemories = memories.filter((memory) => {
    const matchesGroup = selectedGroup === "All Memories" || memory.project === selectedGroup
    const matchesSearch =
      searchQuery === "" ||
      memory.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (memory.metadata?.tags as string[] || []).some((tag: string) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )

    const memoryTags = (memory.metadata?.tags as string[] || [])
    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => memoryTags.includes(tag))

    const matchesDate = (() => {
      if (dateFilter === "all") return true
      const memoryDate = new Date(memory.createdAt)
      const now = new Date()
      const daysDiff = Math.floor((now.getTime() - memoryDate.getTime()) / (1000 * 60 * 60 * 24))

      if (dateFilter === "today") return daysDiff === 0
      if (dateFilter === "week") return daysDiff <= 7
      if (dateFilter === "month") return daysDiff <= 30
      return true
    })()

    return matchesGroup && matchesSearch && matchesTags && matchesDate
  })

  const handleGroupChange = (value: string) => {
    if (value === "create_new") {
      setIsCreatingNewGroup(true)
      setNewGroupName("")
    } else {
      setIsCreatingNewGroup(false)
      setNewMemory({ ...newMemory, group: value })
    }
  }

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) {
      toast({
        title: "Error",
        description: "Group name cannot be empty",
        variant: "destructive",
      })
      return
    }

    setNewMemory({ ...newMemory, group: newGroupName.trim() })
    setIsCreatingNewGroup(false)
    setNewGroupName("")

    toast({
      title: "Group ready",
      description: `"${newGroupName.trim()}" will be created with the memory`,
    })
  }

  const handleAddMemory = async () => {
    if (!newMemory.content.trim()) {
      toast({
        title: "Error",
        description: "Memory content cannot be empty",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)

    // Parse tags
    const tags = newMemory.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)

    const memoryId = await MemoryService.create({
      content: newMemory.content.trim(),
      project: newMemory.group.trim() || undefined,
      metadata: tags.length > 0 ? { tags } : undefined
    })

    setIsCreating(false)

if (memoryId) {
      // Track memory creation
      trackEvent('memory_created')
      
      toast({
        title: "Memory created",
        description: "Your memory has been successfully stored",
      })

      setIsAddDialogOpen(false)
      setNewMemory({ content: "", group: "", tags: "" })
      setIsCreatingNewGroup(false)
      setNewGroupName("")

      // Reload memories
      loadMemories()
    } else {
      toast({
        title: "Error",
        description: "Failed to create memory",
        variant: "destructive",
      })
    }
  }

const handleDelete = async (id: string) => {
    const success = await MemoryService.delete(id)
    if (success) {
      // Track memory deletion
      trackEvent('memory_deleted')
      
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

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const clearFilters = () => {
    setSelectedTags([])
    setDateFilter("all")
  }

  const hasActiveFilters = selectedTags.length > 0 || dateFilter !== "all"

  if (!api.isReady) {
    return (
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
    )
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Memories</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage and visualize your stored memories</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={() => setIsUploadModalOpen(true)}
              variant="outline"
              size="sm"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-accent-cyan text-background hover:bg-accent-cyan/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Memory
            </Button>
          </div>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search memories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-surface border-border"
            />
          </div>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="border-border bg-transparent relative">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                  {hasActiveFilters && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent-cyan text-[10px] font-medium flex items-center justify-center text-background">
                      {selectedTags.length + (dateFilter !== "all" ? 1 : 0)}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-surface border-border" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm text-foreground">Filters</h4>
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                      >
                        Clear all
                      </Button>
                    )}
                  </div>

                  {/* Date filter */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Date Range</Label>
                    <Select value={dateFilter} onValueChange={(value: any) => setDateFilter(value)}>
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">Last 7 days</SelectItem>
                        <SelectItem value="month">Last 30 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tags filter */}
                  {allTags.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Tags</Label>
                      <div className="flex flex-wrap gap-2">
                        {allTags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className={cn(
                              "cursor-pointer transition-colors",
                              selectedTags.includes(tag)
                                ? "bg-accent-cyan/20 border-accent-cyan text-accent-cyan"
                                : "hover:bg-accent-hover",
                            )}
                            onClick={() => toggleTag(tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
            <div className="flex items-center gap-1 rounded-md border border-border bg-surface p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setView("list")}
                className={cn("h-7 px-2", view === "list" && "bg-accent-hover")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setView("grid")}
                className={cn("h-7 px-2", view === "grid" && "bg-accent-hover")}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">Active filters:</span>
            {dateFilter !== "all" && (
              <Badge variant="outline" className="gap-1">
                {dateFilter === "today" && "Today"}
                {dateFilter === "week" && "Last 7 days"}
                {dateFilter === "month" && "Last 30 days"}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setDateFilter("all")} />
              </Badge>
            )}
            {selectedTags.map((tag) => (
              <Badge key={tag} variant="outline" className="gap-1">
                {tag}
                <X className="h-3 w-3 cursor-pointer" onClick={() => toggleTag(tag)} />
              </Badge>
            ))}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          {/* Sidebar - Groups */}
          <div className="space-y-2">
            <h3 className="text-xs font-medium text-muted-foreground px-2 mb-3">MEMORY GROUPS</h3>
            {memoryGroups.map((group) => (
              <button
                key={group.name}
                onClick={() => setSelectedGroup(group.name)}
                className={cn(
                  "w-full flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                  selectedGroup === group.name
                    ? "bg-accent-hover text-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent-hover hover:text-foreground",
                )}
              >
                <span className={group.color}>{group.name}</span>
                <span className="text-xs text-muted-foreground">{group.count}</span>
              </button>
            ))}
          </div>

          {/* Main content */}
          <div>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredMemories.length === 0 ? (
              <div className="rounded-lg border border-border bg-surface p-12 text-center">
                <p className="text-muted-foreground">
                  {searchQuery || hasActiveFilters ? 'No memories found matching your filters.' : 'No memories yet. Create your first memory!'}
                </p>
              </div>
            ) : (
              <div
                className={cn("gap-4", view === "grid" ? "grid grid-cols-1 md:grid-cols-2" : "flex flex-col space-y-3")}
              >
                {filteredMemories.map((memory) => {
                  const memoryTags = (memory.metadata?.tags as string[] || [])
                  return (
                    <div
                      key={memory.id}
                      className="group rounded-lg border border-border bg-surface p-4 hover:border-accent-cyan/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 space-y-2">
                          <p className="text-sm text-foreground leading-relaxed">{memory.content}</p>
                          <div className="flex flex-wrap items-center gap-2">
                            {memory.project && (
                              <Badge variant="outline" className="text-xs border-accent-cyan/30 text-accent-cyan">
                                {memory.project}
                              </Badge>
                            )}
                            {memoryTags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(memory.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="text-red-500" onClick={() => handleDelete(memory.id)}>
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-surface border-border sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Memory</DialogTitle>
            <DialogDescription>Store a new memory that can be retrieved by AI agents</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="content">Memory Content</Label>
              <Textarea
                id="content"
                placeholder="Enter the memory content..."
                value={newMemory.content}
                onChange={(e) => setNewMemory({ ...newMemory, content: e.target.value })}
                className="min-h-[120px] bg-background border-border resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="group">Group</Label>
              {!isCreatingNewGroup ? (
                <Select value={newMemory.group} onValueChange={handleGroupChange}>
                  <SelectTrigger id="group" className="bg-background border-border">
                    <SelectValue placeholder="Select a group (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {memoryGroups
                      .filter((g) => g.name !== "All Memories")
                      .map((group) => (
                        <SelectItem key={group.name} value={group.name}>
                          {group.name}
                        </SelectItem>
                      ))}
                    <SelectItem value="create_new" className="text-accent-cyan">
                      <Plus className="h-3 w-3 inline mr-1" />
                      Create new group...
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter group name..."
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleCreateGroup()
                      } else if (e.key === "Escape") {
                        setIsCreatingNewGroup(false)
                        setNewGroupName("")
                      }
                    }}
                    className="bg-background border-border"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    onClick={handleCreateGroup}
                    className="bg-accent-cyan text-background hover:bg-accent-cyan/90"
                  >
                    Add
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsCreatingNewGroup(false)
                      setNewGroupName("")
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
              {isCreatingNewGroup && (
                <p className="text-xs text-muted-foreground">Press Enter to create or Escape to cancel</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="ui, design, work (comma separated)"
                value={newMemory.tags}
                onChange={(e) => setNewMemory({ ...newMemory, tags: e.target.value })}
                className="bg-background border-border"
              />
              <p className="text-xs text-muted-foreground">Separate tags with commas</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isCreating}>
              Cancel
            </Button>
            <Button
              onClick={handleAddMemory}
              className="bg-accent-cyan text-background hover:bg-accent-cyan/90"
              disabled={isCreating}
            >
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
        </DialogContent>
      </Dialog>

      <DocumentUploadModal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        onSuccess={handleDocumentUploadSuccess}
      />
    </>
  )
}
