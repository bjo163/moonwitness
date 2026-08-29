"use client"

import React, { useState, useMemo } from "react"
import { Calendar } from "lucide-react"

interface ModelTimelineViewProps {
  schema: any
  records: any[]
  onRecordClick?: (record: any) => void
}

export function ModelTimelineView({ schema, records, onRecordClick }: ModelTimelineViewProps) {
  const [zoomMode, setZoomMode] = useState<"days" | "weeks" | "months">("weeks")

  const nameField = schema?.views?.kanban?.titleField || "name"
  const stageField = schema?.views?.kanban?.groupBy || "stageId"

  // Calculate global date bounds
  const { minTime, totalDuration } = useMemo(() => {
    const now = Date.now()
    let min = now - 14 * 86400000
    let max = now + 30 * 86400000

    records.forEach((r) => {
      const start = r.dateStart || r.createdAt || r.createDate
      const end = r.dateEnd || r.dateDeadline || r.nextCall || start
      if (start) {
        const sTime = new Date(start).getTime()
        if (!isNaN(sTime) && sTime < min) min = sTime
      }
      if (end) {
        const eTime = new Date(end).getTime()
        if (!isNaN(eTime) && eTime > max) max = eTime
      }
    })

    return { minTime: min, maxTime: max, totalDuration: Math.max(max - min, 86400000) }
  }, [records])

  // Generate timeline markers
  const timelineMarkers = useMemo(() => {
    const count = 8
    const step = totalDuration / count
    const markers = []
    for (let i = 0; i <= count; i++) {
      const d = new Date(minTime + i * step)
      markers.push({
        label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        percent: (i / count) * 100,
      })
    }
    return markers
  }, [minTime, totalDuration])

  return (
    <div className="flex flex-col gap-4 font-sans text-xs">
      {/* Controls Bar */}
      <div className="flex items-center justify-between border border-border bg-card p-3 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="font-bold text-foreground">
            Timeline View: {schema?.name || "Records"}
          </span>
          <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] text-muted-foreground border border-border font-mono font-semibold">
            {records.length} Records
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoomMode("days")}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
              zoomMode === "days"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
          >
            Days
          </button>
          <button
            onClick={() => setZoomMode("weeks")}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
              zoomMode === "weeks"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
          >
            Weeks
          </button>
          <button
            onClick={() => setZoomMode("months")}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
              zoomMode === "months"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
          >
            Months
          </button>
        </div>
      </div>

      {/* Timeline Grid Canvas */}
      <div className="overflow-x-auto border border-border bg-card rounded-xl shadow-sm">
        {/* Time Header Scale */}
        <div className="relative h-10 border-b border-border bg-muted/40">
          {timelineMarkers.map((marker, idx) => (
            <div
              key={idx}
              className="absolute top-2 flex -translate-x-1/2 flex-col items-center"
              style={{ left: `${marker.percent}%` }}
            >
              <span className="text-[10px] text-muted-foreground">{marker.label}</span>
              <div className="h-2 w-px bg-border" />
            </div>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-border/60 py-2">
          {records.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">No active records in this timeline range.</div>
          ) : (
            records.map((r, idx) => {
              const startRaw = r.dateStart || r.createdAt || r.createDate || Date.now()
              const endRaw = r.dateEnd || r.dateDeadline || r.nextCall || startRaw

              const sTime = new Date(startRaw).getTime() || minTime
              const eTime = new Date(endRaw).getTime() || sTime + 86400000 * 3

              const leftPct = Math.max(0, Math.min(95, ((sTime - minTime) / totalDuration) * 100))
              const widthPct = Math.max(5, Math.min(100 - leftPct, ((eTime - sTime) / totalDuration) * 100))
              const progress = typeof r.progress === "number" ? r.progress : 100

              return (
                <div
                  key={r.id || idx}
                  className="group relative flex h-12 items-center px-4 hover:bg-muted/40 transition-colors"
                >
                  {/* Left Label */}
                  <div className="w-48 shrink-0 truncate pr-4 text-xs font-semibold text-foreground">
                    <span className="text-primary mr-1.5 font-mono">#{r.id}</span>
                    {r[nameField] || "Unnamed Record"}
                  </div>

                  {/* Horizontal Bar Area */}
                  <div className="relative h-full flex-1">
                    <div
                      onClick={() => onRecordClick?.(r)}
                      className="absolute top-2 h-8 cursor-pointer rounded-md border border-primary/40 bg-primary/10 transition-all hover:bg-primary/20 hover:border-primary"
                      style={{
                        left: `${leftPct}%`,
                        width: `${widthPct}%`,
                      }}
                    >
                      {/* Progress Bar Fill */}
                      <div
                        className="h-full bg-primary/20 rounded-md"
                        style={{ width: `${progress}%` }}
                      />

                      {/* Bar Content */}
                      <div className="absolute inset-0 flex items-center justify-between px-2 text-[10px]">
                        <span className="truncate font-semibold text-primary">
                          {r[nameField]}
                        </span>
                        {r[stageField] && (
                          <span className="rounded bg-background/80 px-1.5 py-0.5 text-[9px] text-foreground font-mono">
                            {r[stageField]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
