"use client"

import React, { useState, useEffect } from "react"
import { Calculator, Coins, Landmark, Sparkles } from "lucide-react"

// Mock prices per gram (in IDR)
const GOLD_PRICE = 1200000
const SILVER_PRICE = 15000
const NISAB_GOLD = 85 // grams

export function ZakatCalculatorWidget() {
  const [cash, setCash] = useState(0)
  const [gold, setGold] = useState(0)
  const [silver, setSilver] = useState(0)
  const [zakat, setZakat] = useState(0)
  const [isEligible, setIsEligible] = useState(false)
  const [nisabValue, setNisabValue] = useState(NISAB_GOLD * GOLD_PRICE)

  useEffect(() => {
    const totalWealth = cash + gold * GOLD_PRICE + silver * SILVER_PRICE
    const nisabThreshold = NISAB_GOLD * GOLD_PRICE

    setNisabValue(nisabThreshold)

    if (totalWealth >= nisabThreshold) {
      setIsEligible(true)
      setZakat(totalWealth * 0.025)
    } else {
      setIsEligible(false)
      setZakat(0)
    }
  }, [cash, gold, silver])

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val)
  }

  return (
    <div className="bg-space/60 rounded-2xl border border-amber-500/20 p-5 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-sans text-xs font-bold tracking-wider text-amber-400 uppercase">
          Asset & Zakat Calculator
        </h3>
        <Calculator className="h-4 w-4 text-amber-500/50" />
      </div>

      <div className="space-y-4">
        {/* Input Fields */}
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-[10px] font-bold text-amber-400/80 uppercase">
              Cash / Savings (IDR)
            </label>
            <div className="relative">
              <Landmark className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-amber-500/50" />
              <input
                type="number"
                value={cash || ""}
                onChange={(e) => setCash(Number(e.target.value))}
                placeholder="0"
                className="w-full rounded-lg border border-amber-500/20 bg-black/40 py-2 pr-3 pl-10 font-mono text-base text-white transition-all focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,240,255,0.3)] focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[10px] font-bold text-amber-400/80 uppercase">
                Gold (Grams)
              </label>
              <div className="relative">
                <Sparkles className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-amber-500/50" />
                <input
                  type="number"
                  value={gold || ""}
                  onChange={(e) => setGold(Number(e.target.value))}
                  placeholder="0"
                  className="w-full rounded-lg border border-amber-500/20 bg-black/40 py-2 pr-2 pl-9 font-mono text-base text-white transition-all focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,240,255,0.3)] focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold text-amber-400/80 uppercase">
                Silver (Grams)
              </label>
              <div className="relative">
                <Coins className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400/50" />
                <input
                  type="number"
                  value={silver || ""}
                  onChange={(e) => setSilver(Number(e.target.value))}
                  placeholder="0"
                  className="w-full rounded-lg border border-amber-500/20 bg-black/40 py-2 pr-2 pl-9 font-mono text-base text-white transition-all focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,240,255,0.3)] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Status / Output */}
        <div className="relative overflow-hidden rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
          <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-full bg-amber-500/10 blur-[30px]"></div>

          <div className="mb-2 flex items-end justify-between">
            <div className="text-[10px] font-bold text-amber-300 uppercase">
              Nisab Threshold
            </div>
            <div className="font-mono text-xs text-amber-400/80">
              {formatCurrency(nisabValue)}
            </div>
          </div>

          <div className="mb-3 h-px w-full bg-amber-500/20"></div>

          <div className="flex items-center justify-between">
            <div>
              <div className="mb-1 text-[11px] font-black tracking-widest text-amber-400 uppercase">
                Zakat Liability (2.5%)
              </div>
              {isEligible ? (
                <div className="inline-flex items-center gap-1.5 rounded border border-red-500/30 bg-red-500/20 px-2 py-0.5 text-[9px] font-bold text-red-400 uppercase">
                  <AlertCircle size={10} /> Eligible to Pay
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 rounded border border-emerald-500/30 bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-400 uppercase">
                  Below Nisab
                </div>
              )}
            </div>

            <div
              className={`font-mono text-xl font-black ${isEligible ? "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" : "text-primary/50"}`}
            >
              {formatCurrency(zakat)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AlertCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}
