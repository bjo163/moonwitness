"use client"

import React, { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { WhisperPanel, MercyButton } from "../whisper-panel"
import {
  Q4Q_LEVELS,
  UPGRADE_REQUESTS,
  STATUS_CONFIG,
  type UpgradeStatus,
  type ScriptureTag,
} from "./cab-data"

export function StatusBadge({ status }: { status: UpgradeStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span
      className={`clip-tag border px-2 py-0.5 font-mono text-[9px] font-bold tracking-widest uppercase ${cfg.color}`}
    >
      {cfg.label}
    </span>
  )
}

export function ScriptureTagBadge({ tag }: { tag: ScriptureTag }) {
  const colors: Record<ScriptureTag, string> = {
    Q: "text-yellow-400 border-yellow-400/40",
    T: "text-blue-400 border-blue-400/40",
    Z: "text-emerald-400 border-emerald-400/40",
    G: "text-red-400 border-red-400/40",
  }
  const labels: Record<ScriptureTag, string> = {
    Q: "QUR'AN",
    T: "TORAH",
    Z: "ZABUR",
    G: "GOSPEL",
  }
  return (
    <span
      className={`clip-tag border px-1.5 py-0.5 font-mono text-[8px] font-black tracking-widest ${colors[tag]}`}
    >
      [{labels[tag]}]
    </span>
  )
}

export function UpgradeCouncilTab() {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-4">
      <div className="clip-card border border-yellow-400/20 bg-black/40 p-4">
        <p className="font-mono text-[10px] tracking-widest text-yellow-400/60 uppercase">
          ◈ Upgrade Universe Operation
        </p>
        <p className="mt-1 font-mono text-xs text-white/40">
          Setiap perubahan di MoonWitness OS harus selaras dengan tujuan:
          mengagungkan ALLAH melalui ilmu, kesadaran, dan amal.
        </p>
      </div>

      {UPGRADE_REQUESTS.map((req) => {
        const defaultLevel = Q4Q_LEVELS[0]
        const fromLevel = Q4Q_LEVELS[req.levelFrom - 1] || defaultLevel
        const toLevel = Q4Q_LEVELS[req.levelTo - 1] || defaultLevel
        if (!toLevel || !fromLevel) return null
        const isOpen = expanded === req.id

        return (
          <div
            key={req.id}
            className={`clip-card border bg-black/50 transition-all duration-300 ${
              isOpen
                ? "border-yellow-400/40 shadow-[0_0_20px_rgba(255,230,0,0.08)]"
                : "border-white/10"
            }`}
          >
            <button
              className="flex w-full items-start justify-between gap-4 p-4 text-left"
              onClick={() => setExpanded(isOpen ? null : req.id)}
            >
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[9px] text-white/30">
                    {req.id}
                  </span>
                  <ScriptureTagBadge tag={req.scriptureTag} />
                  <StatusBadge status={req.status} />
                </div>
                <p className="font-sans text-sm font-bold text-white">
                  {req.title}
                </p>
                <p className="font-mono text-xs text-white/50">
                  {req.description}
                </p>
              </div>
              <div className="ml-4 flex shrink-0 items-center gap-2">
                <span className="font-mono text-[9px] text-white/30">
                  L{req.levelFrom} → L{req.levelTo}
                </span>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-yellow-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-white/30" />
                )}
              </div>
            </button>

            {isOpen && (
              <div className="border-t border-white/5 p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <div>
                      <p className="mb-1 font-mono text-[9px] tracking-widest text-white/30 uppercase">
                        Current State
                      </p>
                      <p className="font-mono text-xs text-white/60">
                        {req.currentState}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 font-mono text-[9px] tracking-widest text-white/30 uppercase">
                        Proposed Change
                      </p>
                      <p className="font-mono text-xs text-yellow-300/80">
                        {req.proposedChange}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div>
                      <p className="mb-1 font-mono text-[9px] tracking-widest text-white/30 uppercase">
                        Scripture Basis
                      </p>
                      <p className="font-mono text-[10px] text-yellow-400/80">
                        {req.scriptureRef}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 font-mono text-[9px] tracking-widest text-white/30 uppercase">
                        End Goal — Ridwan Allah
                      </p>
                      <p className="font-mono text-[10px] text-white/50">
                        {req.endGoalAlignment}
                      </p>
                    </div>
                    <div className="clip-card border border-yellow-400/20 bg-yellow-400/5 p-3">
                      <p className="mb-1 font-mono text-[9px] tracking-widest text-yellow-400/60 uppercase">
                        ◈ Bridge Decision
                      </p>
                      <p className="font-mono text-[10px] text-yellow-300/80">
                        {req.bridgeNote}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 overflow-x-auto py-2">
                  {Q4Q_LEVELS.map((lvl) => {
                    const LvlIcon = lvl.icon
                    const inRange =
                      lvl.level >= req.levelFrom && lvl.level <= req.levelTo
                    return (
                      <div
                        key={lvl.level}
                        className="flex flex-col items-center gap-1"
                      >
                        <div
                          className={`clip-tag flex h-7 w-7 shrink-0 items-center justify-center rounded-none border ${
                            inRange ? lvl.border : "border-white/5"
                          }`}
                        >
                          <LvlIcon
                            className={`h-3 w-3 ${
                              inRange ? lvl.color : "text-white/10"
                            }`}
                          />
                        </div>
                        <span
                          className={`font-mono text-[7px] ${
                            inRange ? lvl.color : "text-white/15"
                          }`}
                        >
                          L{lvl.level}
                        </span>
                      </div>
                    )
                  })}
                </div>

                <WhisperPanel requestId={req.id} requestTitle={req.title} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
