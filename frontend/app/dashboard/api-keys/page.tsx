"use client"

import { Button } from "@/components/ui/button"
import { Copy, Eye, EyeOff, RefreshCw, AlertCircle } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useApi } from "@/hooks/use-api"
import { AuthService } from "@/services"
import { copyToClipboard } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { McpConfigTabs } from "@/components/mcp-config-tabs"
import { useTrackEvent } from "@/lib/analytics"

export default function ApiKeysPage() {
  const api = useApi()
  const { toast } = useToast()
  const trackEvent = useTrackEvent()
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

const handleGenerate = async () => {
    setIsGenerating(true)
    const result = await AuthService.generateApiKey()
    setIsGenerating(false)

    if (result) {
      // Track API key generation
      trackEvent('api_key_generated')
      
      toast({
        title: 'API Key Generated!',
        description: 'Your API key is ready to use',
      })
      window.location.reload()
    } else {
      toast({
        title: 'Error',
        description: 'Failed to generate API key',
        variant: 'destructive',
      })
    }
  }

  const handleRegenerate = async () => {
    if (!confirm('Are you sure you want to regenerate your API key?\n\nThis will invalidate your current key immediately and require you to update all your applications.')) {
      return
    }

    setIsRegenerating(true)
    const result = await AuthService.regenerateApiKey()
    setIsRegenerating(false)

if (result) {
      // Track API key regeneration
      trackEvent('api_key_regenerated')
      
      toast({
        title: 'API Key Regenerated!',
        description: 'Your new API key is ready to use',
      })
      window.location.reload()
    } else {
      toast({
        title: 'Error',
        description: 'Failed to regenerate API key',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">API Keys</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your API key for PersistQ integration</p>
          </div>
          {api.hasApiKey ? (
            <Button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="bg-white text-black hover:bg-gray-200"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRegenerating ? 'animate-spin' : ''}`} />
              {isRegenerating ? 'Regenerating...' : 'Regenerate Key'}
            </Button>
          ) : (
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-gradient-to-r from-accent-cyan to-accent-purple text-white hover:opacity-90"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Generating...' : 'Generate API Key'}
            </Button>
          )}
        </div>

        {api.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{api.error}</AlertDescription>
          </Alert>
        )}

        <ApiKeyDisplay apiKey={api.apiKey} isLoading={api.isLoading} />

        <McpConfigTabs
          apiKey={api.apiKey}
          apiUrl={process.env.NEXT_PUBLIC_API_URL}
        />

        <DocumentationRedirect />
    </div>
  )
}

function ApiKeyDisplay({ apiKey, isLoading }: { apiKey: string | null; isLoading: boolean }) {
  const [isVisible, setIsVisible] = useState(false) // Hidden by default for security
  const { toast } = useToast()

const handleCopyKey = async () => {
    if (!apiKey) return
    const success = await copyToClipboard(apiKey)
    if (success) {
      // Track API key copy
      trackEvent('api_key_copied')
      
      toast({
        title: "API key copied",
        description: "The API key has been copied to your clipboard",
      })
    }
  }

  const maskKey = (key: string) => {
    // Always mask the middle portion for security when not visible
    return key.slice(0, 12) + "•".repeat(40) + key.slice(-8)
  }

  if (isLoading) {
    return (
      <div className="border border-border rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-surface rounded w-1/4"></div>
          <div className="h-8 bg-surface rounded"></div>
        </div>
      </div>
    )
  }

  if (!apiKey) {
    return (
      <div className="border border-border rounded-lg p-6">
        <div className="text-center space-y-4 py-8">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto" />
          <div>
            <h3 className="text-lg font-medium text-foreground mb-2">No API Key Yet</h3>
            <p className="text-sm text-muted-foreground">
              Click the "Generate API Key" button above to create your first API key.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="bg-surface/30 border-b border-border px-6 py-3">
        <h3 className="text-sm font-medium text-foreground">Your API Key</h3>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-4">
          <code className="flex-1 text-sm font-mono bg-surface px-4 py-3 rounded-md text-foreground">
            {isVisible ? apiKey : maskKey(apiKey!)}
          </code>
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="p-2 hover:bg-surface rounded-md transition-colors"
            title={isVisible ? "Hide key" : "Show key"}
          >
            {isVisible ? (
              <EyeOff className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Eye className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
          <button
            onClick={handleCopyKey}
            className="p-2 hover:bg-surface rounded-md transition-colors"
            title="Copy key"
          >
            <Copy className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Keep your API key secure and never share it publicly. If compromised, regenerate it immediately.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}

function DocumentationRedirect() {
  return (
    <div className="space-y-6">
      <div className="border border-border rounded-lg p-6 bg-surface/30">
        <h2 className="text-xl font-semibold text-foreground mb-4">API Documentation</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Ready to use your API key? We have comprehensive documentation to help you get started quickly.
        </p>
        
        <div className="grid md:grid-cols-2 gap-4">
          <a 
            href="/docs/getting-started"
            className="block p-4 rounded-lg border border-border bg-background hover:border-accent-cyan transition-colors"
          >
            <h3 className="font-semibold mb-2 text-accent-cyan">🚀 Getting Started</h3>
            <p className="text-sm text-muted-foreground">
              Learn how to integrate PersistQ into your application in under 5 minutes
            </p>
          </a>
          
          <a 
            href="/docs/api-reference"
            className="block p-4 rounded-lg border border-border bg-background hover:border-accent-purple transition-colors"
          >
            <h3 className="font-semibold mb-2 text-accent-purple">📚 API Reference</h3>
            <p className="text-sm text-muted-foreground">
              Complete reference for all REST API endpoints and usage examples
            </p>
          </a>
        </div>
        
        <div className="mt-4 p-4 rounded-lg border border-accent-cyan/30 bg-accent-cyan/5">
          <p className="text-sm">
            <strong className="text-accent-cyan">Quick Tip:</strong> Your API key starts with <code className="bg-background px-2 py-1 rounded text-xs">pq_</code> and should be kept secure.
          </p>
        </div>
      </div>
    </div>
  )
}
