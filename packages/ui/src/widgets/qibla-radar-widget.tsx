"use client"
import { SYSTEM_CONSTANTS } from "@workspace/types"
import { useMounted } from "@workspace/hooks"

import { useState, useEffect } from "react"
import { Compass, Clock, Navigation, Loader2 } from "lucide-react"

// Types for Aladhan API responses
type Timings = {
  Fajr: string
  Dhuhr: string
  Asr: string
  Maghrib: string
  Isha: string
  [key: string]: string // For Sunrise, Sunset, Imsak, etc.
}

type PrayerTimingThreshold = {
  name: string
  mins: number
}

const DEFAULT_JAKARTA_QIBLA_DEG = SYSTEM_CONSTANTS.QIBLA_BEARING
const DEFAULT_JAKARTA_LAT = SYSTEM_CONSTANTS.JAKARTA_LAT
const DEFAULT_JAKARTA_LNG = SYSTEM_CONSTANTS.JAKARTA_LNG
const MINUTES_PER_HOUR = 60
const SECONDS_PER_MINUTE = 60
const DHUHA_OFFSET_MINUTES = 20
const HOURS_PER_DAY = 24
const SECONDS_PER_HOUR = 3600

export function QiblaRadarWidget() {
  const mounted = useMounted()
  const [countdownText, setCountdownText] = useState("00:00:00")
  const [nextPrayerName, setNextPrayerName] = useState("...")
  const [radarDegrees, setRadarDegrees] = useState(DEFAULT_JAKARTA_QIBLA_DEG) // Default Jakarta Qibla
  const [locationName, setLocationName] = useState("JAKARTA")
  const [isSyncing, setIsSyncing] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // To store the dynamically fetched schedule in minutes
  const [schedule, setSchedule] = useState<PrayerTimingThreshold[]>([])

  useEffect(() => {
    const fetchTelemetry = async (
      lat: number,
      lng: number,
      isFallback = false
    ) => {
      setIsSyncing(true)
      try {
        // Fetch Qibla
        const qiblaRes = await fetch(
          `https://api.aladhan.com/v1/qibla/${lat}/${lng}`
        )
        const qiblaData = await qiblaRes.json()
        if (qiblaData?.data?.direction) {
          setRadarDegrees(qiblaData.data.direction)
        }

        // Fetch Timings
        const date = new Date()
        const dd = String(date.getDate()).padStart(2, "0")
        const mm = String(date.getMonth() + 1).padStart(2, "0")
        const yyyy = date.getFullYear()

        const timingsRes = await fetch(
          `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${lat}&longitude=${lng}&method=2`
        )
        const timingsData = await timingsRes.json()

        if (timingsData?.data?.timings) {
          const t: Timings = timingsData.data.timings

          // Helper to convert "HH:MM" (or "HH:MM (WIB)") to minutes from midnight
          const toMins = (timeStr?: string) => {
            if (!timeStr) return 0
            const cleanTime = timeStr.split(" ")[0] || "00:00"
            const parts = cleanTime.split(":")
            const h = Number(parts[0]) || 0
            const m = Number(parts[1]) || 0
            return h * MINUTES_PER_HOUR + m
          }

          const dynamicSchedule: PrayerTimingThreshold[] = [
            { name: "Subuh", mins: toMins(t.Fajr) },
            { name: "Dhuha", mins: toMins(t.Sunrise) + DHUHA_OFFSET_MINUTES }, // roughly 20 mins after sunrise
            { name: "Zuhur", mins: toMins(t.Dhuhr) },
            { name: "Asar", mins: toMins(t.Asr) },
            { name: "Maghrib", mins: toMins(t.Maghrib) },
            { name: "Isya", mins: toMins(t.Isha) },
          ].sort((a, b) => a.mins - b.mins)

          setSchedule(dynamicSchedule)

          if (isFallback) {
            setLocationName("JAKARTA (DEFAULT)")
          } else {
            setLocationName(`LAT:${lat.toFixed(2)} LNG:${lng.toFixed(2)}`)
          }
        }
      } catch (err) {
        console.warn("Telemetry Sync Error:", err)
        setErrorMsg("SATELLITE LINK FAILED")
      } finally {
        setIsSyncing(false)
      }
    }

    // Try Geolocation
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchTelemetry(position.coords.latitude, position.coords.longitude)
        },
        (_error) => {
          // Fallback to Jakarta
          fetchTelemetry(DEFAULT_JAKARTA_LAT, DEFAULT_JAKARTA_LNG, true)
        },
        { timeout: 5000 }
      )
    } else {
      // Fallback
      fetchTelemetry(DEFAULT_JAKARTA_LAT, DEFAULT_JAKARTA_LNG, true)
    }
  }, [])

  // Timer logic
  useEffect(() => {
    if (schedule.length === 0) return

    const updateTimer = () => {
      const now = new Date()
      // Local machine time
      const currentMins = now.getHours() * MINUTES_PER_HOUR + now.getMinutes()
      const currentSecs = currentMins * SECONDS_PER_MINUTE + now.getSeconds()

      let target = schedule.find(
        (p) => p.mins * SECONDS_PER_MINUTE > currentSecs
      )
      let isNextDay = false

      if (!target) {
        target = schedule[0]!
        isNextDay = true
      }

      let targetSecs = target.mins * SECONDS_PER_MINUTE
      if (isNextDay) {
        targetSecs += HOURS_PER_DAY * SECONDS_PER_HOUR
      }

      const diffSecs = Math.max(0, targetSecs - currentSecs)
      const hoursLeft = Math.floor(diffSecs / SECONDS_PER_HOUR)
      const minsLeft = Math.floor(
        (diffSecs % SECONDS_PER_HOUR) / MINUTES_PER_HOUR
      )
      const secsLeft = diffSecs % SECONDS_PER_MINUTE

      setNextPrayerName(target.name)
      setCountdownText(
        `${String(hoursLeft).padStart(2, "0")}:${String(minsLeft).padStart(2, "0")}:${String(secsLeft).padStart(2, "0")}`
      )
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [schedule])

  if (!mounted) return null

  return (
    <div className="rounded-xl border border-border/40 bg-card bg-background/90 space-y-4 border border-primary/40 p-4 font-mono shadow-sm sm:p-5">
      <QiblaRadarHeader syncing={isSyncing} hasError={Boolean(errorMsg)} />

      <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2">
        <QiblaRadarVisual
          degrees={radarDegrees}
          locationName={locationName}
          syncing={isSyncing}
        />

        <QiblaNextPrayerCard nextPrayerName={nextPrayerName} countdown={countdownText} syncing={isSyncing} hasError={Boolean(errorMsg)} />
      </div>
    </div>
  )
}

function QiblaNextPrayerCard({
  nextPrayerName,
  countdown,
  syncing,
  hasError,
}: {
  nextPrayerName: string
  countdown: string
  syncing: boolean
  hasError: boolean
}) {
  return <div className="space-y-1.5 rounded-md border border-primary/20 bg-panel p-3">
    <div className="flex items-center justify-between"><span className="flex items-center gap-1 text-[9px] font-bold uppercase text-primary"><Clock className="h-3 w-3 text-accent" /> NEXT CYCLE: <span className="text-accent">{nextPrayerName}</span></span><span className="rounded-md border border-amber-500/40 bg-amber-500/10 px-1.5 py-0 font-mono text-[8px] text-amber-500">COUNTDOWN</span></div>
    <div className="rounded border border-accent/30 bg-background py-1 text-center font-sans text-xl font-black tracking-widest text-accent sm:text-2xl" style={{ textShadow: "0 0 10px rgba(255,230,0,0.3)" }}>{syncing ? "--:--:--" : countdown}</div>
    <div className="flex items-center justify-between text-[8px] text-primary"><span>SYSTEM CHRONO ACCURACY</span><span className={`font-bold ${syncing ? "text-accent" : hasError ? "text-danger" : "text-success"}`}>{syncing ? "SYNCING..." : hasError ? "LOCAL OFFLINE MODE" : "ATOMIC SYNC 100%"}</span></div>
  </div>
}

function QiblaRadarHeader({
  syncing,
  hasError,
}: {
  syncing: boolean
  hasError: boolean
}) {
  return (
    <div className="flex items-center justify-between border-b border-primary/20 pb-2.5">
      <div className="flex items-center gap-2">
        {syncing ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <Compass className="h-4 w-4 animate-spin text-primary" style={{ animationDuration: "12s" }} />}
        <span className="font-sans text-xs font-black tracking-widest text-primary uppercase">// QIBLA VECTOR & TEMPORAL COUNTDOWN</span>
      </div>
      <span className={`rounded-md border px-2 py-0.5 font-mono text-[8px] font-bold ${syncing ? "animate-pulse border-amber-500/40 bg-amber-500/10 text-amber-500" : hasError ? "border-rose-500/40 bg-rose-500/10 text-rose-500" : "border-emerald-500/40 bg-emerald-500/10 text-emerald-500"}`}>{syncing ? "SCANNING..." : hasError ? "SYNC ERROR" : "LIVE TELEMETRY"}</span>
    </div>
  )
}

function QiblaRadarVisual({
  degrees,
  locationName,
  syncing,
}: {
  degrees: number
  locationName: string
  syncing: boolean
}) {
  return (
    <div className="flex items-center gap-4 rounded-md border border-primary/20 bg-panel p-3">
      <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
        <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100" aria-label="Qibla direction radar">
          <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(0, 240, 255, 0.3)" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(0, 240, 255, 0.2)" strokeWidth="1" />
          <circle cx="50" cy="50" r="14" fill="none" stroke="rgba(0, 240, 255, 0.15)" strokeWidth="1" />
          <line x1="50" y1="4" x2="50" y2="96" stroke="rgba(0, 240, 255, 0.25)" strokeWidth="1" />
          <line x1="4" y1="50" x2="96" y2="50" stroke="rgba(0, 240, 255, 0.25)" strokeWidth="1" />
          <g transform={`rotate(${degrees}, 50, 50)`} className="transition-transform duration-1000 ease-in-out">
            <line x1="50" y1="50" x2="50" y2="10" stroke="#00FF66" strokeWidth="2.5" strokeLinecap="round" />
            <polygon points="50,6 46,14 54,14" fill="#00FF66" />
          </g>
        </svg>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center"><span className="h-2 w-2 animate-ping rounded-full bg-success opacity-75" /></div>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-1 text-[9px] uppercase text-primary"><Navigation className="h-3 w-3" /><span className="max-w-[120px] truncate">KAABA ({locationName})</span></div>
        <div className="font-sans text-sm font-black tracking-wider text-success">{syncing ? "---.--°" : `${degrees.toFixed(2)}° N`}</div>
        <p className="text-[9px] italic text-primary">// SATELLITE BEAM LOCKED TO MECCA</p>
      </div>
    </div>
  )
}
