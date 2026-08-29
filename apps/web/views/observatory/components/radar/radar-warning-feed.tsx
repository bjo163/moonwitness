"use client"

import React from "react"
import { AlertTriangle, CloudLightning, Wind, BookOpen, ShieldCheck } from "lucide-react"
import { useResource } from "@workspace/hooks"
import { fetchEarthquakes } from "@moon/client"

const DEFAULT_ALERTS = [
  { title: "Tropical Depression Warning", loc: "Sunda Strait / Indian Ocean", lvl: "ADVISORY", color: "text-amber-400" },
  { title: "High Wave Convection", loc: "South Java Sea (2.5m - 4.0m)", lvl: "WATCH", color: "text-blue-400" },
  { title: "Squall Line Cell", loc: "Malacca Strait", lvl: "NOTICE", color: "text-cyan-400" },
]

export function RadarWarningFeed() {
  const { data: earthquakeData } = useResource(fetchEarthquakes, { storageKey: "mw_radar_quakes" })

  const alerts = earthquakeData?.features?.length
    ? earthquakeData.features.slice(0, 3).map((f: any) => {
        const mag = f.properties?.mag || 0
        const place = f.properties?.place || "Seismic Station"
        const lvl = mag >= 5 ? "ALERT" : mag >= 4 ? "WATCH" : "NOTICE"
        const color = mag >= 5 ? "text-rose-400" : mag >= 4 ? "text-amber-400" : "text-cyan-400"
        return {
          title: `M${mag.toFixed(1)} Seismic Activity`,
          loc: place,
          lvl,
          color,
        }
      })
    : DEFAULT_ALERTS

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* 1. Active Weather Warnings */}
      <div className="rounded-xl border border-white/10 bg-card p-5 shadow-xl">
        <div className="mb-3 flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span className="font-bold text-white uppercase">Meteorological Alerts</span>
          </div>
          <span className="text-[9px] text-amber-400">BMKG / WMO FEED</span>
        </div>

        <div className="space-y-2 text-[10px]">
          {alerts.map((a: any, i: number) => (
            <div key={i} className="rounded border border-white/5 bg-white/[0.02] p-2.5">
              <div className="flex justify-between font-bold">
                <span className="text-white/90">{a.title}</span>
                <span className={a.color}>{a.lvl}</span>
              </div>
              <div className="mt-0.5 text-[8.5px] text-white/40">{a.loc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Quranic Reflection on Winds & Clouds */}
      <div className="rounded-xl border border-cyan-500/20 bg-gradient-to-b from-card -background p-5 shadow-lg">
        <div className="mb-2 flex items-center gap-2 text-cyan-400">
          <BookOpen className="h-4 w-4" />
          <span className="font-black uppercase">Ar-Rum (The Romans)</span>
        </div>

        <p className="font-arabic my-2 text-right text-sm text-white/95">
          اللَّهُ الَّذِي يُرْسِلُ الرِّيَاحَ فَتُثِيرُ سَحَابًا
        </p>

        <p className="text-[10px] leading-relaxed text-white/60 italic">
          &ldquo;It is Allah who sends the winds, and they stir up clouds, and spread them in the sky however He wills.&rdquo;
        </p>

        <div className="mt-2 text-[8px] text-cyan-400/60">
          QS. Ar-Rum 30:48
        </div>
      </div>
    </div>
  )
}
