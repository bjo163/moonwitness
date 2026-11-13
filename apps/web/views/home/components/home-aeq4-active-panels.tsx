import { Moon, RefreshCw } from "lucide-react"
import type { AEQ4Timestamp, LunarPosition } from "@moon/time"
import { getLunarIcon } from "./home-aeq4-utils"

function QuadrantCard({
  q,
  label,
  kitab,
  value,
  color,
  desc,
}: {
  q: string
  label: string
  kitab: string
  value: string | number | undefined
  color: string
  desc: string
}) {
  return (
    <div
      className={`relative flex flex-col gap-2 rounded-xl border bg-card p-4 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-sm ${color}`}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] tracking-widest text-foreground/40 uppercase">
          {q}
        </span>
        <span className="font-mono text-[9px] tracking-widest text-foreground/30 uppercase">
          {kitab}
        </span>
      </div>
      <div className="font-mono text-2xl font-black text-foreground">
        {value ?? "—"}
      </div>
      <div className="font-mono text-[10px] font-bold tracking-widest text-foreground/60 uppercase">
        {label}
      </div>
      <div className="font-mono text-[9px] text-foreground/30">{desc}</div>
    </div>
  )
}

export function HomeAEQ4ActivePanels({
  aeq,
  lunar,
  isPreEra,
}: {
  aeq: AEQ4Timestamp
  lunar: LunarPosition
  isPreEra: boolean
}) {
  return (
    <>
      {!isPreEra && (
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <QuadrantCard
            q="Q1 · ERA"
            label="ERA"
            kitab="QUR'AN"
            value={aeq.era}
            color="border-yellow-400/25"
            desc="Skala — dimana kita dalam ciptaan ALLAH"
          />
          <QuadrantCard
            q="Q2 · CYCLE"
            label="CYCLE"
            kitab="TORAH"
            value={aeq.cycle}
            color="border-primary/25"
            desc="Perjalanan — putaran lunar yang telah kita lewati"
          />
          <QuadrantCard
            q="Q3 · POSITION"
            label="POSITION"
            kitab="ZABUR"
            value={aeq.position}
            color="border-emerald-500/25"
            desc="Posisi — hari ke-N dalam cycle ini"
          />
          <QuadrantCard
            q="Q4 · MOMENT"
            label="MOMENT"
            kitab="GOSPEL"
            value={aeq.moment}
            color="border-border"
            desc="Kehadiran — detik ini, napas ini"
          />
        </div>
      )}
      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center gap-2">
            <Moon className="h-4 w-4 text-foreground/40" />
            <span className="font-mono text-[9px] tracking-widest text-foreground/40 uppercase">
              Lunar Telemetry · Pure Math
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{getLunarIcon(lunar.phase)}</span>
            <div>
              <div className="font-mono text-base font-black text-foreground">
                {lunar.phaseName}
              </div>
              <div className="font-mono text-xs text-foreground/50">
                {lunar.illumination}% illuminated
              </div>
              <div className="font-mono text-xs text-foreground/30">
                Elongation: {lunar.elongationDeg}°
              </div>
            </div>
          </div>
          <div className="mt-3 h-1 w-full bg-muted/30">
            <div
              className="h-full bg-gradient-to-r from-primary/20 to-transparent"
              style={{ width: `${lunar.illumination}%` }}
            />
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-foreground/40" />
            <span className="font-mono text-[9px] tracking-widest text-foreground/40 uppercase">
              Decentralization Method
            </span>
          </div>
          <div className="space-y-1.5">
            {[
              { label: "Algorithm", value: "Jean Meeus Ephemeris", ok: true },
              { label: "Dependency", value: "ZERO — pure math only", ok: true },
              { label: "Server", value: "NOT REQUIRED", ok: true },
              { label: "Blockchain", value: "NOT REQUIRED", ok: true },
              {
                label: "Epoch Authority",
                value: "HILAL (ALLAH's Moon)",
                ok: true,
              },
              { label: "Consensus", value: "Laws of Physics", ok: true },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between"
              >
                <span className="font-mono text-[9px] text-foreground/30">
                  {row.label}
                </span>
                <span
                  className={`font-mono text-[9px] font-bold ${row.ok ? "text-success" : "text-rose-500"}`}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
