"use client"

import type { ReactNode } from "react"

function SunPanel({ title, description, children, className = "" }: { title: string; description: string; children: ReactNode; className?: string }) {
  return (
    <div className={`relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-5 ${className}`}>
      <div className="relative z-10 mb-4">
        <h3 className="mb-1 text-[10px] font-bold tracking-widest text-foreground uppercase">{title}</h3>
        <p className="text-[9px] text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  )
}

const QIBLA_LABELS = [
  ["FAJR", "-18.0°"],
  ["DHUHR", "PEAK"],
  ["ASR", "SHADOW"],
  ["MAGHRIB", "0.0°"],
  ["ISHA", "-18.0°"],
] as const

export function QiblaSolarAlignment() {
  return (
    <SunPanel title="QIBLA SOLAR ALIGNMENT" description="Sun's relation to the Sacred Mosque" className="group lg:col-span-4">
      <div className="relative my-4 flex h-40 w-full items-center justify-center">
        <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full animate-[spin_60s_linear_infinite] opacity-30">
          <circle cx="100" cy="100" r="90" fill="none" stroke="#FBBF24" strokeWidth="1" strokeDasharray="4 8" />
          <circle cx="100" cy="100" r="70" fill="none" stroke="#34D399" strokeWidth="0.5" strokeDasharray="1 4" />
        </svg>
        <div className="relative z-10 flex h-10 w-10 rotate-45 items-center justify-center border-[2px] border-amber-500/50 bg-muted shadow-sm">
          <div className="h-6 w-6 border border-warning/30" />
          <div className="absolute -top-6 -right-6 font-mono text-[6px] text-success">21.42° N</div>
        </div>
        <div className="absolute top-1/2 left-1/2 z-0 h-[1px] w-32 origin-left -translate-y-1/2 -rotate-[22deg] bg-gradient-to-r from-amber-500 to-transparent">
          <div className="absolute top-1/2 right-0 h-4 w-4 -translate-y-1/2 rounded-full bg-amber-400 blur-[3px]" />
        </div>
      </div>
      <div className="relative z-10 mt-auto">
        <div className="mb-2 grid grid-cols-5 border-b border-border pb-2 text-[7px] tracking-widest text-muted-foreground uppercase">
          {QIBLA_LABELS.map(([label]) => <div key={label}>{label}</div>)}
        </div>
        <div className="grid grid-cols-5 font-mono text-[8px] text-foreground">
          {QIBLA_LABELS.map(([label, value], index) => <div key={label} className={index === 1 ? "text-center font-bold text-warning" : index === 0 ? "" : index === 4 ? "text-right" : "text-center"}>{value}</div>)}
        </div>
      </div>
    </SunPanel>
  )
}

const SPECTRUM_BANDS = [
  { label: "VISIBLE (400-700nm)", path: "M 0 25 Q 15 0 30 25 T 60 25 T 90 25 T 120 25 T 150 25 T 180 25 T 210 25 T 240 25 T 270 25 T 300 25", stroke: "#FBBF24", width: "1.5", dash: undefined },
  { label: "ULTRAVIOLET (10-400nm)", path: "M 0 25 Q 5 10 10 25 T 20 25 T 30 25 T 40 25 T 50 25 T 60 25 T 70 25 T 80 25 T 90 25 T 100 25 T 110 25 T 120 25 T 130 25 T 140 25 T 150 25 T 160 25 T 170 25 T 180 25 T 190 25 T 200 25 T 210 25 T 220 25 T 230 25 T 240 25 T 250 25 T 260 25 T 270 25 T 280 25 T 290 25 T 300 25", stroke: "#8B5CF6", width: "1", dash: "2 1" },
  { label: "INFRARED (>700nm)", path: "M 0 25 Q 40 -10 80 25 T 160 25 T 240 25 T 320 25", stroke: "#EF4444", width: "2", dash: undefined },
] as const

export function ElectromagneticSpectrum() {
  return (
    <SunPanel title="ELECTROMAGNETIC SPECTRUM" description="Real-time solar frequency monitor" className="lg:col-span-4">
      <div className="relative z-10 mb-6 flex items-start justify-between">
        <span className="rounded border border-border bg-primary/10 px-2 py-0.5 text-[7px] font-bold tracking-widest text-primary">UVA/UVB SAFE</span>
      </div>
      <div className="relative my-4 flex flex-1 flex-col justify-center opacity-80">
        {SPECTRUM_BANDS.map((band, index) => (
          <svg key={band.label} viewBox="0 0 300 50" className={`${index > 0 ? "mt-2 " : ""}h-12 w-full overflow-visible`}>
            <path d={band.path} fill="none" stroke={band.stroke} strokeWidth={band.width} strokeDasharray={band.dash} className={index === 0 ? "animate-[pulse_2s_ease-in-out_infinite]" : ""} opacity={index === 2 ? 0.6 : undefined} />
            <text x="5" y="10" fill={band.stroke} fontSize="8" fontFamily="monospace">{band.label}</text>
          </svg>
        ))}
      </div>
      <div className="relative z-10 mt-auto grid grid-cols-2 gap-4 border-t border-border pt-4 text-[9px]">
        <div><div className="mb-1 tracking-widest text-muted-foreground uppercase">SOLAR FLARE STATUS</div><div className="font-mono font-bold text-success">CLASS A (NORMAL)</div></div>
        <div className="text-right"><div className="mb-1 tracking-widest text-muted-foreground uppercase">OZONE BLOCKING</div><div className="font-mono font-bold text-primary">98.5% EFFICIENT</div></div>
      </div>
    </SunPanel>
  )
}

export function CellularPhotonAbsorption() {
  return (
    <SunPanel title="CELLULAR PHOTON ABSORPTION" description="Near-Infrared impact on Mitochondria" className="group lg:col-span-4">
      <div className="relative my-2 flex min-h-[140px] flex-1 items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.1)_0%,transparent_70%)]" />
        <div className="relative flex h-16 w-32 items-center justify-center overflow-hidden rounded-[40px] border border-rose-500/30 bg-rose-500/5">
          <svg viewBox="0 0 100 40" className="absolute inset-0 h-full w-full opacity-50"><path d="M 10 20 L 20 10 L 30 30 L 40 10 L 50 30 L 60 10 L 70 30 L 80 10 L 90 20" fill="none" stroke="#FB7185" strokeWidth="2" strokeLinejoin="round" /></svg>
          <div className="relative z-10 rounded border border-rose-500/20 bg-card px-3 py-1 text-[7px] font-bold tracking-widest text-rose-300 backdrop-blur-sm">MITOCHONDRIA</div>
        </div>
        <div className="absolute top-1/2 left-[10%] flex -translate-y-1/2 animate-pulse gap-1">{[1, 2, 3].map((item) => <div key={item} className="h-1.5 w-1.5 rounded-full bg-amber-400 drop-shadow-sm" />)}</div>
        <div className="absolute top-1/2 right-[15%] flex -translate-y-1/2 flex-col items-center gap-1">{[1, 2].map((item) => <div key={item} className={`flex h-4 w-4 animate-bounce items-center justify-center rounded border border-emerald-500/50 bg-success/20 text-[5px] font-black text-success ${item === 2 ? "delay-75" : ""}`}>ATP</div>)}</div>
      </div>
      <div className="z-10 mt-auto border-t border-border pt-4"><p className="text-center text-[8px] leading-relaxed text-foreground/60">Red and near-infrared light (600-900nm) penetrates skin and stimulates <span className="font-bold text-rose-400">Cytochrome C Oxidase</span> in mitochondria, increasing ATP (cellular energy) production.</p></div>
    </SunPanel>
  )
}
