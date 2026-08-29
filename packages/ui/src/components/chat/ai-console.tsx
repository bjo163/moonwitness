"use client"

import React from "react"
import { Terminal, Bot } from "lucide-react"

export function AIStreamTerminal({
  lines,
  prefix = ">",
}: {
  lines: string[]
  prefix?: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 font-mono text-[10px] sm:text-xs shadow-sm">
      <div className="mb-2 flex items-center justify-between border-b border-border pb-2">
        <div className="flex items-center gap-2 text-primary">
          <Terminal className="h-3.5 w-3.5" />
          <span className="font-semibold">Terminal Output</span>
        </div>
        <div className="flex gap-1.5">
          <div className="rounded-full h-2 w-2 bg-destructive/50" />
          <div className="rounded-full h-2 w-2 bg-warning/50" />
          <div className="rounded-full h-2 w-2 bg-success/50" />
        </div>
      </div>
      <div className="theme-scrollbar h-48 space-y-1.5 overflow-y-auto text-foreground">
        {lines.map((line, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="shrink-0 font-bold text-primary">
              {prefix}
            </span>
            <span className="break-words opacity-90">{line}</span>
          </div>
        ))}
        <div className="flex animate-pulse items-start gap-2">
          <span className="shrink-0 font-bold text-primary">
            {prefix}
          </span>
          <span className="inline-block h-4 w-2 bg-foreground/70" />
        </div>
      </div>
    </div>
  )
}

export function AIConsolePanel({
  message,
  isTyping = false,
  agentName = "AI Assistant",
}: {
  message?: React.ReactNode
  isTyping?: boolean
  agentName?: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card flex flex-col shadow-sm">
      <div className="flex items-center gap-3 border-b border-border bg-muted/40 px-4 py-2.5">
        <div className="relative rounded-lg border border-border bg-card p-1.5">
          <Bot className="h-4 w-4 text-primary" />
          {isTyping && (
            <span className="bg-success absolute -top-1 -right-1 h-2 w-2 animate-pulse rounded-full" />
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-foreground">
            {agentName}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {isTyping ? "Generating response..." : "Online"}
          </span>
        </div>
      </div>
      <div className="p-4 text-sm text-foreground leading-relaxed">
        {message}
      </div>
    </div>
  )
}
