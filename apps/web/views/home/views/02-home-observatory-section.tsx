"use client"

import React from "react"
import { OSObservatorySystems } from "@views/home/components/os-observatory-systems"

export function HomeObservatorySection() {
  return (
    <div className="relative w-full">
      {/* We position the SECTION 02 title absolutely so it sits nicely inside the top padding of OSObservatorySystems */}
      <div className="pointer-events-none absolute top-6 right-0 left-0 z-50 mx-auto w-full max-w-7xl px-6 sm:px-10">
        <h2 className="font-mono text-[10px] font-black tracking-[0.3em] text-cyan-500/50 uppercase">
          [ SECTION 02 : DEEP SPACE OBSERVATORY ]
        </h2>
      </div>

      <OSObservatorySystems />
    </div>
  )
}
