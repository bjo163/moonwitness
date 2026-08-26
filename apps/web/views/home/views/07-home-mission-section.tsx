import React from "react"
import { OSMissionControlOverview } from "@views/home/components/os-mission-control-overview"
import { OSGlobalKnowledgeNetwork } from "@views/home/components/os-global-knowledge-network"
import { OSKnowledgeDock } from "@views/knowledge/components/os-knowledge-dock"

export function HomeMissionSection() {
  return (
    <section
      id="mission"
      className="relative flex min-h-screen flex-col gap-10 py-20"
    >
      <div className="mx-auto mb-4 w-full max-w-[1700px] px-6 sm:px-10">
        <h2 className="font-mono text-[10px] font-black tracking-[0.3em] text-cyan-500/50 uppercase">
          [ SECTION 07 : MISSION CONTROL ]
        </h2>
      </div>
      <div className="mx-auto w-full max-w-[1700px] px-6 sm:px-10">
        <OSMissionControlOverview />
      </div>
      <div className="mx-auto mt-10 w-full max-w-[1700px] px-6 sm:px-10">
        <OSGlobalKnowledgeNetwork />
      </div>
      <div className="mt-10">
        <OSKnowledgeDock />
      </div>
    </section>
  )
}
