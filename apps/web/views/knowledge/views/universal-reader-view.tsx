"use client"

import React, { useState, useEffect, Suspense, useRef } from "react"
import { BookOpen } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { useGlobalAudio } from "@workspace/state"
import { Button } from "@workspace/ui"
import { moonClientInstance, useAuthSession } from "@moon/client"
import { ReaderTopHeader } from "../components/reader/reader-top-header"
import { ReaderNavSidebar } from "../components/reader/reader-nav-sidebar"
import { ReaderVersesGrid } from "../components/reader/reader-verses-grid"
import { ReaderInsightsSidebar } from "../components/reader/reader-insights-sidebar"
import { ReaderBottomPanels } from "../components/reader/reader-bottom-panels"

export interface ScriptureBook {
  id: string | number
  name: string
  original_name?: string
  chapters_count?: number
  summary?: string
  meaning?: string
  audio_url?: string
}

export interface ScriptureVerse {
  id: string | number
  verse_number: number | string
  text_original?: string
  text_transliteration?: string
  text_translated?: string
  text_tajweed?: string
  audio_url?: string
  juz?: number
}

export interface ScriptureReaderResponse {
  success: boolean
  data: {
    book: ScriptureBook
    verses: ScriptureVerse[]
    current_chapter: string | number
    scripture_name: string
    scripture_arabic: string
    scripture_tag: string
    scripture_desc: string
    stats: Record<string, any>
    left_sidebar: { title: string; items: any[] }
    right_sidebar: { quick_facts: any[]; insights: any[] }
    bottom_panels?: {
      themes?: string[]
      related?: Array<{ ref: string; desc: string }>
      tafsir_highlight?: { text: string; author: string }
      science?: string[]
    }
  }
}

export function isScriptureReaderResponse(
  value: any
): value is ScriptureReaderResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    value.success === true &&
    typeof value.data === 'object' &&
    value.data !== null &&
    typeof value.data.book === 'object' &&
    value.data.book !== null &&
    Array.isArray(value.data.verses)
  )
}

function ReaderContent({ id }: { id: string }) {
  const [payload, setPayload] = useState<ScriptureReaderResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const audio = useGlobalAudio()
  const lastHistoryKeyRef = useRef<string | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()
  const currentBook = searchParams.get("book") || "1"
  const currentChapterStr = searchParams.get("chapter") || "1"

  const moonClient = moonClientInstance
  const { user } = useAuthSession()

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    setIsLoading(true)
    setError(null)
    fetch(
      `/api/scriptures/${id}/read?book=${currentBook}&chapter=${currentChapterStr}`,
      { signal }
    )
      .then((res) => res.json())
      .then((json) => {
        if (!isScriptureReaderResponse(json)) {
          throw new Error('Invalid reader response contract')
        }
        setPayload(json)
        setIsLoading(false)
        window.scrollTo(0, 0)

        if (user && json.data.book?.id) {
          const historyKey = `${user.id}-${json.data.book.id}`
          if (lastHistoryKeyRef.current !== historyKey) {
            lastHistoryKeyRef.current = historyKey
            moonClient
              .model("wx.history")
              .create({
                userId: user.id,
                bookId: json.data.book.id,
              })
              .catch(console.error)
          }
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error(err)
          setError(err.message || 'Failed to load scripture')
          setIsLoading(false)
        }
      })

    return () => {
      controller.abort()
    }
  }, [id, currentBook, currentChapterStr, user, moonClient])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-card text-foreground/50">
        <BookOpen className="h-8 w-8 animate-pulse text-blue-500/50" />
        <div className="text-sm text-muted-foreground">
          Loading scripture…
        </div>
      </div>
    )
  }

  if (!payload) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-card text-foreground">
        <p>{error || 'Error loading scripture.'}</p>
        <Button
          onClick={() => router.back()}
          type="button"
          variant="outline"
        >
          Go Back
        </Button>
      </div>
    )
  }

  const data = payload.data

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
  const currentChNum = parseInt(String(current_chapter)) || 1

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
    <div className="min-h-screen overflow-x-hidden bg-card font-sans text-foreground">
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
        <div className="min-h-screen bg-card p-8 text-foreground">
          Loading Reader...
        </div>
      }
    >
      <ReaderContent id={id} />
    </Suspense>
  )
}
