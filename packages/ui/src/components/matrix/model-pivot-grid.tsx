"use client"

import React, { useState, useMemo } from "react"
import { Grid3X3, ArrowRight, X, Eye } from "lucide-react"
import type { ModelSchema, ModelRecord } from "@workspace/types"

export interface ModelPivotGridProps {
  schema: ModelSchema
  records: ModelRecord[]
  onRecordClick?: (rec: ModelRecord) => void
}

export function ModelPivotGrid({
  schema,
  records,
  onRecordClick,
}: ModelPivotGridProps) {
  // Extract categorizable fields (selection, many2one, string, status)
  const candidateFields = useMemo(() => {
    return Object.entries(schema.fields)
      .filter(([_, f]) => ["selection", "many2one", "char", "varchar"].includes(f.type))
      .map(([k, f]) => ({ key: k, label: f.label || k }))
  }, [schema])

  const [rowField, setRowField] = useState<string>(candidateFields[0]?.key || "stageId")
  const [colField, setColField] = useState<string>(candidateFields[1]?.key || "state")
  const [selectedCell, setSelectedCell] = useState<{
    rowVal: string
    colVal: string
    records: ModelRecord[]
  } | null>(null)

  // Extract unique row values
  const rowValues = useMemo(() => {
    const set = new Set<string>()
    records.forEach((r) => {
      const val = r[rowField]
      if (val === null || val === undefined) {
        set.add("N/A")
      } else if (typeof val === "object") {
        set.add(val.name || val.title || JSON.stringify(val))
      } else {
        set.add(String(val))
      }
    })
    return Array.from(set).sort()
  }, [records, rowField])

  // Extract unique col values
  const colValues = useMemo(() => {
    const set = new Set<string>()
    records.forEach((r) => {
      const val = r[colField]
      if (val === null || val === undefined) {
        set.add("N/A")
      } else if (typeof val === "object") {
        set.add(val.name || val.title || JSON.stringify(val))
      } else {
        set.add(String(val))
      }
    })
    return Array.from(set).sort()
  }, [records, colField])

  // Compute 2D Matrix of records
  const matrix = useMemo(() => {
    const map = new Map<string, ModelRecord[]>()
    records.forEach((r) => {
      let rVal = r[rowField]
      rVal = rVal === null || rVal === undefined ? "N/A" : typeof rVal === "object" ? rVal.name || rVal.title : String(rVal)

      let cVal = r[colField]
      cVal = cVal === null || cVal === undefined ? "N/A" : typeof cVal === "object" ? cVal.name || cVal.title : String(cVal)

      const key = `${rVal}:::${cVal}`
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(r)
    })
    return map
  }, [records, rowField, colField])

  // Column totals
  const colTotals = useMemo(() => {
    const totals: Record<string, number> = {}
    colValues.forEach((cVal) => {
      let count = 0
      rowValues.forEach((rVal) => {
        const items = matrix.get(`${rVal}:::${cVal}`) || []
        count += items.length
      })
      totals[cVal] = count
    })
    return totals
  }, [matrix, rowValues, colValues])

  return (
    <div className="space-y-6">
      {/* Pivot Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-card border border-border rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <Grid3X3 className="w-5 h-5 text-primary" />
          <span className="text-xs font-bold text-foreground uppercase tracking-wide">
            Analytical Pivot Dimensions
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 font-sans text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground uppercase text-[10px] font-semibold">Row Axis (Y):</span>
            <select
              value={rowField}
              onChange={(e) => setRowField(e.target.value)}
              className="bg-background border border-border rounded-lg px-3 py-1.5 text-foreground text-xs focus:border-primary focus:outline-none"
            >
              {candidateFields.map((f) => (
                <option key={f.key} value={f.key} className="bg-card">
                  {f.label} ({f.key})
                </option>
              ))}
            </select>
          </div>

          <ArrowRight className="w-4 h-4 text-muted-foreground hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground uppercase text-[10px] font-semibold">Column Axis (X):</span>
            <select
              value={colField}
              onChange={(e) => setColField(e.target.value)}
              className="bg-background border border-border rounded-lg px-3 py-1.5 text-foreground text-xs focus:border-primary focus:outline-none"
            >
              {candidateFields.map((f) => (
                <option key={f.key} value={f.key} className="bg-card">
                  {f.label} ({f.key})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Pivot Matrix Table */}
      <div className="overflow-x-auto border border-border rounded-xl bg-card shadow-sm">
        <table className="w-full text-left border-collapse font-sans text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
              <th className="py-3 px-4 bg-muted/50 border-r border-border sticky left-0 z-10">
                {schema.fields[rowField]?.label || rowField} ↓ \ {schema.fields[colField]?.label || colField} →
              </th>
              {colValues.map((cVal) => (
                <th key={cVal} className="py-3 px-4 text-center">
                  {cVal}
                </th>
              ))}
              <th className="py-3 px-4 text-center bg-primary/10 text-primary font-bold border-l border-border">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rowValues.map((rVal) => {
              let rowSum = 0
              return (
                <tr key={rVal} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 font-semibold text-foreground bg-muted/20 border-r border-border sticky left-0 z-10">
                    {rVal}
                  </td>
                  {colValues.map((cVal) => {
                    const items = matrix.get(`${rVal}:::${cVal}`) || []
                    rowSum += items.length
                    const hasItems = items.length > 0

                    return (
                      <td
                        key={cVal}
                        onClick={() => hasItems && setSelectedCell({ rowVal: rVal, colVal: cVal, records: items })}
                        className={`py-3 px-4 text-center transition-all ${
                          hasItems
                            ? "cursor-pointer hover:bg-primary/10 text-primary font-bold"
                            : "text-muted-foreground/40 font-normal"
                        }`}
                      >
                        {hasItems ? (
                          <span className="inline-block px-2.5 py-1 bg-primary/10 border border-primary/30 rounded-md font-semibold">
                            {items.length}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                    )
                  })}
                  <td className="py-3 px-4 text-center font-bold text-primary bg-primary/5 border-l border-border">
                    {rowSum}
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-border bg-muted/50 font-bold text-foreground">
              <td className="py-3 px-4 sticky left-0 z-10 bg-muted/50">Total Summary</td>
              {colValues.map((cVal) => (
                <td key={cVal} className="py-3 px-4 text-center text-primary">
                  {colTotals[cVal] || 0}
                </td>
              ))}
              <td className="py-3 px-4 text-center text-primary bg-primary/10 border-l border-border">
                {records.length}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Selected Cell Records Inspection Modal */}
      {selectedCell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden font-sans">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-muted/30">
              <div>
                <span className="text-[10px] text-primary uppercase tracking-wider font-semibold">
                  Drilldown ({selectedCell.records.length} records)
                </span>
                <h3 className="text-sm font-bold text-foreground">
                  {schema.fields[rowField]?.label}: {selectedCell.rowVal} × {schema.fields[colField]?.label}:{" "}
                  {selectedCell.colVal}
                </h3>
              </div>
              <button onClick={() => setSelectedCell(null)} className="p-1 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 max-h-80 overflow-y-auto space-y-2">
              {selectedCell.records.map((rec) => (
                <div
                  key={rec.id}
                  onClick={() => {
                    setSelectedCell(null)
                    onRecordClick?.(rec)
                  }}
                  className="flex items-center justify-between p-2.5 bg-background border border-border hover:border-primary/50 rounded-lg cursor-pointer transition-colors group"
                >
                  <span className="text-xs text-foreground group-hover:text-primary">
                    #{rec.id} — {rec[schema.recName || "name"] || `#${rec.id}`}
                  </span>
                  <Eye className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
