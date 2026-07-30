"use client"

import React from "react"
import { Copy, TrendingUp, Trophy, Star, Target } from "lucide-react"

export function MissionStats() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Top Banner (Spans Full) */}
      <div className="lg:col-span-3 flex flex-col md:flex-row items-center justify-between overflow-hidden rounded-xl border border-cyan-500/30 bg-black/40 backdrop-blur-md relative p-6">
        <div className="absolute inset-0 z-0 opacity-40">
          <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" alt="Earth from space" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row w-full justify-between items-center gap-6">
          <div className="flex gap-8">
            <div>
              <p className="font-sans text-[10px] font-bold tracking-widest text-cyan-500/70 uppercase">
                Mission ID
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="font-mono text-base font-bold text-white">MW-2025-05-26-71345</span>
                <button className="text-cyan-500/50 hover:text-cyan-400 transition-colors">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative flex h-14 w-14 items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-cyan-950"
                    strokeWidth="3"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-400"
                    strokeWidth="3"
                    strokeDasharray="92, 100"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute font-mono text-[11px] font-bold text-white">92%</span>
              </div>
              <div>
                <p className="font-sans text-[10px] font-bold tracking-widest text-cyan-500/70 uppercase">
                  Profile Completion
                </p>
                <p className="font-sans text-xs font-semibold text-emerald-400">Excellent</p>
                <p className="font-sans text-[9px] text-slate-400">Keep going! Almost perfect.</p>
              </div>
            </div>
          </div>

          <div className="text-right">
            <h3 className="font-arabic text-2xl font-bold text-white leading-relaxed drop-shadow-md">
              وَقُلْ رَّبِّ زِدْنِي عِلْمًا
            </h3>
            <p className="mt-1 font-sans text-xs italic text-slate-300 drop-shadow-md">
              "And say, 'My Lord, increase me in knowledge.'"
            </p>
            <p className="font-mono text-[9px] text-cyan-400 drop-shadow-md">(Qur'an 20:114)</p>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="rounded-xl border border-cyan-500/20 bg-black/40 p-6 backdrop-blur-md flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div>
          <p className="font-sans text-[10px] font-bold tracking-widest text-cyan-500/70 uppercase">
            Knowledge Level
          </p>
          <div className="mt-4 flex items-center gap-4">
            <div className="relative flex h-14 w-12 items-center justify-center text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="absolute inset-0 w-full h-full">
                  <path d="M12 2L3 7v10l9 5 9-5V7z" />
               </svg>
               <Target className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-sans text-xl font-bold text-white">Level 7</h4>
              <p className="font-sans text-xs text-cyan-400">Explorer of Truth</p>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <div className="flex justify-between font-mono text-[10px] text-slate-400 mb-2">
            <span>7,850 / 10,000 XP</span>
            <span>2,150 XP to next level</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full w-[78.5%] rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 relative">
               <div className="absolute top-0 right-0 bottom-0 w-10 bg-white/20 blur-[2px] animate-[translateX_2s_infinite]"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-amber-500/20 bg-black/40 p-6 backdrop-blur-md flex flex-col relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <p className="font-sans text-[10px] font-bold tracking-widest text-amber-500/70 uppercase">
          Global Rank
        </p>
        <div className="mt-4 flex items-center justify-center flex-1">
          <div className="relative">
            <Trophy className="absolute -left-10 top-1/2 -translate-y-1/2 h-8 w-8 text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]" />
            <h4 className="font-mono text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-500 drop-shadow-[0_2px_10px_rgba(245,158,11,0.2)]">
              #1,248
            </h4>
          </div>
        </div>
        <p className="mt-4 text-center font-sans text-[10px] text-slate-400">
          Top 2.41% of explorers<br/>Worldwide
        </p>
      </div>

      <div className="rounded-xl border border-emerald-500/20 bg-black/40 p-6 backdrop-blur-md flex flex-col relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <p className="font-sans text-[10px] font-bold tracking-widest text-emerald-500/70 uppercase">
          Mission Score
        </p>
        <div className="mt-4 flex items-center justify-center flex-1 relative">
           <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <div className="h-24 w-24 rounded-full border border-emerald-500 border-dashed animate-[spin_10s_linear_infinite]" />
           </div>
          <h4 className="font-mono text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-emerald-200 to-emerald-500 drop-shadow-[0_2px_10px_rgba(16,185,129,0.2)]">
            8,640
          </h4>
        </div>
        <div className="mt-4 text-center">
          <p className="font-sans text-xs text-slate-300">Excellent Score</p>
          <p className="mt-1 flex items-center justify-center gap-1 font-mono text-[10px] text-emerald-400">
            <TrendingUp className="h-3 w-3" /> 12.5% vs last month
          </p>
        </div>
      </div>
    </div>
  )
}
