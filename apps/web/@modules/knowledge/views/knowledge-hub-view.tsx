"use client"

import React from "react"
import { Brain, Network, Activity } from "lucide-react"

export function KnowledgeHubView() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-widest uppercase flex items-center gap-3">
          <Brain className="h-8 w-8 text-cyan-400" />
          Knowledge Hub
        </h1>
        <p className="text-zinc-400 mt-2">Central intelligence and scripture network</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md">
          <Network className="h-10 w-10 text-emerald-400 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Intelligence Graph</h2>
          <p className="text-zinc-400 text-sm">Visualize connections between scriptures, hadith, and historical events.</p>
        </div>
        
        <div className="p-6 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md">
          <Activity className="h-10 w-10 text-orange-400 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Global Signals</h2>
          <p className="text-zinc-400 text-sm">Real-time knowledge signals and alerts from the global network.</p>
        </div>
      </div>
    </div>
  )
}
