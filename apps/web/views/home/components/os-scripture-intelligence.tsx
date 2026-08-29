"use client"

import React, { useState } from "react"
import {
  Search,
  BookOpen,
  Scroll,
  Book,
  Navigation,
  Activity,
  Brain,
  GitBranch,
  GitMerge,
  FileText,
  ArrowRight,
  Shield,
  Database,
  Settings,
  Bookmark,
  Cpu,
  Network,
  Radar,
  PieChart,
} from "lucide-react"

export function OSScriptureIntelligence() {
  const [searchQuery, setSearchQuery] = useState("mercy")
  const [activeFilter, setActiveFilter] = useState("ALL")

  const sources = [
    { n: "QUR'AN", v: "6,236 Ayat", icon: BookOpen, c: "#10B981" },
    { n: "HADITH", v: "75,234 Riwayat", icon: Scroll, c: "#F59E0B" },
    { n: "TAFSIR", v: "2,541 Kitab", icon: Book, c: "#3B82F6" },
    { n: "SIRAH", v: "1,256 Peristiwa", icon: Navigation, c: "#EC4899" },
    { n: "ASMAUL HUSNA", v: "99 Nama", icon: Activity, c: "#00F0FF" },
    { n: "ROOT WORDS", v: "3,012 Kata", icon: GitBranch, c: "#10B981" },
    { n: "TOPICS", v: "1,248 Topik", icon: Database, c: "#3B82F6" },
    { n: "CHRONOLOGY", v: "2,100 Timeline", icon: FileText, c: "#A855F7" },
  ]

  const searchResults = [
    {
      type: "QUR'AN",
      src: "Surah 21:107",
      ar: "وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ",
      en: "And We have not sent you, [O Muhammad], except as a mercy to the worlds.",
      rel: "98%",
      c: "#10B981",
    },
    {
      type: "HADITH",
      src: "Sahih Bukhari 6018",
      en: 'The Prophet ﷺ said: "Indeed, Allah is Merciful and loves mercy. He gives mercy to those who are merciful among His creation."',
      rel: "97%",
      c: "#F59E0B",
    },
    {
      type: "TAFSIR",
      src: "Ibn Kathir",
      en: "This verse indicates that the mission of Prophet Muhammad ﷺ is a mercy encompassing all creation, not limited to any one people.",
      rel: "95%",
      c: "#3B82F6",
    },
    {
      type: "TOPIC",
      src: "Ar-Rahmah",
      en: "Ar-Rahmah (The Most Merciful) is derived from the root (ر ح م) which indicates compassion, kindness, and tenderness.",
      rel: "94%",
      c: "#A855F7",
    },
  ]

  return (
    <section
      id="scripture"
      className="bg-background relative z-10 overflow-hidden border-b border-primary/30 py-20 font-mono text-foreground"
    >
      {/* ═══ LAYER 1: DEEP SPACE MATRIX BACKGROUND ═══════════════════════════ */}
      <div className="pointer-events-none absolute inset-0">
        <div className="theme-grid-bg absolute inset-0 opacity-30" />
        <div className="bg-radial-gradient absolute top-1/3 left-1/2 h-[800px] w-[1000px] -translate-x-1/2 from-emerald-900/15 via-transparent to-transparent blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,240,255,0.02)_1px,transparent_1px)] bg-[size:100%_4px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-6 px-6 sm:px-10">
        {/* ═══ TOP HEADER (Blueprint 08) ══════════════════════════════════════ */}
        <div className="flex flex-col justify-between gap-6 border-b border-border pb-6 xl:flex-row xl:items-start">
          <div className="max-w-2xl space-y-4">
            <div className="bg-background inline-flex items-center gap-3 rounded-sm border-2 border-border px-3.5 py-1.5 text-xs font-black tracking-[0.25em] text-primary uppercase shadow-sm">
              <span className="rounded-xs bg-primary px-1.5 py-0.5 font-black text-foreground">
                08
              </span>
              <span>SCRIPTURE INTELLIGENCE</span>
            </div>
            <h2 className="font-mono text-xl font-black tracking-widest text-foreground uppercase drop-shadow-sm sm:text-3xl">
              THE LIVING KNOWLEDGE DATABASE
            </h2>
          </div>

          <div className="max-w-lg border-l-2 border-primary bg-gradient-to-r from-primary to-transparent p-4 text-center xl:text-left">
            <div
              className="font-arabic mb-2 text-sm font-bold text-foreground"
              dir="rtl"
            >
              أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ أَمْ عَلَىٰ قُلُوبٍ أَقْفَالُهَا
            </div>
            <div className="font-sans text-[11px] text-primary italic">
              "Then do they not reflect upon the Qur'an, or are there locks upon
              [their] hearts?"{" "}
              <span className="mt-1 ml-1 block font-mono font-black text-primary not-italic xl:mt-0 xl:inline">
                Qur&apos;an 47:24
              </span>
            </div>
          </div>

          <div className="bg-background hidden shrink-0 rounded-xl border border-primary/30 p-4 md:block">
            <div className="mb-3 text-center text-[9px] font-black tracking-widest text-primary uppercase">
              INTELLIGENCE TOOLS
            </div>
            <div className="flex items-center gap-4 text-center text-[9px] font-bold text-primary">
              {[
                { l: "SEMANTIC SEARCH", i: Search },
                { l: "CROSS REFERENCE", i: Network },
                { l: "ROOT ANALYZER", i: GitMerge },
                { l: "TOPIC EXPLORER", i: Brain },
                { l: "AI ASSISTANT", i: Cpu },
              ].map((t, i) => (
                <div
                  key={i}
                  className="group flex cursor-pointer flex-col items-center gap-1.5"
                >
                  <div className="bg-background flex h-10 w-10 items-center justify-center rounded-full border border-border transition-all group-hover:border-primary group-hover:shadow-sm">
                    <t.i className="h-4 w-4 text-primary group-hover:text-primary" />
                  </div>
                  <span className="max-w-[60px] leading-tight group-hover:text-foreground">
                    {t.l}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ LAYER 2: THREE-COLUMN MAIN MATRIX ══════════════════════════════ */}
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
          {/* LEFT SIDEBAR: KNOWLEDGE SOURCES (Col 1-3) */}
          <div className="space-y-4 lg:col-span-3">
            <div className="mb-2 text-xs font-black tracking-widest text-primary uppercase">
              KNOWLEDGE SOURCES
            </div>
            <div className="space-y-2">
              {sources.map((s, i) => (
                <button
                  key={i}
                  className="bg-background group flex w-full items-center justify-between rounded-lg border border-border p-3 text-left shadow-lg transition-all hover:border-primary/50"
                >
                  <div className="flex items-center gap-3">
                    <s.icon className="h-5 w-5" style={{ color: s.c }} />
                    <div>
                      <div className="text-xs font-black text-foreground transition-colors group-hover:text-primary">
                        {s.n}
                      </div>
                      <div className="text-[10px] text-primary">{s.v}</div>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-primary transition-all group-hover:translate-x-1 group-hover:text-primary" />
                </button>
              ))}
            </div>
            <button className="bg-background mt-2 flex w-full items-center justify-center gap-2 rounded border border-primary/30 py-2.5 text-[10px] font-black tracking-widest text-primary uppercase transition-colors hover:bg-primary/10">
              VIEW ALL SOURCES <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {/* CENTER: SEMANTIC SEARCH INTERFACE (Col 4-8) */}
          <div className="flex flex-col gap-4 lg:col-span-5">
            {/* Search Input Box */}
            <div className="bg-background flex items-center rounded-lg border border-primary/50 p-1 shadow-sm">
              <div className="px-4">
                <Search className="h-5 w-5 text-primary" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-none bg-transparent py-3 font-mono text-lg text-foreground focus:outline-none"
                placeholder="Search database..."
              />
              <button className="px-4 text-primary hover:text-foreground">✕</button>
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold tracking-wider uppercase">
              <span className="mr-2 text-primary">SEARCH IN:</span>
              {["ALL", "QUR'AN", "HADITH", "TAFSIR", "SIRAH", "TOPICS"].map(
                (f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`flex items-center gap-1.5 rounded border px-3 py-1.5 transition-all ${
                      activeFilter === f
                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                        : "bg-background border-border text-primary hover:border-primary/50"
                    }`}
                  >
                    {activeFilter === f && (
                      <span className="h-1.5 w-1.5 animate-ping rounded-full bg-primary" />
                    )}{" "}
                    {f}
                  </button>
                )
              )}
              <button className="bg-background ml-auto flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-primary hover:text-foreground">
                <Settings className="h-3 w-3" /> FILTERS
              </button>
            </div>

            {/* Search Results */}
            <div className="bg-background hide-scrollbar flex max-h-[600px] flex-1 flex-col overflow-y-auto rounded-xl border border-primary/20 p-5 shadow-inner">
              <div className="mb-4 flex items-center justify-between border-b border-border pb-2 text-[10px] font-black tracking-widest text-primary uppercase">
                <span>FOUND 1,248 RESULTS</span>
                <span className="text-primary">SORT BY: RELEVANCE ∨</span>
              </div>

              <div className="space-y-4">
                {searchResults.map((res, i) => (
                  <div
                    key={i}
                    className="bg-background group flex gap-4 rounded-lg border border-border p-4 transition-colors hover:border-border"
                  >
                    <div className="flex shrink-0 flex-col items-center gap-2">
                      <div
                        className="bg-background flex h-10 w-10 items-center justify-center rounded border border-border"
                        style={{ borderColor: `${res.c}40` }}
                      >
                        <BookOpen
                          className="h-5 w-5"
                          style={{ color: res.c }}
                        />
                      </div>
                      <div
                        className="text-[8px] font-black tracking-wider"
                        style={{ color: res.c }}
                      >
                        {res.type}
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="text-[11px] font-bold text-primary uppercase">
                          {res.src}
                        </div>
                        <div className="text-right">
                          <div className="text-[8px] text-primary uppercase">
                            RELEVANCE
                          </div>
                          <div
                            className="text-xs font-black"
                            style={{ color: res.c }}
                          >
                            {res.rel}
                          </div>
                        </div>
                      </div>
                      {res.ar && (
                        <div
                          className="font-arabic mb-2 text-right text-lg text-foreground"
                          dir="rtl"
                        >
                          {res.ar}
                        </div>
                      )}
                      <div className="font-sans text-xs leading-relaxed text-foreground">
                        {res.en}
                      </div>
                    </div>
                    <button className="shrink-0 text-primary transition-colors hover:text-primary">
                      <Bookmark className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded border border-primary/30 bg-transparent py-3 text-[10px] font-black tracking-widest text-primary uppercase transition-colors hover:bg-primary/10">
                VIEW MORE RESULTS <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* RIGHT SIDEBAR: AI INSIGHTS & CROSS REFERENCES (Col 9-12) */}
          <div className="flex flex-col space-y-6 lg:col-span-4">
            {/* AI INSIGHTS */}
            <div className="bg-background flex-1 rounded-xl border-2 border-blue-500/40 p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-[10px] font-black tracking-widest text-blue-400 uppercase">
                <Brain className="h-4 w-4" /> AI INSIGHTS
              </div>

              <div className="mb-2 text-[11px] font-bold tracking-wider text-foreground uppercase">
                CONTEXTUAL UNDERSTANDING
              </div>
              <div className="mb-6 font-sans text-[11px] leading-relaxed text-blue-100/80">
                The concept of mercy (رحمة) appears in the Qur'an 114 times in
                57 verses. It is one of the core attributes of Allah and a
                fundamental principle in Islam.
              </div>

              <div className="mb-3 border-t border-border pt-4 text-[11px] font-bold tracking-wider text-foreground uppercase">
                KEY THEMES
              </div>
              <div className="space-y-2 font-sans text-[10px] text-primary">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-blue-400">•</span>{" "}
                  Allah&apos;s Mercy is all-encompassing
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-blue-400">•</span> Mercy is
                  the foundation of creation
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-blue-400">•</span> Believers
                  are commanded to show mercy
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-blue-400">•</span> Mercy leads
                  to forgiveness and guidance
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-blue-400">•</span> The Prophet
                  ﷺ is a mercy to all worlds
                </div>
              </div>

              {/* ambienting Brain Graphic Simulation */}
              <div className="mt-6 flex justify-center opacity-60 mix-blend-screen drop-shadow-sm filter">
                <Brain className="h-24 w-24 animate-pulse text-blue-500/50" />
              </div>

              <button className="mt-6 flex w-full items-center justify-center gap-2 rounded border border-blue-500/50 py-2.5 text-[10px] font-black tracking-widest text-blue-400 uppercase transition-colors hover:bg-blue-500/20">
                EXPLORE AI ANALYSIS <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            {/* CROSS REFERENCES */}
            <div className="bg-background rounded-xl border border-emerald-500/40 p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-[10px] font-black tracking-widest text-success uppercase">
                <Network className="h-4 w-4" /> CROSS REFERENCES
              </div>

              {/* Node Graph Simulation */}
              <div className="relative flex h-40 items-center justify-center">
                <div className="theme-grid-bg absolute inset-0 opacity-20" />

                {/* Center Node */}
                <div className="bg-background absolute z-20 flex h-16 w-16 flex-col items-center justify-center rounded-full border-2 border-primary shadow-sm">
                  <span className="text-[9px] font-black text-foreground">
                    MERCY
                  </span>
                </div>

                {/* Satellite Nodes */}
                {[
                  { l: "FORGIVENESS", p: "-left-2 top-2", c: "#10B981" },
                  { l: "COMPASSION", p: "-right-4 top-4", c: "#3B82F6" },
                  { l: "LOVE", p: "left-4 bottom-2", c: "#EC4899" },
                  { l: "GRACE", p: "right-6 bottom-4", c: "#F59E0B" },
                ].map((n, i) => (
                  <div
                    key={i}
                    className={`bg-background absolute z-10 flex h-12 w-12 flex-col items-center justify-center rounded-full border border-border shadow-lg ${n.p}`}
                  >
                    <span className="text-center text-[7px] leading-tight font-bold text-foreground uppercase">
                      {n.l}
                    </span>
                  </div>
                ))}

                {/* Connecting Lines */}
                <svg className="absolute inset-0 z-0 h-full w-full opacity-40">
                  <line
                    x1="50%"
                    y1="50%"
                    x2="20%"
                    y2="30%"
                    stroke="#10B981"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                  <line
                    x1="50%"
                    y1="50%"
                    x2="80%"
                    y2="35%"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                  <line
                    x1="50%"
                    y1="50%"
                    x2="30%"
                    y2="80%"
                    stroke="#EC4899"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                  <line
                    x1="50%"
                    y1="50%"
                    x2="75%"
                    y2="75%"
                    stroke="#F59E0B"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                </svg>
              </div>

              <button className="mt-4 flex w-full items-center justify-center gap-1 py-2.5 text-[10px] font-bold tracking-widest text-success uppercase transition-colors hover:text-foreground">
                VIEW ALL CONNECTIONS <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        {/* ═══ LAYER 3: BOTTOM ROW (Blueprint 08 Footer) ══════════════════════ */}
        <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2 lg:grid-cols-5">
          <div className="bg-background rounded-xl border border-border p-4">
            <div className="mb-3 text-[9px] font-black tracking-widest text-primary uppercase">
              MOST RELEVANT VERSES
            </div>
            <div className="space-y-3 font-mono text-[9px]">
              <div className="flex gap-2">
                <span className="shrink-0 font-bold text-primary">21:107</span>
                <span className="truncate text-primary">
                  And We have not sent you except as mercy to the worlds.
                </span>
              </div>
              <div className="flex gap-2">
                <span className="shrink-0 font-bold text-primary">7:156</span>
                <span className="truncate text-primary">
                  And My mercy encompasses all things.
                </span>
              </div>
              <div className="flex gap-2">
                <span className="shrink-0 font-bold text-primary">39:53</span>
                <span className="truncate text-primary">
                  Say, "O My servants who have transgressed against
                  themselves...
                </span>
              </div>
            </div>
            <div className="mt-3 text-right">
              <span className="cursor-pointer text-[9px] font-bold text-primary hover:underline">
                VIEW ALL VERSES ➔
              </span>
            </div>
          </div>

          <div className="bg-background flex flex-col justify-between rounded-xl border border-success/30 p-4">
            <div className="mb-2 text-[9px] font-black tracking-widest text-success uppercase">
              DAILY INSPIRATION
            </div>
            <div className="flex items-start justify-between">
              <div>
                <div className="font-mono text-lg font-black text-success">
                  Ar-Rahman
                </div>
                <div className="text-[10px] text-foreground">The Most Merciful</div>
              </div>
              <div className="font-arabic text-2xl text-success drop-shadow-sm">
                الرَّحْمَٰنُ
              </div>
            </div>
            <div className="mt-2 font-sans text-[10px] text-primary italic">
              "So which of the favors of your Lord would you deny?"
            </div>
          </div>

          <div className="bg-background relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-border p-4">
            <div className="absolute top-4 left-4 z-10 text-[9px] font-black tracking-widest text-foreground uppercase">
              KNOWLEDGE MAP
            </div>
            <Radar className="absolute z-0 h-24 w-24 text-primary/20" />
            <BookOpen className="relative z-10 h-8 w-8 text-primary" />
          </div>

          <div className="bg-background flex items-center justify-between rounded-xl border border-primary/30 p-4">
            <div>
              <div className="mb-1 text-[9px] font-black tracking-widest text-primary uppercase">
                READING PROGRESS
              </div>
              <div className="text-[8px] text-primary uppercase">
                OVERALL PROGRESS
              </div>
              <div className="mt-1 font-mono text-3xl font-black text-foreground">
                68%
              </div>
            </div>
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-primary/20 border-t-cyan-400 shadow-sm">
              <PieChart className="h-6 w-6 text-primary" />
            </div>
          </div>

          <div className="bg-background rounded-xl border border-border p-4">
            <div className="mb-3 text-[9px] font-black tracking-widest text-primary uppercase">
              POPULAR SEARCHES
            </div>
            <div className="space-y-1.5 font-mono text-[10px]">
              <div className="flex justify-between">
                <span className="text-foreground">
                  <span className="mr-2 text-primary">1</span>mercy
                </span>
                <span className="text-primary">1,248</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground">
                  <span className="mr-2 text-primary">2</span>patience
                </span>
                <span className="text-primary">982</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground">
                  <span className="mr-2 text-primary">3</span>forgiveness
                </span>
                <span className="text-primary">876</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground">
                  <span className="mr-2 text-primary">4</span>gratitude
                </span>
                <span className="text-primary">765</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ FOOTER STATUS STRIP ════════════════════════════════════════════ */}
        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-border px-2 pt-4 font-mono text-[9px] font-bold tracking-widest text-primary uppercase sm:flex-row">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              DATABASE STATUS{" "}
              <span className="flex items-center gap-1 text-success">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />{" "}
                SYNCHRONIZED
              </span>
            </div>
            <div>LAST UPDATE: 25 MAY 2025 06:50 WIB</div>
          </div>
          <div className="hidden max-w-lg text-center font-sans text-foreground/50 normal-case italic md:block">
            "This is a blessed Book which We have revealed to you, [O Muhammad],
            that they might reflect upon its verses and that those of
            understanding would be reminded."{" "}
            <span className="ml-1 font-mono text-primary">
              Qur&apos;an 38:29
            </span>
          </div>
          <div className="flex items-center gap-2">
            DATA INTEGRITY 100% <Shield className="h-4 w-4 text-success" />
          </div>
        </div>
      </div>
    </section>
  )
}
