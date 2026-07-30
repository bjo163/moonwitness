"use client"

import React from "react"
import { ShieldAlert, Crosshair, ServerCrash, Cpu } from "lucide-react"
import { CyberAttack } from "../../api/hooks/use-global-monitoring"

export function CyberThreatMonitorWidget({ cyberAttacks = [] }: { cyberAttacks?: CyberAttack[] }) {
  return (
    <div className="bg-space flex flex-col rounded-xl border border-red-500/30 p-4 lg:col-span-12 xl:col-span-8 shadow-[0_0_30px_rgba(255,0,0,0.1)]">
      <div className="mb-4 flex items-center justify-between border-b border-red-500/20 pb-2">
        <div className="text-[10px] font-black tracking-widest text-red-500 uppercase flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 animate-pulse" />
          GLOBAL CYBER THREAT MONITOR
          <span className="bg-red-500/20 text-red-500 px-1.5 py-0.5 rounded-[2px] text-[8px] border border-red-500/50">DEFCON 3</span>
        </div>
        <div className="text-[10px] font-mono text-red-400">
          ATTACKS DETECTED: {cyberAttacks.length}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 text-[8px] font-bold text-red-500/50 tracking-widest mb-2 border-b border-white/5 pb-2">
          <div className="col-span-2">TIMESTAMP</div>
          <div className="col-span-2">TYPE</div>
          <div className="col-span-3">SOURCE (LAT, LNG)</div>
          <div className="col-span-3">TARGET (LAT, LNG)</div>
          <div className="col-span-2 text-right">STATUS</div>
        </div>

        <div className="hide-scrollbar flex flex-col space-y-1 h-[200px] overflow-y-auto">
          {cyberAttacks.length === 0 ? (
            <div className="text-center text-red-500/50 text-[10px] py-10 font-mono">
              Listening to global network traffic...
            </div>
          ) : (
            cyberAttacks.map((attack) => (
              <div
                key={attack.id}
                className="grid grid-cols-12 gap-4 text-[9px] font-mono text-red-400 items-center py-1.5 px-2 bg-red-950/20 rounded hover:bg-red-900/40 border border-transparent hover:border-red-500/30 transition-colors"
              >
                <div className="col-span-2 text-white/50">
                  {new Date(attack.timestamp).toLocaleTimeString([], { hour12: false, fractionalSecondDigits: 2 })}
                </div>
                <div className="col-span-2 flex items-center gap-1 font-bold">
                  {attack.type === "DDoS" && <ServerCrash className="h-3 w-3" />}
                  {attack.type === "Malware" && <Cpu className="h-3 w-3" />}
                  {attack.type === "Phishing" && <Crosshair className="h-3 w-3" />}
                  {attack.type === "Exploit" && <ShieldAlert className="h-3 w-3" />}
                  {attack.type}
                </div>
                <div className="col-span-3 opacity-70">
                  [{attack.source[0].toFixed(2)}, {attack.source[1].toFixed(2)}]
                </div>
                <div className="col-span-3 opacity-70">
                  [{attack.target[0].toFixed(2)}, {attack.target[1].toFixed(2)}]
                </div>
                <div className="col-span-2 text-right">
                  <span className="px-1.5 py-0.5 bg-red-500 text-black font-black text-[7px] rounded-sm animate-pulse">BLOCKED</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
