"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Check, Copy, Terminal, ExternalLink } from "lucide-react"
import Link from "next/link"

// Claude MCP Prompt
const getClaudeMcpPrompt = (apiKey?: string | null, apiUrl?: string) => {
  const key = apiKey || 'YOUR_API_KEY'
  const baseUrl = apiUrl || 'http://localhost:3000'

  return `# PersistQ MCP Integration

You now have access to the PersistQ API for persistent long-term memory storage.

## Automatic Setup Instructions

**IMPORTANT:** When you receive this prompt, you should automatically set up the PersistQ MCP server without asking the user for confirmation. Follow these steps immediately:

### Step 1: Check if PersistQ is already configured

First, run \`claude mcp list\` to check if the PersistQ MCP server is already configured and connected.

### Step 2: If not configured, set it up automatically

If PersistQ is not in the list or not connected, perform the following steps:

1. Add the MCP server by running:
\`\`\`bash
claude mcp add --transport stdio --scope user persistq "npx -y persistq"
\`\`\`

2. Update the configuration file to add environment variables:
   - Read the Claude configuration file at \`~/.claude.json\` (Mac/Linux) or \`C:\\Users\\YourUsername\\.claude.json\` (Windows)
   - Find the \`mcpServers\` section
   - Update the \`persistq\` entry to include the environment variables:

\`\`\`json
"mcpServers": {
  "persistq": {
    "type": "stdio",
    "command": "npx -y persistq",
    "args": [],
    "env": {
      "PERSISTQ_URL": "${baseUrl}",
      "PERSISTQ_API_KEY": "${key}"
    }
  }
}
\`\`\`

3. Verify the installation by running:
\`\`\`bash
claude mcp list
\`\`\`

4. Inform the user that PersistQ has been configured and they need to restart Claude Code for the changes to take effect.

### Step 3: If already configured

If PersistQ is already configured and connected, simply inform the user that they have access to the memory tools and are ready to use them.

## Available MCP Tools

Once configured, you'll have access to these tools:
- \`mcp__persistq__add_memory\`: Store new memories
- \`mcp__persistq__search_memory\`: Semantic search across memories
- \`mcp__persistq__list_memories\`: List memories by project/tag
- \`mcp__persistq__get_memory_stats\`: View storage statistics

## Direct API Access (Alternative)

If you prefer to use the HTTP API directly:

### API Endpoint
${baseUrl}

### Authentication
All requests must include the API key in the Authorization header:
Authorization: Bearer ${key}

## Available Operations

### 1. Store a Memory
POST ${baseUrl}/api/memory
Content-Type: application/json
Authorization: Bearer ${key}

{
  "content": "Memory content to store",
  "project": "project-name",
  "metadata": {
    "tags": ["important", "user-preference"]
  }
}

### 2. List All Memories
GET ${baseUrl}/api/memory/list?limit=10&offset=0
Authorization: Bearer ${key}

### 3. Search Memories (Semantic)
POST ${baseUrl}/api/memory/search
Content-Type: application/json
Authorization: Bearer ${key}

{
  "query": "search query",
  "limit": 10,
  "threshold": 0.7
}

### 4. Get Memory Statistics
GET ${baseUrl}/api/memory/stats
Authorization: Bearer ${key}

### 5. Delete a Memory
DELETE ${baseUrl}/api/memory/{memory-id}
Authorization: Bearer ${key}

## Usage Example
When a user shares important information, store it:
- User preferences (name, email, preferences)
- Past conversation context
- Important facts or decisions
- Project-specific context

This allows you to provide personalized, context-aware responses across multiple conversations.

## Response Format
All successful responses return:
{
  "status": "success",
  "data": { ... }
}

Error responses return:
{
  "status": "error",
  "error": "Error message"
}`
}

