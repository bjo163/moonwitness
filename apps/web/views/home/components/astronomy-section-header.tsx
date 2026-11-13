import { Clock } from "lucide-react"

export function AstronomySectionHeader({ clock }: { clock: string }) {
  return (
    <header className="flex flex-col items-center justify-between gap-6 border-b border-border pb-6 xl:flex-row">
      <div className="flex w-full items-center gap-6 xl:w-auto">
        <div className="flex flex-col gap-2">
          <div className="bg-background inline-flex w-fit items-center gap-3 rounded-sm border-2 border-blue-500/60 px-3.5 py-1.5 text-xs font-black tracking-[0.25em] text-blue-300 uppercase shadow-sm">
            <span className="rounded-xs bg-blue-500 px-1.5 py-0.5 font-black text-foreground">07</span>
            <span>DIVINE ASTRONOMY</span>
          </div>
          <h2 className="pl-1 font-mono text-xl font-black tracking-widest text-foreground uppercase drop-shadow-sm sm:text-3xl">
            Signs in the Heavens
          </h2>
        </div>
      </div>
      <p className="bg-background max-w-xl flex-1 rounded-lg border border-blue-500/30 p-4 text-center font-sans text-xs leading-relaxed text-blue-100 shadow-inner xl:text-left">
        Observe the celestial order through the Moon, Sun, stars, eclipses, and planetary motion. Explore creation through scientific observation and historical records.
      </p>
      <div className="bg-background flex min-w-[280px] shrink-0 items-center justify-end gap-4 rounded-xl border-2 border-blue-500/50 p-4 shadow-sm">
        <div className="text-right">
          <div className="font-mono text-2xl font-black tracking-widest text-foreground drop-shadow-sm">{clock}</div>
          <div className="mt-1 text-[10px] font-bold text-blue-300 uppercase">25 MAY 2025 // 27 DHU AL-QIDAH 1446</div>
        </div>
        <Clock className="h-8 w-8 shrink-0 animate-pulse text-blue-400 drop-shadow-sm" />
      </div>
    </header>
  )
}
