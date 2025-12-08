"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"

interface CodeBlockProps {
  code: string
  language?: string
  title?: string
  showLineNumbers?: boolean
}

export default function CodeBlock({
  code,
  language = "bash",
  title,
  showLineNumbers = true
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [hovered, setHovered] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy code:", err)
    }
  }

  const lines = code.split("\n")

  return (
    <div
      className={`relative rounded-lg border bg-surface transition-all duration-200 ${
        hovered ? "border-accent-cyan/50 shadow-lg shadow-accent-cyan/5" : "border-border/50"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Header */}
      {(title || hovered) && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-border/30">
          {title && (
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
          )}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded">
              {language}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopy}
              className="h-7 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 mr-1 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Code content */}
      <div className="relative group overflow-x-auto">
        <pre className="p-4 text-sm leading-relaxed">
          <code className="font-mono">
            {showLineNumbers ? (
              <div className="flex">
                <div className="text-muted-foreground/50 select-none pr-4 text-right border-r border-border/30">
                  {lines.map((_, i) => (
                    <div key={i} className="leading-6">
                      {i + 1}
                    </div>
                  ))}
                </div>
                <div className="pl-4 flex-1">
                  {lines.map((line, i) => (
                    <div key={i} className="leading-6">
                      {line || <span>&nbsp;</span>}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              lines.map((line, i) => (
                <div key={i} className="leading-6">
                  {line || <span>&nbsp;</span>}
                </div>
              ))
            )}
          </code>
        </pre>

        {/* Floating copy button */}
        <Button
          size="sm"
          onClick={handleCopy}
          className={`absolute top-2 right-2 h-8 px-3 text-xs transition-all duration-200 ${
            copied
              ? "bg-green-500/20 text-green-500 border-green-500/30"
              : "bg-background/80 hover:bg-background text-muted-foreground hover:text-foreground border-border/50"
          } backdrop-blur-sm border`}
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 mr-1" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 mr-1" />
              Copy code
            </>
          )}
        </Button>
      </div>
    </div>
  )
}