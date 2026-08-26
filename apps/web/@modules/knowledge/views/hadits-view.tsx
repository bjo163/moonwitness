"use client"

import { useState, useEffect } from "react"
import { HaditsCompendiumsBar } from "../components/hadits/hadits-compendiums-bar"
import { HaditsItemCard, type FormattedHadithItem } from "../components/hadits/hadits-item-card"
import { HaditsAnalyticsPanel } from "../components/hadits/hadits-analytics-panel"
import { HaditsFilterControls } from "../components/hadits/hadits-filter-controls"

export function HaditsPortalView() {
  const [activeId, setActiveId] = useState("0")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGrade, setSelectedGrade] = useState("ALL")
  const [hadithData, setHadithData] = useState<FormattedHadithItem[]>([])
  const [totalHadiths, setTotalHadiths] = useState(187642)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const PAGE_LIMIT = 20

  useEffect(() => {
    setIsLoading(true)
    fetch(`/api/hadiths?page=${currentPage}&limit=${PAGE_LIMIT}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          const formatted: FormattedHadithItem[] = json.data.map((item: any) => {
            const g = (item.grade || "").toLowerCase()
            let c = "emerald"
            if (g.includes("hasan")) c = "blue"
            else if (g.includes("daif") || g.includes("weak")) c = "amber"
            else if (g.includes("mawdhu") || g.includes("fabricated")) c = "red"

            return {
              id: item.id?.toString() || "0",
              grade: item.grade || "SAHIH",
              arabic: item.text_ar || item.text_arabic || "...",
              translation:
                item.matan_id || item.text_en || item.text_id || "...",
              ref: `${(item.book_slug || "Book").replace(/-/g, " ")} • ${item.number || "?"}`,
              topic: "General Topic",
              quran: "—",
              color: c,
              raw: item,
            }
          })
          setHadithData(formatted)
          setTotalHadiths(json.total || 187642)
          if (formatted.length > 0 && formatted[0]) setActiveId(formatted[0].id)
        }
        setIsLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching hadiths:", err)
        setIsLoading(false)
      })
  }, [currentPage])

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
    <div className="min-h-screen overflow-x-hidden bg-[#040814] pb-12 font-sans text-white selection:bg-cyan-500/30">
      {/* 1. Top Compendiums Stats Bar */}
      <HaditsCompendiumsBar totalHadiths={totalHadiths} />

      <div className="mx-auto max-w-[1800px] space-y-6 px-4 pt-6 lg:px-6">
        {/* 2. Header Title */}
        <div className="flex flex-col items-start justify-between gap-4 border-b border-white/10 pb-4 md:flex-row md:items-center">
          <div>
            <div className="mb-1 flex items-center gap-3">
              <h1 className="font-mono text-2xl font-black tracking-widest text-white uppercase drop-shadow-md sm:text-3xl">
                HADITH TRANSMISSION COMPENDIUM
              </h1>
              <span className="rounded border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 font-mono text-[9px] font-bold text-cyan-400">
                KUTUBUT TIS&apos;AH
              </span>
            </div>
            <p className="font-mono text-xs text-white/50">
              Universal Prophetic Sunnah & Chains of Transmission (Sanad) Telemetry
            </p>
          </div>

          <div className="text-right">
            <div className="font-arabic text-xl text-cyan-400/90 drop-shadow-[0_0_10px_rgba(0,240,255,0.3)]">
              تَرَكْتُ فِيكُمْ أَمْرَيْنِ لَنْ تَضِلُّوا مَا تَمَسَّكْتُمْ بِهِمَا
            </div>
            <p className="font-mono text-[9px] text-white/40 italic">
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
            {isLoading ? (
              <div className="flex h-64 items-center justify-center rounded-xl border border-white/5 bg-[#080E1C] font-mono text-xs text-cyan-400">
                SYNCHRONIZING HADITH TELEMETRY...
              </div>
            ) : filteredHadiths.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-white/5 bg-[#080E1C] p-6 text-center font-mono text-xs text-white/40">
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
