"use client"

import React from "react"
import { Clock } from "lucide-react"

export function HistoryTimelineView() {
  return (
    <div className="p-8 h-screen flex flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-black text-white tracking-widest uppercase flex items-center gap-3">
          <Clock className="h-8 w-8 text-amber-400" />
          History Timeline
        </h1>
        <p className="text-zinc-400 mt-2">Chronological exploration of prophetic and ancient events</p>
      </div>
      
      <div className="flex-1 rounded-xl bg-black/40 border border-white/10 overflow-hidden relative flex items-center justify-center">
        <div className="text-amber-500/50 font-mono tracking-widest text-lg uppercase animate-pulse">
          INITIALIZING CHRONO-ENGINE...
        </div>
      </div>
    </div>
  )
}
