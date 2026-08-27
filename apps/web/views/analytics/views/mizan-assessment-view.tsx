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

  // Get exact hex for tailwind arbitrary values since dynamic classes like bg-${accent}-500 don't always work in Tailwind JIT unless safelisted.
  const accentColors = {
    cyan: {
      text: "text-[#00F0FF]",
      border: "border-[#00F0FF]",
      bg: "bg-[#00F0FF]",
      shadow: "shadow-[0_0_15px_rgba(0,240,255,0.15)]",
    },
    purple: {
      text: "text-[#A100FF]",
      border: "border-[#A100FF]",
      bg: "bg-[#A100FF]",
      shadow: "shadow-[0_0_15px_rgba(161,0,255,0.15)]",
    },
    amber: {
      text: "text-[#FFE600]",
      border: "border-[#FFE600]",
      bg: "bg-[#FFE600]",
      shadow: "shadow-[0_0_15px_rgba(255,230,0,0.15)]",
    },
    emerald: {
      text: "text-[#00FF66]",
      border: "border-[#00FF66]",
      bg: "bg-[#00FF66]",
      shadow: "shadow-[0_0_15px_rgba(0,255,102,0.15)]",
    },
  }

  const currentAccent = accentColors[accent as keyof typeof accentColors]

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 pb-20 md:px-0">
      {/* HUD Context Block */}
      <div className="rounded-lg border border-[#A100FF]/30 bg-[#0A0F17]/80 p-6 shadow-[0_0_20px_rgba(161,0,255,0.15)] backdrop-blur-md">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h1 className="font-['Orbitron'] text-3xl font-black tracking-wider text-white uppercase">
              MIZAN ASSESSMENT ENGINE
            </h1>
            <p className="mt-1 text-sm text-[#8B9BB0]">
              Public testing interface for the internal weighted-assessment and
              validation logic.
            </p>
          </div>
          <div className="text-right">
            <div className="font-mono text-[10px] tracking-widest text-[#8B9BB0]">
              OPERATION
            </div>
            <div className="font-mono text-xs font-bold text-[#A100FF]">
              SIMULATION-MODE
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* INPUT PANEL */}
        <div className="relative flex flex-col gap-6 overflow-hidden rounded-lg border border-[#00F0FF]/30 bg-[#0A0F17]/80 p-6 backdrop-blur-md transition-all duration-300">
          <div className="flex items-center gap-3 border-b border-[#00F0FF]/20 pb-4">
            <Activity className="h-5 w-5 text-[#00F0FF]" />
            <h3 className="text-sm font-black tracking-wider text-white uppercase">
              Assessment Parameters
            </h3>
          </div>

          <p className="text-xs text-[#8B9BB0]">
            Toggle the parameters below to observe how the Mizan engine
            determines the final assessment method for a given case.
          </p>

          <div className="mt-2 flex flex-col gap-4">
            <button
              onClick={() => setGeneralSufficient(!generalSufficient)}
              aria-pressed={generalSufficient}
              className={`flex items-center gap-4 rounded-lg border p-4 transition-all duration-300 ${generalSufficient ? "-translate-y-0.5 border-[#00F0FF]/50 bg-[#00F0FF]/10 shadow-[0_0_15px_rgba(0,240,255,0.15)]" : "border-slate-800/50 bg-black/40 hover:border-[#00F0FF]/50"}`}
            >
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${generalSufficient ? "border-[#00F0FF] bg-[#00F0FF]/20" : "border-slate-700"}`}
              >
                {generalSufficient && (
                  <div className="h-2.5 w-2.5 rounded-full bg-[#00F0FF]" />
                )}
              </div>
              <div className="flex flex-col items-start text-left">
                <span
                  className={`text-sm font-bold ${generalSufficient ? "text-[#00F0FF]" : "text-[#F5F5F5]"}`}
                >
                  General Sufficient
                </span>
                <span className="text-xs text-[#8B9BB0]">
                  Case can be assessed using general empirical knowledge.
                </span>
              </div>
            </button>

            <button
              onClick={() => setBalanceSatisfied(!balanceSatisfied)}
              aria-pressed={balanceSatisfied}
              className={`flex items-center gap-4 rounded-lg border p-4 transition-all duration-300 ${balanceSatisfied ? "-translate-y-0.5 border-[#A100FF]/50 bg-[#A100FF]/10 shadow-[0_0_15px_rgba(161,0,255,0.15)]" : "border-slate-800/50 bg-black/40 hover:border-[#A100FF]/50"}`}
            >
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${balanceSatisfied ? "border-[#A100FF] bg-[#A100FF]/20" : "border-slate-700"}`}
              >
                {balanceSatisfied && (
                  <div className="h-2.5 w-2.5 rounded-full bg-[#A100FF]" />
                )}
              </div>
              <div className="flex flex-col items-start text-left">
                <span
                  className={`text-sm font-bold ${balanceSatisfied ? "text-[#A100FF]" : "text-[#F5F5F5]"}`}
                >
                  Balance Satisfied
                </span>
                <span className="text-xs text-[#8B9BB0]">
                  Material balance condition is established without coercion.
                </span>
              </div>
            </button>

            <button
              onClick={() =>
                setInternalReferenceVerified(!internalReferenceVerified)
              }
              aria-pressed={internalReferenceVerified}
              className={`flex items-center gap-4 rounded-lg border p-4 transition-all duration-300 ${internalReferenceVerified ? "-translate-y-0.5 border-[#00FF66]/50 bg-[#00FF66]/10 shadow-[0_0_15px_rgba(0,255,102,0.15)]" : "border-slate-800/50 bg-black/40 hover:border-[#00FF66]/50"}`}
            >
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${internalReferenceVerified ? "border-[#00FF66] bg-[#00FF66]/20" : "border-slate-700"}`}
              >
                {internalReferenceVerified && (
                  <div className="h-2.5 w-2.5 rounded-full bg-[#00FF66]" />
                )}
              </div>
              <div className="flex flex-col items-start text-left">
                <span
                  className={`text-sm font-bold ${internalReferenceVerified ? "text-[#00FF66]" : "text-[#F5F5F5]"}`}
                >
                  Internal Reference Verified
                </span>
                <span className="text-xs text-[#8B9BB0]">
                  Prophetic scriptures explicitly validate the outcome.
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* OUTPUT PANEL */}
        <div
          className={`border ${currentAccent.border}/40 relative flex flex-col overflow-hidden rounded-lg bg-[#0A0F17]/90 p-6 backdrop-blur-md transition-all duration-500 ${currentAccent.shadow}`}
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

            <h4 className="mb-2 font-mono text-[10px] tracking-[0.3em] text-[#8B9BB0] uppercase">
              Selected Method
            </h4>
            <div
              className={`text-3xl font-black tracking-wider uppercase ${currentAccent.text} mb-4 text-center font-['Orbitron'] transition-colors duration-300`}
            >
              {isResolving
                ? "resolving"
                : method?.replace("_", " ") || "unavailable"}
            </div>

            {limitation ? (
              <div
                className={`mt-4 flex max-w-sm items-start gap-3 rounded-lg border border-[#FFE600]/30 bg-[#FFE600]/10 p-3 text-xs text-[#FFE600]`}
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
              <div className="mt-4 flex items-center gap-2 rounded-full border border-[#00FF66]/30 bg-[#00FF66]/10 px-6 py-2 font-mono text-xs tracking-widest text-[#00FF66] uppercase">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00FF66] shadow-[0_0_5px_#00FF66]" />
                Optimal Path
              </div>
            )}
          </div>

          <div className="relative z-10 mt-auto border-t border-slate-800/50 pt-4">
            <div className="flex items-center justify-between font-mono text-[10px] text-[#8B9BB0]">
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
