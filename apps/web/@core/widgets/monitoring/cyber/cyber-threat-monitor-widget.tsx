"use client"

import React from "react"
import { ShieldAlert, Crosshair, ServerCrash, Cpu } from "lucide-react"
import { CyberAttack } from "../../../api/hooks/use-global-monitoring"

export function CyberThreatMonitorWidget({
  cyberAttacks = [],
}: {
  cyberAttacks?: CyberAttack[]
}) {
  return (
    <div className="bg-space flex flex-col rounded-xl border border-red-500/30 p-4 shadow-[0_0_30px_rgba(255,0,0,0.1)] lg:col-span-12 xl:col-span-8">
      <div className="mb-4 flex items-center justify-between border-b border-red-500/20 pb-2">
        <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-red-500 uppercase">
          <ShieldAlert className="h-4 w-4 animate-pulse" />
          GLOBAL CYBER THREAT MONITOR
          <span className="rounded-[2px] border border-red-500/50 bg-red-500/20 px-1.5 py-0.5 text-[8px] text-red-500">
            DEFCON 3
          </span>
        </div>
        <div className="font-mono text-[10px] text-red-400">
          ATTACKS DETECTED: {cyberAttacks.length}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="mb-2 grid grid-cols-12 gap-4 border-b border-white/5 pb-2 text-[8px] font-bold tracking-widest text-red-500/50">
          <div className="col-span-2">TIMESTAMP</div>
          <div className="col-span-2">TYPE</div>
          <div className="col-span-3">SOURCE (LAT, LNG)</div>
          <div className="col-span-3">TARGET (LAT, LNG)</div>
          <div className="col-span-2 text-right">STATUS</div>
        </div>

        <div className="hide-scrollbar flex h-[200px] flex-col space-y-1 overflow-y-auto">
          {cyberAttacks.length === 0 ? (
            <div className="py-10 text-center font-mono text-[10px] text-red-500/50">
              Listening to global network traffic...
            </div>
          ) : (
            cyberAttacks.map((attack) => (
              <div
                key={attack.id}
                className="grid grid-cols-12 items-center gap-4 rounded border border-transparent bg-red-950/20 px-2 py-1.5 font-mono text-[9px] text-red-400 transition-colors hover:border-red-500/30 hover:bg-red-900/40"
              >
                <div className="col-span-2 text-white/50">
                  {new Date(attack.timestamp).toLocaleTimeString([], {
                    hour12: false,
                    fractionalSecondDigits: 2,
                  })}
                </div>
                <div className="col-span-2 flex items-center gap-1 font-bold">
                  {attack.type === "DDoS" && (
                    <ServerCrash className="h-3 w-3" />
                  )}
                  {attack.type === "Malware" && <Cpu className="h-3 w-3" />}
                  {attack.type === "Phishing" && (
                    <Crosshair className="h-3 w-3" />
                  )}
                  {attack.type === "Exploit" && (
                    <ShieldAlert className="h-3 w-3" />
                  )}
                  {attack.type}
                </div>
                <div className="col-span-3 opacity-70">
                  [{attack.source[0].toFixed(2)}, {attack.source[1].toFixed(2)}]
                </div>
                <div className="col-span-3 opacity-70">
                  [{attack.target[0].toFixed(2)}, {attack.target[1].toFixed(2)}]
                </div>
                <div className="col-span-2 text-right">
                  <span className="animate-pulse rounded-sm bg-red-500 px-1.5 py-0.5 text-[7px] font-black text-black">
                    BLOCKED
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
