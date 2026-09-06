"use client"

import React, { useEffect, useState } from "react"
import { useLanguage, useGlobalAudio } from "@workspace/state"
import { useLocalStorage } from "@workspace/hooks"
import { toPng } from "html-to-image"
import {
  DailyData,
  SURAH_TRANSLATIONS_EN,
  ASMAUL_HUSNA_EN,
} from "../lib/daily-inspiration-data"
import {
  formatBilingualDate,
  calculateNextPrayer,
  playFuturisticZapAudio,
  buildTransmissionText,
  buildImagePrompt,
} from "../lib/daily-inspiration-helpers"
import { DailyInspirationCard } from "./daily-inspiration-card"
import { DailyInspirationHeaderBar } from "./daily-inspiration-header-bar"

export function DailyInspirationClient() {
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
  const [liveTime, setLiveTime] = useState<string>("")
  const [isExporting, setIsExporting] = useState(false)
  const [nextPrayer, setNextPrayer] = useState<{
    name: string
    formattedCountdown: string
    percentage: number
  } | null>(null)

  async function exportDashboardPNG() {
    const node = document.getElementById("whatsapp-share-card")
    if (!node || !data) return

    setIsExporting(true)
    try {
      const dataUrl = await toPng(node, { cacheBust: true, pixelRatio: 2 })
      const link = document.createElement("a")
      link.download = `MoonWitness_Transmission_${data.dateStr}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error("Failed to export dashboard:", err)
    } finally {
      setIsExporting(false)
    }
  }

  const triggerZapEffect = () => {
    setIsZapping(true)
    setTimeout(() => setIsZapping(false), 400)
    playFuturisticZapAudio()
  }

  useEffect(() => {
    setTimeout(() => setMounted(true), 0)

    async function fetchDailyData() {
      try {
        const res = await fetch("/api/daily")
        if (res.ok) {
          const json = await res.json()
          setData(json)
          setTimeout(triggerZapEffect, 300)
        }
      } catch (err) {
        console.warn("Failed to load daily inspiration:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDailyData()
  }, [])

  useEffect(() => {
    if (!mounted) return

    function updateTimeAndCountdown() {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, "0")
      const minutes = now.getMinutes().toString().padStart(2, "0")
      const seconds = now.getSeconds().toString().padStart(2, "0")
      setLiveTime(
        `${hours}:${minutes}:${seconds} ${lang === "en" ? "UTC+7" : "WIB"}`
      )

      if (!data?.prayerPeriod) return
      setNextPrayer(calculateNextPrayer(now, data.prayerPeriod.code, lang))
    }

    updateTimeAndCountdown()
    const timer = setInterval(updateTimeAndCountdown, 1000)
    return () => clearInterval(timer)
  }, [mounted, data, lang])

  useEffect(() => {
    const audioEl = document.getElementById(
      "daily-ayah-audio"
    ) as HTMLAudioElement
    if (!audioEl) return

    if (isPlaying) {
      audioEl.play().catch((e) => console.error("Audio play failed", e))
      setTimeout(() => setIsPlayingAudio(true), 0)
    } else {
      audioEl.pause()
      setIsPlayingAudio(false)
    }
  }, [isPlaying])

  const toggleAudio = () => {
    const audioEl = document.getElementById(
      "daily-ayah-audio"
    ) as HTMLAudioElement
    if (!audioEl) return

    if (!isPlaying) {
      play({
        number: data?.ayah?.surahNumber || 1,
        name: data?.ayah?.surahName || "Al-Fatihah",
      })
    } else {
      globalTogglePlay()
    }
  }

  function getCustomTafsirNote(): string {
    if (!data)
      return t(
        "Contemplation of universal obedience to the Almighty Creator and Divine Unity.",
        "Perenungan tentang ketaatan alam kepada Perintah Tuhan dan keagungan tauhid."
      )

    try {
      if (Array.isArray(erpSaved) && erpSaved.length > 0) {
        const match = erpSaved.find(
          (item: any) =>
            item.surah_number === data.ayah.surahNumber &&
            item.ayah_number === data.ayah.ayahNumber
        )
        if (match && match.notes) {
          return match.notes
        }
      }

      if (Array.isArray(notesSaved) && notesSaved.length > 0) {
        const match = notesSaved.find((n: any) =>
          n.surah?.toLowerCase().includes(data.ayah.surahName?.toLowerCase())
        )
        if (match?.noteText) {
          return match.noteText.replace(
            /^Rotasi\s+Periode\s+Shalat\s+[^-]+-\s*/i,
            ""
          )
        }
      }
    } catch (e) {
      console.warn("Failed to parse tafsir notes:", e)
    }

    return t(
      "Contemplation of cosmic obedience to the Sovereign Creator and Divine Unity.",
      "Tadabbur tentang ketaatan semesta alam kepada Sang Maha Pencipta dan keagungan tauhid."
    )
  }

  function getCoolShareUrl(): string {
    if (typeof window === "undefined") return ""
    if (!data) return window.location.origin
    const s = data.ayah.surahNumber
    const a = data.ayah.ayahNumber
    const period = data.prayerPeriod?.code || "maghrib"
    const coolId = `MW-${s}-${a}-${period}`
    return `${window.location.origin}/s/${coolId}`
  }

  function copyDynamicShareUrl() {
    if (!data) return
    const dynamicUrl = getCoolShareUrl()
    navigator.clipboard.writeText(dynamicUrl)
    setCopiedUrl(true)
    setTimeout(() => setCopiedUrl(false), 2500)
  }

  function copyVerseForWhatsApp() {
    if (!data) return
    const textToCopy = buildTransmissionText(
      data,
      lang,
      liveTime,
      getCoolShareUrl(),
      getCustomTafsirNote()
    )
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  function copyImagePrompt() {
    if (!data) return
    const transmissionText = buildTransmissionText(
      data,
      lang,
      liveTime,
      getCoolShareUrl(),
      getCustomTafsirNote()
    )
    const prompt = buildImagePrompt(transmissionText)
    navigator.clipboard.writeText(prompt)
    setCopiedPrompt(true)
    setTimeout(() => setCopiedPrompt(false), 3000)
  }

  const rotationPercentRaw = data?.globalStats
    ? (data.globalStats.seenAyahsCount / data.globalStats.totalAyahs) * 100
    : 0
  const rotationPercentFormatted = rotationPercentRaw.toFixed(3)

  if (!mounted || (loading && !data)) {
    return (
      <div className="my-8 flex h-64 w-full flex-col items-center justify-center rounded-2xl border border-border bg-card font-sans backdrop-blur-xl">
        <div className="mb-2 flex animate-pulse items-center gap-3 text-primary">
          <span className="h-2 w-2 rounded-full bg-primary shadow-sm" />
          <span className="text-xs font-light tracking-[0.3em] uppercase">
            ACQUIRING TRANSMISSION...
          </span>
        </div>
      </div>
    )
  }

  if (!data) return null

  const surahMeaning =
    lang === "en"
      ? SURAH_TRANSLATIONS_EN[data.ayah.surahNumber] ||
        data.ayah.surahTranslationEn ||
        data.ayah.surahTranslationId
      : data.ayah.surahTranslationId

  const asmaulSurahMeaning =
    lang === "en" && data.asmaulSurah
      ? ASMAUL_HUSNA_EN[data.asmaulSurah.number] ||
        data.asmaulSurah.translationId
      : data.asmaulSurah?.translationId

  const asmaulAyahMeaning =
    lang === "en" && data.asmaulAyah
      ? ASMAUL_HUSNA_EN[data.asmaulAyah.number] || data.asmaulAyah.translationId
      : data.asmaulAyah?.translationId

  const hadithGradeText =
    lang === "en"
      ? data.hadith?.levelBadge === "Shahih" ||
        data.hadith?.levelBadge === "SAHIH"
        ? "AUTHENTIC"
        : data.hadith?.levelBadge?.toUpperCase() || "AUTHENTIC"
      : data.hadith?.levelBadge || "SHAHIH"

  const activeAyahTranslation =
    lang === "en"
      ? data.ayah.translationEn || data.ayah.translationId
      : data.ayah.translationId

  return (
    <section className="my-8 font-sans">
      {/* ──── TOP display (Sleek Dashboard Header) ──── */}
      <DailyInspirationHeaderBar
        data={data}
        liveTime={liveTime}
        copiedUrl={copiedUrl}
        copied={copied}
        copiedPrompt={copiedPrompt}
        isExporting={isExporting}
        rotationPercentFormatted={rotationPercentFormatted}
        copyDynamicShareUrl={copyDynamicShareUrl}
        copyVerseForWhatsApp={copyVerseForWhatsApp}
        copyImagePrompt={copyImagePrompt}
        exportDashboardPNG={exportDashboardPNG}
        t={t}
      />

      {/* ═══ MISSION SCREEN CONTAINER CARD ═══ */}
      <DailyInspirationCard
        data={data}
        nextPrayer={nextPrayer}
        isZapping={isZapping}
        triggerZapEffect={triggerZapEffect}
        isPlayingAudio={isPlayingAudio}
        setIsPlayingAudio={setIsPlayingAudio}
        toggleAudio={toggleAudio}
        activeAyahTranslation={activeAyahTranslation}
        customTafsirNote={getCustomTafsirNote()}
        hadithGradeText={hadithGradeText}
        asmaulSurahMeaning={asmaulSurahMeaning}
        asmaulAyahMeaning={asmaulAyahMeaning}
        lang={lang}
      />
    </section>
  )
}
