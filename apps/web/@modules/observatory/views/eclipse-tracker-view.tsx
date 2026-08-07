"use client"

import { useState, useEffect } from "react"
import {
  Moon,
  Sun,
  Clock,
  Compass,
  Globe,
  Settings,
  Calendar,
  Activity,
  CheckCircle2,
  Camera,
  MapPin,
  ArrowRight,
  Download,
  AlertTriangle,
  Info,
  Circle,
  Eye,
  ShieldAlert,
  Target,
  FileText,
  BookOpen,
  Terminal,
  Radio,
  Power,
  RefreshCw,
  Shield,
} from "lucide-react"

type EclipseData = {
  id: string
  date: string
  type: string
  location: string
  duration: string
  timestamp: number
  magnitude: string
  coverage: string
}

const UPCOMING_ECLIPSES: Record<string, EclipseData> = {
  SOLAR: {
    id: "ecl-1",
    date: "AUGUST 12, 2026",
    type: "TOTAL",
    location: "Arctic, Greenland, Iceland, Spain",
    duration: "2m 17s",
    timestamp: new Date("2026-08-12T18:47:32Z").getTime(),
    magnitude: "1.044",
    coverage: "100%",
  },
  LUNAR: {
    id: "ecl-2",
    date: "MARCH 3, 2026",
    type: "TOTAL",
    location: "Americas, Europe, Africa, Asia",
    duration: "58m 19s",
    timestamp: new Date("2026-03-03T11:34:00Z").getTime(),
    magnitude: "1.15",
    coverage: "100%",
  }
}

