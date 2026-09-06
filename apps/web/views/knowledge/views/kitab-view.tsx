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
import { searchSemanticPassages } from "@moon/client"
import type { SemanticSearchHit } from "@workspace/types"

export function KitabPortalView() {
  const [scriptures, setScriptures] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCollection, setActiveCollection] = useState<"all" | "canonical" | "additional">("all")
  const [semanticHits, setSemanticHits] = useState<SemanticSearchHit[]>([])
  const [isSearchingSemantic, setIsSearchingSemantic] = useState(false)

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSemanticHits([])
      return
    }

    const timer = setTimeout(() => {
      setIsSearchingSemantic(true)
      searchSemanticPassages(searchQuery.trim())
        .then((res) => {
          setSemanticHits(res.results || [])
        })
        .catch(() => setSemanticHits([]))
        .finally(() => setIsSearchingSemantic(false))
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])


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
    <div className="min-h-screen overflow-x-hidden bg-card pb-10 font-sans text-foreground selection:bg-blue-500/30">
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
        <div className="flex flex-col items-center justify-between gap-4 border-b border-border pt-2 pb-4 md:flex-row">
          <div className="flex w-full items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-2 md:w-auto">
            <BookOpen className="h-4 w-4 text-warning" />
            <span className="text-[10px] font-black tracking-widest uppercase">
              4 MAJOR CANONICAL SCRIPTURES
            </span>
            <Bookmark className="ml-auto h-3 w-3 text-foreground/30 md:ml-4" />
          </div>

          <div className="relative w-full max-w-2xl flex-1">
            <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-foreground/30" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search verses, keywords, topic across all scriptures..."
              className="w-full rounded-full border border-border bg-card py-2.5 pr-16 pl-11 text-xs text-foreground shadow-inner transition-all outline-none focus:border-blue-500/50"
            />
            <div className="absolute top-1/2 right-4 flex -translate-y-1/2 gap-1">
              <kbd className="rounded border border-border bg-muted/30 px-1.5 py-0.5 text-[9px] text-foreground/50">
                Ctrl
              </kbd>
              <span className="text-[9px] text-foreground/30">+</span>
              <kbd className="rounded border border-border bg-muted/30 px-1.5 py-0.5 text-[9px] text-foreground/50">
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
            <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
              <p className="font-mono text-[10px] tracking-widest text-foreground/40 uppercase">
                {visibleCanonicalCards.length + visibleAdditionalScriptures.length} resources in view
              </p>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-[10px] font-bold tracking-widest text-primary uppercase hover:text-foreground"
                >
                  Clear search
                </button>
              )}
            </div>

            {/* AI Semantic Scripture Matches */}
            {semanticHits.length > 0 && (
              <div className="rounded-xl border border-primary/20 bg-card p-4 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="font-mono text-xs font-semibold text-foreground uppercase">
                      Semantic Search Results ({semanticHits.length})
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">BM25 Normalized</span>
                </div>
                <div className="mt-3 space-y-3">
                  {semanticHits.map((hit) => (
                    <div key={hit.id} className="rounded-lg border border-border/60 bg-muted/20 p-3">
                      <div className="flex items-center justify-between text-[10px] font-mono text-primary font-bold">
                        <span>{hit.collection.toUpperCase()} · {hit.id}</span>
                        <span>Score: {hit.score.toFixed(2)}</span>
                      </div>
                      <p className="arabic-text mt-1 text-base text-right text-foreground">{hit.text_ar}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{hit.text_en}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
          <div className="group flex cursor-pointer items-center gap-3">
            <Globe2 className="h-5 w-5 text-foreground/30 transition-colors group-hover:text-blue-400" />
            <div>
              <div className="text-[9px] font-black tracking-widest text-foreground uppercase">
                Interfaith Dialogue
              </div>
              <div className="text-[8px] text-foreground/50">
                Understanding, not Debating
              </div>
            </div>
          </div>
          <div className="group flex cursor-pointer items-center gap-3">
            <Network className="h-5 w-5 text-foreground/30 transition-colors group-hover:text-primary" />
            <div>
              <div className="text-[9px] font-black tracking-widest text-foreground uppercase">
                Text Comparison Lab
              </div>
              <div className="text-[8px] text-foreground/50">
                AI-Powered Analysis
              </div>
            </div>
          </div>
          <div className="group flex cursor-pointer items-center gap-3">
            <BookOpen className="h-5 w-5 text-foreground/30 transition-colors group-hover:text-success" />
            <div>
              <div className="text-[9px] font-black tracking-widest text-foreground uppercase">
                Digital Library
              </div>
              <div className="text-[8px] text-foreground/50">
                120+ Language Translation
              </div>
            </div>
          </div>
          <div className="group flex cursor-pointer items-center gap-3">
            <User className="h-5 w-5 text-foreground/30 transition-colors group-hover:text-warning" />
            <div>
              <div className="text-[9px] font-black tracking-widest text-foreground uppercase">
                Community Research
              </div>
              <div className="text-[8px] text-foreground/50">
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
