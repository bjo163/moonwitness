"use client"
import Image from "next/image"

import React, { useState, useEffect } from "react"
import {
  Moon,
  BookOpen,
  Scroll,
  Map,
  Target,
  Globe2,
  Brain,
  Database,
  Flame,
  Telescope,
  Download,
  Share2,
  Calendar,
  FileText,
  ArrowRight,
  Sun,
} from "lucide-react"

export function OSKnowledgeTrend() {
  const [clockWIB, setClockWIB] = useState("07:13:45 WIB")

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
      id="trends"
      className="bg-background relative z-10 overflow-hidden border-b border-blue-500/30 py-20 font-mono text-foreground"
    >
      {/* ═══ LAYER 1: DEEP SPACE BACKGROUND ══════════════════════════════════ */}
      <div className="pointer-events-none absolute inset-0">
        <div className="theme-grid-bg absolute inset-0 opacity-30" />
        <div className="bg-radial-gradient absolute top-1/3 left-1/2 h-[900px] w-[1400px] -translate-x-1/2 from-blue-900/10 via-transparent to-transparent blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] space-y-4 px-4">
        {/* ═══ TOP HEADER (Blueprint 13) ══════════════════════════════════════ */}
        <div className="flex flex-col justify-between gap-4 border-b border-border pb-4 xl:flex-row xl:items-center">
          <div className="flex items-center gap-4">
            <div className="bg-background inline-flex items-center gap-3 rounded-sm border-2 border-border px-3.5 py-1.5 text-xs font-black tracking-[0.25em] text-primary uppercase shadow-sm">
              <span className="rounded-xs bg-primary px-1.5 py-0.5 font-black text-foreground">
                13
              </span>
              <span>KNOWLEDGE TREND ENGINE</span>
            </div>
            <h2 className="ml-2 font-mono text-sm font-black tracking-widest text-primary uppercase">
              Discover What Matters. Understand What's Next.
            </h2>
          </div>

          <div className="border-b-2 border-primary bg-gradient-to-t from-primary/10 to-transparent p-3 text-center xl:text-left">
            <div
              className="font-arabic mb-1 text-sm font-bold text-primary"
              dir="rtl"
            >
              قُلْ سِيرُوا فِي الْأَرْضِ فَانظُرُوا كَيْفَ بَدَأَ الْخَلْقَ
            </div>
            <div className="font-sans text-[9px] text-primary italic">
              Say, [O Muhammad], "Travel through the land and observe how was
              the creation..."{" "}
              <span className="ml-1 font-mono font-black text-primary not-italic">
                Qur'an 29:20
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-6">
            <div>
              <div className="mb-1 text-[8px] tracking-widest text-primary uppercase">
                TREND TIME RANGE
              </div>
              <div className="bg-background flex overflow-hidden rounded border border-border">
                <button className="px-3 py-1.5 text-[9px] font-bold text-primary transition-colors hover:bg-muted/30">
                  24H
                </button>
                <button className="border-b-2 border-primary bg-primary/20 px-3 py-1.5 text-[9px] font-bold text-primary">
                  7D
                </button>
                <button className="px-3 py-1.5 text-[9px] font-bold text-primary transition-colors hover:bg-muted/30">
                  30D
                </button>
                <button className="px-3 py-1.5 text-[9px] font-bold text-primary transition-colors hover:bg-muted/30">
                  90D
                </button>
                <button className="border-r border-border px-3 py-1.5 text-[9px] font-bold text-primary transition-colors hover:bg-muted/30">
                  1Y
                </button>
                <button className="px-3 py-1.5 text-primary transition-colors hover:bg-muted/30">
                  <Calendar className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ LAYER 2: TRENDING THIS WEEK (Row 1) ════════════════════════════ */}
        <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-12">
          <div className="lg:col-span-10">
            <div className="mb-3 text-[9px] font-black tracking-widest text-primary uppercase">
              TRENDING THIS WEEK
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
              {[
                { n: "MOON", v: "68.4K", p: "+42%", i: Moon, c: "#3B82F6" },
                {
                  n: "AI & TECHNOLOGY",
                  v: "53.1K",
                  p: "+38%",
                  i: Brain,
                  c: "#00F0FF",
                },
                { n: "HISTORY", v: "48.7K", p: "+31%", i: Map, c: "#10B981" },
                {
                  n: "ASTRONOMY",
                  v: "47.2K",
                  p: "+26%",
                  i: Telescope,
                  c: "#3B82F6",
                },
                { n: "HADITH", v: "36.8K", p: "+24%", i: Scroll, c: "#F59E0B" },
                {
                  n: "QUR'AN",
                  v: "35.9K",
                  p: "+22%",
                  i: BookOpen,
                  c: "#10B981",
                },
                {
                  n: "ESCHATOLOGY",
                  v: "29.7K",
                  p: "+18%",
                  i: Flame,
                  c: "#A855F7",
                },
                {
                  n: "SCIENCE",
                  v: "21.3K",
                  p: "+16%",
                  i: Target,
                  c: "#F43F5E",
                },
              ].map((tr, i) => (
                <div
                  key={i}
                  className="bg-background group flex flex-col justify-between rounded-xl border border-border p-3 shadow-sm transition-colors hover:border-border"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <tr.i className="h-3.5 w-3.5" style={{ color: tr.c }} />
                    <div className="truncate text-[8px] font-black text-primary uppercase transition-colors group-hover:text-foreground">
                      {tr.n}
                    </div>
                  </div>
                  <div className="mb-2 flex items-end justify-between">
                    <div className="text-sm font-black text-foreground">{tr.v}</div>
                    <div
                      className="text-[9px] font-bold"
                      style={{ color: tr.c }}
                    >
                      {tr.p}
                    </div>
                  </div>
                  {/* Sparkline simulation */}
                  <svg
                    viewBox="0 0 100 20"
                    className="h-4 w-full overflow-visible"
                    preserveAspectRatio="none"
                  >
                    <polyline
                      points={`0,15 20,${12 - (i % 3)} 40,${15 - (i % 4)} 60,${8 + (i % 2)} 80,5 100,2`}
                      fill="none"
                      stroke={tr.c}
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-background flex flex-col justify-between rounded-xl border border-primary/30 p-3 lg:col-span-2">
            <div className="mb-2 text-[9px] font-black tracking-widest text-primary uppercase">
              OVERALL TREND SCORE
            </div>

            <div className="flex items-center justify-between">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-primary">
                <div
                  className="absolute inset-0 rounded-full border-[4px] border-emerald-400 border-r-transparent border-b-transparent shadow-sm"
                  style={{ transform: "rotate(45deg)" }}
                />
                <div
                  className="absolute inset-0 rounded-full border-[4px] border-primary border-b-transparent border-l-transparent"
                  style={{ transform: "rotate(-45deg)" }}
                />

                <div className="text-center">
                  <div className="font-mono text-xl leading-none font-black text-primary">
                    82
                  </div>
                  <div className="mt-1 text-[6px] font-bold text-success uppercase">
                    Very High
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="mb-1 text-[7px] leading-tight text-primary uppercase">
                  Global Knowledge Interest
                </div>
                <div className="font-mono text-sm font-black text-success">
                  +18%
                </div>
                <div className="text-[7px] text-primary">from last week</div>
              </div>
            </div>

            <div className="mt-2 flex h-4 w-full items-end gap-[1px]">
              {[
                45, 82, 23, 67, 12, 89, 34, 56, 78, 19, 91, 43, 65, 27, 88, 54,
                31, 76, 98, 15, 62, 41, 85, 29, 73, 58, 37, 94, 18, 69, 47, 81,
                25, 71, 52, 39, 86, 14, 61, 33,
              ].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-primary/10"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ═══ LAYER 3: HEATMAP + TIMELINE + VERSES (Row 2) ═══════════════════ */}
        <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-12">
          {/* Knowledge Heatmap (Col 1-4) */}
          <div className="bg-background flex flex-col rounded-xl border border-border p-4 lg:col-span-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-[9px] font-black tracking-widest text-primary uppercase">
                KNOWLEDGE HEATMAP
              </div>
              <div className="flex cursor-pointer items-center gap-1 rounded bg-muted/30 px-2 py-1 text-[8px] text-primary">
                View by: Mentions ∨
              </div>
            </div>

            <div className="bg-background relative mb-3 min-h-[150px] flex-1 overflow-hidden rounded-lg border border-border">
              {/* Heatmap Graphic Simulation */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMCIvPgo8Y2lyY2xlIGN4PSI0IiBjeT0iNCIgcj0iMC41IiBmaWxsPSIjMzBENDc0Ii8+Cjwvc3ZnPg==')] [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)] opacity-30" />
              {/* ambienting regions */}
              <div className="absolute top-[50%] left-[75%] h-8 w-12 rounded-full bg-rose-500/40 blur-xl" />{" "}
              {/* Indonesia/Malaysia */}
              <div className="absolute top-[45%] left-[65%] h-10 w-10 rounded-full bg-amber-500/30 blur-xl" />{" "}
              {/* India */}
              <div className="absolute top-[35%] left-[55%] h-8 w-12 rounded-full bg-rose-500/30 blur-xl" />{" "}
              {/* Middle East */}
              <div className="absolute top-[25%] left-[20%] h-10 w-16 rounded-full bg-muted blur-xl" />{" "}
              {/* North America */}
              <div className="absolute top-[30%] left-[45%] h-10 w-10 rounded-full bg-blue-500/20 blur-xl" />{" "}
              {/* Europe */}
              <div className="bg-background/80 absolute bottom-2 left-2 rounded border border-border p-1.5 backdrop-blur">
                <div className="mb-1 text-[6px] text-foreground uppercase">
                  INTENSITY
                </div>
                <div className="h-16 w-2 rounded-full bg-gradient-to-t from-blue-500 via-amber-500 to-rose-500" />
                <div className="absolute top-[14px] left-4 flex h-16 flex-col justify-between text-[6px] text-primary">
                  <span>High</span>
                  <span>Low</span>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-2 text-[8px] font-black tracking-widest text-primary uppercase">
                TOP REGIONS
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[9px]">
                <div className="flex justify-between">
                  <span>1 Indonesia</span>
                  <span className="font-mono text-foreground">14.2K</span>
                </div>
                <div className="flex justify-between">
                  <span>3 United States</span>
                  <span className="font-mono text-foreground">8.6K</span>
                </div>
                <div className="flex justify-between">
                  <span>2 India</span>
                  <span className="font-mono text-foreground">9.8K</span>
                </div>
                <div className="flex justify-between">
                  <span>4 Malaysia</span>
                  <span className="font-mono text-foreground">6.3K</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trending Timeline (Col 5-9) */}
          <div className="bg-background flex flex-col rounded-xl border border-border p-4 lg:col-span-5">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[9px] font-black tracking-widest text-primary uppercase">
                TRENDING TIMELINE
              </div>
              <div className="flex overflow-hidden rounded bg-muted/30">
                <button className="border border-primary/30 bg-muted px-2 py-1 text-[8px] text-primary">
                  Line
                </button>
                <button className="border border-transparent px-2 py-1 text-[8px] text-primary">
                  Area
                </button>
              </div>
            </div>

            <div className="mb-4 flex justify-center gap-4 text-[8px] font-bold tracking-widest uppercase">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Moon
              </span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" /> AI
              </span>
              <span className="flex items-center gap-1">
                <span className="bg-success h-1.5 w-1.5 rounded-full" /> History
              </span>
              <span className="flex items-center gap-1">
                <span className="bg-warning h-1.5 w-1.5 rounded-full" /> Qur'an
              </span>
            </div>

            {/* Chart Area Simulation */}
            <div className="relative mt-2 mb-8 ml-6 min-h-[120px] flex-1 border-b border-l border-border">
              {/* Grid lines */}
              <div className="absolute inset-x-0 bottom-[25%] border-t border-border" />
              <div className="absolute inset-x-0 bottom-[50%] border-t border-border" />
              <div className="absolute inset-x-0 bottom-[75%] border-t border-border" />
              <div className="absolute inset-x-0 top-0 border-t border-border" />

              {/* Y Axis */}
              <div className="absolute top-0 -left-6 -translate-y-1/2 text-[7px] text-primary">
                80K
              </div>
              <div className="absolute bottom-[75%] -left-6 -translate-y-1/2 text-[7px] text-primary">
                60K
              </div>
              <div className="absolute bottom-[50%] -left-6 -translate-y-1/2 text-[7px] text-primary">
                40K
              </div>
              <div className="absolute bottom-[25%] -left-6 -translate-y-1/2 text-[7px] text-primary">
                20K
              </div>
              <div className="absolute bottom-0 -left-6 translate-y-1/2 text-[7px] text-primary">
                0
              </div>

              {/* Lines */}
              <svg
                className="absolute inset-0 h-full w-full overflow-visible"
                preserveAspectRatio="none"
              >
                <polyline
                  points="0,80 20,60 40,70 60,30 80,50 100,20 120,40 140,20"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="1.5"
                />
                <polyline
                  points="0,50 20,40 40,45 60,20 80,30 100,40 120,50 140,45"
                  fill="none"
                  stroke="#A855F7"
                  strokeWidth="1.5"
                />
                <polyline
                  points="0,100 20,90 40,80 60,60 80,70 100,65 120,55 140,50"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="1.5"
                />
                <polyline
                  points="0,110 20,100 40,105 60,90 80,85 100,95 120,100 140,110"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="1.5"
                />
              </svg>

              {/* X Axis */}
              <div className="absolute inset-x-0 -bottom-4 flex justify-between font-mono text-[7px] text-primary">
                <span>19 MAY</span>
                <span>20 MAY</span>
                <span>21 MAY</span>
                <span>22 MAY</span>
                <span>23 MAY</span>
                <span>24 MAY</span>
                <span>25 MAY</span>
              </div>
            </div>

            {/* Timeline Events */}
            <div className="mt-auto grid grid-cols-3 gap-2">
              {[
                { d: "19 MAY", n: "New Moon\nObservation Surge", c: "#3B82F6" },
                { d: "21 MAY", n: "AI Research\nBreakthrough", c: "#A855F7" },
                { d: "23 MAY", n: "Qur'an Reflection\nCampaign", c: "#F59E0B" },
              ].map((ev, i) => (
                <div
                  key={i}
                  className="border-l-2 pl-2"
                  style={{ borderColor: ev.c }}
                >
                  <div
                    className="mb-0.5 text-[7px] font-black uppercase"
                    style={{ color: ev.c }}
                  >
                    {ev.d}
                  </div>
                  <div className="text-[8px] leading-tight whitespace-pre-wrap text-foreground">
                    {ev.n}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Verses (Col 10-12) */}
          <div className="bg-background flex flex-col rounded-xl border border-border p-4 lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-[9px] font-black tracking-widest text-primary uppercase">
                POPULAR VERSES
              </div>
              <div className="cursor-pointer text-[8px] text-primary hover:text-foreground">
                View All
              </div>
            </div>

            <div className="flex-1 space-y-4">
              {[
                {
                  v: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
                  ref: "Qur'an 20:114",
                  cnt: "12,842",
                  c: "#00F0FF",
                },
                {
                  v: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
                  ref: "Qur'an 94:5-6",
                  cnt: "9,721",
                  c: "#10B981",
                },
                {
                  v: "قُلْ سِيرُوا فِي الْأَرْضِ فَانظُرُوا",
                  ref: "Qur'an 29:20",
                  cnt: "8,653",
                  c: "#A855F7",
                },
                {
                  v: "وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ",
                  ref: "Qur'an 11:88",
                  cnt: "7,321",
                  c: "#3B82F6",
                },
                {
                  v: "فَاذْكُرُونِي أَذْكُرْكُمْ",
                  ref: "Qur'an 2:152",
                  cnt: "6,128",
                  c: "#F59E0B",
                },
              ].map((vrs, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="bg-background flex h-5 w-5 shrink-0 items-center justify-center rounded border text-[9px] font-black"
                    style={{ borderColor: `${vrs.c}50`, color: vrs.c }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 text-right">
                    <div
                      className="font-arabic mb-1 text-[12px] font-bold text-foreground"
                      dir="rtl"
                    >
                      {vrs.v}
                    </div>
                    <div className="flex items-center justify-between text-[8px]">
                      <span className="font-sans text-primary">{vrs.ref}</span>
                      <span className="font-mono text-foreground">{vrs.cnt}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ LAYER 4: MULTI-PANEL 5 COLUMNS (Row 3) ═════════════════════════ */}
        <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-3 lg:grid-cols-5">
          {/* Popular Questions */}
          <div className="bg-background rounded-xl border border-border p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-[9px] font-black tracking-widest text-primary uppercase">
                POPULAR QUESTIONS
              </div>
              <div className="cursor-pointer text-[8px] text-primary hover:text-foreground">
                View All
              </div>
            </div>
            <div className="space-y-3">
              {[
                { q: "When will the Moon be sighted?", c: "12,842" },
                { q: "How is Hilal visibility calculated?", c: "9,721" },
                { q: "What is the true meaning of life?", c: "8,653" },
                { q: "What are the signs of Qiyamah?", c: "7,321" },
                { q: "How was the universe created?", c: "6,128" },
              ].map((q, i) => (
                <div
                  key={i}
                  className="group flex cursor-pointer items-center justify-between rounded p-1 text-[9px] transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-center gap-2 text-foreground group-hover:text-primary">
                    <div className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-primary/50 text-[7px] text-primary">
                      ?
                    </div>
                    <span className="w-36 truncate">{q.q}</span>
                  </div>
                  <span className="font-mono text-primary group-hover:text-foreground">
                    {q.c}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Research */}
          <div className="bg-background rounded-xl border border-border p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-[9px] font-black tracking-widest text-primary uppercase">
                POPULAR RESEARCH
              </div>
              <div className="cursor-pointer text-[8px] text-primary hover:text-foreground">
                View All
              </div>
            </div>
            <div className="space-y-3">
              {[
                { n: "Hilal Visibility Algorithm v2.1", c: "10.2K views" },
                { n: "Moon & Tides Correlation Study", c: "8.7K views" },
                { n: "The Night Journey (Isra' Mi'raj)", c: "6.9K views" },
                { n: "Qur'an & Astronomy Connections", c: "5.4K views" },
                { n: "AI for Islamic Knowledge Graph", c: "5.1K views" },
              ].map((r, i) => (
                <div
                  key={i}
                  className="group flex cursor-pointer items-center justify-between rounded p-1 text-[9px] transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-center gap-2 text-foreground group-hover:text-primary">
                    <FileText className="h-3.5 w-3.5 shrink-0 text-primary group-hover:text-primary" />
                    <span className="w-36 truncate">{r.n}</span>
                  </div>
                  <span className="font-mono text-primary group-hover:text-foreground">
                    {r.c}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Astronomy Events */}
          <div className="bg-background rounded-xl border border-border p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-[9px] font-black tracking-widest text-primary uppercase">
                POPULAR ASTRONOMY EVENTS
              </div>
              <div className="cursor-pointer text-[8px] text-primary hover:text-foreground">
                View All
              </div>
            </div>
            <div className="space-y-3">
              {[
                {
                  n: "Next New Moon",
                  d: "28 May 2025",
                  c: "2 days",
                  icon: Moon,
                  clr: "#00F0FF",
                },
                {
                  n: "Annular Solar Eclipse",
                  d: "2 Oct 2024",
                  c: "129 days",
                  icon: Sun,
                  clr: "#F59E0B",
                },
                {
                  n: "Lunar Eclipse",
                  d: "14 Mar 2025",
                  c: "250 days",
                  icon: Moon,
                  clr: "#3B82F6",
                },
                {
                  n: "Planetary Alignment",
                  d: "23 Aug 2025",
                  c: "381 days",
                  icon: Globe2,
                  clr: "#A855F7",
                },
              ].map((ev, i) => (
                <div
                  key={i}
                  className="group flex cursor-pointer items-center justify-between rounded p-1 text-[9px] transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-center gap-2">
                    <div className="bg-background flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border">
                      <ev.icon
                        className="h-3.5 w-3.5"
                        style={{ color: ev.clr }}
                      />
                    </div>
                    <div>
                      <div className="text-foreground group-hover:text-primary">
                        {ev.n}
                      </div>
                      <div className="text-[8px] text-primary">{ev.d}</div>
                    </div>
                  </div>
                  <span className="font-mono text-foreground group-hover:text-primary">
                    {ev.c}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Topics Cloud */}
          <div className="bg-background flex flex-col rounded-xl border border-border p-4">
            <div className="mb-4 text-[9px] font-black tracking-widest text-primary uppercase">
              TRENDING TOPICS CLOUD
            </div>

            <div className="bg-background flex flex-1 flex-wrap items-center justify-center gap-2 rounded-lg border border-border p-2">
              <span className="text-3xl font-black text-primary">Moon</span>
              <span className="text-xl font-bold text-secondary">AI</span>
              <span className="text-success text-2xl font-black">
                Astronomy
              </span>
              <span className="text-warning text-lg font-bold">Qur'an</span>
              <span className="text-sm font-bold text-primary">Science</span>
              <span className="text-sm font-bold text-rose-500">History</span>
              <span className="text-xs text-primary">Hadith</span>
              <span className="text-xs text-primary">Faith</span>
              <span className="text-[10px] text-primary">Prophets</span>
              <span className="text-[10px] text-success">Civilization</span>
              <span className="text-[9px] text-warning">Eschatology</span>
              <span className="text-knowledge text-[9px]">Knowledge</span>
            </div>
          </div>

          {/* Weekly Insights */}
          <div className="bg-background flex flex-col rounded-xl border border-border p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-[9px] font-black tracking-widest text-primary uppercase">
                WEEKLY INSIGHTS
              </div>
              <div className="cursor-pointer text-[8px] text-primary hover:text-foreground">
                View All
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-start gap-3">
                <Moon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div className="text-[9px] leading-relaxed text-foreground">
                  Interest in{" "}
                  <span className="text-primary">Moon observation</span>{" "}
                  increased 42% due to upcoming Hilal season.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Brain className="text-knowledge mt-0.5 h-4 w-4 shrink-0" />
                <div className="text-[9px] leading-relaxed text-foreground">
                  AI-related research is growing rapidly in Islamic knowledge
                  exploration.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <div className="text-[9px] leading-relaxed text-foreground">
                  Qur'an reflections are most active during evening hours.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ LAYER 5: BOTTOM ROW ════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 items-stretch gap-4 pt-2 md:grid-cols-2 lg:grid-cols-4">
          {/* Trend Prediction */}
          <div className="bg-background relative flex flex-col justify-between overflow-hidden rounded-xl border border-border p-4">
            <div className="relative z-10 mb-4 text-[9px] font-black tracking-widest text-primary uppercase">
              TREND PREDICTION
            </div>

            <div className="relative z-10 font-sans text-[10px] leading-relaxed text-foreground">
              Based on last 7 days pattern,{" "}
              <span className="font-bold text-primary">
                Moon related topics
              </span>{" "}
              will increase by{" "}
              <span className="font-bold text-success">28% next week</span>.
            </div>

            <div className="relative z-0 mt-4 h-12 w-full">
              {/* Prediction line */}
              <svg
                viewBox="0 0 100 20"
                className="h-full w-full overflow-visible"
                preserveAspectRatio="none"
              >
                <polyline
                  points="0,20 20,15 40,18 60,10 80,12 100,0"
                  fill="none"
                  stroke="#00F0FF"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                  className="drop-shadow-sm"
                />
              </svg>
            </div>
          </div>

          {/* AI Insight by Khidra */}
          <div className="bg-background flex items-center gap-4 rounded-xl border-2 border-success/30 p-4 shadow-sm">
            <div className="bg-background relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-emerald-500/50">
              <img
                alt="Media"
                src="/assets/mod_khidra.png"
                className="h-full w-full object-cover mix-blend-screen"
              />
            </div>

            <div className="flex-1">
              <div className="mb-1 text-[9px] font-black tracking-widest text-primary uppercase">
                AI INSIGHT BY <span className="text-success">KHIDRA</span>
              </div>
              <div className="mb-3 border-l-2 border-success/30 pl-2 font-sans text-[9px] leading-relaxed text-foreground italic">
                "The synergy between faith, science, and technology is the key
                to understanding the signs around us."
              </div>
              <button className="flex items-center gap-1 text-[8px] font-bold tracking-widest text-success uppercase transition-colors hover:text-foreground">
                ASK KHIDRA <ArrowRight className="h-2.5 w-2.5" />
              </button>
            </div>
          </div>

          {/* Trend Comparison */}
          <div className="bg-background rounded-xl border border-border p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-[9px] font-black tracking-widest text-primary uppercase">
                TREND COMPARISON
              </div>
              <div className="text-[7px] text-primary">
                This Week vs Last Week
              </div>
            </div>
            <div className="space-y-2">
              {[
                { n: "Moon", p: 80, c: "#3B82F6", v: "+42%" },
                { n: "AI & Technology", p: 65, c: "#00F0FF", v: "+38%" },
                { n: "History", p: 55, c: "#10B981", v: "+31%" },
                { n: "Astronomy", p: 45, c: "#A855F7", v: "+26%" },
              ].map((cmp, i) => (
                <div key={i} className="flex items-center gap-2 text-[8px]">
                  <div className="w-20 truncate text-foreground">{cmp.n}</div>
                  <div className="bg-background h-1.5 flex-1 overflow-hidden rounded-full">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${cmp.p}%`, backgroundColor: cmp.c }}
                    />
                  </div>
                  <div
                    className="w-8 text-right font-mono font-bold"
                    style={{ color: cmp.c }}
                  >
                    {cmp.v}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Data */}
          <div className="bg-background flex flex-col justify-between rounded-xl border border-border p-4">
            <div>
              <div className="mb-2 text-[9px] font-black tracking-widest text-primary uppercase">
                EXPORT DATA
              </div>
              <div className="mb-4 text-[8px] text-primary">
                Download trend data for your research or report.
              </div>
            </div>
            <div className="space-y-2">
              <button className="bg-background flex w-full items-center gap-2 rounded border border-border px-3 py-1.5 text-left text-[9px] text-foreground transition-colors hover:bg-muted/30">
                <Download className="h-3 w-3 text-primary" /> Export as PDF
              </button>
              <button className="bg-background flex w-full items-center gap-2 rounded border border-border px-3 py-1.5 text-left text-[9px] text-foreground transition-colors hover:bg-muted/30">
                <Database className="h-3 w-3 text-success" /> Export as CSV
              </button>
              <button className="bg-background flex w-full items-center gap-2 rounded border border-border px-3 py-1.5 text-left text-[9px] text-foreground transition-colors hover:bg-muted/30">
                <Share2 className="text-knowledge h-3 w-3" /> Share Insights
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
