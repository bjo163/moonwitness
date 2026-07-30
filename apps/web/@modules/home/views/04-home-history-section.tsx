import React from "react"
import { OSHistoricalIntelligence } from "@modules/home/components/os-historical-intelligence"
import { OSPropheticTimeline } from "@modules/home/components/os-prophetic-timeline"

export function HomeHistorySection() {
  return (
    <section
      id="history"
      className="relative flex min-h-screen flex-col gap-10 py-20"
    >
      <div className="mx-auto mb-4 w-full max-w-[1700px] px-6 sm:px-10">
        <h2 className="font-mono text-[10px] font-black tracking-[0.3em] text-cyan-500/50 uppercase">
          [ SECTION 04 : HISTORICAL INTELLIGENCE ]
        </h2>
      </div>
      <div className="mx-auto w-full max-w-[1700px] px-6 sm:px-10">
        <OSHistoricalIntelligence />
      </div>
      <div className="mx-auto mt-10 w-full max-w-[1700px] px-6 sm:px-10">
        <OSPropheticTimeline />
      </div>
    </section>
  )
}
