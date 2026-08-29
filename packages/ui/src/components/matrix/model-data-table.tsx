"use client"

import React, { useState, useMemo } from "react"
import { Search, ChevronLeft, ChevronRight, Edit2, Trash2, Plus, Download, Upload } from "lucide-react"
import type { ModelSchema } from "@workspace/types"
import { ModelImportModal } from "./model-import-modal"

export interface ModelDataTableProps {
  schema: ModelSchema
  records: any[]
  loading?: boolean
  onRowClick?: (record: any) => void
  onEdit?: (record: any) => void
  onDelete?: (record: any) => void
  onCreateClick?: () => void
}

export function ModelDataTable({
  schema,
  records,
  loading = false,
  onRowClick,
  onEdit,
  onDelete,
  onCreateClick,
}: ModelDataTableProps) {
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
    if (records.length === 0) return
    const headers = columnKeys.join(",")
    const rows = records.map((r) =>
      columnKeys
        .map((k) => {
          let val = r[k]
          if (typeof val === "object" && val !== null) val = val.name || val.title || val.id
          if (val === undefined || val === null) val = ""
          return `"${String(val).replace(/"/g, '""')}"`
        })
        .join(",")
    )
    const csvContent = [headers, ...rows].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${schema.name}-export.csv`
    a.click()
    URL.revokeObjectURL(url)
    setShowExportMenu(false)
  }

  const handleExportJson = () => {
    if (records.length === 0) return
    const jsonContent = JSON.stringify(records, null, 2)
    const blob = new Blob([jsonContent], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${schema.name}-export.json`
    a.click()
    URL.revokeObjectURL(url)
    setShowExportMenu(false)
  }

  const renderCellValue = (record: any, key: string) => {
    const val = record[key]
    const def = schema.fields[key]

    if (val === null || val === undefined) return <span className="text-muted-foreground/50">—</span>

    if (def?.type === "boolean") {
      return (
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
            val ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"
          }`}
        >
          {val ? "YES" : "NO"}
        </span>
      )
    }

    if (def?.type === "many2one" && typeof val === "object") {
      return (
        <span className="font-medium text-foreground">
          {val.name || val.title || val.reference || `#${val.id}`}
        </span>
      )
    }

    if (def?.type === "selection") {
      const match = def.selection?.find(([k]) => k === val)
      return (
        <span className="inline-block px-2 py-0.5 bg-muted text-muted-foreground rounded text-[11px] font-medium">
          {match ? match[1] : String(val)}
        </span>
      )
    }

    if (def?.type === "float" || def?.type === "monetary") {
      return <span className="font-mono">{Number(val).toLocaleString()}</span>
    }

    if (def?.type === "datetime" || def?.type === "date") {
      return (
        <span className="text-muted-foreground text-[11px] font-mono">
          {new Date(val).toLocaleDateString()}
        </span>
      )
    }

    return <span className="truncate max-w-[200px] inline-block">{String(val)}</span>
  }

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border shadow-sm">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
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
              className="flex items-center gap-1.5 px-3 py-2 bg-secondary border border-border rounded-lg text-xs font-medium text-secondary-foreground hover:bg-accent transition-colors"
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
            className="flex items-center gap-1.5 px-3 py-2 bg-secondary border border-border rounded-lg text-xs font-medium text-secondary-foreground hover:bg-accent transition-colors"
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
      <div className="w-full overflow-x-auto border border-border rounded-xl bg-card shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-[10px] font-sans font-semibold text-muted-foreground uppercase tracking-wider">
              <th className="py-3 px-4 w-12 text-center">ID</th>
              {columnKeys.map((k) => (
                <th key={k} className="py-3 px-4">
                  {schema.fields[k]?.label || k}
                </th>
              ))}
              <th className="py-3 px-4 text-right w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border font-sans">
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

      <ModelImportModal
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
