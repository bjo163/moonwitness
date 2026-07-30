import React from "react"
import { OSDivineAstronomy } from "@modules/home/components/os-divine-astronomy"

export function HomeAstronomySection() {
  return (
    <section id="astronomy" className="min-h-screen py-20 relative">
      <div className="mx-auto w-full max-w-[1700px] px-6 sm:px-10 mb-8">
        <h2 className="font-mono text-[10px] font-black tracking-[0.3em] text-cyan-500/50 uppercase">
          [ SECTION 05 : DIVINE ASTRONOMY ]
        </h2>
      </div>
      <div className="mx-auto w-full max-w-[1700px] px-6 sm:px-10">
        <OSDivineAstronomy />
      </div>
    </section>
  )
}
