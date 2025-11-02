"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, RefreshCw } from "lucide-react"

export function MonitoringSection() {
  const [environment, setEnvironment] = useState("production")
  const [compute, setCompute] = useState("primary")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium text-foreground">Monitoring</h2>
        <a href="#" className="text-sm text-accent-cyan hover:underline">
          View all metrics
        </a>
      </div>

      <div className="rounded-lg border border-border bg-surface p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-muted-foreground">Environment</label>
              <button className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-accent-hover transition-colors">
                {environment}
                <span className="rounded bg-accent-glow px-1.5 py-0.5 text-xs text-accent-cyan">DEFAULT</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-muted-foreground">Compute</label>
              <button className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-accent-hover transition-colors">
                {compute}
                <span className="flex items-center gap-1 rounded bg-accent-glow px-1.5 py-0.5 text-xs text-accent-cyan">
                  <div className="h-1.5 w-1.5 rounded-full bg-accent-cyan" />
                  IDLE
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="border-border bg-background hover:bg-accent-hover text-foreground"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
    </div>
  )
}
