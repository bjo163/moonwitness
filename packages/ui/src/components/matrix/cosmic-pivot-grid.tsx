"use client"

import React, { useState, useMemo } from "react"
import { Grid3X3, ArrowRight, Eye, X } from "lucide-react"
import type { ModelSchema } from "@workspace/types"

export interface CosmicPivotGridProps {
  schema: ModelSchema
  records: any[]
  onRecordClick?: (record: any) => void
}

export function CosmicPivotGrid({ schema, records, onRecordClick }: CosmicPivotGridProps) {
  // Find suitable grouping dimensions (Selection, Many2one, Boolean, Short Char)
  const candidateFields = useMemo(() => {
    return Object.entries(schema.fields)
      .filter(([_, def]) => !def.invisible && ["selection", "many2one", "boolean", "char"].includes(def.type))
      .map(([key, def]) => ({ key, label: def.label }))
  }, [schema.fields])

  const [rowField, setRowField] = useState<string>(
    candidateFields.find((f) => f.key === "priority" || f.key === "status")?.key || candidateFields[0]?.key || "id"
  )
  const [colField, setColField] = useState<string>(
    candidateFields.find((f) => f.key === "stageId" || f.key === "status" || f.key !== rowField)?.key ||
      candidateFields[1]?.key ||
      candidateFields[0]?.key ||
      "id"
  )

  const [selectedCell, setSelectedCell] = useState<{
    rowVal: string
    colVal: string
    records: any[]
  } | null>(null)

  const normalizeVal = (rec: any, fieldKey: string): string => {
    const v = rec[fieldKey]
    if (v === undefined || v === null || v === "") return "(Empty)"
    if (typeof v === "object") return v.name || v.title || `#${v.id}`
    if (typeof v === "boolean") return v ? "YES" : "NO"
    return String(v)
  }

  // Compute unique Row and Col Header Values
  const rowValues = useMemo(() => {
    const set = new Set<string>()
    records.forEach((r) => set.add(normalizeVal(r, rowField)))
    return Array.from(set).sort()
  }, [records, rowField])

  const colValues = useMemo(() => {
    const set = new Set<string>()
    records.forEach((r) => set.add(normalizeVal(r, colField)))
    return Array.from(set).sort()
  }, [records, colField])

  // Compute 2D Matrix Cell Buckets
  const matrix = useMemo(() => {
    const map = new Map<string, any[]>()
    rowValues.forEach((rVal) => {
      colValues.forEach((cVal) => {
        map.set(`${rVal}:::${cVal}`, [])
      })
    })

    records.forEach((r) => {
      const rVal = normalizeVal(r, rowField)
      const cVal = normalizeVal(r, colField)
      const key = `${rVal}:::${cVal}`
      if (map.has(key)) {
        map.get(key)!.push(r)
      }
    })
    return map
  }, [records, rowField, colField, rowValues, colValues])

  // Compute Column Totals
  const colTotals = useMemo(() => {
    const totals: Record<string, number> = {}
    colValues.forEach((cVal) => {
      let count = 0
      rowValues.forEach((rVal) => {
        count += matrix.get(`${rVal}:::${cVal}`)?.length || 0
      })
      totals[cVal] = count
    })
    return totals
  }, [matrix, rowValues, colValues])

  return (
    <div className="space-y-6">
      {/* Pivot Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-cyber-dark/80 border border-cyber-cyan/20 rounded-lg corner-box">
        <div className="flex items-center gap-3">
          <Grid3X3 className="w-5 h-5 text-cyber-cyan" />
          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            ANALYTICAL PIVOT DIMENSIONS
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="text-steel-gray uppercase">ROW AXIS (Y):</span>
            <select
              value={rowField}
              onChange={(e) => setRowField(e.target.value)}
              className="bg-black/60 border border-cyber-cyan/30 rounded px-3 py-1.5 text-white text-xs focus:border-cyber-cyan focus:outline-none"
            >
              {candidateFields.map((f) => (
                <option key={f.key} value={f.key} className="bg-cyber-panel">
                  {f.label} ({f.key})
                </option>
              ))}
            </select>
          </div>

          <ArrowRight className="w-4 h-4 text-cyber-cyan hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-steel-gray uppercase">COLUMN AXIS (X):</span>
            <select
              value={colField}
              onChange={(e) => setColField(e.target.value)}
              className="bg-black/60 border border-cyber-cyan/30 rounded px-3 py-1.5 text-white text-xs focus:border-cyber-cyan focus:outline-none"
            >
              {candidateFields.map((f) => (
                <option key={f.key} value={f.key} className="bg-cyber-panel">
                  {f.label} ({f.key})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Pivot Matrix Table */}
      <div className="overflow-x-auto border border-cyber-cyan/20 rounded-lg bg-cyber-dark/90 corner-box">
        <table className="w-full text-left border-collapse font-mono text-xs">
          <thead>
            <tr className="border-b border-cyber-cyan/20 bg-cyber-panel/80 text-[10px] text-steel-gray uppercase tracking-widest">
              <th className="py-3 px-4 bg-black/40 border-r border-cyber-cyan/20 sticky left-0 z-10">
                {schema.fields[rowField]?.label || rowField} ↓ \ {schema.fields[colField]?.label || colField} →
              </th>
              {colValues.map((cVal) => (
                <th key={cVal} className="py-3 px-4 text-center">
                  {cVal}
                </th>
              ))}
              <th className="py-3 px-4 text-center bg-cyber-cyan/10 text-cyber-cyan font-bold border-l border-cyber-cyan/20">
                TOTAL
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyber-cyan/10">
            {rowValues.map((rVal) => {
              let rowSum = 0
              return (
                <tr key={rVal} className="hover:bg-cyber-cyan/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-white bg-black/40 border-r border-cyber-cyan/20 sticky left-0 z-10">
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
                            ? "cursor-pointer hover:bg-cyber-cyan/20 text-cyber-cyan font-bold"
                            : "text-steel-gray/30 font-normal"
                        }`}
                      >
                        {hasItems ? (
                          <span className="inline-block px-2.5 py-1 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded shadow-[0_0_8px_rgba(0,240,255,0.1)]">
                            {items.length}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                    )
                  })}
                  <td className="py-3 px-4 text-center font-bold text-cyber-cyan bg-cyber-cyan/5 border-l border-cyber-cyan/20">
                    {rowSum}
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-cyber-cyan/30 bg-cyber-panel/90 font-bold text-white">
              <td className="py-3 px-4 sticky left-0 z-10 bg-cyber-panel">TOTAL SUMMARY</td>
              {colValues.map((cVal) => (
                <td key={cVal} className="py-3 px-4 text-center text-cyber-cyan">
                  {colTotals[cVal] || 0}
                </td>
              ))}
              <td className="py-3 px-4 text-center text-cyber-cyan bg-cyber-cyan/20 border-l border-cyber-cyan/30">
                {records.length}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Selected Cell Records Inspection Modal */}
      {selectedCell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-cyber-dark/95 border border-cyber-cyan/40 rounded-lg shadow-2xl overflow-hidden corner-box font-mono">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-cyber-cyan/20 bg-cyber-panel/80">
              <div>
                <span className="text-[10px] text-cyber-cyan uppercase tracking-wider">
                  PIVOT CELL DRILLDOWN ({selectedCell.records.length} UNITS)
                </span>
                <h3 className="text-sm font-bold text-white uppercase">
                  {schema.fields[rowField]?.label}: {selectedCell.rowVal} ⨉ {schema.fields[colField]?.label}:{" "}
                  {selectedCell.colVal}
                </h3>
              </div>
              <button onClick={() => setSelectedCell(null)} className="p-1 text-steel-gray hover:text-white">
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
                  className="flex items-center justify-between p-2.5 bg-black/40 border border-cyber-cyan/10 hover:border-cyber-cyan/40 rounded cursor-pointer transition-all group"
                >
                  <span className="text-xs text-white group-hover:text-cyber-cyan">
                    #{rec.id} — {rec[schema.recName || "name"] || `#${rec.id}`}
                  </span>
                  <Eye className="w-3.5 h-3.5 text-steel-gray group-hover:text-cyber-cyan" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
