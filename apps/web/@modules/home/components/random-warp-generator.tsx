"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { playWarpSound, playClickSound } from "@core/utils/sound-feedback"
import { useLanguage } from "@core/contexts"
import { Copy, Check, Volume2, Square } from "lucide-react"

type RandomInspirationData = {
  surahNumber: number
  surahName: string
  ayahNumber: number
  textArabic: string
  textLatin: string
  translationId: string
  asmaulName: string
  asmaulArabic: string
  hadithText: string
  audioUrl?: string
}

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

  const sampleVerses: RandomInspirationData[] = [
    {
      surahNumber: 2,
      surahName: "Al-Baqarah",
      ayahNumber: 255,
      textArabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
      textLatin: "Allāhu lā ilāha illā huwal-ḥayyul-qayyūm.",
      translationId:
        "Allah, tidak ada tuhan selain Dia Yang Mahahidup lagi terus-menerus mengurus (makhluk-Nya).",
      asmaulName: "Al-Hayyu (Maha Hidup)",
      asmaulArabic: "الْحَيُّ",
      hadithText:
        "Ayat Kursi adalah ayat yang paling agung dalam Al-Qur'anul Karim. (HR. Muslim)",
      audioUrl:
        "https://cdn.islamic.network/quran/audio/128/ar.alafasy/262.mp3",
    },
    {
      surahNumber: 67,
      surahName: "Al-Mulk",
      ayahNumber: 1,
      textArabic:
        "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
      textLatin:
        "Tabārakallażī biyadihil-mulku wa huwa 'alā kulli syai'in qadīr.",
      translationId:
        "Mahasuci Allah yang menguasai segala kerajaan, dan Dia Mahakuasa atas segala sesuatu.",
      asmaulName: "Al-Malik (Maha Raja)",
      asmaulArabic: "الْمَلِكُ",
      hadithText:
        "Surah Al-Mulk adalah penyelamat dan pelindung dari siksa kubur. (HR. At-Tirmidzi)",
      audioUrl:
        "https://cdn.islamic.network/quran/audio/128/ar.alafasy/5242.mp3",
    },
    {
      surahNumber: 59,
      surahName: "Al-Hasyr",
      ayahNumber: 23,
      textArabic:
        "هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْمَلِكُ الْقُدُّوسُ السَّلَامُ",
      textLatin:
        "Huwallāhullażī lā ilāha illā huwa, al-malikul-quddūsus-salām.",
      translationId:
        "Dialah Allah tidak ada tuhan selain Dia. Maharaja, Yang Mahasuci, Yang Mahasejahtera.",
      asmaulName: "As-Salam (Maha Memberi Kesejahteraan)",
      asmaulArabic: "السَّلاَمُ",
      hadithText:
        "Barangsiapa membaca akhir Surah Al-Hasyr di pagi hari, 70.000 malaikat berselawat untuknya. (HR. At-Tirmidzi)",
      audioUrl:
        "https://cdn.islamic.network/quran/audio/128/ar.alafasy/5149.mp3",
    },
    {
      surahNumber: 55,
      surahName: "Ar-Rahman",
      ayahNumber: 1,
      textArabic:
        "الرَّحْمَٰنُ ﴿١﴾ عَلَّمَ الْقُرْآنَ ﴿٢﴾ خَلَقَ الْإِنسَانَ ﴿٣﴾ عَلَّمَهُ الْبَيَانَ",
      textLatin:
        "Ar-Raḥmān. 'Allamal-qur'ān. Khalaqal-insān. 'Allamahul-bayān.",
      translationId:
        "(Allah) Yang Maha Pengasih. Yang telah mengajarkan Al-Qur'an. Dia menciptakan manusia. Mengajarnya pandai berbicara.",
      asmaulName: "Ar-Rahman (Maha Pengasih)",
      asmaulArabic: "الرَّحْمَٰنُ",
      hadithText:
        "Segala sesuatu memiliki pengantin (puncak keindahan), dan pengantin Al-Qur'an adalah Surah Ar-Rahman. (HR. Al-Baihaqi)",
      audioUrl:
        "https://cdn.islamic.network/quran/audio/128/ar.alafasy/4902.mp3",
    },
  ]

  function stopAudio() {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setIsPlayingAudio(false)
  }

  function toggleAudio() {
    if (!warpData?.audioUrl) return
    if (isPlayingAudio) {
      stopAudio()
    } else {
      stopAudio()
      const audio = new Audio(warpData.audioUrl)
      audioRef.current = audio
      setIsPlayingAudio(true)
      audio.play().catch(() => setIsPlayingAudio(false))
      audio.onended = () => setIsPlayingAudio(false)
      audio.onerror = () => setIsPlayingAudio(false)
    }
  }

  function triggerWarp() {
    stopAudio()
    playWarpSound()
    setWarping(true)
    setIsOpen(true)

    setTimeout(() => {
      const randomIdx = Math.floor(Math.random() * sampleVerses.length)
      const selected = sampleVerses[randomIdx] ?? sampleVerses[0] ?? null
      setWarpData(selected)
      setWarping(false)
    }, 450)
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
      {/* Warp Trigger Button (Task 6) */}
      <button
        onClick={triggerWarp}
        className="btn-primary btn-primary-purple group flex items-center justify-center gap-2 px-3.5 py-1.5 text-[10px] shadow-[0_0_20px_rgba(161,0,255,0.5)] transition-all btn-clip hover:border-primary"
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
      </button>

      {/* Hologram Teleportation Modal - Portal to document.body */}
      {isOpen &&
        mounted &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="bg-space/95 fixed inset-0 z-[99999] flex items-center justify-center p-4 font-mono backdrop-blur-2xl">
            <div
              className="corner-box relative my-auto flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden border border-primary/50 shadow-[0_0_50px_rgba(0,240,255,0.35)] card-clip"
              style={{ backgroundColor: "#0A0F17" }}
            >
              <div className="holo-scan-bar" />

              {/* Modal Header */}
              <div className="bg-space/80 flex shrink-0 items-center justify-between border-b border-primary/20 px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="bg-success h-2 w-2 animate-pulse rounded-full" />
                  <span className="text-xs font-black tracking-widest text-primary uppercase">
                    // TELEPORTATION WARP PORTAL
                  </span>
                </div>
                <button
                  onClick={() => {
                    stopAudio()
                    playClickSound()
                    setIsOpen(false)
                  }}
                  className="bg-space flex items-center gap-1 rounded border border-primary/20 px-2.5 py-1 text-xs font-bold text-primary transition-all hover:border-primary/60 hover:text-white"
                >
                  <span>[✕ CLOSE]</span>
                </button>
              </div>

              {/* Modal Body Container with Custom Sleek Scrollbar */}
              <div className="theme-scrollbar grow space-y-5 overflow-y-auto p-6 sm:p-8">
                {warping ? (
                  <div className="space-y-3 py-16 text-center">
                    <div className="spectrum-bar justify-center">
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>
                    <p className="animate-pulse text-xs font-bold text-primary">
                      // WARPING RANDOM SCRIPTURE TRANSMISSION...
                    </p>
                  </div>
                ) : (
                  warpData && (
                    <div className="animate-in space-y-4 fade-in">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="tag-clip tag-clip-green tag-clip text-[10px]">
                          📖 Q.S {warpData.surahName} ({warpData.surahNumber}:
                          {warpData.ayahNumber})
                        </span>
                        <span className="tag-clip tag-clip-yellow tag-clip text-[9px]">
                          ✨ {warpData.asmaulName}
                        </span>
                      </div>

                      {/* Arabic Text */}
                      <div className="arabic-text py-2 text-right text-2xl leading-[2.2] font-bold text-foreground sm:text-3xl">
                        {warpData.textArabic}
                      </div>

                      <p className="text-success text-xs font-bold italic">
                        &ldquo;{warpData.textLatin}&rdquo;
                      </p>

                      <div className="bg-space tag-clip border border-primary/20 p-3 text-xs text-foreground/90">
                        &ldquo;{warpData.translationId}&rdquo;
                      </div>

                      {/* Hadith Note */}
                      <div className="tag-clip border border-secondary/40 bg-secondary/15 p-3 text-xs text-primary">
                        <span className="mb-1 block font-bold text-accent">
                          📜 KAITAN HADITS NABAWI:
                        </span>
                        &ldquo;{warpData.hadithText}&rdquo;
                      </div>

                      {/* Action Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-primary/15 pt-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={triggerWarp}
                            className="btn-primary px-3.5 py-2 text-[10px] btn-clip"
                          >
                            🔄 WARP AGAIN
                          </button>

                          {warpData.audioUrl && (
                            <button
                              onClick={toggleAudio}
                              className={`btn-primary flex items-center gap-1.5 px-3 py-2 text-[10px] ${
                                isPlayingAudio
                                  ? "btn-primary-purple text-primary"
                                  : "btn-primary-ghost text-success"
                              }`}
                            >
                              {isPlayingAudio ? (
                                <>
                                  <Square className="h-3 w-3 animate-pulse fill-current" />
                                  <span>PAUSE</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="h-3 w-3" />
                                  <span>AUDIO</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={copyTransmissionLink}
                            className="btn-primary btn-primary-ghost flex items-center gap-1 px-3 py-2 text-[10px] text-primary"
                            title="Copy Transmission Link"
                          >
                            {copied ? (
                              <>
                                <Check className="text-success h-3 w-3" />
                                <span className="text-success">COPIED!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>COPY</span>
                              </>
                            )}
                          </button>

                          <Link
                            href={`/kitab/quran/${warpData.surahNumber}`}
                            onClick={() => {
                              stopAudio()
                              setIsOpen(false)
                            }}
                            className="btn-primary px-3.5 py-2 text-[10px] btn-clip"
                          >
                            READ SURAH →
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
