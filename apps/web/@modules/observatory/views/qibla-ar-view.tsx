"use client"

import { useState, useEffect } from "react"
/* eslint-disable-next-line no-restricted-imports -- Standard icons for Qibla AR view */
import { Camera } from "lucide-react"
import { ContextBlock } from "@core/ui"

const KAABA_BEARING_DEGREES = 295.14
const HEADING_STEP_DEGREES = 2
const FULL_CIRCLE_DEGREES = 360
const ALIGNMENT_TOLERANCE_DEGREES = 5
const SIMULATION_INTERVAL_MS = 100

export function QiblaArView() {
  const [heading, setHeading] = useState(0)
  const [isAligned, setIsAligned] = useState(false)

  const targetKaabaDegrees = KAABA_BEARING_DEGREES

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate smooth gyro movement towards 295°
      setHeading((prev) => {
        const next = (prev + HEADING_STEP_DEGREES) % FULL_CIRCLE_DEGREES
        if (Math.abs(next - targetKaabaDegrees) < ALIGNMENT_TOLERANCE_DEGREES) {
          setIsAligned(true)
        } else {
          setIsAligned(false)
        }
        return next
      })
    }, SIMULATION_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [targetKaabaDegrees])

  return (
    <>
      <ContextBlock
        title="SIMULATOR KOMPAS AUGMENTED REALITY VEKTOR KIBLAT 360°"
        subtitle="Menyelaraskan orientasi arah shalat secara ilmiah menuju Ka'bah Makkah Al-Mukarramah (295.14° NNE) menggunakan telemetry giroskop 360°."
        operation="QIBLA-VECTOR-ALIGNMENT"
        status="ONLINE"
        accentColor="success"
      />

      {/* AR Camera & Scope Simulator */}
      <div className="panel-box bg-space relative space-y-6 overflow-hidden border-2 border-primary/50 p-8 text-center shadow-[0_0_50px_rgba(0,240,255,0.25)]">
        <div className="flex items-center justify-between border-b border-primary/20 pb-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-primary">
            <Camera className="h-4 w-4 text-primary" />
            <span>AR CAMERA VIEWPORT SIMULATOR</span>
          </div>
          <span
            className={`tag-clip tag-clip px-2 py-0.5 text-[9px] font-bold ${isAligned ? "tag-clip-green" : "tag-clip-yellow"}`}
          >
            {isAligned ? "● QIBLA LOCKED" : "○ ROTATING HEADING"}
          </span>
        </div>

        {/* Interactive Gyro Compass Scope */}
        <div className="relative mx-auto flex h-64 w-64 items-center justify-center">
          {/* Outer HUD Rings */}
          <div
            className="absolute inset-0 animate-spin rounded-full border-2 border-dashed border-primary/30"
            style={{ animationDuration: "30s" }}
          />
          <div className="absolute inset-4 rounded-full border border-primary/20" />

          {/* Crosshair Target Scope */}
          <div className="absolute h-0.5 w-full bg-primary/30" />
          <div className="absolute h-full w-0.5 bg-primary/30" />

          {/* Rotating Arrow Indicator */}
          <div
            className="absolute flex h-full w-full items-center justify-center transition-transform duration-100"
            style={{ transform: `rotate(${heading}deg)` }}
          >
            <div className="absolute top-2 flex flex-col items-center">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${isAligned ? "bg-success text-black shadow-[0_0_20px_#00FF66]" : "bg-primary text-black"}`}
              >
                N
              </div>
            </div>
          </div>

          {/* Fixed Qibla Target Vector (295.14°) */}
          <div
            className="pointer-events-none absolute flex h-full w-full items-center justify-center"
            style={{ transform: `rotate(${targetKaabaDegrees}deg)` }}
          >
            <div className="absolute top-2 flex flex-col items-center">
              <div className="tag-clip bg-success px-2 py-0.5 text-[9px] font-black text-black shadow-[0_0_15px_#00FF66]">
                🕋 KAABA 295.14°
              </div>
            </div>
          </div>
        </div>

        {/* Status Telemetry */}
        <div className="grid grid-cols-1 gap-3 pt-2 text-xs sm:grid-cols-3">
          <div className="bg-panel tag-clip border border-primary/20 p-3">
            <span className="block text-[8px] text-primary">
              {/* ORIENTASI SAAT INI */}
            </span>
            <span className="font-bold text-foreground">
              {heading.toFixed(1)}° HEADING
            </span>
          </div>

          <div className="bg-panel tag-clip border border-primary/20 p-3">
            <span className="block text-[8px] text-primary">
              {/* VEKTOR KIBLAT TARGET */}
            </span>
            <span className="text-success font-bold">295.14° NNE</span>
          </div>

          <div className="bg-panel tag-clip border border-primary/20 p-3">
            <span className="block text-[8px] text-primary">
              {/* DEVIASI AKURASI */}
            </span>
            <span className="font-bold text-accent">
              {Math.abs(heading - targetKaabaDegrees).toFixed(1)}° OFFSET
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
