"use client"

import { useEffect, useRef, useState } from "react"
import { playClickSound, playWarpSound, fetchSurahDetail } from "@moon/client"
import { useLanguage } from "@workspace/state"
import { Button } from "@workspace/ui"
import { RandomWarpGeneratorModal } from "./random-warp-generator-modal"
import {
  SAMPLE_VERSES,
  type RandomInspirationData,
} from "./random-warp-generator-data"

export function RandomWarpGenerator() {
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [warping, setWarping] = useState(false)
  const [warpData, setWarpData] = useState<RandomInspirationData | null>(null)
  const [copied, setCopied] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    setTimeout(() => setMounted(true), 0)
  }, [])

  function stopAudio() {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setIsPlayingAudio(false)
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        stopAudio()
        setIsOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  function toggleAudio() {
    if (!warpData?.audioUrl) return
    if (isPlayingAudio) {
      stopAudio()
      return
    }
    stopAudio()
    const audio = new Audio(warpData.audioUrl)
    audioRef.current = audio
    setIsPlayingAudio(true)
    audio.play().catch(() => setIsPlayingAudio(false))
    audio.onended = () => setIsPlayingAudio(false)
    audio.onerror = () => setIsPlayingAudio(false)
  }

  async function triggerWarp() {
    stopAudio()
    playWarpSound()
    setWarping(true)
    setIsOpen(true)
    try {
      const randomSurah = Math.floor(Math.random() * 114) + 1
      const surahData = await fetchSurahDetail(randomSurah)
      if (surahData && surahData.ayahs && surahData.ayahs.length > 0) {
        const randomAyahIdx = Math.floor(Math.random() * surahData.ayahs.length)
        const ayah = surahData.ayahs[randomAyahIdx]!
        setWarpData({
          surahNumber: surahData.surah.number,
          surahName: surahData.surah.name,
          ayahNumber: ayah.number,
          textArabic: ayah.textArabic || "",
          textLatin: ayah.textLatin || "",
          translationId:
            ayah.translationId || "Kalamullah yang penuh hikmah dan petunjuk.",
          asmaulName: "Al-Hakeem (Maha Bijaksana)",
          asmaulArabic: "الْحَكِيمُ",
          hadithText: `QS. ${surahData.surah.name} Ayat ${ayah.number} — Wahyu Suci Al-Qur'anul Karim.`,
          audioUrl:
            ayah.audioUrl ||
            `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`,
        })
        setWarping(false)
        return
      }
    } catch {
      // Graceful fallback to rich sample verses.
    }
    const randomIdx = Math.floor(Math.random() * SAMPLE_VERSES.length)
    setWarpData(SAMPLE_VERSES[randomIdx] ?? SAMPLE_VERSES[0] ?? null)
    setWarping(false)
  }

  function closeModal() {
    stopAudio()
    playClickSound()
    setIsOpen(false)
  }

  function navigateToSurah() {
    stopAudio()
    setIsOpen(false)
  }

  function copyTransmissionLink() {
    if (!warpData) return
    playClickSound()
    const link = `${window.location.origin}/kitab/quran/${warpData.surahNumber}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <Button type="button" variant="ghost"
        onClick={triggerWarp}
        className="btn-primary btn-primary-purple group flex items-center justify-center gap-2 px-3.5 py-1.5 text-[10px] shadow-sm transition-all hover:border-primary"
        suppressHydrationWarning
      >
        <span
          className="flex animate-pulse items-center text-xs font-black text-primary transition-transform duration-500 group-hover:rotate-180"
          suppressHydrationWarning
        >
          🌀
        </span>
        <span
          suppressHydrationWarning
          className="flex items-center pt-[1px] font-black tracking-widest text-foreground group-hover:text-primary"
        >
          {mounted
            ? t("<< EXECUTE RANDOM WISDOM >>", "<< EXECUTE RANDOM HIKMAH >>")
            : "<< EXECUTE RANDOM WISDOM >>"}
        </span>
      </Button>
      <RandomWarpGeneratorModal
        mounted={mounted}
        isOpen={isOpen}
        warping={warping}
        warpData={warpData}
        copied={copied}
        isPlayingAudio={isPlayingAudio}
        onClose={closeModal}
        onNavigate={navigateToSurah}
        onWarp={triggerWarp}
        onToggleAudio={toggleAudio}
        onCopy={copyTransmissionLink}
      />
    </>
  )
}
