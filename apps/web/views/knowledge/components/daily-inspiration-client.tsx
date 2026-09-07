"use client"

import { useEffect, useState } from "react"
import { toPng } from "html-to-image"
import { useLanguage, useGlobalAudio } from "@workspace/state"
import { useLocalStorage } from "@workspace/hooks"
import { ASMAUL_HUSNA_EN, SURAH_TRANSLATIONS_EN, type DailyData } from "../lib/daily-inspiration-data"
import { buildImagePrompt, buildTransmissionText, calculateNextPrayer, formatBilingualDate, playFuturisticZapAudio } from "../lib/daily-inspiration-helpers"
import { DailyInspirationContent } from "./daily-inspiration-content"
import type { DailyInspirationState, NextPrayer } from "./daily-inspiration.types"
export type { DailyInspirationState } from "./daily-inspiration.types"

function useDailyInspirationState(): DailyInspirationState {
  const { t, lang } = useLanguage()
  const { isPlaying, play, togglePlay: globalTogglePlay } = useGlobalAudio()
  const [erpSaved] = useLocalStorage<any[]>("mw_erp_scripture_items", [])
  const [notesSaved] = useLocalStorage<any[]>("mw_erp_scriptures_notes", [])
  const [data, setData] = useState<DailyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [copiedPrompt, setCopiedPrompt] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isZapping, setIsZapping] = useState(false)
  const [liveTime, setLiveTime] = useState("")
  const [isExporting, setIsExporting] = useState(false)
  const [nextPrayer, setNextPrayer] = useState<NextPrayer>(null)

  const getCustomTafsirNote = () => {
    const fallback = t("Contemplation of cosmic obedience to the Sovereign Creator and Divine Unity.", "Tadabbur tentang ketaatan semesta alam kepada Sang Maha Pencipta dan keagungan tauhid.")
    if (!data) return fallback
    try {
      const erpMatch = Array.isArray(erpSaved) ? erpSaved.find((item: any) => item.surah_number === data.ayah.surahNumber && item.ayah_number === data.ayah.ayahNumber) : undefined
      if (erpMatch?.notes) return erpMatch.notes
      const noteMatch = Array.isArray(notesSaved) ? notesSaved.find((item: any) => item.surah?.toLowerCase().includes(data.ayah.surahName?.toLowerCase())) : undefined
      return noteMatch?.noteText?.replace(/^Rotasi\s+Periode\s+Shalat\s+[^-]+-\s*/i, "") || fallback
    } catch (error) {
      console.warn("Failed to parse tafsir notes:", error)
      return fallback
    }
  }

  const getCoolShareUrl = () => {
    if (typeof window === "undefined") return ""
    if (!data) return window.location.origin
    return `${window.location.origin}/s/MW-${data.ayah.surahNumber}-${data.ayah.ayahNumber}-${data.prayerPeriod?.code || "maghrib"}`
  }

  const triggerZapEffect = () => {
    setIsZapping(true)
    window.setTimeout(() => setIsZapping(false), 400)
    playFuturisticZapAudio()
  }

  const exportDashboardPNG = async () => {
    const node = document.getElementById("whatsapp-share-card")
    if (!node || !data) return
    setIsExporting(true)
    try {
      const dataUrl = await toPng(node, { cacheBust: true, pixelRatio: 2 })
      const link = document.createElement("a")
      link.download = `MoonWitness_Transmission_${data.dateStr}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error("Failed to export dashboard:", error)
    } finally {
      setIsExporting(false)
    }
  }

  useEffect(() => {
    const mountTimer = window.setTimeout(() => setMounted(true), 0)
    const load = async () => {
      try {
        const response = await fetch("/api/daily")
        if (response.ok) {
          setData(await response.json())
          window.setTimeout(triggerZapEffect, 300)
        }
      } catch (error) {
        console.warn("Failed to load daily inspiration:", error)
      } finally {
        setLoading(false)
      }
    }
    void load()
    return () => window.clearTimeout(mountTimer)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const update = () => {
      const now = new Date()
      setLiveTime(`${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")} ${lang === "en" ? "UTC+7" : "WIB"}`)
      if (data?.prayerPeriod) setNextPrayer(calculateNextPrayer(now, data.prayerPeriod.code, lang))
    }
    update()
    const timer = window.setInterval(update, 1000)
    return () => window.clearInterval(timer)
  }, [data, lang, mounted])

  useEffect(() => {
    const audio = document.getElementById("daily-ayah-audio") as HTMLAudioElement | null
    if (!audio) return
    if (isPlaying) {
      void audio.play().catch((error) => console.error("Audio play failed", error))
      setIsPlayingAudio(true)
    } else {
      audio.pause()
      setIsPlayingAudio(false)
    }
  }, [isPlaying])

  const toggleAudio = () => {
    if (!document.getElementById("daily-ayah-audio")) return
    if (!isPlaying) play({ number: data?.ayah?.surahNumber || 1, name: data?.ayah?.surahName || "Al-Fatihah" })
    else globalTogglePlay()
  }
  const copyDynamicShareUrl = () => { if (data) { void navigator.clipboard.writeText(getCoolShareUrl()); setCopiedUrl(true); window.setTimeout(() => setCopiedUrl(false), 2500) } }
  const copyVerseForWhatsApp = () => { if (data) { void navigator.clipboard.writeText(buildTransmissionText(data, lang, liveTime, getCoolShareUrl(), getCustomTafsirNote())); setCopied(true); window.setTimeout(() => setCopied(false), 2500) } }
  const copyImagePrompt = () => { if (data) { void navigator.clipboard.writeText(buildImagePrompt(buildTransmissionText(data, lang, liveTime, getCoolShareUrl(), getCustomTafsirNote()))); setCopiedPrompt(true); window.setTimeout(() => setCopiedPrompt(false), 3000) } }

  const activeAyahTranslation = lang === "en" ? data?.ayah.translationEn || data?.ayah.translationId || "" : data?.ayah.translationId || ""
  const asmaulSurahMeaning = data?.asmaulSurah ? (lang === "en" ? ASMAUL_HUSNA_EN[data.asmaulSurah.number] || data.asmaulSurah.translationId : data.asmaulSurah.translationId) : undefined
  const asmaulAyahMeaning = data?.asmaulAyah ? (lang === "en" ? ASMAUL_HUSNA_EN[data.asmaulAyah.number] || data.asmaulAyah.translationId : data.asmaulAyah.translationId) : undefined
  const hadithGradeText = data?.hadith ? (lang === "en" ? data.hadith.levelBadge === "Shahih" || data.hadith.levelBadge === "SAHIH" ? "AUTHENTIC" : data.hadith.levelBadge?.toUpperCase() || "AUTHENTIC" : data.hadith.levelBadge || "SHAHIH") : "AUTHENTIC"
  const rotationPercentFormatted = data?.globalStats ? ((data.globalStats.seenAyahsCount / data.globalStats.totalAyahs) * 100).toFixed(3) : "0.000"

  return { t, lang, data, loading, mounted, copied, copiedPrompt, copiedUrl, isPlayingAudio, isZapping, liveTime, isExporting, nextPrayer, rotationPercentFormatted, activeAyahTranslation, customTafsirNote: getCustomTafsirNote(), hadithGradeText, asmaulSurahMeaning, asmaulAyahMeaning, setIsPlayingAudio, triggerZapEffect, toggleAudio, copyDynamicShareUrl, copyVerseForWhatsApp, copyImagePrompt, exportDashboardPNG }
}

function DailyInspirationDataRenderer() {
  return <DailyInspirationContent state={useDailyInspirationState()} />
}

export function DailyInspirationClient() {
  return <DailyInspirationDataRenderer />
}
