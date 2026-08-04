"use client"

import React, { useEffect, useState } from "react"
import { Map, Scan, MapPin } from "lucide-react"

export function MosqueRadarWidget() {
  const [scanning, setScanning] = useState(true)
  const [mosques, setMosques] = useState<any[]>([])

  useEffect(() => {
    // Simulate radar scanning
    const timer = setTimeout(() => {
      setMosques([
        { id: 1, name: "Masjid Al-Ikhlas", distance: "450m", dir: "NE", pos: { top: "30%", left: "70%" } },
        { id: 2, name: "Masjid Raya", distance: "1.2km", dir: "SW", pos: { top: "80%", left: "20%" } },
        { id: 3, name: "Musala Nurul Huda", distance: "200m", dir: "N", pos: { top: "15%", left: "55%" } },
      ])
      setScanning(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="bg-space/60 rounded-2xl border border-emerald-500/20 p-5 backdrop-blur-xl relative overflow-hidden h-full flex flex-col">
      <div className="mb-4 flex items-center justify-between relative z-10">
        <h3 className="font-sans text-xs font-bold tracking-wider text-emerald-400 uppercase">
          Local Intel (Mosques)
        </h3>
        <Map className="h-4 w-4 text-emerald-500/50" />
      </div>

      <div className="relative flex-1 min-h-[160px] rounded-xl border border-emerald-500/30 bg-black/60 overflow-hidden flex items-center justify-center">
        {/* Radar Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          <div className="h-full aspect-square rounded-full border border-emerald-500/30 absolute"></div>
          <div className="h-2/3 aspect-square rounded-full border border-emerald-500/30 absolute"></div>
          <div className="h-1/3 aspect-square rounded-full border border-emerald-500/30 absolute"></div>
          <div className="h-full w-px bg-emerald-500/20 absolute"></div>
          <div className="w-full h-px bg-emerald-500/20 absolute"></div>
        </div>

        {/* Scanner Sweep */}
        <div className="absolute top-1/2 left-1/2 w-[50%] h-[50%] bg-[conic-gradient(from_0deg,transparent_70%,rgba(16,185,129,0.4)_100%)] origin-top-left animate-[spin_4s_linear_infinite] rounded-tl-full opacity-50 z-10"></div>

        {/* Center Point (User) */}
        <div className="absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_10px_#00F0FF] z-20"></div>

        {/* Scanning text */}
        {scanning ? (
          <div className="absolute z-30 flex flex-col items-center gap-2">
            <Scan className="h-6 w-6 text-emerald-400 animate-ping opacity-50" />
            <span className="font-mono text-[9px] text-emerald-400 uppercase tracking-widest">Scanning Area...</span>
          </div>
        ) : (
          /* Mosques */
          mosques.map((m) => (
            <div 
              key={m.id} 
              className="absolute z-20 flex flex-col items-center group cursor-crosshair"
              style={m.pos}
            >
              <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981] animate-pulse"></div>
              <div className="absolute top-3 bg-black/80 border border-emerald-500/40 rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                <div className="text-[9px] font-bold text-white">{m.name}</div>
                <div className="font-mono text-[8px] text-emerald-400">{m.distance} | {m.dir}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-[9px] font-mono text-emerald-400/60 uppercase">
        <span>Radius: 2.5km</span>
        <span>{scanning ? "0" : mosques.length} Targets</span>
      </div>
    </div>
  )
}
