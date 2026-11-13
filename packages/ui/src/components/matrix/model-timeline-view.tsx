"use client"

import React, { useMemo, useState } from "react"
import { Calendar } from "lucide-react"

interface ModelTimelineViewProps {
  schema: any
  records: any[]
  onRecordClick?: (record: any) => void
}

type TimelineZoomMode = "days" | "weeks" | "months"

type TimelineMarker = {
  label: string
  percent: number
}

function useModelTimelineController(schema: any, records: any[]) {
  const [zoomMode, setZoomMode] = useState<TimelineZoomMode>("weeks")

  const nameField = schema?.views?.kanban?.titleField || "name"
  const stageField = schema?.views?.kanban?.groupBy || "stageId"

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

  return {
    nameField,
    stageField,
    minTime,
    totalDuration,
    timelineMarkers,
    zoomMode,
    setZoomMode,
  }
}

type TimelineControlsProps = {
  schema: any
  recordCount: number
  zoomMode: TimelineZoomMode
  onZoomChange: (mode: TimelineZoomMode) => void
}

function TimelineControls({ schema, recordCount, zoomMode, onZoomChange }: TimelineControlsProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card p-3 shadow-sm">
      <div className="flex items-center gap-3">
        <Calendar className="h-4 w-4 text-primary" />
        <span className="font-bold text-foreground">Timeline View: {schema?.name || "Records"}</span>
        <span className="rounded-md border border-border bg-muted px-2 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground">
          {recordCount} Records
        </span>
      </div>

      <div className="flex items-center gap-2">
        {(["days", "weeks", "months"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => onZoomChange(mode)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              zoomMode === mode
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>
    </div>
  )
}

type TimelineGridProps = {
  records: any[]
  timelineMarkers: TimelineMarker[]
  minTime: number
  totalDuration: number
  nameField: string
  stageField: string
  onRecordClick?: (record: any) => void
}

function TimelineGrid({
  records,
  timelineMarkers,
  minTime,
  totalDuration,
  nameField,
  stageField,
  onRecordClick,
}: TimelineGridProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
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

      <div className="divide-y divide-border/60 py-2">
        {records.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">No active records in this timeline range.</div>
        ) : (
          records.map((record, idx) => (
            <TimelineRow
              key={record.id || idx}
              record={record}
              minTime={minTime}
              totalDuration={totalDuration}
              nameField={nameField}
              stageField={stageField}
              onRecordClick={onRecordClick}
            />
          ))
        )}
      </div>
    </div>
  )
}

type TimelineRowProps = {
  record: any
  minTime: number
  totalDuration: number
  nameField: string
  stageField: string
  onRecordClick?: (record: any) => void
}

function TimelineRow({
  record,
  minTime,
  totalDuration,
  nameField,
  stageField,
  onRecordClick,
}: TimelineRowProps) {
  const startRaw = record.dateStart || record.createdAt || record.createDate || Date.now()
  const endRaw = record.dateEnd || record.dateDeadline || record.nextCall || startRaw

  const sTime = new Date(startRaw).getTime() || minTime
  const eTime = new Date(endRaw).getTime() || sTime + 86400000 * 3

  const leftPct = Math.max(0, Math.min(95, ((sTime - minTime) / totalDuration) * 100))
  const widthPct = Math.max(5, Math.min(100 - leftPct, ((eTime - sTime) / totalDuration) * 100))
  const progress = typeof record.progress === "number" ? record.progress : 100

  return (
    <div className="group relative flex h-12 items-center px-4 transition-colors hover:bg-muted/40">
      <div className="w-48 shrink-0 truncate pr-4 text-xs font-semibold text-foreground">
        <span className="mr-1.5 font-mono text-primary">#{record.id}</span>
        {record[nameField] || "Unnamed Record"}
      </div>

      <div className="relative h-full flex-1">
        <div
          onClick={() => onRecordClick?.(record)}
          className="absolute top-2 h-8 cursor-pointer rounded-md border border-primary/40 bg-primary/10 transition-all hover:border-primary hover:bg-primary/20"
          style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
        >
          <div className="h-full rounded-md bg-primary/20" style={{ width: `${progress}%` }} />
          <div className="absolute inset-0 flex items-center justify-between px-2 text-[10px]">
            <span className="truncate font-semibold text-primary">{record[nameField]}</span>
            {record[stageField] && (
              <span className="rounded bg-background/80 px-1.5 py-0.5 font-mono text-[9px] text-foreground">
                {record[stageField]}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ModelTimelineView({ schema, records, onRecordClick }: ModelTimelineViewProps) {
  const controller = useModelTimelineController(schema, records)

  return (
    <div className="flex flex-col gap-4 font-sans text-xs">
      <TimelineControls
        schema={schema}
        recordCount={records.length}
        zoomMode={controller.zoomMode}
        onZoomChange={controller.setZoomMode}
      />
      <TimelineGrid
        records={records}
        timelineMarkers={controller.timelineMarkers}
        minTime={controller.minTime}
        totalDuration={controller.totalDuration}
        nameField={controller.nameField}
        stageField={controller.stageField}
        onRecordClick={onRecordClick}
      />
    </div>
  )
}
