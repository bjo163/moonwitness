"use client"

import { useState, useEffect, Suspense } from "react"
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  CheckCircle2,
  PlayCircle,
  Pause,
  Settings2,
  Info,
  Search,
  Bookmark,
  Share2,
} from "lucide-react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { useGlobalAudio } from "@core/contexts/audio-context"
import { useMoonStore } from "@core/store/moon-store"

function ReaderContent({ id }: { id: string }) {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [openTafsirId, setOpenTafsirId] = useState<number | null>(null)
  const [isTajweedOn, setIsTajweedOn] = useState(false)
  const [isTransliterationOn, setIsTransliterationOn] = useState(true)
  const audio = useGlobalAudio()

  const searchParams = useSearchParams()
  const router = useRouter()
  const currentBook = searchParams.get("book") || "1"
  const currentChapterStr = searchParams.get("chapter") || "1"

  const { client: moonClient, user } = useMoonStore()

  useEffect(() => {
    setIsLoading(true)
    fetch(
      `/api/scriptures/${id}/read?book=${currentBook}&chapter=${currentChapterStr}`
    )
      .then((res) => res.json())
      .then((json) => {
        setData(json.data)
        setIsLoading(false)
        window.scrollTo(0, 0)

        // Auto-save history if logged in
        if (user && json.data.book?.id) {
          moonClient
            .model("wx.history")
            .create({
              userId: user.id,
              bookId: json.data.book.id,
            })
            .catch(console.error)
        }
      })
      .catch((err) => {
        console.error(err)
        setIsLoading(false)
      })
  }, [id, currentBook, currentChapterStr, user, moonClient])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-[#040914] text-white/50">
        <BookOpen className="h-8 w-8 animate-pulse text-blue-500/50" />
        <div className="text-xs font-bold tracking-widest uppercase">
          Unlocking Divine Codex...
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-[#040914] text-white">
        <p>Error loading scripture.</p>
        <button
          onClick={() => router.back()}
          className="rounded bg-white/10 px-4 py-2"
        >
          Go Back
        </button>
      </div>
    )
  }

  const {
    scripture_name,
    scripture_arabic,
    scripture_tag,
    scripture_desc,
    stats,
    left_sidebar,
    right_sidebar,
    bottom_panels,
    book,
    verses,
    current_chapter,
  } = data

  const totalChapters = book.chapters_count || 1
  const currentChNum = parseInt(current_chapter) || 1

  const navigateToChapter = (ch: number) => {
    if (ch >= 1 && ch <= totalChapters) {
      router.push(`?book=${currentBook}&chapter=${ch}`)
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#040914] font-sans text-white">
      {/* 1. TOP HEADER SECTION */}
      <div className="sticky top-0 z-50 border-b border-white/10 bg-[#040914]/80 backdrop-blur-xl">
        {/* Master Header */}
        <div className="flex flex-col items-start justify-between gap-4 px-6 py-4 md:flex-row md:items-center">
          <div className="max-w-2xl flex-1">
            <div className="mb-2 flex items-center gap-4">
              <h1 className="text-3xl font-black tracking-tight md:text-4xl">
                {scripture_name}
              </h1>
              {scripture_arabic && (
                <span className="font-serif text-2xl text-amber-500">
                  {scripture_arabic}
                </span>
              )}
              <span className="rounded border border-teal-500/30 bg-teal-500/10 px-2 py-1 text-[9px] font-bold tracking-widest text-teal-400">
                {scripture_tag}
              </span>
            </div>
            <p className="text-sm text-white/60">{scripture_desc}</p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-white/50">
            {stats &&
              Object.entries(stats).map(([key, value]) => (
                <div key={key} className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold tracking-widest uppercase">
                    {key}
                  </span>
                  <span className="text-sm font-bold text-white">
                    {value as React.ReactNode}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* 2. MAIN 3-COLUMN DASHBOARD */}
      <div className="mx-auto grid max-w-[1920px] grid-cols-1 gap-4 px-6 py-4 md:grid-cols-12">
        {/* LEFT SIDEBAR: NAVIGATION */}
        <div className="space-y-6 md:col-span-3 lg:col-span-2">
          <div className="rounded-xl border border-white/5 bg-[#0A1224] p-4">
            <h3 className="mb-4 text-[10px] font-black tracking-widest text-white/40 uppercase">
              {left_sidebar.title}
            </h3>

            <div className="relative mb-4">
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-white/30" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-lg border border-white/10 bg-black/40 py-2 pr-3 pl-9 text-xs focus:border-blue-500/50 focus:outline-none"
              />
            </div>

            <div className="custom-scrollbar max-h-[500px] space-y-1 overflow-y-auto pr-2">
              {left_sidebar.items.map((item: any) => {
                const isActive =
                  item.book_number.toString() === currentBook.toString()
                return (
                  <button
                    key={item.id}
                    onClick={() =>
                      router.push(`?book=${item.book_number}&chapter=1`)
                    }
                    className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors ${
                      isActive
                        ? "border-blue-500/30 bg-blue-500/10"
                        : "border-transparent bg-transparent hover:border-white/10 hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold ${isActive ? "bg-blue-500/20 text-blue-400" : "bg-white/5 text-white/40"}`}
                      >
                        {item.book_number}
                      </div>
                      <div className="flex flex-col">
                        <span
                          className={`text-xs font-bold ${isActive ? "text-blue-400" : "text-white/80"}`}
                        >
                          {item.name}
                        </span>
                        <span className="text-[9px] text-white/40">
                          {item.subname}
                        </span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* CENTER AREA: READER CANVAS */}
        <div className="flex flex-col gap-6 md:col-span-6 lg:col-span-7">
          {/* Tabs */}
          <div className="custom-scrollbar flex items-center gap-1 overflow-x-auto border-b border-white/10 pb-px">
            {[
              "OVERVIEW",
              "READ & EXPLORE",
              "THEMES & TOPICS",
              "INSIGHTS",
              "CONTEXT",
            ].map((tab, i) => (
              <button
                key={tab}
                className={`border-b-2 px-4 py-3 text-[10px] font-black tracking-widest whitespace-nowrap uppercase transition-colors ${i === 1 ? "border-blue-500 text-blue-400" : "border-transparent text-white/40 hover:text-white/80"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative overflow-hidden rounded-xl border border-white/5 bg-[#0A1224] p-5 md:p-6">
            {/* Header Content */}
            <div className="mb-6 flex flex-col items-start justify-between gap-3 border-b border-white/10 pb-4 md:flex-row md:items-center">
              <div>
                <span className="mb-2 inline-block rounded bg-white/5 px-2 py-1 text-[10px] font-bold tracking-widest text-amber-500 uppercase">
                  BOOK {currentBook}
                </span>
                <h2 className="flex items-center gap-3 text-2xl font-black">
                  {book.name}{" "}
                  <span className="font-serif text-amber-500/80">
                    {book.original_name}
                  </span>
                </h2>
                <div className="mt-2 flex items-center gap-4 text-xs font-bold text-white/40">
                  <span>{book.summary}</span>
                  {book.meaning && (
                    <>
                      <span className="text-white/20">•</span>
                      <span className="text-amber-500/80">
                        Arti: {book.meaning}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {book.audio_url && (
                  <button
                    onClick={() => {
                      const a = audio as any
                      if (
                        a.isPlaying &&
                        a.currentTrack?.url === book.audio_url
                      ) {
                        a.pause?.() || a.togglePlay?.()
                      } else {
                        a.play({
                          url: book.audio_url,
                          name: book.name,
                          number: currentChNum,
                        })
                      }
                    }}
                    className={`flex items-center gap-2 px-4 py-2 ${(audio as any).isPlaying && (audio as any).currentTrack?.url === book.audio_url ? "border-blue-500/50 bg-blue-500/20 text-blue-400" : "border-white/10 bg-white/5 text-white hover:bg-white/10"} rounded-lg border text-xs font-bold transition-colors`}
                  >
                    {(audio as any).isPlaying &&
                    (audio as any).currentTrack?.url === book.audio_url ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <PlayCircle className="h-4 w-4" />
                    )}
                    {(audio as any).isPlaying &&
                    (audio as any).currentTrack?.url === book.audio_url
                      ? "Playing..."
                      : "Listen Audio"}
                  </button>
                )}
                <button
                  onClick={() => {
                    if (!user) return alert("Please login to save bookmarks")
                    moonClient
                      .model("wx.bookmark")
                      .create({
                        userId: user.id,
                        bookId: book.id,
                      })
                      .then(() => alert("Bookmark saved!"))
                      .catch((err) =>
                        alert("Failed to save bookmark: " + err.message)
                      )
                  }}
                  className="group relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-colors hover:bg-white/10 hover:text-blue-400"
                >
                  <Bookmark className="h-4 w-4 text-white/60 transition-colors group-hover:text-blue-400" />
                </button>
              </div>
            </div>

            {/* Verses Column Layout */}
            <div className="space-y-6">
              {/* Header Row */}
              <div className="grid grid-cols-12 gap-4 border-b border-white/5 pb-2 text-[9px] font-black tracking-widest text-white/30 uppercase">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-5 pl-2">
                  Transliteration & Translation
                </div>
                <div className="col-span-6 pr-2 text-right">Original Text</div>
              </div>

              {verses.map((verse: any) => {
                const isRtl =
                  verse.text_original &&
                  (/[\u0590-\u05FF]/.test(verse.text_original) ||
                    /[\u0600-\u06FF]/.test(verse.text_original))
                return (
                  <div
                    key={verse.id}
                    className="group grid grid-cols-12 items-start gap-4"
                  >
                    <div className="col-span-1 flex justify-center pt-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[10px] font-bold text-white/50 transition-colors group-hover:border-blue-500/30">
                        {verse.verse_number}
                      </div>
                    </div>

                    <div className="col-span-5 space-y-2 pt-1 pl-2">
                      {isTransliterationOn && verse.text_transliteration && (
                        <p className="font-mono text-xs text-blue-300/70">
                          {verse.text_transliteration}
                        </p>
                      )}
                      <p className="font-serif text-sm leading-relaxed text-white/90">
                        {verse.text_translated}
                      </p>
                    </div>

                    <div className="col-span-6 pt-1 pr-2 text-right">
                      {isTajweedOn &&
                      verse.text_tajweed &&
                      verse.text_tajweed !== verse.text_original ? (
                        <div
                          className="tajweed-container font-serif text-2xl leading-[2.5] text-amber-400/90"
                          dir={isRtl ? "rtl" : "ltr"}
                          dangerouslySetInnerHTML={{
                            __html: verse.text_tajweed,
                          }}
                        />
                      ) : (
                        <p
                          className="font-serif text-2xl leading-[2.5] text-amber-400/90"
                          dir={isRtl ? "rtl" : "ltr"}
                        >
                          {verse.text_original}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Bottom Toolbar & Pagination */}
            <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-6">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setIsTransliterationOn(!isTransliterationOn)}
                  className={`rounded border px-3 py-1.5 text-[10px] font-bold transition-colors ${isTransliterationOn ? "border-blue-500/30 bg-blue-500/20 text-blue-400" : "border-white/10 bg-black/40 text-white/60"}`}
                >
                  Transliteration: {isTransliterationOn ? "ON" : "OFF"}
                </button>
                {verses.some(
                  (v: any) =>
                    v.text_tajweed && v.text_tajweed !== v.text_original
                ) && (
                  <button
                    onClick={() => setIsTajweedOn(!isTajweedOn)}
                    className={`rounded border px-3 py-1.5 text-[10px] font-bold transition-colors ${isTajweedOn ? "border-amber-500/30 bg-amber-500/20 text-amber-400" : "border-white/10 bg-black/40 text-white/60"}`}
                  >
                    Tajweed Colors: {isTajweedOn ? "ON" : "OFF"}
                  </button>
                )}
                <button className="rounded border border-white/10 bg-black/40 px-3 py-1.5 text-[10px] font-bold text-white/60">
                  Tafsir: ON
                </button>
              </div>

              {totalChapters > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigateToChapter(currentChNum - 1)}
                    disabled={currentChNum <= 1}
                    className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-bold hover:bg-white/10 disabled:opacity-30"
                  >
                    Prev
                  </button>
                  <span className="px-2 text-xs font-bold text-amber-500">
                    Ch. {currentChNum} / {totalChapters}
                  </span>
                  <button
                    onClick={() => navigateToChapter(currentChNum + 1)}
                    disabled={currentChNum >= totalChapters}
                    className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-bold hover:bg-white/10 disabled:opacity-30"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR: INSIGHTS & FACTS */}
        <div className="space-y-6 md:col-span-3 lg:col-span-3">
          <div className="rounded-xl border border-white/10 bg-transparent p-5">
            <h3 className="mb-4 text-[10px] font-black tracking-widest text-blue-400 uppercase">
              QUICK FACTS
            </h3>
            <div className="space-y-3">
              {right_sidebar.quick_facts?.map((f: any, i: number) => (
                <div
                  key={i}
                  className="flex items-start justify-between border-b border-white/5 pb-2 text-xs"
                >
                  <span className="text-white/40">{f.label}</span>
                  <span className="w-1/2 text-right font-medium text-white/90">
                    {f.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-blue-500/20 bg-blue-900/10 p-5">
            <h3 className="mb-4 flex items-center gap-2 text-[10px] font-black tracking-widest text-blue-400 uppercase">
              <Info className="h-3 w-3" /> INSIGHTS
            </h3>
            <div className="space-y-4">
              {right_sidebar.insights?.map((f: any, i: number) => (
                <div key={i}>
                  <span className="mb-1 block text-[10px] font-bold text-amber-500">
                    {f.label}
                  </span>
                  <span className="text-xs leading-relaxed text-white/70">
                    {f.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM PANELS (EXTRA FEATURES) */}
      <div className="border-t border-white/10 bg-black/40 px-6 py-5">
        <div className="mx-auto grid max-w-[1920px] grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <h4 className="mb-4 text-[10px] font-black tracking-widest text-white/50 uppercase">
              THEMES & TOPICS
            </h4>
            <div className="flex flex-wrap gap-2">
              {bottom_panels.themes?.map((t: string, i: number) => (
                <span
                  key={i}
                  className="cursor-pointer rounded border border-white/10 bg-white/5 px-2 py-1 text-[9px] font-bold text-white/60 transition-colors hover:border-blue-500/50 hover:text-white"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-[10px] font-black tracking-widest text-white/50 uppercase">
              RELATED VERSES
            </h4>
            <div className="space-y-2">
              {bottom_panels.related?.map((r: any, i: number) => (
                <div key={i} className="text-xs">
                  <span className="mr-2 font-bold text-blue-400">{r.ref}</span>
                  <span className="text-white/50">{r.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-[10px] font-black tracking-widest text-white/50 uppercase">
              TAFSIR HIGHLIGHT
            </h4>
            <p className="border-l-2 border-amber-500 pl-3 text-xs leading-relaxed text-white/60 italic">
              "{bottom_panels.tafsir_highlight?.text}"
              <span className="mt-2 block font-bold text-white/40 not-italic">
                — {bottom_panels.tafsir_highlight?.author}
              </span>
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-[10px] font-black tracking-widest text-white/50 uppercase">
              FEATURES
            </h4>
            <ul className="space-y-2 text-xs text-white/60">
              {bottom_panels.science?.map((s: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-3 w-3 text-teal-500" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export function UniversalReaderView({ id }: { id: string }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#040914] p-8 text-white">
          Loading Reader...
        </div>
      }
    >
      <ReaderContent id={id} />
    </Suspense>
  )
}
