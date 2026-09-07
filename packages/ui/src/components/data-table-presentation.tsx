"use client"

import React from "react"
import { Edit, Loader2, Plus, Search, Trash2 } from "lucide-react"
import { Button } from "./button"
import { CardDescription, CardHeader, CardTitle } from "./card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./dialog"
import { Input } from "./input"
import { Label } from "./label"
import type { CrudColumn } from "./data-table"

type DataTableHeaderProps = {
  title: string
  description: string
  icon?: React.ReactNode
  customActions?: React.ReactNode
  tabs?: { id: string; label: string }[]
  activeTab?: string
  onTabChange?: (tabId: string) => void
  searchQuery: string
  onSearchChange: (value: string) => void
  filterWidgets?: React.ReactNode
  onAdd: () => void
}

export function DataTableHeader({
  title,
  description,
  icon,
  customActions,
  tabs,
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  filterWidgets,
  onAdd,
}: DataTableHeaderProps) {
  return (
    <CardHeader className="border-b border-border pb-4">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted text-primary">
              {icon}
            </div>
          )}
          <div>
            <CardTitle className="font-sans text-lg font-bold tracking-wide text-foreground uppercase">
              {title}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              {description}
            </CardDescription>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {customActions}
          <Button
            onClick={onAdd}
            className="flex h-9 items-center gap-2 border border-border bg-muted font-sans text-xs font-semibold text-primary hover:bg-muted"
          >
            <Plus className="h-4 w-4" /> Add Record
          </Button>
        </div>
      </div>

      {tabs && tabs.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={`rounded-lg px-3 py-1.5 font-mono text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? "border border-border bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search records..."
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            className="h-9 border-border bg-card pl-9 font-sans text-xs text-foreground placeholder:text-muted-foreground focus:border-border"
          />
        </div>
        {filterWidgets && <div className="flex items-center gap-2">{filterWidgets}</div>}
      </div>
    </CardHeader>
  )
}

type DataTableBodyProps<T> = {
  modelName: string
  title: string
  columns: CrudColumn[]
  data: T[]
  loading: boolean
  error: unknown
  onRetry: () => void
  onEdit: (row: any) => void
  onDelete: (id: number | string) => void
}

export function DataTableBody<T>({
  modelName,
  title,
  columns,
  data,
  loading,
  error,
  onRetry,
  onEdit,
  onDelete,
}: DataTableBodyProps<T>) {
  const visibleColumns = columns.filter((column) => !column.hideInTable)

  if (error) {
    return (
      <div className="flex items-center justify-center gap-2 p-12 text-xs text-rose-400">
        <span>Failed to load {modelName} records.</span>
        <Button variant="ghost" size="sm" onClick={onRetry} className="text-primary hover:text-primary">
          Retry
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-primary">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (data.length === 0) {
    return <div className="p-12 text-center text-xs text-muted-foreground">No records found matching criteria.</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left font-sans text-xs text-foreground">
        <thead className="border-b border-border bg-muted text-[10px] font-bold tracking-wider text-primary uppercase">
          <tr>
            {visibleColumns.map((column) => (
              <th key={column.name} className="px-4 py-3">
                {column.label}
              </th>
            ))}
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-cyan-900/20 font-mono">
          {data.map((row: any) => (
            <tr key={row.id} className="transition-colors hover:bg-muted">
              {visibleColumns.map((column) => (
                <td key={column.name} className="px-4 py-3 font-sans">
                  {column.render ? column.render(row[column.name], row) : String(row[column.name] ?? "-")}
                </td>
              ))}
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={`Edit ${title} record ${row.id}`}
                    title={`Edit record ${row.id}`}
                    onClick={() => onEdit(row)}
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-primary"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={`Delete ${title} record ${row.id}`}
                    title={`Delete record ${row.id}`}
                    onClick={() => onDelete(row.id)}
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-rose-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

type DataTableFormDialogProps = {
  modelName: string
  columns: CrudColumn[]
  isOpen: boolean
  isEdit: boolean
  editingId: number | string | null
  formData: Record<string, any>
  isSubmitting: boolean
  onOpenChange: (open: boolean) => void
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onCancel: () => void
  onSave: () => void
}

export function DataTableFormDialog({
  modelName,
  columns,
  isOpen,
  isEdit,
  editingId,
  formData,
  isSubmitting,
  onOpenChange,
  onInputChange,
  onCancel,
  onSave,
}: DataTableFormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-card text-foreground">
        <DialogHeader>
          <DialogTitle className="font-sans text-sm font-bold text-primary uppercase">
            {isEdit ? `Edit Record (#${editingId})` : "Add New Record"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Provide necessary parameters for the record below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {columns
            .filter((column) => !column.hideInForm)
            .map((column) => (
              <div key={column.name} className="space-y-1.5">
                <Label htmlFor={`${modelName}-${column.name}-field`} className="text-xs text-foreground">
                  {column.label}
                </Label>
                <Input
                  id={`${modelName}-${column.name}-field`}
                  name={column.name}
                  type={column.type || "text"}
                  value={formData[column.name] || ""}
                  onChange={onInputChange}
                  placeholder={`Enter ${column.label}...`}
                  className="border-border bg-card text-xs text-foreground"
                />
              </div>
            ))}
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={isSubmitting}
            className="bg-primary text-xs font-bold text-foreground hover:bg-primary"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : isEdit ? "Save Changes" : "Create Record"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
