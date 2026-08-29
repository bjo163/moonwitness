"use client"

import React, { useState, useMemo } from "react"
import { Calendar, ChevronLeft, ChevronRight, Clock, Eye, Layers } from "lucide-react"

interface CosmicTimelineViewProps {
  schema: any
  records: any[]
  onRecordClick?: (record: any) => void
}

export function CosmicTimelineView({ schema, records, onRecordClick }: CosmicTimelineViewProps) {
  const [zoomMode, setZoomMode] = useState<"days" | "weeks" | "months">("weeks")
  const [currentDateOffset, setCurrentDateOffset] = useState(0)

  // Identify date fields in schema
  const dateFields = useMemo(() => {
    const fields = schema?.fields || {}
    return Object.keys(fields).filter((key) => {
      const type = fields[key]?.type
      return type === "datetime" || type === "date" || key.toLowerCase().includes("date") || key.includes("At")
    })
  }, [schema])

  const nameField = schema?.viewManifest?.kanban?.titleField || "name"
  const stageField = schema?.viewManifest?.kanban?.groupBy || "stageId"

  // Calculate global date bounds
  const { minTime, maxTime, totalDuration } = useMemo(() => {
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
    <div className="flex flex-col gap-4 font-mono text-xs">
      {/* Controls Bar */}
      <div className="flex items-center justify-between border border-cyan-500/20 bg-black/60 p-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Calendar className="h-4 w-4 text-cyan-400" />
          <span className="font-bold tracking-wider text-cyan-300 uppercase">
            GANTT TIMELINE MATRIX: {schema?.name || "RECORDS"}
          </span>
          <span className="rounded bg-cyan-950/60 px-2 py-0.5 text-[10px] text-cyan-400 border border-cyan-500/30">
            {records.length} NODES
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoomMode("days")}
            className={`px-2.5 py-1 text-[10px] uppercase transition-all ${
              zoomMode === "days"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
                : "bg-black/40 text-slate-400 hover:text-white border border-white/10"
            }`}
          >
            Days
          </button>
          <button
            onClick={() => setZoomMode("weeks")}
            className={`px-2.5 py-1 text-[10px] uppercase transition-all ${
              zoomMode === "weeks"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
                : "bg-black/40 text-slate-400 hover:text-white border border-white/10"
            }`}
          >
            Weeks
          </button>
          <button
            onClick={() => setZoomMode("months")}
            className={`px-2.5 py-1 text-[10px] uppercase transition-all ${
              zoomMode === "months"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
                : "bg-black/40 text-slate-400 hover:text-white border border-white/10"
            }`}
          >
            Months
          </button>
        </div>
      </div>

      {/* Timeline Grid Canvas */}
      <div className="overflow-x-auto border border-cyan-500/20 bg-black/80 backdrop-blur-md">
        {/* Time Header Scale */}
        <div className="relative h-10 border-b border-cyan-500/20 bg-cyan-950/30">
          {timelineMarkers.map((marker, idx) => (
            <div
              key={idx}
              className="absolute top-2 flex -translate-x-1/2 flex-col items-center"
              style={{ left: `${marker.percent}%` }}
            >
              <span className="text-[10px] text-slate-400">{marker.label}</span>
              <div className="h-2 w-px bg-cyan-500/30" />
            </div>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-white/5 py-2">
          {records.length === 0 ? (
            <div className="py-12 text-center text-slate-500">NO ACTIVE RECORDS DETECTED IN TIMELINE SPAN</div>
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
                  className="group relative flex h-12 items-center px-4 hover:bg-cyan-500/5 transition-colors"
                >
                  {/* Left Label */}
                  <div className="w-48 shrink-0 truncate pr-4 text-xs font-semibold text-slate-200">
                    <span className="text-cyan-400 mr-1.5">#{r.id}</span>
                    {r[nameField] || "Unnamed Record"}
                  </div>

                  {/* Horizontal Bar Area */}
                  <div className="relative h-full flex-1">
                    <div
                      onClick={() => onRecordClick?.(r)}
                      className="absolute top-2 h-8 cursor-pointer rounded border border-cyan-500/40 bg-cyan-950/60 transition-all hover:scale-[1.01] hover:border-cyan-400 hover:shadow-sm"
                      style={{
                        left: `${leftPct}%`,
                        width: `${widthPct}%`,
                      }}
                    >
                      {/* Progress Bar Fill */}
                      <div
                        className="h-full bg-cyan-500/20"
                        style={{ width: `${progress}%` }}
                      />

                      {/* Bar Content */}
                      <div className="absolute inset-0 flex items-center justify-between px-2 text-[10px]">
                        <span className="truncate font-bold text-cyan-200">
                          {r[nameField]}
                        </span>
                        {r[stageField] && (
                          <span className="rounded bg-black/60 px-1.5 py-0.5 text-[9px] text-cyan-300">
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
