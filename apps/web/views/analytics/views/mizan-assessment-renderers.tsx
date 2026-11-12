"use client"

import { Activity, Cpu, Scale, ShieldAlert, Sparkles } from "lucide-react"
import type { MizanMethodPreview } from "@moon/protocol"

export type MethodDecision = MizanMethodPreview

type AssessmentOption = {
  label: string
  description: string
  activeClass: string
  dotClass: string
}

const ASSESSMENT_OPTIONS: AssessmentOption[] = [
  {
    label: "General Sufficient",
    description: "Case can be assessed using general empirical knowledge.",
    activeClass: "-translate-y-0.5 border-primary/50 bg-primary/10 shadow-primary/30",
    dotClass: "border-primary bg-primary/20",
  },
  {
    label: "Balance Satisfied",
    description: "Material balance condition is established without coercion.",
    activeClass: "-translate-y-0.5 border-border bg-muted shadow-purple-500/30",
    dotClass: "border-border bg-muted",
  },
  {
    label: "Internal Reference Verified",
    description: "Prophetic scriptures explicitly validate the outcome.",
    activeClass: "-translate-y-0.5 border-emerald-500/50 bg-success/10 shadow-emerald-500/30",
    dotClass: "border-emerald-500 bg-success/20",
  },
]

export function MizanAssessmentParameters({
  values,
  onToggle,
}: {
  values: boolean[]
  onToggle: (index: number) => void
}) {
  return (
    <div className="relative flex flex-col gap-6 overflow-hidden rounded-xl border border-primary/30 bg-card/80 p-6 backdrop-blur-md transition-all duration-300">
      <div className="flex items-center gap-3 border-b border-primary/20 pb-4">
        <Activity className="h-5 w-5 text-primary" />
        <h3 className="text-sm font-black tracking-wider text-foreground uppercase">Assessment Parameters</h3>
      </div>
      <p className="text-xs text-muted-foreground">
        Toggle the parameters to preview method eligibility. This does not
        finalize an assessment or replace evidence review.
      </p>
      <div className="mt-2 flex flex-col gap-4">
        {ASSESSMENT_OPTIONS.map((option, index) => {
          const active = values[index] ?? false
          const activeText = index === 2 ? "text-success" : "text-primary"
          return (
            <button
              key={option.label}
              type="button"
              onClick={() => onToggle(index)}
              aria-pressed={active}
              className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-all duration-300 ${active ? option.activeClass : "border-border bg-card hover:border-primary/50"}`}
            >
              <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${active ? option.dotClass : "border-border"}`}>
                {active && <div className={`h-2.5 w-2.5 rounded-full ${index === 2 ? "bg-emerald-500" : "bg-primary"}`} />}
              </div>
              <div className="flex flex-col items-start">
                <span className={`text-sm font-bold ${active ? activeText : "text-foreground"}`}>{option.label}</span>
                <span className="text-xs text-muted-foreground">{option.description}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

const ACCENT_COLORS = {
  cyan: { text: "text-primary", border: "border-primary", bg: "bg-primary", shadow: "shadow-primary/30" },
  purple: { text: "text-primary", border: "border-border", bg: "bg-primary", shadow: "shadow-purple-500/30" },
  amber: { text: "text-warning", border: "border-amber-500", bg: "bg-amber-500", shadow: "shadow-amber-500/30" },
} as const

type AccentName = keyof typeof ACCENT_COLORS

export function MizanAssessmentOutput({
  method,
  eligibleForProphetic,
  limitation,
  isResolving,
  accent,
}: {
  method?: MethodDecision["method"]
  eligibleForProphetic?: MethodDecision["eligible_for_prophetic"]
  limitation?: string
  isResolving: boolean
  accent: AccentName
}) {
  const currentAccent = ACCENT_COLORS[accent]

  return (
    <div className={`relative flex flex-col overflow-hidden rounded-xl border ${currentAccent.border}/40 bg-card/90 p-6 backdrop-blur-md transition-all duration-500 ${currentAccent.shadow}`}>
      <div className="absolute top-0 right-0 p-8 opacity-[0.03]"><Cpu className={`h-40 w-40 ${currentAccent.text}`} /></div>
      <div className={`flex items-center gap-3 border-b ${currentAccent.border}/20 pb-4`}>
        <Sparkles className={`h-5 w-5 ${currentAccent.text}`} />
        <h3 className="text-sm font-black tracking-wider text-foreground uppercase">Engine Output</h3>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center py-12">
        <div className={`relative mb-6 rounded-full border p-5 ${currentAccent.border}/30 ${currentAccent.bg}/10`}>
          <div className={`absolute inset-0 animate-ping rounded-full ${currentAccent.border}/50 opacity-20`} />
          <Scale className={`h-12 w-12 ${currentAccent.text}`} />
        </div>
        <h4 className="mb-2 font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">Preview Candidate</h4>
        <div className={`mb-4 text-center font-sans text-3xl font-black tracking-wider uppercase transition-colors duration-300 ${currentAccent.text}`}>
          {isResolving ? "resolving" : method?.replace("_", " ") || "unavailable"}
        </div>
        {limitation ? (
          <div className="mt-4 flex max-w-sm items-start gap-3 rounded-xl border border-warning/30 bg-warning/10 p-3 text-xs text-warning">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <span><strong className="mb-1 block">Limitation Applied:</strong> {limitation}</span>
          </div>
        ) : isResolving ? (
          <div className="mt-4 rounded-full border border-border bg-card/50 px-6 py-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">Resolving through Mizan engine</div>
        ) : method ? (
          <div className="mt-4 max-w-sm rounded-md border border-info/30 bg-info/10 px-4 py-3 text-center text-xs leading-relaxed text-info">
            {eligibleForProphetic
              ? "Eligible for Prophetic review. Final method still requires a verified, relevant reference contribution."
              : "Preview only. No final assessment has been produced."}
          </div>
        ) : (
          <div className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs text-destructive">
            Preview unavailable.
          </div>
        )}
      </div>
      <div className="relative z-10 mt-auto border-t border-border pt-4">
        <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className={`h-1.5 w-1.5 rounded-full ${currentAccent.bg}`} />STATUS: {isResolving ? "RESOLVING" : method ? "PREVIEW ONLY" : "UNAVAILABLE"}</span>
          <span>NOT FINALIZED</span>
        </div>
      </div>
    </div>
  )
}
