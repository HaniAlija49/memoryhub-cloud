"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Copy, Eye, EyeOff, RefreshCw, AlertCircle } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useApi } from "@/hooks/use-api"
import { AuthService } from "@/services"
import { copyToClipboard } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ApiKeysPage() {
  const api = useApi()
  const { toast } = useToast()
  const [isRegenerating, setIsRegenerating] = useState(false)

  const handleRegenerate = async () => {
    if (!confirm('Are you sure you want to regenerate your API key? This will invalidate your current key.')) {
      return
    }

    setIsRegenerating(true)
    const result = await AuthService.regenerateApiKey()
    setIsRegenerating(false)

    if (result) {
      toast({
        title: 'Success',
        description: 'API key regenerated successfully',
      })
      // Force page reload to get new key
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
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">API Keys</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your API key for Memory Layer integration</p>
          </div>
          <Button
            onClick={handleRegenerate}
            disabled={!api.isReady || isRegenerating}
            className="bg-white text-black hover:bg-gray-200"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRegenerating ? 'animate-spin' : ''}`} />
            {isRegenerating ? 'Regenerating...' : 'Regenerate Key'}
          </Button>
        </div>

        {api.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{api.error}</AlertDescription>
          </Alert>
        )}

        <ApiKeyDisplay apiKey={api.apiKey} isLoading={api.isLoading} />

        <ApiKeyUsageGuide />
      </div>
    </DashboardLayout>
  )
}

function ApiKeyDisplay({ apiKey, isLoading }: { apiKey: string | null; isLoading: boolean }) {
  const [isVisible, setIsVisible] = useState(false)
  const { toast } = useToast()

  const handleCopyKey = async () => {
    if (!apiKey) return
    const success = await copyToClipboard(apiKey)
    if (success) {
      toast({
        title: "API key copied",
        description: "The API key has been copied to your clipboard",
      })
    }
  }

  const maskKey = (key: string) => {
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
        <p className="text-muted-foreground">No API key available</p>
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
            {isVisible ? apiKey : maskKey(apiKey)}
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

function ApiKeyUsageGuide() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Using Your API Key</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Use your API key to authenticate requests to the Memory Layer API. Include it in the Authorization header of your requests.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-foreground mb-2">cURL Example</h3>
          <pre className="bg-surface p-4 rounded-md overflow-x-auto">
            <code className="text-xs text-muted-foreground font-mono">
{`curl -X POST https://your-backend.onrender.com/api/memory \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"content": "My first memory", "project": "demo"}'`}
            </code>
          </pre>
        </div>

        <div>
          <h3 className="text-sm font-medium text-foreground mb-2">JavaScript/TypeScript Example</h3>
          <pre className="bg-surface p-4 rounded-md overflow-x-auto">
            <code className="text-xs text-muted-foreground font-mono">
{`const apiKey = 'YOUR_API_KEY'
const apiUrl = 'https://your-backend.onrender.com'

const response = await fetch(\`\${apiUrl}/api/memory\`, {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${apiKey}\`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    content: 'My first memory',
    project: 'demo',
  }),
})

const data = await response.json()
console.log(data)`}
            </code>
          </pre>
        </div>

        <div>
          <h3 className="text-sm font-medium text-foreground mb-2">Python Example</h3>
          <pre className="bg-surface p-4 rounded-md overflow-x-auto">
            <code className="text-xs text-muted-foreground font-mono">
{`import requests

api_key = 'YOUR_API_KEY'
api_url = 'https://your-backend.onrender.com'

response = requests.post(
    f'{api_url}/api/memory',
    headers={
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json',
    },
    json={
        'content': 'My first memory',
        'project': 'demo',
    },
)

data = response.json()
print(data)`}
            </code>
          </pre>
        </div>
      </div>

      <div className="border border-border rounded-lg p-6 bg-surface/30">
        <h3 className="text-sm font-medium text-foreground mb-2">API Endpoints</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><code className="text-xs bg-surface px-2 py-1 rounded">POST /api/memory</code> - Create a memory</li>
          <li><code className="text-xs bg-surface px-2 py-1 rounded">GET /api/memory/list</code> - List all memories</li>
          <li><code className="text-xs bg-surface px-2 py-1 rounded">POST /api/memory/search</code> - Semantic search</li>
          <li><code className="text-xs bg-surface px-2 py-1 rounded">GET /api/memory/stats</code> - Get statistics</li>
          <li><code className="text-xs bg-surface px-2 py-1 rounded">DELETE /api/memory/:id</code> - Delete a memory</li>
        </ul>
      </div>
    </div>
  )
}
