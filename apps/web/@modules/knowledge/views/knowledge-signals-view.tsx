"use client"

import React from "react"
import { OSKnowledgeTrend } from "../components/os-knowledge-trend"
import { Activity } from "lucide-react"

export function KnowledgeSignalsView() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-widest uppercase flex items-center gap-3">
          <Activity className="h-8 w-8 text-orange-400" />
          Global Signals
        </h1>
        <p className="text-zinc-400 mt-2">Real-time incoming intelligence and knowledge trends</p>
      </div>
      
      <div className="h-[600px] rounded-xl bg-black/40 border border-white/10 p-4">
        {/* We use the moved component here */}
        <OSKnowledgeTrend />
      </div>
    </div>
  )
}
