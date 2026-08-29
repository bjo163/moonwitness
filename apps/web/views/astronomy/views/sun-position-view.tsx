"use client"

import React, { useState, useEffect } from "react"
import {
  Sun,
  CloudSun,
  Activity,
  Battery,
  Wind,
  Heart,
  Smile,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Compass,
  MapPin,
  Target,
  ArrowRight,
  TrendingUp,
  Cpu,
  HardDrive,
  Network,
  Globe,
  Settings,
  Bell,
  Calendar,
  ChevronRight,
  Droplets,
  Shield,
  Eye,
  BookOpen,
  Sunrise,
} from "lucide-react"

export function SunPositionView() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen overflow-x-hidden bg-background p-4 font-sans text-white select-none md:p-6">
      {/* ═══ HEADER ROW ═══ */}
      <div className="relative mb-6 grid min-h-[450px] grid-cols-1 gap-8 overflow-hidden rounded-2xl border border-white/10 bg-background p-6 md:p-10 lg:grid-cols-12">
        {/* Column 1: The Divine Figure (Span 4) */}
        <div className="relative flex min-h-[400px] items-end justify-center lg:col-span-4">
          {/* Background Ambient Glow */}
          <div className="absolute top-[45%] left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-[80px]"></div>

          {/* Intense Sun Behind Figure */}
          <div className="absolute top-[45%] left-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400 mix-blend-screen shadow-sm blur-[6px]"></div>
          {/* Inner Bright Sun */}
          <div className="absolute top-[45%] left-1/2 h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-90 mix-blend-screen blur-[8px]"></div>

          {/* Outer Sun Corona */}
          <div className="absolute top-[45%] left-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1px] border-yellow-300/40 shadow-sm"></div>

          {/* Floor Ring */}
          <div className="absolute bottom-6 left-1/2 h-[60px] w-[320px] -translate-x-1/2 rounded-[100%] border-[3px] border-amber-400 shadow-sm blur-[2px]"></div>
          <div className="absolute bottom-6 left-1/2 h-[60px] w-[320px] -translate-x-1/2 rounded-[100%] border-[1px] border-white/80 blur-[0px]"></div>

          {/* Dark floor fade to hide figure cut-off */}
          <div className="absolute inset-x-0 bottom-0 z-20 h-10 bg-gradient-to-t from-background to-transparent"></div>

          <img
            src="/assets/hero/24-hero.png"
            alt="Divine Figure"
            className="relative z-10 h-[100%] max-h-[420px] w-auto object-contain drop-shadow-sm"
            style={{ objectPosition: "bottom center" }}
          />
        </div>

        {/* Column 2: Center Content (Span 4) */}
        <div className="relative z-10 flex flex-col justify-center lg:col-span-4">
          <h1 className="mb-2 text-3xl font-bold tracking-wider text-white drop-shadow-md md:text-4xl">
            SUNLIGHT INTELLIGENT
          </h1>
          <h2 className="mb-6 text-[10px] font-bold tracking-[0.2em] text-white/70 uppercase">
            Your Daily Source of Light, Energy & Life
          </h2>
          <p className="mb-6 max-w-sm text-[11px] leading-relaxed text-white/60">
            Like the radiant light that touched the blind and gave life, the Sun
            is a mercy for all creation. Use sunlight wisely, live healthy, stay
            grateful.
          </p>
          <div className="relative mt-2 max-w-sm overflow-hidden rounded-lg border border-amber-500/30 bg-black/40 p-4">
            <div className="flex items-start gap-3">
              <Sun className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <div>
                <p className="font-mono text-[9px] leading-relaxed text-cyan-200">
                  "I AM THE LIGHT OF THE WORLD. WHOEVER FOLLOWS ME WILL NEVER
                  WALK IN DARKNESS, BUT WILL HAVE THE LIGHT OF LIFE."
                </p>
                <span className="mt-2 block text-[8px] tracking-widest text-cyan-500 uppercase">
                  - JOHN 8:12
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Right Data (Span 4, split into 2) */}
        <div className="relative z-10 grid grid-cols-2 gap-6 lg:col-span-4">
          {/* Sub-col 1: Mission Status */}
          <div className="flex flex-col justify-center gap-4">
            <div className="mb-2 flex items-center gap-2 border-b border-white/10 pb-2">
              <Target className="h-3 w-3 text-cyan-500" />
              <span className="text-[9px] font-bold tracking-widest text-cyan-400 uppercase">
                MISSION STATUS
              </span>
              <span className="ml-auto flex items-center gap-1.5 text-[8px] font-bold text-emerald-400 uppercase">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"></div>{" "}
                LIVE
              </span>
            </div>

            {[
              { l: "Operation Protocol", v: "SUNLIGHT-INTEL", c: "text-white" },
              { l: "System Sync", v: "ONLINE", c: "text-emerald-400" },
              {
                l: "Global Time",
                v: "30 JULY 2026\n22:18:45 UTC+7",
                c: "text-white",
              },
              {
                l: "Quran Reference",
                v: "Q.S. An-Nur (24:35)",
                c: "text-white",
              },
              { l: "Last Sync", v: "1 MINUTE AGO", c: "text-white/50" },
            ].map((d, i) => (
              <div key={i} className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Target className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[7px] tracking-widest text-muted-foreground uppercase">
                    {d.l}
                  </span>
                </div>
                <span
                  className={`text-right font-mono text-[7px] whitespace-pre-line ${d.c}`}
                >
                  {d.v}
                </span>
              </div>
            ))}

            <button className="group mt-4 flex w-full items-center justify-center gap-2 rounded border border-cyan-500/30 bg-transparent px-4 py-3 text-[8px] tracking-widest text-cyan-400 uppercase transition-colors hover:bg-cyan-500/10">
              VIEW FULL BRIEFING{" "}
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Sub-col 2: Arabic Verse */}
          <div className="flex flex-col justify-center border-l border-white/5 pl-6">
            <h3 className="font-arabic mb-4 text-right text-2xl leading-loose text-amber-400 drop-shadow-sm">
              اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ
            </h3>
            <p className="mb-4 text-[9px] leading-relaxed text-cyan-400">
              Allah is the Light of the Heavens and the Earth.
            </p>
            <p className="text-[8px] leading-relaxed text-white/50">
              The sun runs on its course for a specified term.
              <br />
              <span className="mt-2 block text-muted-foreground">
                - Q.S. Ya-Sin (36:38)
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* ═══ TOP METRICS ROW ═══ */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8">
        {[
          {
            label: "SUNLIGHT NOW",
            value: "782",
            unit: "W/m²",
            desc: "GOOD EXPOSURE",
            icon: Sun,
            color: "text-amber-400",
          },
          {
            label: "UV INDEX",
            value: "5",
            unit: "",
            desc: "MODERATE",
            icon: Target,
            color: "text-amber-400",
          },
          {
            label: "VITAMIN D TODAY",
            value: "92%",
            unit: "",
            desc: "GOOD LEVEL",
            icon: Activity,
            color: "text-amber-400",
          },
          {
            label: "SUN ENERGY",
            value: "846",
            unit: "kWh/m²",
            desc: "HIGH INTENSITY",
            icon: Zap,
            color: "text-amber-400",
          },
          {
            label: "AIR QUALITY",
            value: "42",
            unit: "",
            desc: "GOOD",
            icon: Wind,
            color: "text-amber-400",
          },
          {
            label: "CIRCADIAN SCORE",
            value: "87%",
            unit: "",
            desc: "ALIGNED",
            icon: Clock,
            color: "text-amber-400",
          },
          {
            label: "MOOD BOOST",
            value: "84%",
            unit: "",
            desc: "POSITIVE",
            icon: Smile,
            color: "text-amber-400",
          },
          {
            label: "SPIRITUAL LIGHT",
            value: "99.7%",
            unit: "",
            desc: "CONNECTED",
            icon: Heart,
            color: "text-amber-400",
          },
        ].map((m, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-card p-4 transition-colors hover:border-amber-500/20"
          >
            <div className="mb-2 flex items-center gap-2">
              <m.icon
                className={`h-4 w-4 ${m.color} drop-shadow-sm`}
              />
              <span className="text-[8px] tracking-widest text-muted-foreground uppercase">
                {m.label}
              </span>
            </div>
            <div className="mb-1 font-mono text-2xl font-black text-white">
              {m.value} <span className="text-xs text-white/50">{m.unit}</span>
            </div>
            <div className="text-[7px] tracking-widest text-white/40 uppercase">
              {m.desc}
            </div>
          </div>
        ))}
      </div>

      {/* ═══ CORE VISUALIZATIONS ROW ═══ */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Solar Arc Trajectory */}
        <div className="relative flex flex-col overflow-hidden rounded-xl border border-white/5 bg-card p-5 lg:col-span-5">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h3 className="mb-1 text-[10px] font-bold tracking-widest text-white uppercase">
                SOLAR ARC TRAJECTORY
              </h3>
              <p className="text-[9px] text-muted-foreground">
                Real-time sun path based on your location
              </p>
            </div>
            <div className="flex items-center gap-2 rounded bg-rose-500/10 px-2 py-1">
              <div className="h-1.5 w-1.5 animate-ping rounded-full bg-rose-500" />
              <span className="text-[8px] font-bold tracking-widest text-rose-500">
                LIVE
              </span>
            </div>
          </div>

          <div className="relative mt-4 flex min-h-[220px] w-full items-end">
            {/* The Glowing Arc */}
            <svg
              viewBox="0 0 100 50"
              className="absolute inset-x-0 bottom-10 h-full w-full overflow-visible drop-shadow-sm"
            >
              <path
                d="M 5 45 Q 50 -10 95 45"
                fill="none"
                stroke="url(#arcGradient)"
                strokeWidth="1"
                strokeDasharray="2 1"
              />
              <path
                d="M 5 45 Q 27.5 17 50 17.5"
                fill="none"
                stroke="#facc15"
                strokeWidth="1.5"
              />
              <defs>
                <linearGradient
                  id="arcGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="30%" stopColor="#f59e0b" />
                  <stop offset="70%" stopColor="#ea580c" />
                  <stop offset="100%" stopColor="#1e3a8a" />
                </linearGradient>
              </defs>

              {/* Nodes along the arc */}
              <circle cx="5" cy="45" r="1.5" fill="#3b82f6" />
              <circle cx="27.5" cy="27" r="1.5" fill="#eab308" />
              <circle
                cx="50"
                cy="17.5"
                r="4"
                fill="#facc15"
                className="drop-shadow-sm"
              />
              <circle cx="72.5" cy="27" r="1.5" fill="#ea580c" />
              <circle cx="95" cy="45" r="1.5" fill="#1e3a8a" />
            </svg>

            {/* Mountain / Terrain Silhouette Mock */}
            <div className="absolute inset-x-0 bottom-6 z-0 h-16 border-b border-amber-500/20 bg-gradient-to-t -background to-transparent opacity-90"></div>

            {/* Time Labels */}
            <div className="absolute top-[5px] left-[50%] z-10 flex -translate-x-1/2 flex-col items-center">
              <span className="font-mono text-[12px] text-white">12:07</span>
              <span className="text-[8px] font-bold tracking-widest text-amber-500 uppercase">
                SOLAR NOON
              </span>
            </div>

            {/* Shifted down to avoid overlapping the line */}
            <div className="absolute top-[60%] left-[25%] z-10 flex -translate-x-1/2 flex-col items-center">
              <span className="font-mono text-[10px] text-white">09:18</span>
              <span className="text-[7px] font-bold tracking-widest text-white/50 uppercase">
                MORNING
              </span>
            </div>

            {/* Shifted down to avoid overlapping the line */}
            <div className="absolute top-[60%] right-[25%] z-10 flex translate-x-1/2 flex-col items-center">
              <span className="font-mono text-[10px] text-white">15:02</span>
              <span className="text-[7px] font-bold tracking-widest text-white/50 uppercase">
                AFTERNOON
              </span>
            </div>

            <div className="absolute bottom-[2px] left-2 z-10 flex flex-col items-start">
              <span className="font-mono text-[10px] text-white">05:46</span>
              <span className="text-[7px] font-bold tracking-widest text-white/50 uppercase">
                SUNRISE
              </span>
            </div>

            <div className="absolute right-2 bottom-[2px] z-10 flex flex-col items-end">
              <span className="font-mono text-[10px] text-white">18:28</span>
              <span className="text-[7px] font-bold tracking-widest text-white/50 uppercase">
                SUNSET
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-4 gap-4 border-t border-white/5 pt-6 text-[9px]">
            <div>
              <div className="mb-1 tracking-widest text-muted-foreground uppercase">
                LOCATION
              </div>
              <div className="font-mono text-white">-6.251, 107.873</div>
            </div>
            <div>
              <div className="mb-1 tracking-widest text-muted-foreground uppercase">
                DATE
              </div>
              <div className="font-mono text-white">30 JULY 2026</div>
            </div>
            <div>
              <div className="mb-1 tracking-widest text-muted-foreground uppercase">
                DAY LENGTH
              </div>
              <div className="font-mono text-white">12h 42m</div>
            </div>
            <div>
              <div className="mb-1 tracking-widest text-muted-foreground uppercase">
                NEXT SUNRISE
              </div>
              <div className="font-mono text-white">05:46:12</div>
            </div>
          </div>
        </div>

        {/* Sunlight Exposure Recommendation */}
        <div className="flex flex-col rounded-xl border border-white/5 bg-card p-5 lg:col-span-3">
          <div className="mb-6">
            <h3 className="mb-1 text-[10px] font-bold tracking-widest text-white uppercase">
              SUNLIGHT EXPOSURE RECOMMENDATION
            </h3>
            <p className="text-[9px] text-muted-foreground">
              Based on your skin type & UV Index
            </p>
          </div>

          <div className="relative mt-6 mb-8 flex justify-center">
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-[6px] border-border shadow-sm">
              {/* Simulated SVG progress arc for the orange circle */}
              <svg className="absolute inset-0 h-full w-full -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="46%"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="6"
                  strokeDasharray="300"
                  strokeDashoffset="100"
                  strokeLinecap="round"
                />
              </svg>
              <div className="text-center">
                <div className="text-2xl font-black text-white">15 - 30</div>
                <div className="text-[7px] font-bold tracking-widest text-amber-500 uppercase">
                  MINUTES
                </div>
                <div className="mt-1 text-[6px] tracking-widest text-white/50 uppercase">
                  RECOMMENDED
                </div>
                <div className="text-[6px] tracking-widest text-white/50 uppercase">
                  DAILY EXPOSURE
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
            <div className="text-center">
              <div className="mb-1 text-[7px] tracking-widest text-muted-foreground uppercase">
                OPTIMAL TIME
              </div>
              <div className="font-mono text-[10px] text-white">
                07:00 - 10:00
              </div>
            </div>
            <div className="border-l border-white/10 text-center">
              <div className="mt-3 font-mono text-[10px] text-white">
                15:30 - 17:30
              </div>
            </div>
          </div>

          <ul className="mt-6 space-y-2">
            <li className="flex items-start gap-2 text-[8px]">
              <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              <span className="text-white/70">
                Avoid peak UV (10:00 - 15:00)
              </span>
            </li>
            <li className="flex items-start gap-2 text-[8px]">
              <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              <span className="text-white/70">
                Use sunscreen if &gt; 30 minutes
              </span>
            </li>
            <li className="flex items-start gap-2 text-[8px]">
              <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              <span className="text-white/70">
                Stay hydrated & wear light clothing
              </span>
            </li>
          </ul>
        </div>

        {/* Vitamin D Synthesis */}
        <div className="flex flex-col rounded-xl border border-white/5 bg-card p-5 lg:col-span-4">
          <div className="mb-6">
            <h3 className="mb-1 text-[10px] font-bold tracking-widest text-white uppercase">
              VITAMIN D SYNTHESIS
            </h3>
            <p className="text-[9px] text-muted-foreground">
              How your body produces Vitamin D from sunlight
            </p>
          </div>

          <div className="mt-6 flex gap-6">
            {/* Left Graphics */}
            <div className="mt-2 flex flex-col items-center gap-2">
              <Sun className="h-6 w-6 text-amber-400 drop-shadow-sm" />
              <div className="h-8 w-[1px] bg-white/10"></div>
              <div className="h-4 w-4 rounded-sm border-[2px] border-rose-400/80"></div>
              <div className="h-8 w-[1px] bg-white/10"></div>
              <div className="h-4 w-4 rounded-full border-[2px] border-red-500/80"></div>
              <div className="h-8 w-[1px] bg-white/10"></div>
              <div className="h-4 w-6 rounded-full border-[2px] border-amber-600/80"></div>
            </div>

            {/* Right Text */}
            <div className="flex w-full flex-col gap-8">
              <div>
                <div className="text-[8px] font-bold tracking-widest text-white uppercase">
                  SUNLIGHT
                </div>
                <div className="text-[7px] text-white/50">UVB</div>
              </div>
              <div>
                <div className="text-[8px] font-bold tracking-widest text-white uppercase">
                  SKIN
                </div>
                <div className="text-[7px] text-white/50">
                  7-Dehydrocholesterol
                </div>
              </div>
              <div>
                <div className="text-[8px] font-bold tracking-widest text-white uppercase">
                  LIVER
                </div>
                <div className="text-[7px] text-white/50">Calcidiol</div>
              </div>
              <div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-[8px] font-bold tracking-widest text-white uppercase">
                      KIDNEY
                    </div>
                    <div className="text-[7px] text-white/50">
                      Active Vitamin D
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="mb-1 text-[7px] tracking-widest text-muted-foreground uppercase">
                      DAILY NEED
                    </div>
                    <div className="font-mono text-[10px] font-bold text-amber-400">
                      600 - 800 IU
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ DATA MONITORING ROW ═══ */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Vitamin D Level Monitor */}
        <div className="flex flex-col items-center justify-between rounded-xl border border-white/5 bg-card p-5">
          <div className="mb-4 w-full text-left">
            <h3 className="mb-1 text-[10px] font-bold tracking-widest text-white uppercase">
              VITAMIN D LEVEL MONITOR
            </h3>
            <p className="text-[9px] text-muted-foreground">Blood 25(OH)D Estimate</p>
          </div>

          <div className="relative mt-2 mb-6 flex h-36 w-36 items-center justify-center">
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 h-full w-full -rotate-90"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#1E293B"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#34D399"
                strokeWidth="8"
                strokeDasharray="283"
                strokeDashoffset="23"
                strokeLinecap="round"
                className="drop-shadow-sm"
              />
            </svg>
            <div className="relative z-10 text-center">
              <div className="font-mono text-4xl font-black text-white">
                92<span className="text-lg">%</span>
              </div>
              <div className="mt-1 text-[8px] font-bold tracking-widest text-emerald-400 uppercase">
                OPTIMAL
              </div>
            </div>
          </div>

          <div className="flex w-full justify-center gap-6 text-[8px] text-muted-foreground">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded bg-rose-500" /> 0-20% Deficient
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded bg-amber-500" /> 21-30%
                Insufficient
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded bg-emerald-400" /> 31-60%
                Sufficient
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded bg-emerald-600" /> 61-100%
                Optimal
              </div>
            </div>
          </div>
          <p className="mt-6 text-center text-[9px] leading-relaxed text-white/50">
            Keep your level in optimal range for better health & immunity.
          </p>
        </div>

        {/* Sunlight Benefits */}
        <div className="rounded-xl border border-white/5 bg-card p-5">
          <div className="mb-6">
            <h3 className="mb-1 text-[10px] font-bold tracking-widest text-white uppercase">
              SUNLIGHT BENEFITS
            </h3>
            <p className="text-[9px] text-muted-foreground">
              Powered by Sunlight & Science
            </p>
          </div>
          <div className="space-y-5">
            {[
              {
                t: "VITAMIN D PRODUCTION",
                d: "Strengthens bones, immune system, and mood.",
                i: Activity,
              },
              {
                t: "SEROTONIN BOOST",
                d: "Improves mood, reduces stress and anxiety.",
                i: Smile,
              },
              {
                t: "CIRCADIAN RHYTHM",
                d: "Regulates sleep-wake cycle and hormone balance.",
                i: Clock,
              },
              {
                t: "NATURAL ENERGY",
                d: "Improves focus, productivity and alertness.",
                i: Zap,
              },
              {
                t: "SKIN HEALTH",
                d: "Helps skin cell growth, repair and protection.",
                i: Heart,
              },
            ].map((b, i) => (
              <div key={i} className="flex items-start gap-3">
                <b.i className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <div>
                  <div className="mb-0.5 text-[9px] font-bold tracking-widest text-white uppercase">
                    {b.t}
                  </div>
                  <div className="text-[8px] leading-relaxed text-muted-foreground">
                    {b.d}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Sunlight Exposure */}
        <div className="flex flex-col rounded-xl border border-white/5 bg-card p-5">
          <div className="mb-4">
            <h3 className="mb-1 text-[10px] font-bold tracking-widest text-white uppercase">
              TODAY'S SUNLIGHT EXPOSURE
            </h3>
            <p className="text-[9px] text-muted-foreground">
              Daily Sunlight Exposure Tracker
            </p>
          </div>

          <div className="mb-8 flex items-end justify-between">
            <div>
              <div className="font-mono text-3xl font-black text-white">
                10.2{" "}
                <span className="text-sm font-normal text-muted-foreground">hrs</span>
              </div>
              <div className="mt-1 text-[8px] font-bold tracking-widest text-emerald-400 uppercase">
                DAILY AVERAGE
              </div>
            </div>
            <div className="flex gap-1 font-mono text-[8px]">
              <div className="rounded bg-white/10 px-1.5 py-0.5">7D</div>
              <div className="cursor-pointer rounded px-1.5 py-0.5 text-white/30 hover:bg-white/5">
                30D
              </div>
              <div className="cursor-pointer rounded px-1.5 py-0.5 text-white/30 hover:bg-white/5">
                90D
              </div>
            </div>
          </div>

          <div className="relative flex h-32 flex-1 items-end justify-between gap-2">
            <div className="absolute inset-0 border-b border-white/10" />
            {/* Bars */}
            {[
              { l: "FRI", v: 6.1, h: "50%" },
              { l: "SAT", v: 7.3, h: "60%" },
              { l: "SUN", v: 8.0, h: "70%" },
              { l: "MON", v: 9.5, h: "85%" },
              { l: "TUE", v: 10.2, h: "100%", act: true },
              { l: "WED", v: 8.7, h: "75%" },
              { l: "THU", v: 7.1, h: "55%" },
            ].map((b, i) => (
              <div
                key={i}
                className="group z-10 flex w-full flex-col items-center"
              >
                <div className="mb-2 font-mono text-[8px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {b.v}
                </div>
                <div
                  className={`w-full max-w-[14px] rounded-t-sm transition-all duration-1000 ${b.act ? "bg-amber-400 shadow-sm" : "bg-cyan-600/50 hover:bg-cyan-500/80"}`}
                  style={{ height: b.h }}
                />
                <div className="mt-2 font-mono text-[7px] text-muted-foreground">
                  {b.l}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2 border-t border-white/5 pt-5 text-[9px]">
            <div>
              <div className="mb-1 tracking-widest text-muted-foreground uppercase">
                GOAL
              </div>
              <div className="font-mono text-white">8.0 hrs</div>
            </div>
            <div>
              <div className="mb-1 tracking-widest text-muted-foreground uppercase">
                ACHIEVED
              </div>
              <div className="font-mono text-emerald-400 text-white">
                10.2 hrs
              </div>
            </div>
            <div>
              <div className="mb-1 tracking-widest text-muted-foreground uppercase">
                CONSISTENCY
              </div>
              <div className="font-mono text-white">92%</div>
            </div>
          </div>
        </div>

        {/* Sunlight & Mood Boost */}
        <div className="flex flex-col rounded-xl border border-white/5 bg-card p-5">
          <div className="mb-4">
            <h3 className="mb-1 text-[10px] font-bold tracking-widest text-white uppercase">
              SUNLIGHT & MOOD BOOST
            </h3>
            <p className="text-[9px] text-muted-foreground">
              Light exposure vs mood correlation
            </p>
          </div>

          <div className="relative mt-4 min-h-[140px] flex-1">
            {/* SVG Line Chart Mock */}
            <svg
              viewBox="0 0 200 100"
              className="h-full w-full overflow-visible"
            >
              <path
                d="M 0 90 L 30 75 L 60 65 L 90 40 L 120 45 L 150 20 L 180 15 L 200 10"
                fill="none"
                stroke="#34D399"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-sm"
              />
              <path
                d="M 0 85 L 30 70 L 60 70 L 90 55 L 120 50 L 150 35 L 180 40 L 200 30"
                fill="none"
                stroke="#60A5FA"
                strokeWidth="2"
                strokeDasharray="4 4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="absolute inset-x-0 bottom-0 flex justify-between border-b border-white/10 px-1 pb-1 font-mono text-[7px] text-muted-foreground">
              <span>0</span>
              <span>5</span>
              <span>10</span>
              <span>15</span>
              <span>20</span>
              <span>25</span>
              <span>30</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
            <div>
              <div className="mb-1 text-[8px] tracking-widest text-muted-foreground uppercase">
                MOOD SCORE
              </div>
              <div className="font-mono text-2xl font-bold text-white">84%</div>
              <div className="mt-1 text-[8px] font-bold tracking-widest text-emerald-400 uppercase">
                POSITIVE
              </div>
            </div>
            <div>
              <div className="mb-1 text-[8px] tracking-widest text-muted-foreground uppercase">
                ENERGY LEVEL
              </div>
              <div className="font-mono text-2xl font-bold text-white">76%</div>
              <div className="mt-1 text-[8px] font-bold tracking-widest text-amber-400 uppercase">
                HIGH
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ TOOLKITS & ACTIONS ROW ═══ */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Toolkits */}
        <div className="rounded-xl border border-white/5 bg-card p-5 lg:col-span-6">
          <div className="mb-6">
            <h3 className="mb-1 text-[10px] font-bold tracking-widest text-white uppercase">
              SUNLIGHT INTELLIGENT TOOLKITS
            </h3>
            <p className="text-[9px] text-muted-foreground">
              Operational tools to optimize your light, health & life
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {[
              {
                l: "SUN TRACKER",
                d: "Track sun position in real-time",
                i: Target,
              },
              {
                l: "UV ALERT SYSTEM",
                d: "Get notified for high UV index",
                i: AlertTriangle,
              },
              {
                l: "VITAMIN D CALCULATOR",
                d: "Estimate your daily Vitamin D needs",
                i: Activity,
              },
              {
                l: "EXPOSURE REMINDER",
                d: "Smart reminder for sunlight",
                i: Bell,
              },
              {
                l: "DAILY LIGHT REPORT",
                d: "View your sunlight report & insights",
                i: BookOpen,
              },
              {
                l: "SKIN TYPE GUIDE",
                d: "Find safe exposure time for your skin",
                i: Shield,
              },
              {
                l: "CIRCADIAN OPTIMIZER",
                d: "Optimize your daily rhythm",
                i: Clock,
              },
              {
                l: "SLEEP CYCLE GUIDE",
                d: "Auto-sync light with your sleep",
                i: Eye,
              },
              {
                l: "HEALTH INSIGHTS",
                d: "AI-powered health recommendations",
                i: Heart,
              },
              {
                l: "WELLNESS SCORE",
                d: "Overall sunlight wellness score",
                i: Smile,
              },
            ].map((t, i) => (
              <div
                key={i}
                className="group flex cursor-pointer gap-3 rounded-xl border border-white/5 p-3 transition-colors hover:border-amber-500/30 hover:bg-amber-500/5"
              >
                <t.i className="h-5 w-5 shrink-0 text-amber-400 transition-transform group-hover:scale-110" />
                <div>
                  <div className="mb-1 text-[8px] font-bold tracking-widest text-white uppercase">
                    {t.l}
                  </div>
                  <div className="text-[7px] leading-relaxed text-muted-foreground">
                    {t.d}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spiritual Light Connection */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/5 bg-card p-5 lg:col-span-3">
          <div className="relative z-10 mb-4">
            <h3 className="mb-1 text-[10px] font-bold tracking-widest text-white uppercase">
              SPIRITUAL LIGHT CONNECTION
            </h3>
            <p className="text-[9px] text-muted-foreground">
              Align your heart with the Light
            </p>
          </div>

          <ul className="relative z-10 mt-6 space-y-4">
            <li className="flex items-start gap-3">
              <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-amber-500/30 bg-amber-500/10">
                <Sun className="h-2 w-2 text-amber-500" />
              </div>
              <span className="pt-0.5 text-[9px] leading-relaxed text-white/80">
                Reflect on gratitude daily
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-amber-500/30 bg-amber-500/10">
                <Sun className="h-2 w-2 text-amber-500" />
              </div>
              <span className="pt-0.5 text-[9px] leading-relaxed text-white/80">
                Seek the Light in knowledge
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-amber-500/30 bg-amber-500/10">
                <Sun className="h-2 w-2 text-amber-500" />
              </div>
              <span className="pt-0.5 text-[9px] leading-relaxed text-white/80">
                Spread kindness & mercy
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-amber-500/30 bg-amber-500/10">
                <Sun className="h-2 w-2 text-amber-500" />
              </div>
              <span className="pt-0.5 text-[9px] leading-relaxed text-white/80">
                Live with purpose & truth
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-amber-500/30 bg-amber-500/10">
                <Sun className="h-2 w-2 text-amber-500" />
              </div>
              <span className="pt-0.5 text-[9px] leading-relaxed text-white/80">
                Be a light for others
              </span>
            </li>
          </ul>

          <div className="relative z-10 mt-8 border-t border-white/5 pt-4">
            <p className="font-mono text-[10px] leading-relaxed text-amber-400 italic">
              "The true light shines in the heart that beats the truth."
            </p>
            <p className="mt-2 text-[7px] tracking-widest text-muted-foreground uppercase">
              - INSPIRED BY AR-RUH (17:85)
            </p>
          </div>

          {/* Subtle Silhouette Background */}
          <div className="pointer-events-none absolute right-[-10%] bottom-[-10%] h-[180px] w-[180px] opacity-10 transition-opacity duration-700 group-hover:opacity-30">
            <img
              src="/assets/hero/24-hero.png"
              alt="Silhouette"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="pointer-events-none absolute right-0 bottom-0 h-[100px] w-[180px] bg-gradient-to-t -background to-transparent" />
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col rounded-xl border border-white/5 bg-card p-5 lg:col-span-3">
          <div className="mb-6">
            <h3 className="mb-1 text-[10px] font-bold tracking-widest text-white uppercase">
              QUICK ACTIONS
            </h3>
          </div>
          <div className="flex flex-1 flex-col gap-3">
            {[
              { l: "START SUN EXPOSURE TIMER", i: Clock },
              { l: "CHECK VITAMIN D LEVEL", i: Activity },
              { l: "VIEW SUNLIGHT REPORT", i: BookOpen },
              { l: "SYNC WITH WEARABLES", i: Zap },
              { l: "SET DAILY REMINDER", i: Bell },
            ].map((q, i) => (
              <button
                key={i}
                className="group flex w-full items-center justify-between rounded-lg border border-white/5 p-4 transition-colors hover:border-amber-500/30 hover:bg-amber-500/5"
              >
                <div className="flex items-center gap-3">
                  <q.i className="h-4 w-4 text-amber-400" />
                  <span className="text-[9px] font-bold tracking-widest text-white uppercase">
                    {q.l}
                  </span>
                </div>
                <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-amber-400" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ ANALYTICS & SYSTEMS ROW ═══ */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Recent Activity */}
        <div className="rounded-xl border border-white/5 bg-card p-5 lg:col-span-3">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-[10px] font-bold tracking-widest text-white uppercase">
              RECENT ACTIVITY
            </h3>
            <span className="flex items-center gap-1 rounded bg-emerald-400/10 px-2 py-0.5 text-[7px] font-bold tracking-widest text-emerald-400">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />{" "}
              LIVE FEED
            </span>
          </div>
          <div className="mb-3 grid grid-cols-12 border-b border-white/10 pb-2 text-[7px] tracking-widest text-muted-foreground uppercase">
            <div className="col-span-3">TIME</div>
            <div className="col-span-6">ACTIVITY</div>
            <div className="col-span-3 text-right">STATUS</div>
          </div>
          <div className="space-y-4">
            {[
              {
                t: "22:17",
                a: "Sun Exposure Logged",
                s: "Optimal",
                c: "text-emerald-400",
              },
              {
                t: "22:16",
                a: "Vitamin D Level Checked",
                s: "Optimal",
                c: "text-emerald-400",
              },
              {
                t: "22:15",
                a: "UV Index Alert (Moderate)",
                s: "Active",
                c: "text-rose-400",
              },
              {
                t: "22:14",
                a: "Daily Light Report Generated",
                s: "Completed",
                c: "text-emerald-400",
              },
              {
                t: "22:13",
                a: "Health Insight Updated",
                s: "New",
                c: "text-emerald-400",
              },
            ].map((r, i) => (
              <div
                key={i}
                className="grid grid-cols-12 items-center text-[9px]"
              >
                <div className="col-span-3 font-mono text-white/50">{r.t}</div>
                <div className="col-span-6 truncate pr-2 text-white">{r.a}</div>
                <div
                  className={`col-span-3 text-right font-bold tracking-wider ${r.c}`}
                >
                  {r.s}
                </div>
              </div>
            ))}
          </div>
          <button className="mt-6 flex w-full items-center justify-center gap-1 border-t border-white/5 pt-4 text-[8px] tracking-widest text-amber-400 uppercase transition-colors hover:text-white">
            VIEW ALL ACTIVITY <ArrowRight className="h-2.5 w-2.5" />
          </button>
        </div>

        {/* Light Impact Analytics */}
        <div className="flex flex-col rounded-xl border border-white/5 bg-card p-5 lg:col-span-4">
          <div className="mb-5">
            <h3 className="mb-1 text-[10px] font-bold tracking-widest text-white uppercase">
              LIGHT IMPACT ANALYTICS
            </h3>
            <p className="text-[9px] text-muted-foreground">30 DAYS OVERVIEW</p>
          </div>
          <div className="mb-6 grid grid-cols-4 gap-3">
            <div>
              <div className="mb-1 text-[7px] leading-tight tracking-widest text-muted-foreground uppercase">
                HEALTH IMPROVEMENT
              </div>
              <div className="flex items-center gap-1 text-sm font-bold text-emerald-400">
                <TrendingUp className="h-3 w-3" /> 24%
              </div>
            </div>
            <div>
              <div className="mb-1 text-[7px] leading-tight tracking-widest text-muted-foreground uppercase">
                MOOD ENHANCEMENT
              </div>
              <div className="flex items-center gap-1 text-sm font-bold text-emerald-400">
                <TrendingUp className="h-3 w-3" /> 31%
              </div>
            </div>
            <div>
              <div className="mb-1 text-[7px] leading-tight tracking-widest text-muted-foreground uppercase">
                ENERGY BOOST
              </div>
              <div className="flex items-center gap-1 text-sm font-bold text-emerald-400">
                <TrendingUp className="h-3 w-3" /> 19%
              </div>
            </div>
            <div>
              <div className="mb-1 text-[7px] leading-tight tracking-widest text-muted-foreground uppercase">
                SLEEP QUALITY
              </div>
              <div className="flex items-center gap-1 text-sm font-bold text-emerald-400">
                <TrendingUp className="h-3 w-3" /> 28%
              </div>
            </div>
          </div>

          <div className="flex-1 border-t border-white/5 pt-4">
            <div className="mb-3 flex justify-between text-[8px] tracking-widest text-muted-foreground uppercase">
              <span className="flex items-center gap-1">
                <div className="h-0.5 w-2 bg-emerald-500" /> Health
              </span>
              <span className="flex items-center gap-1">
                <div className="h-0.5 w-2 bg-blue-500" /> Mood
              </span>
              <span className="flex items-center gap-1">
                <div className="h-0.5 w-2 bg-amber-500" /> Energy
              </span>
              <span className="flex items-center gap-1">
                <div className="h-0.5 w-2 bg-purple-500" /> Sleep
              </span>
            </div>
            {/* Simple CSS Grid Chart Mockup */}
            <div className="flex h-20 w-full items-end justify-between opacity-60">
              {[45, 60, 80, 50, 95, 70, 85, 40, 65, 90, 55, 75].map((h, i) => (
                <div
                  key={i}
                  className="w-3 cursor-pointer rounded-t-sm bg-gradient-to-t from-emerald-900 to-emerald-400 transition-all hover:opacity-100"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between font-mono text-[7px] text-white/30">
              <span>1</span>
              <span>5</span>
              <span>10</span>
              <span>15</span>
              <span>20</span>
              <span>25</span>
              <span>30</span>
            </div>
          </div>
        </div>

        {/* System Resources */}
        <div className="flex flex-col rounded-xl border border-white/5 bg-card p-5 lg:col-span-2">
          <div className="mb-6">
            <h3 className="mb-1 text-[10px] font-bold tracking-widest text-white uppercase">
              SYSTEM RESOURCES
            </h3>
            <p className="text-[9px] text-muted-foreground">Operational Status</p>
          </div>
          <div className="mb-6 grid grid-cols-2 gap-4">
            {[
              { l: "CPU", v: 23, c: "text-cyan-400", s: "#22D3EE" },
              { l: "RAM", v: 48, c: "text-amber-400", s: "#FBBF24" },
              { l: "DISK", v: 61, c: "text-emerald-400", s: "#34D399" },
              { l: "NET", v: 18, c: "text-rose-400", s: "#FB7185" },
            ].map((r, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="relative mb-2 flex h-12 w-12 items-center justify-center">
                  <svg
                    viewBox="0 0 36 36"
                    className="absolute inset-0 h-full w-full -rotate-90"
                  >
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="3"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke={r.s}
                      strokeWidth="3"
                      strokeDasharray="100"
                      strokeDashoffset={100 - r.v}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className={`font-mono text-[9px] font-bold ${r.c}`}>
                    {r.v}%
                  </div>
                </div>
                <div className="text-[7px] tracking-widest text-muted-foreground uppercase">
                  {r.l}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-auto space-y-3 border-t border-white/5 pt-4 text-[8px] text-white/70">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Globe className="h-3 w-3 text-emerald-400" /> DATABASE HEALTH
              </span>
              <span className="font-mono text-emerald-400">100%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <HardDrive className="h-3 w-3 text-emerald-400" /> BACKUP STATUS
              </span>
              <span className="font-mono text-emerald-400">Up to date</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Shield className="h-3 w-3 text-emerald-400" /> SECURITY LEVEL
              </span>
              <span className="font-mono text-emerald-400">MAXIMUM</span>
            </div>
          </div>
        </div>

        {/* Global Sunlight Map */}
        <div className="flex flex-col rounded-xl border border-white/5 bg-card p-5 lg:col-span-3">
          <div className="mb-4">
            <h3 className="mb-1 text-[10px] font-bold tracking-widest text-white uppercase">
              GLOBAL SUNLIGHT MAP
            </h3>
            <p className="text-[9px] text-muted-foreground">
              Real-time Sunlight Intensity
            </p>
          </div>
          <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-lg border border-white/5 bg-card">
            {/* SVG Map Silhouette */}
            <svg
              viewBox="0 0 800 400"
              fill="currentColor"
              className="w-full text-emerald-900/30"
            >
              <path d="M150 100 Q 200 80 250 120 T 350 150 Q 400 120 450 180 T 550 200 Q 600 150 700 180 L 700 300 L 150 300 Z" />
              <path d="M300 50 Q 350 30 400 80 T 500 120 Q 550 80 600 140 T 750 160 Q 800 100 850 120 L 850 50 L 300 50 Z" />
              {/* Bright spots */}
              <circle cx="450" cy="180" r="150" fill="url(#sunGlow)" />
              <defs>
                <radialGradient id="sunGlow">
                  <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#FBBF24" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
            <div className="absolute inset-x-0 bottom-2 flex justify-between bg-black/40 px-4 py-1 text-[7px] tracking-widest text-white/50 uppercase backdrop-blur-sm">
              <span className="flex items-center gap-1.5">
                <div className="h-0.5 w-2 bg-emerald-900" /> LOW
              </span>
              <span className="flex items-center gap-1.5">
                <div className="h-0.5 w-2 bg-emerald-500" /> MODERATE
              </span>
              <span className="flex items-center gap-1.5">
                <div className="h-0.5 w-2 bg-amber-400" /> HIGH
              </span>
              <span className="flex items-center gap-1.5">
                <div className="h-0.5 w-2 bg-rose-500" /> EXTREME
              </span>
            </div>
          </div>
          <button className="mt-4 flex items-center justify-end gap-1 text-right text-[8px] tracking-widest text-amber-400 uppercase transition-colors hover:text-white">
            VIEW DETAILED MAP <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* ═══ ADVANCED SCI-FI ASTRONOMY ROW ═══ */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Qibla Solar Alignment */}
        <div className="group relative flex flex-col overflow-hidden rounded-xl border border-white/5 bg-card p-5 lg:col-span-4">
          <div className="relative z-10 mb-4">
            <h3 className="mb-1 text-[10px] font-bold tracking-widest text-white uppercase">
              QIBLA SOLAR ALIGNMENT
            </h3>
            <p className="text-[9px] text-muted-foreground">
              Sun's relation to the Sacred Mosque
            </p>
          </div>

          <div className="relative my-4 flex h-40 w-full items-center justify-center">
            {/* Sci-Fi Compass SVG */}
            <svg
              viewBox="0 0 200 200"
              className="absolute inset-0 h-full w-full animate-[spin_60s_linear_infinite] opacity-30"
            >
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="#FBBF24"
                strokeWidth="1"
                strokeDasharray="4 8"
              />
              <circle
                cx="100"
                cy="100"
                r="70"
                fill="none"
                stroke="#34D399"
                strokeWidth="0.5"
                strokeDasharray="1 4"
              />
            </svg>

            {/* Center Kaaba representation */}
            <div className="relative z-10 flex h-10 w-10 rotate-45 items-center justify-center border-[2px] border-amber-500/50 bg-muted shadow-sm">
              <div className="h-6 w-6 border border-amber-400/30" />
              <div className="absolute -top-6 -right-6 font-mono text-[6px] text-emerald-400">
                21.42° N
              </div>
            </div>

            {/* Sun pointing line */}
            <div className="absolute top-1/2 left-1/2 z-0 h-[1px] w-32 origin-left -translate-y-1/2 -rotate-[22deg] bg-gradient-to-r from-amber-500 to-transparent">
              <div className="absolute top-1/2 right-0 h-4 w-4 -translate-y-1/2 rounded-full bg-amber-400 blur-[3px]" />
            </div>
          </div>

          <div className="relative z-10 mt-auto">
            <div className="mb-2 grid grid-cols-5 border-b border-white/5 pb-2 text-[7px] tracking-widest text-muted-foreground uppercase">
              <div>FAJR</div>
              <div className="text-center">DHUHR</div>
              <div className="text-center">ASR</div>
              <div className="text-center">MAGHRIB</div>
              <div className="text-right">ISHA</div>
            </div>
            <div className="grid grid-cols-5 font-mono text-[8px] text-white">
              <div>-18.0°</div>
              <div className="text-center font-bold text-amber-400">PEAK</div>
              <div className="text-center">SHADOW</div>
              <div className="text-center">0.0°</div>
              <div className="text-right">-18.0°</div>
            </div>
          </div>
        </div>

        {/* Electromagnetic Spectrum */}
        <div className="relative flex flex-col overflow-hidden rounded-xl border border-white/5 bg-card p-5 lg:col-span-4">
          <div className="relative z-10 mb-6 flex items-start justify-between">
            <div>
              <h3 className="mb-1 text-[10px] font-bold tracking-widest text-white uppercase">
                ELECTROMAGNETIC SPECTRUM
              </h3>
              <p className="text-[9px] text-muted-foreground">
                Real-time solar frequency monitor
              </p>
            </div>
            <span className="rounded border border-cyan-400/20 bg-cyan-400/10 px-2 py-0.5 text-[7px] font-bold tracking-widest text-cyan-400">
              UVA/UVB SAFE
            </span>
          </div>

          <div className="relative my-4 flex flex-1 flex-col justify-center opacity-80">
            {/* Waveform 1 */}
            <svg viewBox="0 0 300 50" className="h-12 w-full overflow-visible">
              <path
                d="M 0 25 Q 15 0 30 25 T 60 25 T 90 25 T 120 25 T 150 25 T 180 25 T 210 25 T 240 25 T 270 25 T 300 25"
                fill="none"
                stroke="#FBBF24"
                strokeWidth="1.5"
                className="animate-[pulse_2s_ease-in-out_infinite]"
              />
              <text
                x="5"
                y="10"
                fill="#FBBF24"
                fontSize="8"
                fontFamily="monospace"
              >
                VISIBLE (400-700nm)
              </text>
            </svg>
            {/* Waveform 2 */}
            <svg
              viewBox="0 0 300 50"
              className="mt-2 h-12 w-full overflow-visible"
            >
              <path
                d="M 0 25 Q 5 10 10 25 T 20 25 T 30 25 T 40 25 T 50 25 T 60 25 T 70 25 T 80 25 T 90 25 T 100 25 T 110 25 T 120 25 T 130 25 T 140 25 T 150 25 T 160 25 T 170 25 T 180 25 T 190 25 T 200 25 T 210 25 T 220 25 T 230 25 T 240 25 T 250 25 T 260 25 T 270 25 T 280 25 T 290 25 T 300 25"
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="1"
                strokeDasharray="2 1"
              />
              <text
                x="5"
                y="10"
                fill="#8B5CF6"
                fontSize="8"
                fontFamily="monospace"
              >
                ULTRAVIOLET (10-400nm)
              </text>
            </svg>
            {/* Waveform 3 */}
            <svg
              viewBox="0 0 300 50"
              className="mt-2 h-12 w-full overflow-visible"
            >
              <path
                d="M 0 25 Q 40 -10 80 25 T 160 25 T 240 25 T 320 25"
                fill="none"
                stroke="#EF4444"
                strokeWidth="2"
                opacity="0.6"
              />
              <text
                x="5"
                y="10"
                fill="#EF4444"
                fontSize="8"
                fontFamily="monospace"
              >
                INFRARED (&gt;700nm)
              </text>
            </svg>
          </div>

          <div className="relative z-10 mt-auto grid grid-cols-2 gap-4 border-t border-white/5 pt-4 text-[9px]">
            <div>
              <div className="mb-1 tracking-widest text-muted-foreground uppercase">
                SOLAR FLARE STATUS
              </div>
              <div className="font-mono font-bold text-emerald-400">
                CLASS A (NORMAL)
              </div>
            </div>
            <div className="text-right">
              <div className="mb-1 tracking-widest text-muted-foreground uppercase">
                OZONE BLOCKING
              </div>
              <div className="font-mono font-bold text-cyan-400">
                98.5% EFFICIENT
              </div>
            </div>
          </div>
        </div>

        {/* Cellular Photon Absorption */}
        <div className="group relative flex flex-col overflow-hidden rounded-xl border border-white/5 bg-card p-5 lg:col-span-4">
          <div className="relative z-10 mb-4">
            <h3 className="mb-1 text-[10px] font-bold tracking-widest text-white uppercase">
              CELLULAR PHOTON ABSORPTION
            </h3>
            <p className="text-[9px] text-muted-foreground">
              Near-Infrared impact on Mitochondria
            </p>
          </div>

          <div className="relative my-2 flex min-h-[140px] flex-1 items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.1)_0%,transparent_70%)]" />

            {/* Cell Mockup */}
            <div className="relative flex h-16 w-32 items-center justify-center overflow-hidden rounded-[40px] border border-rose-500/30 bg-rose-500/5">
              {/* Internal zig-zag (Cristae) */}
              <svg
                viewBox="0 0 100 40"
                className="absolute inset-0 h-full w-full opacity-50"
              >
                <path
                  d="M 10 20 L 20 10 L 30 30 L 40 10 L 50 30 L 60 10 L 70 30 L 80 10 L 90 20"
                  fill="none"
                  stroke="#FB7185"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="relative z-10 rounded border border-rose-500/20 bg-black/60 px-3 py-1 text-[7px] font-bold tracking-widest text-rose-300 backdrop-blur-sm">
                MITOCHONDRIA
              </div>
            </div>

            {/* Photons hitting */}
            <div className="absolute top-1/2 left-[10%] flex -translate-y-1/2 animate-pulse gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-400 drop-shadow-sm" />
              <div className="h-1.5 w-1.5 rounded-full bg-amber-400 drop-shadow-sm" />
              <div className="h-1.5 w-1.5 rounded-full bg-amber-400 drop-shadow-sm" />
            </div>

            {/* ATP Output */}
            <div className="absolute top-1/2 right-[15%] flex -translate-y-1/2 flex-col items-center gap-1">
              <div className="flex h-4 w-4 animate-bounce items-center justify-center rounded border border-emerald-500/50 bg-emerald-500/20 text-[5px] font-black text-emerald-400">
                ATP
              </div>
              <div className="flex h-4 w-4 animate-bounce items-center justify-center rounded border border-emerald-500/50 bg-emerald-500/20 text-[5px] font-black text-emerald-400 delay-75">
                ATP
              </div>
            </div>
          </div>

          <div className="z-10 mt-auto border-t border-white/5 pt-4">
            <p className="text-center text-[8px] leading-relaxed text-white/60">
              Red and near-infrared light (600-900nm) penetrates skin and
              stimulates{" "}
              <span className="font-bold text-rose-400">
                Cytochrome C Oxidase
              </span>{" "}
              in mitochondria, increasing ATP (cellular energy) production.
            </p>
          </div>
        </div>
      </div>

      {/* ═══ FOOTER ROW ═══ */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-start gap-4 rounded-xl border border-white/5 bg-card p-6">
          <Sun className="h-8 w-8 shrink-0 text-amber-400" />
          <div>
            <div className="mb-1.5 text-[10px] font-bold tracking-widest text-white uppercase">
              DAILY LIGHT REMINDER
            </div>
            <p className="mb-3 text-[9px] leading-relaxed text-muted-foreground">
              Don't forget to get 15-30 minutes of sunlight every morning. Your
              body, mind, and soul need it.
            </p>
            <button className="flex items-center gap-1 text-[8px] font-bold tracking-widest text-emerald-400 uppercase transition-colors hover:text-emerald-300">
              <Bell className="h-3 w-3" /> SET REMINDER
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-card p-6">
          <div className="mb-2 text-[10px] font-bold tracking-widest text-white uppercase">
            PROPHETIC WISDOM
          </div>
          <p className="text-[10px] leading-relaxed text-muted-foreground italic">
            "The example of the believers in their mutual love, mercy and
            compassion is like one body; when one part suffers, the whole body
            responds with wakefulness and fever."
          </p>
          <div className="mt-3 text-[8px] tracking-widest text-amber-400 uppercase">
            - Sahih Bukhari (6011)
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-card p-6">
          <div className="mb-2 text-[10px] font-bold tracking-widest text-white uppercase">
            ANCIENT WISDOM
          </div>
          <p className="text-[10px] leading-relaxed text-muted-foreground italic">
            "Sunlight is the best medicine. It heals the body, uplifts the
            spirit, and illuminates the soul."
          </p>
        </div>

        <div className="group relative flex cursor-pointer items-center justify-between overflow-hidden rounded-xl border border-white/5 bg-card p-6">
          <div className="relative z-10">
            <div className="mb-1 text-[10px] font-bold tracking-widest text-white uppercase">
              COUNTDOWN TO NEXT SUNRISE
            </div>
            <p className="mb-4 text-[9px] leading-relaxed text-muted-foreground">
              Prepare for another day of light
            </p>
            <div className="flex gap-4 font-mono text-3xl font-black text-white md:text-4xl">
              <div className="flex flex-col items-center">
                07
                <span className="mt-1 font-sans text-[7px] tracking-widest text-amber-400">
                  HOURS
                </span>
              </div>
              <div className="animate-pulse text-muted-foreground">:</div>
              <div className="flex flex-col items-center">
                27
                <span className="mt-1 font-sans text-[7px] tracking-widest text-amber-400">
                  MINUTES
                </span>
              </div>
              <div className="animate-pulse text-muted-foreground">:</div>
              <div className="flex flex-col items-center text-amber-400">
                26
                <span className="mt-1 font-sans text-[7px] tracking-widest text-muted-foreground">
                  SECONDS
                </span>
              </div>
            </div>
          </div>
          <div className="relative z-10 mr-2 flex flex-col items-center transition-transform group-hover:scale-110 lg:mr-6">
            <Sunrise className="mb-2 h-8 w-8 text-amber-400 drop-shadow-sm" />
            <div className="text-[8px] font-bold tracking-widest text-amber-400 uppercase">
              Next Sunrise
            </div>
          </div>

          <div className="pointer-events-none absolute top-0 right-0 bottom-0 w-48 bg-gradient-to-l from-amber-500/10 to-transparent" />
        </div>
      </div>
    </div>
  )
}
