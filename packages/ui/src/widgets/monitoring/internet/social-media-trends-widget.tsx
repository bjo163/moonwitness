import React from "react"
import { Share2, PlaySquare, Hash, Camera, ArrowUpRight } from "lucide-react"
import type { SourceStatus } from "@moon/client"

export type SocialMetric = {
  id: string
  platform: "X" | "YouTube" | "Instagram" | string
  topic: string
  volume?: number
  sentiment?: "Positive" | "Neutral" | "Negative" | string
}

export type SocialMediaTrendsWidgetProps = {
  metrics?: SocialMetric[]
  status?: SourceStatus
}

function statusLabel(status: SourceStatus): string {
  if (status === "LIVE") return "LIVE"
  if (status === "CACHED") return "CACHED"
  if (status === "STALE") return "STALE"
  if (status === "SIMULATED") return "SIMULATED"
  return "UNAVAILABLE"
}

function statusClasses(status: SourceStatus): string {
  if (status === "LIVE") {
    return "animate-pulse border-success/50 bg-success/20 text-success"
  }
  if (status === "STALE") {
    return "border-warning/50 bg-warning/20 text-warning"
  }
  if (status === "CACHED") {
    return "border-info/50 bg-info/20 text-info"
  }
  if (status === "SIMULATED") {
    return "border-secondary/50 bg-secondary/20 text-secondary"
  }
  return "border-border bg-muted/30 text-muted-foreground"
}

export function SocialMediaTrendsWidget({
  metrics = [],
  status = "UNAVAILABLE",
}: SocialMediaTrendsWidgetProps) {
  const resolvedStatus = metrics.length === 0 && status === "LIVE" ? "UNAVAILABLE" : status
  const hasMetrics = metrics.length > 0

  return (
    <div className="bg-background flex flex-col rounded-xl border border-border p-4 lg:col-span-12 xl:col-span-8">
      <div className="mb-4 flex items-center justify-between border-b border-border pb-2">
        <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-secondary uppercase">
          <Share2 className="h-4 w-4" />
          SOCIAL MEDIA PULSE
          <span
            className={`rounded-[2px] border px-1.5 py-0.5 text-[8px] ${statusClasses(resolvedStatus)}`}
          >
            {statusLabel(resolvedStatus)}
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] text-foreground/50">
          <div className="flex items-center gap-1">
            <Hash className="h-3 w-3 text-foreground" /> X
          </div>
          <div className="flex items-center gap-1">
            <PlaySquare className="h-3 w-3 text-foreground" /> YT
          </div>
          <div className="flex items-center gap-1">
            <Camera className="h-3 w-3 text-foreground" /> IG
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="mb-2 grid grid-cols-12 gap-4 border-b border-border pb-2 text-[8px] font-bold tracking-widest text-muted-foreground">
          <div className="col-span-2">PLATFORM</div>
          <div className="col-span-5">TOPIC / HASHTAG</div>
          <div className="col-span-3">ENGAGEMENT VOL.</div>
          <div className="col-span-2 text-right">SENTIMENT</div>
        </div>

        <div className="hide-scrollbar flex h-[250px] flex-col space-y-1 overflow-y-auto">
          {!hasMetrics ? (
            <div className="flex h-full items-center justify-center px-4 text-center text-[10px] text-muted-foreground">
              <span>
                Social media trends {statusLabel(resolvedStatus).toLowerCase()}.
                No verified trend data available.
              </span>
            </div>
          ) : (
            metrics.map((metric) => (
              <div
                key={metric.id}
                className="group grid grid-cols-12 items-center gap-4 rounded border border-transparent bg-muted/30 px-2 py-2 text-[9px] transition-colors hover:border-secondary/30"
              >
                <div className="col-span-2 flex items-center gap-2 font-bold">
                  {metric.platform === "X" && <Hash className="h-3.5 w-3.5 text-foreground" />}
                  {metric.platform === "YouTube" && (
                    <PlaySquare className="h-3.5 w-3.5 text-foreground" />
                  )}
                  {metric.platform === "Instagram" && (
                    <Camera className="h-3.5 w-3.5 text-foreground" />
                  )}
                  {!["X", "YouTube", "Instagram"].includes(metric.platform) && (
                    <Share2 className="h-3.5 w-3.5 text-foreground" />
                  )}
                  <span className="opacity-70 group-hover:opacity-100">{metric.platform}</span>
                </div>

                <div className="col-span-5 flex items-center gap-2">
                  <span className="truncate font-bold text-foreground transition-colors group-hover:text-secondary">
                    {metric.topic}
                  </span>
                  {typeof metric.volume === "number" && metric.volume > 3000000 && (
                    <ArrowUpRight className="h-3 w-3 text-secondary" aria-hidden="true" />
                  )}
                </div>

                <div className="col-span-3 font-mono text-secondary">
                  {typeof metric.volume === "number" ? metric.volume.toLocaleString() : "—"}
                </div>

                <div className="col-span-2 text-right">
                  <span
                    className={`rounded-sm px-2 py-0.5 text-[7px] font-black tracking-wider uppercase ${
                      metric.sentiment === "Positive"
                        ? "border border-success/30 bg-success/20 text-success"
                        : metric.sentiment === "Negative"
                          ? "border border-destructive/30 bg-destructive/20 text-destructive"
                          : "border border-border bg-muted/30 text-foreground"
                    }`}
                  >
                    {metric.sentiment ?? "Unknown"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
