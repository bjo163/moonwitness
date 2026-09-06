import { Globe, Infinity as InfinityIcon, Moon } from "lucide-react"
import type { AEQ4Timestamp, HijriDate, LunarPosition } from "@moon/time"
import { getLunarIcon, pad } from "./home-aeq4-utils"

export function HomeAEQ4Clocks({
  utcNow,
  hijri,
  lunar,
  aeq,
  isPreEra,
}: {
  utcNow: Date
  hijri: HijriDate
  lunar: LunarPosition
  aeq: AEQ4Timestamp
  isPreEra: boolean
}) {
  return (
    <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="rounded-xl border border-primary/25 bg-card p-4">
        <div className="mb-2 flex items-center gap-2">
          <Globe className="h-3.5 w-3.5 text-primary/60" />
          <span className="font-mono text-[9px] tracking-widest text-primary/60 uppercase">
            L1 · UTC
          </span>
        </div>
        <div className="font-mono text-lg font-black text-foreground">
          {pad(utcNow.getUTCHours())}:{pad(utcNow.getUTCMinutes())}:
          {pad(utcNow.getUTCSeconds())}
        </div>
        <div className="mt-1 font-mono text-[10px] text-foreground/40">
          {utcNow.toISOString().slice(0, 10)}Z
        </div>
        <div className="mt-2 font-mono text-[8px] tracking-widest text-foreground/20 uppercase">
          Human Operational Time
        </div>
      </div>
      <div className="rounded-xl border border-emerald-500/25 bg-card p-4">
        <div className="mb-2 flex items-center gap-2">
          <Moon className="h-3.5 w-3.5 text-success/60" />
          <span className="font-mono text-[9px] tracking-widest text-success/60 uppercase">
            L2 · HIJRI
          </span>
        </div>
        <div className="font-mono text-lg font-black text-foreground">
          {hijri.day} {hijri.monthName}
        </div>
        <div className="mt-1 font-mono text-[10px] text-foreground/40">
          {hijri.year}H · {getLunarIcon(lunar.phase)} {lunar.phaseName}
        </div>
        <div className="mt-2 font-mono text-[8px] tracking-widest text-foreground/20 uppercase">
          Religious Lunar Calendar
        </div>
      </div>
      <div
        className={`rounded-xl p-4 ${isPreEra ? "border border-yellow-400/30 bg-card shadow-sm" : "border border-border bg-card shadow-sm"}`}
      >
        <div className="mb-2 flex items-center gap-2">
            <InfinityIcon className="h-3.5 w-3.5 text-warning/60" />
          <span className="font-mono text-[9px] tracking-widest text-warning/60 uppercase">
            L3 · AEQ4
          </span>
        </div>
        <div className="font-mono text-sm font-black text-yellow-300">
          {isPreEra ? "∞·AEQ4" : aeq.formatted}
        </div>
        <div className="mt-1 font-mono text-[10px] text-foreground/40">
          {isPreEra ? "AWAITING EPOCH" : `ERA ${aeq.era} · CYCLE ${aeq.cycle}`}
        </div>
        <div className="mt-2 font-mono text-[8px] tracking-widest text-foreground/20 uppercase">
          Boundary of Human Comprehension
        </div>
      </div>
    </div>
  )
}
