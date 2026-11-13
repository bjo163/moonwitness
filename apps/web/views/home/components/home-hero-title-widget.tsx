"use client"

import { useState, useEffect } from "react"
import {
  HeroBrand,
  HeroFeatureList,
  HeroNavigation,
  HeroQuote,
} from "./home-hero-title-sections"

const CTA_TIMER_INTERVAL = 4000

type DailyData = {
  ayah?: {
    surahNumber: number | string
    ayahNumber: number | string
  }
}

export function HomeHeroTitleWidget({
  dailyData,
  onDecodeTransmission,
}: {
  dailyData?: DailyData
  onDecodeTransmission?: () => void
}) {
  const [ctaIndex, setCtaIndex] = useState(0)
  const [isDecoding, setIsDecoding] = useState(false)
  const [scrambleText, setScrambleText] = useState(
    "SYSTEM OVERRIDE... INTERCEPTING..."
  )

  useEffect(() => {
    if (!isDecoding) return
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+<>?[]{}|/\\~"
    const original = "GOD LEVEL OVERRIDE... INTERCEPTING..."
    let iterations = 0
    const interval = setInterval(() => {
      setScrambleText(
        original
          .split("")
          .map((char, index) => {
            if (index < iterations) return char
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join("")
      )
      iterations += 1 / 4 // Controls scramble speed
    }, 30)
    return () => clearInterval(interval)
  }, [isDecoding])
  const ctaPhrases = [
    "DECODE TRANSMISSION",
    "INTERCEPT SIGNAL",
    "REVEAL DIVINE MESSAGE",
    "ESTABLISH UPLINK",
  ]

  useEffect(() => {
    const ctaTimer = setInterval(() => {
      setCtaIndex((prev) => (prev + 1) % ctaPhrases.length)
    }, CTA_TIMER_INTERVAL)
    return () => clearInterval(ctaTimer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id)
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="my-auto space-y-7 text-left lg:col-span-8">
      <HeroBrand />
      <div className="space-y-4">
        <h1 className="flex items-baseline gap-4 font-mono text-5xl leading-none font-black tracking-wider text-foreground uppercase drop-shadow-sm sm:text-7xl md:text-8xl">
          <span>MOONWITNESS</span>
          <span className="font-sans text-4xl font-light tracking-normal text-primary drop-shadow-sm sm:text-6xl md:text-7xl">
            OS
          </span>
        </h1>

        <HeroQuote
          isDecoding={isDecoding}
          scrambleText={scrambleText}
          ctaPhrase={ctaPhrases[ctaIndex] ?? "DECODE TRANSMISSION"}
          dailyAyah={dailyData?.ayah}
          onDecode={() => {
            if (isDecoding) return
            setIsDecoding(true)
            onDecodeTransmission?.()
            setTimeout(() => setIsDecoding(false), 41500)
          }}
        />
      </div>
      <HeroFeatureList />
      <HeroNavigation onScroll={scrollToSection} />
    </div>
  )
}
