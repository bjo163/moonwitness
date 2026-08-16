import React from "react"
import { ErpCabView } from "@modules/cab/views/erp-cab-view"

export function HomeCabSection() {
  return (
    <section id="cab" className="relative min-h-[60vh] py-20">
      {/* Purple nebula glow (changed to yellow to match Q4Q Observatory theme) */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-96 w-96 rounded-full bg-yellow-400/5 blur-[120px]" />
      </div>

      <div className="mx-auto mb-8 w-full max-w-[1700px] px-6 sm:px-10">
        <h2 className="font-mono text-[10px] font-black tracking-[0.3em] text-yellow-400/50 uppercase">
          [ SECTION 08B : UPGRADE UNIVERSE OPERATION ]
        </h2>
      </div>
      <div className="mx-auto w-full max-w-[1700px] px-6 sm:px-10">
        <ErpCabView />
      </div>
    </section>
  )
}
