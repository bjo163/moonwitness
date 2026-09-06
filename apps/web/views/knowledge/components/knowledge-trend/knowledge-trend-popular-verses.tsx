"use client"

import React from "react"

const POPULAR_VERSES = [
  {
    v: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
    ref: "Qur'an 20:114",
    cnt: "12,842",
    c: "#00F0FF",
  },
  {
    v: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    ref: "Qur'an 94:5-6",
    cnt: "9,721",
    c: "#10B981",
  },
  {
    v: "قُلْ سِيرُوا فِي الْأَرْضِ فَانظُرُوا",
    ref: "Qur'an 29:20",
    cnt: "8,653",
    c: "#A855F7",
  },
  {
    v: "وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ",
    ref: "Qur'an 11:88",
    cnt: "7,321",
    c: "#3B82F6",
  },
  {
    v: "فَاذْكُرُونِي أَذْكُرْكُمْ",
    ref: "Qur'an 2:152",
    cnt: "6,128",
    c: "#F59E0B",
  },
]

export function KnowledgeTrendPopularVerses() {
  return (
    <div className="bg-background flex flex-col rounded-xl border border-border p-4 lg:col-span-3">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-[9px] font-black tracking-widest text-primary uppercase">
          POPULAR VERSES
        </div>
        <div className="cursor-pointer text-[8px] text-primary hover:text-foreground">
          View All
        </div>
      </div>

      <div className="flex-1 space-y-4">
        {POPULAR_VERSES.map((vrs, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className="bg-background flex h-5 w-5 shrink-0 items-center justify-center rounded border text-[9px] font-black"
              style={{ borderColor: `${vrs.c}50`, color: vrs.c }}
            >
              {i + 1}
            </div>
            <div className="flex-1 text-right">
              <div
                className="font-arabic mb-1 text-[12px] font-bold text-foreground"
                dir="rtl"
              >
                {vrs.v}
              </div>
              <div className="flex items-center justify-between text-[8px]">
                <span className="font-sans text-primary">{vrs.ref}</span>
                <span className="font-mono text-foreground">{vrs.cnt}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
