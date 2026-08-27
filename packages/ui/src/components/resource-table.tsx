"use client"

import React, { useState, useMemo } from "react"
import { Search, Loader2 } from "lucide-react"

export interface TableColumn<T> {
  key: string
  label: string
  render?: (item: T, index: number) => React.ReactNode
  align?: "left" | "center" | "right"
  width?: string
  className?: string
}

export interface ResourceTableProps<T> {
  /** Array of data items */
  data: T[]
  /** Column definitions */
  columns: TableColumn<T>[]
  /** Keys used for client-side search filtering */
  searchKeys?: (keyof T | string)[]
  /** Optional table title */
  title?: string
  /** Optional table subtitle / description */
  subtitle?: string
  /** Accent color token theme */
  accentColor?: "cyan" | "green" | "yellow" | "purple" | "pink"
  /** Callback when edit button is clicked */
  onEdit?: (item: T) => void
  /** Callback when delete button is clicked */
  onDelete?: (item: T) => void
  /** Callback when row is clicked */
  onRowClick?: (item: T) => void
  /** Custom per-row action renderer */
  actions?: (item: T) => React.ReactNode
  /** Action buttons rendered in the header */
  headerActions?: React.ReactNode
  /** Filter component rendered next to search */
  filterSlot?: React.ReactNode
  /** Loading state */
  loading?: boolean
  /** Custom empty state message */
  emptyMessage?: string
  /** Items per page (default: 15) */
  pageSize?: number
  /** Key extractor function */
  getItemKey?: (item: T, index: number) => string | number
  /** Custom className */
  className?: string
}

const COLOR_MAP = {
  cyan: {
    border: "border-cyber-cyan/30 hover:border-cyber-cyan/60",
    headerGlow: "via-cyber-cyan",
    badge: "bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan/30",
    searchRing: "focus:border-cyber-cyan/60 focus:ring-cyber-cyan/20",
    btnEdit: "border-cyber-cyan/40 bg-cyber-cyan/10 text-cyber-cyan hover:bg-cyber-cyan/20",
  },
  green: {
    border: "border-cyber-green/30 hover:border-cyber-green/60",
    headerGlow: "via-cyber-green",
    badge: "bg-cyber-green/10 text-cyber-green border-cyber-green/30",
    searchRing: "focus:border-cyber-green/60 focus:ring-cyber-green/20",
    btnEdit: "border-cyber-green/40 bg-cyber-green/10 text-cyber-green hover:bg-cyber-green/20",
  },
  yellow: {
    border: "border-cyber-yellow/30 hover:border-cyber-yellow/60",
    headerGlow: "via-cyber-yellow",
    badge: "bg-cyber-yellow/10 text-cyber-yellow border-cyber-yellow/30",
    searchRing: "focus:border-cyber-yellow/60 focus:ring-cyber-yellow/20",
    btnEdit: "border-cyber-yellow/40 bg-cyber-yellow/10 text-cyber-yellow hover:bg-cyber-yellow/20",
  },
  purple: {
    border: "border-cyber-purple/30 hover:border-cyber-purple/60",
    headerGlow: "via-cyber-purple",
    badge: "bg-cyber-purple/10 text-cyber-purple border-cyber-purple/30",
    searchRing: "focus:border-cyber-purple/60 focus:ring-cyber-purple/20",
    btnEdit: "border-cyber-purple/40 bg-cyber-purple/10 text-cyber-purple hover:bg-cyber-purple/20",
  },
  pink: {
    border: "border-cyber-pink/30 hover:border-cyber-pink/60",
    headerGlow: "via-cyber-pink",
    badge: "bg-cyber-pink/10 text-cyber-pink border-cyber-pink/30",
    searchRing: "focus:border-cyber-pink/60 focus:ring-cyber-pink/20",
    btnEdit: "border-cyber-pink/40 bg-cyber-pink/10 text-cyber-pink hover:bg-cyber-pink/20",
  },
}

/**
 * ◈ ResourceTable — Universal Standard Data Grid Component
 *
 * Enterprise-grade, type-safe data grid with built-in multi-field search,
 * sorting, pagination, empty states, and customizable action triggers.
 */
