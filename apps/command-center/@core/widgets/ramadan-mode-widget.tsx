"use client"
import { useMounted } from "@core/hooks"

import React, { useState, useEffect } from "react"
import { Moon, Sun, Clock, Star, Flame } from "lucide-react"

// For testing purposes, we assume it's always active
const IS_RAMADAN = true

export function RamadanModeWidget() {
  const mounted = useMounted()
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [target, setTarget] = useState<"Iftar" | "Imsak">("Iftar")

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      // Mock countdown logic: Target 18:00 for Iftar, 04:30 for Imsak
      const targetHour = now.getHours() >= 4 && now.getHours() < 18 ? 18 : 4
      const currentTarget = targetHour === 18 ? "Iftar" : "Imsak"
      setTarget(currentTarget)

      const targetTime = new Date()
      targetTime.setHours(targetHour, 0, 0, 0)
      if (targetHour === 4 && now.getHours() >= 18) {
        targetTime.setDate(targetTime.getDate() + 1)
      }

      const diff = Math.max(0, targetTime.getTime() - now.getTime())
      setTimeLeft({
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  if (!mounted || !IS_RAMADAN) return null

  return (
    <div className="panel-clip relative w-full overflow-hidden border border-emerald-500/30 bg-black/40 p-5 font-mono">
      {/* Background Effect */}
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl" />

      <div className="relative z-10 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Moon className="h-4 w-4 fill-emerald-400/20 text-emerald-400" />
          <h3 className="text-xs font-bold tracking-widest text-emerald-400 uppercase drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">
            Ramadan Protocol
          </h3>
        </div>
        <div className="flex h-1.5 w-1.5 items-center justify-center">
          <span className="absolute h-3 w-3 animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[9px] tracking-widest text-primary/70 uppercase">
            Time until {target}
          </span>
          <div className="flex items-baseline gap-1 font-sans">
            <span className="text-3xl font-black text-white drop-shadow-md">
              {String(timeLeft.hours).padStart(2, "0")}:
              {String(timeLeft.minutes).padStart(2, "0")}
            </span>
            <span className="text-lg font-bold text-emerald-400">
              :{String(timeLeft.seconds).padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          {target === "Iftar" ? (
            <Sun className="h-5 w-5 text-amber-400" />
          ) : (
            <Flame className="h-5 w-5 text-orange-400" />
          )}
        </div>
      </div>

      <div className="relative z-10 mt-4 border-t border-emerald-500/20 pt-3">
        <div className="flex items-center justify-between text-[9px] tracking-widest uppercase">
          <div className="flex items-center gap-1.5 text-primary">
            <Star className="h-3 w-3 text-emerald-400" />
            <span>Tarawih Focus</span>
          </div>
          <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 font-bold text-emerald-400">
            ACTIVE
          </span>
        </div>
      </div>
    </div>
  )
}
