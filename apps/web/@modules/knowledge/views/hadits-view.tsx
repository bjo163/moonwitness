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
  Bookmark,
  Link,
  Quote,
  Book,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Cross,
  Flame,
} from "lucide-react"

// --- Data mapped dynamically from Supabase API ---

const compendiums = [
  { n: "Sahih al-Bukhari", v: "7,275", c: "bg-emerald-500" },
  { n: "Sahih Muslim", v: "4,341", c: "bg-emerald-500" },
  { n: "Sunan Abu Dawud", v: "4,804", c: "bg-blue-500" },
  { n: "Jami' at-Tirmidhi", v: "3,955", c: "bg-amber-500" },
  { n: "Sunan an-Nasa'i", v: "5,618", c: "bg-blue-500" },
  { n: "Sunan Ibn Majah", v: "4,256", c: "bg-blue-500" },
  { n: "Muwatta Malik", v: "2,363", c: "bg-emerald-500" },
  { n: "Sunan ad-Darimi", v: "3,401", c: "bg-blue-500" },
  { n: "Musnad Ahmad", v: "29,750", c: "bg-red-500" },
  { n: "Sunan al-Bayhaqi", v: "15,125", c: "bg-amber-500" },
  { n: "Sunan ad-Daraqutni", v: "5,277", c: "bg-red-500" },
  { n: "Sunan al-Kubra (Nasa'i)", v: "10,327", c: "bg-blue-500" },
  { n: "Jami' Ibn Hibban", v: "8,957", c: "bg-emerald-500" },
  { n: "Mustadrak al-Hakim", v: "6,666", c: "bg-amber-500" },
]

