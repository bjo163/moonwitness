"use client"

import React from "react"
import { Sparkles, BookOpen, Orbit } from "lucide-react"

export function DivineAstronomyView() {
  return (
    <div className="space-y-6 p-8">
      <div className="flex flex-col gap-2">
        <h1 className="flex items-center gap-3 text-3xl font-black tracking-widest text-foreground uppercase">
          <Orbit className="h-8 w-8 text-fuchsia-400" />
          Divine Astronomy & Cosmic Signs
        </h1>
        <p className="font-mono text-sm text-fuchsia-500/70">
          Correlating Quranic verses with verified astronomical calculations and
          celestial phenomena.
        </p>
      </div>

      <div className="space-y-6 rounded-2xl border border-fuchsia-500/20 bg-card p-8 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-fuchsia-400" />
          <h2 className="font-mono text-lg font-bold text-foreground">
            Surah Ya-Sin (36:38 - 40)
          </h2>
        </div>

        <div className="space-y-4 border-l-2 border-fuchsia-500/40 pl-6">
          <p className="font-arabic text-right text-2xl leading-loose font-bold text-fuchsia-200">
            وَالشَّمْسُ تَجْرِي لِمُسْتَقَرٍّ لَّهَا ۚ ذَٰلِكَ تَقْدِيرُ
            الْعَزِيزِ الْعَلِيمِ
          </p>
          <p className="font-sans text-sm text-foreground italic">
            "Dan matahari berjalan di tempat peredarannya. Demikianlah ketetapan
            Yang Maha Perkasa lagi Maha Mengetahui."
          </p>
        </div>
      </div>
    </div>
  )
}
