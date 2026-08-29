"use client"

import React, { useEffect, useState } from "react"
import { useResource } from "@workspace/hooks"
import { fetchHadithList } from "@moon/client"
import { HaditsCompendiumsBar } from "../components/hadits/hadits-compendiums-bar"
import { HaditsItemCard, type FormattedHadithItem } from "../components/hadits/hadits-item-card"
import { HaditsAnalyticsPanel } from "../components/hadits/hadits-analytics-panel"
import { HaditsFilterControls } from "../components/hadits/hadits-filter-controls"

export function HaditsPortalView() {
  const [activeId, setActiveId] = useState("0")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGrade, setSelectedGrade] = useState("ALL")
  const [selectedCompendium, setSelectedCompendium] = useState("bukhari")
  const [currentPage, setCurrentPage] = useState(1)
  const PAGE_LIMIT = 20

  const { data: hadithResponse, loading } = useResource<{
    data: FormattedHadithItem[]
    total: number
  }>(
    async () => {
      const res = await fetchHadithList(selectedCompendium, currentPage, PAGE_LIMIT)
      const rawList = res.items || []

      const formatted: FormattedHadithItem[] = rawList.map((item: any) => {
        const g = (item.grade || "").toLowerCase()
        let c = "emerald"
        if (g.includes("hasan")) c = "blue"
        else if (g.includes("daif") || g.includes("weak")) c = "amber"
        else if (g.includes("mawdhu") || g.includes("fabricated")) c = "red"

        return {
          id: item.id?.toString() || String(item.number || "0"),
          grade: item.grade || "SAHIH",
          arabic: item.textArabic || item.text_ar || item.arabicText || "...",
          translation:
            item.textId || item.textEn || item.matan_id || item.translation || "...",
          ref: `${(res.book?.name || "Bukhari").replace(/-/g, " ")} • ${item.number || "?"}`,
          topic: item.topic || "General Topic",
          quran: "—",
          color: c,
          raw: item,
        }
      })

      return {
        data: formatted,
        total: res.book?.totalItems || 7563,
      }
    },
    {
      deps: [currentPage, selectedCompendium],
      initialData: { data: [], total: 187642 },
    }
  )

  useEffect(() => {
    setCurrentPage(1)
    setActiveId("0")
  }, [searchQuery, selectedGrade, selectedCompendium])

  const hadithData = hadithResponse?.data || []
  const totalHadiths = hadithResponse?.total || 187642

  const filteredHadiths = hadithData.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.arabic.includes(searchQuery)
    const matchesGrade =
      selectedGrade === "ALL" ||
      item.grade.toUpperCase().includes(selectedGrade)
    return matchesSearch && matchesGrade
  })

  return (
    <div className="min-h-screen overflow-x-hidden bg-card pb-12 font-sans text-foreground selection:bg-primary/10">
      {/* 1. Top Compendiums Stats Bar */}
      <HaditsCompendiumsBar
        totalHadiths={totalHadiths}
        selectedSlug={selectedCompendium}
        onSelect={setSelectedCompendium}
      />

      <div className="mx-auto max-w-[1800px] space-y-6 px-4 pt-6 lg:px-6">
        {/* 2. Header Title */}
        <div className="flex flex-col items-start justify-between gap-4 border-b border-border pb-4 md:flex-row md:items-center">
          <div>
            <div className="mb-1 flex items-center gap-3">
              <h1 className="font-mono text-2xl font-black tracking-widest text-foreground uppercase drop-shadow-md sm:text-3xl">
                {selectedCompendium === "bukhari" ? "HADITH TRANSMISSION COMPENDIUM" : "HADITH COLLECTION READER"}
              </h1>
              <span className="rounded border border-border bg-primary/10 px-2 py-0.5 font-mono text-[9px] font-bold text-primary">
                KUTUBUT TIS&apos;AH
              </span>
            </div>
            <p className="font-mono text-xs text-foreground/50">
              Universal Prophetic Sunnah & Chains of Transmission (Sanad) Telemetry
            </p>
          </div>

          <div className="text-right">
            <div className="font-arabic text-xl text-primary/90 drop-shadow-sm">
              تَرَكْتُ فِيكُمْ أَمْرَيْنِ لَنْ تَضِلُّوا مَا تَمَسَّكْتُمْ بِهِمَا
            </div>
            <p className="font-mono text-[9px] text-foreground/40 italic">
              &ldquo;I have left among you two matters; you will not go astray as long as you adhere to them.&rdquo;
            </p>
          </div>
        </div>

        {/* 3. Search & Filter Controls */}
        <HaditsFilterControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedGrade={selectedGrade}
          onGradeChange={setSelectedGrade}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          totalCount={totalHadiths}
          limit={PAGE_LIMIT}
        />

        {/* 4. Main 2-Column Content Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* LEFT: Hadith Cards List */}
          <div className="space-y-4 lg:col-span-2">
            {loading && hadithData.length === 0 ? (
              <div className="flex h-64 items-center justify-center rounded-xl border border-border bg-card font-mono text-xs text-primary">
                SYNCHRONIZING HADITH TELEMETRY...
              </div>
            ) : filteredHadiths.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-border bg-card p-6 text-center font-mono text-xs text-foreground/40">
                <p>No hadiths matched your query or filter.</p>
              </div>
            ) : (
              filteredHadiths.map((hadith) => (
                <HaditsItemCard
                  key={hadith.id}
                  hadith={hadith}
                  isActive={activeId === hadith.id}
                  onClick={() => setActiveId(hadith.id)}
                />
              ))
            )}
          </div>

          {/* RIGHT: Analytics, Matrix & Narrator Profiles */}
          <div className="space-y-4">
            <HaditsAnalyticsPanel />
          </div>
        </div>
      </div>
    </div>
  )
}
