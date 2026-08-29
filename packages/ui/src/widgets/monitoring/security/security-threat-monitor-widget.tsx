"use client"

import React from "react"
import { ShieldAlert, Crosshair } from "lucide-react"
import { type CyberAttack } from "@moon/client"

export function SecurityThreatMonitorWidget({
  cyberAttacks = [],
}: {
  cyberAttacks?: CyberAttack[]
}) {
  return (
    <div className="bg-background flex flex-col rounded-xl border border-destructive/30 p-4 shadow-sm lg:col-span-12 xl:col-span-8 font-sans">
      <div className="mb-4 flex items-center justify-between border-b border-destructive/20 pb-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-destructive">
          <ShieldAlert className="h-4 w-4" />
          <span>Security Threat Monitor</span>
          <span className="rounded-md border border-destructive/50 bg-destructive/10 px-1.5 py-0.5 text-[10px]">
            Alert Active
          </span>
        </div>
        <div className="text-xs text-muted-foreground">
          Events Detected: {cyberAttacks.length}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="mb-2 grid grid-cols-12 gap-4 border-b border-border/40 pb-2 text-[10px] font-semibold text-muted-foreground">
          <div className="col-span-2">TIMESTAMP</div>
          <div className="col-span-2">TYPE</div>
          <div className="col-span-3">SOURCE (LAT, LNG)</div>
          <div className="col-span-3">TARGET (LAT, LNG)</div>
          <div className="col-span-2 text-right">STATUS</div>
        </div>

        <div className="hide-scrollbar flex h-[200px] flex-col space-y-1 overflow-y-auto">
          {cyberAttacks.length === 0 ? (
            <div className="py-10 text-center text-xs text-muted-foreground">
              Monitoring network activity...
            </div>
          ) : (
            cyberAttacks.map((attack, index) => (
              <div
                key={index}
                className="grid grid-cols-12 items-center gap-4 rounded-lg bg-card/60 px-2 py-1.5 font-mono text-[10px] text-foreground hover:bg-muted/40 transition-colors"
              >
                <div className="col-span-2 text-muted-foreground">
                  {new Date(attack.timestamp).toLocaleTimeString()}
                </div>
                <div className="col-span-2 flex items-center gap-1 font-semibold text-destructive">
                  <Crosshair className="h-3 w-3" />
                  {attack.type}
                </div>
                <div className="col-span-3 text-muted-foreground">
                  {attack.source ? `${attack.source[0].toFixed(2)}, ${attack.source[1].toFixed(2)}` : "—"}
                </div>
                <div className="col-span-3 text-muted-foreground">
                  {attack.target ? `${attack.target[0].toFixed(2)}, ${attack.target[1].toFixed(2)}` : "—"}
                </div>
                <div className="col-span-2 text-right">
                  <span className="rounded-md border border-destructive/30 bg-destructive/10 px-1.5 py-0.5 text-[9px] text-destructive">
                    INTERCEPTED
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
export const CyberThreatMonitorWidget = SecurityThreatMonitorWidget
