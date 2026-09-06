import type { DailyData } from "../lib/daily-inspiration-data"
import { DailyInspirationCard } from "./daily-inspiration-card"
import { DailyInspirationHeaderBar } from "./daily-inspiration-header-bar"
import type { DailyInspirationState } from "./daily-inspiration-client"

export function DailyInspirationContent({ state }: { state: DailyInspirationState }) {
  if (!state.mounted || (state.loading && !state.data)) {
    return <div className="my-8 flex h-64 w-full flex-col items-center justify-center rounded-2xl border border-border bg-card font-sans backdrop-blur-xl"><div className="mb-2 flex animate-pulse items-center gap-3 text-primary"><span className="h-2 w-2 rounded-full bg-primary shadow-sm" /><span className="text-xs font-light tracking-[0.3em] uppercase">ACQUIRING TRANSMISSION...</span></div></div>
  }
  if (!state.data) return null
  return <section className="my-8 font-sans"><DailyInspirationHeaderBar data={state.data} liveTime={state.liveTime} copiedUrl={state.copiedUrl} copied={state.copied} copiedPrompt={state.copiedPrompt} isExporting={state.isExporting} rotationPercentFormatted={state.rotationPercentFormatted} copyDynamicShareUrl={state.copyDynamicShareUrl} copyVerseForWhatsApp={state.copyVerseForWhatsApp} copyImagePrompt={state.copyImagePrompt} exportDashboardPNG={state.exportDashboardPNG} t={state.t} /><DailyInspirationCard data={state.data} nextPrayer={state.nextPrayer} isZapping={state.isZapping} triggerZapEffect={state.triggerZapEffect} isPlayingAudio={state.isPlayingAudio} setIsPlayingAudio={state.setIsPlayingAudio} toggleAudio={state.toggleAudio} activeAyahTranslation={state.activeAyahTranslation} customTafsirNote={state.customTafsirNote} hadithGradeText={state.hadithGradeText} asmaulSurahMeaning={state.asmaulSurahMeaning} asmaulAyahMeaning={state.asmaulAyahMeaning} lang={state.lang} /></section>
}
