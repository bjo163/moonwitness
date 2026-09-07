import { Bookmark, Pause, PlayCircle } from "lucide-react"
import { sanitizeHtml } from "@workspace/ui"
import type { ReaderBook, VerseItem } from "./reader.types"
export type { ReaderBook, VerseItem } from "./reader.types"

export function ReaderTabs() {
  return (
    <div
      role="tablist"
      aria-label="Reader sections"
      className="custom-scrollbar flex items-center gap-1 overflow-x-auto border-b border-border pb-px"
    >
      {[
        "OVERVIEW",
        "READ & EXPLORE",
        "THEMES & TOPICS",
        "INSIGHTS",
        "CONTEXT",
      ].map((tab, index) => (
        <button
          key={tab}
          type="button"
          role="tab"
          aria-selected={index === 1}
          className={`border-b-2 px-4 py-3 text-[10px] font-black tracking-widest whitespace-nowrap uppercase transition-colors ${
            index === 1
              ? "border-blue-500 text-blue-400"
              : "border-transparent text-foreground/40 hover:text-foreground"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

type ReaderHeaderProps = {
  book: ReaderBook
  currentBook: string
  currentChapter: number
  isAudioPlaying: boolean
  onToggleAudio: () => void
  onBookmark?: () => void
}

export function ReaderHeader({
  book,
  currentBook,
  currentChapter,
  isAudioPlaying,
  onToggleAudio,
  onBookmark,
}: ReaderHeaderProps) {
  return (
    <div className="mb-6 flex flex-col items-start justify-between gap-3 border-b border-border pb-4 md:flex-row md:items-center">
      <div>
        <span className="mb-2 inline-block rounded bg-muted/30 px-2 py-1 text-[10px] font-bold tracking-widest text-warning uppercase">
          BOOK {currentBook}
        </span>
        <h2 className="flex items-center gap-3 text-2xl font-black">
          {book.name}
          {book.original_name && (
            <span className="font-serif text-warning/80">
              {book.original_name}
            </span>
          )}
        </h2>
        <div className="mt-2 flex items-center gap-4 text-xs font-bold text-foreground/40">
          {book.summary && <span>{book.summary}</span>}
          {book.meaning && (
            <>
              <span className="text-foreground/20">•</span>
              <span className="text-warning/80">Arti: {book.meaning}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {book.audio_url && (
          <button
            type="button"
            onClick={onToggleAudio}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-bold transition-colors ${
              isAudioPlaying
                ? "border-blue-500/50 bg-blue-500/20 text-blue-400"
                : "border-border bg-muted/30 text-foreground hover:bg-muted/30"
            }`}
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
            type="button"
            onClick={onBookmark}
            className="group relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted/30 transition-colors hover:bg-muted/30 hover:text-blue-400"
          >
            <Bookmark className="h-4 w-4 text-foreground/60 transition-colors group-hover:text-blue-400" />
          </button>
        )}
      </div>
    </div>
  )
}

type ReaderVersesProps = {
  verses: VerseItem[]
  isTransliterationOn: boolean
  isTajweedOn: boolean
}

export function ReaderVerses({
  verses,
  isTransliterationOn,
  isTajweedOn,
}: ReaderVersesProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-4 border-b border-border pb-2 text-[9px] font-black tracking-widest text-foreground/30 uppercase">
        <div className="col-span-1 text-center">#</div>
        <div className="col-span-5 pl-2">Transliteration &amp; Translation</div>
        <div className="col-span-6 pr-2 text-right">Original Text</div>
      </div>

      {verses.map((verse) => {
        const isRtl =
          verse.text_original &&
          (/[֐-׿]/.test(verse.text_original) ||
            /[؀-ۿ]/.test(verse.text_original))

        return (
          <div
            key={verse.id}
            className="group grid grid-cols-12 items-start gap-4"
          >
            <div className="col-span-1 flex justify-center pt-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-muted/30 text-[10px] font-bold text-foreground/50 transition-colors group-hover:border-blue-500/30">
                {verse.verse_number}
              </div>
            </div>

            <div className="col-span-5 space-y-2 pt-1 pl-2">
              {isTransliterationOn && verse.text_transliteration && (
                <p className="font-mono text-xs text-blue-300/70">
                  {verse.text_transliteration}
                </p>
              )}
              <p className="font-serif text-sm leading-relaxed text-foreground">
                {verse.text_translated}
              </p>
            </div>

            <div className="col-span-6 pt-1 pr-2 text-right">
              {isTajweedOn &&
              verse.text_tajweed &&
              verse.text_tajweed !== verse.text_original ? (
                <div
                  lang="ar"
                  className="tajweed-container font-arabic text-2xl leading-[2.5] text-warning/90"
                  dir={isRtl ? "rtl" : "ltr"}
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(verse.text_tajweed),
                  }}
                />
              ) : (
                <p
                  lang="ar"
                  className="font-arabic text-2xl leading-[2.5] text-warning/90"
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
  )
}

type ReaderToolbarProps = {
  verses: VerseItem[]
  isTransliterationOn: boolean
  isTajweedOn: boolean
  totalChapters: number
  currentChapter: number
  onToggleTransliteration: () => void
  onToggleTajweed: () => void
  onNavigateChapter: (chapter: number) => void
}

export function ReaderToolbar({
  verses,
  isTransliterationOn,
  isTajweedOn,
  totalChapters,
  currentChapter,
  onToggleTransliteration,
  onToggleTajweed,
  onNavigateChapter,
}: ReaderToolbarProps) {
  const hasTajweed = verses.some(
    (verse) => verse.text_tajweed && verse.text_tajweed !== verse.text_original
  )

  return (
    <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onToggleTransliteration}
          className={`rounded border px-3 py-1.5 text-[10px] font-bold transition-colors ${
            isTransliterationOn
              ? "border-blue-500/30 bg-blue-500/20 text-blue-400"
              : "border-border bg-card text-foreground/60"
          }`}
        >
          Transliteration: {isTransliterationOn ? "ON" : "OFF"}
        </button>
        {hasTajweed && (
          <button
            type="button"
            onClick={onToggleTajweed}
            className={`rounded border px-3 py-1.5 text-[10px] font-bold transition-colors ${
              isTajweedOn
                ? "border-warning/30 bg-warning/20 text-warning"
                : "border-border bg-card text-foreground/60"
            }`}
          >
            Tajweed Colors: {isTajweedOn ? "ON" : "OFF"}
          </button>
        )}
        <button
          type="button"
          className="rounded border border-border bg-card px-3 py-1.5 text-[10px] font-bold text-foreground/60"
        >
          Tafsir: ON
        </button>
      </div>

      {totalChapters > 1 && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigateChapter(currentChapter - 1)}
            disabled={currentChapter <= 1}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-bold hover:bg-muted/30 disabled:opacity-30"
          >
            Prev
          </button>
          <span className="px-2 text-xs font-bold text-warning">
            Ch. {currentChapter} / {totalChapters}
          </span>
          <button
            type="button"
            onClick={() => onNavigateChapter(currentChapter + 1)}
            disabled={currentChapter >= totalChapters}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-bold hover:bg-muted/30 disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
