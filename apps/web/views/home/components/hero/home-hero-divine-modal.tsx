"use client"

import React from "react"
import { AudioWave, DivineMatrixRain } from "./home-hero-matrix-rain"
import type { DailyTransmissionData, ExtraDivineData } from "./home-hero-constants"

export interface HomeHeroDivineModalProps {
  dataReady: boolean
  dailyData: DailyTransmissionData | null
  extraDivineData: ExtraDivineData | null
  onDismiss: () => void
}

export function HomeHeroDivineModal({
  dataReady,
  dailyData,
  extraDivineData,
  onDismiss,
}: HomeHeroDivineModalProps) {
  if (!dataReady || !dailyData) return null

  return (
    <div
      className="fixed inset-0 z-[900] flex animate-in flex-col items-center justify-center bg-card/90 px-4 text-center backdrop-blur-md duration-1000 fade-in"
      onClick={onDismiss}
    >
      {/* Matrix Rain will play as long as the modal is open */}
      <DivineMatrixRain active={true} />

      {/* Audio Recitation (Al-Fatihah) */}
      <audio
        src="https://server8.mp3quran.net/afs/001.mp3"
        autoPlay
        loop
        className="hidden"
      />

      {extraDivineData && (
        <>
          <div className="font-arabic pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 -rotate-90 animate-pulse text-4xl whitespace-nowrap text-primary/30 md:left-12 md:text-6xl">
            {extraDivineData.asmaulLeft}
          </div>
          <div className="font-arabic pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 rotate-90 animate-pulse text-4xl whitespace-nowrap text-primary/30 md:right-12 md:text-6xl">
            {extraDivineData.asmaulRight}
          </div>

          <div className="pointer-events-none absolute top-12 left-1/2 flex w-full max-w-2xl -translate-x-1/2 flex-col items-center gap-1 px-4 opacity-60">
            <div className="font-mono text-[10px] tracking-[0.3em] text-primary">
              {extraDivineData.bookQuote.book}
            </div>
            <div className="font-sans text-xs tracking-widest text-primary italic">
              "{extraDivineData.bookQuote.text}"
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-28 left-1/2 flex w-full max-w-3xl -translate-x-1/2 flex-col items-center gap-1 px-4 opacity-60">
            <div className="font-mono text-[10px] tracking-[0.3em] text-primary">
              PROPHETIC TRADITION (HADITH)
            </div>
            <div className="font-sans text-xs tracking-widest text-primary italic">
              "{extraDivineData.hadith}"
            </div>
          </div>
        </>
      )}

      <div className="flex w-full max-w-4xl flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-3">
          <AudioWave />
          <div className="font-mono text-[9px] tracking-[0.4em] text-primary/70 uppercase">
            Receiving Divine Frequency
          </div>
        </div>

        <h2
          className="font-arabic animate-[pulse_3s_ease-in-out_infinite] text-4xl leading-relaxed text-foreground drop-shadow-sm md:text-5xl lg:text-7xl lg:leading-loose"
          dir="rtl"
        >
          {dailyData.ayah?.textArabic}
        </h2>
        <div className="rounded-full border border-border bg-muted px-6 py-2 font-mono text-sm tracking-widest text-primary shadow-sm">
          Q.S {dailyData.ayah?.surahName?.toUpperCase()}{" "}
          {dailyData.ayah?.surahNumber}:{dailyData.ayah?.ayahNumber}
        </div>
        <p className="max-w-2xl font-sans text-sm leading-relaxed font-light tracking-wide text-primary italic opacity-90 md:text-base lg:text-lg">
          "{dailyData.ayah?.translationId}"
        </p>
      </div>

      <div className="absolute bottom-10 animate-pulse font-mono text-[10px] font-bold tracking-[0.5em] text-foreground/40">
        [ CLICK ANYWHERE TO DISMISS ]
      </div>
    </div>
  )
}
