"use client"

import {
  SunActivityPanel,
  SunImpactPanel,
  SunResourcesPanel,
  SunlightMapPanel,
} from "./sun-position-analytics-sections"

export function SunPositionAnalytics() {
  return (
    <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
      <SunActivityPanel />
      <SunImpactPanel />
      <SunResourcesPanel />
      <SunlightMapPanel />
    </div>
  )
}
