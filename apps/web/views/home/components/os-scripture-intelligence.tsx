"use client"

import { useState } from "react"
import {
  ScriptureBottomPanels,
  ScriptureHeader,
  ScriptureInsightsPanel,
  ScriptureSearchPanel,
  ScriptureSourcesPanel,
  ScriptureStatusFooter,
} from "./os-scripture-intelligence-sections"

export function OSScriptureIntelligence() {
  const [searchQuery, setSearchQuery] = useState("mercy")
  const [activeFilter, setActiveFilter] = useState("ALL")

  return (
    <section
      id="scripture"
      className="relative z-10 overflow-hidden border-b border-primary/30 bg-background py-20 font-mono text-foreground"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="theme-grid-bg absolute inset-0 opacity-30" />
        <div className="bg-radial-gradient absolute top-1/3 left-1/2 h-[800px] w-[1000px] -translate-x-1/2 from-emerald-900/15 via-transparent to-transparent blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,240,255,0.02)_1px,transparent_1px)] bg-[size:100%_4px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-6 px-6 sm:px-10">
        <ScriptureHeader />
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
          <ScriptureSourcesPanel />
          <ScriptureSearchPanel
            searchQuery={searchQuery}
            activeFilter={activeFilter}
            onSearchQueryChange={setSearchQuery}
            onActiveFilterChange={setActiveFilter}
          />
          <ScriptureInsightsPanel />
        </div>
        <ScriptureBottomPanels />
        <ScriptureStatusFooter />
      </div>
    </section>
  )
}
