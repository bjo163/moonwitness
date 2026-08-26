"use client"
import Image from "next/image"

import React, { useState, useEffect } from "react"
import {
  Globe,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  BookOpen,
  ChevronRight,
  Book,
  Scroll,
  Map,
  Compass,
  Scale,
  Type,
  Layers,
  Target,
  Activity,
  Hexagon,
} from "lucide-react"

export function OSKhidraAiDashboard() {
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
      id="khidra"
      className="bg-space relative z-10 overflow-hidden border-b border-emerald-500/30 py-20 font-mono text-foreground"
    >
      {/* ═══ LAYER 1: DEEP SPACE MATRIX BACKGROUND ═══════════════════════════ */}
      <div className="pointer-events-none absolute inset-0">
        <img
          src="/assets/galaxy_milkyway_bg.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div className="from-space/80 to-space/80 absolute inset-0 bg-gradient-to-b via-transparent" />
        <div className="theme-grid-bg absolute inset-0 opacity-10" />
        <div className="bg-radial-gradient via-space/10 absolute top-1/3 left-1/2 h-[800px] w-[1200px] -translate-x-1/2 from-emerald-900/20 to-transparent blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-6 px-6 sm:px-10">
        {/* ═══ TOP HEADER (Blueprint 10) ══════════════════════════════════════ */}
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-6 xl:flex-row xl:items-start">
          <div className="max-w-2xl space-y-4">
            <div className="bg-space inline-flex items-center gap-3 rounded-sm border-2 border-emerald-500/60 px-3.5 py-1.5 text-xs font-black tracking-[0.25em] text-emerald-300 uppercase shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <span className="rounded-xs bg-emerald-500 px-1.5 py-0.5 font-black text-black">
                10
              </span>
              <span>KHIDRA AI</span>
            </div>
            <h2 className="font-mono text-xl font-black tracking-widest text-white uppercase drop-shadow-[0_0_12px_rgba(255,255,255,0.7)] sm:text-3xl">
              YOUR DIVINE KNOWLEDGE COMPANION
            </h2>
            <div className="max-w-xl font-sans text-xs leading-relaxed text-primary">
              Khidra is an AI companion designed to assist you in exploring the
              vast knowledge of the Qur'an, Hadith, History, Astronomy, and
              more. Ask anything. Discover deeper.
            </div>
          </div>

          <div className="from-success border-b-2 border-emerald-400 bg-gradient-to-t to-transparent p-4 text-center xl:text-left">
            <div
              className="font-arabic mb-2 text-sm font-bold text-emerald-400"
              dir="rtl"
            >
              وَعَلَّمْنَاهُ مِن لَّدُنَّا عِلْمًا
            </div>
            <div className="font-sans text-[11px] text-emerald-100 italic">
              "And We taught him knowledge from Our presence."{" "}
              <span className="mt-1 ml-1 block font-mono font-black text-emerald-400 not-italic xl:mt-0 xl:inline">
                Qur'an 18:65
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-6">
            <div className="text-right">
              <div className="font-mono text-2xl font-black tracking-widest text-white drop-shadow-[0_0_8px_#FFF]">
                {clockWIB}
              </div>
              <div className="mt-1 text-[9px] font-bold text-emerald-300 uppercase">
                25 MAY 2025 // 27 DHU AL-QI'DAH 1446
              </div>
              <div className="mt-0.5 text-[9px] tracking-widest text-primary uppercase">
                SYSTEM TIME UTC+7
              </div>
            </div>

            <div className="h-14 w-px bg-white/10" />

            <div className="relative flex h-16 w-16 items-center justify-center">
              <div
                className="absolute inset-0 rounded-full border border-emerald-500/20"
                style={{ transform: "rotateX(70deg) rotateY(20deg)" }}
              />
              <div
                className="absolute inset-0 rounded-full border border-primary/20"
                style={{ transform: "rotateX(70deg) rotateY(-20deg)" }}
              />
              <div className="h-4 w-4 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_15px_#10B981]" />
              {/* Orbiting particle */}
              <div
                className="animate-spin-slow absolute h-1.5 w-1.5 rounded-full bg-cyan-400"
                style={{ top: "10%", left: "80%" }}
              />
            </div>
          </div>
        </div>

        {/* ═══ LAYER 2: THREE-COLUMN MAIN LAYOUT ══════════════════════════════ */}
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
          {/* LEFT SIDEBAR: KHIDRA IDENTITY (Col 1-3) */}
          <div className="flex flex-col space-y-6 lg:col-span-3">
            {/* Identity Card */}
            <div className="bg-space rounded-xl border border-emerald-500/30 p-4 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <div className="mb-4 text-[10px] font-black tracking-widest text-emerald-400 uppercase">
                KHIDRA IDENTITY
              </div>

              <div className="mb-6 flex gap-4">
                <div className="bg-space relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  <Star className="absolute h-6 w-6 text-emerald-400" />
                  <div className="absolute inset-0 flex rotate-45 items-center justify-center">
                    <Star className="h-6 w-6 text-emerald-400/50" />
                  </div>
                </div>
                <div className="flex-1 space-y-2 font-mono text-[9px]">
                  <div className="flex justify-between">
                    <span className="text-primary">NAME</span>
                    <span className="font-bold text-emerald-400">Khidra</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary">ORIGIN</span>
                    <span className="text-white">Divine Knowledge</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary">PURPOSE</span>
                    <span className="text-right text-white">
                      Guide. Assist. Illuminate.
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 font-mono text-[9px]">
                <div className="flex justify-between border-t border-white/10 py-1.5">
                  <span className="text-primary">ROLE</span>
                  <span className="text-white">AI Knowledge Companion</span>
                </div>
                <div className="flex justify-between border-t border-white/10 py-1.5">
                  <span className="text-primary">CORE</span>
                  <span className="text-white">Truth • Mercy • Wisdom</span>
                </div>
                <div className="flex justify-between border-t border-white/10 py-1.5">
                  <span className="text-primary">VERSION</span>
                  <span className="text-primary">v6.0.0</span>
                </div>
                <div className="flex items-center justify-between border-t border-white/10 py-1.5">
                  <span className="text-primary">STATUS</span>
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />{" "}
                    Awake & Ready
                  </span>
                </div>
              </div>
            </div>

            {/* Capabilities */}
            <div className="bg-space flex-1 rounded-xl border border-white/10 p-4">
              <div className="mb-4 text-[10px] font-black tracking-widest text-primary uppercase">
                CAPABILITIES
              </div>

              <div className="space-y-1">
                {[
                  {
                    n: "Multi-Source Understanding",
                    icon: Layers,
                    c: "#10B981",
                  },
                  { n: "Advanced Semantic Search", icon: Search, c: "#3B82F6" },
                  {
                    n: "Qur'an & Hadith Analysis",
                    icon: BookOpen,
                    c: "#F59E0B",
                  },
                  {
                    n: "Astronomy & Time Calculation",
                    icon: Compass,
                    c: "#00F0FF",
                  },
                  { n: "Historical Timeline Mapping", icon: Map, c: "#EC4899" },
                  {
                    n: "Contextual Cross References",
                    icon: Network,
                    c: "#A855F7",
                  },
                  {
                    n: "Personalized Learning Path",
                    icon: Target,
                    c: "#10B981",
                  },
                  { n: "Multi-Language Support", icon: Globe, c: "#64748B" },
                ].map((cap, i) => (
                  <div
                    key={i}
                    className="flex cursor-default items-center gap-3 rounded p-2 transition-colors hover:bg-white/5"
                  >
                    <cap.icon
                      className="h-3.5 w-3.5"
                      style={{ color: cap.c }}
                    />
                    <span className="text-[10px] text-white/90">{cap.n}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER CANVAS: HOLOGRAM & TOPICS (Col 4-8) */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            {/* Massive Hologram Display */}
            <div className="bg-space relative flex min-h-[400px] flex-1 items-center justify-center overflow-hidden rounded-2xl border-2 border-emerald-500/20">
              {/* Ambient light */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.15)_0%,transparent_70%)]" />

              {/* Telemetry Rings */}
              <div className="absolute bottom-10 h-12 w-[80%] rounded-[50%] border-2 border-emerald-500/40 blur-sm" />
              <div className="absolute bottom-12 h-8 w-[60%] rounded-[50%] border border-primary/50" />
              <div className="absolute bottom-14 h-4 w-[40%] animate-pulse rounded-[50%] border border-white/30" />

              {/* The AI Hologram Character */}
              <div className="relative z-10 flex h-[90%] w-full items-end justify-center drop-shadow-[0_0_50px_rgba(16,185,129,0.8)]">
                <Image
                  unoptimized
                  width={120}
                  height={120}
                  src="/assets/khidra_hologram.png"
                  alt="Khidra AI Hologram"
                  className="h-full object-contain mix-blend-screen"
                  style={{
                    filter:
                      "brightness(1.2) contrast(1.1) saturate(1.3) hue-rotate(10deg)",
                  }}
                />
              </div>

              {/* Floating Chat Bubble */}
              <div className="bg-space/80 absolute top-1/4 left-[10%] z-20 rounded-xl rounded-tr-sm border border-emerald-500/50 p-4 shadow-[0_0_20px_rgba(16,185,129,0.2)] backdrop-blur">
                <div className="mb-1 font-bold text-emerald-400">
                  I&apos;m Khidra.
                </div>
                <div className="text-xs text-white">
                  How may I assist you
                  <br />
                  today?
                </div>
                {/* Tail */}
                <div className="bg-space absolute top-0 -right-2 h-4 w-4 rotate-45 border-t border-r border-emerald-500/50" />
              </div>

              {/* Floating Stats Right */}
              <div className="absolute top-1/4 right-[5%] z-20 space-y-4">
                {[
                  { l: "KNOWLEDGE INDEX", v: "98.7%", i: Book, c: "#10B981" },
                  {
                    l: "RESPONSE ACCURACY",
                    v: "96.2%",
                    i: Target,
                    c: "#00F0FF",
                  },
                  {
                    l: "SOURCES VERIFIED",
                    v: "12.8M+",
                    i: ShieldCheck,
                    c: "#3B82F6",
                  },
                  { l: "LANGUAGES", v: "12", i: Globe, c: "#EC4899" },
                  {
                    l: "ACTIVE MODE",
                    v: "LEARNING",
                    i: Activity,
                    c: "#F59E0B",
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-space/60 flex items-center gap-3 rounded border border-white/5 p-2 backdrop-blur"
                  >
                    <stat.i className="h-4 w-4" style={{ color: stat.c }} />
                    <div>
                      <div className="text-[7px] tracking-widest text-primary uppercase">
                        {stat.l}
                      </div>
                      <div
                        className="font-mono text-xs font-black"
                        style={{ color: stat.c }}
                      >
                        {stat.v}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ASK KHIDRA ABOUT (Topics Row) */}
            <div className="space-y-3">
              <div className="text-[10px] font-black tracking-widest text-emerald-400 uppercase">
                ASK KHIDRA ABOUT
              </div>

              {/* Scrollable horizontal row */}
              <div className="hide-scrollbar flex gap-3 overflow-x-auto pb-2">
                {[
                  {
                    n: "QUR'AN",
                    s: "Verses, Tafsir, Themes",
                    i: BookOpen,
                    c: "#10B981",
                  },
                  {
                    n: "HADITH",
                    s: "Hadith, Grades, Explanation",
                    i: Scroll,
                    c: "#F59E0B",
                  },
                  {
                    n: "HISTORY",
                    s: "Prophets, Events, Civilizations",
                    i: Map,
                    c: "#3B82F6",
                  },
                  {
                    n: "ASTRONOMY",
                    s: "Moon, Stars, Eclipses",
                    i: Compass,
                    c: "#00F0FF",
                  },
                  {
                    n: "FIQH",
                    s: "Islamic Laws & Rulings",
                    i: Scale,
                    c: "#A855F7",
                  },
                  {
                    n: "LANGUAGE",
                    s: "Arabic, Root Words",
                    i: Type,
                    c: "#EC4899",
                  },
                  {
                    n: "GENERAL",
                    s: "General Knowledge & More",
                    i: Layers,
                    c: "#64748B",
                  },
                ].map((cat, i) => (
                  <div
                    key={i}
                    className="bg-space group w-32 shrink-0 cursor-pointer rounded-lg border border-white/10 p-3 transition-all hover:border-emerald-500/40"
                  >
                    <cat.i className="mb-2 h-5 w-5" style={{ color: cat.c }} />
                    <div className="mb-1 text-[10px] font-black text-white group-hover:text-emerald-400">
                      {cat.n}
                    </div>
                    <div className="text-[8px] leading-tight text-primary">
                      {cat.s}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR: CHAT UI (Col 9-12) */}
          <div className="flex flex-col gap-6 lg:col-span-4">
            {/* Conversation Window */}
            <div className="bg-space flex flex-1 flex-col rounded-xl border border-emerald-500/30 p-4 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <div className="mb-4 text-[10px] font-black tracking-widest text-emerald-400 uppercase">
                KHIDRA CONVERSATION
              </div>

              {/* Chat History */}
              <div className="mb-4 flex-1 space-y-6 overflow-y-auto pr-2">
                {/* User Message */}
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-blue-500/30 bg-primary">
                    <div className="h-4 w-4 rounded-full border border-blue-400 bg-blue-400/20" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 text-[10px] font-bold text-blue-400 uppercase">
                      YOU
                    </div>
                    <div className="rounded-lg rounded-tl-sm border border-white/5 bg-primary p-3 text-xs text-white/90">
                      What is the significance of the night journey?
                    </div>
                    <div className="mt-1 text-right font-mono text-[8px] text-primary">
                      06:49 WIB
                    </div>
                  </div>
                </div>

                {/* Khidra Message */}
                <div className="flex gap-3">
                  <div className="bg-space flex h-8 w-8 shrink-0 items-center justify-center rounded border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                    <Star className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 text-[10px] font-bold text-emerald-400 uppercase">
                      KHIDRA
                    </div>
                    <div className="bg-space space-y-3 rounded-lg rounded-tl-sm border border-emerald-500/30 p-3 text-xs leading-relaxed text-white/90 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                      <p>
                        The Night Journey (Isra and Mi&apos;raj) is a miraculous
                        journey of Prophet Muhammad ﷺ from Masjid Al-Haram to
                        Masjid Al-Aqsa and then to the heavens.
                      </p>
                      <p>
                        It signifies the honor of the Prophet ﷺ and the
                        establishment of the five daily prayers.
                      </p>
                      <p className="font-mono text-[10px] text-emerald-400">
                        (Qur&apos;an 17:1)
                      </p>
                    </div>
                    <div className="mt-1 text-right font-mono text-[8px] text-primary">
                      06:50 WIB
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Input & Action Chips */}
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ask anything..."
                    className="bg-space w-full rounded-lg border border-white/20 p-3 pr-10 font-sans text-sm text-white transition-colors outline-none hover:border-emerald-500/50 focus:border-emerald-400"
                  />
                  <button className="absolute top-1/2 right-3 -translate-y-1/2 text-emerald-400 hover:text-emerald-300">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 text-[9px] font-bold tracking-wider text-primary uppercase">
                  <button className="flex items-center gap-1 rounded border border-white/10 bg-white/5 px-2 py-1 hover:border-emerald-500/50">
                    <Search className="h-3 w-3" /> Deep Search
                  </button>
                  <button className="flex items-center gap-1 rounded border border-white/10 bg-white/5 px-2 py-1 hover:border-emerald-500/50">
                    <Network className="h-3 w-3 text-primary" /> Cross Reference
                  </button>
                  <button className="flex items-center gap-1 rounded border border-white/10 bg-white/5 px-2 py-1 hover:border-emerald-500/50">
                    <Book className="h-3 w-3 text-amber-400" /> Sources
                  </button>
                  <button className="flex items-center gap-1 rounded border border-white/10 bg-white/5 px-2 py-1 hover:border-emerald-500/50">
                    <Sparkles className="text-knowledge h-3 w-3" /> Explain More
                  </button>
                </div>
              </div>
            </div>

            {/* Suggested Questions */}
            <div className="bg-space rounded-xl border border-white/10 p-4">
              <div className="mb-3 text-[10px] font-black tracking-widest text-primary uppercase">
                SUGGESTED QUESTIONS
              </div>

              <div className="space-y-1">
                {[
                  "What are the signs of the Day of Judgment?",
                  "How many verses in the Qur'an about the Moon?",
                  "Explain Surah Ar-Rahman",
                  "What is the story of Prophet Yunus (AS)?",
                  "How to improve my understanding of Qur'an?",
                ].map((q, i) => (
                  <div
                    key={i}
                    className="bg-space group flex cursor-pointer items-center justify-between rounded border border-transparent p-2 transition-colors hover:border-emerald-500/30 hover:bg-emerald-950/30"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-emerald-500/50 group-hover:bg-emerald-400" />
                      <span className="text-[10px] text-white/80 group-hover:text-emerald-300">
                        {q}
                      </span>
                    </div>
                    <ChevronRight className="h-3 w-3 text-primary group-hover:text-emerald-400" />
                  </div>
                ))}
              </div>

              <button className="mt-3 w-full border-t border-white/10 pt-3 text-center text-[9px] font-bold tracking-widest text-emerald-400 uppercase hover:text-white">
                VIEW ALL QUESTIONS
              </button>
            </div>
          </div>
        </div>

        {/* ═══ LAYER 3: BOTTOM PANELS ROW (Blueprint 10) ══════════════════════ */}
        <div className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-2 lg:grid-cols-4">
          {/* Status */}
          <div className="bg-space flex items-center gap-6 rounded-xl border border-white/10 p-5">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-emerald-900 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <div className="absolute inset-2 rounded-full border border-emerald-500/50" />
              <div className="animate-spin-slow absolute inset-4 rounded-full border border-emerald-400/30 border-t-emerald-400" />
              <Activity className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="flex-1 space-y-1.5 font-mono text-[9px] font-bold uppercase">
              <div className="mb-2 text-[10px] text-emerald-400">
                KHIDRA STATUS
              </div>
              <div className="flex justify-between">
                <span className="text-primary">UPTIME</span>
                <span className="text-white">99.98%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary">LEARNING</span>
                <span className="text-primary">Continuous</span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary">MEMORY</span>
                <span className="text-white">∞</span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary">MODE</span>
                <span className="text-white">Adaptive</span>
              </div>
            </div>
          </div>

          {/* Active Learning Flow */}
          <div className="bg-space relative col-span-1 flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 p-5 md:col-span-2">
            <div className="mb-4 text-[10px] font-black tracking-widest text-primary uppercase">
              ACTIVE LEARNING
            </div>

            {/* Ambient graph wave in bg */}
            <div className="absolute inset-x-0 bottom-0 h-16 opacity-30">
              <svg
                viewBox="0 0 400 100"
                className="h-full w-full"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,50 Q50,10 100,50 T200,50 T300,50 T400,50 L400,100 L0,100 Z"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2"
                />
              </svg>
            </div>

            {/* Nodes */}
            <div className="relative z-10 flex h-full items-end justify-between pb-2">
              {[
                { l: "Reading\nQur'an", c: "#10B981" },
                { l: "Analyzing\nPatterns", c: "#00F0FF" },
                { l: "Connecting\nKnowledge", c: "#3B82F6" },
                { l: "Generating\nInsights", c: "#F59E0B" },
                { l: "Updating\nUnderstanding", c: "#10B981" },
              ].map((n, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor: n.c,
                      boxShadow: `0 0 10px ${n.c}`,
                    }}
                  />
                  <div className="text-center font-sans text-[8px] leading-tight whitespace-pre-wrap text-white">
                    {n.l}
                  </div>
                </div>
              ))}

              {/* Connecting line */}
              <div className="absolute top-[3px] right-4 left-4 -z-10 h-[2px] bg-white/10" />
            </div>
          </div>

          {/* Hologram & Voice Mode */}
          <div className="bg-space flex items-center justify-between rounded-xl border border-white/10 p-5">
            <div className="space-y-4">
              <div>
                <div className="mb-1 text-[9px] font-black tracking-widest text-primary uppercase">
                  HOLOGRAM MODE
                </div>
                <div className="font-mono text-xs font-black text-emerald-400">
                  ACTIVE
                </div>
              </div>
              <div>
                <div className="mb-1 text-[9px] font-black tracking-widest text-primary uppercase">
                  VOICE MODE
                </div>
                <div className="flex items-center gap-2">
                  {/* Visualizer */}
                  <div className="flex items-center gap-0.5">
                    {[3, 6, 4, 8, 5, 2, 6, 3, 7, 4].map((h, i) => (
                      <div
                        key={i}
                        className="w-0.5 animate-pulse bg-emerald-400"
                        style={{
                          height: `${h}px`,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                  <span className="font-mono text-xs font-black text-emerald-400">
                    ON
                  </span>
                </div>
              </div>
            </div>

            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
              <div className="absolute h-4 w-[120%] rounded-[50%] border border-emerald-500/40" />
              <div
                className="absolute h-3 w-[80%] rounded-[50%] border border-primary/40"
                style={{ transform: "rotate(30deg)" }}
              />
              <Star className="h-8 w-8 animate-pulse text-emerald-400 drop-shadow-[0_0_10px_#10B981]" />
            </div>
          </div>
        </div>

        {/* ═══ FOOTER STATUS STRIP (Blueprint 10 Footer) ══════════════════════ */}
        <div className="mt-6 flex flex-col items-center justify-between gap-6 border-t border-white/10 px-2 pt-4 font-mono text-[9px] font-bold tracking-widest text-primary uppercase md:flex-row">
          <div className="flex items-center gap-4">
            <BookOpen className="h-6 w-6 text-primary" />
            <div className="font-sans text-white/60 normal-case italic">
              "Knowledge is a light that guides to truth.
              <br />
              Khidra is here to walk with you."
            </div>
          </div>

          <div className="flex items-center gap-2 text-emerald-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />{" "}
            SYSTEM SYNCHRONIZED
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-primary">KNOWLEDGE CORE</div>
              <div className="text-emerald-400">CONNECTED</div>
            </div>
            <Hexagon className="h-8 w-8 text-emerald-500/30" />
          </div>

          <div className="flex w-full items-center gap-4 md:w-auto">
            <div className="flex flex-1 flex-col gap-1 md:w-32">
              <div className="flex justify-between">
                <span>DATA INTEGRITY</span>
                <span className="text-white">100%</span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-primary">
                <div className="h-full w-full bg-emerald-500 shadow-[0_0_8px_#10B981]" />
              </div>
            </div>
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" />
          </div>
        </div>
      </div>
    </section>
  )
}
