import type { ReactNode } from "react"
import { Pause, Play } from "lucide-react"
import { AudioWaveformVisualizer, Button } from "@workspace/ui"
import { AsbabunNuzulModal } from "./modals/asbabun-nuzul-modal"
import { HifzTrainerModal } from "./modals/hifz-trainer-modal"
import { WordByWordModal } from "./modals/word-by-word-modal"
import type { DailyData } from "../lib/daily-inspiration-data"

export function DailyInspirationAyahPanel({
  data,
  activeAyahTranslation,
  customTafsirNote,
  isPlayingAudio,
  onAudioEnded,
  onToggleAudio,
}: {
  data: DailyData
  activeAyahTranslation: string
  customTafsirNote: string
  isPlayingAudio: boolean
  onAudioEnded: () => void
  onToggleAudio: () => void
}) {
  const ayah = data.ayah
  return (
    <div className="relative z-10 flex min-h-[400px] flex-col justify-center lg:col-span-9">
      <div className="pointer-events-none absolute top-1/2 left-1/2 z-0 flex h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 items-center justify-center opacity-[0.02]"><img src={`/assets/surah-emblems/surah-${ayah.surahNumber}.svg`} alt="Surah emblem watermark" className="h-full w-full object-contain" /></div>
      <div className="relative z-10 flex h-full w-full flex-col">
        <div className="mb-8 flex flex-wrap items-center justify-between border-b border-border pb-4">
          <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-3"><span className="rounded-md border border-border bg-muted px-3 py-1.5 text-sm font-medium text-primary">Q.S {ayah.surahName} {ayah.surahNumber}:{ayah.ayahNumber}</span><span className="ml-2 text-sm text-muted-foreground italic sm:ml-0">&quot;{ayah.surahName}&quot;</span></div>
          <div className="flex flex-wrap items-center gap-2">
            {ayah.audioUrl ? <div className="flex items-center gap-3"><audio id="daily-ayah-audio" src={ayah.audioUrl} onEnded={onAudioEnded} /><Button type="button" variant="ghost" onClick={onToggleAudio} className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary" title="Play audio recitation" aria-label={isPlayingAudio ? "Pause audio recitation" : "Play audio recitation"}>{isPlayingAudio ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}<span>{isPlayingAudio ? "Pause" : "Play"}</span></Button><AudioWaveformVisualizer isPlaying={isPlayingAudio} /><span className="mx-1 text-foreground/20">|</span></div> : null}
            <div className="flex items-center gap-2 opacity-70 hover:opacity-100"><AsbabunNuzulModal surahName={ayah.surahName} surahNumber={ayah.surahNumber} ayahNumber={ayah.ayahNumber} /><WordByWordModal surahName={ayah.surahName} surahNumber={ayah.surahNumber} ayahNumber={ayah.ayahNumber} /><HifzTrainerModal surahName={ayah.surahName} surahNumber={ayah.surahNumber} ayahNumber={ayah.ayahNumber} textArabic={ayah.textArabic} translationId={activeAyahTranslation} /></div>
          </div>
        </div>
        <div className="mb-4 flex items-start justify-end gap-6"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-card font-serif text-lg text-foreground">{ayah.ayahNumber.toLocaleString("ar-EG")}</div><div className="arabic-text max-w-4xl text-right text-4xl leading-[2.5] font-bold text-foreground sm:text-5xl lg:text-6xl">{ayah.textArabic}</div></div>
        {ayah.textLatin ? <p className="mb-12 text-right font-serif text-base font-medium text-primary italic">&quot;{ayah.textLatin}&quot;</p> : null}
        <div className="mt-auto grid grid-cols-1 gap-8 border-t border-border pt-8 md:grid-cols-3"><DailyInspirationDetail label="Translation" value={`&quot;${activeAyahTranslation}&quot;`} /><DailyInspirationDetail label="Tafsir & Lore Notes" value={`&quot;${customTafsirNote}&quot;`} italic /><DailyInspirationDetail label="Source" value={<>Tafsir As-Sa&apos;di | Tafsir Ibnu Katsir<br />Sahih International Translation</>} /></div>
      </div>
    </div>
  )
}

function DailyInspirationDetail({ label, value, italic = false }: { label: string; value: ReactNode; italic?: boolean }) {
  return <div className="border-r border-border pr-6 last:border-r-0"><h4 className="mb-3 text-sm font-medium text-muted-foreground">{label}</h4><p className={`text-sm leading-relaxed font-light text-foreground ${italic ? "italic" : ""}`}>{value}</p></div>
}
