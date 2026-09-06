"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import { HomeHeroTitleWidget } from "../components/home-hero-title-widget"
import { HomeTelemetrySidebarWidget } from "../components/home-telemetry-sidebar-widget"
import { HomePlanetaryTelemetryWidget } from "../components/home-planetary-telemetry-widget"
import { HomeCelestialFeedWidget } from "../components/home-celestial-feed-widget"
import { HomeGlobalCoordinatesWidget } from "../components/home-global-coordinates-widget"
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

export function HomeHeroSection() {
  const [bgIndex, setBgIndex] = useState(0)
  const [dailyData, setDailyData] = useState<DailyTransmissionData | null>(null)
  const [isZapping, setIsZapping] = useState(false)
  const [isShaking, setIsShaking] = useState(false)
  const [isLevelUp, setIsLevelUp] = useState(false)
  const [xpData, setXpData] = useState({ iman: 500, taqwa: 250, ilm: 1000 })
  const [extraDivineData, setExtraDivineData] = useState<ExtraDivineData | null>(
    null
  )
  const [dataReady, setDataReady] = useState(false)
  const alertFiredRef = useRef(false)
  const dataReadyRef = useRef(false)

  const triggerReveal = useCallback(() => {
    setIsZapping(true)
    setIsShaking(true)
    playZapSound()

    setTimeout(() => {
      setIsZapping(false)
    }, 3000)

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

    const bgInterval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % HERO_BACKGROUNDS.length)
    }, SYSTEM_CONSTANTS.POLL_INTERVAL)
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
      className={`bg-background relative flex min-h-screen w-full flex-col justify-center overflow-hidden pt-20 pb-10 font-sans text-foreground select-none ${
        isShaking ? "animate-[heroShake_1.2s_ease-in-out]" : ""
      }`}
    >
      <HomeHeroShakeOverlay isShaking={isShaking} />

      <HomeHeroDivineModal
        dataReady={dataReady}
        dailyData={dailyData}
        extraDivineData={extraDivineData}
        onDismiss={handleReset}
      />

      <div
        className={`pointer-events-none fixed inset-0 z-[999] transition-opacity duration-100 ${
          isZapping ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(34,211,238,0.25) 0%, rgba(0,0,0,0) 70%)",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        style={{
          maskImage: "linear-gradient(to bottom, black 75%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 75%, transparent 100%)",
        }}
      >
        {HERO_BACKGROUNDS.map((bg, idx) => (
          <div
            key={bg}
            className={`absolute inset-0 bg-cover bg-[center_top] bg-no-repeat transition-opacity duration-[2000ms] ease-in-out ${
              idx === bgIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url('${bg}')` }}
          />
        ))}
        <div className="pointer-events-none absolute top-[140px] right-[220px] z-10 font-mono text-[10px] tracking-[0.3em] text-foreground/40 uppercase">
          LUNA
        </div>
        <div className="pointer-events-none absolute top-[400px] right-[140px] z-10 font-mono text-[9px] tracking-[0.2em] text-primary/50 uppercase">
          ORBIT-7
        </div>
        <div className="from-background via-background/60 absolute inset-0 w-full bg-gradient-to-r to-transparent sm:w-2/3" />
        <div className="from-background absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />

        <div className="theme-grid-bg absolute inset-0 opacity-15" />
      </div>

      {/* Level Up display Notification */}
      <HomeHeroLevelUp isLevelUp={isLevelUp} xpData={xpData} />

      {/* Foreground Content */}
      <main className="relative z-20 mx-auto my-8 flex w-full max-w-7xl flex-1 flex-col justify-center px-6 sm:my-16 sm:px-10">
        <div className="mb-4">
          <h2 className="font-mono text-[10px] font-black tracking-[0.3em] text-primary/50 uppercase">
            [ SECTION 01 : HERO COMMAND ]
          </h2>
        </div>
        <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-8">
            <HomeHeroTitleWidget
              dailyData={dailyData as any}
              onDecodeTransmission={triggerReveal}
            />
          </div>
          <div className="hidden flex-col items-end justify-center lg:col-span-4 lg:flex">
            <HomeTelemetrySidebarWidget />
          </div>
        </div>
      </main>

      {/* Restored Widgets Footer */}
      <footer className="relative z-20 mx-auto mt-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-6 pb-10 sm:px-10 lg:grid-cols-12">
        <HomePlanetaryTelemetryWidget />

        <div className="flex h-full flex-col gap-5 lg:col-span-5">
          <HomeCelestialFeedWidget />
        </div>

        <HomeGlobalCoordinatesWidget />
      </footer>
    </section>
  )
}
