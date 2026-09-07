"use client"

import React from "react"
import { ChevronLeft, ChevronRight, Download, Edit2, Plus, Search, Trash2, Upload } from "lucide-react"
import type { FieldMeta, ModelSchema } from "@workspace/types"
import { Button } from "../button"
import { Input } from "../input"

type ModelDataTableToolbarProps = {
  schema: ModelSchema
  search: string
  showExportMenu: boolean
  onSearchChange: (value: string) => void
  onToggleExportMenu: () => void
  onExportCsv: () => void
  onExportJson: () => void
  onPrint: () => void
  onOpenImport: () => void
  onCreateClick?: () => void
}

export function ModelDataTableToolbar({
  schema,
  search,
  showExportMenu,
  onSearchChange,
  onToggleExportMenu,
  onExportCsv,
  onExportJson,
  onPrint,
  onOpenImport,
  onCreateClick,
}: ModelDataTableToolbarProps) {
  return (
    <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 font-sans text-xs shadow-sm sm:flex-row">
      <div className="relative w-full sm:w-80">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={`Search ${schema.description || schema.name}...`}
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="w-full rounded-lg border border-border bg-background py-2 pr-4 pl-9 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <Button type="button" variant="outline"
            onClick={onToggleExportMenu}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-medium text-secondary-foreground transition-colors hover:bg-accent"
          >
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
          {showExportMenu && (
            <div className="absolute right-0 z-20 mt-1 w-36 overflow-hidden rounded-lg border border-border bg-card font-sans text-xs shadow-xl">
              <Button type="button" variant="ghost" onClick={onExportCsv} className="w-full justify-start px-3 py-2 text-left text-foreground transition-colors hover:bg-accent">
                Export CSV
              </Button>
              <Button type="button" variant="ghost" onClick={onExportJson} className="w-full justify-start px-3 py-2 text-left text-foreground transition-colors hover:bg-accent">
                Export JSON
              </Button>
              <Button type="button" variant="ghost"
                onClick={onPrint}
                className="w-full border-t border-border px-3 py-2 text-left text-foreground transition-colors hover:bg-accent"
              >
                Print Report
              </Button>
            </div>
          )}
        </div>

        <Button type="button" variant="outline"
          onClick={onOpenImport}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-medium text-secondary-foreground transition-colors hover:bg-accent"
        >
          <Upload className="h-3.5 w-3.5" /> Import CSV
        </Button>

        {onCreateClick && (
          <Button type="button" variant="default"
            onClick={onCreateClick}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
          >
            <Plus className="h-3.5 w-3.5" /> New Record
          </Button>
        )}
      </div>
    </div>
  )
}

type ModelDataTableCellProps = {
  field?: FieldMeta
  value: any
}

export function ModelDataTableCell({ field, value }: ModelDataTableCellProps) {
  if (value === null || value === undefined) return <span className="text-muted-foreground/50">—</span>

  if (field?.type === "boolean") {
    return (
      <span
        className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
          value ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
        }`}
      >
        {value ? "YES" : "NO"}
      </span>
    )
  }

  if (field?.type === "many2one" && typeof value === "object") {
    return <span className="font-medium text-foreground">{value.name || value.title || value.reference || `#${value.id}`}</span>
  }

  if (field?.type === "selection") {
    const match = field.selection?.find(([key]) => key === value)
    return (
      <span className="inline-block rounded bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
        {match ? match[1] : String(value)}
      </span>
    )
  }

  if (field?.type === "float" || field?.type === "monetary") {
    return <span className="font-mono">{Number(value).toLocaleString()}</span>
  }

  if (field?.type === "datetime" || field?.type === "date") {
    return <span className="font-mono text-[11px] text-muted-foreground">{new Date(value).toLocaleDateString()}</span>
  }

  return <span className="inline-block max-w-[200px] truncate">{String(value)}</span>
}

type ModelDataTableGridProps = {
  schema: ModelSchema
  columnKeys: string[]
  records: any[]
  loading: boolean
  onRowClick?: (record: any) => void
  onEdit?: (record: any) => void
  onDelete?: (record: any) => void
}

export function ModelDataTableGrid({
  schema,
  columnKeys,
  records,
  loading,
  onRowClick,
  onEdit,
  onDelete,
}: ModelDataTableGridProps) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-border bg-muted/40 font-sans text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            <th className="w-12 px-4 py-3 text-center">ID</th>
            {columnKeys.map((key) => (
              <th key={key} className="px-4 py-3">
                {schema.fields[key]?.label || key}
              </th>
            ))}
            <th className="w-24 px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border font-sans">
          {loading ? (
            <tr>
              <td colSpan={columnKeys.length + 2} className="py-8 text-center font-sans text-xs text-muted-foreground">
                Loading records...
              </td>
            </tr>
          ) : records.length === 0 ? (
            <tr>
              <td colSpan={columnKeys.length + 2} className="py-8 text-center font-sans text-xs text-muted-foreground">
                No records found
              </td>
            </tr>
          ) : (
            records.map((record) => (
              <tr
                key={record.id}
                onClick={() => onRowClick?.(record)}
                className="cursor-pointer transition-colors hover:bg-muted/30"
              >
                <td className="px-4 py-2.5 text-center font-mono text-xs text-primary/80">#{record.id}</td>
                {columnKeys.map((key) => (
                  <td key={key} className="px-4 py-2.5">
                    <ModelDataTableCell field={schema.fields[key]} value={record[key]} />
                  </td>
                ))}
                <td className="px-4 py-2.5 text-right" onClick={(event) => event.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(record)}
                        aria-label={`Edit record ${record.id}`}
                        className="p-1 text-muted-foreground transition-colors hover:text-foreground"
                        title="Edit"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(record)}
                        aria-label={`Delete record ${record.id}`}
                        className="p-1 text-muted-foreground transition-colors hover:text-destructive"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
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
  )
}

type ModelDataTablePaginationProps = {
  page: number
  totalPages: number
  visibleRecordCount: number
  filteredRecordCount: number
  onPrevious: () => void
  onNext: () => void
}

export function ModelDataTablePagination({
  page,
  totalPages,
  visibleRecordCount,
  filteredRecordCount,
  onPrevious,
  onNext,
}: ModelDataTablePaginationProps) {
  return (
    <div className="flex items-center justify-between px-2 text-xs text-muted-foreground">
      <span>
        Showing {visibleRecordCount} of {filteredRecordCount} records
      </span>
      <div className="flex items-center gap-2">
        <button
          disabled={page <= 1}
          onClick={onPrevious}
          aria-label="Previous page"
          className="rounded-lg border border-border p-1.5 text-foreground hover:bg-accent disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="font-mono">
          {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={onNext}
          aria-label="Next page"
          className="rounded-lg border border-border p-1.5 text-foreground hover:bg-accent disabled:opacity-30"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
