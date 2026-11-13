import type { Dispatch, SetStateAction } from 'react'
import type { DailyData } from '../lib/daily-inspiration-data'

export type NextPrayer = { name: string; formattedCountdown: string; percentage: number } | null

export type DailyInspirationState = {
  t: (english: string, indonesian: string) => string
  lang: string
  data: DailyData | null
  loading: boolean
  mounted: boolean
  copied: boolean
  copiedPrompt: boolean
  copiedUrl: boolean
  isPlayingAudio: boolean
  isZapping: boolean
  liveTime: string
  isExporting: boolean
  nextPrayer: NextPrayer
  rotationPercentFormatted: string
  activeAyahTranslation: string
  customTafsirNote: string
  hadithGradeText: string
  asmaulSurahMeaning?: string
  asmaulAyahMeaning?: string
  setIsPlayingAudio: Dispatch<SetStateAction<boolean>>
  triggerZapEffect: () => void
  toggleAudio: () => void
  copyDynamicShareUrl: () => void
  copyVerseForWhatsApp: () => void
  copyImagePrompt: () => void
  exportDashboardPNG: () => Promise<void>
}
