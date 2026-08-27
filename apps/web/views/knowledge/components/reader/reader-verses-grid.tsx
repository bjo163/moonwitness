"use client"

import React, { useState } from "react"
import { PlayCircle, Pause, Bookmark } from "lucide-react"
import { sanitizeHtml } from "@workspace/ui"

export interface VerseItem {
  id: string | number
  verse_number: number | string
  text_transliteration?: string
  text_translated?: string
  text_original?: string
  text_tajweed?: string
}

export interface ReaderVersesGridProps {
  book: {
    id: string | number
    name: string
    original_name?: string
    summary?: string
    meaning?: string
    audio_url?: string
    chapters_count?: number
  }
  verses: VerseItem[]
  currentBook: string
  currentChapter: number
  totalChapters: number
  onNavigateChapter: (chapter: number) => void
  onBookmark?: (bookId: string | number) => void
  audio?: any
}

export function ReaderVersesGrid({
  book,
  verses,
  currentBook,
  currentChapter,
  totalChapters,
  onNavigateChapter,
  onBookmark,
  audio,
}: ReaderVersesGridProps) {
  const [isTajweedOn, setIsTajweedOn] = useState(false)
  const [isTransliterationOn, setIsTransliterationOn] = useState(true)

  const isAudioPlaying =
    audio?.isPlaying && audio?.currentTrack?.url === book.audio_url

  const handleToggleAudio = () => {
    if (!book.audio_url) return
    if (isAudioPlaying) {
      audio.pause?.() || audio.togglePlay?.()
    } else {
      audio.play?.({
        url: book.audio_url,
        name: book.name,
        number: currentChapter,
      })
    }
  }

  return (
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
            className={`border-b-2 px-4 py-3 text-[10px] font-black tracking-widest whitespace-nowrap uppercase transition-colors ${
              i === 1
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-white/40 hover:text-white/80"
            }`}
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
              {book.original_name && (
                <span className="font-serif text-amber-500/80">
                  {book.original_name}
                </span>
              )}
            </h2>
            <div className="mt-2 flex items-center gap-4 text-xs font-bold text-white/40">
              {book.summary && <span>{book.summary}</span>}
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
                onClick={handleToggleAudio}
                className={`flex items-center gap-2 px-4 py-2 ${
                  isAudioPlaying
                    ? "border-blue-500/50 bg-blue-500/20 text-blue-400"
                    : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                } rounded-lg border text-xs font-bold transition-colors`}
              >
                {isAudioPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <PlayCircle className="h-4 w-4" />
                )}
                {isAudioPlaying ? "Playing..." : "Listen Audio"}
              </button>
            )}

            {onBookmark && (
              <button
                onClick={() => onBookmark(book.id)}
                className="group relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-colors hover:bg-white/10 hover:text-blue-400"
              >
                <Bookmark className="h-4 w-4 text-white/60 transition-colors group-hover:text-blue-400" />
              </button>
            )}
          </div>
        </div>

        {/* Verses Column Layout */}
        <div className="space-y-6">
          <div className="grid grid-cols-12 gap-4 border-b border-white/5 pb-2 text-[9px] font-black tracking-widest text-white/30 uppercase">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-5 pl-2">
              Transliteration & Translation
            </div>
            <div className="col-span-6 pr-2 text-right">Original Text</div>
          </div>

          {verses.map((verse) => {
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
                        __html: sanitizeHtml(verse.text_tajweed),
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
              className={`rounded border px-3 py-1.5 text-[10px] font-bold transition-colors ${
                isTransliterationOn
                  ? "border-blue-500/30 bg-blue-500/20 text-blue-400"
                  : "border-white/10 bg-black/40 text-white/60"
              }`}
            >
              Transliteration: {isTransliterationOn ? "ON" : "OFF"}
            </button>
            {verses.some(
              (v) => v.text_tajweed && v.text_tajweed !== v.text_original
            ) && (
              <button
                onClick={() => setIsTajweedOn(!isTajweedOn)}
                className={`rounded border px-3 py-1.5 text-[10px] font-bold transition-colors ${
                  isTajweedOn
                    ? "border-amber-500/30 bg-amber-500/20 text-amber-400"
                    : "border-white/10 bg-black/40 text-white/60"
                }`}
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
                onClick={() => onNavigateChapter(currentChapter - 1)}
                disabled={currentChapter <= 1}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-bold hover:bg-white/10 disabled:opacity-30"
              >
                Prev
              </button>
              <span className="px-2 text-xs font-bold text-amber-500">
                Ch. {currentChapter} / {totalChapters}
              </span>
              <button
                onClick={() => onNavigateChapter(currentChapter + 1)}
                disabled={currentChapter >= totalChapters}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-bold hover:bg-white/10 disabled:opacity-30"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
