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

      const currentPop = 8118000000 + (secSinceBase * netGrowthPerSec)
      
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
    <div className="bg-space flex flex-col rounded-xl border border-white/10 p-4 lg:col-span-4 xl:col-span-3">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-[9px] font-black tracking-widest text-primary uppercase flex items-center gap-2">
          GLOBAL POPULATION PULSE
          <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded-[2px] text-[8px] border border-primary/30 animate-pulse">LIVE</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center py-4">
        <Users className="h-8 w-8 text-white/20 mb-2" />
        <div className="font-mono text-3xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] tracking-widest">
          {population.toLocaleString("en-US")}
        </div>
        <div className="text-[10px] text-primary uppercase font-bold mt-1 tracking-widest">
          ESTIMATED HUMAN LIVES
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/10">
        <div className="bg-white/5 rounded p-2 flex items-center gap-3 border border-success/10">
          <HeartPulse className="h-5 w-5 text-success animate-pulse" />
          <div>
            <div className="text-[8px] text-white/50 uppercase font-bold">Births Today</div>
            <div className="font-mono text-sm font-black text-success">+{birthsToday.toLocaleString()}</div>
          </div>
        </div>
        <div className="bg-white/5 rounded p-2 flex items-center gap-3 border border-red-500/10">
          <Skull className="h-5 w-5 text-red-500" />
          <div>
            <div className="text-[8px] text-white/50 uppercase font-bold">Deaths Today</div>
            <div className="font-mono text-sm font-black text-red-500">-{deathsToday.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
