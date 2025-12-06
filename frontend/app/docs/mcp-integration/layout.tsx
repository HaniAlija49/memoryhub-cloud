import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MCP Integration - PersistQ',
  description: 'Integrate PersistQ with AI tools like Claude Code and GitHub Copilot CLI using the Model Context Protocol (MCP).',
}

export default function MCPIntegrationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
