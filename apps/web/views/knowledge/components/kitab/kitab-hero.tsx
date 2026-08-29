"use client"

import React from "react"
import { BookOpen, Book, Star, Globe2, Network, BrainCircuit, Play, Pause } from "lucide-react"
import { useGlobalAudio } from "@workspace/state"

interface KitabHeroProps {
  totalScriptures: number
  canonicalsCount: number
  totalVerses: number
  totalProphets: number
}

export function KitabHero({
  totalScriptures,
  canonicalsCount,
  totalVerses,
  totalProphets
}: KitabHeroProps) {
  const audio = useGlobalAudio()

  const stats = [
    {
      icon: Book,
      title: "Total Scriptures",
      value: totalScriptures.toString(),
      sub: "Manuscripts",
      color: "blue",
      isFill: false
    },
    {
      icon: Star,
      title: "Main Divine Sources",
      value: canonicalsCount.toString(),
      sub: "Canonical",
      color: "amber",
      isFill: true
    },
    {
      icon: Globe2,
      title: "Total Languages",
      value: "120+",
      sub: "Translations",
      color: "blue",
      isFill: false
    },
    {
      icon: Network,
      title: "Verified Verses",
      value: totalVerses > 0 ? totalVerses.toLocaleString() : "~ 2.4M+",
      sub: "Cross-References",
      color: "cyan",
      isFill: false
    },
    {
      icon: BrainCircuit,
      title: "AI Research",
      value: "Active",
      sub: "Semantic Search",
      color: "purple",
      isFill: false
    }
  ]

  return (
    <div className="space-y-4">
      {/* 1. Flat Hero Banner */}
      <div className="relative flex h-36 w-full flex-col justify-center border-b border-white/5 px-4 md:h-44 md:px-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl opacity-60 mix-blend-screen">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-900/40 -background -background" />
          <div className="absolute bottom-0 left-1/2 h-[200px] w-[800px] -translate-x-1/2 rounded-[100%] bg-blue-500/30 blur-[100px]" />
          <div className="absolute bottom-[-50px] left-1/2 h-[100px] w-[400px] -translate-x-1/2 rounded-[100%] bg-white/40 blur-[50px]" />
        </div>

        <div className="relative z-10 flex w-full flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-amber-500/30 md:h-16 md:w-16">
              <BookOpen className="h-6 w-6 text-amber-400 md:h-8 md:w-8" />
              <div className="absolute -top-6 h-12 w-[2px] bg-gradient-to-t from-amber-200 to-transparent blur-[1px] md:-top-8 md:h-16" />
              <div className="absolute -top-12 h-24 w-[1px] bg-amber-400/50 md:-top-16 md:h-32" />
            </div>
            <div>
              <div className="mb-1 flex items-center gap-3">
                <h1 className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-2xl font-black tracking-widest text-transparent md:text-3xl">
                  CANONICAL SCRIPTURE CODEX
                </h1>
                <span className="rounded border border-blue-500/30 bg-blue-500/20 px-2 py-0.5 text-[9px] font-bold text-blue-300">
                  Ver 2.0
                </span>
              </div>
              <p className="text-xs font-medium text-blue-200/60">
                All Divine Messages, One Knowledge Hub — The Light of Guidance for All Humanity
              </p>
            </div>
          </div>

          <div className="hidden flex-shrink-0 md:block lg:text-right">
            <div className="font-arabic mb-2 text-2xl text-white/90 drop-shadow-sm md:text-3xl">
              وَذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ
            </div>
            <p className="ml-auto max-w-sm text-[10px] text-white/50 italic md:text-xs">
              &ldquo;This is the Book about which there is no doubt, a guidance for those conscious of Allah.&rdquo;
              <span className="mt-1 block text-[9px] text-blue-400/60 not-italic">
                (QS. Al-Baqarah 2:2)
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* 2. Stats Strip */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`border bg-card ${stat.isFill ? "border-amber-500/50" : "border-white/5"} group flex cursor-default items-center gap-3 rounded-xl p-3 shadow-md transition-colors hover:bg-white/[0.02]`}
          >
            <div
              className={`h-10 w-10 rounded-full ${stat.isFill ? "bg-amber-500/20" : `bg-${stat.color}-500/10`} border border-${stat.color}-500/20 flex items-center justify-center text-${stat.color}-400 transition-transform group-hover:scale-110`}
            >
              <stat.icon className={`h-5 w-5 ${stat.isFill ? "fill-amber-400" : ""}`} />
            </div>
            <div>
              <div className="text-[9px] font-bold tracking-wider text-white/40 uppercase">
                {stat.title}
              </div>
              <div className="text-lg leading-tight font-black text-white">
                {stat.value}
              </div>
              <div className="text-[9px] text-white/30">{stat.sub}</div>
            </div>
          </div>
        ))}

        {/* Quran Recitation Player - Fully Functional */}
        <div
          onClick={() => {
            if (audio.isPlaying) audio.togglePlay()
            else audio.play({ number: 1, name: "Al-Fatihah" })
          }}
          className="group relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-xl border border-blue-500/30 bg-card p-3 shadow-lg transition-colors hover:border-blue-500/60"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-300">
            {audio.isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="ml-0.5 h-5 w-5" />
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <div className="text-[9px] font-bold tracking-wider text-blue-400/80 uppercase">
              Quran Recitation
            </div>
            <div className="flex items-center gap-2 truncate text-sm font-bold text-white">
              Al-Fatihah
              {audio.isPlaying && (
                <div className="flex h-3 items-center gap-0.5">
                  <div className="h-full w-0.5 animate-[bounce_1s_infinite] bg-blue-400" style={{ animationDelay: "0ms" }} />
                  <div className="h-full w-0.5 animate-[bounce_1s_infinite] bg-blue-400" style={{ animationDelay: "200ms" }} />
                  <div className="h-full w-0.5 animate-[bounce_1s_infinite] bg-blue-400" style={{ animationDelay: "400ms" }} />
                  <div className="h-full w-0.5 animate-[bounce_1s_infinite] bg-blue-400" style={{ animationDelay: "100ms" }} />
                </div>
              )}
              {!audio.isPlaying && (
                <div className="flex h-3 items-center gap-0.5 opacity-30">
                  <div className="h-1 w-0.5 bg-blue-400" />
                  <div className="h-2 w-0.5 bg-blue-400" />
                  <div className="h-1.5 w-0.5 bg-blue-400" />
                  <div className="h-1 w-0.5 bg-blue-400" />
                </div>
              )}
            </div>
          </div>
          <div className="flex-shrink-0 font-mono text-[9px] text-blue-300/60">
            1/114
          </div>
        </div>
      </div>
    </div>
  )
}
