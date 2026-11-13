"use client"

import React from "react"
import { SunPositionHeader } from "../components/sun-position/sun-position-header"
import { SunPositionMetrics } from "../components/sun-position/sun-position-metrics"
import { SunPositionVisualizations } from "../components/sun-position/sun-position-visualizations"
import { SunPositionDataMonitoring } from "../components/sun-position/sun-position-data-monitoring"
import { SunPositionToolkits } from "../components/sun-position/sun-position-toolkits"
import { SunPositionAnalytics } from "../components/sun-position/sun-position-analytics"
import { SunPositionAdvanced } from "../components/sun-position/sun-position-advanced"
import { SunPositionFooter } from "../components/sun-position/sun-position-footer"

export function SunPositionView() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background p-4 font-sans text-foreground select-none md:p-6">
      {/* ═══ HEADER ROW ═══ */}
      <SunPositionHeader />

      {/* ═══ TOP METRICS ROW ═══ */}
      <SunPositionMetrics />

      {/* ═══ CORE VISUALIZATIONS ROW ═══ */}
      <SunPositionVisualizations />

      {/* ═══ DATA MONITORING ROW ═══ */}
      <SunPositionDataMonitoring />

      {/* ═══ TOOLKITS & ACTIONS ROW ═══ */}
      <SunPositionToolkits />

      {/* ═══ ANALYTICS & SYSTEMS ROW ═══ */}
      <SunPositionAnalytics />

      {/* ═══ ADVANCED ASTRONOMY ROW ═══ */}
      <SunPositionAdvanced />

      {/* ═══ FOOTER ROW ═══ */}
      <SunPositionFooter />
    </div>
  )
}
