"use client"

import React from "react"
import { Moon, Play, Pause } from "lucide-react"
import { AudioWaveformVisualizer } from "@workspace/ui"
import { AsbabunNuzulModal } from "./modals/asbabun-nuzul-modal"
import { WordByWordModal } from "./modals/word-by-word-modal"
import { HifzTrainerModal } from "./modals/hifz-trainer-modal"
import { DailyData, SURAH_TRANSLATIONS_EN } from "../lib/daily-inspiration-data"
import { DailyInspirationLoreCards } from "./daily-inspiration-lore-cards"

interface DailyInspirationCardProps {
  data: DailyData
  nextPrayer: {
    name: string
    formattedCountdown: string
    percentage: number
  } | null
  isZapping: boolean
  triggerZapEffect: () => void
  isPlayingAudio: boolean
  setIsPlayingAudio: (val: boolean) => void
  toggleAudio: () => void
  activeAyahTranslation: string
  customTafsirNote: string
  hadithGradeText: string
  asmaulSurahMeaning?: string
  asmaulAyahMeaning?: string
  lang: string
}

export function DailyInspirationCard({
  data,
  nextPrayer,
  isZapping,
  triggerZapEffect,
  isPlayingAudio,
  setIsPlayingAudio,
  toggleAudio,
  activeAyahTranslation,
  customTafsirNote,
  hadithGradeText,
  asmaulSurahMeaning,
  asmaulAyahMeaning,
  lang,
}: DailyInspirationCardProps) {
  return (
    <div
      id="whatsapp-share-card"
      className={`relative w-full overflow-hidden rounded-[2rem] border border-border p-6 font-sans text-foreground shadow-sm backdrop-blur-2xl sm:p-10 ${
        isZapping
          ? "translate-x-[2px] -translate-y-[2px] bg-primary/10 brightness-150 contrast-125 saturate-150 transition-none"
          : "bg-card transition-all duration-700"
      }`}
    >
      {/* Background Image with Mask Transparency */}
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 60%, black 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 60%, black 100%)",
        }}
      >
        <div
          className="absolute inset-0 bg-cover bg-[center_right] bg-no-repeat opacity-100"
          style={{ backgroundImage: "url('/blueprint/BG-HERO-01.png')" }}
        />
      </div>

      {/* Subtle radial overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r -background -background to-transparent" />

      {/* Top Hologram line */}
      <div className="absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-transparent to-transparent opacity-50" />

      {/* Header Branding */}
      <div className="relative z-10 mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            onClick={triggerZapEffect}
            className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border bg-gradient-to-br shadow-sm transition-transform hover:scale-105 active:scale-95 ${
              isZapping
                ? "scale-110 border-border bg-primary/50 shadow-sm"
                : "border-blue-500/30 from-blue-500/20 to-transparent"
            }`}
            title="Play Futuristic Scan Sound"
          >
            <Moon className="h-6 w-6 text-blue-300 drop-shadow-sm" />
          </div>
          <div>
            <h3 className="text-sm font-medium tracking-[0.3em] text-blue-50 uppercase drop-shadow-sm">
              MOONWITNESS MISSION TERMINAL
            </h3>
            <p className="mt-1 text-[10px] font-medium tracking-[0.2em] text-blue-300/70 uppercase">
              DIVINE SCRIPTURES &amp; SACRED LORE REPOSITORY
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="relative z-10 flex flex-col gap-6">
        {/* ROW 1: Current Cycle (Left) + Ayah Panel (Right) */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left: Current Cycle Timer */}
          <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-border bg-card p-8 backdrop-blur-xl lg:col-span-3">
            <div className="pointer-events-none absolute top-0 left-0 h-full w-full bg-gradient-to-b from-blue-900/10 to-transparent" />

            <div className="pointer-events-none absolute right-0 bottom-0 h-32 w-full bg-[url('https://www.svgrepo.com/show/305267/mosque.svg')] bg-contain bg-right-bottom bg-no-repeat opacity-10 mix-blend-screen" />

            <span className="text-[9px] font-bold tracking-widest text-warning uppercase">
              CURRENT <span className="text-blue-300">CYCLE</span>
            </span>
            <h2 className="mt-2 text-center text-2xl font-light tracking-widest text-foreground uppercase drop-shadow-sm md:text-4xl">
              {data.prayerPeriod?.name || "ISYA'"}
            </h2>
            <p className="mt-2 text-[10px] tracking-widest text-muted-foreground">
              19:25 - 20:40 WIB
            </p>
            <p className="text-[10px] tracking-widest text-muted-foreground">
              Jakarta, Indonesia
            </p>

            {/* Circular Timer */}
            <div className="relative mt-8 flex h-40 w-40 items-center justify-center rounded-full shadow-sm">
              <svg
                className="absolute inset-0 h-full w-full -rotate-90 transform drop-shadow-sm"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-foreground/10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-primary transition-all duration-1000 ease-linear"
                  strokeDasharray="289"
                  strokeDashoffset={
                    289 - (289 * (nextPrayer?.percentage || 0)) / 100
                  }
                />
              </svg>
              <div className="absolute inset-2 animate-[spin_15s_linear_infinite] rounded-full border border-dashed border-blue-500/30" />
              <div className="absolute inset-4 animate-[spin_10s_linear_infinite_reverse] rounded-full border border-indigo-500/20" />

              <div className="z-10 text-center">
                <div className="text-xl font-bold tracking-widest text-foreground">
                  {nextPrayer?.formattedCountdown || "00:00:00"}
                </div>
                <div className="mt-1 text-[8px] tracking-widest text-blue-400 uppercase">
                  REMAINING
                </div>
              </div>
            </div>

            <div className="mt-6 text-[10px] tracking-widest text-blue-300/70 uppercase">
              NEXT: {nextPrayer?.name || "SUBUH"}
            </div>
          </div>

          {/* Right: Ayah Panel */}
          <div className="relative z-10 flex min-h-[400px] flex-col justify-center lg:col-span-9">
            <div className="pointer-events-none absolute top-1/2 left-1/2 z-0 flex h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 items-center justify-center opacity-[0.03] mix-blend-screen">
              <img
                src={`/assets/surah-emblems/surah-${data.ayah.surahNumber}.svg`}
                alt="Surah emblem watermark"
                className="h-full w-full animate-[spin_180s_linear_infinite] object-contain"
              />
            </div>

            <div className="relative z-10 flex h-full w-full flex-col">
              {/* Header */}
              <div className="mb-8 flex flex-wrap items-center justify-between border-b border-border pb-4">
                <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-3">
                  <span className="rounded-full border border-border bg-primary/10 px-4 py-1.5 text-[10px] font-medium tracking-widest text-primary uppercase">
                    Q.S {data.ayah.surahName.toUpperCase()}{" "}
                    {data.ayah.surahNumber}:{data.ayah.ayahNumber}
                  </span>
                  <span className="ml-2 text-[10px] tracking-[0.2em] text-primary/60 uppercase italic sm:ml-0">
                    "{SURAH_TRANSLATIONS_EN[data.ayah.surahNumber] || "The Surah"}"
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {data.ayah.audioUrl && (
                    <div className="flex items-center gap-3">
                      <audio
                        id="daily-ayah-audio"
                        src={data.ayah.audioUrl}
                        onEnded={() => setIsPlayingAudio(false)}
                      />
                      <button
                        onClick={toggleAudio}
                        className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-foreground transition-colors hover:text-primary"
                        title="Play Audio Recitation"
                      >
                        {isPlayingAudio ? (
                          <Pause className="h-3.5 w-3.5" />
                        ) : (
                          <Play className="h-3.5 w-3.5" />
                        )}
                        <span>PLAY</span>
                      </button>
                      <AudioWaveformVisualizer isPlaying={isPlayingAudio} />
                      <span className="mx-1 text-foreground/20">|</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 opacity-70 transition-opacity hover:opacity-100">
                    <AsbabunNuzulModal
                      surahName={data.ayah.surahName}
                      surahNumber={data.ayah.surahNumber}
                      ayahNumber={data.ayah.ayahNumber}
                    />
                    <WordByWordModal
                      surahName={data.ayah.surahName}
                      surahNumber={data.ayah.surahNumber}
                      ayahNumber={data.ayah.ayahNumber}
                    />
                    <HifzTrainerModal
                      surahName={data.ayah.surahName}
                      surahNumber={data.ayah.surahNumber}
                      ayahNumber={data.ayah.ayahNumber}
                      textArabic={data.ayah.textArabic}
                      translationId={activeAyahTranslation}
                    />
                  </div>
                </div>
              </div>

              {/* Arabic & Number Marker */}
              <div className="mb-4 flex items-start justify-end gap-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-card font-serif text-lg text-foreground">
                  {data.ayah.ayahNumber.toLocaleString("ar-EG")}
                </div>
                <div className="arabic-text max-w-4xl text-right text-4xl leading-[2.5] font-bold text-foreground drop-shadow-sm sm:text-5xl lg:text-6xl">
                  {data.ayah.textArabic}
                </div>
              </div>

              {/* Latin */}
              {data.ayah.textLatin && (
                <p className="mb-12 text-right font-serif text-base font-medium text-primary italic drop-shadow-sm">
                  "{data.ayah.textLatin}"
                </p>
              )}

              {/* 3-Column Footer grid for Ayah details */}
              <div className="mt-auto grid grid-cols-1 gap-8 border-t border-border pt-8 md:grid-cols-3">
                <div className="border-r border-border pr-6">
                  <h4 className="mb-3 text-[10px] tracking-[0.2em] text-primary uppercase">
                    Translation
                  </h4>
                  <p className="text-sm leading-relaxed font-light text-foreground">
                    "{activeAyahTranslation}"
                  </p>
                </div>
                <div className="border-r border-border pr-6">
                  <h4 className="mb-3 text-[10px] tracking-[0.2em] text-primary uppercase">
                    Tafsir &amp; Lore Notes
                  </h4>
                  <p className="text-sm leading-relaxed font-light text-foreground italic">
                    "{customTafsirNote}"
                  </p>
                </div>
                <div>
                  <h4 className="mb-3 text-[10px] tracking-[0.2em] text-primary uppercase">
                    Source
                  </h4>
                  <p className="text-sm leading-relaxed font-light text-foreground">
                    Tafsir As-Sa'di | Tafsir Ibnu Katsir
                    <br />
                    Sahih International Translation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2 & 3: Next Verse/Ayah Pair & Lore */}
        <DailyInspirationLoreCards
          data={data}
          hadithGradeText={hadithGradeText}
          asmaulSurahMeaning={asmaulSurahMeaning}
          asmaulAyahMeaning={asmaulAyahMeaning}
          lang={lang}
        />
      </div>

      {/* Footer Watermark */}
      <div className="relative z-10 mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8 text-[10px] font-medium tracking-[0.2em] text-foreground/40 uppercase">
        <div className="flex items-center gap-3">
          <span>+ MOONWITNESS PLATFORM</span>
          <span className="opacity-30">•</span>
          <span className="hidden font-light italic sm:inline">
            "WHEN THE MOON WITNESSES, WE SHARE MESSAGES."
          </span>
        </div>
        <span className="tracking-[0.3em]">MOONWITNESS.COM</span>
      </div>
    </div>
  )
}
