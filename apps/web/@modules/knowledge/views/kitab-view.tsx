"use client"

import { useState, useEffect } from "react"
import {
  BookOpen,
  Search,
  Book,
  Globe2,
  Network,
  BrainCircuit,
  Play,
  Pause,
  Bookmark,
  Sparkles,
  ChevronRight,
  ArrowRight,
  User,
  Star,
  CheckCircle2,
  Check,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useGlobalAudio } from "@core/contexts/audio-context"

export function KitabPortalView() {
  const [scriptures, setScriptures] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const audio = useGlobalAudio()

  useEffect(() => {
    fetch("/api/scriptures")
      .then((res) => res.json())
      .then((data) => {
        setScriptures(data.data || [])
        setIsLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching scriptures:", err)
        setIsLoading(false)
      })
  }, [])

  const canonicals = scriptures.filter((s: any) => s.type === "Canonical")
  const additionals = scriptures.filter((s: any) => s.type === "Additional")

  // Dynamic calculations
  const totalScriptures = scriptures.length
  const totalVerses = scriptures.reduce(
    (acc: number, s: any) => acc + (s.verses_count || 0),
    0
  )
  const totalProphets = new Set(
    scriptures
      .filter((s: any) => s.prophet && s.prophet !== "Unknown")
      .map((s: any) => s.prophet)
  ).size

  // Map canonicals from database
  const canonicalCards = canonicals.map((s: any, idx: number) => {
    const isQuran = s.name.includes("Qur'an")
    return {
      id: s.id || idx + 1,
      name: s.name.toUpperCase(),
      original_name: s.original_name?.toUpperCase() || s.name.toUpperCase(),
      image: s.cover_image_url || "/cover_quran.png",
      subtitle: isQuran ? "Final & Preserved" : `Revealed to ${s.prophet}`,
      authentic: s.authenticity_status === "100% Authentic",
      authLabel: s.authenticity_status || "Unknown",
      stats: {
        col1: isQuran ? "Surah" : "Books",
        val1: isQuran ? "114" : (s.books_count || "0").toString(),
        col2: isQuran ? "Ayat" : "Chapters",
        val2: isQuran ? "6,236" : (s.chapters_count || "0").toString(),
        col3: isQuran ? "Juz" : "Verses",
        val3: isQuran ? "30" : (s.verses_count || "0").toString(),
      },
      religion: s.religion || "Unknown",
      color: s.theme_color || "blue",
    }
  })

  const otherScriptures = additionals.slice(0, 8).map((s: any) => ({
    id: s.id,
    name: s.name,
    religion: s.religion,
    texts: s.description || "Sacred Text",
    color: s.theme_color || "blue",
    icon: s.icon || "🪽",
    image: s.cover_image_url || "/cover_eastern.png",
  }))

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#040914] pb-10 font-sans text-white selection:bg-blue-500/30">
      {/* Background Ambience */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/2 h-[400px] w-full max-w-[1000px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1800px] space-y-4 px-4 pt-2 lg:px-6">
        {/* 1. Flat Hero Banner */}
        <div className="relative flex h-36 w-full flex-col justify-center border-b border-white/5 px-4 md:h-44 md:px-8">
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl opacity-60 mix-blend-screen">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-900/40 via-[#040914] to-[#040914]" />
            {/* Mocking the glowing earth / book effect */}
            <div className="absolute bottom-0 left-1/2 h-[200px] w-[800px] -translate-x-1/2 rounded-[100%] bg-blue-500/30 blur-[100px]" />
            <div className="absolute bottom-[-50px] left-1/2 h-[100px] w-[400px] -translate-x-1/2 rounded-[100%] bg-white/40 blur-[50px]" />
          </div>

          <div className="relative z-10 flex w-full flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <div className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-amber-500/30 md:h-16 md:w-16">
                <BookOpen className="h-6 w-6 text-amber-400 md:h-8 md:w-8" />
                <div className="absolute -top-6 h-12 w-[2px] bg-gradient-to-t from-amber-200 to-transparent blur-[1px] md:-top-8 md:h-16" />
                <div className="absolute -top-12 h-24 w-[1px] bg-amber-400/50 md:-top-16 md:h-32" />
              </div>
              <div>
                <div className="mb-1 flex items-center gap-3">
                  <h1 className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-2xl font-black tracking-widest text-transparent md:text-3xl">
                    CANONICAL SCRIPTURE CODEX
                  </h1>
                  <span className="rounded border border-blue-500/30 bg-blue-500/20 px-2 py-0.5 text-[9px] font-bold text-blue-300">
                    Ver 2.0
                  </span>
                </div>
                <p className="text-xs font-medium text-blue-200/60">
                  All Divine Messages, One Knowledge Hub — The Light of Guidance
                  for All Humanity
                </p>
              </div>
            </div>

            <div className="hidden flex-shrink-0 md:block lg:text-right">
              <div className="font-arabic mb-2 text-2xl text-white/90 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] md:text-3xl">
                وَذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ
              </div>
              <p className="ml-auto max-w-sm text-[10px] text-white/50 italic md:text-xs">
                "This is the Book about which there is no doubt, a guidance for
                those conscious of Allah."
                <span className="mt-1 block text-[9px] text-blue-400/60 not-italic">
                  (QS. Al-Baqarah 2:2)
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* 2. Stats Strip */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {[
            {
              icon: Book,
              title: "Total Scriptures",
              value: totalScriptures.toString(),
              sub: "Manuscripts",
              color: "blue",
              isFill: false,
            },
            {
              icon: Star,
              title: "Main Divine Sources",
              value: canonicals.length.toString(),
              sub: "Canonical",
              color: "amber",
              isFill: true,
            },
            {
              icon: Globe2,
              title: "Total Languages",
              value: "120+",
              sub: "Translations",
              color: "blue",
              isFill: false,
            },
            {
              icon: Network,
              title: "Verified Verses",
              value: totalVerses > 0 ? totalVerses.toLocaleString() : "~ 2.4M+",
              sub: "Cross-References",
              color: "cyan",
              isFill: false,
            },
            {
              icon: BrainCircuit,
              title: "AI Research",
              value: "Active",
              sub: "Semantic Search",
              color: "purple",
              isFill: false,
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={`border bg-[#0A1224] ${stat.isFill ? "border-amber-500/50" : "border-white/5"} group flex cursor-default items-center gap-3 rounded-xl p-3 shadow-md transition-colors hover:bg-white/[0.02]`}
            >
              <div
                className={`h-10 w-10 rounded-full ${stat.isFill ? "bg-amber-500/20" : `bg-${stat.color}-500/10`} border border-${stat.color}-500/20 flex items-center justify-center text-${stat.color}-400 transition-transform group-hover:scale-110`}
              >
                <stat.icon
                  className={`h-5 w-5 ${stat.isFill ? "fill-amber-400" : ""}`}
                />
              </div>
              <div>
                <div className="text-[9px] font-bold tracking-wider text-white/40 uppercase">
                  {stat.title}
                </div>
                <div className="text-lg leading-tight font-black text-white">
                  {stat.value}
                </div>
                <div className="text-[9px] text-white/30">{stat.sub}</div>
              </div>
            </div>
          ))}

          {/* Quran Recitation Player - Fully Functional */}
          <div
            onClick={() => {
              if (audio.isPlaying) audio.togglePlay()
              else audio.play({ number: 1, name: "Al-Fatihah" })
            }}
            className="group relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-xl border border-blue-500/30 bg-[#0A1224] p-3 shadow-lg transition-colors hover:border-blue-500/60"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-300">
              {audio.isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="ml-0.5 h-5 w-5" />
              )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center">
              <div className="text-[9px] font-bold tracking-wider text-blue-400/80 uppercase">
                Quran Recitation
              </div>
              <div className="flex items-center gap-2 truncate text-sm font-bold text-white">
                Al-Fatihah
                {/* Equalizer Animation */}
                {audio.isPlaying && (
                  <div className="flex h-3 items-center gap-0.5">
                    <div
                      className="h-full w-0.5 animate-[bounce_1s_infinite] bg-blue-400"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="h-full w-0.5 animate-[bounce_1s_infinite] bg-blue-400"
                      style={{ animationDelay: "200ms" }}
                    />
                    <div
                      className="h-full w-0.5 animate-[bounce_1s_infinite] bg-blue-400"
                      style={{ animationDelay: "400ms" }}
                    />
                    <div
                      className="h-full w-0.5 animate-[bounce_1s_infinite] bg-blue-400"
                      style={{ animationDelay: "100ms" }}
                    />
                  </div>
                )}
                {!audio.isPlaying && (
                  <div className="flex h-3 items-center gap-0.5 opacity-30">
                    <div className="h-1 w-0.5 bg-blue-400" />
                    <div className="h-2 w-0.5 bg-blue-400" />
                    <div className="h-1.5 w-0.5 bg-blue-400" />
                    <div className="h-1 w-0.5 bg-blue-400" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex-shrink-0 font-mono text-[9px] text-blue-300/60">
              1/114
            </div>
          </div>
        </div>

        {/* 3. Toolbar (Full Width) */}
        <div className="flex flex-col items-center justify-between gap-4 border-b border-white/10 pt-2 pb-4 md:flex-row">
          <div className="flex w-full items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-2 md:w-auto">
            <BookOpen className="h-4 w-4 text-amber-500" />
            <span className="text-[10px] font-black tracking-widest uppercase">
              4 MAJOR CANONICAL SCRIPTURES
            </span>
            <Bookmark className="ml-auto h-3 w-3 text-white/30 md:ml-4" />
          </div>

          <div className="relative w-full max-w-2xl flex-1">
            <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search verses, keywords, topic across all scriptures..."
              className="w-full rounded-full border border-white/10 bg-[#0A1224] py-2.5 pr-16 pl-11 text-xs text-white shadow-inner transition-all outline-none focus:border-blue-500/50"
            />
            <div className="absolute top-1/2 right-4 flex -translate-y-1/2 gap-1">
              <kbd className="rounded border border-white/10 bg-white/10 px-1.5 py-0.5 text-[9px] text-white/50">
                Ctrl
              </kbd>
              <span className="text-[9px] text-white/30">+</span>
              <kbd className="rounded border border-white/10 bg-white/10 px-1.5 py-0.5 text-[9px] text-white/50">
                K
              </kbd>
            </div>
          </div>

          <button className="group flex w-full items-center justify-center gap-2 rounded-full border border-purple-500/30 bg-purple-600/10 px-6 py-2.5 text-[10px] font-black text-purple-300 transition-all hover:bg-purple-600/30 md:w-auto">
            <Sparkles className="h-3.5 w-3.5" />
            AI COMPARE
          </button>
        </div>

        {/* 4. Main 3-Column Content Layout */}
        <div className="flex flex-col items-start gap-5 lg:flex-row">
          {/* LEFT SIDEBAR: MENU */}
          <div className="w-full flex-shrink-0 space-y-6 lg:w-48">
            <div>
              <h3 className="mb-3 px-2 text-[9px] font-black tracking-widest text-blue-400 uppercase">
                Knowledge Menu
              </h3>
              <div className="space-y-1">
                {[
                  "Overview",
                  "Qur'an (Kahf)",
                  "Taurat (Torah)",
                  "Zabur (Psalms)",
                  "Injil (Gospel)",
                  "Other Scriptures",
                ].map((item, i) => (
                  <button
                    key={i}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs font-bold transition-all ${i === 0 ? "border border-blue-500/30 bg-blue-500/20 text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.1)]" : "text-white/60 hover:bg-white/5 hover:text-white"}`}
                  >
                    <BookOpen
                      className={`h-3.5 w-3.5 ${i === 0 ? "text-blue-400" : "text-white/30"}`}
                    />
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 px-2 text-[9px] font-black tracking-widest text-blue-400 uppercase">
                Quick Access
              </h3>
              <div className="space-y-1">
                {[
                  "Ayat of the Day",
                  "Hadith Collection",
                  "Daily Adhkar",
                  "Prophetic Stories",
                  "Comparative Study",
                  "Research Lab",
                ].map((item, i) => (
                  <button
                    key={i}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[11px] font-medium text-white/50 transition-all hover:bg-white/5 hover:text-white`}
                  >
                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500/10">
                      <Star className="h-2 w-2 text-blue-400/50" />
                    </div>
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="mb-3 px-2 text-[9px] font-black tracking-widest text-blue-400 uppercase">
                Filter
              </h3>
              {[
                "All Languages",
                "All Topics",
                "All Periods",
                "All Traditions",
              ].map((f, i) => (
                <select
                  key={i}
                  className="w-full appearance-none rounded-lg border border-white/5 bg-[#0A1224] px-3 py-2 text-[10px] text-white/60 transition-colors outline-none focus:border-blue-500/50"
                >
                  <option>{f}</option>
                </select>
              ))}
            </div>
          </div>

          {/* CENTER CONTENT: CARDS & INFO */}
          <div className="flex min-w-0 flex-1 flex-col space-y-6">
            {/* The 4 Canonical Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {canonicalCards.map((card) => (
                <div
                  key={card.id}
                  className="group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#040914] shadow-2xl"
                >
                  {/* Number Badge */}
                  <div className="absolute top-3 left-3 z-20 flex h-6 w-6 items-center justify-center rounded border border-amber-500/30 bg-black/50 text-[10px] font-black text-amber-400 backdrop-blur-md">
                    {card.id}
                  </div>
                  {/* Primary Tag */}
                  <div className="absolute top-3 right-3 z-20 rounded border border-blue-500/30 bg-blue-500/20 px-2 py-0.5 text-[8px] font-black text-blue-300 uppercase backdrop-blur-md">
                    PRIMARY
                  </div>

                  {/* Image Cover */}
                  <div className="relative flex h-44 w-full items-center justify-center overflow-hidden border-b border-white/5 bg-[#0A1224]">
                    <Image
                      src={card.image}
                      alt={card.name}
                      fill
                      className="object-cover opacity-80 transition-all duration-[2s] group-hover:scale-110 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#040914] to-transparent opacity-80" />
                  </div>

                  {/* Card Body */}
                  <div className="relative z-10 -mt-8 flex flex-1 flex-col items-center p-4 text-center">
                    <h2 className="text-xl font-black tracking-widest text-white drop-shadow-md">
                      {card.name}
                    </h2>
                    <div
                      className={`text-[10px] font-black text-${card.color}-400 mb-1 tracking-[0.2em] uppercase`}
                    >
                      {card.original_name}
                    </div>

                    <div className="mb-2 text-[10px] text-white/50">
                      {card.subtitle}
                    </div>

                    {/* Authenticity Badge */}
                    <div
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 ${card.authentic ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border border-white/10 bg-white/5 text-white/40"} mb-5 text-[9px] font-black`}
                    >
                      {card.authentic ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <Check className="h-3 w-3" />
                      )}
                      {card.authLabel}
                    </div>

                    {/* Stats Grid */}
                    <div className="mb-4 grid w-full grid-cols-3 gap-1 border-y border-white/10 py-3">
                      <div>
                        <div className="mb-1 text-[8px] tracking-wider text-white/40 uppercase">
                          {card.stats.col1}
                        </div>
                        <div className="text-xs font-black text-white">
                          {card.stats.val1}
                        </div>
                      </div>
                      <div className="border-x border-white/10">
                        <div className="mb-1 text-[8px] tracking-wider text-white/40 uppercase">
                          {card.stats.col2}
                        </div>
                        <div className="text-xs font-black text-white">
                          {card.stats.val2}
                        </div>
                      </div>
                      <div>
                        <div className="mb-1 text-[8px] tracking-wider text-white/40 uppercase">
                          {card.stats.col3}
                        </div>
                        <div className="text-xs font-black text-white">
                          {card.stats.val3}
                        </div>
                      </div>
                    </div>

                    {/* Religion Tag */}
                    <div
                      className={`inline-flex items-center gap-2 rounded px-3 py-1.5 bg-${card.color}-500/10 text-[9px] font-bold text-${card.color}-300/80 mb-5 w-full justify-center`}
                    >
                      <Book className="h-3 w-3" />
                      {card.religion}
                    </div>

                    {/* Buttons */}
                    <div className="mt-auto flex w-full gap-2">
                      <Link
                        href={`/knowledge/kitab/${card.id}`}
                        className={`flex-1 bg-${card.color}-500 rounded-lg py-2 text-[10px] font-black tracking-widest text-white hover:bg-${card.color}-400 shadow-lg transition-colors shadow-${card.color}-500/20 flex items-center justify-center`}
                      >
                        EXPLORE
                      </Link>
                      <button className="flex-1 rounded-lg border border-white/20 bg-transparent py-2 text-[10px] font-black tracking-widest text-white/70 transition-colors hover:bg-white/5">
                        STUDY
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Center 4 Panels */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="relative flex flex-col justify-center gap-2 overflow-hidden rounded-xl border border-white/5 bg-[#0A1224] p-4 shadow-lg">
                <div className="absolute top-[-10%] right-[-10%] h-16 w-16 rounded-full bg-blue-500/5" />
                <div className="text-[9px] font-black tracking-widest text-white/40 uppercase">
                  KEY VERSES CROSS-REFERENCES
                </div>
                <div className="flex items-center gap-3">
                  <BookOpen className="h-8 w-8 text-blue-500/40" />
                  <div>
                    <div className="text-2xl font-black text-white">5,420</div>
                    <div className="text-[9px] text-white/40">
                      Linked Verses
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative flex flex-col justify-center gap-2 overflow-hidden rounded-xl border border-white/5 bg-[#0A1224] p-4 shadow-lg">
                <div className="absolute top-[-10%] right-[-10%] h-16 w-16 rounded-full bg-cyan-500/5" />
                <div className="text-[9px] font-black tracking-widest text-white/40 uppercase">
                  PROPHETS MENTIONED
                </div>
                <div className="flex items-center gap-3">
                  <User className="h-8 w-8 text-cyan-500/40" />
                  <div>
                    <div className="text-2xl font-black text-white">
                      {totalProphets > 0 ? totalProphets : "124"}
                    </div>
                    <div className="text-[9px] text-white/40">
                      Across All Scriptures
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative flex flex-col justify-center gap-2 overflow-hidden rounded-xl border border-white/5 bg-[#0A1224] p-4 shadow-lg">
                <Star className="absolute right-[-10%] bottom-[-20%] h-20 w-20 rotate-12 text-blue-500/5" />
                <div className="flex items-center justify-between">
                  <div className="text-[9px] font-black tracking-widest text-white/40 uppercase">
                    UNIVERSAL THEMES
                  </div>
                  <div className="text-lg leading-none font-black text-white">
                    18{" "}
                    <span className="text-[8px] font-normal text-white/40">
                      Core Values
                    </span>
                  </div>
                </div>
                <div className="relative z-10 mt-1 flex flex-wrap gap-1">
                  {[
                    "Tauhid",
                    "Mercy",
                    "Justice",
                    "Guidance",
                    "Wisdom",
                    "Life After Death",
                  ].map((t, i) => (
                    <span
                      key={i}
                      className="rounded border border-blue-500/20 bg-blue-500/10 px-1.5 py-0.5 text-[8px] text-blue-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-center gap-2 rounded-xl border border-white/5 bg-[#0A1224] p-4 shadow-lg">
                <div className="text-[9px] font-black tracking-widest text-white/40 uppercase">
                  STUDY PATH
                </div>
                <div className="mb-1 flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-amber-500/10">
                    <Sparkles className="h-3 w-3 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">
                      Start Your Journey
                    </div>
                    <div className="text-[9px] text-white/40">
                      Step-by-step Learning
                    </div>
                  </div>
                </div>
                <button className="mt-1 w-full rounded border border-white/10 bg-white/5 py-1.5 text-[9px] font-black text-white/70 uppercase transition-colors hover:bg-white/10">
                  OPEN LEARNING HUB
                </button>
              </div>
            </div>

            {/* Other Sacred Scriptures */}
            <div className="rounded-xl border border-white/5 bg-[#0A1224] p-5 shadow-lg">
              <div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2">
                  <Bookmark className="h-3 w-3 text-cyan-500" />
                  <span className="text-[10px] font-black tracking-widest text-white uppercase">
                    OTHER SACRED SCRIPTURES{" "}
                    <span className="text-white/40">(ADDITIONAL)</span>
                  </span>
                </div>
                <div className="hide-scrollbar flex w-full gap-1 overflow-x-auto pb-2 sm:w-auto sm:pb-0">
                  {[
                    "All Traditions",
                    "Abrahamic",
                    "Eastern",
                    "Indigenous",
                    "Philosophy",
                  ].map((t, i) => (
                    <button
                      key={i}
                      className={`rounded border px-3 py-1 text-[9px] font-bold whitespace-nowrap ${i === 0 ? "border-white/20 bg-white/10 text-white" : "border-transparent text-white/40 hover:text-white"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <button className="flex shrink-0 items-center gap-1 text-[9px] font-bold text-white/50 uppercase hover:text-white">
                  VIEW COMPARISON TABLE <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
                {otherScriptures.map((s, idx) => (
                  <Link
                    href={`/knowledge/kitab/${s.id || ""}`}
                    key={idx}
                    className="group relative flex h-36 cursor-pointer flex-col overflow-hidden rounded-xl border border-white/5 bg-[#040914] shadow-lg transition-all hover:border-white/20"
                  >
                    <div className="absolute inset-0 z-0 h-full w-full bg-[#0A1224]">
                      <Image
                        src={s.image || "/cover_eastern.png"}
                        alt={s.name}
                        fill
                        className="object-cover opacity-60 transition-all duration-[2s] group-hover:scale-110 group-hover:opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#040914] via-[#040914]/80 to-transparent" />
                    </div>

                    <div className="relative z-10 flex h-full w-full flex-col justify-end p-3">
                      <div className="mb-0.5 w-full truncate text-[10px] font-black tracking-wider text-white uppercase drop-shadow-md">
                        {s.name}
                      </div>
                      <div className="mb-1 w-full truncate text-[8px] text-white/70 drop-shadow-sm">
                        {s.religion}
                      </div>
                      <div className="font-mono text-[7px] text-white/40">
                        {s.texts}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR: TIMELINE */}
          <div className="w-full flex-shrink-0 space-y-4 lg:w-56">
            <div className="rounded-xl border border-white/5 bg-[#0A1224] p-5 shadow-lg">
              <h3 className="mb-5 text-[9px] font-black tracking-widest text-blue-400 uppercase">
                Revelation Timeline
              </h3>

              <div className="relative space-y-4 before:absolute before:inset-0 before:ml-[15px] before:w-0.5 before:bg-white/5">
                {[
                  {
                    icon: BookOpen,
                    title: "Taurat",
                    year: "~1445 BCE",
                    author: "Moses (a.s)",
                    color: "amber",
                  },
                  {
                    icon: BookOpen,
                    title: "Zabur",
                    year: "~1000 BCE",
                    author: "David (a.s)",
                    color: "blue",
                  },
                  {
                    icon: BookOpen,
                    title: "Injil",
                    year: "~30 CE",
                    author: "Jesus (a.s)",
                    color: "purple",
                  },
                  {
                    icon: BookOpen,
                    title: "Al-Qur'an",
                    year: "610-632 CE",
                    author: "Muhammad ﷺ",
                    subauthor: "(Final & Universal)",
                    color: "emerald",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="group relative flex items-start gap-4"
                  >
                    <div
                      className={`h-8 w-8 rounded-full border-[3px] border-[#0A1224] bg-${item.color}-500/20 text-${item.color}-400 z-10 flex items-center justify-center shadow-[0_0_0_1px_rgba(255,255,255,0.1)]`}
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                    </div>
                    <div className="pt-0.5">
                      <div className="text-[11px] font-black text-white">
                        {item.title}
                      </div>
                      <div
                        className={`font-mono text-[9px] text-${item.color}-400`}
                      >
                        {item.year}
                      </div>
                      <div className="text-[9px] text-white/50">
                        {item.author}
                      </div>
                      {item.subauthor && (
                        <div className="text-[8px] text-white/30">
                          {item.subauthor}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-white/5 pt-5">
                <div className="mb-2 flex items-center gap-1.5 text-[9px] font-black text-white uppercase">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Final Revelation (Khatam)
                </div>
                <p className="mb-3 text-[9px] leading-relaxed text-white/40">
                  Al-Qur'an — Guidance for all humanity.
                </p>
                <ul className="mb-5 space-y-1.5 text-[8.5px] text-white/60">
                  <li className="flex items-start gap-1.5">
                    <Check className="h-3 w-3 shrink-0 text-emerald-500" />{" "}
                    Clarifies & Confirms
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="h-3 w-3 shrink-0 text-emerald-500" />{" "}
                    Completes Previous Scriptures
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="h-3 w-3 shrink-0 text-emerald-500" />{" "}
                    Preserved Eternally by Allah SWT
                  </li>
                </ul>
                <button className="w-full rounded border border-white/10 bg-white/5 py-1.5 text-[9px] font-black text-white/70 uppercase transition-colors hover:bg-white/10">
                  Learn More
                </button>
              </div>
            </div>

            {/* Arabic Quote */}
            <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-amber-500/20 bg-[#0A1224] p-5 text-center shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent opacity-50" />
              <div className="font-arabic relative z-10 mb-2 text-xl text-amber-400 drop-shadow-md">
                كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ
              </div>
              <p className="relative z-10 text-[9px] text-white/60 italic">
                "Every soul will taste death."
                <span className="mt-1 block text-[8px] text-white/30 not-italic">
                  (QS. Ali Imran 3:185)
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* 5. Footer Features */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
          <div className="group flex cursor-pointer items-center gap-3">
            <Globe2 className="h-5 w-5 text-white/30 transition-colors group-hover:text-blue-400" />
            <div>
              <div className="text-[9px] font-black tracking-widest text-white uppercase">
                Interfaith Dialogue
              </div>
              <div className="text-[8px] text-white/50">
                Understanding, not Debating
              </div>
            </div>
          </div>
          <div className="group flex cursor-pointer items-center gap-3">
            <Network className="h-5 w-5 text-white/30 transition-colors group-hover:text-purple-400" />
            <div>
              <div className="text-[9px] font-black tracking-widest text-white uppercase">
                Text Comparison Lab
              </div>
              <div className="text-[8px] text-white/50">
                AI-Powered Analysis
              </div>
            </div>
          </div>
          <div className="group flex cursor-pointer items-center gap-3">
            <BookOpen className="h-5 w-5 text-white/30 transition-colors group-hover:text-emerald-400" />
            <div>
              <div className="text-[9px] font-black tracking-widest text-white uppercase">
                Digital Library
              </div>
              <div className="text-[8px] text-white/50">
                120+ Language Translation
              </div>
            </div>
          </div>
          <div className="group flex cursor-pointer items-center gap-3">
            <User className="h-5 w-5 text-white/30 transition-colors group-hover:text-amber-400" />
            <div>
              <div className="text-[9px] font-black tracking-widest text-white uppercase">
                Community Research
              </div>
              <div className="text-[8px] text-white/50">
                Collaborate & Share Insight
              </div>
            </div>
          </div>
        </div>

        <div className="w-full pt-8 pb-4 text-center">
          <div className="text-[8px] font-black tracking-[0.3em] text-blue-500/50 uppercase">
            ★ WHEN THE MOON WITNESSES, WE SHARE MESSAGES. ★
          </div>
        </div>
      </div>
    </div>
  )
}
