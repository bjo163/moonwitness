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
    <div className="rounded-xl border border-cyan-500/20 bg-black/40 p-6 backdrop-blur-md h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-sans text-[10px] font-bold tracking-widest text-cyan-500/70 uppercase">
          Recent Activity
        </h3>
        <button className="font-sans text-[9px] text-cyan-500 hover:text-cyan-400 transition-colors">
          View All
        </button>
      </div>
      
      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-cyan-500/50 before:via-cyan-500/10 before:to-transparent">
        {activities.map((act, i) => (
          <div key={i} className="relative flex items-center justify-between group">
            <div className="flex items-center gap-4 w-full">
              {/* Date/Time Left (Hidden on very small screens, integrated inside on mobile, but let's keep it simple here) */}
              <div className="w-16 shrink-0 text-right">
                <div className="font-sans text-[10px] font-bold text-slate-300">{act.date}</div>
                <div className="font-mono text-[9px] text-slate-500">{act.time}</div>
              </div>
              
              {/* Timeline Node */}
              <div className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-black shadow-[0_0_10px_rgba(0,0,0,0.5)] ${act.color}`}>
                <act.icon className="h-3.5 w-3.5" />
              </div>
              
              {/* Content */}
              <div className="flex-1 flex flex-col xl:flex-row justify-between xl:items-center bg-white/5 rounded-lg border border-white/5 p-3 hover:bg-white/10 transition-colors gap-2">
                <div>
                  <h4 className="font-sans text-xs font-semibold text-white leading-tight">{act.title}</h4>
                  <p className="font-sans text-[10px] text-slate-400 leading-tight mt-1">{act.description}</p>
                </div>
                <div className="hidden sm:flex items-center self-start xl:self-auto gap-1 font-sans text-[9px] text-cyan-500/70 bg-cyan-500/10 px-2 py-1 rounded-full border border-cyan-500/20 whitespace-nowrap">
                  {act.tag}
                  <svg className="h-2 w-2 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
