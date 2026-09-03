import React from "react"
import { OSCabGovernance } from "@views/home/components/os-cab-governance"

export function HomeCabSection() {
  return (
    <section id="cab" className="relative min-h-[60vh] py-20">
      {/* Purple nebula ambient */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-96 w-96 rounded-full bg-muted blur-[120px]" />
      </div>

      <div className="mx-auto mb-8 w-full max-w-[1700px] px-6 sm:px-10">
        <h2 className="font-mono text-[10px] font-black tracking-[0.3em] text-primary/50 uppercase">
          [ SECTION 08B : CHANGE ADVISORY BOARD ]
        </h2>
      </div>
      <div className="mx-auto w-full max-w-[1700px] px-6 sm:px-10">
        <OSCabGovernance />
      </div>
    </section>
  )
}
