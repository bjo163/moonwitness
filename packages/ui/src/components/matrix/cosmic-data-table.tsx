"use client"

import React, { useState, useMemo } from "react"
import { Search, ChevronLeft, ChevronRight, Edit2, Trash2, Plus, Download, Printer, Upload } from "lucide-react"
import type { ModelSchema } from "@workspace/types"
import { printRecordBriefing } from "../../lib/report-printer"
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
    a.download = `mw_${schema.name.replace(/\./g, "_")}_${new Date().toISOString().slice(0, 10)}.csv`
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
    a.download = `mw_${schema.name.replace(/\./g, "_")}_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setShowExportMenu(false)
  }

  const renderCellValue = (record: any, key: string) => {
    const val = record[key]
    const def = schema.fields[key]
    if (val === undefined || val === null) return <span className="text-steel-gray/40 font-mono">-</span>

    if (def?.type === "selection") {
      const match = def.selection?.find(([k]) => k === val)
      const label = match ? match[1] : String(val)
      return (
        <span className="inline-block px-2 py-0.5 text-[10px] font-mono uppercase bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 rounded">
          {label}
        </span>
      )
    }

    if (def?.type === "many2one") {
      if (typeof val === "object" && val !== null) {
        return <span className="text-white font-mono">{val.name || val.title || `#${val.id}`}</span>
      }
      return <span className="text-steel-gray font-mono">#{val}</span>
    }

    if (def?.type === "boolean") {
      return val ? (
        <span className="text-cyber-green text-xs font-mono">YES</span>
      ) : (
        <span className="text-steel-gray/60 text-xs font-mono">NO</span>
      )
    }

    if (def?.type === "date" || def?.type === "datetime") {
      return <span className="text-steel-gray text-[11px] font-mono">{String(val).slice(0, 10)}</span>
    }

    return <span className="text-white text-xs font-mono truncate max-w-xs">{String(val)}</span>
  }

  return (
    <div className="space-y-4">
      {/* Top Bar: Search, Export & Action */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-steel-gray/60" />
          <input
            type="text"
            placeholder={`Filter ${schema.description || schema.name}...`}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-full bg-cyber-dark/80 border border-cyber-cyan/20 rounded pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-steel-gray/40 focus:border-cyber-cyan/60 focus:outline-none"
          />
        </div>
        
        <div className="flex items-center gap-2">
          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-2 bg-black/60 border border-cyber-cyan/20 rounded text-xs font-mono text-steel-gray hover:text-white hover:border-cyber-cyan/40 uppercase transition-all"
            >
              <Download className="w-3.5 h-3.5" /> EXPORT
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-1 w-36 bg-cyber-panel border border-cyber-cyan/30 rounded shadow-xl z-20 overflow-hidden font-mono text-xs">
                <button
                  onClick={handleExportCsv}
                  className="w-full px-3 py-2 text-left text-white hover:bg-cyber-cyan/10 hover:text-cyber-cyan uppercase transition-colors"
                >
                  EXPORT CSV
                </button>
                <button
                  onClick={handleExportJson}
                  className="w-full px-3 py-2 text-left text-white hover:bg-cyber-cyan/10 hover:text-cyber-cyan uppercase transition-colors"
                >
                  EXPORT JSON
                </button>
                <button
                  onClick={() => {
                    setShowExportMenu(false)
                    window.print()
                  }}
                  className="w-full px-3 py-2 text-left text-white hover:bg-cyber-cyan/10 hover:text-cyber-cyan uppercase transition-colors border-t border-cyber-cyan/10"
                >
                  PRINT REPORT
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-black/60 border border-cyber-cyan/20 rounded text-xs font-mono text-steel-gray hover:text-white hover:border-cyber-cyan/40 uppercase transition-all"
          >
            <Upload className="w-3.5 h-3.5" /> IMPORT CSV
          </button>

          {onCreateClick && (
            <button
              onClick={onCreateClick}
              className="flex items-center gap-2 px-4 py-2 bg-cyber-cyan/20 border border-cyber-cyan rounded text-xs font-mono text-cyber-cyan hover:bg-cyber-cyan/30 uppercase tracking-wider transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> NEW ENTRY
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full overflow-x-auto border border-cyber-cyan/20 rounded-lg bg-cyber-dark/90 corner-box">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-cyber-cyan/20 bg-cyber-panel/80 text-[10px] font-mono text-steel-gray uppercase tracking-widest">
              <th className="py-3 px-4 w-12 text-center">ID</th>
              {columnKeys.map((k) => (
                <th key={k} className="py-3 px-4">
                  {schema.fields[k]?.label || k}
                </th>
              ))}
              <th className="py-3 px-4 text-right w-24">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyber-cyan/10">
            {loading ? (
              <tr>
                <td colSpan={columnKeys.length + 2} className="py-8 text-center text-steel-gray font-mono text-xs">
                  SYNCHRONIZING ORM MATRIX...
                </td>
              </tr>
            ) : paginatedRecords.length === 0 ? (
              <tr>
                <td colSpan={columnKeys.length + 2} className="py-8 text-center text-steel-gray font-mono text-xs">
                  NO RECORDS FOUND IN MATRIX
                </td>
              </tr>
            ) : (
              paginatedRecords.map((record) => (
                <tr
                  key={record.id}
                  onClick={() => onRowClick?.(record)}
                  className="hover:bg-cyber-cyan/5 transition-colors cursor-pointer"
                >
                  <td className="py-2.5 px-4 text-center font-mono text-xs text-cyber-cyan/70">
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
                          className="p-1 text-steel-gray hover:text-cyber-cyan transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(record)}
                          className="p-1 text-steel-gray hover:text-cyber-pink transition-colors"
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
      <div className="flex items-center justify-between text-xs font-mono text-steel-gray px-2">
        <span>
          SHOWING {paginatedRecords.length} OF {filteredRecords.length} UNITS
        </span>
        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="p-1.5 border border-cyber-cyan/20 rounded disabled:opacity-30 hover:bg-cyber-cyan/10 text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span>
            {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="p-1.5 border border-cyber-cyan/20 rounded disabled:opacity-30 hover:bg-cyber-cyan/10 text-white"
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
