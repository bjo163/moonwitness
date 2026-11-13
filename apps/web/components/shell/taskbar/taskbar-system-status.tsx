import { Button } from "@workspace/ui"
import { Activity, Compass, Sun, Users } from "lucide-react"
import type { LunarPhaseInfo } from "@moon/client"
import type { SunInfo } from "@moon/client"

type TaskbarSystemStatusProps = {
  activeConnections: number
  lunarInfo: LunarPhaseInfo | null
  sunInfo: SunInfo | null
  onPlayDuhaChime: (isAfdhal: boolean) => void
}

export function TaskbarSystemStatus({
  activeConnections,
  lunarInfo,
  sunInfo,
  onPlayDuhaChime,
}: TaskbarSystemStatusProps) {
  return (
    <div className="flex shrink-0 items-center gap-4 text-primary sm:gap-6">
      <span className="text-success flex items-center gap-1.5 font-medium" title="System Online">
        <span className="bg-success h-1.5 w-1.5 rounded-full" />
        <span className="hidden sm:inline">System</span>
      </span>
      <span className="hidden h-3 w-px bg-border sm:block" />
      <span className="text-success/80 hidden items-center gap-1.5 font-mono sm:flex" title="Active Connections">
        <Users className="text-success h-3 w-3" />
        <strong className="text-success font-semibold">{activeConnections}</strong>
      </span>
      <span className="hidden h-3 w-px bg-border sm:block" />
      <span className="hidden items-center gap-1.5 font-mono sm:flex" title="Network Latency">
        <Activity className="h-3 w-3 text-primary" />
        <strong className="font-semibold text-primary">12 ms</strong>
      </span>
      <span className="hidden h-3 w-px bg-border md:block" />
      <span className="hidden items-center gap-1.5 font-mono md:flex" title="Qibla Direction">
        <Compass className="h-3 w-3 text-primary" />
        <strong className="font-semibold text-primary">295.14°</strong>
      </span>
      <span className="hidden h-3 w-px bg-border lg:block" />
      {lunarInfo && (
        <span className="hidden items-center gap-1.5 lg:flex" title={lunarInfo.phaseName}>
          <span className="text-warning">◐</span>
          <strong className="text-warning font-mono font-semibold">{lunarInfo.illuminationPercent}%</strong>
        </span>
      )}
      <span className="hidden h-3 w-px bg-border lg:block" />
      {sunInfo && (
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => onPlayDuhaChime(sunInfo.duhaStatus === "AFDHAL")}
          type="button"
          className="hidden items-center gap-1.5 rounded-sm transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none lg:flex"
          aria-label={`Sun position ${sunInfo.altitude} degrees, ${sunInfo.duhaLabel || sunInfo.label}`}
          title={`Solar Altitude: ${sunInfo.altitude}° — ${sunInfo.duhaLabel || sunInfo.label}`}
        >
          <Sun className={`h-3 w-3 ${sunInfo.duhaStatus === "AFDHAL" || sunInfo.duhaStatus === "ACTIVE" ? "text-warning" : sunInfo.altitude > 0 ? "text-warning/60" : "text-muted-foreground"}`} />
          <strong className={`font-mono font-semibold ${sunInfo.duhaStatus === "AFDHAL" || sunInfo.duhaStatus === "ACTIVE" ? "text-warning" : sunInfo.altitude > 0 ? "text-warning/70" : "text-muted-foreground"}`}>
            {sunInfo.altitude}°
          </strong>
          {sunInfo.duhaLabel && <span className={`text-xs font-medium ${sunInfo.duhaStatus === "AFDHAL" ? "text-warning" : "text-success/70"}`}>{sunInfo.duhaLabel}</span>}
        </Button>
      )}
    </div>
  )
}