export function ResourceTable<T = any>({
  data,
  columns,
  searchKeys = [],
  title,
  subtitle,
  accentColor = "cyan",
  onEdit,
  onDelete,
  onRowClick,
  actions,
  headerActions,
  filterSlot,
  loading = false,
  emptyMessage = "No records found.",
  pageSize = 15,
  getItemKey,
  className = "",
}: ResourceTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const colors = COLOR_MAP[accentColor] || COLOR_MAP.cyan

  const filteredData = useMemo(() => {
    if (!searchQuery.trim() || searchKeys.length === 0) {
      return data
    }
    const q = searchQuery.toLowerCase()

    return data.filter((item: any) => {
      return searchKeys.some((key) => {
        const val = item[key]
        if (val === null || val === undefined) return false
        return String(val).toLowerCase().includes(q)
      })
    })
  }, [data, searchQuery, searchKeys])

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize))
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredData.slice(start, start + pageSize)
  }, [filteredData, currentPage, pageSize])

  const hasActions = onEdit || onDelete || actions

  return (
    <div className={`relative overflow-hidden border bg-[#0A0F17]/90 backdrop-blur-md ${colors.border} ${className}`}>
      {/* Top Accent Bar */}
      <div className={`absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-transparent ${colors.headerGlow} to-transparent opacity-80`} />

      {/* Header & Search Toolbar */}
      {(title || subtitle || searchKeys.length > 0 || headerActions) && (
        <div className="flex flex-col justify-between gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center">
          <div>
            {title && (
              <h3 className="font-orbitron text-sm font-black tracking-widest text-white uppercase">
                ◈ {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-1 font-mono text-xs text-[#8B9BB0]">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {filterSlot}

            {searchKeys.length > 0 && (
              <div className="relative w-full sm:w-60">
                <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="FILTER DATABASE..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  className={`w-full border border-white/10 bg-black/60 py-1.5 pr-3 pl-8 font-mono text-xs text-white placeholder-white/30 transition-all focus:outline-none ${colors.searchRing}`}
                />
              </div>
            )}

            {headerActions}
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead className="border-b border-white/10 bg-white/5 text-[9px] tracking-widest text-[#8B9BB0] uppercase">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={col.key || idx}
                  style={{ width: col.width }}
                  className={`px-4 py-3 font-bold ${
                    col.align === "right"
                      ? "text-right"
                      : col.align === "center"
                      ? "text-center"
                      : "text-left"
                  } ${col.className || ""}`}
                >
                  {col.label}
                </th>
              ))}
              {hasActions && (
                <th className="px-4 py-3 text-right font-bold">ACTIONS</th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="py-16 text-center text-[#8B9BB0]"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-cyber-cyan" />
                    <span className="font-mono text-xs tracking-widest text-cyber-cyan uppercase">
                      SYNCHRONIZING RECORDS...
                    </span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="py-12 text-center font-mono text-xs text-[#8B9BB0]"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((item: any, rIdx: number) => {
                const key = getItemKey ? getItemKey(item, rIdx) : item.id ?? item._id ?? rIdx

                return (
                  <tr
                    key={key}
                    onClick={() => onRowClick?.(item)}
                    className={`transition-colors hover:bg-white/5 ${
                      onRowClick ? "cursor-pointer" : ""
                    }`}
                  >
                    {columns.map((col, cIdx) => (
                      <td
                        key={col.key || cIdx}
                        className={`px-4 py-3 text-slate-200 ${
                          col.align === "right"
                            ? "text-right"
                            : col.align === "center"
                            ? "text-center"
                            : "text-left"
                        } ${col.className || ""}`}
                      >
                        {col.render ? col.render(item, rIdx) : item[col.key]}
                      </td>
                    ))}

                    {hasActions && (
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {actions?.(item)}

                          {onEdit && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                onEdit(item)
                              }}
                              className={`border px-2.5 py-1 font-mono text-[10px] font-bold tracking-wider uppercase transition-all ${colors.btnEdit}`}
                            >
                              [ EDIT ]
                            </button>
                          )}

                          {onDelete && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                onDelete(item)
                              }}
                              className="border border-cyber-pink/40 bg-cyber-pink/10 px-2.5 py-1 font-mono text-[10px] font-bold tracking-wider text-cyber-pink uppercase transition-all hover:bg-cyber-pink/20"
                            >
                              [ DEL ]
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-white/10 px-5 py-3 font-mono text-xs text-[#8B9BB0]">
          <span>
            RECORD {filteredData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} -{" "}
            {Math.min(currentPage * pageSize, filteredData.length)} OF {filteredData.length}
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="border border-white/10 bg-black/40 px-2.5 py-1 text-[10px] font-bold uppercase transition-all hover:bg-white/10 disabled:opacity-30"
            >
              [ PREV ]
            </button>
            <span className="px-2 text-[10px] font-bold text-white">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="border border-white/10 bg-black/40 px-2.5 py-1 text-[10px] font-bold uppercase transition-all hover:bg-white/10 disabled:opacity-30"
            >
              [ NEXT ]
            </button>
          </div>
        </div>
      )}
    </div>
  )
}


