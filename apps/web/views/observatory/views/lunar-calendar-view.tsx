"use client"

import { useState, useEffect } from "react"
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
        if (json.days && json.days.length > 0) {
          const mockDays: LunarDayItem[] = []
          for (let i = 0; i < 35; i++) {
            const apiDay = json.days[i % json.days.length]
            const hijriDay = i < 30 ? i + 1 : i - 29

            let phaseName = "Waxing Crescent"
            let icon = "🌒"
            let illumination = Math.min(100, Math.round((hijriDay / 15) * 100))
            if (hijriDay === 1) {
              phaseName = "New Moon (Hilal)"
              icon = "🌑"
              illumination = 2
            } else if (hijriDay <= 7) {
              phaseName = "Waxing Crescent"
              icon = "🌒"
            } else if (hijriDay === 8) {
              phaseName = "First Quarter"
              icon = "🌓"
              illumination = 50
            } else if (hijriDay <= 12) {
              phaseName = "Waxing Gibbous"
              icon = "🌔"
            } else if (hijriDay >= 13 && hijriDay <= 15) {
              phaseName = "Full Moon (Purnama)"
              icon = "🌕"
              illumination = 100
            } else if (hijriDay <= 22) {
              phaseName = "Waning Gibbous"
              icon = "🌖"
              illumination = Math.round(((30 - hijriDay) / 15) * 100)
            } else if (hijriDay === 23) {
              phaseName = "Last Quarter"
              icon = "🌗"
              illumination = 50
            } else {
              phaseName = "Waning Crescent"
              icon = "🌘"
              illumination = 15
            }

            mockDays.push({
              ...apiDay,
              hijriDay,
              hijriMonthName: i < 30 ? "Safar" : "Rabi' I",
              hijriYear: "1448",
              gregorianDate: `${1 + i > 31 ? 1 + i - 31 : 1 + i} ${1 + i > 31 ? "Aug" : "Jul"} 2026`,
              gregorianDay: 1 + i > 31 ? 1 + i - 31 : 1 + i,
              gregorianMonthName: 1 + i > 31 ? "Aug" : "Jul",
              gregorianYear: "2026",
              isAyyamulBidh: hijriDay >= 13 && hijriDay <= 15,
              phaseName,
              icon,
              illumination,
              moonrise: apiDay.moonrise || "18:30",
              moonset: apiDay.moonset || "05:45",
            })
          }
          setDays(mockDays)
        }
        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching lunar calendar:", err)
        setIsLoading(false)
      }
    }

    fetchCalendar()
  }, [])

  if (isLoading || days.length === 0 || !days[0]) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#040814] font-mono text-xs tracking-widest text-amber-400">
        INITIALIZING LUNAR EPHEMERIS TELEMETRY...
      </div>
    )
  }

  const selectedDay: LunarDayItem = days[selectedDayIndex] || days[0]!

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#040814] pb-12 font-sans text-white selection:bg-amber-500/30">
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
