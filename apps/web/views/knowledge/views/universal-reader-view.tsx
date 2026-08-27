"use client"

import React, { useState, useEffect, Suspense } from "react"
import { BookOpen } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { useGlobalAudio } from "@workspace/state"
import { moonClientInstance, useAuthSession } from "@moon/client"
import { ReaderTopHeader } from "../components/reader/reader-top-header"
import { ReaderNavSidebar } from "../components/reader/reader-nav-sidebar"
import { ReaderVersesGrid } from "../components/reader/reader-verses-grid"
import { ReaderInsightsSidebar } from "../components/reader/reader-insights-sidebar"
import { ReaderBottomPanels } from "../components/reader/reader-bottom-panels"

function ReaderContent({ id }: { id: string }) {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const audio = useGlobalAudio()

  const searchParams = useSearchParams()
  const router = useRouter()
  const currentBook = searchParams.get("book") || "1"
  const currentChapterStr = searchParams.get("chapter") || "1"

  const moonClient = moonClientInstance
  const { user } = useAuthSession()

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

  const handleNavigateChapter = (ch: number) => {
    if (ch >= 1 && ch <= totalChapters) {
      router.push(`?book=${currentBook}&chapter=${ch}`)
    }
  }

  const handleBookmark = (bookId: string | number) => {
    if (!user) return alert("Please login to save bookmarks")
    moonClient
      .model("wx.bookmark")
      .create({
        userId: user.id,
        bookId,
      })
      .then(() => alert("Bookmark saved!"))
      .catch((err: any) => alert("Failed to save bookmark: " + err.message))
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#040914] font-sans text-white">
      {/* 1. TOP HEADER SECTION */}
      <ReaderTopHeader
        scriptureName={scripture_name}
        scriptureArabic={scripture_arabic}
        scriptureTag={scripture_tag}
        scriptureDesc={scripture_desc}
        stats={stats}
      />

      {/* 2. MAIN 3-COLUMN DASHBOARD */}
      <div className="mx-auto grid max-w-[1920px] grid-cols-1 gap-4 px-6 py-4 md:grid-cols-12">
        {/* LEFT SIDEBAR */}
        <ReaderNavSidebar
          title={left_sidebar.title}
          items={left_sidebar.items}
          currentBook={currentBook}
          onSelectBook={(bookNo) => router.push(`?book=${bookNo}&chapter=1`)}
        />

        {/* CENTER AREA */}
        <ReaderVersesGrid
          book={book}
          verses={verses}
          currentBook={currentBook}
          currentChapter={currentChNum}
          totalChapters={totalChapters}
          onNavigateChapter={handleNavigateChapter}
          onBookmark={handleBookmark}
          audio={audio}
        />

        {/* RIGHT SIDEBAR */}
        <ReaderInsightsSidebar
          quickFacts={right_sidebar.quick_facts}
          insights={right_sidebar.insights}
        />
      </div>

      {/* 3. BOTTOM PANELS */}
      <ReaderBottomPanels bottomPanels={bottom_panels} />
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
