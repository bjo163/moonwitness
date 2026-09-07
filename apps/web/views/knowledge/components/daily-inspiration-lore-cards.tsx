"use client"

import React from "react"
import { DailyData } from "../lib/daily-inspiration-data"

interface DailyInspirationLoreCardsProps {
  data: DailyData
  hadithGradeText: string
  asmaulSurahMeaning?: string
  asmaulAyahMeaning?: string
  lang: string
}

export function DailyInspirationLoreCards({
  data,
  hadithGradeText,
  asmaulSurahMeaning,
  asmaulAyahMeaning,
  lang,
}: DailyInspirationLoreCardsProps) {
  return (
    <>
      {/* ROW 2: 2 Cards (Next Verse Pair & Ayah Pair) */}
      <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {/* Next Verse Pair */}
        <div
          className={`flex flex-col justify-between rounded-md border border-border bg-card p-4 transition-colors hover:border-success/50 ${!data.asmaulSurah ? "opacity-50" : ""}`}
        >
          <div className="mb-4 flex items-start justify-between">
            <h4 className="text-sm font-medium text-success">
              Next Verse Pair
            </h4>
            {data.asmaulSurah && (
              <span className="rounded-md border border-success/20 bg-success/10 px-2 py-1 text-xs text-success">
                #{data.asmaulSurah.number}
              </span>
            )}
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-xl font-medium text-foreground">
                {data.asmaulSurah?.nameLatin || "—"}
              </h3>
              <p className="mt-1 text-sm text-success">
                {data.asmaulSurah ? asmaulSurahMeaning : "No pair"}
              </p>
            </div>
            <div className="arabic-text text-3xl font-bold text-success">
              {data.asmaulSurah?.nameArabic || ""}
            </div>
          </div>
          <div className="relative mt-2 h-4 w-full overflow-hidden border-b border-emerald-500/10">
            <div className="absolute bottom-0 h-px w-full bg-success/30"></div>
          </div>
        </div>

        {/* Ayah Pair */}
        <div
          className={`flex flex-col justify-between rounded-md border border-border bg-card p-4 transition-colors hover:border-primary/50 ${!data.asmaulAyah ? "opacity-50" : ""}`}
        >
          <div className="mb-4 flex items-start justify-between">
            <h4 className="text-sm font-medium text-primary">
              Ayah Pair
            </h4>
            {data.asmaulAyah && (
              <span className="rounded-md border border-primary/20 bg-primary/10 px-2 py-1 text-xs text-primary">
                #{data.asmaulAyah.number}
              </span>
            )}
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-xl font-medium text-foreground">
                {data.asmaulAyah?.nameLatin || "—"}
              </h3>
              <p className="mt-1 text-sm text-primary">
                {data.asmaulAyah ? asmaulAyahMeaning : "No pair"}
              </p>
            </div>
            <div className="arabic-text text-3xl font-bold text-primary">
              {data.asmaulAyah?.nameArabic || ""}
            </div>
          </div>
          <div className="relative mt-2 h-4 w-full overflow-hidden border-b border-fuchsia-500/10">
            <div className="absolute bottom-0 h-px w-full bg-primary/30"></div>
          </div>
        </div>
      </div>

      {/* ROW 3: Lore & Wisdom */}
      <div className="mt-2 grid grid-cols-1 gap-6 md:grid-cols-2">
        {data.hadith ? (
          <div className="rounded-md border border-border bg-card p-6 transition-colors hover:border-warning/50">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-base text-warning">👑</span>
                <h4 className="text-sm font-medium text-warning">
                  Hadith source
                </h4>
              </div>
              <span className="rounded-md border border-warning/20 bg-warning/10 px-2 py-1 text-xs text-warning">
                {hadithGradeText}
              </span>
            </div>
            <h3 className="mb-6 text-sm font-medium text-warning">
              {data.hadith.bookName} • RECORD_NO. {data.hadith.number}
            </h3>
            <div className="flex gap-6">
              <div className="mt-1 text-4xl opacity-30">📖</div>
              <p className="text-sm leading-relaxed font-light text-foreground italic">
                "
                {lang === "en"
                  ? data.hadith.textEn || data.hadith.textId
                  : data.hadith.textId}
                "
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-md border border-border bg-card p-8 text-sm text-muted-foreground">
            No hadith available
          </div>
        )}

        {data.wisdom ? (
          <div className="relative overflow-hidden rounded-md border border-border bg-card p-6 transition-colors hover:border-primary/50">
            <div className="relative mb-6 flex items-center gap-3">
              <span className="text-base text-primary">🪐</span>
              <h4 className="text-sm font-medium text-primary">
                Scripture reflection
              </h4>
            </div>
            <div className="relative mb-6 rounded-md border border-border bg-background p-4">
              <p className="text-base leading-relaxed text-foreground italic">
                "
                {lang === "en"
                  ? data.wisdom.quoteEn || data.wisdom.quote
                  : data.wisdom.quote}
                "
              </p>
            </div>
            <p className="relative text-xs text-muted-foreground">
              Source: {" "}
              {lang === "en"
                ? data.wisdom.sourceEn || data.wisdom.source
                : data.wisdom.source}
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-md border border-border bg-card p-8 text-sm text-muted-foreground">
            No scripture available
          </div>
        )}
      </div>
    </>
  )
}
