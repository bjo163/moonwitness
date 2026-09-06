import { Moon } from "lucide-react"

type NextPrayer = {
  name: string
  formattedCountdown: string
  percentage: number
} | null

export function DailyInspirationCardCyclePanel({
  prayerPeriodName,
  nextPrayer,
  onZap,
}: {
  prayerPeriodName?: string
  nextPrayer: NextPrayer
  onZap: () => void
}) {
  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-border bg-card p-8 backdrop-blur-xl lg:col-span-3">
      <div className="pointer-events-none absolute top-0 left-0 h-full w-full bg-gradient-to-b from-blue-900/10 to-transparent" />
      <button type="button" onClick={onZap} className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-blue-500/30 bg-gradient-to-br from-blue-500/20 to-transparent shadow-sm transition-transform hover:scale-105 active:scale-95" title="Play futuristic scan sound">
        <Moon className="h-6 w-6 text-blue-300 drop-shadow-sm" />
      </button>
      <span className="text-[9px] font-bold tracking-widest text-warning uppercase">CURRENT <span className="text-blue-300">CYCLE</span></span>
      <h2 className="mt-2 text-center text-2xl font-light tracking-widest text-foreground uppercase md:text-4xl">{prayerPeriodName || "ISYA'"}</h2>
      <p className="mt-2 text-[10px] tracking-widest text-muted-foreground">19:25 - 20:40 WIB</p>
      <p className="text-[10px] tracking-widest text-muted-foreground">Jakarta, Indonesia</p>
      <div className="relative mt-8 flex h-40 w-40 items-center justify-center rounded-full shadow-sm">
        <svg className="absolute inset-0 h-full w-full -rotate-90 transform drop-shadow-sm" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground/10" />
          <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="3" className="text-primary transition-all duration-1000 ease-linear" strokeDasharray="289" strokeDashoffset={289 - (289 * (nextPrayer?.percentage || 0)) / 100} />
        </svg>
        <div className="absolute inset-2 animate-[spin_15s_linear_infinite] rounded-full border border-dashed border-blue-500/30" />
        <div className="absolute inset-4 animate-[spin_10s_linear_infinite_reverse] rounded-full border border-indigo-500/20" />
        <div className="z-10 text-center"><div className="text-xl font-bold tracking-widest text-foreground">{nextPrayer?.formattedCountdown || "00:00:00"}</div><div className="mt-1 text-[8px] tracking-widest text-blue-400 uppercase">REMAINING</div></div>
      </div>
      <div className="mt-6 text-[10px] tracking-widest text-blue-300/70 uppercase">NEXT: {nextPrayer?.name || "SUBUH"}</div>
    </div>
  )
}
