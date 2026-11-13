"use client"

import { useState } from "react"
import { Globe } from "lucide-react"
import { useModelRecords } from "@workspace/hooks"
import {
  HistoricalCivilizationsPanel,
  HistoricalEventsPanel,
  HistoricalInsightsPanel,
  HistoricalIntelligenceHeader,
  HistoricalJourneyPanel,
  HistoricalOverviewPanel,
  HistoricalScriptureReferencesPanel,
  HistoricalStatusFooter,
  HistoricalTimeRangePanel,
} from "./os-historical-intelligence-panels"
import {
  HISTORICAL_CIVILIZATIONS,
  HISTORICAL_EVENTS,
  HISTORICAL_SCRIPTURE_REFERENCES,
  resolveHistoricalProphets,
} from "./os-historical-intelligence-data"

export function OSHistoricalIntelligence() {
  const [timelineSearch, setTimelineSearch] = useState("")
  const { records: figureRecords } = useModelRecords("wx.figure", { limit: 12 })
  const prophets = resolveHistoricalProphets(figureRecords)

  return (
    <section
      id="historical-intelligence"
      className="relative z-10 overflow-hidden border-b border-primary/30 bg-background py-20 font-mono text-foreground"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="theme-grid-bg absolute inset-0 opacity-25" />
        <div className="bg-radial-gradient absolute top-1/2 left-1/4 h-[800px] w-[800px] from-teal-900/15 via-transparent to-transparent blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,240,255,0.01)_1px,transparent_1px)] bg-[size:100%_4px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-8 px-6 sm:px-10">
        <HistoricalIntelligenceHeader
          searchValue={timelineSearch}
          onSearchChange={setTimelineSearch}
        />

        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
          <div className="flex flex-col space-y-6 lg:col-span-3">
            <HistoricalOverviewPanel />
            <HistoricalTimeRangePanel />
            <HistoricalScriptureReferencesPanel
              references={HISTORICAL_SCRIPTURE_REFERENCES}
            />
          </div>

          <div className="space-y-6 lg:col-span-9">
            <HistoricalJourneyPanel prophets={prophets} />
            <HistoricalCivilizationsPanel
              civilizations={HISTORICAL_CIVILIZATIONS}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
          <div className="flex flex-col items-center justify-between rounded-xl border border-border bg-background p-5 opacity-80 lg:col-span-3">
            <div className="mb-4 w-full text-xs font-black tracking-widest text-primary uppercase">
              --- GLOBAL MAP ---
            </div>
            <div className="relative flex min-h-[140px] w-full flex-1 items-center justify-center rounded-lg border border-dashed border-teal-500/20 p-2">
              <Globe className="h-full w-full text-teal-900/30" />
              <div className="absolute top-1/2 left-1/2 h-2 w-2 animate-ping rounded-full bg-amber-400 shadow-sm" />
              <div
                className="absolute top-1/3 left-1/3 h-1.5 w-1.5 animate-ping rounded-full bg-teal-400 shadow-sm"
                style={{ animationDelay: "500ms" }}
              />
            </div>
          </div>

          <div className="lg:col-span-6">
            <HistoricalEventsPanel events={HISTORICAL_EVENTS} />
          </div>
          <HistoricalInsightsPanel />
        </div>

        <HistoricalStatusFooter />
      </div>
    </section>
  )
}
