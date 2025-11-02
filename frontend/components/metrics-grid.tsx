import { Activity, Database, HardDrive, Zap } from "lucide-react"

const metrics = [
  {
    title: "API Calls",
    value: 2400000,
    limit: 10000000,
    unit: "",
    icon: Activity,
  },
  {
    title: "Stored Memories",
    value: 18492,
    limit: 100000,
    unit: "",
    icon: Database,
  },
  {
    title: "Storage Used",
    value: 47.3,
    limit: 100,
    unit: "GB",
    icon: HardDrive,
  },
  {
    title: "Avg Response Time",
    value: 124,
    limit: 200,
    unit: "ms",
    icon: Zap,
  },
]

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

export function MetricsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        const percentage = (metric.value / metric.limit) * 100

        return (
          <div
            key={metric.title}
            className="rounded-lg border border-border bg-surface p-5 hover:border-accent-cyan/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{metric.title}</span>
            </div>
            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-3xl font-semibold text-foreground">{formatNumber(metric.value)}</span>
              <span className="text-sm text-muted-foreground">
                / {formatNumber(metric.limit)}
                {metric.unit}
              </span>
            </div>
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-accent-glow">
              <div
                className="h-full bg-accent-cyan transition-all duration-500"
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