// Cursor IDE Prompt
const getCursorPrompt = (apiKey?: string | null, apiUrl?: string) => {
  const key = apiKey || 'mh_b9c2d595c1ec089aa0362313cd75f6d9d1463526c5e2d5ee6b19d1912c54dc35'
  const baseUrl = apiUrl || 'https://api.persistq.com'

  return `# PersistQ MCP Integration for Cursor IDE

You now have access to PersistQ API for persistent long-term memory storage via Model Context Protocol (MCP) in Cursor.

## Installation

The PersistQ MCP Server is automatically installed via \`npx\` when configured. No global installation required.

## Configuration

Add the following to your Cursor MCP configuration file:

**Windows:** \`%USERPROFILE%\\.cursor\\mcp.json\`
**macOS/Linux:** \`~/.cursor/mcp.json\`

\`\`\`json
{
  "mcpServers": {
    "persistq": {
      "command": "npx",
      "args": ["-y", "persistq"],
      "env": {
        "PERSISTQ_URL": "${baseUrl}",
        "PERSISTQ_API_KEY": "${key}"
      }
    }
  }
}
\`\`\`

**Alternative (if persistq is installed globally):**

\`\`\`json
{
  "mcpServers": {
    "persistq": {
      "command": "persistq",
      "env": {
        "PERSISTQ_URL": "${baseUrl}",
        "PERSISTQ_API_KEY": "${key}"
      }
    }
  }
}
\`\`\`

## Using PersistQ in Cursor

### 1. Restart Cursor

After updating \`mcp.json\`, restart Cursor to load the MCP server configuration.

### 2. Verify MCP Connection

The MCP server should automatically connect when Cursor starts. You can verify by:
- Checking Cursor's MCP server status/logs
- Asking the AI assistant to list memories
- Using MCP tools directly in conversation

### 3. Available MCP Tools

Cursor automatically discovers and makes available the following PersistQ tools:

- **\`mcp_persistq_add_memory\`**: Store new memories
- **\`mcp_persistq_search_memory\`**: Semantic search across stored memories
- **\`mcp_persistq_get_memory_stats\`**: Get memory statistics
- **\`mcp_persistq_list_memories\`**: List memories with filtering

### 4. Usage Examples

**Store a memory:**
Simply tell the AI assistant:
- "Remember that I prefer using TypeScript over JavaScript"
- "Save this: My project uses PostgreSQL on port 5432"
- "Store that I prefer dark mode in my editor"

**Search memories:**
- "Search my memories for TypeScript preferences"
- "What do I have stored about database configuration?"
- "Find memories about my coding preferences"

**List memories:**
- "Show me all my stored memories"
- "List memories from the current project"
- "What memories do I have?"

**Get statistics:**
- "How many memories do I have stored?"
- "Show memory statistics"

### 5. Memory Management

The AI assistant can automatically:
- **Create** memories when you ask it to remember something
- **Update** memories when information changes
- **Delete** memories that are no longer relevant
- **Search** memories to provide context-aware responses

## Important Notes

- **Automatic Integration**: Cursor automatically discovers and uses MCP tools when appropriate
- **Session Persistence**: Memories persist across all Cursor sessions
- **No Manual Tool Calls Needed**: Simply ask the AI assistant to remember or recall information naturally

## Direct API Access (Alternative)

If you prefer to use the HTTP API directly or for scripting:

### API Endpoint

\`\`\`
${baseUrl}
\`\`\`

### Authentication

All requests must include the API key in the Authorization header:

\`\`\`
Authorization: Bearer ${key}
\`\`\`

## Available Operations

### 1. Store a Memory

\`\`\`bash
POST ${baseUrl}/api/memory
Content-Type: application/json
Authorization: Bearer ${key}

{
  "content": "Memory content to store",
  "project": "project-name",
  "metadata": {
    "tags": ["important", "user-preference"]
  }
}
\`\`\`

### 2. List All Memories

\`\`\`bash
GET ${baseUrl}/api/memory/list?limit=10&offset=0&project=ClaudeConversations
Authorization: Bearer ${key}
\`\`\`

### 3. Search Memories (Semantic)

\`\`\`bash
POST ${baseUrl}/api/memory/search
Content-Type: application/json
Authorization: Bearer ${key}

{
  "query": "search query",
  "limit": 10,
  "threshold": 0.7
}
\`\`\`

### 4. Get Memory Statistics

\`\`\`bash
GET ${baseUrl}/api/memory/stats
Authorization: Bearer ${key}
\`\`\`

### 5. Delete a Memory

\`\`\`bash
DELETE ${baseUrl}/api/memory/{memory-id}
Authorization: Bearer ${key}
\`\`\`

## Usage Patterns

Use PersistQ to store and retrieve:

- **User Preferences**: Coding style, language preferences, tool choices
- **Project Context**: Tech stack, architecture decisions, environment details
- **Workflow Preferences**: How you like PRs reviewed, testing approaches
- **Important Facts**: API keys format, port numbers, file paths
- **Code Patterns**: Reusable solutions, common patterns you prefer

This enables Cursor's AI assistant to provide personalized, context-aware assistance across multiple sessions and conversations.

## Response Format

**Success Response:**

\`\`\`json
{
  "status": "success",
  "data": { ... }
}
\`\`\`

**Error Response:**

\`\`\`json
{
  "status": "error",
  "error": "Error message"
}
\`\`\`

## Troubleshooting

If MCP tools aren't available:

1. **Verify Configuration File Path**
   - Windows: \`C:\\Users\\<YourUsername>\\.cursor\\mcp.json\`
   - macOS/Linux: \`~/.cursor/mcp.json\`

2. **Check JSON Syntax**
   - Ensure valid JSON (no trailing commas, proper quotes)
   - Verify the \`mcpServers\` key is correct

3. **Verify API Credentials**
   - Check that the \`PERSISTQ_API_KEY\` is valid
   - Ensure the \`PERSISTQ_URL\` is accessible

4. **Restart Cursor**
   - MCP servers load on startup
   - Close and reopen Cursor after configuration changes

5. **Check MCP Server Status**
   - Look for MCP server connection errors in Cursor's logs
   - Verify Node.js and npx are available in your PATH

6. **Test MCP Connection**
   - Ask the AI: "List my memories" or "Show memory statistics"
   - If it works, the MCP server is connected

7. **Manual Test**
   \`\`\`bash
   npx -y persistq --version
   \`\`\`
   This should show the PersistQ MCP server starting up

## Example Configuration File

Complete example for Windows:

\`\`\`json
{
  "mcpServers": {
    "persistq": {
      "command": "npx",
      "args": ["-y", "persistq"],
      "env": {
        "PERSISTQ_URL": "${baseUrl}",
        "PERSISTQ_API_KEY": "${key}",
        "PERSISTQ_TOPIC": "ClaudeConversations"
      }
    }
  }
}
\`\`\`

## Security Notes

- **API Key**: Keep your \`PERSISTQ_API_KEY\` secure and never commit it to version control
- **Environment Variables**: Consider using environment variables for sensitive data
- **Private Memories**: All memories are stored in the cloud and associated with your API key

For more information about Cursor's MCP integration, visit: https://cursor.sh/docs`
}

