"use client"

import { useState } from "react"
import { useLanguage } from "@core/contexts"
import { playClickSound } from "@core/utils/sound-feedback"
import { Target, Award, RotateCcw } from "lucide-react"
import { ContextBlock } from "@core/ui"

type ZikrPreset = {
  id: string
  arabic: string
  latin: string
  translation: string
}

const ZIKR_PRESETS: ZikrPreset[] = [
  {
    id: "subhanallah",
    arabic: "سُبْحَانَ اللَّهِ",
    latin: "Subhanallah",
    translation: "Maha Suci Allah",
  },
  {
    id: "alhamdulillah",
    arabic: "الْحَمْدُ لِلَّهِ",
    latin: "Alhamdulillah",
    translation: "Segala Puji Bagi Allah",
  },
  {
    id: "allahuakbar",
    arabic: "اللَّهُ أَكْبَرُ",
    latin: "Allahu Akbar",
    translation: "Allah Maha Besar",
  },
  {
    id: "lailahaillallah",
    arabic: "لاَ إِلَـٰهَ إِلاَّ اللَّهُ",
    latin: "La ilaha illallah",
    translation: "Tiada Tuhan Selain Allah",
  },
]

export function TasbihView() {
  const { t } = useLanguage()

  const [activeZikr, setActiveZikr] = useState<ZikrPreset>(ZIKR_PRESETS[0]!)
  const [count, setCount] = useState(0)
  const [targetCount, setTargetCount] = useState(33)
  const [completedLoops, setCompletedLoops] = useState(0)

  function handleIncrement() {
    playClickSound()
    const nextCount = count + 1
    if (nextCount >= targetCount) {
      setCount(0)
      setCompletedLoops((prev) => prev + 1)
    } else {
      setCount(nextCount)
    }
  }

  function handleReset() {
    playClickSound()
    setCount(0)
    setCompletedLoops(0)
  }

  return (
    <div
      className="theme-grid-bg min-h-screen py-10 font-mono text-foreground"
      suppressHydrationWarning
    >
      <div className="mx-auto max-w-4xl space-y-6 px-4 sm:px-6">
        <ContextBlock
          title="TACTICAL HUD TASBIH COUNTER"
          subtitle="Counter Zikir & Tasbih digital taktis dengan target preset."
          operation="TASBIH-COUNTER-SYNC"
          status="ONLINE"
          accentColor="success"
        />

        {/* Zikr Presets Selection */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {ZIKR_PRESETS.map((item) => {
            const isSelected = activeZikr.id === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  playClickSound()
                  setActiveZikr(item)
                  setCount(0)
                }}
                className={`tag-clip border p-3 text-center transition-all ${
                  isSelected
                    ? "bg-success/20 border-success text-white shadow-[0_0_15px_rgba(0,255,102,0.3)]"
                    : "bg-space border-primary/20 text-primary hover:text-white"
                }`}
              >
                <div className="text-success arabic-text text-sm font-bold">
                  {item.arabic}
                </div>
                <div className="mt-1 text-[10px] font-bold">{item.latin}</div>
              </button>
            )
          })}
        </div>

        {/* Main Interactive Counter HUD Console */}
        <div className="panel-box border-success/50 bg-space/95 space-y-6 border p-8 text-center shadow-[0_0_40px_rgba(0,255,102,0.2)]">
          {/* Target Selector */}
          <div className="border-success/20 flex items-center justify-between border-b pb-4 text-xs font-bold">
            <div className="flex items-center gap-2 text-primary">
              <Target className="text-success h-4 w-4" />
              <span>TARGET PRESET:</span>
            </div>
            <div className="flex items-center gap-2">
              {[33, 100, 1000].map((tVal) => (
                <button
                  key={tVal}
                  onClick={() => {
                    playClickSound()
                    setTargetCount(tVal)
                    setCount(0)
                  }}
                  className={`tag-clip px-3 py-1 text-xs font-bold transition-all ${
                    targetCount === tVal
                      ? "bg-success font-black text-black"
                      : "bg-space border-success/30 border text-primary"
                  }`}
                >
                  {tVal}x
                </button>
              ))}
            </div>
          </div>

          {/* Active Zikr Display */}
          <div className="space-y-2 py-4">
            <div className="text-success arabic-text text-3xl leading-relaxed font-black sm:text-5xl">
              {activeZikr.arabic}
            </div>
            <div className="text-sm font-bold tracking-widest text-foreground">
              {activeZikr.latin.toUpperCase()}
            </div>
            <p className="text-xs text-primary italic">
              &ldquo;{activeZikr.translation}&rdquo;
            </p>
          </div>

          {/* Giant Click Counter Button */}
          <button
            onClick={handleIncrement}
            className="bg-success/10 border-success hover:bg-success/25 mx-auto flex h-48 w-48 cursor-pointer flex-col items-center justify-center space-y-1 rounded-full border-4 shadow-[0_0_30px_rgba(0,255,102,0.4)] transition-all select-none active:scale-95"
          >
            <span className="text-success font-display text-5xl font-black">
              {count}
            </span>
            <span className="text-[10px] font-bold tracking-widest text-primary uppercase">
              / {targetCount} TAP TO COUNT
            </span>
          </button>

          {/* Bottom Stats & Reset */}
          <div className="border-success/20 flex items-center justify-between border-t pt-4 text-xs">
            <div className="flex items-center gap-2 font-bold text-accent">
              <Award className="h-4 w-4 text-accent" />
              <span>PUTARAN SELESAI: {completedLoops} LOOPS</span>
            </div>

            <button
              onClick={handleReset}
              className="btn-primary btn-primary-ghost text-danger border-danger/30 hover:border-danger flex items-center gap-1.5 px-3 py-1.5 text-xs btn-clip"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>RESET COUNTER</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
