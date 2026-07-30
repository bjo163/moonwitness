import React from "react"
import { OSMissionControlOverview } from "@modules/home/components/os-mission-control-overview"
import { OSGlobalKnowledgeNetwork } from "@modules/home/components/os-global-knowledge-network"
import { OSKnowledgeDock } from "@modules/knowledge/components/os-knowledge-dock"

export function HomeMissionSection() {
  return (
    <section id="mission" className="min-h-screen py-20 flex flex-col gap-10 relative">
      <div className="mx-auto w-full max-w-[1700px] px-6 sm:px-10 mb-4">
        <h2 className="font-mono text-[10px] font-black tracking-[0.3em] text-cyan-500/50 uppercase">
          [ SECTION 07 : MISSION CONTROL ]
        </h2>
      </div>
      <div className="mx-auto w-full max-w-[1700px] px-6 sm:px-10">
        <OSMissionControlOverview />
      </div>
      <div className="mx-auto w-full max-w-[1700px] px-6 sm:px-10 mt-10">
        <OSGlobalKnowledgeNetwork />
      </div>
      <div className="mt-10">
        <OSKnowledgeDock />
      </div>
    </section>
  )
}
