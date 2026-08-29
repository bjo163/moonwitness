"use client"

import { useState, useEffect } from "react"
import {
  BookOpen,
  Search,
  Bookmark,
  Sparkles,
  Globe2,
  Network,
  User,
} from "lucide-react"
import { KitabHero } from "../components/kitab/kitab-hero"
import { KitabCanonicalGrid, type CanonicalScriptureCard } from "../components/kitab/kitab-canonical-grid"
import { KitabAdditionalGrid, type AdditionalScriptureItem } from "../components/kitab/kitab-additional-grid"
import { KitabLeftSidebar, KitabRightTimeline } from "../components/kitab/kitab-sidebar-timeline"

export function KitabPortalView() {
  const [scriptures, setScriptures] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCollection, setActiveCollection] = useState<"all" | "canonical" | "additional">("all")

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
  const canonicalCards: CanonicalScriptureCard[] = canonicals.map((s: any, idx: number) => {
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

  const otherScriptures: AdditionalScriptureItem[] = additionals.slice(0, 8).map((s: any) => ({
    id: s.id,
    name: s.name,
    religion: s.religion,
    texts: s.description || "Sacred Text",
    color: s.theme_color || "blue",
    icon: s.icon || "🪽",
    image: s.cover_image_url || "/cover_eastern.png",
  }))

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const matchesQuery = (value: string) =>
    !normalizedQuery || value.toLowerCase().includes(normalizedQuery)
  const visibleCanonicalCards = canonicalCards.filter((card) =>
    activeCollection !== "additional" &&
    matchesQuery(`${card.name} ${card.original_name} ${card.religion} ${card.subtitle}`)
  )
  const visibleAdditionalScriptures = otherScriptures.filter((scripture) =>
    activeCollection !== "canonical" &&
    matchesQuery(`${scripture.name} ${scripture.religion} ${scripture.texts}`)
  )

  return (
    <div className="min-h-screen overflow-x-hidden bg-card pb-10 font-sans text-white selection:bg-blue-500/30">
      {/* Background Ambience */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/2 h-[400px] w-full max-w-[1000px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1800px] space-y-4 px-4 pt-2 lg:px-6">
        {/* 1. Hero & Stats Strip */}
        <KitabHero
          totalScriptures={totalScriptures}
          canonicalsCount={canonicals.length}
          totalVerses={totalVerses}
          totalProphets={totalProphets}
        />

        {/* 2. Toolbar */}
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
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search verses, keywords, topic across all scriptures..."
              className="w-full rounded-full border border-white/10 bg-card py-2.5 pr-16 pl-11 text-xs text-white shadow-inner transition-all outline-none focus:border-blue-500/50"
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

          <button className="group flex w-full items-center justify-center gap-2 rounded-full border border-border bg-primary/10 px-6 py-2.5 text-[10px] font-black text-primary transition-all hover:bg-primary/30 md:w-auto">
            <Sparkles className="h-3.5 w-3.5" />
            AI COMPARE
          </button>
        </div>

        {/* 3. Main 3-Column Content Layout */}
        <div className="flex flex-col items-start gap-5 lg:flex-row">
          {/* LEFT SIDEBAR: MENU & FILTERS */}
          <KitabLeftSidebar
            activeCollection={activeCollection}
            onCollectionChange={setActiveCollection}
          />

          {/* CENTER CONTENT: CARDS & ADDITIONAL SCRIPTURES */}
          <div className="flex min-w-0 flex-1 flex-col space-y-6">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
              <p className="font-mono text-[10px] tracking-widest text-white/40 uppercase">
                {visibleCanonicalCards.length + visibleAdditionalScriptures.length} resources in view
              </p>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-[10px] font-bold tracking-widest text-cyan-400 uppercase hover:text-white"
                >
                  Clear search
                </button>
              )}
            </div>
            {visibleCanonicalCards.length > 0 && <KitabCanonicalGrid cards={visibleCanonicalCards} />}
            {visibleAdditionalScriptures.length > 0 && (
              <KitabAdditionalGrid scriptures={visibleAdditionalScriptures} totalProphets={totalProphets} />
            )}
            {visibleCanonicalCards.length === 0 && visibleAdditionalScriptures.length === 0 && (
              <div className="rounded-xl border border-border bg-card p-10 text-center">
                <p className="font-mono text-sm text-muted-foreground">No scripture resources match this search.</p>
                <p className="mt-2 text-xs text-muted-foreground/70">Try a title, tradition, or collection filter.</p>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR: TIMELINE & CALLOUTS */}
          <KitabRightTimeline />
        </div>

        {/* 4. Footer Features */}
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
            <Network className="h-5 w-5 text-white/30 transition-colors group-hover:text-primary" />
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
