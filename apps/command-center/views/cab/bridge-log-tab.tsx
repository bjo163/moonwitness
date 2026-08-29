"use client"

import React from "react"

export function BridgeLogTab() {
  return (
    <div className="flex flex-col gap-4">
      <div className="clip-hero border border-yellow-400/25 bg-black/60 p-6">
        <div className="mb-4 text-center">
          <div className="mb-2 font-mono text-4xl text-yellow-300/90">∞</div>
          <p className="font-mono text-[9px] tracking-widest text-yellow-400/50 uppercase">
            ALLAH · The Creator · The Goal
          </p>
        </div>

        <div className="flex justify-center">
          <div className="h-8 w-px bg-gradient-to-b from-yellow-400/30 to-white/5" />
        </div>

        <div className="rounded-xl mx-auto my-3 max-w-sm rounded-none border border-white/20 bg-white/5 p-3 text-center">
          <p className="font-mono text-[9px] tracking-widest text-white/40 uppercase">
            ◈ Bridge / Shadow
          </p>
          <p className="mt-1 font-sans text-sm font-bold text-white">
            Perantara ALLAH — HUMAN
          </p>
          <p className="font-mono text-[9px] text-white/30">
            Khalifatullah fil Ardh
          </p>
        </div>

        <div className="flex justify-center">
          <div className="h-8 w-px bg-gradient-to-b from-white/5 to-primary/20" />
        </div>

        <div className="mt-3 text-center">
          <p className="font-mono text-[9px] tracking-widest text-primary/50 uppercase">
            HUMAN · All Creation · L1 → L8
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/40 p-1">
        <div className="border-b border-white/5 p-3">
          <p className="font-mono text-[10px] tracking-widest text-white/40 uppercase">
            ◈ Bridge Decision Log
          </p>
        </div>
        {[
          {
            date: "2026-08-16",
            id: "BD-001",
            decision:
              "AEQ4 epoch ditetapkan pada 1 Muharram 1449H. Desentralisasi via hilal.",
            basis: "QS 10:5 · QS 2:189",
            status: "CONFIRMED",
          },
          {
            date: "2026-08-16",
            id: "BD-002",
            decision:
              "700,000 dikembalikan kepada ALLAH. Skala AEQ = ∞ UNLIMITED.",
            basis: "Teologis — sifat ALLAH tidak terikat angka",
            status: "CONFIRMED",
          },
          {
            date: "2026-08-16",
            id: "BD-003",
            decision:
              "Q4Q Gateway Module diusulkan sebagai modul berikutnya setelah CAB.",
            basis: "Q4Q framework — 8 level consciousness",
            status: "PENDING",
          },
        ].map((log) => (
          <div
            key={log.id}
            className="border-b border-white/5 p-3 last:border-0"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] text-white/25">
                    {log.id}
                  </span>
                  <span className="font-mono text-[9px] text-white/25">·</span>
                  <span className="font-mono text-[9px] text-white/25">
                    {log.date}
                  </span>
                </div>
                <p className="font-mono text-xs text-white/70">
                  {log.decision}
                </p>
                <p className="font-mono text-[9px] text-yellow-400/50">
                  {log.basis}
                </p>
              </div>
              <span
                className={`rounded-md shrink-0 border px-2 py-0.5 font-mono text-[8px] font-bold tracking-widest uppercase ${
                  log.status === "CONFIRMED"
                    ? "border-emerald-500/30 text-emerald-500"
                    : "border-amber-400/30 text-amber-400"
                }`}
              >
                {log.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
