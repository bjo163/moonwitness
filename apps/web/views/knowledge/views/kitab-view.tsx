"use client"

import { useState, useEffect } from "react"
import { KitabHero } from "../components/kitab/kitab-hero"
import type { CanonicalScriptureCard } from "../components/kitab/kitab-canonical-grid"
import type { AdditionalScriptureItem } from "../components/kitab/kitab-additional-grid"
import {
  KitabLeftSidebar,
  KitabRightTimeline,
} from "../components/kitab/kitab-sidebar-timeline"
import {
  KitabPortalFooter,
  KitabPortalResults,
  KitabPortalToolbar,
} from "./kitab-portal-presentation"
import { searchSemanticPassages } from "@moon/client"
import type { SemanticSearchHit } from "@workspace/types"

export function KitabPortalView() {
  const [scriptures, setScriptures] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCollection, setActiveCollection] = useState<
    "all" | "canonical" | "additional"
  >("all")
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
  const canonicalCards: CanonicalScriptureCard[] = canonicals.map(
    (s: any, idx: number) => {
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
    }
  )

  const otherScriptures: AdditionalScriptureItem[] = additionals
    .slice(0, 8)
    .map((s: any) => ({
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
  const visibleCanonicalCards = canonicalCards.filter(
    (card) =>
      activeCollection !== "additional" &&
      matchesQuery(
        `${card.name} ${card.original_name} ${card.religion} ${card.subtitle}`
      )
  )
  const visibleAdditionalScriptures = otherScriptures.filter(
    (scripture) =>
      activeCollection !== "canonical" &&
      matchesQuery(`${scripture.name} ${scripture.religion} ${scripture.texts}`)
  )

  return (
    <div className="min-h-screen overflow-x-hidden bg-card pb-10 font-sans text-foreground selection:bg-blue-500/30">
      <div className="mx-auto max-w-[1800px] space-y-4 px-4 pt-2 lg:px-6">
        {/* 1. Hero & Stats Strip */}
        <KitabHero
          totalScriptures={totalScriptures}
          canonicalsCount={canonicals.length}
          totalVerses={totalVerses}
          totalProphets={totalProphets}
        />

        <KitabPortalToolbar
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
        />

        {/* 3. Main 3-Column Content Layout */}
        <div className="flex flex-col items-start gap-5 lg:flex-row">
          {/* LEFT SIDEBAR: MENU & FILTERS */}
          <KitabLeftSidebar
            activeCollection={activeCollection}
            onCollectionChange={setActiveCollection}
          />

          <KitabPortalResults
            searchQuery={searchQuery}
            visibleCanonicalCards={visibleCanonicalCards}
            visibleAdditionalScriptures={visibleAdditionalScriptures}
            semanticHits={semanticHits}
            totalProphets={totalProphets}
            onClearSearch={() => setSearchQuery("")}
          />

          {/* RIGHT SIDEBAR: TIMELINE & CALLOUTS */}
          <KitabRightTimeline />
        </div>

        <KitabPortalFooter />
      </div>
    </div>
  )
}
