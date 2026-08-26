"use client"

import React, { useState } from "react"
import { Heart, Activity, Plus } from "lucide-react"

const MONTHLY_GOAL = 5000000 // 5 Million IDR goal

export function InfaqTrackerWidget() {
  const [currentAmount, setCurrentAmount] = useState(3250000)
  const [adding, setAdding] = useState(false)
  const [addAmount, setAddAmount] = useState(0)

  const progress = Math.min((currentAmount / MONTHLY_GOAL) * 100, 100)

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val)
  }

  const handleAdd = () => {
    if (addAmount > 0) {
      setCurrentAmount((prev) => prev + addAmount)
      setAddAmount(0)
      setAdding(false)
    }
  }

  return (
    <div className="bg-space/60 rounded-2xl border border-emerald-500/20 p-5 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4 text-emerald-500/80" />
          <h3 className="font-sans text-xs font-bold tracking-wider text-emerald-400 uppercase">
            Infaq Tracker
          </h3>
        </div>
        <span className="font-mono text-[9px] text-primary/60">This Month</span>
      </div>

      <div className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="mb-1 flex items-end justify-between">
            <span className="font-mono text-xs font-bold text-white">
              {formatCurrency(currentAmount)}
            </span>
            <span className="font-mono text-[10px] text-emerald-400/80">
              Goal: {formatCurrency(MONTHLY_GOAL)}
            </span>
          </div>

          <div className="h-2.5 w-full overflow-hidden rounded-full border border-emerald-500/20 bg-black/60">
            <div
              className="relative h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute top-0 right-0 bottom-0 left-0 -translate-x-full animate-[shimmer_2s_infinite] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)]"></div>
            </div>
          </div>
          <div className="mt-1 text-right font-mono text-[9px] text-emerald-400/60">
            {progress.toFixed(1)}% Completed
          </div>
        </div>

        {/* Add Contribution */}
        {adding ? (
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute top-1/2 left-2 -translate-y-1/2 font-mono text-xs text-emerald-500/50">
                Rp
              </span>
              <input
                type="number"
                value={addAmount || ""}
                onChange={(e) => setAddAmount(Number(e.target.value))}
                placeholder="0"
                className="w-full rounded-lg border border-emerald-500/40 bg-black/40 py-1.5 pr-2 pl-7 font-mono text-xs text-white focus:outline-none"
                autoFocus
              />
            </div>
            <button
              onClick={handleAdd}
              className="rounded-lg bg-emerald-500/20 px-3 py-1.5 text-[10px] font-bold text-emerald-400 uppercase transition-colors hover:bg-emerald-500/40"
            >
              Add
            </button>
            <button
              onClick={() => setAdding(false)}
              className="rounded-lg px-2 py-1.5 text-[10px] text-primary/50 uppercase transition-colors hover:text-white"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 py-2 text-xs font-bold text-emerald-400/80 uppercase transition-colors hover:bg-emerald-500/10"
          >
            <Plus className="h-3.5 w-3.5" /> Log Contribution
          </button>
        )}

        {/* Mini stats */}
        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-emerald-500/10 pt-4">
          <div className="flex flex-col items-center justify-center rounded-lg bg-black/20 p-2">
            <Activity className="mb-1 h-3 w-3 text-emerald-500/50" />
            <div className="text-[9px] text-primary/70 uppercase">Streak</div>
            <div className="font-mono text-xs font-bold text-emerald-400">
              14 Days
            </div>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg bg-black/20 p-2">
            <Heart className="mb-1 h-3 w-3 text-emerald-500/50" />
            <div className="text-[9px] text-primary/70 uppercase">
              Donations
            </div>
            <div className="font-mono text-xs font-bold text-emerald-400">
              6 Logs
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
