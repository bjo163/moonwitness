export function TaskbarClock({ time }: { time: string }) {
  return <div className="flex shrink-0 items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-sm font-semibold text-primary"><span>{time || "00:00:00"}</span><span className="hidden text-xs text-muted-foreground sm:inline">WIB</span></div>
}
