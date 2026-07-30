"use client"

import React, { useState, useEffect } from "react"
import { getMoonData, getIslamicData, PrayerData } from "@workspace/quran-core"

const SECONDS_PER_MINUTE = 60
const MINUTES_PER_HOUR = 60
const MS_PER_SEC = 1000
const MS_PER_MIN = MS_PER_SEC * SECONDS_PER_MINUTE
const MS_PER_HOUR = MS_PER_MIN * MINUTES_PER_HOUR

export function HomeTelemetrySidebarWidget() {
  const [mounted, setMounted] = useState(false)
  const [clockWIB, setClockWIB] = useState("06:50:16 WIB")
  const [currentDate, setCurrentDate] = useState("25 MAY 2025")
  const [countdown, setCountdown] = useState("02:14:36")
  const [hijriDate, setHijriDate] = useState("ACQUIRING...")
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null)
  const [moonData, setMoonData] = useState<{
    phaseName: string
    illumination: string | number
    distance: number
  }>({ phaseName: "ACQUIRING...", illumination: 0, distance: 0 })

  useEffect(() => {
    setTimeout(() => setMounted(true), 0)

    const timer = setInterval(() => {
      const now = new Date()
      setClockWIB(
        now.toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta" }) + " WIB"
      )
      setCurrentDate(
        now
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
          .toUpperCase()
      )

      try {
        const hijri = new Intl.DateTimeFormat("en-GB-u-ca-islamic", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(now)
        setHijriDate(hijri.toUpperCase())
      } catch {
        setHijriDate("1445 AH")
      }

      setMoonData(getMoonData(now))

      // Try to get GPS, fallback to Jakarta
      const lat = -6.2088
      const lng = 106.8456
      
      const pData = getIslamicData(lat, lng, now)
      setPrayerData(pData)

      if (pData.nextPrayerTime) {
        const diff = pData.nextPrayerTime.getTime() - now.getTime()
        if (diff > 0) {
          const h = Math.floor(diff / MS_PER_HOUR)
          const m = Math.floor((diff / MS_PER_MIN) % MINUTES_PER_HOUR)
          const s = Math.floor((diff / MS_PER_SEC) % SECONDS_PER_MINUTE)
          setCountdown(
            `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
          )
        } else {
          setCountdown("00:00:00")
        }
      } else {
        setCountdown("--:--:--")
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative flex w-full max-w-[280px] flex-col rounded border border-white/[0.05] bg-black/40 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-xl">
      <div className="space-y-0.5 border-b border-white/10 pb-4">
        <div className="flex items-center justify-between text-[9px] tracking-[0.2em] text-primary uppercase">
          <span>MOON PHASE</span>
          <div
            className="h-2 w-2 rounded-full bg-white shadow-[0_0_8px_white]"
            style={{ opacity: Number(moonData.illumination) / 100 }}
          />
        </div>
        <div className="text-xl font-bold tracking-wide uppercase">
          {moonData.phaseName}
        </div>
        <div className="text-xs font-bold tracking-widest text-primary">
          {moonData.illumination}% ILLUMINATED
        </div>
      </div>

      <div className="flex items-end justify-between border-b border-white/10 pb-4 mt-3">
        <div className="text-[9px] tracking-[0.2em] text-primary uppercase">
          DISTANCE
        </div>
        <div className="text-sm font-bold tracking-widest">
          {moonData.distance.toLocaleString()} KM
        </div>
      </div>

      <div className="mt-3.5 border-t border-white/10 pt-3.5 font-sans text-[10px] font-medium tracking-widest text-primary uppercase">
        <div>
          NEXT PRAYER <span className="mx-1.5 opacity-50">•</span>{" "}
          {prayerData?.nextPrayer || "ACQUIRING..."}
        </div>
        <div className="mt-1 animate-pulse font-mono text-2xl font-black text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]">
          {countdown}
        </div>
        <div className="mt-0.5 flex justify-end gap-5 pr-1 text-[8px] text-white/50">
          <span>HR</span>
          <span>MIN</span>
          <span>SEC</span>
        </div>
      </div>

      <div className="mt-3.5 border-t border-white/10 pt-3.5 font-sans text-[10px] font-medium tracking-widest text-primary uppercase">
        <div>SYSTEM TIME</div>
        <div className="my-0.5 font-sans text-xl font-light tracking-wide text-primary drop-shadow-[0_0_8px_#00F0FF]">
          {mounted ? clockWIB : "06:50:16 WIB"}
        </div>
        <div className="mt-1 text-xs text-primary">
          DATE <span className="mx-1.5 opacity-50">•</span> {currentDate}
        </div>
        <div className="mt-1 text-xs text-emerald-400">
          HIJRI <span className="mx-1.5 opacity-50">•</span> {hijriDate}
        </div>
      </div>
    </div>
  )
}
