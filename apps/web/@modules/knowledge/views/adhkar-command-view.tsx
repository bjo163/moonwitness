"use client"

import React, { useState, useEffect } from "react"
import { MoonClient } from "@moon/client"
import { useLanguage, useToast } from "@core/contexts"
import { useAchievementStore } from "@core/store/achievement-store"
import { Shield, Sun, Moon, Sunrise, Coffee, Activity, ArrowRight, Heart } from "lucide-react"

type Adhkar = {
  id: string
  title: string
  text_arabic: string
  text_latin: string
  translation_en: string
  category: string
  timing: string
  source: string
}

export function AdhkarCommandView() {
  const [data, setData] = useState<Adhkar[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>("Pagi/Petang")
  const { lang } = useLanguage()
  const { toast, success } = useToast()
  const unlockAchievement = useAchievementStore(s => s.unlockAchievement)

  // Dzikir Counter State
  const [activeDzikir, setActiveDzikir] = useState<Adhkar | null>(null)
  const [count, setCount] = useState(0)
  const targetCount = 33

  useEffect(() => {
    fetchAdhkar(activeCategory)
  }, [activeCategory])

  const fetchAdhkar = async (category: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/adhkar?timing=${category === "Semua" ? "" : category}`)
      const json = await res.json()
      if (json.success) {
        setData(json.data)
      } else {
        toast({ variant: "error", title: "API Fault", description: json.error })
      }
    } catch (e) {
      toast({ variant: "error", title: "Network Fault", description: "Failed to load adhkar" })
    } finally {
      setLoading(false)
    }
  }

  const handleTap = () => {
    if (count < targetCount) {
      setCount(c => c + 1)
      if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50) // Haptic feedback
      }
      if (count + 1 === targetCount) {
        success("DZIKIR COMPLETE", "Target reached. May Allah accept it.")
        unlockAchievement("dzikir_master", toast)
      }
    }
  }

  const categories = [
    { id: "Pagi/Petang", label: "Morning & Evening", icon: Sunrise },
    { id: "Setelah Shalat", label: "After Fardhu", icon: Activity },
    { id: "Tidur", label: "Before Sleep", icon: Moon },
    { id: "Harian", label: "Daily Routine", icon: Sun },
  ]

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-8 font-sans">
      
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/30 bg-black/40 shadow-[0_0_20px_rgba(0,240,255,0.15)] backdrop-blur-xl">
          <Shield className="h-8 w-8 text-cyan-400 drop-shadow-[0_0_8px_#00F0FF]" />
        </div>
        <h1 className="mt-6 text-3xl font-black uppercase tracking-widest text-white drop-shadow-md sm:text-4xl">
          Adhkar Command Center
        </h1>
        <p className="mx-auto mt-4 max-w-2xl font-mono text-xs uppercase tracking-widest text-cyan-400">
          Spiritual Armor • Divine Remembrance • Inner Peace
        </p>
      </div>

      {/* Category Tabs */}
      <div className="mb-8 flex flex-wrap justify-center gap-3">
        {categories.map(cat => {
          const Icon = cat.icon
          const isActive = activeCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all ${
                isActive 
                  ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]" 
                  : "border-white/10 bg-black/40 text-slate-400 hover:border-cyan-500/30 hover:text-cyan-400"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* Dzikir Counter Modal (Active State) */}
      {activeDzikir && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-300">
          <div className="relative w-full max-w-2xl rounded-3xl border border-cyan-500/30 bg-space/95 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <button 
              onClick={() => { setActiveDzikir(null); setCount(0); }}
              className="absolute right-6 top-6 text-slate-400 hover:text-white transition-colors"
            >
              Close
            </button>
            
            <div className="text-center mb-8">
              <h2 className="font-sans text-xl font-bold text-white mb-2">{activeDzikir.title}</h2>
              <p className="font-mono text-xs text-cyan-500 uppercase tracking-widest">Target: {targetCount}</p>
            </div>

            <div className="mb-10 text-center">
              <p className="font-arabic text-4xl sm:text-5xl leading-relaxed text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" dir="rtl">
                {activeDzikir.text_arabic}
              </p>
              <p className="mt-8 font-sans text-sm italic text-slate-300">
                {activeDzikir.text_latin}
              </p>
              <p className="mt-4 font-mono text-xs text-cyan-400">
                "{activeDzikir.translation_en}"
              </p>
            </div>

            <div className="flex flex-col items-center justify-center">
              <button 
                onClick={handleTap}
                className={`relative flex h-32 w-32 items-center justify-center rounded-full border-4 transition-all active:scale-95 ${
                  count >= targetCount 
                    ? "border-emerald-500 bg-emerald-500/20 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]" 
                    : "border-cyan-500 bg-cyan-500/10 text-cyan-400 shadow-[0_0_30px_rgba(0,240,255,0.2)]"
                }`}
              >
                <span className="font-sans text-5xl font-black">{count}</span>
                
                {/* Ripple Effect SVG Filter could go here for tactical look */}
              </button>
              
              <div className="mt-6 h-2 w-64 overflow-hidden rounded-full bg-white/10">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${Math.min((count / targetCount) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid Content */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
          <Shield className="mb-4 h-12 w-12 text-cyan-500" />
          <h3 className="font-mono text-sm tracking-widest text-white">NO DATA IN DATABASE</h3>
          <p className="mt-2 text-xs text-slate-400">Please seed the database with adhkar records.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.map((item) => (
            <div 
              key={item.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-6 transition-all hover:border-cyan-500/40 hover:bg-black/60 hover:shadow-[0_10px_30px_rgba(0,240,255,0.1)]"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-sans text-lg font-bold text-white group-hover:text-cyan-300">
                    {item.title}
                  </h3>
                  <span className="rounded bg-white/10 px-2 py-1 font-mono text-[8px] uppercase tracking-widest text-slate-300">
                    {item.timing}
                  </span>
                </div>
                <p className="font-arabic text-2xl leading-relaxed text-slate-200 text-right line-clamp-3 mb-4" dir="rtl">
                  {item.text_arabic}
                </p>
                <p className="font-sans text-xs italic text-slate-400 line-clamp-2">
                  {item.text_latin}
                </p>
              </div>
              
              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="font-mono text-[9px] uppercase tracking-widest text-cyan-500/70">
                  {item.source}
                </span>
                <button 
                  onClick={() => setActiveDzikir(item)}
                  className="flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1.5 font-mono text-[10px] font-bold tracking-widest text-cyan-400 transition-colors hover:bg-cyan-500 hover:text-black"
                >
                  START <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
