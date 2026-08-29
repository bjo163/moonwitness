import React from "react"
import { OSAnalyticsInsights } from "@views/home/components/os-analytics-insights"

export function HomeAnalyticsSection() {
  return (
    <section id="analytics" className="relative min-h-screen py-20">
      <div className="mx-auto mb-8 w-full max-w-[1700px] px-6 sm:px-10">
        <h2 className="font-mono text-[10px] font-black tracking-[0.3em] text-primary/50 uppercase">
          [ SECTION 06 : ANALYTICS & INSIGHTS ]
        </h2>
      </div>
      <div className="mx-auto w-full max-w-[1700px] px-6 sm:px-10">
        <OSAnalyticsInsights />
      </div>
    </section>
  )
}
