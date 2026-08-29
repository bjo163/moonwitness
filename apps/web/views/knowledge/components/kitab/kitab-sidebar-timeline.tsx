"use client"

import React from "react"
import { BookOpen, Star, Check } from "lucide-react"

interface KitabLeftSidebarProps {
  activeCollection: "all" | "canonical" | "additional"
  onCollectionChange: (collection: "all" | "canonical" | "additional") => void
}

export function KitabLeftSidebar({ activeCollection, onCollectionChange }: KitabLeftSidebarProps) {
  return (
    <div className="w-full flex-shrink-0 space-y-6 lg:w-48">
      <div>
        <h3 className="mb-3 px-2 text-[9px] font-black tracking-widest text-blue-400 uppercase">
          Knowledge Menu
        </h3>
        <div className="space-y-1">
          {[
            "Overview",
            "Qur'an (Kahf)",
            "Taurat (Torah)",
            "Zabur (Psalms)",
            "Injil (Gospel)",
            "Other Scriptures",
          ].map((item, i) => {
            const collection = i === 0 ? "all" : i === 5 ? "additional" : "canonical"
            const isActive = activeCollection === collection
            return (
            <button
              key={i}
              type="button"
              onClick={() => onCollectionChange(collection as "all" | "canonical" | "additional")}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs font-bold transition-all ${isActive ? "border border-cyber-cyan/30 bg-cyber-cyan/10 text-cyber-cyan" : "text-white/60 hover:bg-white/5 hover:text-white"}`}
            >
              <BookOpen
                className={`h-3.5 w-3.5 ${i === 0 ? "text-blue-400" : "text-white/30"}`}
              />
              {item}
            </button>
            )
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-3 px-2 text-[9px] font-black tracking-widest text-blue-400 uppercase">
          Quick Access
        </h3>
        <div className="space-y-1">
          {[
            "Ayat of the Day",
            "Hadith Collection",
            "Daily Adhkar",
            "Prophetic Stories",
            "Comparative Study",
            "Research Lab",
          ].map((item, i) => (
            <button
              key={i}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[11px] font-medium text-white/50 transition-all hover:bg-white/5 hover:text-white"
            >
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500/10">
                <Star className="h-2 w-2 text-blue-400/50" />
              </div>
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="mb-3 px-2 text-[9px] font-black tracking-widest text-blue-400 uppercase">
          Filter
        </h3>
        {["All Languages", "All Topics", "All Periods", "All Traditions"].map((f, i) => (
          <select
            key={i}
            className="w-full appearance-none rounded-lg border border-white/5 bg-[#0A1224] px-3 py-2 text-[10px] text-white/60 transition-colors outline-none focus:border-blue-500/50"
          >
            <option>{f}</option>
          </select>
        ))}
      </div>
    </div>
  )
}

export function KitabRightTimeline() {
  const timelineItems = [
    {
      title: "Taurat",
      year: "~1445 BCE",
      author: "Moses (a.s)",
      color: "amber",
    },
    {
      title: "Zabur",
      year: "~1000 BCE",
      author: "David (a.s)",
      color: "blue",
    },
    {
      title: "Injil",
      year: "~30 CE",
      author: "Jesus (a.s)",
      color: "purple",
    },
    {
      title: "Al-Qur'an",
      year: "610-632 CE",
      author: "Muhammad ﷺ",
      subauthor: "(Final & Universal)",
      color: "emerald",
    },
  ]

  return (
    <div className="w-full flex-shrink-0 space-y-4 lg:w-56">
      <div className="rounded-xl border border-white/5 bg-[#0A1224] p-5 shadow-lg">
        <h3 className="mb-5 text-[9px] font-black tracking-widest text-blue-400 uppercase">
          Revelation Timeline
        </h3>

        <div className="relative space-y-4 before:absolute before:inset-0 before:ml-[15px] before:w-0.5 before:bg-white/5">
          {timelineItems.map((item, i) => (
            <div key={i} className="group relative flex items-start gap-4">
              <div
                className="z-10 flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-[#0A1224] bg-blue-500/20 text-blue-400 shadow-[0_0_0_1px_rgba(255,255,255,0.1)]"
              >
                <BookOpen className="h-3.5 w-3.5" />
              </div>
              <div className="pt-0.5">
                <div className="text-[11px] font-black text-white">{item.title}</div>
                <div className="font-mono text-[9px] text-blue-400">{item.year}</div>
                <div className="text-[9px] text-white/50">{item.author}</div>
                {item.subauthor && (
                  <div className="text-[8px] text-white/30">{item.subauthor}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-white/5 pt-5">
          <div className="mb-2 flex items-center gap-1.5 text-[9px] font-black text-white uppercase">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Final Revelation (Khatam)
          </div>
          <p className="mb-3 text-[9px] leading-relaxed text-white/40">
            Al-Qur&apos;an — Guidance for all humanity.
          </p>
          <ul className="mb-5 space-y-1.5 text-[8.5px] text-white/60">
            <li className="flex items-start gap-1.5">
              <Check className="h-3 w-3 shrink-0 text-emerald-500" /> Clarifies & Confirms
            </li>
            <li className="flex items-start gap-1.5">
              <Check className="h-3 w-3 shrink-0 text-emerald-500" /> Completes Previous Scriptures
            </li>
            <li className="flex items-start gap-1.5">
              <Check className="h-3 w-3 shrink-0 text-emerald-500" /> Preserved Eternally by Allah SWT
            </li>
          </ul>
          <button className="w-full rounded border border-white/10 bg-white/5 py-1.5 text-[9px] font-black text-white/70 uppercase transition-colors hover:bg-white/10">
            Learn More
          </button>
        </div>
      </div>

      {/* Arabic Quote */}
      <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-amber-500/20 bg-[#0A1224] p-5 text-center shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent opacity-50" />
        <div className="font-arabic relative z-10 mb-2 text-xl text-amber-400 drop-shadow-md">
          كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ
        </div>
        <p className="relative z-10 text-[9px] text-white/60 italic">
          &ldquo;Every soul will taste death.&rdquo;
          <span className="mt-1 block text-[8px] text-white/30 not-italic">
            (QS. Ali Imran 3:185)
          </span>
        </p>
      </div>
    </div>
  )
}
