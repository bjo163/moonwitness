"use client"

import type { DailyData } from "../lib/daily-inspiration-data"
import { DailyInspirationLoreCards } from "./daily-inspiration-lore-cards"
import { DailyInspirationAyahPanel } from "./daily-inspiration-card-ayah-panel"
import { DailyInspirationCardFooter } from "./daily-inspiration-card-footer"
import { DailyInspirationCardCyclePanel } from "./daily-inspiration-card-cycle-panel"

type NextPrayer = { name: string; formattedCountdown: string; percentage: number } | null

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
}: {
  data: DailyData
  nextPrayer: NextPrayer
  isZapping: boolean
  triggerZapEffect: () => void
  isPlayingAudio: boolean
  setIsPlayingAudio: (value: boolean) => void
  toggleAudio: () => void
  activeAyahTranslation: string
  customTafsirNote: string
  hadithGradeText: string
  asmaulSurahMeaning?: string
  asmaulAyahMeaning?: string
  lang: string
}) {
  return (
    <div id="whatsapp-share-card" className={`relative w-full overflow-hidden rounded-[2rem] border border-border p-6 font-sans text-foreground shadow-sm backdrop-blur-2xl sm:p-10 ${isZapping ? "translate-x-[2px] -translate-y-[2px] bg-primary/10 brightness-150 contrast-125 saturate-150" : "bg-card"}`}>
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent 0%, black 60%, black 100%)", WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 60%, black 100%)" }}><div className="absolute inset-0 bg-cover bg-[center_right] bg-no-repeat" style={{ backgroundImage: "url('/blueprint/BG-HERO-01.png')" }} /></div>
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r -background -background to-transparent" />
      <div className="relative z-10 mb-8 flex items-center gap-4"><span className="text-sm font-medium tracking-[0.3em] text-blue-50 uppercase">MOONWITNESS MISSION TERMINAL</span></div>
      <div className="relative z-10 flex flex-col gap-6"><div className="grid grid-cols-1 gap-8 lg:grid-cols-12"><DailyInspirationCardCyclePanel prayerPeriodName={data.prayerPeriod?.name} nextPrayer={nextPrayer} onZap={triggerZapEffect} /><DailyInspirationAyahPanel data={data} activeAyahTranslation={activeAyahTranslation} customTafsirNote={customTafsirNote} isPlayingAudio={isPlayingAudio} onAudioEnded={() => setIsPlayingAudio(false)} onToggleAudio={toggleAudio} /></div><DailyInspirationLoreCards data={data} hadithGradeText={hadithGradeText} asmaulSurahMeaning={asmaulSurahMeaning} asmaulAyahMeaning={asmaulAyahMeaning} lang={lang} /></div>
      <DailyInspirationCardFooter />
    </div>
  )
}
