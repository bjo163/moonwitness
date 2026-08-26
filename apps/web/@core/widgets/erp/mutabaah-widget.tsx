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

  const completedCount = devotions.filter((d) => d.completed).length
  const progress = (completedCount / devotions.length) * 100

  return (
    <div className="bg-space/60 flex h-full flex-col rounded-2xl border border-cyan-500/20 p-5 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-sans text-xs font-bold tracking-wider text-cyan-400 uppercase">
          Mutaba'ah / Devotion
        </h3>
        <Flame
          className={`h-4 w-4 ${progress === 100 ? "animate-pulse text-amber-500" : "text-primary/50"}`}
        />
      </div>

      <div className="mb-4">
        <div className="mb-1 flex items-end justify-between">
          <span className="font-mono text-xs text-white uppercase">
            Daily Progress
          </span>
          <span className="font-mono text-xs font-bold text-cyan-400">
            {completedCount}/{devotions.length}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full border border-cyan-500/20 bg-black/60">
          <div
            className="h-full bg-cyan-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex-1 space-y-2">
        {devotions.map((d) => (
          <button
            key={d.id}
            onClick={() => toggle(d.id)}
            className={`flex w-full items-center gap-3 rounded-lg border p-2.5 transition-all ${
              d.completed
                ? "border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_10px_rgba(0,240,255,0.1)]"
                : "border-transparent bg-black/20 hover:border-white/10 hover:bg-black/40"
            }`}
          >
            {d.completed ? (
              <CheckCircle2 className="h-4 w-4 text-cyan-400" />
            ) : (
              <Circle className="h-4 w-4 text-primary/50" />
            )}
            <span
              className={`font-sans text-xs font-bold ${d.completed ? "text-white" : "text-primary/70"}`}
            >
              {d.label}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-cyan-500/10 pt-3 font-mono text-[9px] text-primary/60">
        <div className="flex items-center gap-1">
          <Activity className="h-3 w-3" /> Sync Active
        </div>
        <div>Last Sync: Just now</div>
      </div>
    </div>
  )
}
