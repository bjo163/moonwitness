"use client"

import React, { useState, useEffect } from "react"
import { AnalyticsHeader } from "./analytics/analytics-header"
import { TodaySnapshotPanel } from "./analytics/today-snapshot-panel"
import { KnowledgeProgressPanel } from "./analytics/knowledge-progress-panel"
import { ActivityOverviewPanel } from "./analytics/activity-overview-panel"
import { LearningMetricsRow } from "./analytics/learning-metrics-row"
import { AnalyticsFooterStrip } from "./analytics/analytics-footer-strip"

/**
 * ◈ OS Analytics Insights (Blueprint 09)
 *
 * Modular analytics & telemetry dashboard composing focused metric widgets.
 */
export function OSAnalyticsInsights() {
  const [clockWIB, setClockWIB] = useState("06:50:16 WIB")

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setClockWIB(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          timeZone: "Asia/Jakarta",
        }) + " WIB"
      )
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <section
      id="analytics"
      className="bg-background relative z-10 overflow-hidden border-b border-border py-20 font-mono text-foreground"
    >
      <div className="relative z-10 mx-auto max-w-7xl space-y-6 px-6 sm:px-10">
        {/* Layer 1: Top Header */}
        <AnalyticsHeader clockWIB={clockWIB} />

        {/* Layer 2: Main Grid Panels */}
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
          <TodaySnapshotPanel />
          <KnowledgeProgressPanel />
          <ActivityOverviewPanel />
        </div>

        {/* Layer 3: Learning & Time Investment Panels */}
        <LearningMetricsRow />

        {/* Layer 4: Footer Status Strip */}
        <AnalyticsFooterStrip />
      </div>
    </section>
  )
}
