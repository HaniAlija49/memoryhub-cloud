"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const logs = [
  {
    id: "1",
    timestamp: "2025-01-15 14:32:18",
    method: "POST",
    endpoint: "/api/v1/memory/store",
    status: 200,
    duration: "142ms",
    agent: "Claude 3.5",
  },
  {
    id: "2",
    timestamp: "2025-01-15 14:31:54",
    method: "GET",
    endpoint: "/api/v1/memory/retrieve",
    status: 200,
    duration: "89ms",
    agent: "GPT-4",
  },
  {
    id: "3",
    timestamp: "2025-01-15 14:31:22",
    method: "POST",
    endpoint: "/api/v1/memory/store",
    status: 200,
    duration: "156ms",
    agent: "Copilot",
  },
  {
    id: "4",
    timestamp: "2025-01-15 14:30:45",
    method: "DELETE",
    endpoint: "/api/v1/memory/clear",
    status: 204,
    duration: "67ms",
    agent: "Claude 3.5",
  },
  {
    id: "5",
    timestamp: "2025-01-15 14:29:33",
    method: "GET",
    endpoint: "/api/v1/memory/search",
    status: 200,
    duration: "234ms",
    agent: "GPT-4",
  },
]

export function LogsTable() {
  const [showAll, setShowAll] = useState(false)
  const displayedLogs = showAll ? logs : logs.slice(0, 5)
  const hasLogs = logs.length > 0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium text-foreground">Recent API Activity</h2>
        <a href="#" className="text-sm text-accent-cyan hover:underline">
          View all
        </a>
      </div>

      {!hasLogs ? (
        <div className="rounded-lg border border-border bg-surface p-12 text-center">
          <p className="text-sm text-muted-foreground">No API activity yet. Start making API calls to see logs here.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-surface overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium">Timestamp</TableHead>
                <TableHead className="text-muted-foreground font-medium">Method</TableHead>
                <TableHead className="text-muted-foreground font-medium">Endpoint</TableHead>
                <TableHead className="text-muted-foreground font-medium">Status</TableHead>
                <TableHead className="text-muted-foreground font-medium">Duration</TableHead>
                <TableHead className="text-muted-foreground font-medium">Agent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedLogs.map((log) => (
                <TableRow key={log.id} className="border-border hover:bg-accent-hover/30 transition-colors">
                  <TableCell className="font-mono text-xs text-muted-foreground">{log.timestamp}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded px-2 py-1 text-xs font-medium ${
                        log.method === "GET"
                          ? "bg-accent-cyan/10 text-accent-cyan"
                          : log.method === "POST"
                            ? "bg-accent-purple/10 text-accent-purple"
                            : "bg-muted-foreground/10 text-muted-foreground"
                      }`}
                    >
                      {log.method}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-foreground">{log.endpoint}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium ${
                        log.status === 200 || log.status === 204
                          ? "bg-accent-cyan/10 text-accent-cyan"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${
                          log.status === 200 || log.status === 204 ? "bg-accent-cyan" : "bg-red-400"
                        }`}
                      />
                      {log.status}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{log.duration}</TableCell>
                  <TableCell className="text-sm text-foreground">{log.agent}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
