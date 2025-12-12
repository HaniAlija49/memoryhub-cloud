# PersistQ MCP Integration for GitHub Copilot CLI

You now have access to the PersistQ API for persistent long-term memory storage via the Model Context Protocol (MCP).

## Installation

Install the PersistQ MCP Server:
```bash
npm install -g persistq
```

## Configuration

Add the following to your Copilot CLI MCP configuration file at `~/.copilot/mcp-config.json`:

```json
{
  "mcpServers": {
    "persistq": {
      "command": "persistq",
      "env": {
        "PERSISTQ_URL": "https://memoryhub-cloud.onrender.com
",
        "PERSISTQ_API_KEY": "mh_b9c2d595c1ec089aa0362313cd75f6d9d1463526c5e2d5ee6b19d1912c54dc35"
      }
    }
  }
}
```

**Alternative (using npx):**
```json
{
  "mcpServers": {
    "persistq": {
      "command": "npx",
      "args": ["-y", "persistq"],
      "env": {
        "PERSISTQ_URL": "https://memoryhub-cloud.onrender.com
",
        "PERSISTQ_API_KEY": "mh_b9c2d595c1ec089aa0362313cd75f6d9d1463526c5e2d5ee6b19d1912c54dc35"
      }
    }
  }
}
```

## Using PersistQ in Copilot CLI

### 1. Start Copilot CLI
```bash
copilot
```

### 2. Check Available MCP Servers
Type `/mcp` in the interactive mode to see all configured MCP servers including PersistQ.

### 3. Use PersistQ Tools
Copilot will automatically discover and use the following tools when relevant:

- **`add_memory`**: Store new memories
- **`search_memory`**: Semantic search across stored memories
- **`get_memory_stats`**: Get memory statistics
- **`list_memories`**: List memories with filtering

### 4. Tool Usage Examples

**Store a memory:**
"Store this information: User prefers dark mode and uses TypeScript"

**Search memories:**
"Search my memories for TypeScript preferences"

**List memories:**
"Show me all memories from the current project"

**Get statistics:**
"How many memories do I have stored?"

### 5. Control Tool Access (Optional)
Allow or deny specific tools:
```bash
# Allow only specific tools
copilot --allow-tool 'persistq(add_memory)' --allow-tool 'persistq(search_memory)'

# Deny specific tools
copilot --deny-tool 'persistq(delete_memory)'

# Allow all tools from PersistQ
copilot --allow-tool 'persistq'
```

## Important Notes

- **MCP Tools Only**: GitHub Copilot CLI currently only supports MCP tools (not resources or prompts)
- **Automatic Discovery**: Copilot automatically discovers and uses tools when appropriate
- **Tool Names**: Reference tools as `persistq(tool_name)` when using allow/deny flags
- **Session Persistence**: MCP configuration persists across all Copilot CLI sessions
- **Environment Variables**: As of version 0.0.340+, use `${VAR}` syntax for env vars

## Direct API Access (Alternative)

If you prefer to use the HTTP API directly or if MCP isn't available:

### API Endpoint
https://memoryhub-cloud.onrender.com


### Authentication
All requests must include the API key in the Authorization header:
```
Authorization: Bearer mh_b9c2d595c1ec089aa0362313cd75f6d9d1463526c5e2d5ee6b19d1912c54dc35
```

## Available Operations

### 1. Store a Memory
```bash
POST https://memoryhub-cloud.onrender.com
/api/memory
Content-Type: application/json
Authorization: Bearer mh_b9c2d595c1ec089aa0362313cd75f6d9d1463526c5e2d5ee6b19d1912c54dc35

{
  "content": "Memory content to store",
  "project": "project-name",
  "metadata": {
    "tags": ["important", "user-preference"]
  }
}
```

### 2. List All Memories
```bash
GET https://memoryhub-cloud.onrender.com
/api/memory/list?limit=10&offset=0
Authorization: Bearer mh_b9c2d595c1ec089aa0362313cd75f6d9d1463526c5e2d5ee6b19d1912c54dc35
```

### 3. Search Memories (Semantic)
```bash
POST https://memoryhub-cloud.onrender.com
/api/memory/search
Content-Type: application/json
Authorization: Bearer mh_b9c2d595c1ec089aa0362313cd75f6d9d1463526c5e2d5ee6b19d1912c54dc35

{
  "query": "search query",
  "limit": 10,
  "threshold": 0.7
}
```

### 4. Get Memory Statistics
```bash
GET https://memoryhub-cloud.onrender.com
/api/memory/stats
Authorization: Bearer mh_b9c2d595c1ec089aa0362313cd75f6d9d1463526c5e2d5ee6b19d1912c54dc35
```

### 5. Delete a Memory
```bash
DELETE https://memoryhub-cloud.onrender.com
/api/memory/{memory-id}
Authorization: Bearer mh_b9c2d595c1ec089aa0362313cd75f6d9d1463526c5e2d5ee6b19d1912c54dc35
```

## Usage Patterns

Use PersistQ to store and retrieve:
- User preferences and settings
- Past conversation context
- Important facts and decisions
- Project-specific knowledge
- Code patterns and solutions

This enables Copilot to provide personalized, context-aware assistance across multiple sessions.

## Response Format

**Success Response:**
```json
{
  "status": "success",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "status": "error",
  "error": "Error message"
}
```

## Troubleshooting

If the tools aren't available:
1. Verify the config file path is correct
2. Check that the API key is valid
3. Ensure the PERSISTQ_URL is accessible
4. Restart GitHub Copilot CLI
5. Check Copilot CLI logs for errors

For more information, visit: https://docs.github.com/en/copilot

<current_datetime>2025-12-06T22:07:17.893Z</current_datetime>
