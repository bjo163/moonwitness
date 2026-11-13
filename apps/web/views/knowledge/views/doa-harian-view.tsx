"use client"

import { useState, useEffect } from "react"
import { DoaHeroStats } from "../components/doa/doa-hero-stats"
import { DoaCardItem, type FormattedDoaItem } from "../components/doa/doa-card-item"

export function DoaHarianView() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("HARIAN")
  const [searchQuery, setSearchQuery] = useState("")
  const [adhkarData, setAdhkarData] = useState<FormattedDoaItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    setIsLoading(true)
    fetch(`/api/adhkar`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          const formatted: FormattedDoaItem[] = json.data.map((item: any) => ({
            id: item.id,
            title: item.title || item.name || "Doa",
            arabic: item.arabic || item.text_ar || "...",
            latin: item.latin || item.transliteration || "",
            translation: item.translation || item.translation_id || item.text_id || "...",
            source: item.source || item.reference || "Hisnul Muslim",
            category: item.category || "HARIAN",
            repetition: item.repetition || item.count || 1,
          }))
          setAdhkarData(formatted)
        }
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [])

  if (!mounted || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-card text-sm text-muted-foreground">
        Loading daily prayers and adhkar…
      </div>
    )
  }

  const filteredData = adhkarData.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.arabic.includes(searchQuery)

    const matchesTab =
      activeTab === "SEMUA" ||
      (item.category && item.category.toUpperCase().includes(activeTab)) ||
      (activeTab === "HARIAN" && !item.category)

    return matchesSearch && matchesTab
  })

  return (
    <div className="min-h-screen overflow-x-hidden bg-card pb-12 font-sans text-foreground selection:bg-emerald-500/30">
      <div className="mx-auto max-w-[1800px] space-y-6 px-4 pt-6 lg:px-6">
        {/* 1. Header Hero & Stats */}
        <DoaHeroStats
          totalCount={adhkarData.length}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* 2. Dua Cards List Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredData.length === 0 ? (
            <div className="col-span-full flex h-64 items-center justify-center rounded-xl border border-border bg-card font-mono text-xs text-foreground/40">
              No supplications found for &ldquo;{searchQuery}&rdquo; in category &ldquo;{activeTab}&rdquo;.
            </div>
          ) : (
            filteredData.map((item) => (
              <DoaCardItem key={item.id} item={item} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
