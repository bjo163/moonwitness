"use client"

import React, { useEffect, useState } from "react"
import { Target, Clock, AlertTriangle, Moon, Sun, MapPin } from "lucide-react"
import { useGeolocation } from "@core/hooks/use-geolocation"

type PrayerTimesResponse = {
  date: string
  coordinates: { lat: number; lng: number }
  hijri?: { year: number; month: number; day: number; monthName: string }
  times: {
    fajr: string
    sunrise: string
    dhuhr: string
    asr: string
    maghrib: string
    isha: string
  }
}

export function PrayerTimesWidget() {
  const [data, setData] = useState<PrayerTimesResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())

  const geo = useGeolocation()
  
  // Refresh clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Fetch data when geolocation is ready
  useEffect(() => {
    if (geo.loading) return

    const fetchPrayerTimes = async () => {
      try {
        setLoading(true)
        const lat = geo.lat || -6.2
        const lng = geo.lng || 106.8
        const res = await fetch(`/api/witness/astronomy/prayer-times?lat=${lat}&lng=${lng}`)
        if (!res.ok) throw new Error("Failed to fetch prayer times")
        const json = await res.json()
        setData(json)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchPrayerTimes()
    
    // Auto-refresh every hour
    const interval = setInterval(fetchPrayerTimes, 1000 * 60 * 60)
    return () => clearInterval(interval)
  }, [geo.lat, geo.lng, geo.loading])

  // Calculate next prayer and countdown
  let nextPrayerName = "FAJR"
  let nextPrayerTimeDate: Date | null = null
  let countdownStr = "--:--:--"

  if (data) {
    const prayers = [
      { id: "fajr", name: "Fajr", time: data.times.fajr },
      { id: "sunrise", name: "Sunrise", time: data.times.sunrise },
      { id: "dhuhr", name: "Dhuhr", time: data.times.dhuhr },
      { id: "asr", name: "Asr", time: data.times.asr },
      { id: "maghrib", name: "Maghrib", time: data.times.maghrib },
      { id: "isha", name: "Isha", time: data.times.isha },
    ]

    for (const p of prayers) {
      const pTime = new Date(p.time)
      if (currentTime < pTime) {
        nextPrayerName = p.name.toUpperCase()
        nextPrayerTimeDate = pTime
        break
      }
    }

    // If all prayers today have passed, it's Fajr tomorrow (approx)
    if (!nextPrayerTimeDate && prayers.length > 0 && prayers[0]) {
      nextPrayerName = "FAJR (TMRW)"
      const fajrDate = new Date(prayers[0].time)
      fajrDate.setDate(fajrDate.getDate() + 1)
      nextPrayerTimeDate = fajrDate
    }

    if (nextPrayerTimeDate) {
      const diffMs = nextPrayerTimeDate.getTime() - currentTime.getTime()
      if (diffMs > 0) {
        const h = Math.floor(diffMs / 3600000)
        const m = Math.floor((diffMs % 3600000) / 60000)
        const s = Math.floor((diffMs % 60000) / 1000)
        countdownStr = `-${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
      } else {
        countdownStr = "00:00:00"
      }
    }
  }

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  if (loading) {
    return (
      <div className="bg-space/60 rounded-2xl border border-cyan-500/20 p-5 backdrop-blur-xl animate-pulse">
        <div className="h-4 w-32 bg-cyan-500/20 rounded mb-4"></div>
        <div className="h-20 w-full bg-black/40 rounded-xl mb-4"></div>
        <div className="space-y-2">
          <div className="h-8 w-full bg-cyan-500/10 rounded"></div>
          <div className="h-8 w-full bg-cyan-500/10 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="bg-space/60 rounded-2xl border border-red-500/20 p-5 backdrop-blur-xl flex flex-col items-center justify-center text-red-400">
        <AlertTriangle className="h-6 w-6 mb-2" />
        <div className="text-xs font-mono">{error || "Data unavailable"}</div>
      </div>
    )
  }

  return (
    <div className="bg-space/60 rounded-2xl border border-cyan-500/20 p-5 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-sans text-xs font-bold tracking-wider text-cyan-400 uppercase">
            Adhan Command
          </h3>
          <p className="flex items-center gap-1 font-mono text-[9px] text-primary/70 uppercase tracking-widest mt-0.5">
            <MapPin className="h-2.5 w-2.5" />
            {geo.loading ? "LOCATING..." : geo.lat ? `${geo.lat.toFixed(2)}, ${geo.lng?.toFixed(2)}` : "DEFAULT LOC (JKT)"}
          </p>
        </div>
        <Target className="h-4 w-4 text-primary/50" />
      </div>

      {/* TACTICAL COUNTDOWN */}
      <div className="mb-4 flex items-center gap-4 rounded-xl border border-cyan-500/20 bg-black/40 p-4 shadow-inner">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10">
          <Clock className="h-6 w-6 text-cyan-400" />
        </div>
        <div className="flex-1">
          <div className="font-mono text-[10px] text-cyan-400/80">T-MINUS TO {nextPrayerName}</div>
          <div className="font-mono text-2xl font-black text-white tracking-widest tabular-nums drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
            {countdownStr}
          </div>
        </div>
      </div>

      {/* PRAYER LIST */}
      <div className="space-y-2">
        {[
          { id: "Fajr", time: data.times.fajr, icon: Moon },
          { id: "Sunrise", time: data.times.sunrise, icon: Sun },
          { id: "Dhuhr", time: data.times.dhuhr, icon: Sun },
          { id: "Asr", time: data.times.asr, icon: Sun },
          { id: "Maghrib", time: data.times.maghrib, icon: Moon },
          { id: "Isha", time: data.times.isha, icon: Moon },
        ].map((p) => {
          const isNext = p.id.toUpperCase() === nextPrayerName
          return (
            <div
              key={p.id}
              className={`flex items-center justify-between rounded-lg p-2.5 transition-all ${
                isNext
                  ? "bg-cyan-500/20 border border-cyan-500/50 shadow-[0_0_20px_rgba(0,240,255,0.3)] animate-pulse-slow"
                  : "bg-black/20 hover:bg-black/40 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <p.icon className={`h-3.5 w-3.5 ${isNext ? "text-cyan-400 drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]" : "text-primary/50"}`} />
                <span className={`font-sans text-xs font-bold ${isNext ? "text-white" : "text-primary/70"}`}>
                  {p.id}
                </span>
              </div>
              <span className={`font-mono text-xs font-bold tabular-nums ${isNext ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" : "text-white"}`}>
                {formatTime(p.time)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
