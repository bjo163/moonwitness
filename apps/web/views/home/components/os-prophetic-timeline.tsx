"use client"

import React from "react"
import { PropheticTimelineHeader } from "./prophetic-timeline/prophetic-timeline-header"
import { PropheticTimelineEraNodes } from "./prophetic-timeline/prophetic-timeline-era-nodes"
import { PropheticTimelineHighlights } from "./prophetic-timeline/prophetic-timeline-highlights"
import { PropheticTimelineMapView } from "./prophetic-timeline/prophetic-timeline-map-view"
import { PropheticTimelineFutureEvents } from "./prophetic-timeline/prophetic-timeline-future-events"
import { PropheticTimelineFilters } from "./prophetic-timeline/prophetic-timeline-filters"
import { PropheticTimelineStatsInsights } from "./prophetic-timeline/prophetic-timeline-stats-insights"
import { PropheticTimelinePlaybackBar } from "./prophetic-timeline/prophetic-timeline-playback-bar"

export function OSPropheticTimeline() {
  return (
    <section
      id="timeline"
      className="bg-background relative z-10 overflow-hidden border-b border-orange-500/30 py-20 font-mono text-foreground"
    >
      {/* ═══ LAYER 1: DEEP SPACE BACKGROUND ══════════════════════════════════ */}
      <div className="pointer-events-none absolute inset-0">
        <div className="theme-grid-bg absolute inset-0 opacity-30" />
        <div className="bg-radial-gradient absolute top-1/3 left-1/2 h-[800px] w-[1600px] -translate-x-1/2 from-orange-900/10 via-blue-900/5 to-transparent blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1700px] space-y-4 px-4">
        {/* ═══ TOP HEADER (Blueprint 15) ══════════════════════════════════════ */}
        <PropheticTimelineHeader />

        {/* ═══ LAYER 2: HORIZONTAL ERA TIMELINE ═══════════════════════════════ */}
        <PropheticTimelineEraNodes />

        {/* ═══ LAYER 3: MIDDLE ROW (Highlights, Map, Future Events) ═══════════ */}
        <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-12">
          <PropheticTimelineHighlights />
          <PropheticTimelineMapView />
          <PropheticTimelineFutureEvents />
        </div>

        {/* ═══ LAYER 4: BOTTOM ROW (Filters, Stats, Insights) ═════════════════ */}
        <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-12">
          <PropheticTimelineFilters />
          <PropheticTimelineStatsInsights />
        </div>

        {/* ═══ LAYER 5: PLAYBACK BAR (Bottom Scrubber) ════════════════════════ */}
        <PropheticTimelinePlaybackBar />
      </div>
    </section>
  )
}