export function EclipseTrackerView() {
  const [dailyData, setDailyData] = useState<any>(null)
  const [now, setNow] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<"SOLAR" | "LUNAR">("SOLAR")
  
  const [astroData, setAstroData] = useState({
    flux: 143,
    kp: 1.33,
    sunspot: 78,
    speed: 402,
    bz: -1.8,
  })

  useEffect(() => {
    setIsMounted(true)
    setNow(Date.now())
    const interval = setInterval(() => {
      setNow(Date.now())
      setAstroData(prev => ({
        flux: prev.flux + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3),
        kp: +(prev.kp + (Math.random() > 0.5 ? 0.02 : -0.02)).toFixed(2),
        sunspot: Math.max(0, prev.sunspot + (Math.random() > 0.8 ? 1 : (Math.random() < 0.2 ? -1 : 0))),
        speed: prev.speed + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 4),
        bz: +(prev.bz + (Math.random() > 0.5 ? 0.1 : -0.1)).toFixed(1),
      }))
    }, 1000)

    const fetchDaily = async () => {
      try {
        const res = await fetch("/api/daily")
        const json = await res.json()
        setDailyData(json)
      } catch (e) {
        console.error("Failed to fetch daily data", e)
      }
    }
    fetchDaily()

    return () => clearInterval(interval)
  }, [])

  if (!isMounted)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020813] font-mono text-sm tracking-widest text-indigo-500">
        INITIALIZING ORBITAL RADAR...
      </div>
    )

  const nextEclipse = UPCOMING_ECLIPSES[activeTab]!
  const timeDiff = Math.max(0, nextEclipse.timestamp - now)
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((timeDiff / 1000 / 60) % 60)
  const seconds = Math.floor((timeDiff / 1000) % 60)

  return (
    <div className="min-h-screen bg-[#020813] p-4 font-sans text-[#8F9FB3] selection:bg-indigo-500/30">
      <div className="mx-auto max-w-[1400px] space-y-4">
        {/* ═══ HEADER BAR ═══ */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-widest text-white uppercase">
                ECLIPSE TRACKER (KUSUF/KHUSUF RADAR)
              </h1>
              <p className="mt-1 max-w-xl text-[10px] leading-relaxed text-[#8F9FB3]">
                NASA-backed solar and lunar eclipse monitoring system. 
                This module detects stellar light anomalies and provides 
                real-time recommendations for Eclipse Prayers (Kusuf/Khusuf).
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-6">
            <div className="text-right">
              <div className="mb-1 text-[8px] tracking-widest text-[#8F9FB3] uppercase">
                OPERATION MODE
              </div>
              <div className="text-[10px] font-bold tracking-widest text-white uppercase">
                ORBITAL-ALIGNMENT
              </div>
            </div>
            <div className="text-right">
              <div className="mb-1 text-[8px] tracking-widest text-[#8F9FB3] uppercase">
                SYSTEM STATUS
              </div>
              <div className="flex items-center justify-end gap-1.5 text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                ONLINE
              </div>
            </div>
          </div>
        </div>

        {/* ═══ TOP ROW: 12-COL GRID ═══ */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* LEFT: Current Eclipse Block (Col 1-4) */}
          <div className="flex flex-col gap-4 lg:col-span-4">
            <div className="relative flex-1 overflow-hidden rounded-xl border border-white/5 bg-[#040C1A] p-5">
              <div className="mb-4 flex items-center gap-2 text-[9px] font-bold tracking-widest text-indigo-400 uppercase">
                <Activity className="h-3.5 w-3.5" /> CURRENT ECLIPSE
                <span className="ml-2 flex items-center gap-1 text-emerald-400">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />{" "}
                  LIVE
                </span>
              </div>

              <div className="relative z-10 mt-6 mb-6 flex items-center gap-4">
                <div className="relative -ml-4 flex h-36 w-36 shrink-0 items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-indigo-500/10 blur-2xl" />
                  <img
                    src="/assets/eclipse_total.png"
                    alt="Eclipse"
                    className="h-full w-full object-cover mix-blend-screen"
                    style={{
                      maskImage:
                        "radial-gradient(circle, black 50%, transparent 75%)",
                      WebkitMaskImage:
                        "radial-gradient(circle, black 50%, transparent 75%)",
                    }}
                  />
                </div>
                <div className="relative z-20 transition-all duration-500">
                  <div className={`mb-2 w-max rounded border ${activeTab === 'SOLAR' ? 'border-indigo-500/30 bg-indigo-600/20 text-indigo-300' : 'border-rose-500/30 bg-rose-600/20 text-rose-300'} px-2 py-0.5 text-[8px] font-bold tracking-widest uppercase transition-colors`}>
                    TOTAL {activeTab} ECLIPSE
                  </div>
                  <h2 className="text-2xl leading-tight font-black tracking-wider text-white">
                    {nextEclipse.date}
                  </h2>
                  <div className="mt-1 mb-2 font-mono text-xs text-white">
                    18:47:32 UTC+0
                  </div>
                  <div className="flex items-center gap-1 text-[9px] leading-snug tracking-widest text-emerald-400 uppercase">
                    <MapPin className="h-3 w-3 shrink-0" />{" "}
                    {nextEclipse.location}
                  </div>
                </div>
              </div>

              {/* Countdown */}
              <div className="relative z-10 mb-6 flex gap-2">
                {[
                  { val: days.toString().padStart(2, "0"), label: "DAYS" },
                  { val: hours.toString().padStart(2, "0"), label: "HOURS" },
                  { val: minutes.toString().padStart(2, "0"), label: "MINS" },
                  { val: seconds.toString().padStart(2, "0"), label: "SECS" },
                ].map((t) => (
                  <div
                    key={t.label}
                    className="flex w-14 flex-1 flex-col items-center rounded border border-white/10 bg-black/40 py-2"
                  >
                    <span className="font-mono text-base font-bold text-white">
                      {t.val}
                    </span>
                    <span className="mt-0.5 text-[6px] tracking-widest text-[#8F9FB3] uppercase">
                      {t.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="relative z-10 mb-4 grid grid-cols-4 gap-2 border-t border-white/5 pt-4 text-center">
                <div>
                  <div className="mb-1 text-[7px] tracking-widest text-[#8F9FB3] uppercase">
                    MAGNITUDE
                  </div>
                  <div className="font-mono text-xs font-bold text-white">
                    {nextEclipse.magnitude}
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-[7px] tracking-widest text-[#8F9FB3] uppercase">
                    MAX COVERAGE
                  </div>
                  <div className="font-mono text-xs font-bold text-emerald-400">
                    {nextEclipse.coverage}
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-[7px] tracking-widest text-[#8F9FB3] uppercase">
                    DURATION
                  </div>
                  <div className="font-mono text-xs font-bold text-white">
                    {nextEclipse.duration}
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-[7px] tracking-widest text-[#8F9FB3] uppercase">
                    TYPE
                  </div>
                  <div className="text-xs font-bold text-indigo-400 uppercase">
                    {nextEclipse.type}
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-auto rounded border border-indigo-500/30 bg-indigo-900/20 p-3">
                <div className="mb-1 flex items-center gap-2 text-[9px] font-bold tracking-widest text-white uppercase">
                  <ShieldAlert className="h-3 w-3 text-indigo-400" /> KUSUF PRAYER PROTOCOL
                </div>
                <p className="text-[9px] leading-relaxed text-indigo-200/70">
                  Total solar eclipse trajectory confirmed. Strong recommendation to establish Eclipse Prayers (Shalat al-Kusuf) and increase repentance (Istighfar) during the celestial phenomenon.
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase">
              <div className="mr-2 flex shrink-0 items-center gap-2 text-white">
                <Activity className="h-3 w-3 text-indigo-400" /> ECLIPSE TYPE
                COMPARISON
              </div>
              <button 
                onClick={() => setActiveTab("SOLAR")}
                className={`flex-1 border-b-2 py-2 text-center transition-colors ${activeTab === "SOLAR" ? "border-indigo-500 text-indigo-400" : "border-transparent text-[#8F9FB3] hover:text-white"}`}
              >
                SOLAR ECLIPSE
              </button>
              <button 
                onClick={() => setActiveTab("LUNAR")}
                className={`flex-1 border-b-2 py-2 text-center transition-colors ${activeTab === "LUNAR" ? "border-rose-500 text-rose-400" : "border-transparent text-[#8F9FB3] hover:text-white"}`}
              >
                LUNAR ECLIPSE
              </button>
            </div>
          </div>

          {/* CENTER: Summary & Map (Col 5-9) */}
          <div className="flex flex-col gap-4 lg:col-span-5">
            <div className="rounded-xl border border-white/5 bg-[#040C1A] p-5">
              <div className="mb-5 text-[9px] font-bold tracking-widest text-white uppercase">
                ECLIPSE SUMMARY
              </div>
              <div className="mb-8 grid grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Sun className="h-6 w-6 text-amber-500" />
                  <div>
                    <div className="text-[7px] tracking-widest text-[#8F9FB3] uppercase">
                      EVENT TYPE
                    </div>
                    <div className="mt-0.5 text-[10px] leading-tight font-bold text-white">
                      Total Solar Eclipse
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Compass className="h-6 w-6 text-indigo-400" />
                  <div>
                    <div className="text-[7px] tracking-widest text-[#8F9FB3] uppercase">
                      NODE
                    </div>
                    <div className="mt-0.5 text-[10px] font-bold text-white">
                      Descending
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-indigo-400" />
                  <div>
                    <div className="text-[7px] tracking-widest text-[#8F9FB3] uppercase">
                      SAROS SERIES
                    </div>
                    <div className="mt-0.5 text-[10px] font-bold text-white">
                      137
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-6 w-6 text-purple-400" />
                  <div>
                    <div className="text-[7px] tracking-widest text-[#8F9FB3] uppercase">
                      GAMMA
                    </div>
                    <div className="mt-0.5 text-[10px] font-bold text-white">
                      0.3581
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="relative mb-2 px-2">
                <div className="absolute top-[9px] right-6 left-6 z-0 h-px bg-white/10" />
                <div className="relative z-10 flex justify-between text-center">
                  {[
                    { phase: "P1", name: "Partial Start", time: "16:43 UTC" },
                    { phase: "U1", name: "Totality Begin", time: "18:45 UTC" },
                    {
                      phase: "MAX",
                      name: "Maximum Eclipse",
                      time: "18:47 UTC",
                      highlight: true,
                    },
                    { phase: "U4", name: "Totality End", time: "18:48 UTC" },
                    { phase: "P4", name: "Partial End", time: "20:49 UTC" },
                  ].map((p, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div
                        className={`mb-2 flex h-[18px] w-[18px] items-center justify-center rounded-full text-[6px] font-bold ${p.highlight ? "bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.8)] ring-4 ring-purple-500/20" : "border border-indigo-500/50 bg-[#040C1A] text-indigo-400"}`}
                      >
                        {p.phase}
                      </div>
                      <div
                        className={`text-[7px] leading-tight tracking-widest uppercase ${p.highlight ? "font-bold text-purple-400" : "text-[#8F9FB3]"}`}
                      >
                        {p.name}
                      </div>
                      <div className="mt-0.5 font-mono text-[8px] text-white/50">
                        {p.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Visibility Map */}
            <div className="flex flex-1 flex-col rounded-xl border border-white/5 bg-[#040C1A] p-5">
              <div className="mb-4 text-[9px] font-bold tracking-widest text-white uppercase">
                VISIBILITY MAP
              </div>
              <div className="relative mb-4 flex min-h-[160px] flex-1 items-center justify-center overflow-hidden rounded-lg border border-white/5 bg-black">
                <div
                  className="absolute inset-0 opacity-40 mix-blend-screen"
                  style={{
                    backgroundImage: 'url("/assets/world-map.svg")',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="absolute h-16 w-[120%] rotate-[18deg] bg-purple-500/20 blur-xl" />
                <div className="absolute h-1 w-[120%] rotate-[18deg] bg-purple-500/80 shadow-[0_0_15px_rgba(168,85,247,1)]" />

                <div className="absolute top-3 right-3 space-y-2 rounded border border-white/10 bg-black/80 p-3 text-[6px] tracking-widest uppercase backdrop-blur">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-purple-500" /> Path of Totality
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-indigo-500/60" /> {">"} 90%
                    Visibility
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-indigo-500/30" /> 50% - 90%
                    Visibility
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-indigo-500/10" /> {"<"} 50%
                    Visibility
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 border border-white/20" /> Not
                    Visible
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-400" />
                  <div>
                    <div className="text-[6px] tracking-widest text-[#8F9FB3] uppercase">
                      BEST VIEW
                    </div>
                    <div className="mt-0.5 text-[9px] leading-tight font-bold text-white">
                      Greenland
                    </div>
                    <div className="mt-0.5 text-[7px] text-emerald-400">
                      100% Totality
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-400" />
                  <div>
                    <div className="text-[6px] tracking-widest text-[#8F9FB3] uppercase">
                      DURATION (MAX)
                    </div>
                    <div className="mt-0.5 font-mono text-[10px] text-white">
                      2m 17s
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Target className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-400" />
                  <div>
                    <div className="text-[6px] tracking-widest text-[#8F9FB3] uppercase">
                      ELEVATION (MAX)
                    </div>
                    <div className="mt-0.5 font-mono text-[10px] text-white">
                      63.4°
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Sun className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-400" />
                  <div>
                    <div className="text-[6px] tracking-widest text-[#8F9FB3] uppercase">
                      SUN ALTITUDE
                    </div>
                    <div className="mt-0.5 font-mono text-[10px] text-white">
                      38.7°
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Details & Guide (Col 10-12) */}
          <div className="flex flex-col gap-4 lg:col-span-3">
            <div className="flex-1 rounded-xl border border-white/5 bg-[#040C1A] p-5">
              <div className="mb-5 text-[9px] font-bold tracking-widest text-white uppercase">
                ECLIPSE DETAILS
              </div>
              <div className="space-y-3">
                {[
                  { label: "Date", val: "August 12, 2026", icon: Calendar },
                  { label: "Hijri Date", val: "29 Safar 1448 H", icon: Moon },
                  { label: "Type", val: "Total Solar Eclipse", icon: Circle },
                  {
                    label: "Saros Series",
                    val: "137 (Member 23 of 72)",
                    icon: Activity,
                  },
                  { label: "Path Width", val: "258 km", icon: Target },
                  { label: "Shadow Speed", val: "1,863 km/h", icon: Globe },
                  { label: "Moon Angular Size", val: "31.6'", icon: Moon },
                  { label: "Sun Angular Size", val: "31.5'", icon: Sun },
                  { label: "Delta T", val: "69.2 s", icon: Clock },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-[10px]"
                  >
                    <div className="flex items-center gap-2 text-[#8F9FB3]">
                      <item.icon className="h-3 w-3" />
                      {item.label}
                    </div>
                    <div className="font-mono text-[9px] text-white">
                      {item.val}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-[#040C1A] p-5">
              <div className="mb-4 border-b border-white/10 pb-3 text-[9px] font-bold tracking-widest text-white uppercase">
                ECLIPSE PRAYER (KUSUF) TIMELINE
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[8px] font-bold tracking-widest uppercase">
                  <div className="flex items-center gap-2 text-amber-500">
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />{" "}
                    Eclipse Starts (P1)
                  </div>
                  <div className="font-mono text-[9px] text-white">
                    16:43 UTC
                  </div>
                </div>
                <div className="flex items-center justify-between rounded border border-indigo-500/20 bg-indigo-500/10 p-2 text-[8px] font-bold tracking-widest uppercase">
                  <div className="flex items-center gap-2 text-indigo-300">
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400" />{" "}
                    Recommended Prayer Start
                  </div>
                  <div className="font-mono text-[9px] font-bold text-white">
                    18:30 UTC
                  </div>
                </div>
                <div className="flex items-center justify-between text-[8px] font-bold tracking-widest uppercase">
                  <div className="flex items-center gap-2 text-purple-400">
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />{" "}
                    Maximum Eclipse (MAX)
                  </div>
                  <div className="font-mono text-[9px] text-white">
                    18:47 UTC
                  </div>
                </div>
                <div className="flex items-center justify-between text-[8px] font-bold tracking-widest uppercase">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />{" "}
                    Totality Ends (U4)
                  </div>
                  <div className="font-mono text-[9px] text-white">
                    18:48 UTC
                  </div>
                </div>
                <div className="flex items-center justify-between text-[8px] font-bold tracking-widest uppercase">
                  <div className="flex items-center gap-2 text-[#8F9FB3]">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#8F9FB3]" />{" "}
                    Eclipse Ends (P4)
                  </div>
                  <div className="font-mono text-[9px] text-white">
                    20:49 UTC
                  </div>
                </div>
              </div>
              <button className="mt-5 flex w-full items-center justify-center gap-2 rounded border border-indigo-500/30 py-2 text-[7px] font-bold tracking-widest text-indigo-400 uppercase transition-colors hover:bg-indigo-500/10 hover:text-white">
                <BookOpen className="h-3 w-3" /> VIEW FULL PRAYER GUIDE
              </button>
            </div>
          </div>
        </div>

        {/* ═══ MIDDLE ROW: 4 COLS ═══ */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          {/* Projections */}
          <div className="flex flex-col rounded-xl border border-white/5 bg-[#040C1A] p-5 md:col-span-3">
            <div className="mb-5 flex items-center gap-2 text-[9px] font-bold tracking-widest text-white uppercase">
              <Calendar className="h-3.5 w-3.5 text-indigo-400" /> 10-YEAR
              ORBITAL PROJECTIONS
            </div>
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-12 gap-2 border-b border-white/10 pb-2 text-[6px] tracking-widest text-[#8F9FB3] uppercase">
                <div className="col-span-4">DATE</div>
                <div className="col-span-4">TYPE</div>
                <div className="col-span-2 text-center">MAG.</div>
                <div className="col-span-2 text-right">MAX DUR.</div>
              </div>
              {[
                {
                  d: "Feb 6, 2027",
                  t: "Annular Solar",
                  m: "0.964",
                  md: "7m 51s",
                  hl: false,
                },
                {
                  d: "Aug 2, 2027",
                  t: "Total Solar",
                  m: "1.056",
                  md: "6m 23s",
                  hl: true,
                },
                {
                  d: "Jan 26, 2028",
                  t: "Annular Solar",
                  m: "0.937",
                  md: "10m 27s",
                  hl: false,
                },
                {
                  d: "Jan 22, 2028",
                  t: "Total Solar",
                  m: "1.104",
                  md: "5m 10s",
                  hl: true,
                },
                {
                  d: "Jun 21, 2030",
                  t: "Annular Solar",
                  m: "0.941",
                  md: "7m 06s",
                  hl: false,
                },
              ].map((x, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-12 items-center gap-2 text-[8px] font-bold ${x.hl ? "text-amber-400" : "text-white"}`}
                >
                  <div className="col-span-4 truncate font-mono">{x.d}</div>
                  <div className="col-span-4 truncate">{x.t}</div>
                  <div className="col-span-2 text-center font-mono">{x.m}</div>
                  <div className="col-span-2 text-right font-mono">{x.md}</div>
                </div>
              ))}
            </div>
            <button className="mt-4 flex w-full items-center justify-center gap-1 border-t border-white/5 pt-4 text-[7px] tracking-widest text-indigo-400 uppercase transition-colors hover:text-white">
              VIEW 10-YEAR PROJECTION LOG <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {/* Astro Data */}
          <div className="flex flex-col rounded-xl border border-white/5 bg-[#040C1A] p-5 md:col-span-3">
            <div className="mb-5 flex items-center gap-2 text-[9px] font-bold tracking-widest text-white uppercase">
              <Activity className="h-3.5 w-3.5 text-indigo-400" /> ASTRO DATA
              (REAL-TIME)
            </div>
            <div className="flex-1 space-y-4">
              {[
                { l: "Solar Flux (F10.7)", v: `${astroData.flux} sfu`, i: Sun },
                { l: "Kp Index", v: `${astroData.kp.toFixed(2)} (Quiet)`, i: Activity },
                { l: "Sunspot Number", v: `${astroData.sunspot}`, i: Circle },
                { l: "Solar Wind Speed", v: `${astroData.speed} km/s`, i: ArrowRight },
                { l: "IMF Bz", v: `${astroData.bz.toFixed(1)} nT`, i: Compass },
                { l: "Geomagnetic Field", v: "Stable", i: Globe },
              ].map((x, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-[9px]"
                >
                  <div className="flex items-center gap-2 text-[#8F9FB3]">
                    <x.i className="h-3.5 w-3.5" /> {x.l}
                  </div>
                  <div className="font-mono font-bold text-white">{x.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="flex flex-col rounded-xl border border-white/5 bg-[#040C1A] p-5 md:col-span-3">
            <div className="mb-5 flex items-center gap-2 text-[9px] font-bold tracking-widest text-white uppercase">
              <ShieldAlert className="h-3.5 w-3.5 text-emerald-400" />{" "}
              OBSERVATION PROTOCOLS
            </div>
            <div className="flex-1 space-y-3">
              {[
                { text: "Use certified solar eclipse glasses", checked: true },
                { text: "Avoid direct naked-eye observation", checked: true },
                { text: "Prepare prayer (Kusuf) station", checked: true },
                { text: "Increase Dhikr & Repentance", checked: true },
                { text: "Log observational telemetry data", checked: false },
              ].map((x, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-[9px] text-white"
                >
                  <div
                    className={`mt-0.5 flex h-3 w-3 shrink-0 items-center justify-center rounded-full border ${x.checked ? "border-emerald-500 bg-emerald-500/20 text-emerald-400" : "border-white/20 text-transparent"}`}
                  >
                    {x.checked && <CheckCircle2 className="h-2.5 w-2.5" />}
                  </div>
                  <span
                    className={
                      x.checked
                        ? "leading-snug opacity-100"
                        : "leading-snug opacity-50"
                    }
                  >
                    {x.text}
                  </span>
                </div>
              ))}
            </div>
            <button className="mt-4 flex w-full items-center justify-center gap-2 rounded border border-white/10 py-2 text-[7px] tracking-widest text-white uppercase transition-colors hover:bg-white/5">
              <Download className="h-3 w-3" /> DOWNLOAD SAFETY CHECKLIST
            </button>
          </div>

          {/* Science Insight */}
          <div className="relative flex flex-col overflow-hidden rounded-xl border border-white/5 bg-[#040C1A] p-5 md:col-span-3">
            <div className="relative z-10 mb-4 flex items-center gap-2 text-[9px] font-bold tracking-widest text-white uppercase">
              <Info className="h-3.5 w-3.5 text-indigo-400" /> SCIENCE & INSIGHT
            </div>
            <p className="relative z-10 text-[9px] leading-relaxed text-[#8F9FB3]">
              A total solar eclipse occurs when the Moon passes exactly between the Earth and the Sun, completely obscuring the solar disk. This phenomenon presents a rare scientific opportunity to study the solar corona and validate celestial mechanics.
            </p>
            <button className="relative z-10 mt-auto flex w-max items-center gap-1 text-[7px] tracking-widest text-indigo-400 uppercase transition-colors hover:text-white">
              ACCESS DEEP RESEARCH <ArrowRight className="h-3 w-3" />
            </button>
            <div className="pointer-events-none absolute -right-8 -bottom-8 z-0 h-40 w-40 opacity-40 mix-blend-screen">
              <img
                src="/assets/eclipse_total.png"
                alt="Eclipse"
                className="h-full w-full object-cover"
                style={{
                  maskImage:
                    "radial-gradient(circle, black 50%, transparent 75%)",
                  WebkitMaskImage:
                    "radial-gradient(circle, black 50%, transparent 75%)",
                }}
              />
            </div>
          </div>
        </div>

        {/* ═══ SENSORS & DIAGNOSTICS ROW ═══ */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 mb-4">
          
          {/* Spectroscopy */}
          <div className="flex flex-col rounded-xl border border-white/5 bg-[#040C1A] p-5 md:col-span-4">
            <div className="mb-4 flex items-center justify-between text-[9px] font-bold tracking-widest text-white uppercase">
              <div className="flex items-center gap-2">
                <Activity className="h-3.5 w-3.5 text-indigo-400" /> SPECTROSCOPY
              </div>
              <span className="text-emerald-400 animate-pulse">NOMINAL</span>
            </div>
            <div className="flex-1 space-y-4">
              {[
                { lbl: "Hydrogen (Hα)", val: 87, color: "bg-rose-500" },
                { lbl: "Helium (He I)", val: 42, color: "bg-amber-500" },
                { lbl: "Iron (Fe XIV)", val: 65, color: "bg-emerald-500" },
                { lbl: "Calcium (Ca K)", val: 28, color: "bg-indigo-500" },
              ].map((s, i) => (
                <div key={i} className="space-y-1 text-[8px]">
                  <div className="flex justify-between text-[#8F9FB3]">
                    <span>{s.lbl}</span>
                    <span className="font-mono text-white">{s.val}%</span>
                  </div>
                  <div className="h-1 w-full overflow-hidden rounded-full bg-black/50">
                    <div className={`h-full ${s.color} transition-all duration-1000`} style={{ width: `${s.val + (astroData.kp > 1.33 ? 3 : -3)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Logs */}
          <div className="flex flex-col rounded-xl border border-white/5 bg-[#040C1A] p-5 md:col-span-4 relative overflow-hidden">
            <div className="mb-4 flex items-center gap-2 text-[9px] font-bold tracking-widest text-white uppercase">
              <Terminal className="h-3.5 w-3.5 text-indigo-400" /> LIVE SENSOR LOGS
            </div>
            <div className="flex-1 font-mono text-[8px] leading-relaxed text-indigo-300/70 space-y-1 overflow-hidden">
              <div className="animate-pulse text-emerald-400">[SYS] Telemetry stream active... OK</div>
              <div>[RADAR] Acquiring limb profile... {astroData.flux}sfu</div>
              <div>[DATA] Solar wind density: 4.2 p/cm³</div>
              <div className="text-emerald-400">[SYNC] JPL Uplink connected</div>
              <div className="opacity-70">[SYS] Adjusting tracking rate...</div>
              {astroData.bz < -1.75 && <div className="text-amber-400">[WARN] Minor Bz fluctuation detected</div>}
              {astroData.speed > 403 && <div className="text-rose-400">[ERR] Thermal variance in Sector 4</div>}
              <div className="opacity-50">[SYS] Compensating focus array... OK</div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#040C1A] to-transparent pointer-events-none" />
          </div>

          {/* Command Uplink */}
          <div className="flex flex-col rounded-xl border border-white/5 bg-[#040C1A] p-5 md:col-span-4">
            <div className="mb-4 flex items-center gap-2 text-[9px] font-bold tracking-widest text-white uppercase">
              <Radio className="h-3.5 w-3.5 text-indigo-400" /> COMMAND UPLINK
            </div>
            <div className="grid grid-cols-2 gap-3 flex-1">
              <button className="group relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border border-indigo-500/30 bg-indigo-500/10 p-3 text-indigo-300 transition-all hover:border-indigo-400 hover:bg-indigo-500/20 hover:shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                <div className="absolute top-1.5 left-2 font-mono text-[5px] text-indigo-500 opacity-70">[SEQ_01]</div>
                <div className="absolute inset-0 -translate-x-[150%] skew-x-[30deg] bg-gradient-to-r from-transparent via-indigo-400/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[150%]" />
                <Power className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="font-mono text-[8px] font-bold tracking-[0.15em]">REBOOT SUN CORE</span>
              </button>
              
              <button className="group relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-emerald-300 transition-all hover:border-emerald-400 hover:bg-emerald-500/20 hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                <div className="absolute top-1.5 left-2 font-mono text-[5px] text-emerald-500 opacity-70">[SEQ_02]</div>
                <div className="absolute inset-0 -translate-x-[150%] skew-x-[30deg] bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[150%]" />
                <RefreshCw className="h-5 w-5 transition-transform group-hover:scale-110 group-hover:animate-spin" />
                <span className="font-mono text-[8px] font-bold tracking-[0.15em]">SYNC GRAVITY FIELD</span>
              </button>
              
              <button className="group relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-amber-300 transition-all hover:border-amber-400 hover:bg-amber-500/20 hover:shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                <div className="absolute top-1.5 left-2 font-mono text-[5px] text-amber-500 opacity-70">[SEQ_03]</div>
                <div className="absolute inset-0 -translate-x-[150%] skew-x-[30deg] bg-gradient-to-r from-transparent via-amber-400/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[150%]" />
                <Shield className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="font-mono text-[8px] font-bold tracking-[0.15em]">DEPLOY LUNAR SHIELD</span>
              </button>
              
              <button className="group relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-rose-300 transition-all hover:border-rose-400 hover:bg-rose-600/30 hover:shadow-[0_0_20px_rgba(225,29,72,0.8)]">
                <div className="absolute inset-0 bg-rose-500/10 animate-pulse" />
                <div className="absolute top-1.5 right-2 flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
                </div>
                <div className="absolute top-1.5 left-2 font-mono text-[5px] text-rose-500 opacity-70">[CRITICAL]</div>
                <div className="absolute inset-0 -translate-x-[150%] skew-x-[30deg] bg-gradient-to-r from-transparent via-rose-400/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[150%]" />
                <AlertTriangle className="h-5 w-5 transition-transform group-hover:scale-110 relative z-10" />
                <span className="font-mono text-[8px] font-bold tracking-[0.15em] relative z-10 text-rose-200">ORBITAL OVERRIDE</span>
              </button>
            </div>
          </div>
        </div>

        {/* ═══ BOTTOM ROW: SCRIPTURES & COMMUNITY ═══ */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          {/* Ayat */}
          <div className="flex flex-col rounded-xl border border-white/5 bg-[#040C1A] p-5 md:col-span-3">
            <div className="mb-4 flex items-center gap-2 text-[9px] font-bold tracking-widest text-white uppercase">
              <Moon className="h-3.5 w-3.5 text-indigo-400" /> DIVINE SCRIPTURE (QURAN)
            </div>
            <div
              className="font-arabic mb-3 text-right text-xl leading-[1.8] text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
              dir="rtl"
            >
              {dailyData?.ayah?.textArabic ||
                "وَالشَّمْسِ وَضُحَاهَا ۝ وَالْقَمَرِ إِذَا تَلَاهَا"}
            </div>
            <div className="mb-2 text-[8px] leading-relaxed text-[#8F9FB3] italic">
              "
              {dailyData?.ayah?.translationId ||
                "By the sun and its brightness, and by the moon when it follows it."}
              "
            </div>
            <div className="mb-4 text-[7px] font-bold tracking-widest text-emerald-400 uppercase">
              (QS. {dailyData?.ayah?.surahName || "Ash-Shams"}:{" "}
              {dailyData?.ayah?.ayahNumber || "1-2"})
            </div>
            <button className="mt-auto flex items-center justify-center gap-1 border-t border-white/5 pt-4 text-[7px] tracking-widest text-indigo-400 uppercase transition-colors hover:text-white">
              <BookOpen className="h-3 w-3" /> READ FULL CHAPTER
            </button>
          </div>

          {/* Hadis */}
          <div className="flex flex-col rounded-xl border border-white/5 bg-[#040C1A] p-5 md:col-span-3">
            <div className="mb-4 flex items-center gap-2 text-[9px] font-bold tracking-widest text-white uppercase">
              <FileText className="h-3.5 w-3.5 text-indigo-400" /> PROPHETIC TRADITION (HADITH)
            </div>
            <div className="mb-3 text-[8px] leading-relaxed text-white italic">
              "
              {dailyData?.hadith?.textId ||
                "The sun and the moon are two signs among the signs of Allah. They do not eclipse because of the death or life of anyone. So when you see them, invoke Allah and pray till the eclipse is clear."}
              "
            </div>
            <div className="mb-4 text-[7px] tracking-widest text-[#8F9FB3] uppercase">
              ({dailyData?.hadith?.bookName || "Sahih al-Bukhari"})
            </div>
            <button className="mt-auto flex items-center justify-center gap-1 border-t border-white/5 pt-4 text-[7px] tracking-widest text-indigo-400 uppercase transition-colors hover:text-white">
              <BookOpen className="h-3 w-3" /> VIEW SOURCE DB
            </button>
          </div>

          {/* Gallery */}
          <div className="flex flex-col rounded-xl border border-white/5 bg-[#040C1A] p-5 md:col-span-3">
            <div className="mb-4 flex items-center gap-2 text-[9px] font-bold tracking-widest text-white uppercase">
              <Camera className="h-3.5 w-3.5 text-indigo-400" /> DOCUMENTATION
              GALLERY
            </div>
            <div className="flex flex-1 items-center gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="group relative aspect-square w-full cursor-pointer overflow-hidden rounded border border-white/10 bg-black/50"
                >
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <Eye className="h-4 w-4 text-white" />
                  </div>
                  <img
                    src="/assets/eclipse_total.png"
                    alt="Gallery"
                    className="h-full w-full scale-125 object-cover opacity-70 mix-blend-screen transition-transform duration-700 group-hover:scale-150 group-hover:opacity-100"
                    style={{
                      maskImage:
                        "radial-gradient(circle, black 50%, transparent 75%)",
                      WebkitMaskImage:
                        "radial-gradient(circle, black 50%, transparent 75%)",
                      filter: `hue-rotate(${i * 45}deg) contrast(1.2)`,
                      transform: `rotate(${i * 72}deg) scale(1.25)`
                    }}
                  />
                </div>
              ))}
              <div className="flex aspect-square w-full cursor-pointer items-center justify-center rounded border border-indigo-500/30 bg-indigo-900/20 transition-colors hover:bg-indigo-900/40">
                <span className="font-mono text-xs text-white">+18</span>
              </div>
            </div>
            <button className="mt-4 flex items-center justify-center gap-1 border-t border-white/5 pt-4 text-[7px] tracking-widest text-indigo-400 uppercase transition-colors hover:text-white">
              <Camera className="h-3 w-3" /> OPEN VISUAL ARCHIVE
            </button>
          </div>

          {/* Community */}
          <div className="flex flex-col rounded-xl border border-white/5 bg-[#040C1A] p-5 md:col-span-3">
            <div className="mb-4 flex items-center gap-2 text-[9px] font-bold tracking-widest text-white uppercase">
              <Globe className="h-3.5 w-3.5 text-indigo-400" /> GLOBAL
              TELEMETRY
            </div>
            <div className="flex h-full flex-1 items-center justify-around text-center">
              <div>
                <div className="mb-1 font-mono text-3xl font-bold text-white">
                  128
                </div>
                <div className="text-[6px] tracking-widest text-[#8F9FB3] uppercase">
                  OBSERVERS ONLINE
                </div>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div>
                <div className="mb-1 font-mono text-3xl font-bold text-emerald-400">
                  306
                </div>
                <div className="text-[6px] tracking-widest text-[#8F9FB3] uppercase">
                  REPORTS TODAY
                </div>
              </div>
            </div>
            <button className="mt-4 flex items-center justify-center gap-1 border-t border-white/5 pt-4 text-[7px] tracking-widest text-indigo-400 uppercase transition-colors hover:text-white">
              <MapPin className="h-3 w-3" /> ACCESS HEATMAP
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