export function HaditsPortalView() {
  const [mounted, setMounted] = useState(false)
  const [activeId, setActiveId] = useState("0")
  const [now, setNow] = useState(new Date())
  const [searchQuery, setSearchQuery] = useState("")

  const [hadithData, setHadithData] = useState<any[]>([])
  const [totalHadiths, setTotalHadiths] = useState(187642)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setIsLoading(true)
    fetch(`/api/hadiths?page=${currentPage}&limit=20`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          const formatted = json.data.map((item: any) => {
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
          if (formatted.length > 0) setActiveId(formatted[0].id)
        }
        setIsLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setIsLoading(false)
      })
  }, [currentPage])

  if (!mounted || isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020813] font-mono text-sm tracking-widest text-blue-500">
        INITIALIZING SUPABASE CONNECTION...
      </div>
    )

  const timeString =
    (now.toISOString().split("T")[1] || "").split(".")[0] || "00:00:00"

  const activeItem =
    hadithData.find((x) => x.id === activeId) || hadithData[0] || null
  const totalPages = Math.max(1, Math.ceil(totalHadiths / 20))

  const filteredData = hadithData.filter((item) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      item.translation.toLowerCase().includes(q) ||
      item.topic.toLowerCase().includes(q) ||
      item.ref.toLowerCase().includes(q)
    )
  })

  return (
    <div className="flex min-h-screen flex-col bg-[#020813] p-4 font-sans text-[#8F9FB3] selection:bg-blue-500/30">
      <div className="mx-auto flex w-full max-w-[1800px] flex-1 flex-col space-y-4">
        {/* ═══ HEADER BAR ═══ */}
        <div className="relative flex shrink-0 items-start justify-between overflow-hidden border-b border-white/10 pb-4">
          <div className="pointer-events-none absolute top-0 right-10 h-32 w-96 bg-blue-500/5 blur-[100px]" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded border border-blue-500/30 bg-blue-500/10 text-blue-400">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-widest text-white uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                PROPHETIC TRADITIONS & HADITH COMPENDIUMS
              </h1>
              <p className="mt-1 max-w-2xl text-[10px] text-[#8F9FB3]">
                Explore authentic Hadiths of Prophet Muhammad PBUH (14 Canonical
                Compendiums) and Oral Traditions clarifying divine scriptures
                from Torah (Mishna), Psalms (Tasbih), and Gospel (Didache of 12
                Apostles).
              </p>
            </div>
          </div>
          <div className="relative z-10 flex shrink-0 items-center gap-6 pt-1">
            <div className="border-r border-white/10 pr-6 text-right">
              <div className="mb-1 text-[8px] tracking-widest text-[#8F9FB3] uppercase">
                OPERATION MODE
              </div>
              <div className="text-[10px] font-bold tracking-widest text-white uppercase">
                HADITH-COMPENDIUM-SCAN
              </div>
            </div>
            <div className="border-r border-white/10 pr-6 text-right">
              <div className="mb-1 text-[8px] tracking-widest text-[#8F9FB3] uppercase">
                SYSTEM STATUS
              </div>
              <div className="flex items-center justify-end gap-1.5 text-[10px] font-bold tracking-widest text-emerald-400 uppercase drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />{" "}
                ONLINE
              </div>
            </div>
            <div className="border-r border-white/10 pr-6 text-right">
              <div className="mb-1 text-[8px] tracking-widest text-[#8F9FB3] uppercase">
                LAST UPDATE
              </div>
              <div className="font-mono text-[10px] font-bold tracking-widest text-white uppercase">
                12 AUG 2026 • {timeString} UTC+0
              </div>
            </div>
            <div className="pointer-events-none -translate-x-4 translate-y-1 scale-150 transform text-center opacity-90 mix-blend-screen">
              <img
                src="/assets/hadith_header.png"
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
        <div className="flex shrink-0 gap-4 overflow-hidden rounded-xl border border-white/5 bg-[#040C1A] shadow-lg">
          <div className="group relative flex flex-1 cursor-pointer items-center gap-4 overflow-hidden border-r border-white/5 p-4 transition-colors hover:bg-white/5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400">
              <Book className="h-5 w-5" />
            </div>
            <div className="relative z-10">
              <div className="mb-1 text-[8px] font-bold tracking-widest text-[#8F9FB3] uppercase">
                TOTAL HADITHS
              </div>
              <div className="mb-1 font-mono text-2xl leading-none font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                30,800
              </div>
              <div className="text-[8px] tracking-widest text-blue-400 uppercase">
                NARRATIONS
              </div>
            </div>
          </div>

          <div className="flex flex-[1.2] cursor-pointer items-center gap-4 border-r border-white/5 p-4 transition-colors hover:bg-white/5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="mb-1 text-[8px] font-bold tracking-widest text-[#8F9FB3] uppercase">
                SAHIH (AUTHENTIC)
              </div>
              <div className="mb-1 font-mono text-xl leading-none font-bold text-white">
                13,757
              </div>
              <div className="font-mono text-[9px] text-emerald-500">
                44.66%
              </div>
            </div>
          </div>

          <div className="flex flex-[1.2] cursor-pointer items-center gap-4 border-r border-white/5 p-4 transition-colors hover:bg-white/5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-500">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <div className="mb-1 text-[8px] font-bold tracking-widest text-[#8F9FB3] uppercase">
                HASAN (GOOD)
              </div>
              <div className="mb-1 font-mono text-xl leading-none font-bold text-white">
                17,043
              </div>
              <div className="font-mono text-[9px] text-blue-500">55.33%</div>
            </div>
          </div>

          <div className="flex flex-[1.2] cursor-pointer items-center gap-4 border-r border-white/5 p-4 transition-colors hover:bg-white/5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-500">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <div className="mb-1 text-[8px] font-bold tracking-widest text-[#8F9FB3] uppercase">
                DA'IF (WEAK)
              </div>
              <div className="mb-1 font-mono text-xl leading-none font-bold text-white">
                0
              </div>
              <div className="font-mono text-[9px] text-amber-500">0.00%</div>
            </div>
          </div>

          <div className="flex flex-[1.2] cursor-pointer items-center gap-4 border-r border-white/5 p-4 transition-colors hover:bg-white/5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-red-500">
              <XCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="mb-1 text-[8px] font-bold tracking-widest text-[#8F9FB3] uppercase">
                MAWDHU' (FABRICATED)
              </div>
              <div className="mb-1 font-mono text-xl leading-none font-bold text-white">
                0
              </div>
              <div className="font-mono text-[9px] text-red-500">0.00%</div>
            </div>
          </div>

          <div className="flex flex-1 cursor-pointer items-center gap-4 border-r border-white/5 p-4 transition-colors hover:bg-white/5">
            <div className="flex h-8 w-8 items-center justify-center rounded border border-purple-500/20 bg-purple-500/10 text-purple-400">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <div className="mb-1 font-mono text-lg leading-none font-bold text-white">
                14
              </div>
              <div className="max-w-[80px] text-[7px] tracking-widest text-[#8F9FB3] uppercase">
                CANONICAL COMPENDIUMS
              </div>
            </div>
          </div>

          <div className="flex flex-1 cursor-pointer items-center gap-4 border-r border-white/5 p-4 transition-colors hover:bg-white/5">
            <div className="flex h-8 w-8 items-center justify-center rounded border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
              <Cross className="h-4 w-4" />
            </div>
            <div>
              <div className="mb-1 font-mono text-lg leading-none font-bold text-white">
                12
              </div>
              <div className="max-w-[80px] text-[7px] tracking-widest text-[#8F9FB3] uppercase">
                APOSTLES TRADITIONS
              </div>
            </div>
          </div>

          <div className="flex flex-1 cursor-pointer items-center gap-4 p-4 transition-colors hover:bg-white/5">
            <div className="flex h-8 w-8 items-center justify-center rounded border border-[#00aaff]/20 bg-[#00aaff]/10 text-[#00aaff]">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <div className="mb-1 text-[7px] font-bold tracking-widest text-[#8F9FB3] uppercase">
                QURAN REFERENCES
              </div>
              <div className="mb-1 font-mono text-lg leading-none font-bold text-white">
                2,381
              </div>
              <div className="text-[7px] tracking-widest text-[#00aaff] uppercase">
                VERSES LINKED
              </div>
            </div>
          </div>
        </div>

        {/* ═══ MAIN THREE COLUMNS ═══ */}
        <div className="grid min-h-[550px] flex-1 grid-cols-1 gap-4 lg:grid-cols-12">
          {/* ◄ LEFT: FILTERS & COMPENDIUMS (Col 1-2) */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <div className="rounded-xl border border-white/5 bg-[#040C1A] p-4">
              <div className="mb-4 text-[9px] font-bold tracking-widest text-white uppercase">
                BROWSE & FILTER
              </div>
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[#8F9FB3]" />
                  <input
                    type="text"
                    placeholder="Search hadith, keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded border border-white/10 bg-[#020813] px-8 py-2 text-[10px] text-white outline-none placeholder:text-[#8F9FB3] focus:border-blue-500/50"
                  />
                </div>
                {[
                  { l: "Topic / Theme", v: "All Topics" },
                  { l: "Compendium", v: "All Compendiums" },
                  { l: "Grade / Status", v: "All Grades" },
                  { l: "Quran Reference", v: "All References" },
                  { l: "Language", v: "All Languages" },
                ].map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-2 border-b border-white/5 pb-2"
                  >
                    <span className="text-[9px] text-[#8F9FB3]">{f.l}</span>
                    <select className="cursor-pointer bg-transparent text-right text-[9px] text-white hover:text-blue-400 focus:outline-none">
                      <option>{f.v}</option>
                    </select>
                  </div>
                ))}
                <div className="flex gap-2 pt-2">
                  <button className="flex-1 rounded bg-white/5 py-2 text-[9px] font-bold tracking-widest text-[#8F9FB3] transition-colors hover:bg-white/10">
                    RESET
                  </button>
                  <button className="flex flex-[1.5] items-center justify-center gap-2 rounded bg-blue-600 py-2 text-[9px] font-bold tracking-widest text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all hover:bg-blue-500">
                    SEARCH <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col rounded-xl border border-white/5 bg-[#040C1A] p-4">
              <div className="mb-4 text-[9px] font-bold tracking-widest text-blue-400 uppercase">
                14 CANONICAL COMPENDIUMS
              </div>
              <div className="custom-scrollbar flex-1 space-y-1.5 overflow-y-auto pr-2">
                {compendiums.map((x, i) => (
                  <div
                    key={i}
                    className="group flex cursor-pointer items-center justify-between rounded px-1 py-1 transition-colors hover:bg-white/5"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${x.c} shadow-[0_0_5px_currentColor]`}
                      />
                      <span className="text-[9px] text-[#8F9FB3] transition-colors group-hover:text-white">
                        {x.n}
                      </span>
                    </div>
                    <span className="font-mono text-[9px] text-[#8F9FB3]">
                      {x.v}
                    </span>
                  </div>
                ))}
              </div>
              <button className="mt-3 w-full rounded border border-white/10 py-1.5 text-[8px] font-bold tracking-widest text-[#8F9FB3] uppercase transition-colors hover:text-white">
                VIEW ALL COMPENDIUMS
              </button>
            </div>
          </div>

          {/* ■ CENTER: HADITH GRID (Col 3-9) */}
          <div className="flex flex-col gap-4 lg:col-span-7">
            {/* Tabs */}
            <div className="flex border-b border-white/10">
              <button className="border-b-2 border-blue-500 bg-blue-500/5 px-6 py-2.5 text-[9px] font-bold tracking-widest text-blue-400">
                HADITH BROWSER
              </button>
              <button className="border-b-2 border-transparent px-6 py-2.5 text-[9px] font-bold tracking-widest text-[#8F9FB3] transition-colors hover:bg-white/5 hover:text-white">
                ORAL TRADITIONS
              </button>
              <button className="border-b-2 border-transparent px-6 py-2.5 text-[9px] font-bold tracking-widest text-[#8F9FB3] transition-colors hover:bg-white/5 hover:text-white">
                QURANIC CONNECTIONS
              </button>
            </div>

            {/* Sub-header */}
            <div className="flex items-center justify-between">
              <div className="text-[10px] text-[#8F9FB3]">
                Showing{" "}
                <span className="text-white">
                  {(currentPage - 1) * 20 + 1} -{" "}
                  {Math.min(currentPage * 20, totalHadiths)}
                </span>{" "}
                of{" "}
                <span className="font-mono text-white">
                  {totalHadiths.toLocaleString()}
                </span>{" "}
                Hadiths
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-[9px] text-[#8F9FB3]">
                  Sort by:
                  <select className="rounded border border-white/10 bg-[#020813] px-2 py-1 text-white focus:outline-none">
                    <option>Relevance</option>
                  </select>
                </div>
                <div className="flex gap-0.5 rounded border border-white/10 bg-[#020813] p-0.5">
                  <button className="rounded bg-blue-500/20 px-2 py-1 text-blue-400">
                    <LayoutGrid className="h-3.5 w-3.5" />
                  </button>
                  <button className="rounded px-2 py-1 text-[#8F9FB3] transition-colors hover:text-white">
                    <List className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Grid of Hadiths */}
            <div className="grid flex-1 grid-cols-1 content-start gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredData.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveId(item.id)}
                  className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border bg-[#040C1A] p-3.5 transition-all ${activeId === item.id ? "z-10 border-blue-500/50 bg-blue-500/5 shadow-[0_0_15px_rgba(59,130,246,0.15)]" : "border-white/5 hover:translate-y-[-2px] hover:border-white/20 hover:bg-white/5"}`}
                >
                  <div className="mb-4 flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full border border-white/10 bg-white/5 font-mono text-[8px] font-bold text-white">
                        {item.id}
                      </div>
                      <span
                        className={`rounded border px-1.5 py-0.5 text-[7px] font-bold tracking-widest border-${item.color}-500/30 text-${item.color}-400 bg-${item.color}-500/10`}
                      >
                        {item.grade}
                      </span>
                    </div>
                    <Bookmark
                      className={`h-3.5 w-3.5 ${activeId === item.id ? "text-amber-400" : "text-white/20 hover:text-white/60"}`}
                    />
                  </div>

                  <div className="font-arabic mb-4 flex h-[60px] items-center justify-center overflow-hidden text-center text-xl leading-relaxed text-amber-500/90 drop-shadow-[0_0_8px_rgba(245,158,11,0.2)]">
                    <span className="line-clamp-2">{item.arabic}</span>
                  </div>

                  <div className="mb-4 h-[45px] overflow-hidden text-center text-[9px] leading-relaxed text-white/90 italic">
                    <span className="line-clamp-3">{item.translation}</span>
                  </div>

                  <div className="mt-auto space-y-1.5 border-t border-white/5 pt-3 uppercase">
                    <div className="font-mono text-[8px] tracking-widest text-[#8F9FB3]">
                      {item.ref}
                    </div>
                    <div className="text-[8px] text-[#8F9FB3]">
                      Topic: <span className="text-white/80">{item.topic}</span>
                    </div>
                    <div className="text-[8px] text-[#8F9FB3]">
                      Quran Ref:{" "}
                      <span className="cursor-pointer text-blue-400 hover:underline">
                        {item.quran}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2">
                    <button className="text-[#8F9FB3] transition-colors hover:text-amber-400">
                      <Bookmark className="h-3 w-3" />
                    </button>
                    <button className="text-[#8F9FB3] transition-colors hover:text-blue-400">
                      <Link className="h-3 w-3" />
                    </button>
                    <button className="text-[#8F9FB3] transition-colors hover:text-emerald-400">
                      <Quote className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-2 flex items-center justify-between rounded-xl border border-white/10 bg-[#040C1A] p-2.5">
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex h-7 w-7 items-center justify-center rounded border border-white/10 text-[#8F9FB3] hover:bg-white/5 hover:text-white disabled:opacity-50"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button className="h-7 w-7 rounded border border-blue-500/30 bg-blue-500/20 font-mono text-[10px] font-bold text-blue-400">
                  {currentPage}
                </button>
                {currentPage < totalPages && (
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded border border-white/10 font-mono text-[10px] text-[#8F9FB3] hover:bg-white/5 hover:text-white"
                  >
                    {currentPage + 1}
                  </button>
                )}
                {currentPage + 1 < totalPages && (
                  <button
                    onClick={() => setCurrentPage(currentPage + 2)}
                    className="flex h-7 w-7 items-center justify-center rounded border border-white/10 font-mono text-[10px] text-[#8F9FB3] hover:bg-white/5 hover:text-white"
                  >
                    {currentPage + 2}
                  </button>
                )}
                {currentPage + 2 < totalPages && (
                  <span className="flex h-7 w-7 items-center justify-center text-[#8F9FB3]">
                    ...
                  </span>
                )}
                {currentPage + 2 < totalPages && (
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="flex h-7 w-auto items-center justify-center rounded border border-white/10 px-2 font-mono text-[10px] text-[#8F9FB3] hover:bg-white/5 hover:text-white"
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
              </div>
              <div className="flex items-center gap-2 text-[9px] text-[#8F9FB3]">
                Show:
                <select className="rounded border border-white/10 bg-transparent px-2 py-1 focus:outline-none">
                  <option>20</option>
                </select>
                per page
              </div>
            </div>
          </div>

          {/* ► RIGHT: DETAIL PANEL (Col 10-12) */}
          <div className="flex flex-col gap-4 lg:col-span-3">
            {/* Insight Panel */}
            <div className="relative flex h-[300px] flex-col overflow-hidden rounded-xl border border-white/5 bg-[#040C1A] p-5">
              <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-blue-500/5 blur-[80px]" />

              <div className="relative z-10 mb-4 shrink-0 border-b border-white/10 pb-3 text-[9px] font-bold tracking-widest text-blue-400 uppercase">
                QUICK HADITH INSIGHT
              </div>

              {activeItem ? (
                <>
                  <div className="custom-scrollbar relative z-10 mb-4 flex flex-1 flex-col justify-center overflow-y-auto pr-2 text-center">
                    <div className="font-arabic mb-3 text-2xl leading-relaxed text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                      {activeItem.arabic}
                    </div>
                    <div className="text-sm text-white italic">
                      "{activeItem.translation}"
                    </div>
                  </div>

                  <div className="mt-auto flex shrink-0 flex-col items-center justify-center gap-2 border-t border-white/10 pt-3 font-mono text-[8px] text-[#8F9FB3] uppercase">
                    <span
                      className={`rounded border px-2 py-1 border-${activeItem.color}-500/30 text-${activeItem.color}-400 bg-${activeItem.color}-500/10 font-sans font-bold tracking-widest`}
                    >
                      {activeItem.grade}
                    </span>
                    {activeItem.ref}
                  </div>
                </>
              ) : (
                <div className="flex flex-1 items-center justify-center text-[9px] tracking-widest text-[#8F9FB3] uppercase">
                  Select a hadith to view insight
                </div>
              )}
            </div>

            {/* Quranic Reference */}
            <div className="flex flex-1 flex-col rounded-xl border border-white/5 bg-[#040C1A] p-5">
              <div className="mb-4 border-b border-white/10 pb-3 text-[9px] font-bold tracking-widest text-[#00aaff] uppercase">
                QURANIC REFERENCE
              </div>

              <div className="flex flex-1 flex-col justify-center">
                <div className="font-arabic mb-3 text-center text-xl leading-loose text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">
                  إِنَّمَا يُوَفَّى الصَّابِرُونَ أَجْرَهُم بِغَيْرِ حِسَابٍ
                </div>
                <div className="mb-3 text-center font-mono text-[9px] text-[#8F9FB3] uppercase">
                  Innama yuwaffa as-sabiruna ajrahum bi-ghayri hisabin
                </div>
                <div className="mb-4 text-center text-[10px] text-white/80 italic">
                  "Indeed, the patient will be given their reward without
                  account."
                </div>
                <div className="mb-4 text-center text-[9px] font-bold tracking-widest text-[#00aaff]">
                  (Az-Zumar: 10)
                </div>
              </div>

              <button className="w-full rounded border border-[#00aaff]/30 bg-[#00aaff]/10 py-2 text-[9px] font-bold tracking-widest text-[#00aaff] transition-colors hover:bg-[#00aaff]/20">
                VIEW VERSE CONTEXT
              </button>
            </div>

            {/* Related Themes */}
            <div className="rounded-xl border border-white/5 bg-[#040C1A] p-5">
              <div className="mb-3 text-[8px] font-bold tracking-widest text-[#8F9FB3] uppercase">
                RELATED THEMES
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "Sincerity",
                  "Intention",
                  "Worship",
                  "Ikhlas",
                  "Actions",
                  "Accountability",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="cursor-pointer rounded border border-white/10 bg-white/5 px-2.5 py-1.5 text-[9px] tracking-widest text-[#8F9FB3] transition-colors hover:border-blue-500/50 hover:text-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Apostles Oral Traditions */}
            <div className="rounded-xl border border-white/5 bg-[#040C1A] p-5">
              <div className="mb-3 border-b border-white/10 pb-3 text-[9px] font-bold tracking-widest text-indigo-400 uppercase">
                APOSTLES ORAL TRADITIONS
              </div>
              <div className="mb-4 space-y-2.5">
                <div className="flex items-center justify-between text-[9px]">
                  <div className="flex items-center gap-2 text-white">
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />{" "}
                    Torah (Mishna)
                  </div>
                  <div className="font-mono text-[#8F9FB3]">156 Traditions</div>
                </div>
                <div className="flex items-center justify-between text-[9px]">
                  <div className="flex items-center gap-2 text-white">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{" "}
                    Psalms (Tasbih)
                  </div>
                  <div className="font-mono text-[#8F9FB3]">98 Traditions</div>
                </div>
                <div className="flex items-center justify-between text-[9px]">
                  <div className="flex items-center gap-2 text-white">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />{" "}
                    Gospel (Didache)
                  </div>
                  <div className="font-mono text-[#8F9FB3]">72 Traditions</div>
                </div>
              </div>
              <button className="w-full rounded border border-white/10 py-1.5 text-[8px] font-bold tracking-widest text-[#8F9FB3] transition-colors hover:text-white">
                EXPLORE ALL TRADITIONS
              </button>
            </div>
          </div>
        </div>

        {/* ═══ BOTTOM ROW GRID (12 Cols) ═══ */}
        <div className="mt-2 grid shrink-0 grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Hadith Quality Distribution */}
          <div className="flex flex-col rounded-xl border border-white/5 bg-[#040C1A] p-4 lg:col-span-3">
            <div className="mb-4 border-b border-white/10 pb-3 text-[9px] font-bold tracking-widest text-white uppercase">
              HADITH QUALITY DISTRIBUTION
            </div>
            <div className="flex flex-1 items-center gap-4">
              <div
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                style={{
                  background:
                    "conic-gradient(from 0deg, #10b981 0% 45%, #3b82f6 45% 100%)",
                }}
              >
                <div className="h-14 w-14 rounded-full bg-[#040C1A]" />
              </div>
              <div className="flex-1 space-y-2 text-[8px] tracking-widest">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{" "}
                    <span className="text-white/90">Sahih (Authentic)</span>
                  </div>
                  <span className="font-mono text-[#8F9FB3]">44.66%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />{" "}
                    <span className="text-white/90">Hasan (Good)</span>
                  </div>
                  <span className="font-mono text-[#8F9FB3]">55.33%</span>
                </div>
                <div className="flex items-center justify-between opacity-30">
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />{" "}
                    <span className="text-white/90">Da'if (Weak)</span>
                  </div>
                  <span className="font-mono text-[#8F9FB3]">0%</span>
                </div>
                <div className="flex items-center justify-between opacity-30">
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500" />{" "}
                    <span className="text-white/90">Mawdhu' (Fabricated)</span>
                  </div>
                  <span className="font-mono text-[#8F9FB3]">0%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Hadith Topics */}
          <div className="flex flex-col rounded-xl border border-white/5 bg-[#040C1A] p-4 lg:col-span-3">
            <div className="mb-4 border-b border-white/10 pb-3 text-[9px] font-bold tracking-widest text-blue-400 uppercase">
              TOP HADITH TOPICS
            </div>
            <div className="flex-1 space-y-2 text-[9px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-white">
                  <ShieldCheck className="h-3 w-3 text-emerald-500" /> Faith &
                  Belief
                </div>
                <span className="font-mono text-[#8F9FB3]">24,681</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-white">
                  <Star className="h-3 w-3 text-amber-500" /> Worship & Prayer
                </div>
                <span className="font-mono text-[#8F9FB3]">18,742</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-white">
                  <CheckCircle2 className="h-3 w-3 text-blue-500" /> Character &
                  Morality
                </div>
                <span className="font-mono text-[#8F9FB3]">22,915</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-white">
                  <BookOpen className="h-3 w-3 text-purple-400" /> Knowledge &
                  Education
                </div>
                <span className="font-mono text-[#8F9FB3]">15,338</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-white">
                  <Globe className="h-3 w-3 text-[#00aaff]" /> Social Relations
                </div>
                <span className="font-mono text-[#8F9FB3]">28,441</span>
              </div>
            </div>
            <button className="mt-2 w-full border-t border-white/10 py-1 pt-2 text-[8px] font-bold tracking-widest text-[#8F9FB3] transition-colors hover:text-white">
              VIEW ALL TOPICS
            </button>
          </div>

          {/* Hadith Timeline & Stats */}
          <div className="flex flex-col rounded-xl border border-white/5 bg-[#040C1A] p-4 lg:col-span-3">
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
              <div className="text-[9px] font-bold tracking-widest text-white uppercase">
                HADITH TIMELINE
              </div>
              <div className="text-[9px] font-bold tracking-widest text-blue-400 uppercase">
                STATISTICS
              </div>
            </div>
            <div className="flex flex-1">
              {/* Timeline */}
              <div className="relative flex flex-1 justify-between border-r border-white/10 pr-4">
                <div className="absolute top-2 right-2 left-2 h-px bg-white/10" />
                {[
                  { y: "610", t: "Revelation Period" },
                  { y: "622", t: "Hijrah (Madinah)" },
                  { y: "632", t: "Passing of Prophet ؐ" },
                  { y: "650+", t: "Compilation Begins" },
                ].map((step, i) => (
                  <div
                    key={i}
                    className="relative z-10 flex w-12 flex-col items-center gap-1"
                  >
                    <div className="mb-1 h-3 w-3 rounded-full border-2 border-blue-500 bg-[#040C1A]" />
                    <span className="font-mono text-[10px] font-bold text-white">
                      {step.y}
                    </span>
                    <span className="text-center text-[7px] leading-tight text-[#8F9FB3]">
                      {step.t}
                    </span>
                  </div>
                ))}
              </div>
              {/* Stats Mini */}
              <div className="grid flex-1 grid-cols-2 gap-x-2 gap-y-3 pl-4">
                <div>
                  <Database className="mb-1 h-3.5 w-3.5 text-blue-500" />
                  <div className="font-mono text-[10px] font-bold text-white">
                    30,800
                  </div>
                  <div className="text-[7px] tracking-widest text-[#8F9FB3] uppercase">
                    Total Hadiths
                  </div>
                </div>
                <div>
                  <Link className="mb-1 h-3.5 w-3.5 text-[#00aaff]" />
                  <div className="font-mono text-[10px] font-bold text-white">
                    2,381
                  </div>
                  <div className="text-[7px] tracking-widest text-[#8F9FB3] uppercase">
                    Quran Links
                  </div>
                </div>
                <div>
                  <Layers className="mb-1 h-3.5 w-3.5 text-purple-400" />
                  <div className="font-mono text-[10px] font-bold text-white">
                    65,432
                  </div>
                  <div className="text-[7px] tracking-widest text-[#8F9FB3] uppercase">
                    Unique Chains
                  </div>
                </div>
                <div>
                  <Book className="mb-1 h-3.5 w-3.5 text-amber-500" />
                  <div className="font-mono text-[10px] font-bold text-white">
                    14
                  </div>
                  <div className="text-[7px] tracking-widest text-[#8F9FB3] uppercase">
                    Compendiums
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2 text-[8px] font-bold tracking-widest text-[#8F9FB3]">
              <button className="hover:text-white">
                VIEW INTERACTIVE TIMELINE
              </button>
              <button className="hover:text-white">VIEW FULL STATISTICS</button>
            </div>
          </div>

          {/* Learning Path */}
          <div className="group relative flex flex-col overflow-hidden rounded-xl border border-white/5 bg-[#040C1A] p-4 lg:col-span-3">
            <div className="pointer-events-none absolute top-1/2 right-0 h-48 w-48 -translate-y-1/2 opacity-10 mix-blend-screen transition-all duration-700 group-hover:scale-110 group-hover:opacity-30">
              <img
                src="/assets/sacred_geometry.png"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="relative z-10 mb-4 border-b border-white/10 pb-3 text-[9px] font-bold tracking-widest text-emerald-500 uppercase">
              LEARNING PATH
            </div>
            <div className="relative z-10 flex-1 space-y-3">
              <div>
                <div className="mb-1 flex justify-between text-[9px]">
                  <span className="text-[#8F9FB3]">
                    Beginner:{" "}
                    <span className="text-white">Essential 40 Hadith</span>
                  </span>
                  <span className="font-mono text-[#8F9FB3]">40/40</span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-full bg-emerald-500" />
                </div>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-[9px]">
                  <span className="text-[#8F9FB3]">
                    Intermediate:{" "}
                    <span className="text-white">Thematic Study</span>
                  </span>
                  <span className="font-mono text-[#8F9FB3]">12/30</span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[40%] bg-blue-500" />
                </div>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-[9px]">
                  <span className="text-[#8F9FB3]">
                    Advanced: <span className="text-white">Chain Analysis</span>
                  </span>
                  <span className="font-mono text-[#8F9FB3]">5/20</span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[25%] bg-purple-500" />
                </div>
              </div>
            </div>
            <button className="relative z-10 mt-3 w-full border-t border-white/10 py-1.5 pt-2 text-right text-[8px] font-bold tracking-widest text-[#8F9FB3] transition-colors hover:text-white">
              CONTINUE LEARNING
            </button>
          </div>
        </div>

        {/* ═══ FOOTER ═══ */}
        <div className="flex shrink-0 items-center justify-between px-2 pt-2 text-[7px] tracking-widest text-[#8F9FB3] uppercase">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500" /> CONNECTED
              TO DIVINE KNOWLEDGE NETWORK
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
