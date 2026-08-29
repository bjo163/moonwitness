"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Moon, BookOpen, Landmark, Radio } from "lucide-react"

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

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    const el = document.querySelector(id)
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="my-auto space-y-7 text-left lg:col-span-8">
      <div className="inline-flex items-center gap-2.5 rounded-r-sm border-l-4 border-primary bg-gradient-to-r from-primary/10 via-primary to-transparent px-4 py-1.5 font-mono text-xs font-bold tracking-[0.22em] text-primary uppercase shadow-sm">
        <span>GLOBAL ESCHATOLOGY & DIVINE OBSERVATORY SYSTEM</span>
      </div>

      <div className="space-y-4">
        <h1 className="flex items-baseline gap-4 font-mono text-5xl leading-none font-black tracking-wider text-white uppercase drop-shadow-sm sm:text-7xl md:text-8xl">
          <span>MOONWITNESS</span>
          <span className="font-sans text-4xl font-light tracking-normal text-primary drop-shadow-sm sm:text-6xl md:text-7xl">
            OS
          </span>
        </h1>

        <div className="relative my-8 border-l border-primary/30 pl-6">
          <h2 className="max-w-4xl font-sans text-xl leading-relaxed font-light tracking-[0.15em] text-primary uppercase sm:text-2xl md:text-3xl">
            &quot;When the{" "}
            <span className="font-medium text-primary drop-shadow-sm">
              Moon
            </span>{" "}
            Bears Witness,
            <br />
            We Share the{" "}
            <span className="font-medium text-primary drop-shadow-sm">
              Message
            </span>
            .&quot;
          </h2>

          <button
            onClick={(e) => {
              e.preventDefault()
              if (isDecoding) return
              setIsDecoding(true)
              if (onDecodeTransmission) onDecodeTransmission()
              setTimeout(() => setIsDecoding(false), 41500)
            }}
            className={`group relative mt-6 inline-flex origin-bottom-left -rotate-2 animate-in cursor-pointer items-center gap-3 overflow-hidden border-y border-r border-l-4 px-5 py-2.5 backdrop-blur-md transition-all delay-500 duration-300 duration-1000 fill-mode-both fade-in slide-in-from-top-12 xl:absolute xl:-bottom-3 xl:left-[450px] xl:mt-0 ${
              isDecoding
                ? "animate-[buttonGlitch_0.5s_infinite,godExplode_41s_forwards] border-red-500 bg-red-900/50 text-white shadow-sm"
                : "border-border border-l-cyan-400 bg-primary/10 shadow-sm hover:rotate-0 hover:bg-primary hover:text-black hover:shadow-sm"
            }`}
            title="Decode Today's Transmission"
          >
            <span
              className={`absolute inset-0 h-full w-full -translate-x-full bg-gradient-to-r from-transparent to-transparent ${isDecoding ? "animate-[shimmer_0.1s_infinite] via-red-500/80" : "via-white/30 group-hover:animate-[shimmer_1s_infinite]"}`}
            />
            <span className="relative flex h-2 w-2">
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${isDecoding ? "animate-[ping_0.1s_infinite] bg-white" : "bg-primary group-hover:bg-black"}`}
              />
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${isDecoding ? "bg-white" : "bg-primary group-hover:bg-black"}`}
              />
            </span>
            <div className="flex flex-col items-start leading-tight">
              <span
                className={`w-[180px] text-[11px] font-bold tracking-[0.2em] uppercase transition-all sm:w-[220px] sm:text-[12px] ${
                  isDecoding
                    ? "animate-[textGlitch_0.2s_infinite] text-white drop-shadow-sm"
                    : "text-primary drop-shadow-sm group-hover:text-black group-hover:drop-shadow-none"
                }`}
              >
                {isDecoding ? scrambleText : ctaPhrases[ctaIndex]}
              </span>
              {Boolean(dailyData && dailyData.ayah) && (
                <span className="mt-0.5 text-[9px] font-medium tracking-[0.3em] text-primary group-hover:text-black/70">
                  Q.S {dailyData?.ayah?.surahNumber}:
                  {dailyData?.ayah?.ayahNumber}
                </span>
              )}
            </div>
            <span className="ml-2 transform text-lg font-black text-primary transition-transform duration-300 group-hover:translate-x-2 group-hover:text-black">
              &rarr;
            </span>
          </button>
        </div>
      </div>

      <div className="grid max-w-2xl grid-cols-1 gap-6 border-l-2 border-white/10 py-1 pt-2 pl-4 font-mono text-xs sm:grid-cols-3">
        <div className="group flex items-start gap-3">
          <div className="shrink-0 rounded-full border border-primary bg-primary/10 p-2 text-primary shadow-sm transition-colors group-hover:bg-primary group-hover:text-black">
            <Moon className="h-4 w-4" />
          </div>
          <div>
            <div className="font-black tracking-wider text-white uppercase">
              OBSERVE THE SKY
            </div>
            <div className="mt-0.5 font-sans text-[11px] text-primary">
              Celestial Observation
            </div>
          </div>
        </div>

        <div className="group flex items-start gap-3">
          <div className="shrink-0 rounded-full border border-primary bg-primary/10 p-2 text-primary shadow-sm transition-colors group-hover:bg-primary group-hover:text-black">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <div className="font-black tracking-wider text-white uppercase">
              EXPLORE KNOWLEDGE
            </div>
            <div className="mt-0.5 font-sans text-[11px] text-primary">
              Universal Scripture
            </div>
          </div>
        </div>

        <div className="group flex items-start gap-3">
          <div className="shrink-0 rounded-full border border-primary bg-primary/10 p-2 text-primary shadow-sm transition-colors group-hover:bg-primary group-hover:text-black">
            <Landmark className="h-4 w-4" />
          </div>
          <div>
            <div className="font-black tracking-wider text-white uppercase">
              REFLECT ON HISTORY
            </div>
            <div className="mt-0.5 font-sans text-[11px] text-primary">
              Timeless Reflection
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-5 pt-4">
        <a
          href="#observatory"
          onClick={scrollToSection("#observatory")}
          className="group inline-flex cursor-pointer items-center justify-center gap-3 rounded border border-primary/30 bg-black/40 px-8 py-3.5 font-sans text-[11px] font-medium tracking-[0.3em] text-primary uppercase shadow-sm backdrop-blur-md transition-all duration-500 hover:border-primary hover:bg-primary/20 hover:shadow-sm"
        >
          <Radio className="h-3.5 w-3.5 animate-pulse text-primary" />
          <span>EXPLORE OBSERVATORY</span>
          <ArrowRight className="h-4 w-4 opacity-50 transition-transform group-hover:translate-x-1.5 group-hover:opacity-100" />
        </a>

        <a
          href="#knowledge"
          onClick={scrollToSection("#knowledge")}
          className="group inline-flex cursor-pointer items-center justify-center gap-3 rounded border border-white/10 bg-black/20 px-8 py-3.5 font-sans text-[11px] font-medium tracking-[0.3em] text-primary uppercase backdrop-blur-md transition-all duration-500 hover:border-white/30 hover:bg-white/5 hover:text-white"
        >
          <BookOpen className="h-3.5 w-3.5 opacity-70 transition-opacity group-hover:opacity-100" />
          <span>LEARN THE FRAMEWORK</span>
          <ArrowRight className="h-4 w-4 opacity-30 transition-transform group-hover:translate-x-1.5 group-hover:opacity-100" />
        </a>
      </div>
    </div>
  )
}
