"use client"

import React from "react"
import { Terminal, Bot } from "lucide-react"
import { THEME_TOKENS, type ThemeAccentColor } from "../../tokens/theme-tokens"

export function AIStreamTerminal({
  lines,
  prefix = "SYS>",
  accentColor = "system",
}: {
  lines: string[]
  prefix?: string
  accentColor?: ThemeAccentColor
}) {
  const colorHex = THEME_TOKENS.colors[accentColor]
  return (
    <div className="panel-box bg-space border border-primary/20 p-4 font-mono text-[10px] sm:text-xs">
      <div className="mb-2 flex items-center justify-between border-b border-primary/20 pb-2">
        <div className="flex items-center gap-2 text-primary">
          <Terminal className="h-3 w-3" />
          <span className="tracking-widest uppercase">Command Console</span>
        </div>
        <div className="flex gap-1.5">
          <div className="bg-danger/50 tag-clip h-2 w-2" />
          <div className="tag-clip h-2 w-2 bg-accent/50" />
          <div className="bg-success/50 tag-clip h-2 w-2" />
        </div>
      </div>
      <div className="theme-scrollbar h-48 space-y-1.5 overflow-y-auto text-foreground">
        {lines.map((line, i) => (
          <div key={i} className="flex items-start gap-2">
            <span style={{ color: colorHex }} className="shrink-0 font-bold">
              {prefix}
            </span>
            <span className="break-words opacity-90">{line}</span>
          </div>
        ))}
        <div className="flex animate-pulse items-start gap-2">
          <span style={{ color: colorHex }} className="shrink-0 font-bold">
            {prefix}
          </span>
          <span className="inline-block h-4 w-2 bg-white/70" />
        </div>
      </div>
    </div>
  )
}

export function AIConsolePanel({
  message,
  isTyping = false,
  agentName = "PROPHETIC AI",
}: {
  message?: React.ReactNode
  isTyping?: boolean
  agentName?: string
}) {
  return (
    <div className="panel-box bg-panel flex flex-col border border-secondary/30">
      <div className="flex items-center gap-3 border-b border-secondary/20 bg-secondary/10 px-4 py-2">
        <div className="badge-clip relative border border-secondary/50 bg-secondary/20 p-1.5">
          <Bot className="h-4 w-4 text-secondary" />
          {isTyping && (
            <span className="bg-success absolute -top-1 -right-1 h-2 w-2 animate-pulse rounded-full shadow-[0_0_5px_#00FF66]" />
          )}
        </div>
        <div className="flex flex-col">
          <span className="font-mono text-[10px] font-black tracking-widest text-secondary uppercase">
            // {agentName}
          </span>
          <span className="font-mono text-[8px] tracking-widest text-secondary/70 uppercase">
            {isTyping ? "SYNTHESIZING RESPONSE..." : "SYSTEM IDLE"}
          </span>
        </div>
      </div>

      <div className="p-5 font-sans text-sm leading-relaxed text-foreground">
        {isTyping && !message ? (
          <div className="flex h-6 items-center gap-1.5">
            <div
              className="h-1.5 w-1.5 animate-bounce rounded-full bg-secondary"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="h-1.5 w-1.5 animate-bounce rounded-full bg-secondary"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="h-1.5 w-1.5 animate-bounce rounded-full bg-secondary"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        ) : (
          <div className="prose prose-invert prose-p:my-2 prose-a:text-primary max-w-none">
            {message}
          </div>
        )}
      </div>
    </div>
  )
}
