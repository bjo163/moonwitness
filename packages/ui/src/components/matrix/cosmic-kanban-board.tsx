"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Plus, User, Clock } from "lucide-react"
import type { ModelSchema } from "@workspace/types"
import { apiGet } from "@moon/client"
import { APP_PORTS } from "@workspace/types"
import { cosmicAudio } from "../cosmic-sound-synthesizer"

const getApiBase = () => {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL
  }
  return `http://127.0.0.1:${APP_PORTS.API_BACKEND}`
}

export interface CosmicKanbanBoardProps {
  schema: ModelSchema
  records: any[]
  loading?: boolean
  onCardClick?: (record: any) => void
  onCreateInColumn?: (columnKey: string | number) => void
  onCardStageChange?: (record: any, newStageKey: string | number) => Promise<void>
}

export function CosmicKanbanBoard({
  schema,
  records,
  loading = false,
  onCardClick,
  onCreateInColumn,
  onCardStageChange,
}: CosmicKanbanBoardProps) {
  const kanbanConfig = schema.views?.kanban
  const groupField = kanbanConfig?.groupBy || "stageId"
  const groupFieldDef = schema.fields[groupField]

  const [comodelStages, setComodelStages] = useState<{ id: number; name: string }[]>([])
  const [draggedRecord, setDraggedRecord] = useState<any | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | number | null>(null)

  // Fetch Comodel stages if Many2one
  useEffect(() => {
    if (groupFieldDef?.type === "many2one" && groupFieldDef.comodel) {
      apiGet<{ data: any[] }>(`${getApiBase()}/api/${groupFieldDef.comodel}?limit=20&order=sequence%20asc`)
        .then((res) => {
          const items = Array.isArray(res?.data) ? res.data : []
          setComodelStages(
            items.map((s: any) => ({
              id: s.id,
              name: s.name || s.title || `#${s.id}`,
            }))
          )
        })
        .catch(() => {})
    }
  }, [groupFieldDef?.type, groupFieldDef?.comodel])

  // Compute Columns
  const columns = useMemo(() => {
    if (groupFieldDef?.type === "selection" && groupFieldDef.selection) {
      return groupFieldDef.selection.map(([key, label]) => ({ key, label }))
    }
    if (comodelStages.length > 0) {
      return comodelStages.map((s) => ({ key: s.id, label: s.name }))
    }
    const uniqueKeys = Array.from(new Set(records.map((r) => r[groupField]).filter(Boolean)))
    return uniqueKeys.map((k) => ({ key: k, label: String(k).toUpperCase() }))
  }, [groupFieldDef, comodelStages, records, groupField])

  // Group Records
  const groupedData = useMemo(() => {
    const map = new Map<string | number, any[]>()
    columns.forEach((c) => map.set(c.key, []))

    records.forEach((r) => {
      let rawVal = r[groupField]
      if (typeof rawVal === "object" && rawVal !== null) rawVal = rawVal.id
      if (map.has(rawVal)) {
        map.get(rawVal)!.push(r)
      } else if (columns.length > 0) {
        map.get(columns[0]!.key)?.push(r)
      }
    })
    return map
  }, [columns, records, groupField])

  const handleDragStart = (e: React.DragEvent, record: any) => {
    setDraggedRecord(record)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", String(record.id))
  }

  const handleDragOver = (e: React.DragEvent, columnKey: string | number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    if (dragOverColumn !== columnKey) {
      setDragOverColumn(columnKey)
    }
  }

  const handleDragLeave = (e: React.DragEvent, columnKey: string | number) => {
    if (dragOverColumn === columnKey) {
      setDragOverColumn(null)
    }
  }

  const handleDrop = async (e: React.DragEvent, targetColumnKey: string | number) => {
    e.preventDefault()
    setDragOverColumn(null)
    if (!draggedRecord) return

    let currentVal = draggedRecord[groupField]
    if (typeof currentVal === "object" && currentVal !== null) currentVal = currentVal.id

    if (String(currentVal) !== String(targetColumnKey)) {
      cosmicAudio.playDropPing()
      if (onCardStageChange) {
        await onCardStageChange(draggedRecord, targetColumnKey)
      }
    }
    setDraggedRecord(null)
  }

  const renderPriorityBadge = (priorityVal: string) => {
    if (!priorityVal) return null
    const isCritical = priorityVal === "critical" || priorityVal === "urgent" || priorityVal === "high"
    return (
      <span
        className={`px-1.5 py-0.5 text-[9px] font-medium uppercase rounded border ${
          isCritical
            ? "bg-destructive/10 text-destructive border-destructive/30"
            : "bg-primary/10 text-primary border-primary/30"
        }`}
      >
        {priorityVal}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="py-16 text-center text-muted-foreground font-sans text-xs">
        Loading pipeline stages...
      </div>
    )
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 pt-1 items-start min-h-[60vh]">
      {columns.map((col) => {
        const items = groupedData.get(col.key) || []
        const isTarget = dragOverColumn === col.key

        return (
          <div
            key={col.key}
            onDragOver={(e) => handleDragOver(e, col.key)}
            onDragLeave={(e) => handleDragLeave(e, col.key)}
            onDrop={(e) => handleDrop(e, col.key)}
            className={`w-80 flex-shrink-0 bg-card/90 border rounded-xl flex flex-col max-h-[75vh] shadow-sm transition-all ${
              isTarget
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border/50"
            }`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-3.5 py-3 border-b border-border/40 bg-muted/30">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground tracking-wide uppercase">
                  {col.label}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold text-primary bg-primary/10 border border-primary/20 rounded-full">
                  {items.length}
                </span>
              </div>
              {onCreateInColumn && (
                <button
                  onClick={() => onCreateInColumn(col.key)}
                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                  title="Add Card"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Column Cards List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-[120px]">
              {items.length === 0 ? (
                <div className="py-6 text-center text-[11px] text-muted-foreground/60 font-sans">
                  {isTarget ? "Drop record here" : "No records in stage"}
                </div>
              ) : (
                items.map((card) => {
                  const title = card[kanbanConfig?.titleField || schema.recName || "name"] || `#${card.id}`
                  const subtitle = kanbanConfig?.subtitleField ? card[kanbanConfig.subtitleField] : null
                  const priority = kanbanConfig?.priorityField ? card[kanbanConfig.priorityField] : null
                  const date = kanbanConfig?.dateField ? card[kanbanConfig.dateField] : null
                  const isDragging = draggedRecord?.id === card.id

                  return (
                    <div
                      key={card.id}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, card)}
                      onClick={() => onCardClick?.(card)}
                      className={`p-3 bg-background/90 border rounded-lg cursor-grab active:cursor-grabbing transition-all group relative select-none shadow-sm ${
                        isDragging
                          ? "opacity-40 border-dashed border-primary"
                          : "border-border/50 hover:border-primary/60 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] mb-1.5">
                        {priority && renderPriorityBadge(String(priority))}
                        {date && (
                          <span className="flex items-center gap-1 text-muted-foreground font-mono">
                            <Clock className="w-3 h-3 text-primary/70" />
                            {String(date).slice(0, 10)}
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {String(title)}
                      </h4>

                      {subtitle && (
                        <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                          {typeof subtitle === "object" ? subtitle.name || subtitle.title : String(subtitle)}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/30 text-[10px] text-muted-foreground font-mono">
                        <span className="text-primary/70">#{card.id}</span>
                        {card.assigneeId && (
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3 text-primary" />
                            {typeof card.assigneeId === "object" ? card.assigneeId.name : card.assigneeId}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
