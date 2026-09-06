"use client"

import React, { useState, useEffect } from "react"
import { Moon, Sun, Clock, Compass, BookOpen, Star, AlertTriangle } from "lucide-react"
import { CelestialMoonSphere } from "@workspace/ui"
import { fetchHilalVisibility } from "@moon/client"
import type { HilalVisibilityEvaluation } from "@workspace/types"
import type { LunarDayItem } from "./lunar-calendar-grid"

interface LunarTelemetryPanelProps {
  day: LunarDayItem
}

export function LunarTelemetryPanel({ day }: LunarTelemetryPanelProps) {
  const calculatedPhase = ((day.hijriDay - 1) % 30) / 29.53
  const [hilalEval, setHilalEval] = useState<HilalVisibilityEvaluation | null>(null)

  useEffect(() => {
    let isMounted = true
    const isCrescentWindow = day.hijriDay <= 3 || day.hijriDay >= 28
    const alt = isCrescentWindow ? (day.hijriDay === 1 ? 5.2 : 2.8) : 12.0
    const elong = isCrescentWindow ? (day.hijriDay === 1 ? 8.1 : 5.0) : 18.0

    fetchHilalVisibility(alt, elong, 0.6)
      .then((res) => {
        if (isMounted) setHilalEval(res)
      })
      .catch(() => {
        if (isMounted) setHilalEval(null)
      })

    return () => {
      isMounted = false
    }
  }, [day.hijriDay])


  return (
    <div className="space-y-4">
      {/* Active Phase Card */}
      <div className="relative overflow-hidden rounded-xl border border-warning/30 bg-gradient-to-b from-card -background p-6 shadow-xl">
        <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-warning/10 blur-2xl" />

        <div className="relative z-10 text-center flex flex-col items-center">
          <CelestialMoonSphere
            phase={calculatedPhase}
            size={180}
            interactive={true}
            showTelemetry={false}
          />
          <h2 className="mt-4 font-mono text-lg font-black text-amber-300 uppercase">
            {day.phaseName}
          </h2>
          <div className="font-mono text-xs text-foreground/50">
            {day.hijriDay} {day.hijriMonthName} {day.hijriYear} AH
          </div>
          <div className="mt-1 font-mono text-[10px] text-foreground/40">
            {day.gregorianDate}
          </div>

          {/* Illumination Progress */}
          <div className="mt-4 space-y-1">
            <div className="flex justify-between font-mono text-[9px]">
              <span className="text-foreground/40">Illumination</span>
              <span className="font-bold text-warning">{day.illumination}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/30">
              <div
                className="h-full bg-amber-400 transition-all duration-500"
                style={{ width: `${day.illumination}%` }}
              />
            </div>
          </div>
        </div>

        {/* Ephemeris Specs */}
        <div className="relative z-10 mt-6 grid grid-cols-2 gap-2 border-t border-border pt-4 font-mono text-[10px]">
          <div className="flex items-center gap-2 rounded bg-card/[0.02] p-2">
            <Moon className="h-4 w-4 text-warning" />
            <div>
              <div className="text-[8px] text-foreground/40">Moonrise</div>
              <div className="text-foreground">{day.moonrise || "18:24"}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded bg-card/[0.02] p-2">
            <Clock className="h-4 w-4 text-warning" />
            <div>
              <div className="text-[8px] text-foreground/40">Moonset</div>
              <div className="text-foreground">{day.moonset || "05:42"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Hilal Visibility Evaluation (MABIMS & Odeh) */}
      {hilalEval && (
        <div className="rounded-xl border border-border bg-card p-4 font-mono text-xs shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <span className="text-foreground font-semibold">HILAL VISIBILITY (IMKANUR RUKYAT)</span>
            <span
              className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                hilalEval.mabims_criterion.passed
                  ? "bg-success/15 text-success border border-success/30"
                  : "bg-warning/15 text-warning border border-warning/30"
              }`}
            >
              MABIMS: {hilalEval.mabims_criterion.status}
            </span>
          </div>
          <div className="mt-2.5 space-y-1.5 text-[11px]">
            <div className="flex justify-between text-muted-foreground">
              <span>Odeh Criterion:</span>
              <span className="text-foreground font-medium">{hilalEval.odeh_criterion.category}</span>
            </div>
            <div className="text-[10px] text-muted-foreground/80 leading-tight">
              {hilalEval.overall_verdict}
            </div>
          </div>
        </div>
      )}

      {/* Ayyamul Bidh / Spiritual Note */}
      {day.isAyyamulBidh && (
        <div className="rounded-xl border border-warning/30 bg-warning/10 p-4 font-mono text-xs text-amber-200 shadow-md">
          <div className="mb-1 flex items-center gap-2 font-black uppercase">
            <Star className="h-4 w-4 text-warning" />
            <span>Ayyamul Bidh (White Days)</span>
          </div>
          <p className="text-[10px] leading-relaxed text-amber-200/80">
            Recommended prophetic fast on the 13th, 14th, and 15th of the lunar month when the moon shines at full illumination.
          </p>
        </div>
      )}

      {/* Celestial Guidance Quote */}
      <div className="rounded-xl border border-border bg-card p-4 text-center font-mono text-[10px]">
        <div className="font-arabic mb-2 text-lg text-warning">
          وَالْقَمَرَ قَدَّرْنَاهُ مَنَازِلَ حَتَّىٰ عَادَ كَالْعُرْجُونِ الْقَدِيمِ
        </div>
        <p className="text-foreground/60 italic">
          &ldquo;And the moon - We have determined for it phases, until it returns like the old date stalk.&rdquo;
        </p>
        <span className="mt-1 block text-[8px] text-warning/60 not-italic">
          (QS. Ya-Sin 36:39)
        </span>
      </div>
    </div>
  )
}
