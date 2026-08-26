"use client"

import { useState, useEffect } from "react"
import { AsmaulHusnaHero } from "../components/asmaul-husna/asmaul-husna-hero"
import { AsmaulHusnaCardItem, type FormattedAsmaulHusnaItem } from "../components/asmaul-husna/asmaul-husna-card-item"
import { AsmaulHusnaActivePanel } from "../components/asmaul-husna/asmaul-husna-active-panel"

export function AsmaulHusnaView() {
  const [mounted, setMounted] = useState(false)
  const [activeId, setActiveId] = useState("01")
  const [now, setNow] = useState(new Date())
  const [searchQuery, setSearchQuery] = useState("")
  const [asmaulHusnaData, setAsmaulHusnaData] = useState<FormattedAsmaulHusnaItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => setNow(new Date()), 1000)

    fetch("/api/asmaul-husna")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          const formattedData: FormattedAsmaulHusnaItem[] = json.data.map((item: any) => ({
            id: item.number.toString().padStart(2, "0"),
            arabic: item.name_arabic,
            transliteration: item.name_latin,
            meaning: item.translation_id || "—",
            ref: item.quran_reference || "Asmaul Husna",
            root: "—",
          }))
          setAsmaulHusnaData(formattedData)
        }
        setIsLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setIsLoading(false)
      })

    return () => clearInterval(interval)
  }, [])

  if (!mounted || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020813] font-mono text-sm tracking-widest text-indigo-400">
        SYNCHRONIZING ASMAUL HUSNA ONTOLOGY...
      </div>
    )
  }

  const timeString =
    (now.toISOString().split("T")[1] || "").split(".")[0] || "00:00:00"
  const activeItem =
    asmaulHusnaData.find((x) => x.id === activeId) || asmaulHusnaData[0]

  const filteredData = asmaulHusnaData.filter((item) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      item.transliteration?.toLowerCase().includes(q) ||
      item.meaning?.toLowerCase().includes(q) ||
      item.arabic?.includes(q)
    )
  })

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#040814] pb-12 font-sans text-white selection:bg-indigo-500/30">
      <div className="mx-auto max-w-[1800px] space-y-6 px-4 pt-6 lg:px-6">
        {/* 1. Header Hero & Search Toolbar */}
        <AsmaulHusnaHero
          totalCount={asmaulHusnaData.length}
          timeString={timeString}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* 2. Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* LEFT: 99 Names Cards Grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-2 xl:grid-cols-3">
            {filteredData.length === 0 ? (
              <div className="col-span-full flex h-64 items-center justify-center rounded-xl border border-white/5 bg-[#080E1C] font-mono text-xs text-white/40">
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
