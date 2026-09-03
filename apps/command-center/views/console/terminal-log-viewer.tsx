"use client"

import React, { useEffect, useRef } from "react"

export type LogItem = {
  id: string
  timestamp: string
  sender: "SYSTEM" | "KHIDRA_AI" | "USER" | "SUCCESS" | "WARN" | "CRITICAL"
  message: string
}

const SENDER_CLASSES: Record<LogItem["sender"], string> = {
  SYSTEM: "text-muted-foreground",
  KHIDRA_AI: "text-primary",
  USER: "text-foreground",
  SUCCESS: "text-success",
  WARN: "text-warning",
  CRITICAL: "text-danger",
}

export function TerminalLogViewer({ logs }: { logs: LogItem[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }) }, [logs.length])

  return (
    <div ref={scrollRef} className="min-h-[400px] flex-1 overflow-y-auto p-4 font-mono text-xs">
      {logs.length === 0 ? <p className="text-muted-foreground">Output cleared.</p> : logs.map((item) => (
        <div key={item.id} className="grid gap-1 border-b border-border/50 py-2 sm:grid-cols-[72px_72px_minmax(0,1fr)] sm:gap-3">
          <span className="text-muted-foreground">{item.timestamp}</span>
          <span className={SENDER_CLASSES[item.sender]}>{item.sender}</span>
          <p className="break-words leading-relaxed text-foreground/90">{item.message}</p>
        </div>
      ))}
    </div>
  )
}
