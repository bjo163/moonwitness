"use client"

import React from "react"
import { Database } from "lucide-react"
import { useResource } from "@workspace/hooks"
import { fetchHadithBooks } from "@moon/client"

const DEFAULT_HADITH_COMPENDIUMS = [
  { n: "Sahih al-Bukhari", v: "7,275", c: "bg-emerald-500" },
  { n: "Sahih Muslim", v: "4,341", c: "bg-emerald-500" },
  { n: "Sunan Abu Dawud", v: "4,804", c: "bg-blue-500" },
  { n: "Jami' at-Tirmidhi", v: "3,955", c: "bg-amber-500" },
  { n: "Sunan an-Nasa'i", v: "5,618", c: "bg-blue-500" },
  { n: "Sunan Ibn Majah", v: "4,256", c: "bg-blue-500" },
  { n: "Muwatta Malik", v: "2,363", c: "bg-emerald-500" },
]

export const HADITH_COMPENDIUMS = DEFAULT_HADITH_COMPENDIUMS

interface HaditsCompendiumsBarProps {
  totalHadiths: number
}

export function HaditsCompendiumsBar({ totalHadiths }: HaditsCompendiumsBarProps) {
  const { data } = useResource(fetchHadithBooks, { storageKey: "mw_hadith_books" })

  const compendiums = data?.books?.length
    ? data.books.map((b: any, i: number) => ({
        n: b.name,
        v: (b.totalItems || 0).toLocaleString(),
        c: ["bg-emerald-500", "bg-blue-500", "bg-amber-500", "bg-cyan-500"][i % 4],
      }))
    : DEFAULT_HADITH_COMPENDIUMS

  return (
    <div className="border-b border-white/10 bg-[#070D1E] py-2 px-4 shadow-inner">
      <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-4 overflow-x-auto text-[10px] text-white/50 no-scrollbar">
        <div className="flex shrink-0 items-center gap-2 font-mono text-cyan-400">
          <Database className="h-3.5 w-3.5" />
          <span className="font-black">TOTAL CORPUS:</span>
          <span className="font-bold text-white">{totalHadiths.toLocaleString()} HADITHS</span>
        </div>
        <div className="flex shrink-0 items-center gap-4 border-l border-white/10 pl-4 font-mono">
          {compendiums.slice(0, 7).map((c, i) => (
            <div key={i} className="flex items-center gap-1.5 whitespace-nowrap">
              <div className={`h-1.5 w-1.5 rounded-full ${c.c}`} />
              <span className="text-white/70">{c.n}</span>
              <span className="text-[9px] text-white/30">({c.v})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