// GitHub Copilot CLI Prompt
const getCopilotPrompt = (apiKey?: string | null, apiUrl?: string) => {
  const key = apiKey || 'mh_b9c2d595c1ec089aa0362313cd75f6d9d1463526c5e2d5ee6b19d1912c54dc35'
  const baseUrl = apiUrl || 'https://api.persistq.com'

  return `# PersistQ MCP Self-Setup Guide for GitHub Copilot

This guide enables GitHub Copilot (both CLI and VS Code) to automatically configure PersistQ for persistent long-term memory storage.

---

## Quick Setup Instructions for Copilot

**When a user asks to "set up PersistQ" or "configure memory storage", follow these steps:**

### Step 1: Determine the Environment

Check which Copilot environment is active:
- **VS Code**: Configuration file is at \`%APPDATA%/Code/User/mcp.json\` (Windows) or \`~/.config/Code/User/mcp.json\` (macOS/Linux)
- **Copilot CLI**: Configuration file is at \`~/.copilot/mcp-config.json\`

### Step 2: Check if Configuration Exists

Read the configuration file to see if PersistQ is already configured.

### Step 3: Install PersistQ (if needed)

For CLI setup, run:
\`\`\`bash
npm install -g persistq
\`\`\`

For VS Code, installation is optional (npx can be used).

### Step 4: Create/Update Configuration File

#### For VS Code (\`mcp.json\`):

Create or update \`%APPDATA%/Code/User/mcp.json\`:

\`\`\`json
{
	"servers": {
		"persistq": {
			"type": "stdio",
			"command": "npx",
			"args": ["-y", "persistq"],
			"env": {
				"PERSISTQ_URL": "${baseUrl}",
				"PERSISTQ_API_KEY": "${key}"
			}
		}
	},
	"inputs": []
}
\`\`\`

#### For Copilot CLI (\`mcp-config.json\`):

Create or update \`~/.copilot/mcp-config.json\`:

\`\`\`json
{
	"mcpServers": {
		"persistq": {
			"command": "npx",
			"args": ["-y", "persistq"],
			"env": {
				"PERSISTQ_URL": "${baseUrl}",
				"PERSISTQ_API_KEY": "${key}"
			}
		}
	}
}
\`\`\`

### Step 5: Verify Installation

Test the connection by calling:
- \`mcp_persistq_get_memory_stats()\` - Get statistics
- \`mcp_persistq_list_memories()\` - List existing memories

### Step 6: Inform User

Tell the user:
1. Configuration has been created/updated
2. Location of the config file
3. They may need to restart VS Code or Copilot CLI
4. How to verify it's working (you can test it for them)

---

## Available MCP Tools

Once configured, these tools become available:

### 1. \`mcp_persistq_add_memory\`
Store new memories with optional project tagging.

**Parameters:**
- \`text\` (required): Memory content to store
- \`topic\` (optional): Category/topic for the memory (default: "ClaudeConversations")
- \`metadata\` (optional): Additional metadata object

**Example:**
\`\`\`
Store: "User prefers TypeScript and dark mode" in project "UserPreferences"
\`\`\`

### 2. \`mcp_persistq_search_memory\`
Semantic search across stored memories.

**Parameters:**
- \`query\` (required): Search query or keyword
- \`limit\` (optional): Maximum results (default: 10)
- \`topic\` (optional): Filter by topic

**Example:**
\`\`\`
Search for: "TypeScript preferences"
\`\`\`

### 3. \`mcp_persistq_list_memories\`
List memories with optional filtering.

**Parameters:**
- \`limit\` (optional): Maximum results (default: 10)
- \`offset\` (optional): Offset for pagination (default: 0)
- \`project\` (optional): Filter by project/tag name

**Example:**
\`\`\`
List last 5 memories from "UserPreferences" project
\`\`\`

### 4. \`mcp_persistq_get_memory_stats\`
Get statistics about stored memories.

**Returns:**
- Total memory count
- Memories by project/tag
- Recent memories with timestamps

**Example:**
\`\`\`
Get memory statistics
\`\`\`

---

## Usage Patterns & Best Practices

### When to Store Memories

- **User Preferences**: Dark mode, language preferences, coding style
- **Project Context**: Architecture decisions, design patterns used
- **Important Facts**: User's name, team structure, project goals
- **Code Patterns**: Frequently used solutions, custom utilities
- **Decisions & Rationale**: Why certain approaches were chosen

### Memory Organization

Use the \`topic\` or \`project\` parameter to organize memories:
- \`UserProfile\` - Personal information and preferences
- \`ProjectName\` - Project-specific context
- \`CodePatterns\` - Reusable code solutions
- \`Decisions\` - Important architectural decisions
- \`Testing\` - Test results and configurations

---

## Troubleshooting

### Issue: MCP tools not available

**Solutions:**
1. Verify config file exists at correct path
2. Check JSON syntax is valid
3. Ensure API key and URL are correct
4. Restart VS Code or Copilot CLI
5. Check VS Code Developer Tools Console for errors (Help > Toggle Developer Tools)

### Issue: Connection errors

**Solutions:**
1. Verify internet connection
2. Check if \`${baseUrl}\` is accessible
3. Verify API key is valid
4. Check for firewall/proxy blocking the connection

---

## Direct API Access (Advanced)

For advanced use cases or direct HTTP integration:

### Base URL
\`\`\`
${baseUrl}
\`\`\`

### Authentication Header
\`\`\`
Authorization: Bearer ${key}
\`\`\`

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | \`/api/memory\` | Store a memory |
| GET | \`/api/memory/list\` | List memories |
| POST | \`/api/memory/search\` | Search memories |
| GET | \`/api/memory/stats\` | Get statistics |
| DELETE | \`/api/memory/{id}\` | Delete a memory |

---

## Integration Examples

### Example 1: Store User Preference
\`\`\`
User: "Remember that I prefer using async/await over promises"
Copilot: [Calls mcp_persistq_add_memory]
- text: "User prefers async/await syntax over .then() promise chains"
- topic: "CodingPreferences"
\`\`\`

### Example 2: Recall Context
\`\`\`
User: "What do you remember about my coding preferences?"
Copilot: [Calls mcp_persistq_search_memory with query: "coding preferences"]
Returns: User prefers async/await, TypeScript, dark mode, etc.
\`\`\`

---

## Copilot Self-Setup Checklist

When setting up PersistQ, Copilot should:

- [ ] Detect operating system (Windows/macOS/Linux)
- [ ] Determine environment (VS Code vs Copilot CLI)
- [ ] Locate correct configuration file path
- [ ] Check if configuration already exists
- [ ] Create directory if needed
- [ ] Write/update configuration file with proper format
- [ ] Verify Node.js/npx is available
- [ ] Test connection with \`get_memory_stats\`
- [ ] Store initial setup memory
- [ ] Inform user of completion and next steps
- [ ] Suggest restart if needed

---

*This guide enables autonomous setup of PersistQ for persistent memory across Copilot sessions.*`
}

