"use client"

import { useState } from "react"
import { ContextBlock } from "@core/ui"

type LunarDayItem = {
  hijriDay: number
  gregorianDate: string
  phaseName: string
  illumination: number
  isAyyamulBidh: boolean
  moonrise: string
  moonset: string
  icon: string
}

/* eslint-disable @typescript-eslint/no-magic-numbers -- Astronomical calculations and phase approximations for lunar days */
const LUNAR_DAYS: LunarDayItem[] = Array.from({ length: 30 }, (_, i) => {
  const dayNum = i + 1
  let phaseName = "Waxing Crescent"
  let illumination = Math.min(100, Math.round((dayNum / 15) * 100))
  let icon = "🌒"

  if (dayNum === 1) {
    phaseName = "New Moon (Hilal)"
    icon = "🌑"
    illumination = 2
  } else if (dayNum <= 7) {
    phaseName = "Waxing Crescent"
    icon = "🌒"
  } else if (dayNum === 8) {
    phaseName = "First Quarter"
    icon = "🌓"
    illumination = 50
  } else if (dayNum <= 12) {
    phaseName = "Waxing Gibbous"
    icon = "🌔"
  } else if (dayNum >= 13 && dayNum <= 15) {
    phaseName = "Full Moon (Bulan Purnama)"
    icon = "🌕"
    illumination = 100
  } else if (dayNum <= 22) {
    phaseName = "Waning Gibbous"
    icon = "🌖"
    illumination = Math.round(((30 - dayNum) / 15) * 100)
  } else if (dayNum === 23) {
    phaseName = "Last Quarter"
    icon = "🌗"
    illumination = 50
  } else {
    phaseName = "Waning Crescent"
    icon = "🌘"
    illumination = 15
  }

  const isAyyamulBidh = dayNum === 13 || dayNum === 14 || dayNum === 15

  return {
    hijriDay: dayNum,
    gregorianDate: `2026-07-${String(dayNum).padStart(2, "0")}`,
    phaseName,
    illumination,
    isAyyamulBidh,
    moonrise: `${String((18 + Math.floor(dayNum * 0.8)) % 24).padStart(2, "0")}:15 WIB`,
    moonset: `${String((5 + Math.floor(dayNum * 0.8)) % 24).padStart(2, "0")}:45 WIB`,
    icon,
  }
})
const DEFAULT_SELECTED_INDEX = 13
/* eslint-enable @typescript-eslint/no-magic-numbers */

export function LunarCalendarView() {
  const [selectedDay, setSelectedDay] = useState<LunarDayItem>(LUNAR_DAYS[DEFAULT_SELECTED_INDEX]!)

  return (
    <>
      <ContextBlock
        title="KALENDER HIJRIYAH & LUNAR PHASE TRACKER"
        subtitle="Pemantauan fase bulan (Lunar Phases) secara presisi, jadwal Ayyamul Bidh, dan sinkronisasi penanggalan Hijriyah untuk ibadah puasa sunnah."
        operation="LUNAR-ORBIT-TRACKER"
        status="ONLINE"
        accentColor="astronomy"
      />

      {/* Selected Day Telemetry Panel */}
      {selectedDay && (
        <div className="panel-box bg-space/95 space-y-4 border border-primary/50 p-6 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-primary/20 pb-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedDay.icon}</span>
              <div>
                <h3 className="font-display text-sm font-black text-primary">
                  HARI KE-{selectedDay.hijriDay} SAFAR 1448 H
                </h3>
                <p className="text-[10px] text-primary">
                  {selectedDay.phaseName} • {selectedDay.gregorianDate}
                </p>
              </div>
            </div>

            {selectedDay.isAyyamulBidh && (
              <div className="tag-clip tag-clip-yellow tag-clip animate-pulse px-3 py-1 text-xs font-bold">
                ✨ HARI PUASA AYYAMUL BIDH (SUNNAH)
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
            <div className="bg-space tag-clip border border-primary/20 p-3">
              <span className="block text-[9px] text-primary">
                {/* ILUMINASI REMBULAN */}
              </span>
              <span className="text-sm font-bold text-accent">
                {selectedDay.illumination}% LIGHT
              </span>
            </div>
            <div className="bg-space tag-clip border border-primary/20 p-3">
              <span className="block text-[9px] text-primary">
                {/* MOONRISE (TERBIT) */}
              </span>
              <span className="text-success text-sm font-bold">
                {selectedDay.moonrise}
              </span>
            </div>
            <div className="bg-space tag-clip border border-primary/20 p-3">
              <span className="block text-[9px] text-primary">
                {/* MOONSET (TERBENAM) */}
              </span>
              <span className="text-sm font-bold text-primary">
                {selectedDay.moonset}
              </span>
            </div>
            <div className="bg-space tag-clip border border-primary/20 p-3">
              <span className="block text-[9px] text-primary">
                {/* ANJURAN IBADAH */}
              </span>
              <span className="text-xs font-bold text-primary">
                {selectedDay.isAyyamulBidh
                  ? "Puasa Sunnah & Qiyam"
                  : "Zikir & Tadabbur"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 30-Day Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-primary">
          <span>{/* PETA ROTASI 30 HARI HIJRIYAH */}</span>
          <span className="text-[10px] text-primary">
            KLIK HARI UNTUK TELEMETRI LENGKAP
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
          {LUNAR_DAYS.map((day) => {
            const isSelected = selectedDay.hijriDay === day.hijriDay
            return (
              <button
                key={day.hijriDay}
                onClick={() => setSelectedDay(day)}
                className={`tag-clip space-y-1 border p-3 text-center transition-all ${
                  isSelected
                    ? "border-primary bg-primary/20 text-white shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                    : day.isAyyamulBidh
                      ? "border-accent/50 bg-accent/10 text-accent"
                      : "bg-space border-primary/20 text-primary hover:border-primary/60"
                }`}
              >
                <div className="text-xl">{day.icon}</div>
                <div className="text-xs font-bold">HARI {day.hijriDay}</div>
                <div className="text-[8px] opacity-75">{day.illumination}%</div>
                {day.isAyyamulBidh && (
                  <div className="text-[7px] font-black text-accent uppercase">
                    AYYAMUL BIDH
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
