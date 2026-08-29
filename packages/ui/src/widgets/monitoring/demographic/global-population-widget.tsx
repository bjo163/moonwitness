"use client"

import React, { useEffect, useState } from "react"
import { Users, HeartPulse, Skull } from "lucide-react"

export function GlobalPopulationWidget() {
  const [population, setPopulation] = useState(8118000000)
  const [birthsToday, setBirthsToday] = useState(0)
  const [deathsToday, setDeathsToday] = useState(0)

  useEffect(() => {
    // Base reference: Jan 1, 2024 roughly 8.1B
    const baseDate = new Date("2024-01-01T00:00:00Z").getTime()
    const birthsPerSec = 4.3
    const deathsPerSec = 1.9
    const netGrowthPerSec = birthsPerSec - deathsPerSec

    const updateStats = () => {
      const now = new Date()
      const msSinceBase = now.getTime() - baseDate
      const secSinceBase = msSinceBase / 1000

      const currentPop = 8118000000 + secSinceBase * netGrowthPerSec

      // Calculate today's stats (reset at midnight UTC)
      const startOfDay = new Date(now)
      startOfDay.setUTCHours(0, 0, 0, 0)
      const secSinceMidnight = (now.getTime() - startOfDay.getTime()) / 1000

      setPopulation(Math.floor(currentPop))
      setBirthsToday(Math.floor(secSinceMidnight * birthsPerSec))
      setDeathsToday(Math.floor(secSinceMidnight * deathsPerSec))
    }

    updateStats()
    const id = setInterval(updateStats, 200)

    return () => clearInterval(id)
  }, [])

  return (
    <div className="bg-background flex flex-col rounded-xl border border-white/10 p-4 lg:col-span-4 xl:col-span-3">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[9px] font-black tracking-widest text-primary uppercase">
          GLOBAL POPULATION PULSE
          <span className="animate-pulse rounded-[2px] border border-primary/30 bg-primary/20 px-1.5 py-0.5 text-[8px] text-primary">
            LIVE
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center py-4">
        <Users className="mb-2 h-8 w-8 text-white/20" />
        <div className="font-mono text-3xl font-black tracking-widest text-white drop-shadow-sm">
          {population.toLocaleString("en-US")}
        </div>
        <div className="mt-1 text-[10px] font-bold tracking-widest text-primary uppercase">
          ESTIMATED HUMAN LIVES
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-4">
        <div className="border-success/10 flex items-center gap-3 rounded border bg-white/5 p-2">
          <HeartPulse className="text-success h-5 w-5 animate-pulse" />
          <div>
            <div className="text-[8px] font-bold text-white/50 uppercase">
              Births Today
            </div>
            <div className="text-success font-mono text-sm font-black">
              +{birthsToday.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded border border-red-500/10 bg-white/5 p-2">
          <Skull className="h-5 w-5 text-red-500" />
          <div>
            <div className="text-[8px] font-bold text-white/50 uppercase">
              Deaths Today
            </div>
            <div className="font-mono text-sm font-black text-red-500">
              -{deathsToday.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
