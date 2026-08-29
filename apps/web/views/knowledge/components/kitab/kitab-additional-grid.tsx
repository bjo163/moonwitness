"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Bookmark, ArrowRight, BookOpen, User, Star, Sparkles } from "lucide-react"

export interface AdditionalScriptureItem {
  id: number | string
  name: string
  religion: string
  texts: string
  color: string
  icon: string
  image: string
}

interface KitabAdditionalGridProps {
  scriptures: AdditionalScriptureItem[]
  totalProphets: number
}

export function KitabAdditionalGrid({
  scriptures,
  totalProphets
}: KitabAdditionalGridProps) {
  return (
    <div className="space-y-6">
      {/* Bottom Center 4 Metrics Panels */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative flex flex-col justify-center gap-2 overflow-hidden rounded-xl border border-white/5 bg-card p-4 shadow-lg">
          <div className="absolute top-[-10%] right-[-10%] h-16 w-16 rounded-full bg-blue-500/5" />
          <div className="text-[9px] font-black tracking-widest text-white/40 uppercase">
            KEY VERSES CROSS-REFERENCES
          </div>
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-blue-500/40" />
            <div>
              <div className="text-2xl font-black text-white">5,420</div>
              <div className="text-[9px] text-white/40">Linked Verses</div>
            </div>
          </div>
        </div>

        <div className="relative flex flex-col justify-center gap-2 overflow-hidden rounded-xl border border-white/5 bg-card p-4 shadow-lg">
          <div className="absolute top-[-10%] right-[-10%] h-16 w-16 rounded-full bg-primary/10" />
          <div className="text-[9px] font-black tracking-widest text-white/40 uppercase">
            PROPHETS MENTIONED
          </div>
          <div className="flex items-center gap-3">
            <User className="h-8 w-8 text-primary/40" />
            <div>
              <div className="text-2xl font-black text-white">
                {totalProphets > 0 ? totalProphets : "124"}
              </div>
              <div className="text-[9px] text-white/40">Across All Scriptures</div>
            </div>
          </div>
        </div>

        <div className="relative flex flex-col justify-center gap-2 overflow-hidden rounded-xl border border-white/5 bg-card p-4 shadow-lg">
          <Star className="absolute right-[-10%] bottom-[-20%] h-20 w-20 rotate-12 text-blue-500/5" />
          <div className="flex items-center justify-between">
            <div className="text-[9px] font-black tracking-widest text-white/40 uppercase">
              UNIVERSAL THEMES
            </div>
            <div className="text-lg leading-none font-black text-white">
              18 <span className="text-[8px] font-normal text-white/40">Core Values</span>
            </div>
          </div>
          <div className="relative z-10 mt-1 flex flex-wrap gap-1">
            {["Tauhid", "Mercy", "Justice", "Guidance", "Wisdom", "Life After Death"].map((t, i) => (
              <span
                key={i}
                className="rounded border border-blue-500/20 bg-blue-500/10 px-1.5 py-0.5 text-[8px] text-blue-300"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center gap-2 rounded-xl border border-white/5 bg-card p-4 shadow-lg">
          <div className="text-[9px] font-black tracking-widest text-white/40 uppercase">
            STUDY PATH
          </div>
          <div className="mb-1 flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-amber-500/10">
              <Sparkles className="h-3 w-3 text-amber-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Start Your Journey</div>
              <div className="text-[9px] text-white/40">Step-by-step Learning</div>
            </div>
          </div>
          <button className="mt-1 w-full rounded border border-white/10 bg-white/5 py-1.5 text-[9px] font-black text-white/70 uppercase transition-colors hover:bg-white/10">
            OPEN LEARNING HUB
          </button>
        </div>
      </div>

      {/* Other Sacred Scriptures */}
      <div className="rounded-xl border border-white/5 bg-card p-5 shadow-lg">
        <div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Bookmark className="h-3 w-3 text-primary" />
            <span className="text-[10px] font-black tracking-widest text-white uppercase">
              OTHER SACRED SCRIPTURES <span className="text-white/40">(ADDITIONAL)</span>
            </span>
          </div>
          <div className="hide-scrollbar flex w-full gap-1 overflow-x-auto pb-2 sm:w-auto sm:pb-0">
            {["All Traditions", "Abrahamic", "Eastern", "Indigenous", "Philosophy"].map((t, i) => (
              <button
                key={i}
                className={`rounded border px-3 py-1 text-[9px] font-bold whitespace-nowrap ${i === 0 ? "border-white/20 bg-white/10 text-white" : "border-transparent text-white/40 hover:text-white"}`}
              >
                {t}
              </button>
            ))}
          </div>
          <button className="flex shrink-0 items-center gap-1 text-[9px] font-bold text-white/50 uppercase hover:text-white">
            VIEW COMPARISON TABLE <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
          {scriptures.map((s, idx) => (
            <Link
              href={`/knowledge/kitab/${s.id || ""}`}
              key={idx}
              className="group relative flex h-36 cursor-pointer flex-col overflow-hidden rounded-xl border border-white/5 bg-card shadow-lg transition-all hover:border-white/20"
            >
              <div className="absolute inset-0 z-0 h-full w-full bg-card">
                <Image
                  src={s.image || "/cover_eastern.png"}
                  alt={s.name}
                  fill
                  className="object-cover opacity-60 transition-all duration-[2s] group-hover:scale-110 group-hover:opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t -background -background to-transparent" />
              </div>

              <div className="relative z-10 flex h-full w-full flex-col justify-end p-3">
                <div className="mb-0.5 w-full truncate text-[10px] font-black tracking-wider text-white uppercase drop-shadow-md">
                  {s.name}
                </div>
                <div className="mb-1 w-full truncate text-[8px] text-white/70 drop-shadow-sm">
                  {s.religion}
                </div>
                <div className="font-mono text-[7px] text-white/40">{s.texts}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
