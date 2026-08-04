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
      maximumFractionDigits: 0
    }).format(val)
  }

  const handleAdd = () => {
    if (addAmount > 0) {
      setCurrentAmount(prev => prev + addAmount)
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
        <span className="font-mono text-[9px] text-primary/60">
          This Month
        </span>
      </div>

      <div className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-end mb-1">
            <span className="font-mono text-xs font-bold text-white">{formatCurrency(currentAmount)}</span>
            <span className="font-mono text-[10px] text-emerald-400/80">Goal: {formatCurrency(MONTHLY_GOAL)}</span>
          </div>
          
          <div className="h-2.5 w-full bg-black/60 rounded-full overflow-hidden border border-emerald-500/20">
            <div 
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 relative transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute top-0 left-0 bottom-0 right-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] -translate-x-full animate-[shimmer_2s_infinite]"></div>
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
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-mono text-emerald-500/50">Rp</span>
              <input 
                type="number"
                value={addAmount || ""}
                onChange={(e) => setAddAmount(Number(e.target.value))}
                placeholder="0"
                className="w-full bg-black/40 border border-emerald-500/40 rounded-lg pl-7 pr-2 py-1.5 text-xs text-white font-mono focus:outline-none"
                autoFocus
              />
            </div>
            <button 
              onClick={handleAdd}
              className="bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors"
            >
              Add
            </button>
            <button 
              onClick={() => setAdding(false)}
              className="text-primary/50 hover:text-white px-2 py-1.5 rounded-lg text-[10px] uppercase transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setAdding(true)}
            className="w-full flex items-center justify-center gap-2 border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400/80 py-2 rounded-xl transition-colors text-xs font-bold uppercase"
          >
            <Plus className="h-3.5 w-3.5" /> Log Contribution
          </button>
        )}

        {/* Mini stats */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-emerald-500/10">
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-black/20">
            <Activity className="h-3 w-3 text-emerald-500/50 mb-1" />
            <div className="text-[9px] text-primary/70 uppercase">Streak</div>
            <div className="font-mono text-xs text-emerald-400 font-bold">14 Days</div>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-black/20">
            <Heart className="h-3 w-3 text-emerald-500/50 mb-1" />
            <div className="text-[9px] text-primary/70 uppercase">Donations</div>
            <div className="font-mono text-xs text-emerald-400 font-bold">6 Logs</div>
          </div>
        </div>
      </div>
    </div>
  )
}
