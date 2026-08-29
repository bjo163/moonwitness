"use client"

import React from "react"
import { Copy, TrendingUp, Trophy, Star, Target } from "lucide-react"

export function MissionStats() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Top Banner (Spans Full) */}
      <div className="relative flex flex-col items-center justify-between overflow-hidden rounded-xl border border-cyan-500/30 bg-black/40 p-6 backdrop-blur-md md:flex-row lg:col-span-3">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
            alt="Earth from space"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        </div>

        <div className="relative z-10 flex w-full flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex gap-8">
            <div>
              <p className="font-sans text-[10px] font-bold tracking-widest text-cyan-500/70 uppercase">
                Mission ID
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="font-mono text-base font-bold text-white">
                  MW-2025-05-26-71345
                </span>
                <button className="text-cyan-500/50 transition-colors hover:text-cyan-400">
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
                <span className="absolute font-mono text-[11px] font-bold text-white">
                  92%
                </span>
              </div>
              <div>
                <p className="font-sans text-[10px] font-bold tracking-widest text-cyan-500/70 uppercase">
                  Profile Completion
                </p>
                <p className="font-sans text-xs font-semibold text-emerald-400">
                  Excellent
                </p>
                <p className="font-sans text-[9px] text-slate-400">
                  Keep going! Almost perfect.
                </p>
              </div>
            </div>
          </div>

          <div className="text-right">
            <h3 className="font-arabic text-2xl leading-relaxed font-bold text-white drop-shadow-md">
              وَقُلْ رَّبِّ زِدْنِي عِلْمًا
            </h3>
            <p className="mt-1 font-sans text-xs text-slate-300 italic drop-shadow-md">
              "And say, 'My Lord, increase me in knowledge.'"
            </p>
            <p className="font-mono text-[9px] text-cyan-400 drop-shadow-md">
              (Qur'an 20:114)
            </p>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-cyan-500/20 bg-black/40 p-6 backdrop-blur-md">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
        <div>
          <p className="font-sans text-[10px] font-bold tracking-widest text-cyan-500/70 uppercase">
            Knowledge Level
          </p>
          <div className="mt-4 flex items-center gap-4">
            <div className="relative flex h-14 w-12 items-center justify-center text-cyan-400 drop-shadow-sm">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="absolute inset-0 h-full w-full"
              >
                <path d="M12 2L3 7v10l9 5 9-5V7z" />
              </svg>
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-sans text-xl font-bold text-white">
                Level 7
              </h4>
              <p className="font-sans text-xs text-cyan-400">
                Explorer of Truth
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <div className="mb-2 flex justify-between font-mono text-[10px] text-slate-400">
            <span>7,850 / 10,000 XP</span>
            <span>2,150 XP to next level</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div className="relative h-full w-[78.5%] rounded-full bg-gradient-to-r from-cyan-500 to-blue-500">
              <div className="absolute top-0 right-0 bottom-0 w-10 animate-[translateX_2s_infinite] bg-white/20 blur-[2px]"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="group relative flex flex-col overflow-hidden rounded-xl border border-amber-500/20 bg-black/40 p-6 backdrop-blur-md">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-600/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
        <p className="font-sans text-[10px] font-bold tracking-widest text-amber-500/70 uppercase">
          Global Rank
        </p>
        <div className="mt-4 flex flex-1 items-center justify-center">
          <div className="relative">
            <Trophy className="absolute top-1/2 -left-10 h-8 w-8 -translate-y-1/2 text-amber-500 drop-shadow-sm" />
            <h4 className="bg-gradient-to-b from-amber-200 to-amber-500 bg-clip-text font-mono text-4xl font-bold text-transparent drop-shadow-sm">
              #1,248
            </h4>
          </div>
        </div>
        <p className="mt-4 text-center font-sans text-[10px] text-slate-400">
          Top 2.41% of explorers
          <br />
          Worldwide
        </p>
      </div>

      <div className="group relative flex flex-col overflow-hidden rounded-xl border border-emerald-500/20 bg-black/40 p-6 backdrop-blur-md">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-600/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
        <p className="font-sans text-[10px] font-bold tracking-widest text-emerald-500/70 uppercase">
          Mission Score
        </p>
        <div className="relative mt-4 flex flex-1 items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <div className="h-24 w-24 animate-[spin_10s_linear_infinite] rounded-full border border-dashed border-emerald-500" />
          </div>
          <h4 className="bg-gradient-to-b from-emerald-200 to-emerald-500 bg-clip-text font-mono text-4xl font-bold text-transparent drop-shadow-sm">
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
