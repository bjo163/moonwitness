"use client"

import React from "react"
import { Brain, Network, Activity } from "lucide-react"

export function KnowledgeHubView() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-8 border-b border-border pb-6">
        <h1 className="flex items-center gap-3 text-2xl font-bold text-foreground sm:text-3xl">
          <Brain className="h-7 w-7 text-primary" />
          Knowledge Hub
        </h1>
        <p className="mt-2 text-muted-foreground">
          Central intelligence and scripture network
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-md border border-border bg-card p-4">
          <Network className="mb-4 h-8 w-8 text-success" />
          <h2 className="mb-2 text-xl font-bold text-foreground">
            Intelligence Graph
          </h2>
          <p className="text-sm text-muted-foreground">
            Visualize connections between scriptures, hadith, and historical
            events.
          </p>
        </div>

        <div className="rounded-md border border-border bg-card p-4">
          <Activity className="mb-4 h-8 w-8 text-warning" />
          <h2 className="mb-2 text-xl font-bold text-foreground">Global Signals</h2>
          <p className="text-sm text-muted-foreground">
            Real-time knowledge signals and alerts from the global network.
          </p>
        </div>
      </div>
    </div>
  )
}
