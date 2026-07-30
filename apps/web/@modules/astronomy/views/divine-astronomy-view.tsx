"use client"

import React from "react"
import { Sparkles, BookOpen, Orbit } from "lucide-react"

export function DivineAstronomyView() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-widest text-white uppercase flex items-center gap-3">
          <Orbit className="h-8 w-8 text-fuchsia-400" />
          Divine Astronomy & Cosmic Signs
        </h1>
        <p className="text-sm font-mono text-fuchsia-500/70">
          Correlating Quranic verses with verified astronomical calculations and celestial phenomena.
        </p>
      </div>

      <div className="rounded-2xl border border-fuchsia-500/20 bg-black/40 p-8 backdrop-blur-xl space-y-6">
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-fuchsia-400" />
          <h2 className="text-lg font-bold text-white font-mono">Surah Ya-Sin (36:38 - 40)</h2>
        </div>

        <div className="space-y-4 border-l-2 border-fuchsia-500/40 pl-6">
          <p className="text-right text-2xl font-arabic font-bold text-fuchsia-200 leading-loose">
            وَالشَّمْسُ تَجْرِي لِمُسْتَقَرٍّ لَّهَا ۚ ذَٰلِكَ تَقْدِيرُ الْعَزِيزِ الْعَلِيمِ
          </p>
          <p className="text-sm text-zinc-300 font-sans italic">
            "Dan matahari berjalan di tempat peredarannya. Demikianlah ketetapan Yang Maha Perkasa lagi Maha Mengetahui."
          </p>
        </div>
      </div>
    </div>
  )
}
