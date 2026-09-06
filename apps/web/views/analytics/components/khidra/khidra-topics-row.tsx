"use client"

import React from "react"
import { BookOpen, Scroll, Map, Compass, Scale, Type, Layers } from "lucide-react"

const TOPICS = [
  { n: "QUR'AN", s: "Verses, Tafsir, Themes", icon: BookOpen, color: "text-success" },
  { n: "HADITH", s: "Hadith, Grades, Explanation", icon: Scroll, color: "text-warning" },
  { n: "HISTORY", s: "Prophets, Events, Civilizations", icon: Map, color: "text-blue-400" },
  { n: "ASTRONOMY", s: "Moon, Stars, Eclipses", icon: Compass, color: "text-primary" },
  { n: "FIQH", s: "Islamic Laws & Rulings", icon: Scale, color: "text-purple-400" },
  { n: "LANGUAGE", s: "Arabic, Root Words", icon: Type, color: "text-pink-400" },
  { n: "GENERAL", s: "General Knowledge & More", icon: Layers, color: "text-muted-foreground" },
]

export function KhidraTopicsRow() {
  return (
    <div className="space-y-3">
      <div className="text-[10px] font-black tracking-widest text-success uppercase">
        ASK KHIDRA ABOUT
      </div>

      <div className="hide-scrollbar flex gap-3 overflow-x-auto pb-2">
        {TOPICS.map((cat, i) => (
          <div
            key={i}
            className="bg-background group w-32 shrink-0 cursor-pointer rounded-lg border border-border p-3 transition-all hover:border-success/40 shadow-xs"
          >
            <cat.icon className={`mb-2 h-5 w-5 ${cat.color}`} />
            <div className="mb-1 text-[10px] font-black text-foreground group-hover:text-success">
              {cat.n}
            </div>
            <div className="text-[8px] leading-tight text-muted-foreground">
              {cat.s}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
