"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { DailyInspirationClient } from "@modules/knowledge/components/daily-inspiration-client"

type HistoryItem = {
  sequenceNumber: number
  dateStr: string
  formattedDate: string
  period: {
    code: string
    name: string
    icon: string
    timeRange: string
  }
  ayah: {
    id: number
    surahNumber: number
    surahName: string
    ayahNumber: number
    textArabic: string
    textLatin: string
    translationId: string
    audioUrl?: string
  }
  asmaulSurah?: {
    number: number
    name_arabic: string
    name_latin: string
    translation_id: string
  }
  asmaulAyah?: {
    number: number
    name_arabic: string
    name_latin: string
    translation_id: string
  }
}

/* eslint-disable @typescript-eslint/no-magic-numbers -- Skeleton loader count */
const SKELETON_ITEMS = [1, 2, 3] as const
/* eslint-enable @typescript-eslint/no-magic-numbers */

export function DailyTransmissionView() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)

  async function fetchHistory() {
    try {
      const res = await fetch("/api/daily/history")
      if (res.ok) {
        const json = await res.json()
        if (json && json.history) {
          setHistory(json.history)
          setTotalCount(json.totalPeriodsElapsed || json.history.length)
        }
      }
    } catch (err) {
      console.warn("Failed to fetch history:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchHistory()
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-12">
      {/* Live Today's Transmission */}
      <div
        className="animate-in space-y-4 duration-700 fill-mode-both fade-in slide-in-from-top-8"
        style={{ animationDelay: "200ms" }}
      >
        <h2 className="flex items-center gap-3 text-xs font-medium tracking-[0.3em] text-primary uppercase">
          <span className="h-px w-8 bg-cyan-500/50" />
          Active Transmission
        </h2>
        <DailyInspirationClient />
      </div>

      {/* Transmission Log (History) */}
      <div
        className="animate-in space-y-6 pt-12 duration-700 fill-mode-both fade-in slide-in-from-top-8"
        style={{ animationDelay: "400ms" }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
          <h2 className="flex items-center gap-3 text-xs font-medium tracking-[0.3em] text-primary uppercase">
            <span className="h-px w-8 bg-emerald-500/50" />
            Transmission Log
          </h2>

          <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-black/40 px-4 py-2 text-[10px] font-medium tracking-widest uppercase backdrop-blur-md">
            <span className="text-primary">Unlocked Verses</span>
            <span className="text-xl font-light text-cyan-400 drop-shadow-[0_0_10px_rgba(0,240,255,0.3)]">
              {totalCount} / 6.236
            </span>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {SKELETON_ITEMS.map((i) => (
              <div
                key={i}
                className="h-48 w-full animate-pulse rounded-2xl border border-white/5 bg-black/40"
              />
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="rounded-2xl border border-white/5 bg-black/40 p-12 text-center backdrop-blur-xl">
            <p className="text-sm font-light tracking-[0.2em] text-primary uppercase">
              No previous transmissions logged.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {history.map((item) => (
              <div
                key={`${item.sequenceNumber}-${item.dateStr}-${item.period.code}`}
                className="bg-space/80 space-y-6 rounded-2xl border border-white/5 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all hover:border-cyan-500/20 sm:p-8"
              >
                {/* Item Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/10 text-xs font-medium text-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.1)]">
                      #{item.sequenceNumber}
                    </span>
                    <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[9px] font-medium tracking-widest text-primary uppercase">
                      <span>{item.period.icon}</span>
                      <span>{item.period.name}</span>
                    </span>
                    <span className="text-[10px] font-medium tracking-widest text-primary uppercase">
                      {item.formattedDate}
                    </span>
                  </div>

                  {item.ayah && (
                    <Link
                      href={`/kitab/quran/${item.ayah.surahNumber}`}
                      className="rounded-full border border-white/10 px-4 py-2 text-[9px] font-medium tracking-widest text-foreground uppercase transition-all hover:border-white/20 hover:bg-white/10"
                    >
                      Surah {item.ayah.surahName} ({item.ayah.surahNumber}:
                      {item.ayah.ayahNumber}) &rarr;
                    </Link>
                  )}
                </div>

                {/* Ayah Content */}
                {item.ayah && (
                  <div className="space-y-5 rounded-xl border border-white/5 bg-black/40 p-6">
                    <div
                      className="arabic-text text-right text-2xl leading-[2.2] font-bold text-foreground sm:text-3xl"
                      style={{ textShadow: "0 0 10px rgba(255,255,255,0.1)" }}
                    >
                      {item.ayah.textArabic}
                    </div>

                    {item.ayah.textLatin && (
                      <p
                        className="font-serif text-sm font-medium text-emerald-400 italic"
                        style={{ textShadow: "0 0 10px rgba(16,185,129,0.2)" }}
                      >
                        &ldquo;{item.ayah.textLatin}&rdquo;
                      </p>
                    )}

                    <div className="mt-4 rounded-lg border border-white/5 bg-black/30 p-4">
                      <p className="text-sm leading-relaxed font-light text-foreground">
                        &ldquo;{item.ayah.translationId}&rdquo;
                      </p>
                    </div>

                    {/* 2 Paired Asmaul Husna */}
                    <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
                      {item.asmaulSurah && (
                        <div className="flex items-center justify-between gap-4 rounded-lg border border-cyan-500/10 bg-cyan-500/5 p-4">
                          <div>
                            <span className="mb-1 block text-[9px] font-medium tracking-widest text-cyan-500/70 uppercase">
                              SURAH PAIR RUNIC #{item.ayah.surahNumber}
                            </span>
                            <span className="block text-xs font-medium text-foreground">
                              #{item.asmaulSurah.number}{" "}
                              {item.asmaulSurah.name_latin}
                            </span>
                            <span className="mt-0.5 block text-[9px] text-primary">
                              &ldquo;{item.asmaulSurah.translation_id}&rdquo;
                            </span>
                          </div>
                          <span className="font-serif text-xl font-bold text-cyan-400 drop-shadow-[0_0_5px_rgba(0,240,255,0.3)]">
                            {item.asmaulSurah.name_arabic}
                          </span>
                        </div>
                      )}

                      {item.asmaulAyah && (
                        <div className="flex items-center justify-between gap-4 rounded-lg border border-fuchsia-500/10 bg-fuchsia-500/5 p-4">
                          <div>
                            <span className="mb-1 block text-[9px] font-medium tracking-widest text-fuchsia-500/70 uppercase">
                              AYAH PAIR RUNIC #{item.ayah.ayahNumber}
                            </span>
                            <span className="block text-xs font-medium text-foreground">
                              #{item.asmaulAyah.number}{" "}
                              {item.asmaulAyah.name_latin}
                            </span>
                            <span className="mt-0.5 block text-[9px] text-primary">
                              &ldquo;{item.asmaulAyah.translation_id}&rdquo;
                            </span>
                          </div>
                          <span className="font-serif text-xl font-bold text-fuchsia-400 drop-shadow-[0_0_5px_rgba(217,70,239,0.3)]">
                            {item.asmaulAyah.name_arabic}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
