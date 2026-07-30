"use client"

import React from "react"
import { Anchor, Navigation, Activity } from "lucide-react"
import { MaritimeShip } from "../../api/hooks/use-global-monitoring"

export function MaritimeTrafficWidget({ ships = [] }: { ships: MaritimeShip[] }) {
  const cargoCount = ships.filter(s => s.type === "Cargo").length
  const tankerCount = ships.filter(s => s.type === "Tanker").length
  
  return (
    <div className="bg-space border-primary/30 flex flex-col rounded-xl border p-4 lg:col-span-12 xl:col-span-4 h-full">
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-2">
        <div className="text-[10px] font-black tracking-widest text-primary uppercase flex items-center gap-2">
          <Anchor className="h-4 w-4" />
          MARITIME TRAFFIC
          <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded-[2px] text-[8px] border border-primary/50">LIVE</span>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="bg-white/5 rounded p-2 flex-1 border border-white/10 text-center">
          <div className="text-[10px] font-bold text-white/50 mb-1">TOTAL SHIPS</div>
          <div className="text-xl font-mono text-primary font-black">{ships.length}</div>
        </div>
        <div className="bg-white/5 rounded p-2 flex-1 border border-white/10 text-center">
          <div className="text-[10px] font-bold text-white/50 mb-1">AVG SPEED</div>
          <div className="text-xl font-mono text-primary font-black">
            {ships.length > 0 ? Math.round(ships.reduce((acc, s) => acc + s.speed, 0) / ships.length) : 0} 
            <span className="text-[10px] ml-1">KNOTS</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 text-[8px] font-bold text-white/50 tracking-widest mb-2 border-b border-white/5 pb-2">
          <div className="col-span-3">VESSEL</div>
          <div className="col-span-3">TYPE</div>
          <div className="col-span-3">DESTINATION</div>
          <div className="col-span-3 text-right">SPEED</div>
        </div>

        <div className="hide-scrollbar flex flex-col space-y-1 h-[250px] overflow-y-auto">
          {ships.length === 0 ? (
            <div className="text-center text-primary/50 text-[10px] py-10 font-mono flex flex-col items-center gap-2">
              <Activity className="h-6 w-6 animate-pulse" />
              Scanning oceans for vessel transponders...
            </div>
          ) : (
            ships.map((ship) => (
              <div
                key={ship.id}
                className="grid grid-cols-12 gap-4 text-[9px] items-center py-2 px-2 hover:bg-white/5 border border-transparent hover:border-white/10 rounded transition-colors group"
              >
                <div className="col-span-3 font-bold text-white group-hover:text-primary transition-colors flex items-center gap-2">
                  <Navigation className="h-3 w-3 opacity-50" style={{ transform: `rotate(${ship.heading}deg)` }} />
                  <span className="truncate">{ship.name}</span>
                </div>
                <div className="col-span-3">
                  <span className={`px-1.5 py-0.5 text-[7px] font-black uppercase rounded-sm border ${
                    ship.type === "Cargo" ? "border-blue-500/30 text-blue-400 bg-blue-500/10" :
                    ship.type === "Tanker" ? "border-warning/30 text-warning bg-warning/10" :
                    "border-white/30 text-white bg-white/10"
                  }`}>
                    {ship.type}
                  </span>
                </div>
                <div className="col-span-3 text-white/70 font-mono truncate">
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
