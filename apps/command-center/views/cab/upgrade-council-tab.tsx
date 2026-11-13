"use client"

import React, { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { StatusBadge, PropertyRow, type StatusVariant } from "@workspace/ui"
import { WhisperPanel, MercyButton } from "../whisper-panel"
import {
  Q4Q_LEVELS,
  UPGRADE_REQUESTS,
  STATUS_CONFIG,
  type UpgradeStatus,
  type ScriptureTag,
} from "./cab-data"

const upgradeStatusVariantMap: Record<UpgradeStatus, StatusVariant> = {
  PROPOSED: "pending",
  BRIDGE_REVIEW: "warning",
  APPROVED: "info",
  ACTIVE: "primary",
  COMPLETE: "success",
}

export function ScriptureTagBadge({ tag }: { tag: ScriptureTag }) {
  const colors: Record<ScriptureTag, string> = {
    Q: "text-warning border-yellow-400/40",
    T: "text-blue-400 border-blue-400/40",
    Z: "text-success border-emerald-400/40",
    G: "text-destructive border-red-400/40",
  }
  const labels: Record<ScriptureTag, string> = {
    Q: "QUR'AN",
    T: "TORAH",
    Z: "ZABUR",
    G: "GOSPEL",
  }
  return (
    <span
      className={`rounded-md border px-1.5 py-0.5 font-mono text-[8px] font-black tracking-widest ${colors[tag]}`}
    >
      [{labels[tag]}]
    </span>
  )
}

export function UpgradeCouncilTab() {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-yellow-400/20 bg-card p-4">
        <p className="font-mono text-[10px] tracking-widest text-warning/60 uppercase">
          ◈ Upgrade Universe Operation
        </p>
        <p className="mt-1 font-mono text-xs text-foreground/40">
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
            className={`rounded-xl border bg-card transition-all duration-300 ${
              isOpen
                ? "border-yellow-400/40 shadow-sm"
                : "border-border"
            }`}
          >
            <button
              className="flex w-full items-start justify-between gap-4 p-4 text-left"
              onClick={() => setExpanded(isOpen ? null : req.id)}
            >
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[9px] text-foreground/30">
                    {req.id}
                  </span>
                  {req.scriptureTags.map((tag) => (
                    <ScriptureTagBadge key={tag} tag={tag} />
                  ))}
                  <StatusBadge
                    status={upgradeStatusVariantMap[req.status] || "neutral"}
                    label={STATUS_CONFIG[req.status]?.label || req.status}
                    size="sm"
                  />
                </div>
                <p className="font-sans text-sm font-bold text-foreground">
                  {req.title}
                </p>
                <p className="font-mono text-xs text-foreground/50">
                  {req.description}
                </p>
              </div>
              <div className="ml-4 flex shrink-0 items-center gap-2">
                <span className="font-mono text-[9px] text-foreground/30">
                  L{req.levelFrom} → L{req.levelTo}
                </span>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-warning" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-foreground/30" />
                )}
              </div>
            </button>

            {isOpen && (
              <div className="border-t border-border p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-3">
                    <PropertyRow
                      variant="stacked"
                      label="Current State"
                      value={req.currentState || `Level ${req.levelFrom} Baseline Assessment`}
                    />
                    <PropertyRow
                      variant="stacked"
                      label="Proposed Change"
                      value={req.proposedChange || req.description}
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <PropertyRow
                      variant="stacked"
                      label="Scripture Basis"
                      value={req.scriptureRef}
                    />
                    <PropertyRow
                      variant="stacked"
                      label="End Goal — Ridwan Allah"
                      value={req.endGoalAlignment}
                    />
                    <div className="rounded-xl border border-yellow-400/20 bg-yellow-400/5 p-3">
                      <p className="mb-1 font-mono text-[9px] tracking-widest text-warning/60 uppercase">
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
                          className={`rounded-md flex h-7 w-7 shrink-0 items-center justify-center rounded-none border ${
                            inRange ? lvl.border : "border-border"
                          }`}
                        >
                          <LvlIcon
                            className={`h-3 w-3 ${
                              inRange ? lvl.color : "text-foreground/10"
                            }`}
                          />
                        </div>
                        <span
                          className={`font-mono text-[7px] ${
                            inRange ? lvl.color : "text-foreground/15"
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
