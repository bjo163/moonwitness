"use client"

import React from "react"
import { OSKnowledgeTrend } from "../components/os-knowledge-trend"
import { Activity } from "lucide-react"

export function KnowledgeSignalsView() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="flex items-center gap-3 text-3xl font-black tracking-widest text-white uppercase">
          <Activity className="h-8 w-8 text-orange-400" />
          Global Signals
        </h1>
        <p className="mt-2 text-zinc-400">
          Real-time incoming intelligence and knowledge trends
        </p>
      </div>

      <div className="h-[600px] rounded-xl border border-white/10 bg-black/40 p-4">
        {/* We use the moved component here */}
        <OSKnowledgeTrend />
      </div>
    </div>
  )
}
