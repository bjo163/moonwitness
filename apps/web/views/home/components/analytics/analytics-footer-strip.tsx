"use client"

import React from "react"
import { BookOpen, ShieldCheck } from "lucide-react"

export function AnalyticsFooterStrip() {
  return (
    <div className="mt-6 flex flex-col items-center justify-between gap-6 border-t border-border px-2 pt-4 font-mono text-[9px] font-bold tracking-widest text-primary uppercase md:flex-row">
      <div className="flex items-center gap-4">
        <BookOpen className="h-6 w-6 text-primary" />
        <div className="font-sans text-muted-foreground normal-case italic">
          &quot;Knowledge is light. Action is power.
          <br />
          Sincerity is the key.&quot;
        </div>
      </div>
      <div className="flex flex-col items-center gap-1 text-center md:items-start md:text-left">
        <div className="text-muted-foreground">DATA SYNCHRONIZATION</div>
        <div>Last Sync: 25 May 2025 06:45 WIB</div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-2 text-success">
          KNOWLEDGE INTEGRITY 100% <ShieldCheck className="h-4 w-4" />
        </div>
        <div className="mt-1 flex gap-0.5">
          {[...Array(40)].map((_, i) => (
            <div key={i} className="h-1.5 w-1 bg-success/80" />
          ))}
        </div>
      </div>
    </div>
  )
}
