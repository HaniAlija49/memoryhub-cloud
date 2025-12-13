# PersistQ SDK

> Official TypeScript/JavaScript SDK for PersistQ - AI-powered persistent memory storage

[![npm version](https://img.shields.io/npm/v/persistq-sdk.svg)](https://www.npmjs.com/package/persistq-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- ✅ **Full TypeScript support** with complete type definitions
- ✅ **Works in Node.js and browsers** - Universal package
- ✅ **Zero runtime dependencies** - Uses native `fetch` API
- ✅ **Semantic search** with vector embeddings
- ✅ **Project-based organization** - Organize memories by project/topic
- ✅ **API key + Clerk authentication** - Flexible authentication options
- ✅ **Billing/subscription management** - Complete payment integration
- ✅ **ESM and CommonJS support** - Maximum compatibility
- ✅ **Tree-shakeable** - Optimal bundle size

## Installation

```bash
npm install persistq-sdk
```

Or with yarn:

```bash
yarn add persistq-sdk
```

Or with pnpm:

```bash
pnpm add persistq-sdk
```

## Quick Start

```typescript
import { createClient } from '@memoryhub/sdk'

// Create a client instance
const client = createClient({
  baseUrl: 'https://your-backend.onrender.com',
  apiKey: 'your-api-key-here',
})

// Create a memory
const result = await client.createMemory(
  'Meeting notes: Discussed Q4 roadmap and new features',
  'work-meetings',
  { tags: ['important', 'roadmap'] }
)

if (result.status === 'success') {
  console.log('Memory created:', result.data?.memoryId)
}

// Search memories semantically
const searchResults = await client.searchMemories('roadmap features', {
  limit: 5,
  project: 'work-meetings',
  threshold: 0.7,
})

if (searchResults.status === 'success') {
  searchResults.data?.forEach(memory => {
    console.log(`${memory.content} (similarity: ${memory.similarity})`)
  })
}

// List all memories with pagination
const memories = await client.listMemories({
  limit: 10,
  offset: 0,
  project: 'work-meetings',
})
```

## Configuration

### Creating a Client

```typescript
import { createClient, PersistQClient } from 'persistq-sdk'

// Option 1: With API key
const client = createClient({
  baseUrl: 'https://your-backend.onrender.com',
  apiKey: 'mh_your_api_key_here',
})

// Option 2: Without API key (set later)
const client = createClient({
  baseUrl: 'https://your-backend.onrender.com',
})

// Set API key later
client.setApiKey('mh_your_api_key_here')

// For Clerk-authenticated routes
client.setClerkToken(await getToken())
```

### Environment Variables

For frontend applications (Next.js, Vite, etc.):

```env
VITE_API_URL=https://your-backend.onrender.com
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

## API Reference

### Memory Operations

#### `createMemory(content, project?, metadata?)`

Create a new memory.

```typescript
const result = await client.createMemory(
  'User prefers dark mode and TypeScript',
  'user-preferences',
  { category: 'settings' }
)
```

**Parameters:**
- `content` (string, required) - The memory content
- `project` (string, optional) - Project/category name
- `metadata` (object, optional) - Additional metadata

**Returns:** `ApiResponse<{ memoryId: string }>`

#### `getMemory(id)`

Retrieve a specific memory by ID.

```typescript
const result = await client.getMemory('memory-id-123')
```

**Returns:** `ApiResponse<Memory>`

#### `updateMemory(id, updates)`

Update an existing memory.

```typescript
const result = await client.updateMemory('memory-id-123', {
  content: 'Updated content',
  metadata: { updated: true },
})
```

**Returns:** `ApiResponse<{ success: boolean }>`

#### `deleteMemory(id)`

Delete a memory.

```typescript
const result = await client.deleteMemory('memory-id-123')
```

**Returns:** `ApiResponse<{ success: boolean }>`

#### `listMemories(params?)`

List memories with pagination and filtering.

```typescript
const result = await client.listMemories({
  offset: 0,
  limit: 20,
  project: 'my-project',
})
```

**Parameters:**
- `offset` (number, optional) - Pagination offset
- `limit` (number, optional) - Results per page
- `project` (string, optional) - Filter by project

**Returns:** `PaginatedResponse<Memory>`

#### `searchMemories(query, options?)`

Search memories using semantic similarity.

```typescript
const results = await client.searchMemories('API documentation', {
  limit: 10,
  project: 'work',
  threshold: 0.7,
})
```

**Parameters:**
- `query` (string, required) - Search query
- `options.limit` (number, optional) - Maximum results
- `options.project` (string, optional) - Filter by project
- `options.threshold` (number, optional) - Similarity threshold (0-1)

**Returns:** `ApiResponse<SearchResult[]>`

#### `getStats()`

Get memory statistics for the user.

```typescript
const stats = await client.getStats()
// Returns: { totalMemories, memoriesByProject, recentMemories }
```

**Returns:** `ApiResponse<MemoryStats>`

### API Key Management

#### `getApiKeyStatus()`

Check if the user has an API key.

```typescript
const status = await client.getApiKeyStatus()
```

**Returns:** `ApiResponse<ApiKeyStatus>`

**Note:** Requires Clerk authentication token.

#### `generateApiKey()`

Generate a new API key (first time).

```typescript
const result = await client.generateApiKey()
```

**Returns:** `ApiResponse<GeneratedApiKey>`

**Note:** Requires Clerk authentication token.

#### `regenerateApiKey()`

Regenerate API key (replaces existing).

```typescript
const result = await client.regenerateApiKey()
```

**Returns:** `ApiResponse<GeneratedApiKey>`

**Note:** Requires Clerk authentication token.

### Billing Operations

#### `getBilling()`

Get billing subscription and usage information.

```typescript
const billing = await client.getBilling()
```

**Returns:** `ApiResponse<BillingInfo>`

#### `createCheckout(planId, interval)`

Create a checkout session for plan purchase.

```typescript
const checkout = await client.createCheckout('pro', 'monthly')
// Redirect user to checkout.data.url
```

**Returns:** `ApiResponse<{ url: string, sessionId: string }>`

#### `updateSubscription(planId, interval)`

Update existing subscription (upgrade/downgrade).

```typescript
const result = await client.updateSubscription('enterprise', 'yearly')
```

#### `cancelSubscription(immediate?)`

Cancel subscription.

```typescript
// Cancel at period end
await client.cancelSubscription(false)

// Cancel immediately
await client.cancelSubscription(true)
```

#### `reactivateSubscription()`

Reactivate a cancelled subscription.

```typescript
await client.reactivateSubscription()
```

#### `getPortalUrl()`

Get customer portal URL for managing subscription.

```typescript
const portal = await client.getPortalUrl()
// Redirect user to portal.data.url
```

### Health Check

#### `healthCheck()`

Check API health status.

```typescript
const health = await client.healthCheck()
// Returns: { status, database, redis, timestamp }
```

## TypeScript Types

The SDK exports all TypeScript types for use in your application:

```typescript
import type {
  Memory,
  MemoryStats,
  SearchResult,
  ApiResponse,
  PaginatedResponse,
  PersistQConfig,
  CreateMemoryParams,
  UpdateMemoryParams,
  ListMemoriesParams,
  SearchMemoriesParams,
} from 'persistq-sdk'
```

### Memory Type

```typescript
interface Memory {
  id: string
  userId: string
  project: string | null
  content: string
  metadata: Record<string, any> | null
  createdAt: string
}
```

### ApiResponse Type

```typescript
interface ApiResponse<T> {
  status: 'success' | 'error'
  data?: T
  error?: string
}
```

## Usage Examples

### Next.js App Router

```typescript
// app/api/memories/route.ts
import { createClient } from 'persistq-sdk'
import { NextResponse } from 'next/server'

export async function GET() {
  const client = createClient({
    baseUrl: process.env.MEMORYHUB_API_URL!,
    apiKey: process.env.MEMORYHUB_API_KEY!,
  })

  const memories = await client.listMemories({ limit: 10 })

  return NextResponse.json(memories)
}
```

### React Component

```typescript
import { useEffect, useState } from 'react'
import { createClient, Memory } from 'persistq-sdk'

const client = createClient({
  baseUrl: import.meta.env.VITE_API_URL,
  apiKey: import.meta.env.VITE_API_KEY,
})

export function MemoryList() {
  const [memories, setMemories] = useState<Memory[]>([])

  useEffect(() => {
    async function loadMemories() {
      const result = await client.listMemories({ limit: 10 })
      if (result.status === 'success' && result.data) {
        setMemories(result.data.memories)
      }
    }
    loadMemories()
  }, [])

  return (
    <ul>
      {memories.map(memory => (
        <li key={memory.id}>{memory.content}</li>
      ))}
    </ul>
  )
}
```

### Node.js Backend

```typescript
import { createClient } from 'persistq-sdk'

const client = createClient({
  baseUrl: process.env.MEMORYHUB_API_URL,
  apiKey: process.env.MEMORYHUB_API_KEY,
})

// Store user preferences
async function saveUserPreference(userId: string, preference: string) {
  return await client.createMemory(
    preference,
    `user-${userId}`,
    { userId, timestamp: new Date().toISOString() }
  )
}

// Search user preferences
async function findPreferences(userId: string, query: string) {
  return await client.searchMemories(query, {
    project: `user-${userId}`,
    limit: 5,
  })
}
```

### Browser (Vanilla JavaScript)

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module">
    import { createClient } from 'https://cdn.jsdelivr.net/npm/persistq-sdk/+esm'

    const client = createClient({
      baseUrl: 'https://your-backend.onrender.com',
      apiKey: 'your-api-key',
    })

    // Create memory
    const result = await client.createMemory('Hello from browser!')
    console.log(result)
  </script>
</head>
<body>
  <h1>PersistQ SDK Demo</h1>
</body>
</html>
```

## Error Handling

All API methods return an `ApiResponse` with a `status` field:

```typescript
const result = await client.createMemory('Test memory')

if (result.status === 'success') {
  console.log('Memory ID:', result.data?.memoryId)
} else {
  console.error('Error:', result.error)
}
```

## Requirements

- **Node.js**: 18.0.0 or higher (for native `fetch` support)
- **TypeScript**: 5.0 or higher (optional, but recommended)
- **Browsers**: All modern browsers with `fetch` support

## Related Packages

- **persistq** - MCP server for Claude Code and GitHub Copilot CLI integration
- **PersistQ API** - Backend API documentation

## Support

- [GitHub Issues](https://github.com/yourusername/memoryhub-monorepo/issues)
- [Documentation](https://docs.persistq.com)

## License

MIT © PersistQ

---

**Built with ❤️ using Claude Code**
