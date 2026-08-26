"use client"
import Image from "next/image"

import React, { useState, useEffect } from "react"
import {
  BookOpen,
  Scroll,
  Moon,
  Clock,
  Target,
  Flame,
  CheckCircle2,
  Book,
  FileText,
  Hexagon,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Network,
} from "lucide-react"

export function OSAnalyticsInsights() {
  const [clockWIB, setClockWIB] = useState("06:50:16 WIB")

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
      id="analytics"
      className="bg-space relative z-10 overflow-hidden border-b border-purple-500/30 py-20 font-mono text-foreground"
    >
      {/* ═══ LAYER 1: DEEP SPACE MATRIX BACKGROUND ═══════════════════════════ */}
      <div className="pointer-events-none absolute inset-0">
        <div className="theme-grid-bg absolute inset-0 opacity-30" />
        <div className="bg-radial-gradient absolute top-1/4 right-1/4 h-[800px] w-[800px] from-purple-900/15 via-blue-900/10 to-transparent blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(168,85,247,0.02)_1px,transparent_1px)] bg-[size:100%_4px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-6 px-6 sm:px-10">
        {/* ═══ TOP HEADER (Blueprint 09) ══════════════════════════════════════ */}
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-6 lg:flex-row lg:items-end">
          <div className="max-w-xl space-y-4">
            <div className="bg-space inline-flex items-center gap-3 rounded-sm border-2 border-purple-500/60 px-3.5 py-1.5 text-xs font-black tracking-[0.25em] text-purple-300 uppercase shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              <span className="rounded-xs bg-purple-500 px-1.5 py-0.5 font-black text-black">
                09
              </span>
              <span>ANALYTICS & INSIGHTS</span>
            </div>
            <h2 className="font-mono text-xl font-black tracking-widest text-white uppercase drop-shadow-[0_0_12px_rgba(255,255,255,0.7)] sm:text-3xl">
              Knowledge. Progress. Impact.
            </h2>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center p-4">
            <div
              className="font-arabic mb-2 text-sm font-bold text-primary drop-shadow-[0_0_8px_#00F0FF] md:text-base"
              dir="rtl"
            >
              وَقُل رَّبِّ زِدْنِي عِلْمًا
            </div>
            <div className="font-sans text-[10px] text-primary italic md:text-[11px]">
              "And say, My Lord, increase me in knowledge."{" "}
              <span className="ml-1 font-mono font-black text-primary not-italic">
                Qur'an 20:114
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-6">
            <div className="text-right">
              <div className="font-mono text-2xl font-black tracking-widest text-white drop-shadow-[0_0_8px_#FFF]">
                {clockWIB}
              </div>
              <div className="mt-1 text-[9px] font-bold text-primary uppercase">
                25 MAY 2025 // 27 DHU AL-QI'DAH 1446
              </div>
              <div className="mt-0.5 text-[9px] tracking-widest text-primary uppercase">
                SYSTEM TIME UTC+7
              </div>
            </div>

            <div className="h-14 w-px bg-white/10" />

            <div className="flex items-center gap-3">
              <div>
                <div className="mb-1 text-[9px] font-black tracking-widest text-primary uppercase">
                  KNOWLEDGE CYCLE
                </div>
                <div className="text-sm font-black tracking-wider text-emerald-400">
                  ACTIVE
                </div>
              </div>
              <div className="bg-space relative flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/40">
                <Target className="h-5 w-5 animate-pulse text-emerald-500" />
                <div className="animate-spin-slow absolute inset-0 rounded-full border-t border-emerald-400" />
              </div>
            </div>
          </div>
        </div>

        {/* ═══ LAYER 2: TOP ROW PANELS (Blueprint 09) ═════════════════════════ */}
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
          {/* LEFT: TODAY'S SNAPSHOT (Col 1-3) */}
          <div className="flex flex-col space-y-3 lg:col-span-3">
            <div className="mb-1 text-[10px] font-black tracking-widest text-primary uppercase">
              TODAY'S SNAPSHOT
            </div>

            <div className="bg-space flex items-start gap-3 rounded-lg border border-primary/30 p-3 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
              <div className="shrink-0 rounded border border-primary/30 bg-primary/20 p-2 text-primary">
                <BookOpen className="h-4 w-4" />
              </div>
              <div>
                <div className="mb-1 text-[10px] font-black tracking-wider text-primary uppercase">
                  TODAY&apos;S VERSE
                </div>
                <div className="mb-1 text-xs font-bold text-white">
                  Qur'an 67:5
                </div>
                <div className="font-sans text-[9px] leading-relaxed text-primary">
                  He who created death and life to test you [as to] which of you
                  is best in deed.
                </div>
              </div>
            </div>

            <div className="bg-space flex items-start gap-3 rounded-lg border border-amber-500/30 p-3 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
              <div className="shrink-0 rounded border border-amber-500/30 bg-amber-950/50 p-2 text-amber-400">
                <Scroll className="h-4 w-4" />
              </div>
              <div>
                <div className="mb-1 text-[10px] font-black tracking-wider text-amber-400 uppercase">
                  TODAY'S HADITH
                </div>
                <div className="mb-1 text-xs font-bold text-white">
                  Sahih Bukhari 1
                </div>
                <div className="font-sans text-[9px] leading-relaxed text-primary">
                  Actions are but by intentions, and everyone will have what he
                  intended.
                </div>
              </div>
            </div>

            <div className="bg-space flex items-center gap-3 rounded-lg border border-blue-500/30 p-3">
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
                <Image
                  unoptimized
                  width={120}
                  height={120}
                  alt="User Avatar"
                  src="/assets/cam_moon.png"
                  className="h-full w-full object-cover opacity-80 grayscale"
                />
              </div>
              <div className="flex-1">
                <div className="mb-0.5 text-[10px] font-black tracking-wider text-blue-400 uppercase">
                  MOON STATUS
                </div>
                <div className="mb-1 text-[11px] font-bold text-white uppercase">
                  WAXING GIBBOUS
                </div>
                <div className="flex justify-between text-[8px] text-primary">
                  <span>Illumination 72%</span>
                  <span>Age 12.6 Days</span>
                </div>
              </div>
            </div>

            <div className="bg-space group flex cursor-pointer items-center justify-between rounded-lg border border-emerald-500/30 p-3 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <div className="flex items-center gap-3">
                <div className="shrink-0 rounded border border-emerald-500/30 bg-emerald-950/50 p-2 text-emerald-400">
                  <Clock className="h-4 w-4 animate-pulse" />
                </div>
                <div>
                  <div className="mb-0.5 text-[10px] font-black tracking-wider text-emerald-400 uppercase">
                    PRAYER WINDOW
                  </div>
                  <div className="text-[9px] text-primary uppercase">
                    NEXT WAKTU
                  </div>
                  <div className="text-[11px] font-bold text-white">
                    Dhuhr 11:55 WIB
                  </div>
                </div>
              </div>
              <div className="text-right">
                <ArrowRight className="mb-2 ml-auto h-3 w-3 text-primary transition-colors group-hover:text-emerald-400" />
                <div className="text-xs font-black text-emerald-400">
                  05:04:43
                </div>
              </div>
            </div>
          </div>

          {/* CENTER: KNOWLEDGE PROGRESS (Col 4-8) */}
          <div className="bg-space flex flex-col justify-between rounded-xl border-2 border-primary/30 p-6 shadow-[0_0_40px_rgba(0,240,255,0.1)] lg:col-span-5">
            <div className="mb-4 text-[10px] font-black tracking-widest text-primary uppercase">
              KNOWLEDGE PROGRESS
            </div>

            <div className="flex flex-col items-center gap-8 py-4 md:flex-row">
              {/* Massive Radial Progress */}
              <div className="relative flex h-48 w-48 shrink-0 items-center justify-center">
                {/* 3 Rings */}
                <div className="absolute inset-0 rounded-full border-[8px] border-primary" />
                <div
                  className="absolute inset-0 rounded-full border-[8px] border-primary border-t-transparent border-l-transparent shadow-[0_0_20px_#00F0FF]"
                  style={{ transform: "rotate(45deg)" }}
                />
                <div
                  className="absolute inset-2 rounded-full border-[6px] border-purple-500 border-b-transparent border-l-transparent"
                  style={{ transform: "rotate(-20deg)" }}
                />
                <div
                  className="absolute inset-4 rounded-full border-[4px] border-amber-400 border-t-transparent border-r-transparent"
                  style={{ transform: "rotate(10deg)" }}
                />

                <div className="animate-spin-slow absolute inset-0 rounded-full border border-dashed border-white/5" />

                <div className="text-center">
                  <div className="mb-1 text-[9px] font-bold tracking-widest text-white uppercase">
                    OVERALL
                    <br />
                    PROGRESS
                  </div>
                  <div className="text-4xl font-black text-primary drop-shadow-[0_0_12px_#00F0FF]">
                    68%
                  </div>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="w-full flex-1 space-y-3.5">
                {[
                  { n: "QUR'AN", p: 76, lvl: "Advanced", c: "#00F0FF" },
                  { n: "HADITH", p: 62, lvl: "Intermediate", c: "#F59E0B" },
                  { n: "TAFSIR", p: 54, lvl: "Intermediate", c: "#A855F7" },
                  { n: "SIRAH", p: 48, lvl: "Beginner", c: "#EC4899" },
                  { n: "ASTRONOMY", p: 71, lvl: "Advanced", c: "#3B82F6" },
                  { n: "HISTORY", p: 65, lvl: "Intermediate", c: "#10B981" },
                  { n: "LANGUAGE", p: 49, lvl: "Beginner", c: "#64748B" },
                  { n: "TOPICS", p: 58, lvl: "Intermediate", c: "#A0B0C0" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Hexagon
                      className="h-3.5 w-3.5 shrink-0"
                      style={{ color: item.c }}
                    />
                    <div className="w-20 text-[9px] font-black text-white">
                      {item.n}
                    </div>
                    <div className="bg-space h-1 flex-1 overflow-hidden rounded-full">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${item.p}%`,
                          backgroundColor: item.c,
                          boxShadow: `0 0 8px ${item.c}`,
                        }}
                      />
                    </div>
                    <div className="w-24 text-right">
                      <div
                        className="text-[10px] font-black"
                        style={{ color: item.c }}
                      >
                        {item.p}%
                      </div>
                      <div className="text-[7px] leading-none text-primary uppercase">
                        {item.lvl}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className="mt-4 flex w-full items-center justify-center gap-2 rounded border border-cyan-500/40 bg-transparent py-3 text-[10px] font-black tracking-widest text-primary uppercase transition-colors hover:bg-primary/10">
              VIEW DETAILED ANALYTICS <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* RIGHT: ACTIVITY OVERVIEW & RECENT (Col 9-12) */}
          <div className="flex flex-col gap-6 lg:col-span-4">
            {/* Activity Chart */}
            <div className="bg-space flex flex-1 flex-col justify-between rounded-xl border border-white/10 p-5 shadow-lg">
              <div className="mb-4 text-[10px] font-black tracking-widest text-primary uppercase">
                ACTIVITY OVERVIEW
              </div>

              <div className="mb-6 flex gap-2 text-[9px] font-bold tracking-wider">
                <button className="flex-1 rounded border border-cyan-500/40 bg-primary/20 py-1.5 text-primary">
                  7 DAYS
                </button>
                <button className="flex-1 rounded border border-white/10 bg-transparent py-1.5 text-primary transition-colors hover:border-white/30">
                  30 DAYS
                </button>
                <button className="flex-1 rounded border border-white/10 bg-transparent py-1.5 text-primary transition-colors hover:border-white/30">
                  90 DAYS
                </button>
              </div>

              {/* Chart Visual Simulation */}
              <div className="relative flex h-24 w-full items-end justify-between px-2 text-[8px] text-primary">
                {/* Horizontal grid lines */}
                <div className="absolute inset-x-0 bottom-0 border-t border-white/5" />
                <div className="absolute inset-x-0 bottom-[25%] border-t border-white/5" />
                <div className="absolute inset-x-0 bottom-[50%] border-t border-white/5" />
                <div className="absolute inset-x-0 bottom-[75%] border-t border-white/5" />
                <div className="absolute inset-x-0 top-0 border-t border-white/5" />

                {/* Left labels */}
                <div className="absolute top-0 left-0 -translate-y-1/2">
                  100
                </div>
                <div className="absolute bottom-[75%] left-0 -translate-y-1/2">
                  75
                </div>
                <div className="absolute bottom-[50%] left-0 -translate-y-1/2">
                  50
                </div>
                <div className="absolute bottom-[25%] left-0 -translate-y-1/2">
                  25
                </div>
                <div className="absolute bottom-0 left-0 -translate-y-1/2">
                  0
                </div>

                {/* SVG Graph Lines (Approximate visual) */}
                <svg
                  className="absolute inset-0 h-full w-full overflow-visible pl-6"
                  preserveAspectRatio="none"
                >
                  {/* Cyan line */}
                  <polyline
                    points="0,60 20,40 40,50 60,30 80,45 100,20 120,40"
                    fill="none"
                    stroke="#00F0FF"
                    strokeWidth="1.5"
                    className="drop-shadow-[0_0_3px_#00F0FF]"
                  />
                  {/* Green line */}
                  <polyline
                    points="0,80 20,70 40,75 60,60 80,70 100,50 120,65"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="1.5"
                  />
                  {/* Purple line */}
                  <polyline
                    points="0,90 20,85 40,88 60,80 80,85 100,75 120,80"
                    fill="none"
                    stroke="#A855F7"
                    strokeWidth="1.5"
                  />
                </svg>

                <div className="relative z-10 mt-auto flex w-full justify-between border-t border-white/10 pt-2 pl-6 font-mono text-[7px] uppercase">
                  <span>19 MAY</span>
                  <span>20 MAY</span>
                  <span>21 MAY</span>
                  <span>22 MAY</span>
                  <span>23 MAY</span>
                  <span>24 MAY</span>
                  <span>25 MAY</span>
                </div>
              </div>

              {/* Chart Legend */}
              <div className="mt-4 flex items-center justify-between text-[8px] font-bold tracking-wider text-white uppercase">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />{" "}
                  READING
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />{" "}
                  STUDY
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />{" "}
                  RESEARCH
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />{" "}
                  REFLECTION
                </span>
              </div>
            </div>

            {/* Recent Discoveries */}
            <div className="bg-space flex flex-1 flex-col justify-between rounded-xl border border-white/10 p-5">
              <div className="mb-4 text-[10px] font-black tracking-widest text-primary uppercase">
                RECENT DISCOVERIES
              </div>

              <div className="space-y-3 font-mono">
                {[
                  {
                    n: "New Cross Reference Found",
                    s: "Qur'an 2:164 ↔ Qur'an 3:190",
                    icon: Network,
                    c: "#00F0FF",
                    t: "2h ago",
                  },
                  {
                    n: "Astronomical Event Added",
                    s: "Lunar Eclipse on 14 Mar 2026",
                    icon: Moon,
                    c: "#F59E0B",
                    t: "5h ago",
                  },
                  {
                    n: "Historical Record Unlocked",
                    s: "The Treaty of Hudaybiyyah",
                    icon: Book,
                    c: "#10B981",
                    t: "1d ago",
                  },
                  {
                    n: "Knowledge Milestone",
                    s: "Completed 100 Days Learning Streak",
                    icon: Flame,
                    c: "#EC4899",
                    t: "1d ago",
                  },
                ].map((act, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <act.icon
                      className="mt-0.5 h-3.5 w-3.5"
                      style={{ color: act.c }}
                    />
                    <div className="flex-1">
                      <div className="text-[10px] font-bold text-white">
                        {act.n}
                      </div>
                      <div className="max-w-[200px] truncate text-[9px] text-primary">
                        {act.s}
                      </div>
                    </div>
                    <div className="text-[8px] whitespace-nowrap text-primary">
                      {act.t}
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-3 flex w-full items-center justify-end gap-1 text-right text-[9px] font-bold tracking-widest text-primary uppercase hover:text-white">
                VIEW ALL ACTIVITY <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        {/* ═══ LAYER 3: BOTTOM PANELS ROW (Blueprint 09) ══════════════════════ */}
        <div className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-2 lg:grid-cols-4">
          {/* Panel 1: Learning Streak */}
          <div className="bg-space flex flex-col justify-between rounded-xl border border-white/10 p-5">
            <div className="mb-4 text-[10px] font-black tracking-widest text-primary uppercase">
              LEARNING STREAK
            </div>

            <div className="mb-6 flex items-center gap-4">
              <Flame className="h-10 w-10 animate-pulse text-rose-500 drop-shadow-[0_0_10px_#F43F5E]" />
              <div>
                <div className="font-mono text-3xl leading-none font-black text-primary">
                  100
                </div>
                <div className="mt-1 text-[9px] font-bold tracking-widest text-white uppercase">
                  DAYS
                </div>
              </div>
              <div className="ml-auto max-w-[90px] font-sans text-[9px] text-primary italic">
                Keep it up! Consistency builds true understanding.
              </div>
            </div>

            <div className="mb-6 flex items-center justify-between px-2 font-mono text-[9px] font-black">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <span className="text-white">{day}</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 drop-shadow-[0_0_5px_#10B981]" />
                </div>
              ))}
            </div>

            <button className="flex w-full items-center gap-1 border-t border-white/10 pt-4 text-left text-[9px] font-bold tracking-widest text-primary uppercase hover:text-white">
              <Calendar className="h-3.5 w-3.5" /> VIEW CALENDAR{" "}
              <ArrowRight className="ml-auto h-3 w-3" />
            </button>
          </div>

          {/* Panel 2: Time Investment */}
          <div className="bg-space flex flex-col justify-between rounded-xl border border-white/10 p-5">
            <div className="mb-4 text-[10px] font-black tracking-widest text-primary uppercase">
              TIME INVESTMENT
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-[6px] border-primary shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                {/* 4 Colored arcs */}
                <div
                  className="absolute inset-0 rounded-full border-[6px] border-emerald-400 border-t-transparent border-l-transparent"
                  style={{ transform: "rotate(45deg)" }}
                />
                <div
                  className="absolute inset-0 rounded-full border-[6px] border-amber-400 border-r-transparent border-b-transparent"
                  style={{ transform: "rotate(45deg)" }}
                />
                <div
                  className="absolute inset-0 rounded-full border-[6px] border-purple-500 border-b-transparent border-l-transparent"
                  style={{ transform: "rotate(-45deg)" }}
                />
                <div
                  className="absolute inset-0 rounded-full border-[6px] border-blue-400 border-t-transparent border-r-transparent"
                  style={{ transform: "rotate(-45deg)" }}
                />

                <div className="text-center">
                  <div className="mb-0.5 text-[8px] font-bold tracking-wider text-primary uppercase">
                    TOTAL
                  </div>
                  <div className="font-mono text-sm leading-tight font-black text-white">
                    128h
                    <br />
                    45m
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-1.5 font-mono text-[9px]">
                {[
                  { l: "QUR'AN", v: "42h 15m", c: "#10B981" },
                  { l: "HADITH", v: "28h 30m", c: "#F59E0B" },
                  { l: "TAFSIR", v: "18h 20m", c: "#A855F7" },
                  { l: "HISTORY", v: "16h 10m", c: "#3B82F6" },
                  { l: "ASTRONOMY", v: "14h 45m", c: "#00F0FF" },
                  { l: "OTHERS", v: "8h 45m", c: "#64748B" },
                ].map((t, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-white">
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: t.c }}
                      />
                      {t.l}
                    </span>
                    <span className="text-primary">{t.v}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="mt-6 flex w-full items-center justify-between border-t border-white/10 pt-4 text-center text-[9px] font-bold tracking-widest text-primary uppercase hover:text-white">
              VIEW TIME ANALYTICS <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {/* Panel 3: Weekly Goal */}
          <div className="bg-space flex flex-col justify-between rounded-xl border border-emerald-500/30 p-5 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <div className="mb-4 text-[10px] font-black tracking-widest text-primary uppercase">
              WEEKLY GOAL
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-emerald-950">
                <div
                  className="absolute inset-0 rounded-full border-4 border-emerald-400 border-l-transparent shadow-[0_0_15px_#10B981]"
                  style={{ transform: "rotate(-45deg)" }}
                />

                <div className="text-center">
                  <div className="font-mono text-2xl font-black text-emerald-400">
                    78%
                  </div>
                  <div className="text-[8px] font-bold tracking-wider text-white uppercase">
                    COMPLETED
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-3 text-right font-mono text-[10px]">
                <div>
                  <div className="text-primary">Goal</div>
                  <div className="font-black text-primary">15h 00m</div>
                </div>
                <div>
                  <div className="text-primary">Achieved</div>
                  <div className="font-black text-emerald-400">11h 42m</div>
                </div>
                <div>
                  <div className="text-primary">Remaining</div>
                  <div className="font-black text-white">03h 18m</div>
                </div>
              </div>
            </div>

            <button className="mt-6 flex w-full items-center justify-between border-t border-white/10 pt-4 text-center text-[9px] font-bold tracking-widest text-emerald-400 uppercase hover:text-white">
              ADJUST GOAL <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {/* Panel 4: Knowledge Impact */}
          <div className="bg-space flex flex-col justify-between rounded-xl border border-white/10 p-5">
            <div className="mb-4 text-[10px] font-black tracking-widest text-primary uppercase">
              KNOWLEDGE IMPACT
            </div>

            <div className="grid h-full grid-cols-2 gap-3">
              <div className="rounded border border-white/5 bg-white/5 p-2">
                <div className="mb-2 flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-[8px] text-primary uppercase">
                    VERSES READ
                  </span>
                </div>
                <div className="font-mono text-xl font-black text-white">
                  1,248
                </div>
                <div className="text-[8px] text-emerald-400">
                  +156 this week
                </div>
              </div>
              <div className="rounded border border-white/5 bg-white/5 p-2">
                <div className="mb-2 flex items-center gap-2">
                  <Scroll className="h-3.5 w-3.5 text-amber-400" />
                  <span className="text-[8px] text-primary uppercase">
                    AHADITH READ
                  </span>
                </div>
                <div className="font-mono text-xl font-black text-white">
                  982
                </div>
                <div className="text-[8px] text-emerald-400">
                  +112 this week
                </div>
              </div>
              <div className="rounded border border-white/5 bg-white/5 p-2">
                <div className="mb-2 flex items-center gap-2">
                  <Book className="h-3.5 w-3.5 text-primary" />
                  <span className="text-[8px] text-primary uppercase">
                    PAGES STUDIED
                  </span>
                </div>
                <div className="font-mono text-xl font-black text-white">
                  1,532
                </div>
                <div className="text-[8px] text-emerald-400">
                  +203 this week
                </div>
              </div>
              <div className="rounded border border-white/5 bg-white/5 p-2">
                <div className="mb-2 flex items-center gap-2">
                  <FileText className="text-knowledge h-3.5 w-3.5" />
                  <span className="text-[8px] text-primary uppercase">
                    NOTES TAKEN
                  </span>
                </div>
                <div className="font-mono text-xl font-black text-white">
                  245
                </div>
                <div className="text-[8px] text-emerald-400">+37 this week</div>
              </div>
            </div>

            <button className="mt-4 flex w-full items-center justify-between border-t border-white/10 pt-4 text-center text-[9px] font-bold tracking-widest text-primary uppercase hover:text-white">
              VIEW IMPACT REPORT <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* ═══ FOOTER STATUS STRIP (Blueprint 09 Footer) ══════════════════════ */}
        <div className="mt-6 flex flex-col items-center justify-between gap-6 border-t border-white/10 px-2 pt-4 font-mono text-[9px] font-bold tracking-widest text-primary uppercase md:flex-row">
          <div className="flex items-center gap-4">
            <BookOpen className="h-6 w-6 text-primary" />
            <div className="font-sans text-white/60 normal-case italic">
              "Knowledge is light. Action is power.
              <br />
              Sincerity is the key."
            </div>
          </div>
          <div className="flex flex-col items-center gap-1 text-center md:items-start md:text-left">
            <div className="text-primary">DATA SYNCHRONIZATION</div>
            <div>Last Sync: 25 May 2025 06:45 WIB</div>
          </div>
          <div className="hidden items-center gap-1 opacity-50 lg:flex">
            {/* Audio Wave Visualizer Simulation */}
            {[
              4, 12, 6, 8, 15, 5, 10, 7, 14, 6, 9, 11, 5, 13, 8, 4, 16, 7, 10,
              5,
            ].map((h, i) => (
              <div
                key={i}
                className="w-0.5 bg-cyan-400"
                style={{ height: `${h}px` }}
              />
            ))}
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2 text-emerald-400">
              KNOWLEDGE INTEGRITY 100% <ShieldCheck className="h-4 w-4" />
            </div>
            {/* Dot Progress Bar */}
            <div className="mt-1 flex gap-0.5">
              {[...Array(40)].map((_, i) => (
                <div key={i} className="h-1.5 w-1 bg-emerald-500/80" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
