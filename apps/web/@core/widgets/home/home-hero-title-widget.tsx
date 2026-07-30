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

export function HomeHeroTitleWidget({ dailyData }: { dailyData?: DailyData }) {
  const [ctaIndex, setCtaIndex] = useState(0)
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
      <div className="inline-flex items-center gap-2.5 rounded-r-sm border-l-4 border-primary bg-gradient-to-r from-cyan-950/80 via-primary to-transparent px-4 py-1.5 font-mono text-xs font-bold tracking-[0.22em] text-primary uppercase shadow-[0_0_20px_rgba(0,240,255,0.25)]">
        <span>GLOBAL ESCHATOLOGY & DIVINE OBSERVATORY SYSTEM</span>
      </div>

      <div className="space-y-4">
        <h1 className="flex items-baseline gap-4 font-mono text-5xl leading-none font-black tracking-wider text-white uppercase drop-shadow-[0_0_35px_rgba(255,255,255,0.4)] sm:text-7xl md:text-8xl">
          <span>MOONWITNESS</span>
          <span className="font-sans text-4xl font-light tracking-normal text-primary drop-shadow-[0_0_25px_#00F0FF] sm:text-6xl md:text-7xl">
            OS
          </span>
        </h1>

        <div className="relative my-8 border-l border-primary/30 pl-6">
          <h2 className="max-w-4xl font-sans text-xl leading-relaxed font-light tracking-[0.15em] text-primary uppercase sm:text-2xl md:text-3xl">
            &quot;When the{" "}
            <span className="font-medium text-primary drop-shadow-[0_0_8px_#00F0FF]">
              Moon
            </span>{" "}
            Bears Witness,
            <br />
            We Share the{" "}
            <span className="font-medium text-primary drop-shadow-[0_0_8px_#00F0FF]">
              Message
            </span>
            .&quot;
          </h2>

          <Link
            href="/observatory/daily-transmission"
            className="group relative mt-6 inline-flex origin-bottom-left -rotate-2 animate-in cursor-pointer items-center gap-3 overflow-hidden border-y border-r border-l-4 border-cyan-500/40 border-l-cyan-400 bg-cyan-500/10 px-5 py-2.5 shadow-[20px_20px_40px_rgba(0,0,0,0.5),_0_0_20px_rgba(0,240,255,0.15)] backdrop-blur-md transition-all delay-500 duration-300 duration-1000 fill-mode-both fade-in slide-in-from-top-12 hover:rotate-0 hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] xl:absolute xl:-bottom-3 xl:left-[450px] xl:mt-0"
            title="Decode Today's Transmission"
          >
            <span className="absolute inset-0 h-full w-full -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-[shimmer_1s_infinite]" />
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75 group-hover:bg-black" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400 group-hover:bg-black" />
            </span>
            <div className="flex flex-col items-start leading-tight">
              <span className="w-[180px] text-[11px] font-bold tracking-[0.2em] text-primary uppercase drop-shadow-[0_0_8px_rgba(0,240,255,0.4)] transition-all group-hover:text-black group-hover:drop-shadow-none sm:w-[220px] sm:text-[12px]">
                {ctaPhrases[ctaIndex]}
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
          </Link>
        </div>
      </div>

      <div className="grid max-w-2xl grid-cols-1 gap-6 border-l-2 border-white/10 py-1 pt-2 pl-4 font-mono text-xs sm:grid-cols-3">
        <div className="group flex items-start gap-3">
          <div className="shrink-0 rounded-full border border-primary bg-cyan-500/10 p-2 text-primary shadow-[0_0_12px_rgba(0,240,255,0.3)] transition-colors group-hover:bg-cyan-400 group-hover:text-black">
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
          <div className="shrink-0 rounded-full border border-primary bg-cyan-500/10 p-2 text-primary shadow-[0_0_12px_rgba(0,240,255,0.3)] transition-colors group-hover:bg-cyan-400 group-hover:text-black">
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
          <div className="shrink-0 rounded-full border border-primary bg-cyan-500/10 p-2 text-primary shadow-[0_0_12px_rgba(0,240,255,0.3)] transition-colors group-hover:bg-cyan-400 group-hover:text-black">
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
          className="group inline-flex cursor-pointer items-center justify-center gap-3 rounded border border-primary/30 bg-black/40 px-8 py-3.5 font-sans text-[11px] font-medium tracking-[0.3em] text-primary uppercase shadow-[inset_0_0_20px_rgba(0,255,255,0.05)] backdrop-blur-md transition-all duration-500 hover:border-primary hover:bg-primary/20 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)]"
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
