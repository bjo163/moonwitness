"use client"

import React, { useEffect, useState } from "react"
import { apiGet } from "@moon/client"
import { Scale, Activity, ShieldAlert, Cpu, Sparkles } from "lucide-react"

type MethodDecision = {
  method: "general" | "general_limited" | "prophetic"
  limitation?: string
}

export function MizanAssessmentView() {
  const [generalSufficient, setGeneralSufficient] = useState(false)
  const [balanceSatisfied, setBalanceSatisfied] = useState(false)
  const [internalReferenceVerified, setInternalReferenceVerified] =
    useState(false)
  const [decision, setDecision] = useState<MethodDecision | null>(null)
  const [isResolving, setIsResolving] = useState(true)

  useEffect(() => {
    let mounted = true
    const query = new URLSearchParams({
      generalSufficient: String(generalSufficient),
      balanceSatisfied: String(balanceSatisfied),
      internalReferenceVerified: String(internalReferenceVerified),
    })

    setIsResolving(true)
    apiGet<{ decision: MethodDecision }>(`/api/mizan/decision?${query.toString()}`)
      .then((data: { decision: MethodDecision }) => {
        if (mounted) setDecision(data.decision)
      })
      .catch(() => {
        if (mounted) setDecision(null)
      })
      .finally(() => {
        if (mounted) setIsResolving(false)
      })

    return () => {
      mounted = false
    }
  }, [balanceSatisfied, generalSufficient, internalReferenceVerified])

  const method = decision?.method
  const limitation = decision?.limitation
  const accent =
    method === "general" ? "cyan" : method === "prophetic" ? "purple" : "amber"

  const accentColors = {
    cyan: {
      text: "text-primary",
      border: "border-primary",
      bg: "bg-primary",
      shadow: "shadow-primary/30",
    },
    purple: {
      text: "text-purple-500",
      border: "border-purple-500",
      bg: "bg-purple-500",
      shadow: "shadow-purple-500/30",
    },
    amber: {
      text: "text-amber-500",
      border: "border-amber-500",
      bg: "bg-amber-500",
      shadow: "shadow-amber-500/30",
    },
    emerald: {
      text: "text-emerald-500",
      border: "border-emerald-500",
      bg: "bg-emerald-500",
      shadow: "shadow-emerald-500/30",
    },
  }

  const currentAccent = accentColors[accent as keyof typeof accentColors]

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 pb-20 md:px-0">
      {/* HUD Context Block */}
      <div className="rounded-xl border border-purple-500/30 bg-card/80 p-6 shadow-purple-500/30 backdrop-blur-md">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h1 className="font-sans text-3xl font-black tracking-wider text-white uppercase">
              MIZAN ASSESSMENT ENGINE
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Public testing interface for the internal weighted-assessment and
              validation logic.
            </p>
          </div>
          <div className="text-right">
            <div className="font-mono text-[10px] tracking-widest text-slate-400">
              OPERATION
            </div>
            <div className="font-mono text-xs font-bold text-purple-500">
              SIMULATION-MODE
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* INPUT PANEL */}
        <div className="rounded-xl relative flex flex-col gap-6 overflow-hidden border border-primary/30 bg-card/80 p-6 backdrop-blur-md transition-all duration-300">
          <div className="flex items-center gap-3 border-b border-primary/20 pb-4">
            <Activity className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-black tracking-wider text-white uppercase">
              Assessment Parameters
            </h3>
          </div>

          <p className="text-xs text-slate-400">
            Toggle the parameters below to observe how the Mizan engine
            determines the final assessment method for a given case.
          </p>

          <div className="mt-2 flex flex-col gap-4">
            <button
              onClick={() => setGeneralSufficient(!generalSufficient)}
              aria-pressed={generalSufficient}
              className={`rounded-xl flex items-center gap-4 border p-4 transition-all duration-300 ${generalSufficient ? "-translate-y-0.5 border-primary/50 bg-primary/10 shadow-primary/30" : "border-slate-800/50 bg-black/40 hover:border-primary/50"}`}
            >
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${generalSufficient ? "border-primary bg-primary/20" : "border-slate-700"}`}
              >
                {generalSufficient && (
                  <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                )}
              </div>
              <div className="flex flex-col items-start text-left">
                <span
                  className={`text-sm font-bold ${generalSufficient ? "text-primary" : "text-white"}`}
                >
                  General Sufficient
                </span>
                <span className="text-xs text-slate-400">
                  Case can be assessed using general empirical knowledge.
                </span>
              </div>
            </button>

            <button
              onClick={() => setBalanceSatisfied(!balanceSatisfied)}
              aria-pressed={balanceSatisfied}
              className={`rounded-xl flex items-center gap-4 border p-4 transition-all duration-300 ${balanceSatisfied ? "-translate-y-0.5 border-purple-500/50 bg-purple-500/10 shadow-purple-500/30" : "border-slate-800/50 bg-black/40 hover:border-purple-500/50"}`}
            >
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${balanceSatisfied ? "border-purple-500 bg-purple-500/20" : "border-slate-700"}`}
              >
                {balanceSatisfied && (
                  <div className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                )}
              </div>
              <div className="flex flex-col items-start text-left">
                <span
                  className={`text-sm font-bold ${balanceSatisfied ? "text-purple-500" : "text-white"}`}
                >
                  Balance Satisfied
                </span>
                <span className="text-xs text-slate-400">
                  Material balance condition is established without coercion.
                </span>
              </div>
            </button>

            <button
              onClick={() =>
                setInternalReferenceVerified(!internalReferenceVerified)
              }
              aria-pressed={internalReferenceVerified}
              className={`rounded-xl flex items-center gap-4 border p-4 transition-all duration-300 ${internalReferenceVerified ? "-translate-y-0.5 border-emerald-500/50 bg-emerald-500/10 shadow-emerald-500/30" : "border-slate-800/50 bg-black/40 hover:border-emerald-500/50"}`}
            >
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${internalReferenceVerified ? "border-emerald-500 bg-emerald-500/20" : "border-slate-700"}`}
              >
                {internalReferenceVerified && (
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                )}
              </div>
              <div className="flex flex-col items-start text-left">
                <span
                  className={`text-sm font-bold ${internalReferenceVerified ? "text-emerald-500" : "text-white"}`}
                >
                  Internal Reference Verified
                </span>
                <span className="text-xs text-slate-400">
                  Prophetic scriptures explicitly validate the outcome.
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* OUTPUT PANEL */}
        <div
          className={`rounded-xl border ${currentAccent.border}/40 relative flex flex-col overflow-hidden bg-card/90 p-6 backdrop-blur-md transition-all duration-500 ${currentAccent.shadow}`}
        >
          <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
            <Cpu className={`h-40 w-40 ${currentAccent.text}`} />
          </div>

          <div
            className={`flex items-center gap-3 border-b ${currentAccent.border}/20 pb-4`}
          >
            <Sparkles className={`h-5 w-5 ${currentAccent.text}`} />
            <h3 className="text-sm font-black tracking-wider text-white uppercase">
              Engine Output
            </h3>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center py-12">
            <div
              className={`mb-6 rounded-full border p-5 ${currentAccent.border}/30 ${currentAccent.bg}/10 relative`}
            >
              <div
                className={`absolute inset-0 rounded-full ${currentAccent.border}/50 animate-ping opacity-20`}
              />
              <Scale className={`h-12 w-12 ${currentAccent.text}`} />
            </div>

            <h4 className="mb-2 font-mono text-[10px] tracking-[0.3em] text-slate-400 uppercase">
              Selected Method
            </h4>
            <div
              className={`text-3xl font-black tracking-wider uppercase ${currentAccent.text} mb-4 text-center font-sans transition-colors duration-300`}
            >
              {isResolving
                ? "resolving"
                : method?.replace("_", " ") || "unavailable"}
            </div>

            {limitation ? (
              <div
                className={`rounded-xl mt-4 flex max-w-sm items-start gap-3 border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-500`}
              >
                <ShieldAlert className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>
                  <strong className="mb-1 block">Limitation Applied:</strong>{" "}
                  {limitation}
                </span>
              </div>
            ) : isResolving ? (
              <div className="mt-4 rounded-full border border-slate-700/50 bg-slate-900/50 px-6 py-2 font-mono text-xs tracking-widest text-slate-400 uppercase">
                Resolving through Mizan engine
              </div>
            ) : (
              <div className="mt-4 flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-6 py-2 font-mono text-xs tracking-widest text-emerald-500 uppercase">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500 shadow-emerald-500/30" />
                Optimal Path
              </div>
            )}
          </div>

          <div className="relative z-10 mt-auto border-t border-slate-800/50 pt-4">
            <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${currentAccent.bg} shadow-[0_0_5px_currentColor]`}
                />
                STATUS: RESOLVED
              </span>
              <span>CONFIDENCE: HIGH</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
