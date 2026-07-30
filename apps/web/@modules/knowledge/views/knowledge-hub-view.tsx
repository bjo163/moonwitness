"use client"

import React from "react"
import { Brain, Network, Activity } from "lucide-react"

export function KnowledgeHubView() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="flex items-center gap-3 text-3xl font-black tracking-widest text-white uppercase">
          <Brain className="h-8 w-8 text-cyan-400" />
          Knowledge Hub
        </h1>
        <p className="mt-2 text-zinc-400">
          Central intelligence and scripture network
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-black/40 p-6 backdrop-blur-md">
          <Network className="mb-4 h-10 w-10 text-emerald-400" />
          <h2 className="mb-2 text-xl font-bold text-white">
            Intelligence Graph
          </h2>
          <p className="text-sm text-zinc-400">
            Visualize connections between scriptures, hadith, and historical
            events.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/40 p-6 backdrop-blur-md">
          <Activity className="mb-4 h-10 w-10 text-orange-400" />
          <h2 className="mb-2 text-xl font-bold text-white">Global Signals</h2>
          <p className="text-sm text-zinc-400">
            Real-time knowledge signals and alerts from the global network.
          </p>
        </div>
      </div>
    </div>
  )
}