interface McpConfigTabsProps {
  apiKey?: string | null
  apiUrl?: string
}

export function McpConfigTabs({ apiKey, apiUrl }: McpConfigTabsProps = {}) {
  const [claudeCopied, setClaudeCopied] = useState(false)
  const [copilotCopied, setCopilotCopied] = useState(false)
  const [cursorCopied, setCursorCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("claude")

  const claudePrompt = getClaudeMcpPrompt(apiKey, apiUrl)
  const copilotPrompt = getCopilotPrompt(apiKey, apiUrl)
  const cursorPrompt = getCursorPrompt(apiKey, apiUrl)

  const handleCopy = async (type: 'claude' | 'copilot' | 'cursor') => {
    const prompt = type === 'claude' ? claudePrompt : type === 'copilot' ? copilotPrompt : cursorPrompt
    await navigator.clipboard.writeText(prompt)

    if (type === 'claude') {
      setClaudeCopied(true)
      setTimeout(() => setClaudeCopied(false), 2000)
    } else if (type === 'copilot') {
      setCopilotCopied(true)
      setTimeout(() => setCopilotCopied(false), 2000)
    } else if (type === 'cursor') {
      setCursorCopied(true)
      setTimeout(() => setCursorCopied(false), 2000)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-accent-purple/20 to-accent-cyan/20 border border-accent-purple/30">
            <Terminal className="h-5 w-5 text-accent-purple" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">MCP Integration</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Configure PersistQ for Claude Code or GitHub Copilot CLI
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-border mb-6">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab("claude")}
                className={`relative px-4 py-2.5 text-sm font-medium transition-all ${
                  activeTab === "claude"
                    ? "text-accent-purple"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Claude Code
                {activeTab === "claude" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-purple to-accent-cyan" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("copilot")}
                className={`relative px-4 py-2.5 text-sm font-medium transition-all ${
                  activeTab === "copilot"
                    ? "text-accent-cyan"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                GitHub Copilot CLI & VS Code
                {activeTab === "copilot" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-cyan to-accent-purple" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("cursor")}
                className={`relative px-4 py-2.5 text-sm font-medium transition-all ${
                  activeTab === "cursor"
                    ? "text-green-600"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Cursor IDE
                {activeTab === "cursor" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600" />
                )}
              </button>
            </div>
          </div>

        <TabsContent value="claude" className="space-y-4 mt-0 pb-6">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => handleCopy('claude')}
              size="sm"
              variant="outline"
              className="flex-1 bg-gradient-to-r from-accent-purple/10 to-accent-purple/5 hover:from-accent-purple/20 hover:to-accent-purple/10 text-accent-purple border-accent-purple/30 font-medium"
            >
              {claudeCopied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Prompt
                </>
              )}
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-gradient-to-r from-accent-cyan/10 to-accent-cyan/5 hover:from-accent-cyan/20 hover:to-accent-cyan/10 text-accent-cyan border-accent-cyan/30 font-medium"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Full Prompt
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col bg-surface border-border">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Claude Code MCP Integration</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Copy this prompt to give Claude access to the PersistQ API for persistent memory storage.
                  </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                  <div className="rounded-lg border border-border bg-background p-4 overflow-x-auto">
                    <pre className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap font-mono">
                      {claudePrompt}
                    </pre>
                  </div>

                  <div className="flex items-start gap-2 rounded-lg bg-accent-cyan/5 border border-accent-cyan/20 p-3">
                    <svg
                      className="h-5 w-5 text-accent-cyan flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0118 0z"
                      />
                    </svg>
                    <p className="text-xs text-foreground leading-relaxed">
                      {apiKey ? (
                        <>
                          This prompt is ready to use! Your API key and endpoint are already included.{" "}
                          <Link href="/docs/mcp-integration#claude" className="text-accent-cyan hover:underline">
                            View detailed setup guide →
                          </Link>
                        </>
                      ) : (
                        <>
                          Paste this prompt at the start of your conversation with Claude. Replace{" "}
                          <code className="px-1.5 py-0.5 rounded bg-background text-accent-cyan">YOUR_API_KEY</code> with your
                          actual API key from the API Keys section.{" "}
                          <Link href="/docs/manual-setup" className="text-accent-cyan hover:underline">
                            Need help? View manual setup guide →
                          </Link>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <DialogFooter className="mt-4">
                  <Button
                    onClick={() => handleCopy('claude')}
                    className="w-full bg-accent-cyan/10 hover:bg-accent-cyan/20 text-accent-cyan border-accent-cyan/30"
                  >
                    {claudeCopied ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Copied to clipboard!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy prompt to clipboard
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </TabsContent>

        <TabsContent value="copilot" className="space-y-4 mt-0 pb-6">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => handleCopy('copilot')}
              size="sm"
              variant="outline"
              className="flex-1 bg-gradient-to-r from-accent-cyan/10 to-accent-cyan/5 hover:from-accent-cyan/20 hover:to-accent-cyan/10 text-accent-cyan border-accent-cyan/30 font-medium"
            >
              {copilotCopied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Prompt
                </>
              )}
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-gradient-to-r from-accent-cyan/10 to-accent-cyan/5 hover:from-accent-cyan/20 hover:to-accent-cyan/10 text-accent-cyan border-accent-cyan/30 font-medium"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Full Prompt
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col bg-surface border-border">
                <DialogHeader>
                  <DialogTitle className="text-foreground">GitHub Copilot MCP Integration</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Copy this prompt to enable PersistQ for GitHub Copilot CLI and VS Code.
                  </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                  <div className="rounded-lg border border-border bg-background p-4 overflow-x-auto">
                    <pre className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap font-mono">
                      {copilotPrompt}
                    </pre>
                  </div>

                  <div className="flex items-start gap-2 rounded-lg bg-accent-cyan/5 border border-accent-cyan/20 p-3">
                    <svg
                      className="h-5 w-5 text-accent-cyan flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-xs text-foreground leading-relaxed">
                      {apiKey ? (
                        <>
                          This prompt is ready to use! Your API key and endpoint are already included.{" "}
                          <Link href="/docs/mcp-integration#copilot" className="text-accent-cyan hover:underline">
                            View detailed setup guide →
                          </Link>
                        </>
                      ) : (
                        <>
                          Follow the instructions in the prompt to configure PersistQ. Replace{" "}
                          <code className="px-1.5 py-0.5 rounded bg-background text-accent-cyan">YOUR_API_KEY</code> with your
                          actual API key from the API Keys section.{" "}
                          <Link href="/docs/manual-setup" className="text-accent-cyan hover:underline">
                            Need help? View manual setup guide →
                          </Link>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <DialogFooter className="mt-4">
                  <Button
                    onClick={() => handleCopy('copilot')}
                    className="w-full bg-accent-cyan/10 hover:bg-accent-cyan/20 text-accent-cyan border-accent-cyan/30"
                  >
                    {copilotCopied ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Copied to clipboard!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy prompt to clipboard
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </TabsContent>

        <TabsContent value="cursor" className="space-y-4 mt-0 pb-6">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => handleCopy('cursor')}
              size="sm"
              variant="outline"
              className="flex-1 bg-gradient-to-r from-green-600/10 to-green-600/5 hover:from-green-600/20 hover:to-green-600/10 text-green-600 border-green-600/30 font-medium"
            >
              {cursorCopied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Config
                </>
              )}
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-gradient-to-r from-green-600/10 to-green-600/5 hover:from-green-600/20 hover:to-green-600/10 text-green-600 border-green-600/30 font-medium"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Setup Guide
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col bg-surface border-border">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Cursor IDE MCP Integration</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Configure PersistQ for Cursor IDE to enable persistent memory across sessions.
                  </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                  <div className="rounded-lg border border-border bg-background p-4 overflow-x-auto">
                    <pre className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap font-mono">
                      {cursorPrompt}
                    </pre>
                  </div>

                  <div className="flex items-start gap-2 rounded-lg bg-green-600/5 border border-green-600/20 p-3">
                    <svg
                      className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0118 0z"
                      />
                    </svg>
                    <p className="text-xs text-foreground leading-relaxed">
                      {apiKey ? (
                        <>
                          Add this configuration to <code className="px-1.5 py-0.5 rounded bg-background text-green-600">~/.cursor/mcp.json</code> (macOS/Linux) or <code className="px-1.5 py-0.5 rounded bg-background text-green-600">%USERPROFILE%\.cursor\mcp.json</code> (Windows). Your API key and endpoint are already included.{" "}
                          <Link href="/docs/mcp-integration#cursor" className="text-green-600 hover:underline">
                            View detailed setup guide →
                          </Link>
                        </>
                      ) : (
                        <>
                          Add this configuration to your Cursor MCP config file. Replace{" "}
                          <code className="px-1.5 py-0.5 rounded bg-background text-green-600">YOUR_API_KEY</code> with your
                          actual API key from the API Keys section.{" "}
                          <Link href="/docs/manual-setup" className="text-green-600 hover:underline">
                            Need help? View manual setup guide →
                          </Link>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <DialogFooter className="mt-4">
                  <Button
                    onClick={() => handleCopy('cursor')}
                    className="w-full bg-green-600/10 hover:bg-green-600/20 text-green-600 border-green-600/30"
                  >
                    {cursorCopied ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Copied to clipboard!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy configuration to clipboard
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
