"use client"

import React, { useState, useEffect } from "react"
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react"

export function HijriCalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [hijriDateStr, setHijriDateStr] = useState("")
  const [gregorianStr, setGregorianStr] = useState("")

  useEffect(() => {
    // Format Hijri
    try {
      const formatter = new Intl.DateTimeFormat("en-US-u-ca-islamic-nu-latn", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      setHijriDateStr(formatter.format(currentDate))
    } catch (e) {
      setHijriDateStr("Unknown Hijri Date")
    }

    // Format Gregorian
    const gFormatter = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    setGregorianStr(gFormatter.format(currentDate))
  }, [currentDate])

  const prevDay = () => {
    const d = new Date(currentDate)
    d.setDate(d.getDate() - 1)
    setCurrentDate(d)
  }

  const nextDay = () => {
    const d = new Date(currentDate)
    d.setDate(d.getDate() + 1)
    setCurrentDate(d)
  }

  const resetToday = () => setCurrentDate(new Date())

  return (
    <div className="bg-space/60 rounded-2xl border border-cyan-500/20 p-5 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-sans text-xs font-bold tracking-wider text-cyan-400 uppercase">
          Chrono Converter
        </h3>
        <CalendarIcon className="h-4 w-4 text-primary/50" />
      </div>

      <div className="flex flex-col gap-4">
        {/* Date Display */}
        <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-black/40 p-4 text-center shadow-inner">
          {/* Subtle decoration */}
          <Star className="absolute -top-3 -right-3 h-12 w-12 text-primary/5 opacity-20" />

          <div className="mb-1 font-mono text-sm font-bold text-white">
            {gregorianStr}
          </div>
          <div className="mx-auto my-3 h-px w-1/2 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
          <div className="font-serif text-lg font-bold tracking-wide text-cyan-400 drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]">
            {hijriDateStr}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={prevDay}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/20 bg-black/20 text-cyan-400 transition-colors hover:bg-cyan-500/20"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            onClick={resetToday}
            className="flex-1 rounded-lg border border-cyan-500/20 bg-black/20 py-1.5 text-[10px] font-bold tracking-widest text-primary uppercase transition-colors hover:bg-cyan-500/20"
          >
            Today
          </button>

          <button
            onClick={nextDay}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/20 bg-black/20 text-cyan-400 transition-colors hover:bg-cyan-500/20"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
