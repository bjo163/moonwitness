"use client"

import { useState } from "react"
import {
  ReaderHeader,
  ReaderTabs,
  ReaderToolbar,
  ReaderVerses,
} from "./reader-verses-presentation"
import type { ReaderBook, VerseItem } from "./reader.types"
export type { ReaderBook, VerseItem } from "./reader.types"

export interface ReaderVersesGridProps {
  book: ReaderBook
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
      <ReaderTabs />
      <article
        aria-label={`${book.name}, chapter ${currentChapter}`}
        className="relative overflow-hidden rounded-xl border border-border bg-card p-5 md:p-6"
      >
        <ReaderHeader
          book={book}
          currentBook={currentBook}
          currentChapter={currentChapter}
          isAudioPlaying={isAudioPlaying}
          onToggleAudio={handleToggleAudio}
          onBookmark={onBookmark ? () => onBookmark(book.id) : undefined}
        />
        <ReaderVerses
          verses={verses}
          isTransliterationOn={isTransliterationOn}
          isTajweedOn={isTajweedOn}
        />
        <ReaderToolbar
          verses={verses}
          isTransliterationOn={isTransliterationOn}
          isTajweedOn={isTajweedOn}
          totalChapters={totalChapters}
          currentChapter={currentChapter}
          onToggleTransliteration={() =>
            setIsTransliterationOn((value) => !value)
          }
          onToggleTajweed={() => setIsTajweedOn((value) => !value)}
          onNavigateChapter={onNavigateChapter}
        />
      </article>
    </div>
  )
}
