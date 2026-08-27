"use client"
import Image from "next/image"

import React, { useState, useEffect } from "react"
import {
  History,
  Clock,
  Globe2,
  Map,
  Users,
  Target,
  BookOpen,
  Telescope,
  Swords,
  ArrowRight,
  Play,
  Pause,
  FastForward,
  Rewind,
  Settings,
  Filter,
  Calendar,
  AlertTriangle,
  AlertCircle,
  Hexagon,
  Star,
  Plus,
  Minus,
  Book,
} from "lucide-react"

export function OSPropheticTimeline() {
  const [clockWIB, setClockWIB] = useState("07:13:45 WIB")
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setClockWIB(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          timeZone: "Asia/Jakarta",
        }) + " WIB"
      )
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <section
      id="timeline"
      className="bg-space relative z-10 overflow-hidden border-b border-orange-500/30 py-20 font-mono text-foreground"
    >
      {/* ═══ LAYER 1: DEEP SPACE BACKGROUND ══════════════════════════════════ */}
      <div className="pointer-events-none absolute inset-0">
        <div className="theme-grid-bg absolute inset-0 opacity-30" />
        <div className="bg-radial-gradient absolute top-1/3 left-1/2 h-[800px] w-[1600px] -translate-x-1/2 from-orange-900/10 via-blue-900/5 to-transparent blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1700px] space-y-4 px-4">
        {/* ═══ TOP HEADER (Blueprint 15) ══════════════════════════════════════ */}
        <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-4 xl:flex-row xl:items-center">
          <div className="flex items-center gap-4">
            <div className="bg-space inline-flex items-center gap-3 rounded-sm border-2 border-cyan-500/60 px-3.5 py-1.5 text-xs font-black tracking-[0.25em] text-primary uppercase shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <span className="rounded-xs bg-cyan-500 px-1.5 py-0.5 font-black text-black">
                15
              </span>
              <span>MOONWITNESS TIMELINE</span>
            </div>
            <div>
              <h2 className="ml-2 font-mono text-sm font-black tracking-widest text-primary uppercase">
                From Creation to Future
              </h2>
              <div className="ml-2 text-[9px] tracking-wide text-primary uppercase">
                Journey through time. Understand the past, live the present,
                prepare for the future.
              </div>
            </div>
          </div>

          <div className="border-b-2 border-orange-400 bg-gradient-to-t from-orange-950/40 to-transparent p-3 text-center xl:text-left">
            <div
              className="font-arabic mb-1 text-sm font-bold text-orange-400"
              dir="rtl"
            >
              وَتِلْكَ الْأَمْثَالُ نَضْرِبُهَا لِلنَّاسِ ۖ وَمَا يَعْقِلُهَا
              إِلَّا الْعَالِمُونَ
            </div>
            <div className="font-sans text-[9px] text-orange-100/70 italic">
              "And We present these examples to the people, but none will
              understand them except those of knowledge."{" "}
              <span className="ml-1 font-mono font-black text-orange-400 not-italic">
                Qur'an 29:43
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-6">
            <div>
              <div className="mb-1.5 text-[8px] tracking-widest text-primary uppercase">
                TIMELINE VIEW
              </div>
              <div className="bg-space flex overflow-hidden rounded border border-white/10">
                <button className="border-b-2 border-primary bg-primary/20 px-3 py-1.5 text-[9px] font-bold text-primary">
                  Linear
                </button>
                <button className="px-3 py-1.5 text-[9px] font-bold text-primary transition-colors hover:bg-white/5">
                  Galaxy
                </button>
                <button className="px-3 py-1.5 text-[9px] font-bold text-primary transition-colors hover:bg-white/5">
                  Map
                </button>
                <button className="px-3 py-1.5 text-[9px] font-bold text-primary transition-colors hover:bg-white/5">
                  Tree
                </button>
              </div>
            </div>

            <div>
              <div className="mb-1.5 text-[8px] tracking-widest text-primary uppercase">
                TIME SCALE
              </div>
              <div className="bg-space flex overflow-hidden rounded border border-white/10">
                <button className="border-b-2 border-primary bg-primary/20 px-3 py-1.5 text-[9px] font-bold text-primary">
                  All Time
                </button>
                <button className="px-3 py-1.5 text-[9px] font-bold text-primary transition-colors hover:bg-white/5">
                  Century
                </button>
                <button className="px-3 py-1.5 text-[9px] font-bold text-primary transition-colors hover:bg-white/5">
                  Decade
                </button>
                <button className="border-r border-white/10 px-3 py-1.5 text-[9px] font-bold text-primary transition-colors hover:bg-white/5">
                  Year
                </button>
                <button className="px-3 py-1.5 text-primary transition-colors hover:bg-white/5">
                  <Calendar className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ LAYER 2: HORIZONTAL ERA TIMELINE ═══════════════════════════════ */}
        <div className="bg-space relative flex flex-col items-center overflow-hidden rounded-xl border border-primary/20 p-6 shadow-[0_0_20px_rgba(0,240,255,0.05)]">
          {/* Era Nodes */}
          <div className="relative z-10 flex w-full max-w-[1500px] items-start justify-between pt-4 pb-12">
            {/* The Line */}
            <div className="absolute top-12 right-12 left-12 h-1 rounded-full bg-gradient-to-r from-cyan-500 via-amber-500 to-purple-500 opacity-50" />
            <div className="absolute top-12 right-0 h-1 w-24 border-t border-b border-dashed border-purple-500/50 bg-gradient-to-r from-purple-500/50 to-transparent" />

            {[
              {
                id: "creation",
                n: "CREATION",
                s: "The Beginning",
                y: "∞ - 4000 BCE",
                c: "#00F0FF",
                icon: Star,
              },
              {
                id: "prophets",
                n: "PROPHETS",
                s: "Divine Guidance",
                y: "4000 BCE - 610 CE",
                c: "#F59E0B",
                icon: Users,
              },
              {
                id: "civs",
                n: "CIVILIZATIONS",
                s: "Rise of Civilizations",
                y: "610 - 1500 CE",
                c: "#F97316",
                icon: Map,
              },
              {
                id: "empires",
                n: "EMPIRES",
                s: "Great Empires",
                y: "1500 - 1800 CE",
                c: "#A855F7",
                icon: Swords,
              },
              {
                id: "astronomy",
                n: "ASTRONOMY",
                s: "Exploration of Universe",
                y: "1800 - 2000 CE",
                c: "#3B82F6",
                icon: Telescope,
              },
              {
                id: "present",
                n: "PRESENT",
                s: "Modern Era",
                y: "2000 CE - Now",
                c: "#10B981",
                icon: Globe2,
                isNow: true,
              },
              {
                id: "future",
                n: "FUTURE EVENTS",
                s: "What is to Come",
                y: "Beyond Now",
                c: "#D946EF",
                icon: AlertTriangle,
                isDashed: true,
              },
            ].map((era, i) => (
              <div
                key={i}
                className="group relative flex w-40 cursor-pointer flex-col items-center"
              >
                {/* Node Icon Graphic */}
                <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-transform group-hover:scale-110">
                  <div className="absolute inset-0 rounded-full border border-white/20 bg-gradient-to-b from-white/10 to-transparent opacity-50" />
                  <div
                    className="animate-spin-slow absolute inset-2 rounded-full border border-dashed opacity-70"
                    style={{ borderColor: era.c }}
                  />
                  <era.icon
                    className="h-6 w-6 drop-shadow-[0_0_8px_currentColor]"
                    style={{ color: era.c }}
                  />
                  {/* The dot on the line */}
                  <div
                    className={`border-panel absolute -bottom-[22px] z-20 h-4 w-4 rounded-full border-4 ${era.isDashed ? "border-dashed" : ""}`}
                    style={{ backgroundColor: era.c, borderColor: "var(--color-cyber-dark)" }}
                  />
                  {era.isNow && (
                    <div className="absolute -bottom-[42px] flex flex-col items-center">
                      <div className="h-4 w-px bg-emerald-500" />
                      <div className="rounded border border-emerald-500/50 bg-emerald-950/50 px-2 py-0.5 text-[8px] font-bold whitespace-nowrap text-emerald-400">
                        You are here
                      </div>
                    </div>
                  )}
                </div>

                {/* Text Labels */}
                <div className="mt-2 text-center">
                  <div
                    className="mb-0.5 text-[10px] font-black tracking-widest uppercase"
                    style={{ color: era.c }}
                  >
                    {era.n}
                  </div>
                  <div className="mb-1 font-sans text-[9px] text-white/80">
                    {era.s}
                  </div>
                  <div className="font-mono text-[8px] text-primary">
                    {era.y}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="bg-space flex items-center gap-2 rounded-full border border-white/10 px-6 py-2 text-[9px] font-bold tracking-widest text-primary uppercase transition-colors hover:bg-white/5 hover:text-white">
            VIEW FULL TIMELINE <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* ═══ LAYER 3: MIDDLE ROW (Highlights, Map, Future Events) ═══════════ */}
        <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-12">
          {/* Timeline Highlights (Col 1-3) */}
          <div className="bg-space flex flex-col rounded-xl border border-white/10 p-4 lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-[9px] font-black tracking-widest text-primary uppercase">
                TIMELINE HIGHLIGHTS
              </div>
              <div className="cursor-pointer text-[8px] text-primary hover:text-white">
                View All
              </div>
            </div>

            <div className="hide-scrollbar flex-1 space-y-3 overflow-y-auto">
              {[
                {
                  era: "PROPHETS",
                  e: "Prophet Ibrahim (AS) Born",
                  d: "The birth of Prophet Ibrahim (AS), the friend of Allah.",
                  y: "2000 BCE",
                  c: "#F59E0B",
                },
                {
                  era: "CIVILIZATIONS",
                  e: "The Rise of Bani Isra'il",
                  d: "Bani Isra'il entered Egypt during the time of Prophet Yusuf (AS).",
                  y: "1700 BCE",
                  c: "#F97316",
                },
                {
                  era: "PROPHETS",
                  e: "Prophet Muhammad (SAW) Born",
                  d: "The birth of the final prophet and messenger.",
                  y: "570 CE",
                  c: "#F59E0B",
                },
                {
                  era: "EMPIRES",
                  e: "Rise of Ottoman Empire",
                  d: "Ottoman Empire became a major power in the world.",
                  y: "1299 CE",
                  c: "#A855F7",
                },
                {
                  era: "ASTRONOMY",
                  e: "First Telescope Invented",
                  d: "Galileo built the first telescope and changed astronomy forever.",
                  y: "1608 CE",
                  c: "#3B82F6",
                },
              ].map((hl, i) => (
                <div
                  key={i}
                  className="group flex cursor-pointer gap-3 rounded p-1.5 transition-colors hover:bg-white/5"
                >
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded border border-white/10 bg-primary">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                    <Image
                      unoptimized
                      width={120}
                      height={120}
                      src="/assets/landscape-temp.jpg"
                      alt=""
                      className="h-full w-full object-cover opacity-50 transition-opacity group-hover:opacity-100"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="mb-0.5 flex items-start justify-between">
                      <div
                        className="text-[7px] font-black uppercase"
                        style={{ color: hl.c }}
                      >
                        {hl.era}
                      </div>
                      <div className="font-mono text-[8px] text-primary">
                        {hl.y}
                      </div>
                    </div>
                    <div className="mb-1 text-[10px] leading-tight font-bold text-white">
                      {hl.e}
                    </div>
                    <div className="line-clamp-2 font-sans text-[8px] text-primary">
                      {hl.d}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-3 flex w-full items-center justify-center gap-1 rounded border border-primary/30 py-2 text-center text-[8px] font-bold tracking-widest text-primary uppercase transition-colors hover:bg-primary/10">
              EXPLORE ALL HIGHLIGHTS <ArrowRight className="h-2.5 w-2.5" />
            </button>
          </div>

          {/* Timeline Map View (Col 4-9) */}
          <div className="bg-space relative flex flex-col overflow-hidden rounded-xl border border-white/10 p-4 lg:col-span-6">
            <div className="relative z-20 mb-4 flex items-center justify-between">
              <div className="text-[9px] font-black tracking-widest text-primary uppercase">
                TIMELINE MAP VIEW
              </div>
              <div className="cursor-pointer text-[8px] text-primary hover:text-white">
                View Full Map
              </div>
            </div>

            <div className="bg-space relative min-h-[300px] flex-1 overflow-hidden rounded-lg border border-white/5">
              {/* Massive Map Graphic Simulation */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMCIvPgo8Y2lyY2xlIGN4PSI0IiBjeT0iNCIgcj0iMC41IiBmaWxsPSIjMzBENDc0Ii8+Cjwvc3ZnPg==')] [mask-image:radial-gradient(ellipse_at_center,white,transparent_90%)] opacity-30" />

              <svg
                className="absolute inset-0 h-full w-full overflow-visible"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {/* Connecting lines */}
                <g
                  stroke="#ffffff"
                  strokeWidth="1"
                  strokeOpacity="0.1"
                  fill="none"
                  strokeDasharray="3 3"
                >
                  <path d="M 30 40 Q 40 30 50 45" />
                  <path d="M 50 45 Q 60 50 70 35" />
                  <path d="M 50 45 Q 55 60 65 55" />
                  <path d="M 40 60 Q 45 50 50 45" />
                  <path d="M 70 35 Q 80 40 85 50" />
                </g>

                {/* Map Nodes */}
                {/* Prophets (Yellow) */}
                <circle
                  cx="50"
                  cy="45"
                  r="4"
                  fill="#F59E0B"
                  className="animate-pulse"
                />
                <circle
                  cx="50"
                  cy="45"
                  r="12"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="1"
                  strokeOpacity="0.5"
                />

                {/* Civilizations (Orange) */}
                <circle cx="40" cy="60" r="4" fill="#F97316" />
                <circle cx="30" cy="40" r="4" fill="#F97316" />

                {/* Empires (Purple) */}
                <circle cx="60" cy="50" r="4" fill="#A855F7" />
                <circle cx="70" cy="35" r="4" fill="#A855F7" />

                {/* Astronomy (Blue) */}
                <circle
                  cx="65"
                  cy="55"
                  r="4"
                  fill="#3B82F6"
                  className="animate-pulse"
                />
                <circle cx="85" cy="50" r="4" fill="#3B82F6" />

                {/* Present (Green) */}
                <circle cx="20" cy="30" r="4" fill="#10B981" />
                <circle cx="45" cy="25" r="4" fill="#10B981" />
              </svg>

              {/* Zoom Controls */}
              <div className="bg-space absolute top-1/2 right-3 flex -translate-y-1/2 flex-col rounded border border-white/10 text-primary">
                <button className="border-b border-white/10 p-2 hover:bg-white/5 hover:text-white">
                  <Plus className="h-3 w-3" />
                </button>
                <button className="border-b border-white/10 p-2 hover:bg-white/5 hover:text-white">
                  <Minus className="h-3 w-3" />
                </button>
                <button className="p-2 hover:bg-white/5 hover:text-white">
                  <Target className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Map Legend */}
            <div className="mt-4 flex items-center justify-between px-2">
              {[
                { n: "Prophets", c: "#F59E0B" },
                { n: "Civilizations", c: "#F97316" },
                { n: "Empires", c: "#A855F7" },
                { n: "Astronomy", c: "#3B82F6" },
                { n: "Present", c: "#10B981" },
                { n: "Future", c: "#D946EF" },
              ].map((lg, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 text-[8px] font-bold tracking-widest text-primary uppercase"
                >
                  <span
                    className="border-panel h-2 w-2 rounded-full border shadow-[0_0_5px_currentColor]"
                    style={{ backgroundColor: lg.c, color: lg.c }}
                  />
                  {lg.n}
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Future Events (Col 10-12) */}
          <div className="bg-space flex flex-col rounded-xl border border-white/10 p-4 lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-[9px] font-black tracking-widest text-primary uppercase">
                UPCOMING FUTURE EVENTS
              </div>
              <div className="cursor-pointer text-[8px] text-primary hover:text-white">
                View All
              </div>
            </div>

            <div className="flex-1 space-y-4">
              {[
                {
                  n: "Minor Signs Appear",
                  d: "Beginning of end times minor signs",
                  t: "~ Any Time",
                  icon: Clock,
                  c: "#3B82F6",
                },
                {
                  n: "Dajjal Emergence",
                  d: "The emergence of Dajjal",
                  t: "~ Unknown",
                  icon: Hexagon,
                  c: "#D946EF",
                },
                {
                  n: "Gog & Magog Release",
                  d: "The wall will be breached",
                  t: "~ Unknown",
                  icon: Hexagon,
                  c: "#D946EF",
                },
                {
                  n: "Second Coming of Jesus (AS)",
                  d: "Prophet Jesus (AS) will return",
                  t: "~ Unknown",
                  icon: Users,
                  c: "#00F0FF",
                },
                {
                  n: "The Final Hour",
                  d: "The Day of Resurrection",
                  t: "~ Unknown",
                  icon: AlertTriangle,
                  c: "#F59E0B",
                },
              ].map((ev, i) => (
                <div key={i} className="group flex cursor-pointer gap-3">
                  <div
                    className="bg-space flex h-8 w-8 shrink-0 items-center justify-center rounded-full border"
                    style={{ borderColor: `${ev.c}50` }}
                  >
                    <ev.icon className="h-4 w-4" style={{ color: ev.c }} />
                  </div>
                  <div className="flex-1 border-b border-white/5 pb-3">
                    <div className="mb-0.5 flex items-start justify-between">
                      <div className="text-[10px] font-bold text-white transition-colors group-hover:text-primary">
                        {ev.n}
                      </div>
                      <div className="font-mono text-[8px] whitespace-nowrap text-primary">
                        {ev.t}
                      </div>
                    </div>
                    <div className="font-sans text-[9px] text-primary">
                      {ev.d}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-2 flex w-full items-center justify-center gap-1 rounded border border-white/10 py-2 text-center text-[8px] font-bold tracking-widest text-primary uppercase transition-colors hover:bg-white/5 hover:text-white">
              VIEW ALL FUTURE EVENTS <ArrowRight className="h-2.5 w-2.5" />
            </button>
          </div>
        </div>

        {/* ═══ LAYER 4: BOTTOM ROW (Filters, Stats, Insights) ═════════════════ */}
        <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-12">
          {/* Timeline Filters (Col 1-3) */}
          <div className="bg-space flex flex-col justify-between rounded-xl border border-white/10 p-4 lg:col-span-3">
            <div>
              <div className="mb-4 text-[9px] font-black tracking-widest text-primary uppercase">
                TIMELINE FILTERS
              </div>

              <div className="grid grid-cols-3 gap-2">
                {/* Category Column */}
                <div>
                  <div className="mb-2 text-[8px] text-primary uppercase">
                    CATEGORY
                  </div>
                  <div className="space-y-1.5 text-[8px] text-primary">
                    <label className="flex cursor-pointer items-center gap-2 hover:text-white">
                      <div className="flex h-2.5 w-2.5 items-center justify-center rounded-full border border-primary bg-cyan-950">
                        <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      </div>{" "}
                      All Categories
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 hover:text-white">
                      <Users className="h-3 w-3" /> Prophets
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 hover:text-white">
                      <Globe2 className="h-3 w-3" /> Civilizations
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 hover:text-white">
                      <Swords className="h-3 w-3" /> Empires
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 hover:text-white">
                      <Telescope className="h-3 w-3" /> Astronomy
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 hover:text-white">
                      <AlertCircle className="h-3 w-3" /> Events
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 hover:text-white">
                      <Clock className="h-3 w-3" /> Future
                    </label>
                  </div>
                </div>

                {/* Region Column */}
                <div>
                  <div className="mb-2 text-[8px] text-primary uppercase">
                    REGION
                  </div>
                  <div className="space-y-1.5 text-[8px] text-primary">
                    <label className="flex cursor-pointer items-center gap-2 hover:text-white">
                      <div className="flex h-2.5 w-2.5 items-center justify-center rounded-full border border-primary bg-cyan-950">
                        <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      </div>{" "}
                      All Regions
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 hover:text-white">
                      <div className="h-2.5 w-2.5 rounded-full border border-white/30" />{" "}
                      Middle East
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 hover:text-white">
                      <div className="h-2.5 w-2.5 rounded-full border border-white/30" />{" "}
                      Asia
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 hover:text-white">
                      <div className="h-2.5 w-2.5 rounded-full border border-white/30" />{" "}
                      Europe
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 hover:text-white">
                      <div className="h-2.5 w-2.5 rounded-full border border-white/30" />{" "}
                      Africa
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 hover:text-white">
                      <div className="h-2.5 w-2.5 rounded-full border border-white/30" />{" "}
                      Americas
                    </label>
                  </div>
                </div>

                {/* Time Period Column */}
                <div>
                  <div className="mb-2 text-[8px] text-primary uppercase">
                    TIME PERIOD
                  </div>
                  <div className="space-y-1.5 text-[8px] text-primary">
                    <label className="flex cursor-pointer items-center gap-2 hover:text-white">
                      <div className="flex h-2.5 w-2.5 items-center justify-center rounded-full border border-primary bg-cyan-950">
                        <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      </div>{" "}
                      All Time
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 hover:text-white">
                      <div className="h-2.5 w-2.5 rounded-full border border-white/30" />{" "}
                      Before Common Era
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 hover:text-white">
                      <div className="h-2.5 w-2.5 rounded-full border border-white/30" />{" "}
                      Common Era
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 hover:text-white">
                      <div className="h-2.5 w-2.5 rounded-full border border-white/30" />{" "}
                      Modern Era
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 hover:text-white">
                      <div className="h-2.5 w-2.5 rounded-full border border-white/30" />{" "}
                      Future
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <button className="mt-4 flex w-full items-center justify-center gap-2 rounded border border-primary/30 bg-primary/10 py-2 text-[9px] font-bold tracking-widest text-primary uppercase transition-colors hover:bg-primary/20">
              APPLY FILTERS <Filter className="h-3 w-3" />
            </button>
          </div>

          {/* Key Statistics & Footer Graphic (Col 4-9) */}
          <div className="flex flex-col gap-4 lg:col-span-6">
            {/* Stats */}
            <div className="bg-space rounded-xl border border-white/10 p-4">
              <div className="mb-4 text-[9px] font-black tracking-widest text-primary uppercase">
                KEY STATISTICS
              </div>

              <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
                {[
                  {
                    n: "Total Events",
                    v: "1,842",
                    s: "Across all time",
                    icon: Book,
                    c: "#F59E0B",
                  },
                  {
                    n: "Prophets & Messengers",
                    v: "124",
                    s: "Sent to guide humanity",
                    icon: Users,
                    c: "#10B981",
                  },
                  {
                    n: "Major Civilizations",
                    v: "96",
                    s: "That shaped the world",
                    icon: Map,
                    c: "#A855F7",
                  },
                  {
                    n: "Powerful Empires",
                    v: "47",
                    s: "Rise and fall of powers",
                    icon: Swords,
                    c: "#F97316",
                  },
                  {
                    n: "Astronomy Discoveries",
                    v: "128",
                    s: "Milestones of knowledge",
                    icon: Telescope,
                    c: "#3B82F6",
                  },
                  {
                    n: "Future Major Events",
                    v: "23",
                    s: "Awaiting to unfold",
                    icon: Clock,
                    c: "#10B981",
                  },
                ].map((st, i) => (
                  <div
                    key={i}
                    className="bg-space flex flex-col items-center justify-center rounded-lg border border-white/5 p-2 text-center"
                  >
                    <st.icon className="mb-2 h-5 w-5" style={{ color: st.c }} />
                    <div className="mb-1 font-mono text-lg leading-none font-black text-white">
                      {st.v}
                    </div>
                    <div className="mb-0.5 text-[7px] leading-tight text-primary">
                      {st.n}
                    </div>
                    <div className="hidden text-[6px] text-primary md:block">
                      {st.s}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Graphic (Camels in Desert) */}
            <div className="bg-space relative flex min-h-[120px] flex-1 flex-col items-center justify-center overflow-hidden rounded-xl border border-white/10 text-center">
              <div className="from-space absolute inset-0 z-10 bg-gradient-to-t via-transparent to-transparent" />
              {/* Silhouette abstract simulation */}
              <svg
                className="absolute bottom-0 z-0 h-20 w-full opacity-30"
                preserveAspectRatio="none"
              >
                <path
                  d="M 0,20 Q 20,15 40,20 T 80,18 T 120,22 T 160,15 T 200,20 L 200,20 L 0,20 Z"
                  fill="#0A1220"
                />
                <path
                  d="M 10,20 Q 15,10 20,20 Z M 30,20 Q 32,15 35,20 Z M 60,20 Q 65,5 70,20 Z"
                  fill="#1A253A"
                />{" "}
                {/* Camels abstract */}
              </svg>

              <div className="relative z-20 px-8">
                <div
                  className="font-arabic mb-2 text-[16px] font-bold text-white"
                  dir="rtl"
                >
                  إِنَّ فِي ذَٰلِكَ لَعِبْرَةً لِّأُولِي الْأَبْصَارِ
                </div>
                <div className="mb-2 font-sans text-[10px] text-white/70 italic">
                  "Indeed in that are signs for those of understanding."
                </div>
                <div className="font-mono text-[9px] font-bold text-primary uppercase">
                  Qur&apos;an 59:21
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Insights (Col 10-12) */}
          <div className="bg-space flex flex-col rounded-xl border border-white/10 p-4 lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-[9px] font-black tracking-widest text-primary uppercase">
                TIMELINE INSIGHTS
              </div>
              <div className="cursor-pointer text-[8px] text-primary hover:text-white">
                View All
              </div>
            </div>

            <div className="flex-1 space-y-4">
              {[
                {
                  n: "History repeats in patterns",
                  d: "Similar events occurred 3 times in different eras.",
                  icon: History,
                  c: "#3B82F6",
                },
                {
                  n: "Knowledge evolves continuously",
                  d: "Astronomy discoveries increased 400% in last 200 years.",
                  icon: BookOpen,
                  c: "#A855F7",
                },
                {
                  n: "Divine guidance is consistent",
                  d: "124 messengers were sent across all civilizations.",
                  icon: Users,
                  c: "#10B981",
                },
                {
                  n: "The end is certain",
                  d: "Future events are mentioned in 27% of verses.",
                  icon: Clock,
                  c: "#F59E0B",
                },
              ].map((ins, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 border-b border-white/5 pb-3"
                >
                  <div
                    className="bg-space flex h-8 w-8 shrink-0 items-center justify-center rounded-full border"
                    style={{ borderColor: `${ins.c}50` }}
                  >
                    <ins.icon className="h-4 w-4" style={{ color: ins.c }} />
                  </div>
                  <div>
                    <div className="mb-0.5 text-[10px] font-bold text-white">
                      {ins.n}
                    </div>
                    <div className="font-sans text-[8px] leading-relaxed text-primary">
                      {ins.d}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-2 flex w-full items-center justify-center gap-1 rounded border border-white/10 py-2 text-center text-[8px] font-bold tracking-widest text-primary uppercase transition-colors hover:bg-white/5 hover:text-white">
              VIEW ALL INSIGHTS <ArrowRight className="h-2.5 w-2.5" />
            </button>
          </div>
        </div>

        {/* ═══ LAYER 5: PLAYBACK BAR (Bottom Scrubber) ════════════════════════ */}
        <div className="bg-space sticky bottom-0 z-50 flex flex-col items-center gap-6 border-t border-primary/30 p-4 md:flex-row">
          {/* Scrubber Line */}
          <div className="relative flex w-full flex-1 items-center pt-2">
            <div className="absolute right-0 left-0 h-1 overflow-hidden rounded-full bg-primary">
              <div className="h-full w-[65%] bg-gradient-to-r from-cyan-500 via-emerald-500 to-transparent" />
            </div>

            {/* The handle */}
            <div className="absolute left-[65%] h-4 w-4 -translate-x-1/2 cursor-pointer rounded-full border-4 border-emerald-500 bg-white shadow-[0_0_10px_#10B981] transition-transform hover:scale-125" />

            {/* Labels */}
            <div className="absolute top-4 flex w-full justify-between font-mono text-[7px] text-primary">
              <span>∞</span>
              <span>4000 BCE</span>
              <span>2000 BCE</span>
              <span>0</span>
              <span>500 CE</span>
              <span>1000 CE</span>
              <span>1500 CE</span>
              <span>2000 CE</span>
              <span className="font-bold text-emerald-400">Now</span>
              <span>2500 CE</span>
              <span>3000 CE</span>
              <span>3500 CE</span>
              <span>∞</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex shrink-0 items-center gap-4">
            <div className="flex items-center gap-2">
              <button className="rounded p-2 text-primary transition-colors hover:bg-white/10 hover:text-white">
                <Rewind className="h-4 w-4" />
              </button>
              <button
                className="rounded-full border border-primary/50 bg-primary/20 p-3 text-primary shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-colors hover:bg-cyan-900 hover:text-white"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4 fill-current" />
                ) : (
                  <Play className="ml-0.5 h-4 w-4 fill-current" />
                )}
              </button>
              <button className="rounded p-2 text-primary transition-colors hover:bg-white/10 hover:text-white">
                <FastForward className="h-4 w-4" />
              </button>
            </div>

            <button className="rounded border border-emerald-500/30 px-4 py-2 text-[9px] font-bold tracking-widest text-emerald-400 uppercase transition-colors hover:bg-emerald-950/40">
              AUTO PLAY
            </button>

            <button className="rounded p-2 text-primary transition-colors hover:bg-white/10 hover:text-white">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
