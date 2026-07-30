"use client"

import React from "react"
import { OSKnowledgeGraph } from "../components/os-knowledge-graph"
import { Network } from "lucide-react"

export function IntelligenceGraphView() {
  return (
    <div className="p-8 h-screen flex flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-black text-white tracking-widest uppercase flex items-center gap-3">
          <Network className="h-8 w-8 text-emerald-400" />
          Intelligence Graph
        </h1>
        <p className="text-zinc-400 mt-2">Relational mapping of divine and historical data</p>
      </div>
      
      <div className="flex-1 rounded-xl bg-black/40 border border-white/10 overflow-hidden relative">
        <OSKnowledgeGraph />
      </div>
    </div>
  )
}
