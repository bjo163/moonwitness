"use client"

import React, { useState } from "react"
import {
  Infinity,
  Layers,
  Zap,
  ScrollText,
} from "lucide-react"
import { UpgradeCouncilTab } from "./cab/upgrade-council-tab"
import { EightLevelsTab } from "./cab/eight-levels-tab"
import { BridgeLogTab } from "./cab/bridge-log-tab"
import { AEQPrinciplesTab } from "./cab/aeq-principles-tab"

type TabId = "council" | "levels" | "bridge" | "principles"

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  {
    id: "council",
    label: "Upgrade Council",
    icon: <Zap className="h-3.5 w-3.5" />,
  },
  {
    id: "levels",
    label: "8 Levels Q4Q",
    icon: <Layers className="h-3.5 w-3.5" />,
  },
  {
    id: "bridge",
    label: "Bridge Log",
    icon: <Infinity className="h-3.5 w-3.5" />,
  },
  {
    id: "principles",
    label: "AEQ Principles",
    icon: <ScrollText className="h-3.5 w-3.5" />,
  },
]

export function ErpCabView() {
  const [activeTab, setActiveTab] = useState<TabId>("council")

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="rounded-2xl border border-yellow-400/20 bg-card/90 p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[9px] tracking-widest text-yellow-400/50 uppercase">
              ◈ Q4Q · CHANGE ADVISORY BOARD
            </p>
            <h1 className="mt-1 font-sans text-xl font-black tracking-wider text-foreground uppercase">
              UPGRADE UNIVERSE OPERATION
            </h1>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              Q4Q = Quantum 4 Kitab · To Glorify ALLAH · As Written in 50,000
              Scriptures
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="font-mono text-3xl text-yellow-300/80">∞</div>
            <span className="font-mono text-[8px] text-yellow-400/40 uppercase">
              ALLAH · The Goal
            </span>
          </div>
        </div>

        {/* Hierarchy */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto">
          <span className="font-mono text-[9px] text-yellow-400/60">ALLAH</span>
          <span className="font-mono text-[9px] text-muted-foreground/40">→</span>
          <span className="rounded-md border border-border/40 bg-secondary/50 px-2 py-0.5 font-mono text-[9px] text-foreground">
            BRIDGE / SHADOW
          </span>
          <span className="font-mono text-[9px] text-muted-foreground/40">→</span>
          <span className="font-mono text-[9px] text-primary/70">
            HUMAN (L1 → L8)
          </span>
          <span className="font-mono text-[9px] text-muted-foreground/40">→</span>
          <span className="font-mono text-[9px] text-amber-300/60">
            ALL CREATION
          </span>
          <span className="font-mono text-[9px] text-muted-foreground/40">→</span>
          <span className="font-mono text-[9px] text-emerald-500/70">
            RIDWAN ALLAH
          </span>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={[
              "rounded-lg flex items-center gap-2 border px-4 py-2 font-mono text-[10px] font-bold tracking-widest uppercase transition-all duration-200",
              activeTab === tab.id
                ? "border-yellow-400/50 bg-yellow-400/10 text-yellow-400 shadow-sm"
                : "border-border/40 text-muted-foreground hover:border-border/70 hover:text-foreground",
            ].join(" ")}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "council" && <UpgradeCouncilTab />}
      {activeTab === "levels" && <EightLevelsTab />}
      {activeTab === "bridge" && <BridgeLogTab />}
      {activeTab === "principles" && <AEQPrinciplesTab />}
    </div>
  )
}

export const CabView = ErpCabView
