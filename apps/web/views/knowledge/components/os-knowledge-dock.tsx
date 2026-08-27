"use client"
import Image from "next/image"

import React, { useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  Compass,
  Clock,
  Calendar,
  Sparkles,
  Search,
  Layers,
  Activity,
} from "lucide-react"
import { Section, SectionBadge } from "@workspace/ui"

export function OSKnowledgeDock() {
  const [searchQuery, setSearchQuery] = useState("")

  const modules = [
    {
      num: "01",
      id: "QUR'AN",
      sub: "The Final Revelation",
      color: "#10B981",
      bgBorder: "border-emerald-500",
      img: "/assets/mod_quran.png",
      stats: [
        { l: "TOPICS", v: "623" },
        { l: "VERSES", v: "6,236" },
        { l: "PROGRESS", v: "78%" },
      ],
      pct: 78,
      href: "/kitab/quran",
    },
    {
      num: "02",
      id: "HADITH",
      sub: "The Prophetic Wisdom",
      color: "#A855F7",
      bgBorder: "border-purple-500",
      img: "/assets/mod_hadith.png",
      stats: [
        { l: "TOPICS", v: "284" },
        { l: "BOOKS", v: "64" },
        { l: "PROGRESS", v: "63%" },
      ],
      pct: 63,
      href: "/hadits",
    },
    {
      num: "03",
      id: "HISTORY",
      sub: "Timeless Civilizations",
      color: "#F59E0B",
      bgBorder: "border-amber-500",
      img: "/assets/mod_history.png",
      stats: [
        { l: "TOPICS", v: "256" },
        { l: "EVENTS", v: "1,024" },
        { l: "PROGRESS", v: "57%" },
      ],
      pct: 57,
      href: "/sejarah-sirah",
    },
    {
      num: "04",
      id: "ASTRONOMY",
      sub: "The Signs in the Universe",
      color: "#3B82F6",
      bgBorder: "border-blue-500",
      img: "/assets/mod_astronomy.png",
      stats: [
        { l: "TOPICS", v: "158" },
        { l: "OBJECTS", v: "3,712" },
        { l: "PROGRESS", v: "72%" },
      ],
      pct: 72,
      href: "/kalender-lunar",
    },
    {
      num: "05",
      id: "EARTH SCIENCE",
      sub: "Our Planet, Our Trust",
      color: "#00F0FF",
      bgBorder: "border-primary",
      img: "/assets/mod_earth.png",
      stats: [
        { l: "TOPICS", v: "92" },
        { l: "DATA SETS", v: "612" },
        { l: "PROGRESS", v: "66%" },
      ],
      pct: 66,
      href: "/mukjizat-sains",
    },
    {
      num: "06",
      id: "WISDOM PATH",
      sub: "Reflections & Philosophy",
      color: "#EC4899",
      bgBorder: "border-pink-500",
      img: "/assets/mod_wisdom.png",
      stats: [
        { l: "TOPICS", v: "73" },
        { l: "LESSONS", v: "492" },
        { l: "PROGRESS", v: "61%" },
      ],
      pct: 61,
      href: "/diagnostik-hikmah",
    },
    {
      num: "07",
      id: "KHIDRA AI",
      sub: "AI Knowledge Companion",
      color: "#10B981",
      bgBorder: "border-emerald-400",
      img: "/assets/mod_khidra.png",
      stats: [
        { l: "MODELS", v: "08" },
        { l: "SESSIONS", v: "1.2K" },
        { l: "PROGRESS", v: "84%" },
      ],
      pct: 84,
      href: "/khidra",
    },
  ]

  return (
    <Section id="knowledge-modules" borderColor="cyan" className="relative">
      {/* ═══ LAYER 1: DEEP SPACE SCI-FI GRADIENT & WIREFRAME GRID ════════════ */}
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-radial-gradient absolute top-1/4 left-1/2 h-[600px] w-[1200px] -translate-x-1/2 from-cyan-950/20 via-blue-950/10 to-transparent blur-[150px]" />
      </div>

      <div className="relative z-10 space-y-12">
        {/* ═══ TOP SECTION HEADER: MATCHING BLUEPRINT 04 EXACTLY ═════════════ */}
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl space-y-4">
            <SectionBadge number="04" label="KNOWLEDGE MODULES" />
            <h2 className="font-mono text-3xl font-black tracking-wider text-white uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.7)] sm:text-5xl">
              EXPLORE. LEARN. UNDERSTAND.
            </h2>
            <p className="font-sans text-sm font-medium tracking-wide text-primary">
              Integrated knowledge modules across revelation, history, science,
              and wisdom.
            </p>
          </div>

          {/* Right Statistics Box from Blueprint 04 */}
          <div className="bg-space flex min-w-[280px] shrink-0 flex-col justify-between space-y-3 rounded-xl border-2 border-primary/50 p-4 shadow-[0_0_30px_rgba(0,200,255,0.15)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-bold tracking-wider text-primary uppercase">
                TOTAL MODULES
              </span>
              <span className="text-2xl font-black text-primary drop-shadow-[0_0_8px_#00F0FF]">
                07
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-1 text-center">
              <div>
                <div className="text-[10px] text-primary uppercase">
                  TOTAL TOPICS
                </div>
                <div className="mt-0.5 text-xl font-black text-white">
                  1,248
                </div>
              </div>
              <div className="border-l border-white/10 pl-4">
                <div className="text-[10px] text-primary uppercase">
                  LEARNING PATHS
                </div>
                <div className="mt-0.5 text-xl font-black text-emerald-400">
                  36
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ LAYER 4: THE 7 HIGH-SPEC MODULE CARDS (Exact Blueprint 04) ════ */}
        <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {modules.map((m, idx) => (
            <Link
              key={idx}
              href={m.href}
              className={`group bg-space/90 relative rounded-xl border-2 p-4 ${m.bgBorder}/60 hover:${m.bgBorder} flex min-h-[360px] cursor-pointer flex-col justify-between overflow-hidden shadow-[0_0_25px_rgba(0,0,0,0.8)] transition-all duration-300 hover:scale-105`}
              style={{ boxShadow: `0 0 30px ${m.color}15` }}
            >
              {/* Top accent glow line */}
              <div
                className="absolute inset-x-0 top-0 h-1"
                style={{
                  backgroundColor: m.color,
                  boxShadow: `0 0 15px ${m.color}`,
                }}
              />

              {/* Title Header */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-mono text-xs font-black text-white uppercase">
                    <span className="rounded-xs bg-white/10 px-1.5 py-0.5 text-[10px] text-primary">
                      {m.num}
                    </span>
                    <span className="truncate" style={{ color: m.color }}>
                      {m.id}
                    </span>
                  </div>
                </div>
                <div className="truncate font-sans text-[11px] font-medium text-primary">
                  {m.sub}
                </div>
              </div>

              {/* CENTER 8K STUDIO ARTWORK */}
              <div className="relative my-4 flex h-36 w-full items-center justify-center overflow-hidden rounded-lg border border-white/15 bg-black shadow-inner">
                <Image
                  unoptimized
                  width={120}
                  height={120}
                  src={m.img}
                  alt={m.id}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-20" />
              </div>

              {/* Bottom 3-Metric Stats + Progress Bar Gauge */}
              <div className="space-y-2.5 border-t border-white/15 pt-3">
                <div className="grid grid-cols-3 gap-1 text-center font-mono">
                  {m.stats.map((s, i) => (
                    <div key={i} className="truncate">
                      <div className="text-[8px] tracking-wider text-primary uppercase">
                        {s.l}
                      </div>
                      <div
                        className="mt-0.5 text-xs font-black text-white"
                        style={{ color: i === 2 ? m.color : undefined }}
                      >
                        {s.v}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progress Gauge */}
                <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${m.pct}%`,
                      backgroundColor: m.color,
                      boxShadow: `0 0 10px ${m.color}`,
                    }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ═══ LAYER 3 & 4: 3-COLUMN DECK (FEATURED MODULE | QUICK ACCESS | LEARNING SUMMARY) ═ */}
        <div className="grid grid-cols-1 items-stretch gap-6 pt-2 lg:grid-cols-12">
          {/* LEFT: FEATURED MODULE QUR'AN EXPLORER (Col 1-4) */}
          <div className="bg-space group relative flex flex-col justify-between overflow-hidden rounded-xl border-2 border-emerald-500/50 p-6 shadow-[0_0_35px_rgba(16,185,129,0.18)] lg:col-span-4">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between text-[11px] font-black tracking-widest text-primary uppercase">
                <span>--- FEATURED MODULE ---</span>
                <span className="flex items-center gap-1 rounded-xs border border-emerald-400/50 bg-emerald-500/20 px-2 py-0.5 text-emerald-400">
                  <span className="h-1.5 w-1.5 animate-ping rounded-full bg-emerald-400" />
                  LIVE
                </span>
              </div>

              <div>
                <h3 className="font-mono text-2xl font-black tracking-wider text-emerald-400 uppercase drop-shadow-[0_0_10px_rgba(16,185,129,0.6)]">
                  QUR&apos;AN EXPLORER
                </h3>
                <p className="mt-2 font-sans text-xs leading-relaxed text-primary">
                  Explore the wisdom of the Qur&apos;an through thematic study,
                  tafsir, and cross-topic connections.
                </p>
              </div>

              {/* 4 Feature Tags */}
              <div className="grid grid-cols-2 gap-2 pt-2 font-mono text-[10px] font-bold text-white/90 uppercase">
                <span className="bg-space flex items-center gap-1.5 rounded border border-emerald-500/30 px-2.5 py-1.5">
                  <BookOpen className="h-3 w-3 text-emerald-400" /> TAFSIR
                </span>
                <span className="bg-space flex items-center gap-1.5 rounded border border-emerald-500/30 px-2.5 py-1.5">
                  <Layers className="h-3 w-3 text-primary" /> THEMES
                </span>
                <span className="bg-space flex items-center gap-1.5 rounded border border-emerald-500/30 px-2.5 py-1.5">
                  <Sparkles className="h-3 w-3 text-amber-400" /> CROSS LINKS
                </span>
                <span className="bg-space flex items-center gap-1.5 rounded border border-emerald-500/30 px-2.5 py-1.5">
                  <Search className="text-knowledge h-3 w-3" /> SEARCH
                </span>
              </div>
            </div>

            {/* Glowing CTA button matching Blueprint 04 */}
            <div className="mt-6 border-t border-white/10 pt-4">
              <Link
                href="/kitab/quran"
                className="flex w-full cursor-pointer items-center justify-between rounded-lg border-2 border-emerald-500 bg-primary px-4 py-2.5 text-xs font-black tracking-widest text-emerald-400 uppercase shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:bg-emerald-500/20"
              >
                <span>OPEN MODULE</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* CENTER: QUICK ACCESS COMMAND GRID (Col 5-8) */}
          <div className="bg-space flex flex-col justify-between space-y-4 rounded-xl border-2 border-primary/50 p-6 shadow-[0_0_35px_rgba(0,200,255,0.18)] lg:col-span-4">
            <div className="text-[11px] font-black tracking-widest text-primary uppercase">
              --- QUICK ACCESS ---
            </div>

            {/* 6 Grid Buttons matching Blueprint 04 */}
            <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                {
                  title: "DAILY VERSE",
                  sub: "Today's Inspiration",
                  icon: BookOpen,
                  color: "#00F0FF",
                  href: "/inspirasi-harian",
                },
                {
                  title: "DAILY HADITH",
                  sub: "Prophetic Guidance",
                  icon: Sparkles,
                  color: "#A855F7",
                  href: "/hadits",
                },
                {
                  title: "HISTORY TIMELINE",
                  sub: "Explore Events",
                  icon: Clock,
                  color: "#F59E0B",
                  href: "/sejarah-sirah",
                },
                {
                  title: "ASTRO CALENDAR",
                  sub: "Celestial Events",
                  icon: Calendar,
                  color: "#3B82F6",
                  href: "/kalender-lunar",
                },
                {
                  title: "PRAYER TIMES",
                  sub: "Stay on Schedule",
                  icon: Activity,
                  color: "#10B981",
                  href: "/jadwal-sholat",
                },
                {
                  title: "QIBLA DIRECTION",
                  sub: "Find the Qibla",
                  icon: Compass,
                  color: "#00F0FF",
                  href: "/arah-kiblat",
                },
              ].map((q, idx) => (
                <Link
                  key={idx}
                  href={q.href}
                  className="bg-space group flex cursor-pointer flex-col justify-between rounded-lg border border-white/15 p-3 transition-all hover:border-primary hover:bg-white/5"
                >
                  <div className="flex items-center justify-between">
                    <q.icon className="h-4 w-4" style={{ color: q.color }} />
                    <ArrowRight className="h-3 w-3 text-primary transition-all group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                  <div className="mt-2">
                    <div className="font-mono text-xs font-black tracking-wider text-white transition-colors group-hover:text-primary">
                      {q.title}
                    </div>
                    <div className="truncate font-sans text-[10px] text-primary">
                      {q.sub}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT: LEARNING SUMMARY & PROGRESS RING (Col 9-12) */}
          <div className="bg-space flex flex-col justify-between space-y-5 rounded-xl border-2 border-primary/50 p-6 shadow-[0_0_35px_rgba(0,200,255,0.18)] lg:col-span-4">
            <div className="text-[11px] font-black tracking-widest text-primary uppercase">
              --- LEARNING SUMMARY ---
            </div>

            {/* Radial Ring + Metrics Split */}
            <div className="my-auto flex items-center justify-between gap-4">
              {/* Animated 68% Radial Progress Ring simulation */}
              <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-[6px] border-primary shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                <div
                  className="absolute inset-0 -rotate-45 rounded-full border-[6px] border-primary border-t-transparent border-l-transparent shadow-[0_0_10px_rgba(0,240,255,0.8)]"
                />
                <div className="text-center font-mono">
                  <div className="text-[9px] font-bold tracking-wider text-primary uppercase">
                    OVERALL
                  </div>
                  <div className="text-xl font-black text-white drop-shadow-[0_0_8px_#FFF]">
                    68%
                  </div>
                  <div className="text-[8px] font-black text-primary uppercase">
                    PROGRESS
                  </div>
                </div>
              </div>

              {/* Right Summary Statistics */}
              <div className="flex-1 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                  <span className="text-primary">COMPLETED TOPICS</span>
                  <span className="text-sm font-black text-primary">853</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                  <span className="text-primary">IN PROGRESS</span>
                  <span className="text-sm font-black text-blue-400">312</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-primary">NOT STARTED</span>
                  <span className="text-sm font-black text-white">83</span>
                </div>
              </div>
            </div>

            {/* Bottom Weekly Activity Chart Bar Simulation (Exact Blueprint 04) */}
            <div className="border-t border-white/10 pt-3">
              <div className="mb-2 text-[9px] font-bold tracking-wider text-primary uppercase">
                WEEKLY ACTIVITY
              </div>
              <div className="flex h-8 items-end justify-between gap-2 px-2">
                {[
                  { d: "MON", h: 40, col: "#3B82F6" },
                  { d: "TUE", h: 55, col: "#3B82F6" },
                  { d: "WED", h: 30, col: "#3B82F6" },
                  { d: "THU", h: 65, col: "#3B82F6" },
                  { d: "FRI", h: 100, col: "#00F0FF", glow: true },
                  { d: "SAT", h: 75, col: "#10B981" },
                  { d: "SUN", h: 50, col: "#3B82F6" },
                ].map((bar, i) => (
                  <div
                    key={i}
                    className="flex flex-1 flex-col items-center gap-1"
                  >
                    <span
                      className="w-2 rounded-t-xs transition-all duration-500"
                      style={{
                        height: `${bar.h}%`,
                        backgroundColor: bar.col,
                        boxShadow: bar.glow ? "0 0 10px #00F0FF" : "none",
                      }}
                    />
                    <span
                      className={`font-mono text-[8px] font-black ${bar.glow ? "text-primary" : "text-primary"}`}
                    >
                      {bar.d}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ═══ BOTTOM SEARCH BAR & SCRIPTURE BANNER (Blueprint 04 Footer) ════ */}
        <div className="bg-space flex flex-col items-center justify-between gap-6 rounded-xl border-2 border-cyan-500/40 p-5 shadow-[0_0_30px_rgba(0,0,0,0.8)] md:flex-row">
          {/* Left Quote */}
          <div className="flex max-w-xl items-center gap-3 font-serif text-xs text-primary italic md:text-sm">
            <span className="shrink-0 font-serif text-3xl text-primary not-italic opacity-50">
              &ldquo;
            </span>
            <div>
              <span>
                Say, [O Muhammad], &ldquo;Are those who know equal to those who
                do not know?&rdquo;{" "}
              </span>
              <span className="mt-1 block font-mono text-xs font-black text-primary not-italic drop-shadow-[0_0_6px_#00F0FF]">
                (Qur&apos;an 39:9)
              </span>
            </div>
          </div>

          {/* Right Search Input & Browse Button */}
          <div className="flex w-full shrink-0 flex-col items-center gap-3 sm:flex-row md:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-primary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across all modules..."
                className="bg-space w-full rounded-lg border border-white/20 py-2 pr-16 pl-9 font-mono text-xs text-white shadow-inner focus:border-primary focus:outline-none"
              />
              <div className="absolute top-1/2 right-2.5 flex -translate-y-1/2 items-center gap-1 rounded border border-white/15 px-1.5 py-0.5 font-mono text-[9px] text-primary">
                <span>CTRL</span>
                <span>K</span>
              </div>
            </div>

            <Link
              href="/kitab"
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-primary bg-primary px-5 py-2.5 text-xs font-black tracking-widest whitespace-nowrap text-primary uppercase shadow-[0_0_20px_rgba(0,240,255,0.25)] transition-all hover:bg-primary/20 sm:w-auto"
            >
              <span>BROWSE ALL MODULES</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </Section>
  )
}
