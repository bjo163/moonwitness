"use client"

import React, { useState } from "react"
import { Search, BookOpen, GitBranch, Sparkles, Hash } from "lucide-react"

export interface RootWordItem {
  root: string
  transliteration: string
  primaryMeaning: string
  occurrences: number
  derivedWords: { word: string; meaning: string; count: number }[]
  sampleVerses: { surah: number; ayah: number; text: string }[]
}

const DEFAULT_ROOTS: RootWordItem[] = [
  {
    root: "ش ه د",
    transliteration: "Sh-H-D",
    primaryMeaning: "To witness, testify, be present (Syahadah / MoonWitness)",
    occurrences: 160,
    derivedWords: [
      { word: "شَاهِد", meaning: "Witness", count: 32 },
      { word: "شَهَادَة", meaning: "Testimony", count: 48 },
      { word: "مَشْهُود", meaning: "Witnessed", count: 12 },
    ],
    sampleVerses: [
      { surah: 2, ayah: 185, text: "فَمَنْ شَهِدَ مِنْكُمُ الشَّهْرَ فَلْيَصُمْهُ" },
      { surah: 3, ayah: 18, text: "شَهِدَ اللَّهُ أَنَّهُ لَا إِلَٰهَ إِلَّا هُوَ" },
    ],
  },
  {
    root: "ق م ر",
    transliteration: "Q-M-R",
    primaryMeaning: "Moon, celestial luminance",
    occurrences: 27,
    derivedWords: [
      { word: "الْقَمَر", meaning: "The Moon", count: 27 },
    ],
    sampleVerses: [
      { surah: 54, ayah: 1, text: "اقْتَرَبَتِ السَّاعَةُ وَانشَقَّ الْقَمَرُ" },
      { surah: 36, ayah: 39, text: "وَالْقَمَرَ قَدَّرْنَاهُ مَنَازِلَ حَتَّىٰ عَادَ كَالْعُرْجُونِ الْقَدِيمِ" },
    ],
  },
  {
    root: "ع ل م",
    transliteration: "'A-L-M",
    primaryMeaning: "Knowledge, divine science, awareness",
    occurrences: 854,
    derivedWords: [
      { word: "عِلْم", meaning: "Knowledge", count: 105 },
      { word: "عَالِم", meaning: "Knower", count: 49 },
      { word: "عَلِيم", meaning: "All-Knowing", count: 162 },
    ],
    sampleVerses: [
      { surah: 96, ayah: 5, text: "عَلَّمَ الْإِنسَانَ مَا لَمْ يَعْلَمْ" },
      { surah: 20, ayah: 114, text: "وَقُل رَّبِّ زِدْنِي عِلْمًا" },
    ],
  },
  {
    root: "ح ك م",
    transliteration: "H-K-M",
    primaryMeaning: "Wisdom, governance, judicial decree",
    occurrences: 210,
    derivedWords: [
      { word: "حِكْمَة", meaning: "Wisdom", count: 20 },
      { word: "حَكِيم", meaning: "All-Wise", count: 97 },
      { word: "حُكْم", meaning: "Decree/Command", count: 58 },
    ],
    sampleVerses: [
      { surah: 2, ayah: 269, text: "يُؤْتِي الْحِكْمَةَ مَن يَشَاءُ" },
    ],
  },
]

export function QuranRootMatrix({ className = "" }: { className?: string }) {
  const [query, setQuery] = useState("")
  const [selectedRoot, setSelectedRoot] = useState<RootWordItem>(DEFAULT_ROOTS[0]!)

  const filteredRoots = DEFAULT_ROOTS.filter(
    (r) =>
      r.root.includes(query) ||
      r.transliteration.toLowerCase().includes(query.toLowerCase()) ||
      r.primaryMeaning.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className={`flex flex-col font-mono text-white ${className}`}>
      {/* Search Header */}
      <div className="flex items-center gap-3 bg-cyber-panel p-4 rounded-xl border border-cyan-500/30">
        <Search className="h-5 w-5 text-cyan-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Arabic Root (e.g. 'ش ه د' or 'Sh-H-D' or 'Moon')..."
          className="flex-1 bg-transparent font-sans text-sm outline-none placeholder-zinc-500"
        />
        <span className="text-[10px] text-zinc-500 bg-cyan-950/40 border border-cyan-500/30 px-2 py-1 rounded">
          CONCORDANCE MATRIX
        </span>
      </div>

      {/* Main Grid: Root Selector Left & Deep-Dive Right */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Root List Left */}
        <div className="space-y-2">
          {filteredRoots.map((r) => (
            <button
              key={r.root}
              onClick={() => setSelectedRoot(r)}
              className={`w-full p-4 rounded-xl border text-left transition-all ${
                selectedRoot.root === r.root
                  ? "border-cyan-400 bg-cyan-950/40 shadow-[0_0_25px_rgba(0,240,255,0.25)]"
                  : "border-white/10 bg-cyber-panel/80 hover:border-cyan-500/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold font-serif text-cyan-300">
                  {r.root}
                </span>
                <span className="text-xs text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                  {r.occurrences}x in Qur'an
                </span>
              </div>
              <div className="mt-1 text-xs text-zinc-300 font-bold">{r.transliteration}</div>
              <div className="mt-1 text-[11px] text-zinc-500 line-clamp-1">{r.primaryMeaning}</div>
            </button>
          ))}
        </div>

        {/* Detailed Breakdown Right */}
        <div className="lg:col-span-2 rounded-2xl border border-cyan-500/30 bg-cyber-panel/90 p-6 space-y-6 shadow-xl backdrop-blur-md">
          {/* Header Card */}
          <div className="flex items-start justify-between border-b border-white/10 pb-4">
            <div>
              <div className="text-3xl font-bold font-serif text-cyan-300">{selectedRoot.root}</div>
              <div className="mt-1 text-sm font-bold text-zinc-300">
                Root Transliteration: <span className="text-cyan-400">{selectedRoot.transliteration}</span>
              </div>
              <div className="mt-1 text-xs text-zinc-400">{selectedRoot.primaryMeaning}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-emerald-400">{selectedRoot.occurrences}</div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Total Quranic Citations</div>
            </div>
          </div>

          {/* Derived Morphology Branches */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3">
              <GitBranch className="h-4 w-4" />
              <span>Morphological Derivatives</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {selectedRoot.derivedWords.map((d) => (
                <div key={d.word} className="p-3 rounded-xl border border-white/10 bg-black/40">
                  <div className="text-lg font-serif text-amber-300">{d.word}</div>
                  <div className="text-xs font-bold text-zinc-200 mt-1">{d.meaning}</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">{d.count} occurrences</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Quranic Verses */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">
              <BookOpen className="h-4 w-4" />
              <span>Sample Indexed Quranic Verses</span>
            </div>
            <div className="space-y-3">
              {selectedRoot.sampleVerses.map((v, i) => (
                <div key={i} className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/10">
                  <div className="flex items-center justify-between text-xs text-emerald-400 font-bold mb-2">
                    <span>QS {v.surah}:{v.ayah}</span>
                    <span className="text-[10px] text-zinc-500">EXACT MATCH</span>
                  </div>
                  <div className="text-lg font-serif text-right text-zinc-100 leading-relaxed">
                    {v.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}