"use client"

import React from "react"
import { Heart, BookOpen, Search, Star, Clock } from "lucide-react"

export const DOA_TABS = [
  "SEMUA",
  "HARIAN",
  "PAGI",
  "SORE",
  "MALAM",
  "PERJALANAN",
  "PERLINDUNGAN",
  "RUMAH & KELUARGA",
  "SHALAT & IBADAH",
  "DARURAT",
  "LAINNYA",
]

interface DoaHeroStatsProps {
  totalCount: number
  searchQuery: string
  onSearchChange: (val: string) => void
  activeTab: string
  onTabChange: (tab: string) => void
}

export function DoaHeroStats({
  totalCount,
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange
}: DoaHeroStatsProps) {
  const stats = [
    {
      icon: Heart,
      label: "TOTAL DUA",
      value: totalCount > 0 ? totalCount.toString() : "1,248",
      sub: "Terverifikasi",
      color: "text-blue-400"
    },
    {
      icon: BookOpen,
      label: "SUMBER",
      value: "16",
      sub: "Kitab Shahih",
      color: "text-emerald-400"
    },
    {
      icon: Search,
      label: "BAHASA",
      value: "7",
      sub: "Tersedia",
      color: "text-amber-400"
    },
    {
      icon: Star,
      label: "DIAKSES HARI INI",
      value: "12,843",
      sub: "Akses",
      color: "text-primary"
    },
  ]

  return (
    <div className="space-y-4">
      {/* 1. Header Banner */}
      <div className="relative flex flex-col justify-between gap-4 border-b border-white/10 pb-4 md:flex-row md:items-center">
        <div>
          <div className="mb-1 flex items-center gap-3">
            <h1 className="font-mono text-2xl font-black tracking-widest text-white uppercase drop-shadow-md sm:text-3xl">
              DAILY DUA & ADHKAR COMPENDIUM
            </h1>
            <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[9px] font-bold text-emerald-400">
              HISNUL MUSLIM
            </span>
          </div>
          <p className="font-mono text-xs text-white/50">
            Authenticated Prophetic Supplications, Morning/Evening Adhkar, and Spiritual Protection
          </p>
        </div>

        <div className="text-right">
          <div className="font-arabic text-xl text-emerald-400 drop-shadow-sm">
            ادْعُونِي أَسْتَجِبْ لَكُمْ
          </div>
          <p className="font-mono text-[9px] text-white/40 italic">
            &ldquo;Call upon Me; I will respond to you.&rdquo; (QS. Ghafir 40:60)
          </p>
        </div>
      </div>

      {/* 2. Top Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl border border-white/5 bg-card p-3 shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 bg-white/[0.02]">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <div className="font-mono text-[9px] text-white/40">{stat.label}</div>
              <div className="font-mono text-lg font-black text-white">{stat.value}</div>
              <div className="text-[9px] text-white/30">{stat.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Search Bar & Tabs */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search supplication by title, Arabic keyword, or translation..."
            className="w-full rounded-xl border border-white/10 bg-card py-2.5 pr-4 pl-10 text-xs text-white placeholder-white/30 transition-all outline-none focus:border-emerald-500/50 focus:bg-card"
          />
        </div>

        <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
          {DOA_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`rounded-lg border px-3 py-1.5 font-mono text-[10px] font-bold whitespace-nowrap uppercase transition-all ${
                activeTab === tab
                  ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300 shadow-sm"
                  : "border-white/5 bg-card text-white/50 hover:border-white/20 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
