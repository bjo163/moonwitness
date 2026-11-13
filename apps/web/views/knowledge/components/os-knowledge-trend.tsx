"use client"

import React from "react"
import { KnowledgeTrendHeader } from "./knowledge-trend/knowledge-trend-header"
import { KnowledgeTrendSummaryCards } from "./knowledge-trend/knowledge-trend-summary-cards"
import { KnowledgeTrendHeatmap } from "./knowledge-trend/knowledge-trend-heatmap"
import { KnowledgeTrendTimelineChart } from "./knowledge-trend/knowledge-trend-timeline-chart"
import { KnowledgeTrendPopularVerses } from "./knowledge-trend/knowledge-trend-popular-verses"
import { KnowledgeTrendMultiPanel } from "./knowledge-trend/knowledge-trend-multi-panel"
import { KnowledgeTrendBottomGrid } from "./knowledge-trend/knowledge-trend-bottom-grid"

export function OSKnowledgeTrend() {
  return (
    <section
      id="trends"
      className="bg-background relative z-10 overflow-hidden border-b border-blue-500/30 py-20 font-mono text-foreground"
    >
      {/* ═══ LAYER 1: DEEP SPACE BACKGROUND ══════════════════════════════════ */}
      <div className="pointer-events-none absolute inset-0">
        <div className="theme-grid-bg absolute inset-0 opacity-30" />
        <div className="bg-radial-gradient absolute top-1/3 left-1/2 h-[900px] w-[1400px] -translate-x-1/2 from-blue-900/10 via-transparent to-transparent blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] space-y-4 px-4">
        {/* ═══ TOP HEADER (Blueprint 13) ══════════════════════════════════════ */}
        <KnowledgeTrendHeader />

        {/* ═══ LAYER 2: TRENDING THIS WEEK (Row 1) ════════════════════════════ */}
        <KnowledgeTrendSummaryCards />

        {/* ═══ LAYER 3: HEATMAP + TIMELINE + VERSES (Row 2) ═══════════════════ */}
        <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-12">
          <KnowledgeTrendHeatmap />
          <KnowledgeTrendTimelineChart />
          <KnowledgeTrendPopularVerses />
        </div>

        {/* ═══ LAYER 4: MULTI-PANEL 5 COLUMNS (Row 3) ═════════════════════════ */}
        <KnowledgeTrendMultiPanel />

        {/* ═══ LAYER 5: BOTTOM ROW ════════════════════════════════════════════ */}
        <KnowledgeTrendBottomGrid />
      </div>
    </section>
  )
}
