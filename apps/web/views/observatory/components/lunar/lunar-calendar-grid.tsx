"use client"

import React from "react"
import { Moon, Star } from "lucide-react"

export interface LunarDayItem {
  hijriDay: number
  hijriMonthName: string
  hijriYear: string
  gregorianDate: string
  gregorianDay: number
  gregorianMonthName: string
  gregorianYear: string
  phaseName: string
  illumination: number
  isAyyamulBidh: boolean
  moonrise: string
  moonset: string
  icon: string
  holidays?: string[]
}

interface LunarCalendarGridProps {
  days: LunarDayItem[]
  selectedIndex: number
  onSelectDay: (index: number) => void
}

const WEEKDAYS = ["AHAD", "ITSNIN", "TSULATSA", "ARBI'A", "KHAMIS", "JUMU'AH", "SABT"]

export function LunarCalendarGrid({
  days,
  selectedIndex,
  onSelectDay
}: LunarCalendarGridProps) {
  return (
    <div className="space-y-2 rounded-xl border border-white/10 bg-card p-4 shadow-xl">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 border-b border-white/10 pb-2 text-center font-mono text-[9px] font-black text-amber-400/80 uppercase">
        {WEEKDAYS.map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>

      {/* Days 35-grid */}
      <div className="grid grid-cols-7 gap-1.5 pt-1">
        {days.map((day, i) => {
          const isSelected = selectedIndex === i
          return (
            <div
              key={i}
              onClick={() => onSelectDay(i)}
              className={`group relative flex min-h-[72px] cursor-pointer flex-col justify-between rounded-lg border p-2 transition-all duration-200 ${
                isSelected
                  ? "border-amber-500 bg-muted shadow-sm"
                  : day.isAyyamulBidh
                  ? "border-amber-500/30 bg-card hover:border-amber-500/60"
                  : "border-white/5 bg-muted hover:border-white/20 hover:bg-card"
              }`}
            >
              {/* Top Numbers */}
              <div className="flex items-start justify-between font-mono">
                <span
                  className={`text-sm font-black ${
                    isSelected
                      ? "text-amber-400"
                      : day.isAyyamulBidh
                      ? "text-amber-300"
                      : "text-white"
                  }`}
                >
                  {day.hijriDay}
                </span>
                <span className="text-[8px] text-white/40">
                  {day.gregorianDay} {day.gregorianMonthName}
                </span>
              </div>

              {/* Moon Phase Icon & Illumination */}
              <div className="my-1 flex items-center justify-between text-xs">
                <span className="text-base">{day.icon}</span>
                <span className="font-mono text-[8px] text-white/40">
                  {day.illumination}%
                </span>
              </div>

              {/* Tag / Ayyamul Bidh */}
              {day.isAyyamulBidh && (
                <div className="truncate rounded bg-amber-500/20 px-1 py-0.5 text-center font-mono text-[7px] font-bold text-amber-300">
                  AYYAMUL BIDH
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
