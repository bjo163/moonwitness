"use client"

import React from "react"
import { Anchor, Navigation, Activity } from "lucide-react"
import { MaritimeShip } from "@moon/client"

export function MaritimeTrafficWidget({
  ships = [],
}: {
  ships: MaritimeShip[]
}) {
  const cargoCount = ships.filter((s) => s.type === "Cargo").length
  const tankerCount = ships.filter((s) => s.type === "Tanker").length

  return (
    <div className="bg-space flex h-full flex-col rounded-xl border border-primary/30 p-4 lg:col-span-12 xl:col-span-4">
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-primary uppercase">
          <Anchor className="h-4 w-4" />
          MARITIME TRAFFIC
          <span className="rounded-[2px] border border-primary/50 bg-primary/20 px-1.5 py-0.5 text-[8px] text-primary">
            LIVE
          </span>
        </div>
      </div>

      <div className="mb-4 flex gap-4">
        <div className="flex-1 rounded border border-white/10 bg-white/5 p-2 text-center">
          <div className="mb-1 text-[10px] font-bold text-white/50">
            TOTAL SHIPS
          </div>
          <div className="font-mono text-xl font-black text-primary">
            {ships.length}
          </div>
        </div>
        <div className="flex-1 rounded border border-white/10 bg-white/5 p-2 text-center">
          <div className="mb-1 text-[10px] font-bold text-white/50">
            AVG SPEED
          </div>
          <div className="font-mono text-xl font-black text-primary">
            {ships.length > 0
              ? Math.round(
                  ships.reduce((acc, s) => acc + s.speed, 0) / ships.length
                )
              : 0}
            <span className="ml-1 text-[10px]">KNOTS</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="mb-2 grid grid-cols-12 gap-4 border-b border-white/5 pb-2 text-[8px] font-bold tracking-widest text-white/50">
          <div className="col-span-3">VESSEL</div>
          <div className="col-span-3">TYPE</div>
          <div className="col-span-3">DESTINATION</div>
          <div className="col-span-3 text-right">SPEED</div>
        </div>

        <div className="hide-scrollbar flex h-[250px] flex-col space-y-1 overflow-y-auto">
          {ships.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center font-mono text-[10px] text-primary/50">
              <Activity className="h-6 w-6 animate-pulse" />
              Scanning oceans for vessel transponders...
            </div>
          ) : (
            ships.map((ship) => (
              <div
                key={ship.id}
                className="group grid grid-cols-12 items-center gap-4 rounded border border-transparent px-2 py-2 text-[9px] transition-colors hover:border-white/10 hover:bg-white/5"
              >
                <div className="col-span-3 flex items-center gap-2 font-bold text-white transition-colors group-hover:text-primary">
                  <Navigation
                    className="h-3 w-3 opacity-50"
                    style={{ transform: `rotate(${ship.heading}deg)` }}
                  />
                  <span className="truncate">{ship.name}</span>
                </div>
                <div className="col-span-3">
                  <span
                    className={`rounded-sm border px-1.5 py-0.5 text-[7px] font-black uppercase ${
                      ship.type === "Cargo"
                        ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
                        : ship.type === "Tanker"
                          ? "border-warning/30 text-warning bg-warning/10"
                          : "border-white/30 bg-white/10 text-white"
                    }`}
                  >
                    {ship.type}
                  </span>
                </div>
                <div className="col-span-3 truncate font-mono text-white/70">
                  {ship.destination}
                </div>
                <div className="col-span-3 text-right font-mono text-primary">
                  {Math.round(ship.speed)} KTS
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
