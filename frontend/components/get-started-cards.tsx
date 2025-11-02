import { Button } from "@/components/ui/button"
import { Link2, Upload, Code2, Cpu } from "lucide-react"

const cards = [
  {
    title: "Connect your application",
    description: "Get connection details your app needs to connect to your memory store",
    icon: Link2,
    action: "Connect",
  },
  {
    title: "Import your data",
    description: "Automatically import your data from your existing memory store",
    icon: Upload,
    action: "Import data",
  },
  {
    title: "Integrate with your AI",
    description: "Use the Memory Layer SDK to connect AI agents like GPT, Claude, and more",
    icon: Code2,
    action: "Get SDK",
  },
  {
    title: "View API documentation",
    description: "Learn how to use the Memory Layer API to manage agent memories",
    icon: Cpu,
    action: "Go to docs",
  },
]

export function GetStartedCards() {
  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-medium text-foreground">Get started with your new memory store</h2>
        <button className="text-sm text-accent-cyan hover:underline">Dismiss</button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="flex flex-col items-start gap-3 rounded-lg border border-border bg-background p-5 hover:border-accent-cyan/30 transition-colors"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-glow">
              <card.icon className="h-5 w-5 text-accent-cyan" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-foreground mb-1">{card.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{card.description}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full border-border bg-surface hover:bg-accent-hover text-foreground"
            >
              {card.action}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
