"use client"

import { useLanguage } from "@workspace/state"
import { PropheticAIChatTerminal } from "@workspace/ui"
import { Sparkles, Database, Radio } from "lucide-react"

export function DiagnostikHikmahView() {
  const { t } = useLanguage()

  return (
    <div
      className="theme-grid-bg bg-background flex h-[calc(100vh-64px)] w-full flex-col overflow-hidden font-mono text-foreground"
      suppressHydrationWarning
    >
      {/* Ultra Compact Status Bar */}
      <div className="bg-background border-success/30 z-10 flex h-9 shrink-0 items-center justify-between border-b px-3 text-[11px] text-primary sm:px-6">
        <div className="text-success flex items-center gap-2 font-bold tracking-wider uppercase">
          <Radio className="text-success h-3.5 w-3.5 animate-pulse" />
          <span className="text-foreground">
            KHIDRA AI // PROPHETIC WISDOM ENGINE
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase">
            <Database className="h-3 w-3" />
            <span className="hidden sm:inline">QURAN CORE:</span>
            <span>ONLINE</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-purple-300 uppercase">
            <Sparkles className="h-3 w-3 text-purple-400" />
            <span>GEMINI 3.6</span>
          </div>
        </div>
      </div>

      {/* Edge-to-Edge Full Workspace Chat Terminal */}
      <div className="relative min-h-0 w-full flex-1 overflow-hidden">
        <PropheticAIChatTerminal maxHeight="h-full" fullWorkspace={true} />
      </div>
    </div>
  )
}
