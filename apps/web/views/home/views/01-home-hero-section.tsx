"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { SYSTEM_CONSTANTS } from "@workspace/types"
import {
  HERO_BACKGROUNDS,
  DIVINE_BOOKS_QUOTES,
  HADITH_SNIPPETS,
  NAMES_OF_ALLAH,
  type DailyTransmissionData,
  type ExtraDivineData,
} from "../components/hero/home-hero-constants"
import {
  playIncomingAlertSound,
  playZapSound,
} from "../components/hero/home-hero-audio"
import { HomeHeroDivineModal } from "../components/hero/home-hero-divine-modal"
import {
  HomeHeroShakeOverlay,
  HomeHeroLevelUp,
} from "../components/hero/home-hero-effects"
import { HomeHeroContent } from "../components/home-hero-content"
import { HomeHeroVisualLayer } from "../components/home-hero-visual-layer"

export function HomeHeroSection() {
  const [bgIndex, setBgIndex] = useState(0)
  const [dailyData, setDailyData] = useState<DailyTransmissionData | null>(null)
  const [isZapping, setIsZapping] = useState(false)
  const [isShaking, setIsShaking] = useState(false)
  const [isLevelUp, setIsLevelUp] = useState(false)
  const [xpData, setXpData] = useState({ iman: 500, taqwa: 250, ilm: 1000 })
  const [extraDivineData, setExtraDivineData] =
    useState<ExtraDivineData | null>(null)
  const [dataReady, setDataReady] = useState(false)
  const alertFiredRef = useRef(false)
  const dataReadyRef = useRef(false)

  const triggerReveal = useCallback(() => {
    setIsZapping(true)
    setIsShaking(true)
    playZapSound()
    setTimeout(() => setIsZapping(false), 3000)
    setTimeout(() => {
      setExtraDivineData({
        bookQuote:
          DIVINE_BOOKS_QUOTES[
            Math.floor(Math.random() * DIVINE_BOOKS_QUOTES.length)
          ]!,
        hadith:
          HADITH_SNIPPETS[Math.floor(Math.random() * HADITH_SNIPPETS.length)]!,
        asmaulLeft:
          NAMES_OF_ALLAH[Math.floor(Math.random() * NAMES_OF_ALLAH.length)]!,
        asmaulRight:
          NAMES_OF_ALLAH[Math.floor(Math.random() * NAMES_OF_ALLAH.length)]!,
      })
      setIsShaking(false)
      setDataReady(true)
    }, 41000)
  }, [])

  const handleReset = useCallback(() => {
    setDataReady(false)
    setIsLevelUp(false)
  }, [])

  useEffect(() => {
    if (dataReady && dailyData?.ayah) {
      let isCancelled = false
      const { surahNumber, ayahNumber } = dailyData.ayah
      fetch(
        `https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/ar.alafasy`
      )
        .then((res) => res.json())
        .then((data) => {
          if (!isCancelled && data?.data?.audio) {
            const ayahAudio = new Audio(data.data.audio)
            ayahAudio
              .play()
              .catch((e) => console.warn("Ayah audio auto-play blocked", e))
            ayahAudio.onended = () => {
              if (isCancelled) return
              const levelUpAudio = new Audio("/assets/audio/bgm/Level-Up.mp3")
              levelUpAudio
                .play()
                .catch((e) => console.warn("Level up audio failed", e))
              setXpData({
                iman: Math.floor(Math.random() * 800) + 200,
                taqwa: Math.floor(Math.random() * 500) + 100,
                ilm: Math.floor(Math.random() * 1200) + 300,
              })
              setIsLevelUp(true)
            }
          }
        })
        .catch((e) => console.warn("Failed to fetch Ayah audio", e))
      return () => {
        isCancelled = true
      }
    }
  }, [dataReady, dailyData])

  const fireAlertOnce = useCallback(() => {
    if (alertFiredRef.current || !dataReadyRef.current) return
    alertFiredRef.current = true
    setIsShaking(true)
    playIncomingAlertSound()
    setTimeout(() => setIsShaking(false), 2000)
  }, [])

  useEffect(() => {
    fetch("/api/daily")
      .then((res) => res.json())
      .then((data) => {
        setDailyData(data)
        dataReadyRef.current = true
      })
      .catch(() => {})
    const bgInterval = setInterval(
      () => setBgIndex((prev) => (prev + 1) % HERO_BACKGROUNDS.length),
      SYSTEM_CONSTANTS.POLL_INTERVAL
    )
    return () => clearInterval(bgInterval)
  }, [])

  useEffect(() => {
    const handler = () => {
      fireAlertOnce()
      document.removeEventListener("click", handler)
      document.removeEventListener("touchstart", handler)
      document.removeEventListener("scroll", handler)
      document.removeEventListener("keydown", handler)
    }
    document.addEventListener("click", handler, { once: false })
    document.addEventListener("touchstart", handler, { once: false })
    document.addEventListener("scroll", handler, { once: false })
    document.addEventListener("keydown", handler, { once: false })
    return () => {
      document.removeEventListener("click", handler)
      document.removeEventListener("touchstart", handler)
      document.removeEventListener("scroll", handler)
      document.removeEventListener("keydown", handler)
    }
  }, [fireAlertOnce])

  return (
    <section
      id="hero"
      className={`relative flex min-h-screen w-full flex-col justify-center overflow-hidden bg-background pt-20 pb-10 font-sans text-foreground select-none ${isShaking ? "animate-[heroShake_1.2s_ease-in-out]" : ""}`}
    >
      <HomeHeroShakeOverlay isShaking={isShaking} />
      <HomeHeroDivineModal
        dataReady={dataReady}
        dailyData={dailyData}
        extraDivineData={extraDivineData}
        onDismiss={handleReset}
      />
      <HomeHeroVisualLayer bgIndex={bgIndex} isZapping={isZapping} />
      <HomeHeroLevelUp isLevelUp={isLevelUp} xpData={xpData} />
      <HomeHeroContent
        dailyData={dailyData}
        onDecodeTransmission={triggerReveal}
      />
    </section>
  )
}
