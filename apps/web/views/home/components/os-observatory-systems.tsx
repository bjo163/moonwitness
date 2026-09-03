"use client"

import React, { useState, useEffect } from "react"
import { Clock } from "lucide-react"

import { useObservatoryData } from "@moon/client"
import { ObservatoryLeftColumn } from "./observatory/observatory-left-column"
import { ObservatoryCenterColumn } from "./observatory/observatory-center-column"
import { ObservatoryRightColumn } from "./observatory/observatory-right-column"
import { ObservatoryTelemetry } from "./observatory/observatory-telemetry"
import { ObservatoryBottomDeck } from "./observatory/observatory-bottom-deck"

export function OSObservatorySystems() {
  const [clockWIB, setClockWIB] = useState("06:50:16 WIB")
  const obs = useObservatoryData()

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
    <section
      id="observatory"
      className="relative z-10 overflow-hidden border-b border-primary/30 py-20 font-mono text-foreground"
    >
      {/* ═══ LAYER 1: DEEP SPACE modern GRADIENT & NEBULA MATRIX ═════════════ */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          maskImage: "linear-gradient(to bottom, transparent, black 150px)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 150px)",
        }}
      >
        <div className="theme-grid-bg absolute inset-0 opacity-20" />
        <div className="bg-radial-gradient absolute bottom-1/3 left-1/2 h-[700px] w-[1300px] -translate-x-1/2 from-primary/10 via-blue-900/15 to-transparent blur-[160px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,240,255,0.02)_1px,transparent_1px)] bg-[size:100%_4px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-10 px-6 sm:px-10">
        {/* ═══ SECTION HEADER ══════════════════════ */}
        <div className="flex flex-col justify-between gap-6 border-b border-border pb-6 md:flex-row md:items-end">
          <div className="max-w-2xl space-y-4">
            <h2 className="font-mono text-3xl font-black tracking-wider text-foreground uppercase drop-shadow-sm sm:text-5xl">
              GLOBAL CELESTIAL MONITORING TERMINAL
            </h2>
            <p className="border-l-2 border-primary pl-3 font-sans text-xs leading-relaxed text-primary italic">
              &ldquo;And the moon — We have determined for it phases until it
              returns [appearing] like the old date stalk.&rdquo;{" "}
              <span className="ml-1 font-mono font-black text-primary not-italic">
                (Qur&apos;an 36:39)
              </span>
            </p>
          </div>

          {/* Atomic Clock & Date Terminal Badge */}
          <div className="bg-background/40 flex shrink-0 items-center gap-4 rounded-xl border border-border p-4 shadow-sm backdrop-blur-xl transition-all duration-500 hover:border-border">
            <Clock className="h-10 w-10 shrink-0 animate-pulse text-primary drop-shadow-sm" />
            <div className="text-left">
              <div className="font-mono text-2xl font-black tracking-widest text-foreground drop-shadow-sm">
                {clockWIB}
              </div>
              <div className="mt-0.5 text-[11px] font-bold text-primary uppercase">
                {obs.loading
                  ? "SYNCING DATE..."
                  : `${obs.hijri.day} ${obs.hijri.month} ${obs.hijri.year}`}
              </div>
              <div className="font-mono text-[10px] tracking-wider text-primary">
                SYSTEM TIME UTC+7 • ATOMIC SYNC
              </div>
            </div>
          </div>
        </div>

        {/* ═══ LAYER 3 & 4: THREE-COLUMN CELESTIAL COMMAND MATRIX ═ */}
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
          {/* LEFT COLUMN: MOON STATUS & HIJRI CALENDAR (Col 1-3) */}
          <ObservatoryLeftColumn obs={obs} />

          {/* CENTER COLUMN: LIVE 3D ORBITAL SIMULATION TERMINAL */}
          <ObservatoryCenterColumn obs={obs} />

          {/* RIGHT COLUMN: UPCOMING EVENTS, SUN POS, & QIBLA DIAL (Col 10-12) */}
          <ObservatoryRightColumn obs={obs} />
        </div>

        {/* ═══ LAYER 5: LIVE TELEMETRY SENSOR GRID ═ */}
        <ObservatoryTelemetry obs={obs} />

        {/* ═══ LAYER 3: QUICK ACCESS TOOLBAR | SYSTEM FEED | GEO LOCATION ═ */}
        <ObservatoryBottomDeck />
      </div>
    </section>
  )
}
