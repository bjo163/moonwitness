"use client"

import {
  SunlightBenefitsPanel,
  SunlightExposurePanel,
  SunMoodPanel,
  VitaminDPanel,
} from "./sun-position-monitoring-sections"

export function SunPositionDataMonitoring() {
  return (
    <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <VitaminDPanel />
      <SunlightBenefitsPanel />
      <SunlightExposurePanel />
      <SunMoodPanel />
    </div>
  )
}
