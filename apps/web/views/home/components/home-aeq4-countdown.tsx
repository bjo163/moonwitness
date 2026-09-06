import type { AEQ4Timestamp } from "@moon/time"
import { resolveSemanticColor } from "@workspace/ui"
import { pad } from "./home-aeq4-utils"

function CountdownBlock({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative flex h-16 w-16 items-center justify-center rounded-xl border border-yellow-400/30 bg-card shadow-sm sm:h-20 sm:w-20">
        <span className="font-mono text-2xl font-black text-yellow-300 sm:text-3xl">
          {pad(value)}
        </span>
        <div
          className="absolute inset-0 rounded-xl"
          style={{
            background: `linear-gradient(135deg, color-mix(in srgb, ${resolveSemanticColor("warning")} 4%, transparent) 0%, transparent 60%)`,
          }}
        />
      </div>
      <span className="font-mono text-[9px] tracking-widest text-warning/60 uppercase">
        {label}
      </span>
    </div>
  )
}

export function HomeAEQ4Countdown({
  aeq,
  progress,
  epochDate,
}: {
  aeq: AEQ4Timestamp
  progress: number
  epochDate: Date
}) {
  if (aeq.mode !== "PRE_ERA" || !aeq.countdown) return null
  return (
    <div className="mb-8">
      <div className="rounded-2xl border border-yellow-400/20 bg-card p-6">
        <div className="mb-6 text-center">
          <p className="font-mono text-[9px] tracking-widest text-warning/50 uppercase">
            ◈ COUNTDOWN TO EPOCH
          </p>
          <p className="mt-1 font-mono text-xs text-foreground/40">
            Menunggu hilal 1 Muharram 1449H ·{" "}
            {epochDate.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}{" "}
            (estimasi)
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 sm:gap-6">
          <CountdownBlock label="Hari" value={aeq.countdown.days} />
          <span className="font-mono text-2xl font-black text-warning/40">
            :
          </span>
          <CountdownBlock label="Jam" value={aeq.countdown.hours} />
          <span className="font-mono text-2xl font-black text-warning/40">
            :
          </span>
          <CountdownBlock label="Menit" value={aeq.countdown.minutes} />
          <span className="font-mono text-2xl font-black text-warning/40">
            :
          </span>
          <CountdownBlock label="Detik" value={aeq.countdown.seconds} />
        </div>
        <div className="mt-6">
          <div className="mb-1 flex justify-between font-mono text-[9px] text-foreground/30">
            <span>HIJRI 1448H START</span>
            <span>{progress}% ELAPSED</span>
            <span>1 MUHARRAM 1449H</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-none bg-muted/30">
            <div
              className="h-full bg-gradient-to-r from-yellow-500/70 to-yellow-300 transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="mt-4 border-t border-yellow-400/10 pt-4 text-center">
          <p className="font-mono text-[9px] text-foreground/25">
            ◈ Tanggal pasti ditentukan oleh hilal (rukyat) — ALLAH yang
            memutuskan melalui bulan. Countdown ini adalah perkiraan matematis,
            bukan otoritas.
          </p>
        </div>
      </div>
    </div>
  )
}
