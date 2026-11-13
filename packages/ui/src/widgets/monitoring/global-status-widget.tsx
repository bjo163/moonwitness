import React from "react"
import {
  BookOpen,
  Heart,
  Moon,
  Activity,
  Globe2,
  Users,
  Zap,
  Crosshair,
  type LucideIcon,
} from "lucide-react"
import type { SourceStatus } from "@moon/client"

export type GlobalStatusCard = {
  label: string
  value?: string | number | null
  sublabel?: string
  status?: SourceStatus
  icon: LucideIcon
  colorClass?: string
}

export type GlobalStatusWidgetProps = {
  status?: SourceStatus
  cards?: GlobalStatusCard[]
}

function statusLabel(status: SourceStatus): string {
  if (status === "LIVE") return "LIVE"
  if (status === "CACHED") return "CACHED"
  if (status === "STALE") return "STALE"
  if (status === "SIMULATED") return "SIMULATED"
  return "UNAVAILABLE"
}

function statusClasses(status: SourceStatus): string {
  if (status === "LIVE") return "bg-success/20 text-success"
  if (status === "STALE") return "bg-warning/20 text-warning"
  if (status === "CACHED") return "bg-info/20 text-info"
  if (status === "SIMULATED") return "bg-secondary/20 text-secondary"
  return "bg-muted/30 text-muted-foreground"
}

const DEFAULT_CARDS: GlobalStatusCard[] = [
  { label: "KNOWLEDGE", icon: BookOpen, colorClass: "text-primary", status: "UNAVAILABLE" },
  { label: "PEACE INDEX", icon: Heart, colorClass: "text-success", status: "UNAVAILABLE" },
  { label: "MOON STATUS", icon: Moon, colorClass: "text-secondary", status: "UNAVAILABLE" },
  { label: "PRAYER SYNC", icon: Activity, colorClass: "text-success", status: "UNAVAILABLE" },
  { label: "ENVIRONMENT", icon: Globe2, colorClass: "text-success", status: "UNAVAILABLE" },
  { label: "HUMANITY", icon: Users, colorClass: "text-foreground", status: "UNAVAILABLE" },
  { label: "TECHNOLOGY", icon: Zap, colorClass: "text-foreground", status: "UNAVAILABLE" },
  { label: "RESEARCH", icon: Crosshair, colorClass: "text-primary", status: "UNAVAILABLE" },
]

export function GlobalStatusWidget({
  status = "UNAVAILABLE",
  cards = DEFAULT_CARDS,
}: GlobalStatusWidgetProps) {
  const resolvedStatus = status

  return (
    <div className="bg-background flex flex-1 flex-col justify-between rounded-xl border border-primary/30 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-[9px] font-black tracking-widest text-primary uppercase">
          GLOBAL STATUS
        </div>
        <div className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-[8px] font-bold ${statusClasses(resolvedStatus)}`}>
          <span className="h-1 w-1 rounded-full bg-current" /> {statusLabel(resolvedStatus)}
        </div>
      </div>

      <div className="grid h-full grid-cols-2 gap-2">
        {cards.map((card, i) => {
          const cardStatus = card.status ?? resolvedStatus
          const displayValue =
            card.value === null || card.value === undefined || cardStatus === "UNAVAILABLE"
              ? "—"
              : String(card.value)
          const Icon = card.icon
          return (
            <div
              key={`${card.label}-${i}`}
              className="flex flex-col justify-between rounded-md border border-border bg-background p-2"
            >
              <div className="flex items-center justify-between gap-1">
                <div className="text-[7px] font-bold text-muted-foreground uppercase">{card.label}</div>
                <div className="text-[6px] font-bold tracking-widest text-muted-foreground">
                  {statusLabel(cardStatus)}
                </div>
              </div>
              <div className="mt-1 flex items-end justify-between">
                <Icon className={`mb-0.5 h-3.5 w-3.5 ${card.colorClass ?? "text-primary"}`} />
                <div className="text-right">
                  <div className="text-xs font-black text-foreground">{displayValue}</div>
                  <div className="text-[7px] text-muted-foreground">
                    {card.sublabel ?? (cardStatus === "UNAVAILABLE" ? "No data" : "")}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
