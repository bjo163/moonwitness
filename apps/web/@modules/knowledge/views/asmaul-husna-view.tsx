"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  Star,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  BookOpen,
  PieChart,
  Activity,
  Layers,
  Globe,
  Database,
  Info,
  CheckCircle2,
  Clock,
} from "lucide-react"

export function AsmaulHusnaView() {
  const [mounted, setMounted] = useState(false)
  const [activeId, setActiveId] = useState("01")
  const [now, setNow] = useState(new Date())
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(15)
  const [searchQuery, setSearchQuery] = useState("")
  const [asmaulHusnaData, setAsmaulHusnaData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => setNow(new Date()), 1000)

    fetch("/api/asmaul-husna")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          const formattedData = json.data.map((item: any) => ({
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

  if (!mounted || isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020813] font-mono text-sm tracking-widest text-indigo-500">
        INITIALIZING DATABASE...
      </div>
    )

  if (asmaulHusnaData.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020813] font-mono text-sm tracking-widest text-red-500">
        DATABASE CONNECTION FAILED: NO RECORDS FOUND.
      </div>
    )
  }

  const timeString =
    (now.toISOString().split("T")[1] || "").split(".")[0] || "00:00:00"
  const activeItem =
    asmaulHusnaData.find((x) => x.id === activeId) || asmaulHusnaData[0]

  // Apply Search Filter
  const filteredData = asmaulHusnaData.filter((item) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      item.transliteration?.toLowerCase().includes(q) ||
      item.meaning?.toLowerCase().includes(q) ||
      item.arabic?.includes(q)
    )
  })

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage))
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="flex min-h-screen flex-col bg-[#020813] p-4 font-sans text-[#8F9FB3] selection:bg-indigo-500/30">
      <div className="mx-auto flex w-full max-w-[1800px] flex-1 flex-col space-y-4">
        {/* ═══ HEADER BAR ═══ */}
        <div className="flex shrink-0 items-start justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-widest text-white uppercase">
                DIVINE ATTRIBUTES — 99 SACRED NAMES
              </h1>
              <p className="mt-1 max-w-2xl text-[10px] text-[#8F9FB3]">
                Explore the 99 Divine Names and Attributes of Allah SWT —
                represented as cosmic runic archetypes with Calligraphy Arabic,
                Latin Transliteration, Translations, and Quranic References.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-6 pt-1">
            <div className="border-r border-white/10 pr-6 text-right">
              <div className="mb-1 text-[8px] tracking-widest text-[#8F9FB3] uppercase">
                OPERATION MODE
              </div>
              <div className="text-[10px] font-bold tracking-widest text-white uppercase">
                DIVINE-ATTRIBUTES-SCAN
              </div>
            </div>
            <div className="border-r border-white/10 pr-6 text-right">
              <div className="mb-1 text-[8px] tracking-widest text-[#8F9FB3] uppercase">
                SYSTEM STATUS
              </div>
              <div className="flex items-center justify-end gap-1.5 text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />{" "}
                ONLINE
              </div>
            </div>
            <div className="pointer-events-none translate-y-2 scale-150 transform pl-4 text-center opacity-70 mix-blend-screen">
              <img
                src="/assets/asmaul_husna_header.png"
                className="h-16 w-16 rounded-full object-cover"
                alt="Calligraphy"
                style={{
                  maskImage:
                    "radial-gradient(circle at center, black 40%, transparent 60%)",
                  WebkitMaskImage:
                    "radial-gradient(circle at center, black 40%, transparent 60%)",
                }}
              />
            </div>
          </div>
        </div>

        {/* ═══ TOP STATS ROW ═══ */}
        <div className="flex shrink-0 gap-4 overflow-hidden rounded-xl border border-white/5 bg-[#040C1A]">
          <div className="group relative flex flex-1 items-center gap-6 overflow-hidden border-r border-white/5 p-4">
            <div className="pointer-events-none absolute inset-0 bg-indigo-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="flex-1">
              <div className="mb-1 text-[8px] font-bold tracking-widest text-[#8F9FB3] uppercase">
                TOTAL NAMES
              </div>
              <div className="flex items-end gap-2">
                <span className="font-mono text-3xl leading-none font-bold text-white">
                  99
                </span>
                <span className="mb-1 text-[10px] font-bold tracking-widest text-indigo-400 uppercase">
                  SACRED NAMES
                </span>
              </div>
            </div>
            <div className="pointer-events-none absolute -right-2 h-20 w-20 opacity-50 mix-blend-screen transition-transform group-hover:scale-110">
              <img
                src="/assets/asmaul_husna_header.png"
                className="h-full w-full rounded-full object-cover"
                style={{
                  maskImage:
                    "radial-gradient(circle at center, black 50%, transparent 65%)",
                  WebkitMaskImage:
                    "radial-gradient(circle at center, black 50%, transparent 65%)",
                }}
              />
            </div>
          </div>

          <div className="flex flex-1 items-center gap-4 border-r border-white/5 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-500">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="mb-1 text-[8px] font-bold tracking-widest text-[#8F9FB3] uppercase">
                QURANIC REFERENCES
              </div>
              <div className="mb-1 font-mono text-xl leading-none font-bold text-white">
                280+
              </div>
              <div className="text-[8px] tracking-widest text-amber-500 uppercase">
                AYAT
              </div>
            </div>
          </div>

          <div className="flex flex-1 items-center gap-4 border-r border-white/5 p-4">
            <div className="font-arabic flex h-10 w-10 items-center justify-center rounded-full border border-purple-500/20 bg-purple-500/10 text-xl text-purple-400">
              الرن
            </div>
            <div>
              <div className="mb-1 text-[8px] font-bold tracking-widest text-[#8F9FB3] uppercase">
                ROOT LETTERS
              </div>
              <div className="mb-1 font-mono text-xl leading-none font-bold text-white">
                4
              </div>
              <div className="text-[8px] tracking-widest text-purple-400 uppercase">
                PRIMARY RADICALS
              </div>
            </div>
          </div>

          <div className="flex flex-1 items-center gap-4 border-r border-white/5 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#00aaff]/20 bg-[#00aaff]/10 text-[#00aaff]">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <div className="mb-1 text-[8px] font-bold tracking-widest text-[#8F9FB3] uppercase">
                MEANING CATEGORIES
              </div>
              <div className="mb-1 font-mono text-xl leading-none font-bold text-white">
                18
              </div>
              <div className="text-[8px] tracking-widest text-[#00aaff] uppercase">
                CATEGORIES
              </div>
            </div>
          </div>

          <div className="flex flex-[1.5] items-center justify-between border-r border-white/5 p-4">
            <div className="w-full text-center">
              <div className="mb-2 text-[8px] font-bold tracking-widest text-[#8F9FB3] uppercase">
                DIVINE ESSENCE
              </div>
              <div className="font-arabic mb-1 text-xl text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
                هُوَ اللَّهُ الَّذِي لَا إِلَهَ إِلَّا هُوَ
              </div>
              <div className="text-[9px] text-white">
                He is Allah, the One and Only.
              </div>
              <div className="text-[8px] text-[#8F9FB3]">
                (Al-Baqarah 2:255)
              </div>
            </div>
          </div>

          <div className="flex min-w-[120px] flex-col justify-center p-4 pr-6 text-right">
            <div className="mb-2 text-[8px] font-bold tracking-widest text-[#8F9FB3] uppercase">
              LAST UPDATED
            </div>
            <div className="font-mono text-[10px] font-bold text-white">
              12 AUG 2026
            </div>
            <div className="font-mono text-[9px] text-[#8F9FB3]">
              {timeString} UTC+0
            </div>
          </div>
        </div>

        {/* ═══ MAIN THREE COLUMNS ═══ */}
        <div className="grid min-h-[500px] flex-1 grid-cols-1 gap-4 lg:grid-cols-12">
          {/* ◄ LEFT: CATEGORIES & STATS (Col 1-2) */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <div className="flex-1 rounded-xl border border-white/5 bg-[#040C1A] p-4">
              <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-3 text-[9px] font-bold tracking-widest text-white uppercase">
                <Layers className="h-3.5 w-3.5 text-purple-400" /> DIVINE
                CATEGORIES
              </div>
              <div className="space-y-1">
                {[
                  { n: "Essence & Existence", v: 12 },
                  { n: "Attributes of Mercy", v: 21 },
                  { n: "Attributes of Majesty", v: 21 },
                  { n: "Attributes of Power", v: 16 },
                  { n: "Attributes of Knowledge", v: 11 },
                  { n: "Attributes of Will", v: 10 },
                  { n: "Attributes of Life", v: 5 },
                  { n: "Attributes of Perfection", v: 3 },
                ].map((x, i) => (
                  <div
                    key={i}
                    className="group flex cursor-pointer items-center justify-between rounded px-2 py-1.5 transition-colors hover:bg-white/5"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-white/20 transition-colors group-hover:bg-purple-400" />
                      <span className="text-[9px] tracking-widest text-[#8F9FB3] uppercase group-hover:text-white">
                        {x.n}
                      </span>
                    </div>
                    <span className="font-mono text-[9px] text-amber-500">
                      {x.v}
                    </span>
                  </div>
                ))}
              </div>
              <button className="mt-4 flex w-full items-center justify-between rounded border border-white/10 bg-white/5 px-4 py-2 text-[8px] font-bold tracking-widest text-white uppercase transition-colors hover:bg-white/10">
                LIHAT SEMUA KATEGORI{" "}
                <ChevronRight className="h-3 w-3 text-[#00aaff]" />
              </button>
            </div>

            <div className="rounded-xl border border-white/5 bg-[#040C1A] p-4">
              <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-3 text-[9px] font-bold tracking-widest text-white uppercase">
                <PieChart className="h-3.5 w-3.5 text-[#00aaff]" /> QURANIC
                COVERAGE
              </div>
              <div className="mb-4 flex items-center gap-4">
                <div
                  className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background:
                      "conic-gradient(from 0deg, #8b5cf6 0% 50%, #10b981 50% 80%, #0ea5e9 80% 100%)",
                  }}
                >
                  <div className="absolute inset-[3px] flex flex-col items-center justify-center rounded-full bg-[#040C1A]">
                    <span className="font-mono text-sm leading-none font-bold text-white">
                      280+
                    </span>
                    <span className="mt-0.5 text-[6px] tracking-widest text-[#8F9FB3] uppercase">
                      AYAT
                    </span>
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between text-[8px] tracking-widest uppercase">
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />{" "}
                      Langsung
                    </div>
                    <div className="font-mono text-white">144</div>
                  </div>
                  <div className="flex items-center justify-between text-[8px] tracking-widest uppercase">
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{" "}
                      Tidak Langsung
                    </div>
                    <div className="font-mono text-white">92</div>
                  </div>
                  <div className="flex items-center justify-between text-[8px] tracking-widest uppercase">
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#00aaff]" />{" "}
                      Asosiasi
                    </div>
                    <div className="font-mono text-white">44</div>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5 border-t border-white/10 pt-3">
                <div className="mb-2 text-[7px] font-bold tracking-widest text-[#8F9FB3] uppercase">
                  REFERENSI UTAMA
                </div>
                <div className="flex items-center justify-between text-[8px] text-[#8F9FB3]">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-2.5 w-2.5" /> Al-Quran
                  </span>
                  <span className="font-mono text-white">280+ Ayat</span>
                </div>
                <div className="flex items-center justify-between text-[8px] text-[#8F9FB3]">
                  <span className="flex items-center gap-1">
                    <Globe className="h-2.5 w-2.5" /> As-Sunnah
                  </span>
                  <span className="font-mono text-white">200+ Hadis</span>
                </div>
                <div className="flex items-center justify-between text-[8px] text-[#8F9FB3]">
                  <span className="flex items-center gap-1">
                    <Info className="h-2.5 w-2.5" /> Tafsir Ulama
                  </span>
                  <span className="font-mono text-white">50+ Kitab</span>
                </div>
              </div>
            </div>
          </div>

          {/* ■ CENTER: MAIN GRID (Col 3-9) */}
          <div className="flex flex-col gap-4 lg:col-span-7">
            {/* Search & Filters */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#8F9FB3]" />
                <input
                  type="text"
                  placeholder="Cari Nama atau Arti..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full rounded-lg border border-white/10 bg-[#040C1A] py-2.5 pr-4 pl-9 text-xs text-white transition-colors placeholder:text-[#8F9FB3] focus:border-indigo-500/50 focus:outline-none"
                />
              </div>
              <select className="rounded-lg border border-white/10 bg-[#040C1A] px-3 py-2.5 text-xs text-[#8F9FB3] focus:border-indigo-500/50 focus:outline-none">
                <option>Semua Kategori</option>
              </select>
              <select className="rounded-lg border border-white/10 bg-[#040C1A] px-3 py-2.5 text-xs text-[#8F9FB3] focus:border-indigo-500/50 focus:outline-none">
                <option>Semua Huruf</option>
              </select>
              <select className="rounded-lg border border-white/10 bg-[#040C1A] px-3 py-2.5 text-xs text-[#8F9FB3] focus:border-indigo-500/50 focus:outline-none">
                <option>Urutkan: Abjad</option>
              </select>
              <div className="flex gap-1 rounded-lg border border-white/10 bg-[#040C1A] p-1">
                <button className="rounded bg-[#00aaff]/20 px-2.5 py-1.5 text-[#00aaff]">
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button className="rounded px-2.5 py-1.5 text-[#8F9FB3] transition-colors hover:text-white">
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Grid of Names */}
            <div className="grid min-h-[500px] grid-cols-1 content-start gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {paginatedData.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-[#8F9FB3]">
                  <Search className="mb-4 h-10 w-10 opacity-20" />
                  <p className="text-xs tracking-widest uppercase">
                    Tidak ada nama yang cocok dengan "{searchQuery}"
                  </p>
                </div>
              ) : (
                paginatedData.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setActiveId(item.id)}
                    className={`group relative flex cursor-pointer flex-col items-center overflow-hidden rounded-xl border bg-[#040C1A] p-3 text-center transition-all ${activeId === item.id ? "z-10 scale-[1.02] border-indigo-500 bg-indigo-500/5 shadow-[0_0_20px_rgba(99,102,241,0.15)]" : "border-white/5 hover:scale-[1.02] hover:border-white/20 hover:bg-white/5"}`}
                  >
                    {activeId === item.id && (
                      <div className="pointer-events-none absolute inset-0 bg-indigo-500/10 mix-blend-screen" />
                    )}

                    <div className="relative z-10 mb-2 flex w-full items-start justify-between">
                      <span
                        className={`font-mono text-sm font-bold ${activeId === item.id ? "text-indigo-400 drop-shadow-[0_0_5px_rgba(129,140,248,0.8)]" : "text-[#8F9FB3]"}`}
                      >
                        {item.id}
                      </span>
                      <Star
                        className={`h-3.5 w-3.5 ${activeId === item.id ? "text-amber-400" : "text-white/20 group-hover:text-white/40"}`}
                      />
                    </div>

                    <div
                      className={`font-arabic mt-1 mb-3 text-4xl transition-all ${activeId === item.id ? "text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]" : "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"}`}
                    >
                      {item.arabic}
                    </div>

                    <div
                      className={`mb-1 text-[10px] font-bold tracking-widest uppercase transition-colors ${activeId === item.id ? "text-[#00aaff]" : "text-indigo-400"}`}
                    >
                      {item.transliteration}
                    </div>
                    <div className="mb-3 line-clamp-2 text-[9px] leading-tight text-white/90">
                      {item.meaning}
                    </div>
                    <div className="mt-auto w-full border-t border-white/5 pt-2 font-mono text-[7px] tracking-widest text-[#8F9FB3]">
                      {item.ref}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            <div className="mt-2 flex items-center justify-between rounded-xl border border-white/10 bg-[#040C1A] p-3">
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="flex h-7 w-7 items-center justify-center rounded border border-white/10 text-[#8F9FB3] hover:bg-white/5 hover:text-white disabled:opacity-50"
                >
                  <ChevronsLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex h-7 w-7 items-center justify-center rounded border border-white/10 text-[#8F9FB3] hover:bg-white/5 hover:text-white disabled:opacity-50"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>

                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = i + 1
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`h-7 w-7 rounded border font-mono text-[10px] font-bold ${currentPage === pageNum ? "border-indigo-500/30 bg-indigo-500/20 text-indigo-400" : "border-white/10 text-[#8F9FB3] hover:bg-white/5 hover:text-white"}`}
                    >
                      {pageNum}
                    </button>
                  )
                })}

                {totalPages > 5 && (
                  <span className="flex h-7 w-7 items-center justify-center text-[#8F9FB3]">
                    ...
                  </span>
                )}
                {totalPages > 5 && (
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`h-7 w-7 rounded border font-mono text-[10px] font-bold ${currentPage === totalPages ? "border-indigo-500/30 bg-indigo-500/20 text-indigo-400" : "border-white/10 text-[#8F9FB3] hover:bg-white/5 hover:text-white"}`}
                  >
                    {totalPages}
                  </button>
                )}

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="flex h-7 w-7 items-center justify-center rounded border border-white/10 text-[#8F9FB3] hover:bg-white/5 hover:text-white disabled:opacity-50"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="flex h-7 w-7 items-center justify-center rounded border border-white/10 text-[#8F9FB3] hover:bg-white/5 hover:text-white disabled:opacity-50"
                >
                  <ChevronsRight className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-[9px] text-[#8F9FB3]">
                Tampilkan
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                  className="rounded border border-white/10 bg-transparent px-2 py-1 focus:outline-none"
                >
                  <option value={15}>15</option>
                  <option value={30}>30</option>
                  <option value={99}>99</option>
                </select>
                per halaman
              </div>
            </div>
          </div>

          {/* ► RIGHT: DETAIL PANEL (Col 10-12) */}
          <div className="flex flex-col gap-4 lg:col-span-3">
            <div className="relative flex flex-1 flex-col overflow-hidden rounded-xl border border-white/5 bg-[#040C1A] p-5">
              <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-indigo-500/5 blur-[80px]" />

              <div className="relative z-10 mb-6 flex items-center gap-2 border-b border-white/10 pb-3 text-[9px] font-bold tracking-widest text-white uppercase">
                <Star className="h-3.5 w-3.5 text-indigo-400" /> DETAIL NAMA
                ALLAH
              </div>

              <div className="relative z-10 mb-8 text-center">
                <div className="font-arabic mb-4 text-6xl leading-tight text-amber-500 drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]">
                  {activeItem.arabic}
                </div>
                <div className="mb-1 text-lg font-bold tracking-widest text-[#00aaff] uppercase drop-shadow-[0_0_10px_rgba(0,170,255,0.4)]">
                  {activeItem.transliteration}
                </div>
                <div className="text-sm font-bold text-white">
                  {activeItem.meaning}
                </div>
              </div>

              <div className="relative z-10 mb-6 flex-1 space-y-4">
                {[
                  { l: "Kategori", v: "Rahmah (Kasih Sayang)" },
                  { l: "Arti", v: activeItem.meaning },
                  { l: "Transliterasi", v: activeItem.transliteration },
                  {
                    l: "Jumlah Huruf",
                    v: activeItem.arabic
                      .replace(/[^a-zA-Z\u0600-\u06FF]/g, "")
                      .length.toString(),
                  },
                  {
                    l: "Akar Kata",
                    v: activeItem.root,
                    f: "font-arabic text-base text-amber-400",
                  },
                  { l: "Tipe", v: "Sifat Allah (Musta'li)" },
                  { l: "Quranic Reference", v: "57 Ayat" },
                  { l: "Urutan", v: `${activeItem.id} dari 99` },
                ].map((x, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b border-white/5 pb-2 text-[10px]"
                  >
                    <span className="tracking-widest text-[#8F9FB3]">
                      {x.l}
                    </span>
                    <span className={`text-white ${x.f || "font-mono"}`}>
                      {x.v}
                    </span>
                  </div>
                ))}
              </div>

              <div className="relative z-10 mb-6 rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[8px] font-bold tracking-widest text-indigo-400 uppercase">
                    REFERENSI QURAN
                  </span>
                  <span className="rounded bg-[#00aaff]/10 px-2 py-0.5 text-[8px] font-bold tracking-widest text-[#00aaff]">
                    57 Ayat <ChevronRight className="inline h-2.5 w-2.5" />
                  </span>
                </div>
                <div className="mb-1 text-[9px] text-[#8F9FB3]">Contoh:</div>
                <div className="font-arabic mb-2 text-center text-lg leading-loose text-white">
                  {activeItem.id === "01"
                    ? "الرَّحْمَٰنُ ﴿١﴾ عَلَّمَ الْقُرْآنَ ﴿٢﴾ خَلَقَ الْإِنسَانَ"
                    : "وَهُوَ الْعَزِيزُ الْحَكِيمُ"}
                </div>
                <div className="mb-2 text-center text-[9px] text-white/80 italic">
                  {activeItem.id === "01"
                    ? 'Ar-Rahman. "Allah Yang Maha Pengasih. Yang telah mengajarkan Al-Quran. Dia menciptakan manusia."'
                    : "Dan Dialah Yang Maha Perkasa lagi Maha Bijaksana."}
                </div>
                <div className="text-center font-mono text-[8px] tracking-widest text-indigo-400">
                  {activeItem.id === "01"
                    ? "(QS. Ar-Rahman: 1-3)"
                    : activeItem.ref}
                </div>
              </div>

              <div className="relative z-10">
                <div className="mb-3 text-[8px] font-bold tracking-widest text-[#8F9FB3] uppercase">
                  HUBUNGAN TEMATIK
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Kasih Sayang",
                    "Kelembutan",
                    "Rahmah Universal",
                    "Pengampunan",
                    "Kebaikan",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="cursor-pointer rounded border border-white/10 px-2 py-1 text-[8px] tracking-widest text-[#8F9FB3] transition-colors hover:border-indigo-500/50 hover:text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ BOTTOM ROW GRID (12 Cols) ═══ */}
        <div className="grid shrink-0 grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Hijaiyah Patterns */}
          <div className="flex flex-col rounded-xl border border-white/5 bg-[#040C1A] p-4 lg:col-span-3">
            <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-3 text-[9px] font-bold tracking-widest text-white uppercase">
              <LayoutGrid className="h-3.5 w-3.5 text-indigo-400" /> POLA HURUF
              HIJAIYAH
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <div className="mb-2 text-[8px] tracking-widest text-[#8F9FB3] uppercase">
                  Distribusi Awal Huruf
                </div>
                <div className="flex gap-2">
                  <div className="font-arabic flex h-8 w-8 items-center justify-center rounded border border-white/10 text-lg text-white">
                    ح
                  </div>
                  <div className="font-arabic flex h-8 w-8 items-center justify-center rounded border border-[#00aaff]/30 bg-[#00aaff]/10 text-lg text-[#00aaff]">
                    م
                  </div>
                  <div className="font-arabic flex h-8 w-8 items-center justify-center rounded border border-white/10 text-lg text-white">
                    ن
                  </div>
                  <div className="font-arabic flex h-8 w-8 items-center justify-center rounded border border-white/10 text-lg text-white">
                    ل
                  </div>
                  <div className="font-arabic flex h-8 w-8 items-center justify-center rounded border border-white/10 text-lg text-white">
                    -
                  </div>
                </div>
              </div>
              <div>
                <div className="mb-2 text-[8px] tracking-widest text-[#8F9FB3] uppercase">
                  Dominant Patterns
                </div>
                <div className="flex gap-4">
                  <div className="text-[9px] font-bold text-[#00aaff]">
                    41 (AL-) أَلْ
                  </div>
                  <div className="text-[9px] font-bold text-purple-400">
                    24 (AL-MU) الْمُ
                  </div>
                  <div className="text-[9px] font-bold text-amber-500">
                    18 (AL-) ٱلْ
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Donut */}
          <div className="flex flex-col rounded-xl border border-white/5 bg-[#040C1A] p-4 lg:col-span-3">
            <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-3 text-[9px] font-bold tracking-widest text-white uppercase">
              <PieChart className="h-3.5 w-3.5 text-[#00aaff]" /> STATISTIK
              KATEGORI
            </div>
            <div className="flex flex-1 items-center gap-4">
              <div
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full"
                style={{
                  background:
                    "conic-gradient(from 0deg, #0ea5e9 0% 21%, #8b5cf6 21% 42%, #10b981 42% 58%, #f59e0b 58% 74%, #ec4899 74% 85%, #64748b 85% 100%)",
                }}
              >
                <div className="h-14 w-14 rounded-full bg-[#040C1A]" />
              </div>
              <div className="flex-1 space-y-1.5 text-[8px] tracking-widest">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-[#0ea5e9]" />{" "}
                    <span className="text-white">Rahmah (Kasih Sayang)</span>
                  </div>
                  <span className="font-mono text-[#8F9FB3]">21 (21.2%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-[#8b5cf6]" />{" "}
                    <span className="text-white">Jalalah (Kebesaran)</span>
                  </div>
                  <span className="font-mono text-[#8F9FB3]">21 (21.2%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-[#10b981]" />{" "}
                    <span className="text-white">Kamal (Kesempurnaan)</span>
                  </div>
                  <span className="font-mono text-[#8F9FB3]">16 (16.2%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-[#f59e0b]" />{" "}
                    <span className="text-white">Quwwah (Kekuatan)</span>
                  </div>
                  <span className="font-mono text-[#8F9FB3]">16 (16.2%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-[#ec4899]" />{" "}
                    <span className="text-white">Ilm (Pengetahuan)</span>
                  </div>
                  <span className="font-mono text-[#8F9FB3]">11 (11.1%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-[#64748b]" />{" "}
                    <span className="text-white">Lainnya</span>
                  </div>
                  <span className="font-mono text-[#8F9FB3]">14 (14.1%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tadabbur Insight */}
          <div className="flex flex-col rounded-xl border border-white/5 bg-[#040C1A] p-4 lg:col-span-3">
            <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-3 text-[9px] font-bold tracking-widest text-white uppercase">
              <Info className="h-3.5 w-3.5 text-amber-500" /> TADABBUR INSIGHT
            </div>
            <div className="flex flex-1 flex-col justify-center">
              <p className="mb-4 text-[10px] leading-relaxed text-white/90 italic">
                "Mengenal Asmaul Husna adalah perjalanan mengenal Dzat yang Maha
                Sempurna. Setiap nama adalah kunci menuju pemahaman yang lebih
                dalam tentang kebesaran dan kasih sayang-Nya."
              </p>
              <div className="text-right text-[9px] font-bold tracking-widest text-amber-500 uppercase">
                — Ibnu Qayyim Al-Jauziyah
              </div>
            </div>
          </div>

          {/* Tips Tadabbur */}
          <div className="group relative flex flex-col overflow-hidden rounded-xl border border-white/5 bg-[#040C1A] p-4 lg:col-span-3">
            <div className="pointer-events-none absolute top-1/2 right-0 h-40 w-40 -translate-y-1/2 opacity-20 mix-blend-screen transition-all duration-700 group-hover:scale-110 group-hover:opacity-40">
              <img
                src="/assets/sacred_geometry.png"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="relative z-10 mb-4 flex items-center gap-2 border-b border-white/10 pb-3 text-[9px] font-bold tracking-widest text-white uppercase">
              <Activity className="h-3.5 w-3.5 text-emerald-500" /> TIPS
              TADABBUR HARIAN
            </div>
            <div className="relative z-10 flex-1 space-y-3">
              {[
                "Pilih 1 nama setiap hari",
                "Pelajari artinya dan hayati maknanya",
                "Cari ayat yang berkaitan",
                "Amalkan dalam kehidupan",
                "Bagikan kebaikan",
              ].map((tip, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-500" />
                  <span className="text-[9px] text-white/90">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ FOOTER ═══ */}
        <div className="flex shrink-0 items-center justify-between px-2 pt-2 text-[7px] tracking-widest text-[#8F9FB3] uppercase">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />{" "}
              CONNECTED TO KNOWLEDGE DATABASE
            </div>
          </div>
          <div className="font-bold tracking-[0.3em] opacity-50">
            "WHEN THE MOON WITNESSES, WE SHARE MESSAGES."
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> DATA
              SYNCHRONIZED
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-2.5 w-2.5" />{" "}
              <span className="font-mono text-white">{timeString} UTC+0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
