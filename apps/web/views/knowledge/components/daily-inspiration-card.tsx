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
    <div id="whatsapp-share-card" className={`w-full rounded-md border border-border bg-card p-6 font-sans text-foreground sm:p-8 ${isZapping ? "bg-primary/10" : ""}`}>
      <div className="mb-6 flex items-center gap-4 border-b border-border pb-4"><span className="text-sm font-medium text-foreground">Daily inspiration</span></div>
      <div className="flex flex-col gap-6"><div className="grid grid-cols-1 gap-6 lg:grid-cols-12"><DailyInspirationCardCyclePanel prayerPeriodName={data.prayerPeriod?.name} nextPrayer={nextPrayer} onZap={triggerZapEffect} /><DailyInspirationAyahPanel data={data} activeAyahTranslation={activeAyahTranslation} customTafsirNote={customTafsirNote} isPlayingAudio={isPlayingAudio} onAudioEnded={() => setIsPlayingAudio(false)} onToggleAudio={toggleAudio} /></div><DailyInspirationLoreCards data={data} hadithGradeText={hadithGradeText} asmaulSurahMeaning={asmaulSurahMeaning} asmaulAyahMeaning={asmaulAyahMeaning} lang={lang} /></div>
      <DailyInspirationCardFooter />
    </div>
  )
}
