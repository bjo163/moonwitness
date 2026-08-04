"use client"

import React, { useState } from "react"
import { CheckCircle2, Circle, Flame, Activity } from "lucide-react"

type Devotion = {
  id: string
  label: string
  completed: boolean
}

export function MutabaahWidget() {
  const [devotions, setDevotions] = useState<Devotion[]>([
    { id: "tahajud", label: "Tahajud", completed: false },
    { id: "dhuha", label: "Dhuha", completed: false },
    { id: "sedekah", label: "Sedekah Subuh", completed: false },
    { id: "tilawah", label: "Tilawah 1 Juz", completed: false },
    { id: "rawatib", label: "Shalat Rawatib", completed: false },
  ])

  const toggle = (id: string) => {
    setDevotions((prev) =>
      prev.map((d) => (d.id === id ? { ...d, completed: !d.completed } : d))
    )
  }

  const completedCount = devotions.filter(d => d.completed).length
  const progress = (completedCount / devotions.length) * 100

  return (
    <div className="bg-space/60 rounded-2xl border border-cyan-500/20 p-5 backdrop-blur-xl flex flex-col h-full">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-sans text-xs font-bold tracking-wider text-cyan-400 uppercase">
          Mutaba'ah / Devotion
        </h3>
        <Flame className={`h-4 w-4 ${progress === 100 ? 'text-amber-500 animate-pulse' : 'text-primary/50'}`} />
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-end mb-1">
          <span className="font-mono text-xs text-white uppercase">Daily Progress</span>
          <span className="font-mono text-xs font-bold text-cyan-400">{completedCount}/{devotions.length}</span>
        </div>
        <div className="h-1.5 w-full bg-black/60 rounded-full overflow-hidden border border-cyan-500/20">
          <div 
            className="h-full bg-cyan-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-2 flex-1">
        {devotions.map(d => (
          <button 
            key={d.id}
            onClick={() => toggle(d.id)}
            className={`w-full flex items-center gap-3 p-2.5 rounded-lg border transition-all ${
              d.completed 
                ? "bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_10px_rgba(0,240,255,0.1)]" 
                : "bg-black/20 border-transparent hover:bg-black/40 hover:border-white/10"
            }`}
          >
            {d.completed ? (
              <CheckCircle2 className="h-4 w-4 text-cyan-400" />
            ) : (
              <Circle className="h-4 w-4 text-primary/50" />
            )}
            <span className={`font-sans text-xs font-bold ${d.completed ? 'text-white' : 'text-primary/70'}`}>
              {d.label}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-cyan-500/10 flex items-center justify-between text-[9px] font-mono text-primary/60">
        <div className="flex items-center gap-1">
          <Activity className="h-3 w-3" /> Sync Active
        </div>
        <div>
          Last Sync: Just now
        </div>
      </div>
    </div>
  )
}
