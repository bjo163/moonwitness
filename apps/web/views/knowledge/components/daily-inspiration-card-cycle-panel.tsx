import { Moon } from "lucide-react"
import { Button } from "@workspace/ui"

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
    <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-md border border-border bg-card p-6 lg:col-span-3">
      <Button type="button" variant="ghost" size="icon" onClick={onZap} className="mb-4 flex h-10 w-10 items-center justify-center rounded-md border border-border bg-muted transition-colors hover:bg-accent active:scale-95" title="Play prayer time sound" aria-label="Play prayer time sound">
        <Moon className="h-6 w-6 text-primary" />
      </Button>
      <span className="text-xs font-medium text-muted-foreground">Current cycle</span>
      <h2 className="mt-2 text-center text-2xl font-semibold text-foreground md:text-3xl">{prayerPeriodName || "Isya'"}</h2>
      <p className="mt-2 text-xs text-muted-foreground">19:25 - 20:40 WIB</p>
      <p className="text-xs text-muted-foreground">Jakarta, Indonesia</p>
      <div className="relative mt-8 flex h-40 w-40 items-center justify-center rounded-full shadow-sm">
        <svg className="absolute inset-0 h-full w-full -rotate-90 transform drop-shadow-sm" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground/10" />
          <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="3" className="text-primary transition-all duration-1000 ease-linear" strokeDasharray="289" strokeDashoffset={289 - (289 * (nextPrayer?.percentage || 0)) / 100} />
        </svg>
        <div className="z-10 text-center"><div className="font-mono text-xl font-semibold text-foreground">{nextPrayer?.formattedCountdown || "00:00:00"}</div><div className="mt-1 text-xs text-muted-foreground">Remaining</div></div>
      </div>
      <div className="mt-6 text-xs text-muted-foreground">Next: {nextPrayer?.name || "Subuh"}</div>
    </div>
  )
}
