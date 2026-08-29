"use client"

import React from "react"
import { Database } from "lucide-react"

export const HADITH_COMPENDIUMS = [
  { slug: "bukhari", n: "Sahih al-Bukhari", v: "7,275", c: "bg-emerald-500" },
  { slug: "muslim", n: "Sahih Muslim", v: "4,341", c: "bg-emerald-500" },
  { slug: "abudaud", n: "Sunan Abu Dawud", v: "4,804", c: "bg-blue-500" },
  { slug: "tirmidzi", n: "Jami' at-Tirmidhi", v: "3,955", c: "bg-amber-500" },
  { slug: "nasai", n: "Sunan an-Nasa'i", v: "5,618", c: "bg-blue-500" },
  { slug: "ibnumajah", n: "Sunan Ibn Majah", v: "4,256", c: "bg-blue-500" },
  { slug: "malik", n: "Muwatta Malik", v: "2,363", c: "bg-emerald-500" },
]

interface HaditsCompendiumsBarProps {
  totalHadiths: number
  selectedSlug: string
  onSelect: (slug: string) => void
}

export function HaditsCompendiumsBar({ totalHadiths, selectedSlug, onSelect }: HaditsCompendiumsBarProps) {
  return (
    <div className="border-b border-white/10 bg-[#070D1E] py-2 px-4 shadow-inner">
      <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-4 overflow-x-auto text-[10px] text-white/50 no-scrollbar">
        <div className="flex shrink-0 items-center gap-2 font-mono text-cyan-400">
          <Database className="h-3.5 w-3.5" />
          <span className="font-black">TOTAL CORPUS:</span>
          <span className="font-bold text-white">{totalHadiths.toLocaleString()} HADITHS</span>
        </div>
        <div className="flex shrink-0 items-center gap-4 border-l border-white/10 pl-4 font-mono">
          {HADITH_COMPENDIUMS.slice(0, 7).map((c, i) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => onSelect(c.slug)}
              aria-pressed={selectedSlug === c.slug}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded px-1.5 py-1 transition-colors ${selectedSlug === c.slug ? "bg-cyan-500/10 text-cyan-300" : "hover:bg-white/5"}`}
            >
              <div className={`h-1.5 w-1.5 rounded-full ${c.c}`} />
              <span className="text-white/70">{c.n}</span>
              <span className="text-[9px] text-white/30">({c.v})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
