"use client"

import React, { useState, useEffect } from "react"
import { useResource } from "@workspace/hooks"
import { fetchAsmaulHusna } from "@moon/client"
import { STORAGE_KEYS } from "@workspace/types"
import { AsmaulHusnaHero } from "../components/asmaul-husna/asmaul-husna-hero"
import { AsmaulHusnaCardItem, type FormattedAsmaulHusnaItem } from "../components/asmaul-husna/asmaul-husna-card-item"
import { AsmaulHusnaActivePanel } from "../components/asmaul-husna/asmaul-husna-active-panel"

export function AsmaulHusnaView() {
  const [activeId, setActiveId] = useState("01")
  const [now, setNow] = useState(new Date())
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const { data: asmaulHusnaData, loading } = useResource<FormattedAsmaulHusnaItem[]>(
    async () => {
      const json = await fetchAsmaulHusna()
      const rawNames = json?.names || (json as any)?.data || []

      return rawNames.map((item: any) => ({
        id: (item.number ?? 1).toString().padStart(2, "0"),
        arabic: item.arabic || item.name_arabic || "—",
        transliteration: item.transliteration || item.name_latin || item.latin || "—",
        meaning: item.meaning || item.translation_id || item.translationId || "—",
        ref: item.ref || item.quran_reference || "Asmaul Husna",
        root: item.root || "—",
      }))
    },
    {
      initialData: [],
      storageKey: STORAGE_KEYS.ASMAUL_HUSNA,
    }
  )

  const items = asmaulHusnaData || []

  if (loading && items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-card text-sm text-muted-foreground">
        Loading Asmaul Husna…
      </div>
    )
  }

  const timeString =
    (now.toISOString().split("T")[1] || "").split(".")[0] || "00:00:00"
  const activeItem =
    items.find((x) => x.id === activeId) || items[0]

  const filteredData = items.filter((item) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      item.transliteration?.toLowerCase().includes(q) ||
      item.meaning?.toLowerCase().includes(q) ||
      item.arabic?.includes(q)
    )
  })

  return (
    <div className="min-h-screen overflow-x-hidden bg-card pb-12 font-sans text-foreground selection:bg-indigo-500/30">
      <div className="mx-auto max-w-[1800px] space-y-6 px-4 pt-6 lg:px-6">
        {/* 1. Header Hero & Search Toolbar */}
        <AsmaulHusnaHero
          totalCount={items.length}
          timeString={timeString}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* 2. Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* LEFT: 99 Names Cards Grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-2 xl:grid-cols-3">
            {filteredData.length === 0 ? (
                <div className="col-span-full flex h-64 items-center justify-center rounded-md border border-border bg-card text-sm text-muted-foreground">
                No Divine Names found matching &ldquo;{searchQuery}&rdquo;.
              </div>
            ) : (
              filteredData.map((item) => (
                <AsmaulHusnaCardItem
                  key={item.id}
                  item={item}
                  isActive={activeId === item.id}
                  onClick={() => setActiveId(item.id)}
                />
              ))
            )}
          </div>

          {/* RIGHT: Active Detail Reflection Panel */}
          {activeItem && (
            <div>
              <AsmaulHusnaActivePanel item={activeItem} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
