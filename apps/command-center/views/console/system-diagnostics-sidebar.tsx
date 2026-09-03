"use client"

import React from "react"
import { Activity, Cpu, Database, Network } from "lucide-react"

const METRICS = [
  { label: "CPU load", value: "38.2%", icon: Cpu },
  { label: "Memory", value: "1.4 / 4.0 GB", icon: Database },
  { label: "Network latency", value: "14.2 ms", icon: Network },
  { label: "Process activity", value: "Normal", icon: Activity },
]

export function SystemDiagnosticsSidebar() {
  return (
    <aside className="h-fit rounded-lg border border-border bg-background/80 p-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h2 className="text-sm font-semibold text-foreground">System diagnostics</h2>
        <span className="text-xs text-success">Online</span>
      </div>
      <div className="mt-3 space-y-2">
        {METRICS.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-center justify-between gap-3 rounded-md border border-border/70 bg-muted/20 p-3">
            <div className="flex min-w-0 items-center gap-2">
              <Icon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span className="truncate text-xs text-muted-foreground">{label}</span>
            </div>
            <span className="shrink-0 font-mono text-xs text-foreground">{value}</span>
          </div>
        ))}
      </div>
    </aside>
  )
}
