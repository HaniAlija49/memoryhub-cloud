"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Activity, Clock, CheckCircle } from "lucide-react"

interface StatusData {
  status: "operational" | "degraded" | "down"
  uptime: string
  responseTime: string
  lastIncident: string
}

export default function StatusBanner() {
  const [status, setStatus] = useState<StatusData>({
    status: "operational",
    uptime: "99.9%",
    responseTime: "~195ms",
    lastIncident: "None in past 30 days"
  })

  useEffect(() => {
    // Simulate real-time status updates
    const interval = setInterval(() => {
      const responseTime = 180 + Math.floor(Math.random() * 40)
      setStatus(prev => ({
        ...prev,
        responseTime: `~${responseTime}ms`
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = () => {
    switch (status.status) {
      case "operational":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "degraded":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "down":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-green-500/10 text-green-500 border-green-500/20"
    }
  }

  const getStatusIcon = () => {
    switch (status.status) {
      case "operational":
        return <CheckCircle className="w-4 h-4" />
      case "degraded":
        return <Activity className="w-4 h-4" />
      case "down":
        return <Clock className="w-4 h-4" />
      default:
        return <CheckCircle className="w-4 h-4" />
    }
  }

  const getStatusText = () => {
    switch (status.status) {
      case "operational":
        return "All Systems Operational"
      case "degraded":
        return "Minor Issues Detected"
      case "down":
        return "Service Outage"
      default:
        return "All Systems Operational"
    }
  }

  return (
    <div className="border-y border-border/40 bg-background/50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            {/* Status Indicator */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${getStatusColor()}`}>
              {getStatusIcon()}
              <span className="text-sm font-medium">{getStatusText()}</span>
            </div>

            {/* Key Metrics */}
            <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Uptime:</span>
                <span className="font-medium text-foreground">{status.uptime}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Response:</span>
                <span className="font-medium text-foreground">{status.responseTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Last incident:</span>
                <span className="font-medium text-foreground">{status.lastIncident}</span>
              </div>
            </div>
          </div>

          {/* Status Page Link */}
          <Link href="/docs" target="_blank" rel="noopener noreferrer">
          <Button
            variant="ghost"
            size="sm"
            className="text-accent-cyan hover:text-accent-cyan/80 hover:bg-accent-cyan/10"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Documentation
          </Button>
        </Link>
        </div>

        {/* Mobile Metrics */}
        <div className="md:hidden grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-border/30 text-sm">
          <div className="text-center">
            <div className="text-muted-foreground">Uptime</div>
            <div className="font-medium text-foreground">{status.uptime}</div>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground">Response</div>
            <div className="font-medium text-foreground">{status.responseTime}</div>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground">Last Incident</div>
            <div className="font-medium text-foreground">{status.lastIncident}</div>
          </div>
        </div>
      </div>
    </div>
  )
}