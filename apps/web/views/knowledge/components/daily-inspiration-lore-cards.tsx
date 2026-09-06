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
          className={`flex flex-col justify-between rounded-2xl border border-success/20 bg-card p-6 backdrop-blur-xl transition-colors hover:border-emerald-500/40 ${!data.asmaulSurah ? "opacity-50" : ""}`}
        >
          <div className="mb-4 flex items-start justify-between">
            <h4 className="text-[10px] tracking-[0.2em] text-success uppercase">
              Next Verse Pair
            </h4>
            {data.asmaulSurah && (
              <span className="rounded-full border border-success/20 bg-success/10 px-3 py-1 text-[9px] text-success">
                #{data.asmaulSurah.number}
              </span>
            )}
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-xl font-medium text-foreground drop-shadow-sm">
                {data.asmaulSurah?.nameLatin || "—"}
              </h3>
              <p className="mt-1 text-[11px] text-success">
                {data.asmaulSurah ? asmaulSurahMeaning : "No pair"}
              </p>
            </div>
            <div className="font-serif text-3xl font-bold text-success drop-shadow-sm">
              {data.asmaulSurah?.nameArabic || ""}
            </div>
          </div>
          <div className="relative mt-2 h-4 w-full overflow-hidden border-b border-emerald-500/10">
            <div className="absolute bottom-0 h-[1px] w-full bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
          </div>
        </div>

        {/* Ayah Pair */}
        <div
          className={`flex flex-col justify-between rounded-2xl border border-fuchsia-500/20 bg-card p-6 backdrop-blur-xl transition-colors hover:border-fuchsia-500/40 ${!data.asmaulAyah ? "opacity-50" : ""}`}
        >
          <div className="mb-4 flex items-start justify-between">
            <h4 className="text-[10px] tracking-[0.2em] text-fuchsia-400 uppercase">
              Ayah Pair
            </h4>
            {data.asmaulAyah && (
              <span className="rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-3 py-1 text-[9px] text-fuchsia-300">
                #{data.asmaulAyah.number}
              </span>
            )}
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-xl font-medium text-foreground drop-shadow-sm">
                {data.asmaulAyah?.nameLatin || "—"}
              </h3>
              <p className="mt-1 text-[11px] text-fuchsia-300">
                {data.asmaulAyah ? asmaulAyahMeaning : "No pair"}
              </p>
            </div>
            <div className="font-serif text-3xl font-bold text-fuchsia-400 drop-shadow-sm">
              {data.asmaulAyah?.nameArabic || ""}
            </div>
          </div>
          <div className="relative mt-2 h-4 w-full overflow-hidden border-b border-fuchsia-500/10">
            <div className="absolute bottom-0 h-[1px] w-full bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* ROW 3: Lore & Wisdom */}
      <div className="mt-2 grid grid-cols-1 gap-6 md:grid-cols-2">
        {data.hadith ? (
          <div className="rounded-2xl border border-warning/20 bg-gradient-to-br -background to-background/80 p-8 shadow-lg backdrop-blur-xl transition-colors hover:border-amber-500/40">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-base text-warning">👑</span>
                <h4 className="text-[11px] tracking-[0.2em] text-warning uppercase">
                  Legendary Lore Channel
                </h4>
              </div>
              <span className="rounded border border-warning/20 bg-warning/10 px-3 py-1 text-[9px] tracking-widest text-amber-300">
                {hadithGradeText.toUpperCase()}
              </span>
            </div>
            <h3 className="mb-6 text-[12px] font-medium tracking-[0.1em] text-amber-300 uppercase drop-shadow-sm">
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
          <div className="flex items-center justify-center rounded-2xl border border-border bg-card p-8 text-xs text-foreground/20 backdrop-blur-xl">
            NO LORE DETECTED
          </div>
        )}

        {data.wisdom ? (
          <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br -background to-background/80 p-8 shadow-lg backdrop-blur-xl transition-colors hover:border-border">
            <div className="pointer-events-none absolute top-[10%] right-[-10%] h-40 w-40 rounded-full border border-border bg-primary/10 blur-2xl" />
            <div className="relative z-10 mb-8 flex items-center gap-3">
              <span className="text-base text-primary">🪐</span>
              <h4 className="text-[11px] tracking-[0.2em] text-primary uppercase">
                Sacred Scripture Reflection
              </h4>
            </div>
            <div className="relative z-10 mb-6 rounded-xl border border-border bg-card p-6">
              <p className="text-base leading-relaxed font-light text-foreground italic drop-shadow-md">
                "
                {lang === "en"
                  ? data.wisdom.quoteEn || data.wisdom.quote
                  : data.wisdom.quote}
                "
              </p>
            </div>
            <p className="relative z-10 text-[9px] tracking-[0.2em] text-primary uppercase">
              SOURCE KEY:{" "}
              {lang === "en"
                ? data.wisdom.sourceEn || data.wisdom.source
                : data.wisdom.source}
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-2xl border border-border bg-card p-8 text-xs text-foreground/20 backdrop-blur-xl">
            NO SCRIPTURE DETECTED
          </div>
        )}
      </div>
    </>
  )
}
