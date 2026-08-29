"use client"

import React, { useState, useMemo } from "react"
import { Search, ChevronLeft, ChevronRight, Edit2, Trash2, Plus, Download, Printer, Upload } from "lucide-react"
import type { ModelSchema } from "@workspace/types"
import { CosmicImportModal } from "./cosmic-import-modal"

export interface CosmicDataTableProps {
  schema: ModelSchema
  records: any[]
  loading?: boolean
  onRowClick?: (record: any) => void
  onEdit?: (record: any) => void
  onDelete?: (record: any) => void
  onCreateClick?: () => void
}

export function CosmicDataTable({
  schema,
  records,
  loading = false,
  onRowClick,
  onEdit,
  onDelete,
  onCreateClick,
}: CosmicDataTableProps) {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const pageSize = 15

  const tableConfig = schema.views?.table
  const columnKeys = useMemo(() => {
    if (tableConfig?.columns && tableConfig.columns.length > 0) {
      return tableConfig.columns
    }
    return Object.keys(schema.fields)
      .filter((f) => !schema.fields[f]?.invisible && schema.fields[f]?.type !== "text")
      .slice(0, 7)
  }, [tableConfig, schema.fields])

  // Filter records by search query
  const filteredRecords = useMemo(() => {
    if (!search.trim()) return records
    const q = search.toLowerCase().trim()
    const searchKeys = tableConfig?.searchKeys || [schema.recName || "name"]
    return records.filter((r) =>
      searchKeys.some((k) => {
        const val = r[k]
        return val !== undefined && val !== null && String(val).toLowerCase().includes(q)
      })
    )
  }, [records, search, tableConfig, schema.recName])

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize))
  const paginatedRecords = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredRecords.slice(start, start + pageSize)
  }, [filteredRecords, page])

  const handleExportCsv = () => {
    const headers = ["ID", ...columnKeys.map((k) => schema.fields[k]?.label || k)]
    const rows = filteredRecords.map((r) => {
      const rowVals = [
        r.id,
        ...columnKeys.map((k) => {
          const val = r[k]
          if (val === undefined || val === null) return ""
          if (typeof val === "object") return val.name || val.title || val.id || ""
          return String(val)
        }),
      ]
      return rowVals.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")
    })

    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${schema.name.replace(/\./g, "_")}_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    setShowExportMenu(false)
  }

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(filteredRecords, null, 2)
    const blob = new Blob([jsonStr], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${schema.name.replace(/\./g, "_")}_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setShowExportMenu(false)
  }

  const renderCellValue = (record: any, key: string) => {
    const val = record[key]
    const def = schema.fields[key]
    if (val === undefined || val === null) return <span className="text-muted-foreground/40 font-mono">-</span>

    if (def?.type === "selection") {
      const match = def.selection?.find(([k]) => k === val)
      const label = match ? match[1] : String(val)
      return (
        <span className="inline-block px-2 py-0.5 text-[10px] uppercase bg-primary/10 text-primary border border-primary/20 rounded-md font-semibold">
          {label}
        </span>
      )
    }

    if (def?.type === "many2one") {
      if (typeof val === "object" && val !== null) {
        return <span className="text-foreground">{val.name || val.title || `#${val.id}`}</span>
      }
      return <span className="text-muted-foreground font-mono">#{val}</span>
    }

    if (def?.type === "boolean") {
      return val ? (
        <span className="text-emerald-500 text-xs font-semibold">Yes</span>
      ) : (
        <span className="text-muted-foreground/60 text-xs">No</span>
      )
    }

    if (def?.type === "date" || def?.type === "datetime") {
      return <span className="text-muted-foreground text-[11px] font-mono">{String(val).slice(0, 10)}</span>
    }

    return <span className="text-foreground text-xs truncate max-w-xs">{String(val)}</span>
  }

  return (
    <div className="space-y-4">
      {/* Top Bar: Search, Export & Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={`Search ${schema.description || schema.name}...`}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>
        
        <div className="flex items-center gap-2">
          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-2 bg-secondary border border-border rounded-lg text-xs font-medium text-secondary-foreground hover:bg-accent transition-all"
            >
              <Download className="w-3.5 h-3.5" /> Export
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-1 w-36 bg-card border border-border rounded-lg shadow-xl z-20 overflow-hidden font-sans text-xs">
                <button
                  onClick={handleExportCsv}
                  className="w-full px-3 py-2 text-left text-foreground hover:bg-accent transition-colors"
                >
                  Export CSV
                </button>
                <button
                  onClick={handleExportJson}
                  className="w-full px-3 py-2 text-left text-foreground hover:bg-accent transition-colors"
                >
                  Export JSON
                </button>
                <button
                  onClick={() => {
                    setShowExportMenu(false)
                    window.print()
                  }}
                  className="w-full px-3 py-2 text-left text-foreground hover:bg-accent transition-colors border-t border-border"
                >
                  Print Report
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-secondary border border-border rounded-lg text-xs font-medium text-secondary-foreground hover:bg-accent transition-all"
          >
            <Upload className="w-3.5 h-3.5" /> Import CSV
          </button>

          {onCreateClick && (
            <button
              onClick={onCreateClick}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-xs hover:bg-primary/90 transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> New Record
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full overflow-x-auto border border-border/40 rounded-xl bg-card/90 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/40 bg-muted/40 text-[10px] font-sans font-semibold text-muted-foreground uppercase tracking-wider">
              <th className="py-3 px-4 w-12 text-center">ID</th>
              {columnKeys.map((k) => (
                <th key={k} className="py-3 px-4">
                  {schema.fields[k]?.label || k}
                </th>
              ))}
              <th className="py-3 px-4 text-right w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30 font-sans">
            {loading ? (
              <tr>
                <td colSpan={columnKeys.length + 2} className="py-8 text-center text-muted-foreground font-sans text-xs">
                  Loading records...
                </td>
              </tr>
            ) : paginatedRecords.length === 0 ? (
              <tr>
                <td colSpan={columnKeys.length + 2} className="py-8 text-center text-muted-foreground font-sans text-xs">
                  No records found
                </td>
              </tr>
            ) : (
              paginatedRecords.map((record) => (
                <tr
                  key={record.id}
                  onClick={() => onRowClick?.(record)}
                  className="hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <td className="py-2.5 px-4 text-center font-mono text-xs text-primary/80">
                    #{record.id}
                  </td>
                  {columnKeys.map((k) => (
                    <td key={k} className="py-2.5 px-4">
                      {renderCellValue(record, k)}
                    </td>
                  ))}
                  <td className="py-2.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(record)}
                          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(record)}
                          className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-2">
        <span>
          Showing {paginatedRecords.length} of {filteredRecords.length} records
        </span>
        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="p-1.5 border border-border rounded-lg disabled:opacity-30 hover:bg-accent text-foreground"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono">
            {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="p-1.5 border border-border rounded-lg disabled:opacity-30 hover:bg-accent text-foreground"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <CosmicImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        schema={schema}
        onImportSuccess={() => {
          setShowImportModal(false)
          window.location.reload()
        }}
      />
    </div>
  )
}
