"use client"

import React from "react"
import { Cpu, Database, Network, Activity, ShieldCheck } from "lucide-react"

const TELEMETRY_METRIC_COUNT = 4

export function SystemDiagnosticsSidebar() {
  const metrics = [
    {
      label: "CORE CPU LOAD",
      val: "38.2%",
      icon: Cpu,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/30",
    },
    {
      label: "MEMORY BUFFER",
      val: "1.4 / 4.0 GB",
      icon: Database,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/30",
    },
    {
      label: "NET LATENCY",
      val: "14.2 ms",
      icon: Network,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
    },
    {
      label: "ENTROPY FLICKER",
      val: "0.0034 eV",
      icon: Activity,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-cyan-500/30 bg-black/60 p-5 shadow-sm backdrop-blur-md">
        <h3 className="mb-4 flex items-center gap-2 font-mono text-xs font-bold tracking-widest text-white uppercase">
          <ShieldCheck className="h-4 w-4 text-cyan-400" />
          Hardware Telemetry ({TELEMETRY_METRIC_COUNT} Nodes)
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {metrics.map((m) => (
            <div
              key={m.label}
              className={`rounded-lg border ${m.border} ${m.bg} p-3 transition-colors hover:border-white/20`}
            >
              <div className="flex items-center gap-2">
                <m.icon className={`h-4 w-4 ${m.color}`} />
                <span className="font-mono text-[9px] tracking-wider text-muted-foreground">
                  {m.label}
                </span>
              </div>
              <p className="mt-2 font-mono text-sm font-bold text-foreground">{m.val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
