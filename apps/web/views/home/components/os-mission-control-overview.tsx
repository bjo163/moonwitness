"use client"

import { useEffect, useState } from "react"
import { Section, SectionBadge } from "@workspace/ui"
import { MissionControlActivityFeed } from "./mission-control-activity-feed"
import { MissionControlDoctrinePanel } from "./mission-control-doctrine-panel"
import { MissionControlGlobeMatrix } from "./mission-control-globe-matrix"
import { MissionControlScriptureTicker } from "./mission-control-scripture-ticker"

export function OSMissionControlOverview() {
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
    <Section id="mission-control-overview" borderColor="cyan" className="relative">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-radial-gradient absolute top-1/3 left-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 from-blue-900/20 via-transparent to-transparent blur-[140px]" />
      </div>

      <div className="relative z-10 space-y-10">
        <SectionBadge number="03" label="operations overview OVERVIEW" />
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
          <MissionControlDoctrinePanel />
          <MissionControlGlobeMatrix />
          <MissionControlActivityFeed clock={clockWIB} />
        </div>
        <MissionControlScriptureTicker />
      </div>
    </Section>
  )
}
