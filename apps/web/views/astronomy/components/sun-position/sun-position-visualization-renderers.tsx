"use client"

import { Sun } from "lucide-react"

const SUN_PATH_POINTS = [
  { time: "12:07", label: "SOLAR NOON", className: "top-[5px] left-[50%] -translate-x-1/2 items-center" },
  { time: "09:18", label: "MORNING", className: "top-[60%] left-[25%] -translate-x-1/2 items-center" },
  { time: "15:02", label: "AFTERNOON", className: "top-[60%] right-[25%] translate-x-1/2 items-center" },
  { time: "05:46", label: "SUNRISE", className: "bottom-[2px] left-2 items-start" },
  { time: "18:28", label: "SUNSET", className: "right-2 bottom-[2px] items-end" },
] as const

function SolarArcTrajectory() {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-5 lg:col-span-5">
      <div className="mb-6 flex items-start justify-between"><div><h3 className="mb-1 text-[10px] font-bold tracking-widest text-foreground uppercase">SOLAR ARC TRAJECTORY</h3><p className="text-[9px] text-muted-foreground">Real-time sun path based on your location</p></div><div className="flex items-center gap-2 rounded bg-rose-500/10 px-2 py-1"><div className="h-1.5 w-1.5 animate-ping rounded-full bg-rose-500" /><span className="text-[8px] font-bold tracking-widest text-rose-500">LIVE</span></div></div>
      <div className="relative mt-4 flex min-h-[220px] w-full items-end">
        <svg viewBox="0 0 100 50" className="absolute inset-x-0 bottom-10 h-full w-full overflow-visible drop-shadow-sm"><path d="M 5 45 Q 50 -10 95 45" fill="none" stroke="url(#arcGradient)" strokeWidth="1" strokeDasharray="2 1" /><path d="M 5 45 Q 27.5 17 50 17.5" fill="none" stroke="#facc15" strokeWidth="1.5" /><defs><linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#3b82f6" /><stop offset="30%" stopColor="#f59e0b" /><stop offset="70%" stopColor="#ea580c" /><stop offset="100%" stopColor="#1e3a8a" /></linearGradient></defs><circle cx="5" cy="45" r="1.5" fill="#3b82f6" /><circle cx="27.5" cy="27" r="1.5" fill="#eab308" /><circle cx="50" cy="17.5" r="4" fill="#facc15" className="drop-shadow-sm" /><circle cx="72.5" cy="27" r="1.5" fill="#ea580c" /><circle cx="95" cy="45" r="1.5" fill="#1e3a8a" /></svg>
        <div className="absolute inset-x-0 bottom-6 z-0 h-16 border-b border-warning/20 bg-gradient-to-t -background to-transparent opacity-90" />
        {SUN_PATH_POINTS.map((point, index) => <div key={point.label} className={`absolute z-10 flex -translate-y-1/2 flex-col ${point.className}`}><span className={`font-mono ${index === 0 ? "text-[12px]" : "text-[10px]"} text-foreground`}>{point.time}</span><span className={`text-[${index === 0 ? "8" : "7"}px] font-bold tracking-widest ${index === 0 ? "text-warning" : "text-foreground/50"} uppercase`}>{point.label}</span></div>)}
      </div>
      <div className="mt-6 grid grid-cols-4 gap-4 border-t border-border pt-6 text-[9px]">{[["LOCATION", "-6.251, 107.873"], ["DATE", "30 JULY 2026"], ["DAY LENGTH", "12h 42m"], ["NEXT SUNRISE", "05:46:12"]].map(([label, value]) => <div key={label}><div className="mb-1 tracking-widest text-muted-foreground uppercase">{label}</div><div className="font-mono text-foreground">{value}</div></div>)}</div>
    </div>
  )
}

const EXPOSURE_NOTES = ["Avoid peak UV (10:00 - 15:00)", "Use sunscreen if > 30 minutes", "Stay hydrated & wear light clothing"]

function ExposureRecommendation() {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-5 lg:col-span-3">
      <div className="mb-6"><h3 className="mb-1 text-[10px] font-bold tracking-widest text-foreground uppercase">SUNLIGHT EXPOSURE RECOMMENDATION</h3><p className="text-[9px] text-muted-foreground">Based on your skin type & UV Index</p></div>
      <div className="relative mt-6 mb-8 flex justify-center"><div className="relative flex h-32 w-32 items-center justify-center rounded-full border-[6px] border-border shadow-sm"><svg className="absolute inset-0 h-full w-full -rotate-90"><circle cx="50%" cy="50%" r="46%" fill="none" stroke="#f59e0b" strokeWidth="6" strokeDasharray="300" strokeDashoffset="100" strokeLinecap="round" /></svg><div className="text-center"><div className="text-2xl font-black text-foreground">15 - 30</div><div className="text-[7px] font-bold tracking-widest text-warning uppercase">MINUTES</div><div className="mt-1 text-[6px] tracking-widest text-foreground/50 uppercase">RECOMMENDED</div><div className="text-[6px] tracking-widest text-foreground/50 uppercase">DAILY EXPOSURE</div></div></div></div>
      <div className="mb-4 grid grid-cols-2 gap-4 border-t border-border pt-4"><div className="text-center"><div className="mb-1 text-[7px] tracking-widest text-muted-foreground uppercase">OPTIMAL TIME</div><div className="font-mono text-[10px] text-foreground">07:00 - 10:00</div></div><div className="border-l border-border text-center"><div className="mt-3 font-mono text-[10px] text-foreground">15:30 - 17:30</div></div></div>
      <ul className="mt-6 space-y-2">{EXPOSURE_NOTES.map((note) => <li key={note} className="flex items-start gap-2 text-[8px]"><div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" /><span className="text-foreground">{note}</span></li>)}</ul>
    </div>
  )
}

const VITAMIN_STAGES = [["SUNLIGHT", "UVB"], ["SKIN", "7-Dehydrocholesterol"], ["LIVER", "Calcidiol"], ["KIDNEY", "Active Vitamin D"]] as const

function VitaminDSynthesis() {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-5 lg:col-span-4">
      <div className="mb-6"><h3 className="mb-1 text-[10px] font-bold tracking-widest text-foreground uppercase">VITAMIN D SYNTHESIS</h3><p className="text-[9px] text-muted-foreground">How your body produces Vitamin D from sunlight</p></div>
      <div className="mt-6 flex gap-6"><div className="mt-2 flex flex-col items-center gap-2"><Sun className="h-6 w-6 text-warning drop-shadow-sm" />{["rounded-sm border-rose-400/80", "rounded-full border-red-500/80", "h-4 w-6 rounded-full border-amber-600/80"].map((className, index) => <div key={className} className={index < 2 ? `h-4 w-4 border-[2px] ${className}` : `border-[2px] ${className}`}>{index < 2 && <><span className="sr-only">Stage {index + 1}</span></>}</div>)}</div><div className="flex w-full flex-col gap-8">{VITAMIN_STAGES.map(([label, detail], index) => <div key={label} className={index === 3 ? "flex items-end justify-between" : ""}><div><div className="text-[8px] font-bold tracking-widest text-foreground uppercase">{label}</div><div className="text-[7px] text-foreground/50">{detail}</div></div>{index === 3 && <div className="text-right"><div className="mb-1 text-[7px] tracking-widest text-muted-foreground uppercase">DAILY NEED</div><div className="font-mono text-[10px] font-bold text-warning">600 - 800 IU</div></div>}</div>)}</div></div>
    </div>
  )
}

export function SunPositionVisualizationPanels() {
  return <><SolarArcTrajectory /><ExposureRecommendation /><VitaminDSynthesis /></>
}
