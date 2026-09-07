"use client"

import React from "react"
import { OSKnowledgeTrend } from "../components/os-knowledge-trend"
import { Activity } from "lucide-react"

export function KnowledgeSignalsView() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-8 border-b border-border pb-6">
        <h1 className="flex items-center gap-3 text-2xl font-bold text-foreground sm:text-3xl">
          <Activity className="h-7 w-7 text-warning" />
          Global signals
        </h1>
        <p className="mt-2 text-muted-foreground">
          Real-time incoming intelligence and knowledge trends
        </p>
      </div>

      <div className="h-[600px] rounded-md border border-border bg-card p-4">
        {/* We use the moved component here */}
        <OSKnowledgeTrend />
      </div>
    </div>
  )
}
