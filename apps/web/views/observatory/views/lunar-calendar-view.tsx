"use client"

import { useState, useEffect } from "react"
import { getMoonData } from "@moon/compute"
import { LunarCalendarHero } from "../components/lunar/lunar-calendar-hero"
import { LunarCalendarGrid, type LunarDayItem } from "../components/lunar/lunar-calendar-grid"
import { LunarTelemetryPanel } from "../components/lunar/lunar-telemetry-panel"

export function LunarCalendarView() {
  const [days, setDays] = useState<LunarDayItem[]>([])
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const res = await fetch("/api/calendar")
        const json = await res.json()
        const apiDays = json.days || []

        const computedDays: LunarDayItem[] = []
        const today = new Date()

        for (let i = 0; i < 35; i++) {
          const apiDay = apiDays[i % (apiDays.length || 1)] || {}
          const date = new Date(today.getFullYear(), today.getMonth(), 1 + i)
          const moon = getMoonData(date)
          const hijriDay = ((i + 1) % 30) || 30

          let icon = "🌒"
          if (moon.phaseName.includes("NEW")) icon = "🌑"
          else if (moon.phaseName.includes("FULL")) icon = "🌕"
          else if (moon.phaseName.includes("FIRST")) icon = "🌓"
          else if (moon.phaseName.includes("LAST")) icon = "🌗"
          else if (moon.phaseName.includes("WANING GIBBOUS")) icon = "🌖"
          else if (moon.phaseName.includes("WAXING GIBBOUS")) icon = "🌔"
          else if (moon.phaseName.includes("WANING CRESCENT")) icon = "🌘"

          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
          const gMonth = monthNames[date.getMonth()] || "Aug"

          computedDays.push({
            ...apiDay,
            hijriDay,
            hijriMonthName: hijriDay <= 15 ? "Safar" : "Rabi' I",
            hijriYear: "1448",
            gregorianDate: `${date.getDate()} ${gMonth} ${date.getFullYear()}`,
            gregorianDay: date.getDate(),
            gregorianMonthName: gMonth,
            gregorianYear: String(date.getFullYear()),
            isAyyamulBidh: hijriDay >= 13 && hijriDay <= 15,
            phaseName: moon.phaseName,
            icon,
            illumination: Math.round(moon.illumination),
            moonrise: apiDay.moonrise || "18:30",
            moonset: apiDay.moonset || "05:45",
          })
        }
        setDays(computedDays)
        setIsLoading(false)
      } catch {
        setIsLoading(false)
      }
    }

    fetchCalendar()
  }, [])

  if (isLoading || days.length === 0 || !days[0]) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-card font-mono text-xs tracking-widest text-amber-400">
        INITIALIZING LUNAR EPHEMERIS TELEMETRY...
      </div>
    )
  }

  const selectedDay: LunarDayItem = days[selectedDayIndex] || days[0]!

  return (
    <div className="min-h-screen overflow-x-hidden bg-card pb-12 font-sans text-white selection:bg-amber-500/30">
      <div className="mx-auto max-w-[1800px] space-y-6 px-4 pt-6 lg:px-6">
        {/* 1. Header Hero */}
        <LunarCalendarHero
          currentMonth={selectedDay.hijriMonthName}
          currentYear={selectedDay.hijriYear}
          hilalStatus="ASTRONOMICAL CALCULATION (HISAB) & IMKANUR RUKYAT"
        />

        {/* 2. Main 2-Column Content Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* LEFT: 35-day Calendar Grid */}
          <div className="lg:col-span-2">
            <LunarCalendarGrid
              days={days}
              selectedIndex={selectedDayIndex}
              onSelectDay={setSelectedDayIndex}
            />
          </div>

          {/* RIGHT: Selected Day Telemetry Panel */}
          <div>
            <LunarTelemetryPanel day={selectedDay} />
          </div>
        </div>
      </div>
    </div>
  )
}
