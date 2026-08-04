"use client"

import React, { useEffect, useState } from "react"
import { ShieldAlert, Terminal, Radio, BookOpen } from "lucide-react"
import { internalApi } from "@core/api/internal-api"

type BriefingData = {
  ayah: any
  hadith: any
  cme: any // Coronal Mass Ejection (Space Weather)
}

export function DailyBriefingWidget() {
  const [data, setData] = useState<BriefingData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadBriefing() {
      try {
        setLoading(true)
        // Parallel fetch
        const [quran, hadith, cme] = await Promise.all([
          internalApi<any>("/api/witness/quran/surah?number=2").catch(() => null),
          internalApi<any>("/api/witness/hadith?slug=bukhari&page=1&limit=1").catch(() => null),
          internalApi<any>("/api/external/nasa/donki/cme").catch(() => null)
        ])

        setData({
          ayah: quran?.ayahs?.[254] || { textArabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", translationId: "Ayat Kursi" },
          hadith: hadith?.items?.[0] || { textEn: "Actions are judged by intentions." },
          cme: cme?.[0] || { note: "No significant solar activity." }
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadBriefing()
  }, [])

  if (loading || !data) {
    return (
      <div className="bg-space/60 rounded-2xl border border-blue-500/20 p-5 min-h-[200px] animate-pulse">
        <div className="h-4 w-32 bg-blue-500/20 mb-4 rounded"></div>
        <div className="space-y-2">
          <div className="h-20 w-full bg-black/40 rounded-xl"></div>
          <div className="h-20 w-full bg-black/40 rounded-xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-space/90 rounded-2xl border-2 border-blue-500/40 p-5 shadow-[0_0_30px_rgba(59,130,246,0.15)] relative overflow-hidden">
      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-20"></div>
      
      <div className="mb-4 flex items-center justify-between relative z-10 border-b border-blue-500/30 pb-3">
        <div className="flex items-center gap-2 text-blue-400">
          <ShieldAlert className="h-5 w-5" />
          <h3 className="font-sans text-[11px] font-black tracking-widest uppercase">
            Intel Briefing
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Radio className="h-3 w-3 text-red-500 animate-pulse" />
          <span className="font-mono text-[9px] text-red-400 font-bold tracking-widest uppercase">Live</span>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        {/* Ayah of the day */}
        <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
          <div className="flex items-center gap-2 mb-2 text-blue-300">
            <BookOpen className="h-3 w-3" />
            <span className="text-[9px] font-bold uppercase tracking-wider">Verse Intercept</span>
          </div>
          <div className="font-serif text-lg text-right text-white leading-relaxed mb-1">
            {data.ayah.textArabic}
          </div>
          <div className="font-sans text-[10px] text-blue-200/80 italic">
            "{data.ayah.translationId}"
          </div>
        </div>

        {/* Hadith */}
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
          <div className="flex items-center gap-2 mb-2 text-emerald-400">
            <Terminal className="h-3 w-3" />
            <span className="text-[9px] font-bold uppercase tracking-wider">Prophetic Tradition</span>
          </div>
          <div className="font-mono text-[10px] text-emerald-100 leading-relaxed">
            {data.hadith.textEn?.substring(0, 150) || data.hadith.textOriginal?.substring(0,100)}...
          </div>
        </div>

        {/* Space Weather CME */}
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
          <div className="flex items-center gap-2 mb-2 text-amber-400">
            <Radio className="h-3 w-3" />
            <span className="text-[9px] font-bold uppercase tracking-wider">Space Weather (NASA DONKI)</span>
          </div>
          <div className="font-mono text-[10px] text-amber-200/80">
            {data.cme.note?.substring(0, 100) || "No significant anomaly detected."}
          </div>
        </div>
      </div>
    </div>
  )
}
