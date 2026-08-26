"use client"

import React from "react"
import { Moon, BookOpen, FileText, Brain } from "lucide-react"

export function RecentActivity() {
  const activities = [
    {
      title: "Submitted Moon Observation",
      description: "Moon Phase - Waning Crescent 12.4%",
      date: "Today",
      time: "06:45 WIB",
      icon: Moon,
      tag: "Observatory",
      color: "text-blue-400 border-blue-400/30",
    },
    {
      title: "Studied Qur'an Verse",
      description: "Surah Al-Mulk (67:3-5)",
      date: "Today",
      time: "05:12 WIB",
      icon: BookOpen,
      tag: "Scripture",
      color: "text-emerald-400 border-emerald-400/30",
    },
    {
      title: "Completed Research Paper",
      description: "The Miracle of the Moon in Qur'an",
      date: "Yesterday",
      time: "22:30 WIB",
      icon: FileText,
      tag: "Research",
      color: "text-fuchsia-400 border-fuchsia-400/30",
    },
    {
      title: "AI Discussion with KHIDRA",
      description: "Astronomical alignment in ancient times",
      date: "Yesterday",
      time: "15:48 WIB",
      icon: Brain,
      tag: "KHIDRA AI",
      color: "text-cyan-400 border-cyan-400/30",
    },
  ]

  return (
    <div className="h-full rounded-xl border border-cyan-500/20 bg-black/40 p-6 backdrop-blur-md">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-sans text-[10px] font-bold tracking-widest text-cyan-500/70 uppercase">
          Recent Activity
        </h3>
        <button className="font-sans text-[9px] text-cyan-500 transition-colors hover:text-cyan-400">
          View All
        </button>
      </div>

      <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-cyan-500/50 before:via-cyan-500/10 before:to-transparent md:before:mx-auto md:before:translate-x-0">
        {activities.map((act, i) => (
          <div
            key={i}
            className="group relative flex items-center justify-between"
          >
            <div className="flex w-full items-center gap-4">
              {/* Date/Time Left (Hidden on very small screens, integrated inside on mobile, but let's keep it simple here) */}
              <div className="w-16 shrink-0 text-right">
                <div className="font-sans text-[10px] font-bold text-slate-300">
                  {act.date}
                </div>
                <div className="font-mono text-[9px] text-slate-500">
                  {act.time}
                </div>
              </div>

              {/* Timeline Node */}
              <div
                className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-black shadow-[0_0_10px_rgba(0,0,0,0.5)] ${act.color}`}
              >
                <act.icon className="h-3.5 w-3.5" />
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col justify-between gap-2 rounded-lg border border-white/5 bg-white/5 p-3 transition-colors hover:bg-white/10 xl:flex-row xl:items-center">
                <div>
                  <h4 className="font-sans text-xs leading-tight font-semibold text-white">
                    {act.title}
                  </h4>
                  <p className="mt-1 font-sans text-[10px] leading-tight text-slate-400">
                    {act.description}
                  </p>
                </div>
                <div className="hidden items-center gap-1 self-start rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-1 font-sans text-[9px] whitespace-nowrap text-cyan-500/70 sm:flex xl:self-auto">
                  {act.tag}
                  <svg
                    className="h-2 w-2 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
