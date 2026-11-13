"use client"

import React, { useState } from "react"
import { useMoonModel } from "@moon/client"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog"
import {
  Loader2,
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react"

export type CrudColumn = {
  name: string
  label: string
  type?: "text" | "email" | "password" | "number" | "boolean" | "select"
  required?: boolean
  hideInTable?: boolean
  hideInForm?: boolean
  render?: (val: any, row: any) => React.ReactNode
}

export type MoonDataTableProps = {
  modelName: string
  title: string
  description: string
  columns: CrudColumn[]
  icon?: React.ReactNode

  // Advanced UI Slots
  topWidgets?: React.ReactNode
  sideWidgets?: React.ReactNode
  tabs?: { id: string; label: string }[]
  activeTab?: string
  onTabChange?: (tabId: string) => void
  filters?: Record<string, string>
  filterWidgets?: React.ReactNode
  customActions?: React.ReactNode
}

export function MoonDataTable({
  modelName,
  title,
  description,
  columns,
  icon,
  topWidgets,
  sideWidgets,
  tabs,
  activeTab,
  onTabChange,
  filters,
  filterWidgets,
  customActions,
}: MoonDataTableProps) {
  const { data, loading, error, create, update, remove } = useMoonModel(
    modelName,
    filters
  )

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async (isEdit: boolean) => {
    setIsSubmitting(true)
    try {
      if (isEdit && editingId) {
        await update(editingId, formData)
        setIsEditOpen(false)
      } else {
        await create(formData)
        setIsAddOpen(false)
      }
      setFormData({})
    } catch (err) {
      console.error("Save failed:", err)
      alert("Failed to save data. See console for details.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this record?")) return
    try {
      await remove(id)
    } catch (err) {
      console.error("Delete failed:", err)
      alert("Failed to delete record.")
    }
  }

  const openEdit = (row: any) => {
    setFormData(row)
    setEditingId(row.id)
    setIsEditOpen(true)
  }

  // Frontend search filter (can be moved to backend in the future)
  const filteredData = Array.isArray(data)
    ? data.filter((row: any) => {
        if (!searchQuery) return true
        const searchLower = searchQuery.toLowerCase()
        return columns.some(
          (c) =>
            !c.hideInTable &&
            String(row[c.name] || "")
              .toLowerCase()
              .includes(searchLower)
        )
      })
    : []

  return (
    <div className="flex flex-col gap-6">
      {/* Top Widgets Slot */}
      {topWidgets && <div className="w-full">{topWidgets}</div>}

      <div className="flex flex-col items-start gap-6 xl:flex-row">
        {/* Main Content Area */}
        <div
          className={`flex flex-col gap-4 ${sideWidgets ? "w-full xl:w-3/4" : "w-full"}`}
        >
          <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm backdrop-blur-md">
            <MoonDataTableToolbar
              title={title}
              description={description}
              icon={icon}
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={onTabChange}
              customActions={customActions}
              filterWidgets={filterWidgets}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onAdd={() => { setFormData({}); setIsAddOpen(true) }}
            />

            {/* Table Area */}
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-border bg-card/[0.02]">
                    <th className="w-12 px-4 py-3 text-center text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                      <Checkbox aria-label="Select all records" />
                    </th>
                    {columns
                      .filter((c) => !c.hideInTable)
                      .map((col) => (
                        <th
                          key={col.name}
                          className="px-4 py-3 text-[10px] font-bold tracking-widest text-muted-foreground uppercase"
                        >
                          {col.label}
                        </th>
                      ))}
                    <th className="px-4 py-3 text-right text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <MoonDataTableBody
                  loading={loading}
                  hasData={Array.isArray(data) && data.length > 0}
                  error={Boolean(error)}
                  filteredData={filteredData}
                  columns={columns}
                  onEdit={openEdit}
                  onDelete={(row) => handleDelete(row.id)}
                />
              </table>
            </div>

            {/* Table Footer / Pagination */}
            <div className="flex items-center justify-between border-t border-border p-4">
              <span className="text-[10px] tracking-wider text-muted-foreground">
                Showing {filteredData.length} records
              </span>
              <div className="flex items-center gap-1">
                {/* Pagination placeholder */}
                <Button type="button" variant="ghost" size="icon" aria-label="Previous page" className="flex h-6 w-6 items-center justify-center rounded text-[10px] text-muted-foreground hover:bg-muted/30">
                  &lt;
                </Button>
                <Button type="button" variant="ghost" size="icon" aria-label="Page 1" className="flex h-6 w-6 items-center justify-center rounded border border-border bg-primary/10 text-[10px] text-primary">
                  1
                </Button>
                <Button type="button" variant="ghost" size="icon" aria-label="Page 2" className="flex h-6 w-6 items-center justify-center rounded text-[10px] text-muted-foreground hover:bg-muted/30">
                  2
                </Button>
                <Button type="button" variant="ghost" size="icon" aria-label="Next page" className="flex h-6 w-6 items-center justify-center rounded text-[10px] text-muted-foreground hover:bg-muted/30">
                  &gt;
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Side Widgets Slot */}
        {sideWidgets && (
          <div className="flex w-full flex-col gap-4 xl:w-1/4">
            {sideWidgets}
          </div>
        )}
      </div>

      <MoonDataTableDialog open={isAddOpen} onOpenChange={setIsAddOpen} title={`Add New ${title}`} description="Create a new record in the system." columns={columns} formData={formData} onChange={handleInputChange} isSubmitting={isSubmitting} actionLabel="Save Record" onSubmit={() => handleSave(false)} />
      <MoonDataTableDialog open={isEditOpen} onOpenChange={setIsEditOpen} title={`Edit ${title}`} description="Update existing record details." columns={columns} formData={formData} onChange={handleInputChange} isSubmitting={isSubmitting} actionLabel="Update Record" onSubmit={() => handleSave(true)} />
    </div>
  )
}

function MoonDataTableDialog({
  open,
  onOpenChange,
  title,
  description,
  columns,
  formData,
  onChange,
  isSubmitting,
  actionLabel,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  columns: CrudColumn[]
  formData: Record<string, any>
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  isSubmitting: boolean
  actionLabel: string
  onSubmit: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-background">
        <DialogHeader><DialogTitle className="text-sm font-bold tracking-wider text-primary uppercase">{title}</DialogTitle><DialogDescription className="text-xs">{description}</DialogDescription></DialogHeader>
        <div className="grid gap-4 py-4">{columns.filter((column) => !column.hideInForm).map((column) => <MoonDataTableField key={column.name} column={column} value={formData[column.name] || ""} onChange={onChange} />)}</div>
        <MoonDataTableDialogActions isSubmitting={isSubmitting} label={actionLabel} onCancel={() => onOpenChange(false)} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  )
}

function MoonDataTableField({
  column,
  value,
  onChange,
}: {
  column: CrudColumn
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={column.name} className="text-xs text-muted-foreground">
        {column.label} {column.required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        id={column.name}
        name={column.name}
        type={column.type === "password" ? "password" : column.type === "email" ? "email" : "text"}
        value={value}
        onChange={onChange}
        className="border-border bg-card text-foreground focus-visible:ring-cyan-500/50"
        required={column.required}
      />
    </div>
  )
}

function MoonDataTableToolbar({
  title,
  description,
  icon,
  tabs,
  activeTab,
  onTabChange,
  customActions,
  filterWidgets,
  searchQuery,
  onSearchChange,
  onAdd,
}: {
  title: string
  description: string
  icon?: React.ReactNode
  tabs?: { id: string; label: string }[]
  activeTab?: string
  onTabChange?: (tabId: string) => void
  customActions?: React.ReactNode
  filterWidgets?: React.ReactNode
  searchQuery: string
  onSearchChange: (value: string) => void
  onAdd: () => void
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-border p-4">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        {tabs && tabs.length > 0 ? <div className="scrollbar-hide flex w-full items-center gap-6 overflow-x-auto pb-1 md:w-auto md:pb-0">{tabs.map((tab) => <Button type="button" key={tab.id} onClick={() => onTabChange?.(tab.id)} className={`border-b-2 pb-2 text-xs font-semibold tracking-wider whitespace-nowrap uppercase transition-colors ${activeTab === tab.id ? "border-border text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{tab.label}</Button>)}</div> : <div className="flex items-center gap-3"><div className="rounded-lg border border-border bg-primary/10 p-2 text-primary">{icon}</div><div><h2 className="text-sm font-bold tracking-wider text-foreground uppercase">{title}</h2><p className="text-xs text-muted-foreground">{description}</p></div></div>}
        <div className="flex w-full items-center justify-end gap-3 md:w-auto">{customActions}<Button type="button" onClick={onAdd} className="h-8 bg-primary px-3 text-xs font-semibold text-foreground shadow-sm hover:bg-primary"><Plus className="mr-1 h-4 w-4" />ADD RECORD</Button></div>
      </div>
      <div className="flex w-full flex-col items-center gap-3 md:flex-row"><div className="relative w-full md:w-64"><Search className="absolute top-2 left-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search records..." value={searchQuery} onChange={(event) => onSearchChange(event.target.value)} className="h-8 border-border bg-card pl-9 text-xs text-foreground focus-visible:ring-cyan-500/50" /></div><div className="scrollbar-hide flex flex-1 items-center gap-3 overflow-x-auto">{filterWidgets}</div></div>
    </div>
  )
}

function MoonDataTableDialogActions({
  isSubmitting,
  label,
  onCancel,
  onSubmit,
}: {
  isSubmitting: boolean
  label: string
  onCancel: () => void
  onSubmit: () => void
}) {
  return (
    <div className="flex justify-end gap-2">
      <Button type="button" variant="ghost" onClick={onCancel} className="h-8 text-xs text-muted-foreground hover:text-foreground">Cancel</Button>
      <Button type="button" onClick={onSubmit} disabled={isSubmitting} className="h-8 bg-primary px-6 text-xs font-semibold text-foreground shadow-sm hover:bg-primary">
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : label}
      </Button>
    </div>
  )
}

function MoonDataTableRowActions({
  rowId,
  onEdit,
  onDelete,
}: {
  rowId: string | number
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="flex items-center justify-end gap-2 opacity-50 transition-opacity group-hover:opacity-100">
      <Button type="button" variant="ghost" size="icon" aria-label={`Edit record ${rowId}`} onClick={onEdit} className="rounded bg-muted/30 p-1.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"><Edit className="h-3.5 w-3.5" /></Button>
      <Button type="button" variant="ghost" size="icon" aria-label={`Delete record ${rowId}`} onClick={onDelete} className="rounded bg-muted/30 p-1.5 text-muted-foreground transition-colors hover:bg-destructive/20 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
      <Button type="button" variant="ghost" size="icon" aria-label={`More actions for record ${rowId}`}><MoreHorizontal className="h-3.5 w-3.5" /></Button>
    </div>
  )
}

function MoonDataTableRow({
  row,
  columns,
  onEdit,
  onDelete,
}: {
  row: Record<string, any>
  columns: CrudColumn[]
  onEdit: (row: Record<string, any>) => void
  onDelete: () => void
}) {
  return (
    <tr className="group border-b border-border transition-colors hover:bg-card/[0.02]">
      <td className="px-4 py-3 text-center"><Checkbox aria-label={`Select record ${row.id}`} /></td>
      {columns.filter((column) => !column.hideInTable).map((column) => (
        <td key={column.name} className="px-4 py-3 font-sans text-xs text-foreground">
          {column.render ? column.render(row[column.name], row) : row[column.name] || "-"}
        </td>
      ))}
      <td className="px-4 py-3 text-right"><MoonDataTableRowActions rowId={row.id} onEdit={() => onEdit(row)} onDelete={onDelete} /></td>
    </tr>
  )
}

function MoonDataTableBody({
  loading,
  hasData,
  error,
  filteredData,
  columns,
  onEdit,
  onDelete,
}: {
  loading: boolean
  hasData: boolean
  error: boolean
  filteredData: Array<Record<string, any>>
  columns: CrudColumn[]
  onEdit: (row: Record<string, any>) => void
  onDelete: (row: Record<string, any>) => void
}) {
  const colSpan = columns.length + 2
  if (loading && !hasData) {
    return <tbody><tr><td colSpan={colSpan} className="px-4 py-12 text-center"><Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin text-primary" /><span className="text-xs tracking-widest text-muted-foreground uppercase">Loading...</span></td></tr></tbody>
  }
  if (!hasData) {
    return <tbody><tr><td colSpan={colSpan} className="px-4 py-12 text-center text-xs tracking-wider text-muted-foreground">{error ? "Failed to load records." : "No records found."}</td></tr></tbody>
  }
  if (filteredData.length === 0) {
    return <tbody><tr><td colSpan={colSpan} className="px-4 py-12 text-center text-xs tracking-wider text-muted-foreground">No matches found.</td></tr></tbody>
  }
  return <tbody>{filteredData.map((row) => <MoonDataTableRow key={row.id} row={row} columns={columns} onEdit={onEdit} onDelete={() => onDelete(row)} />)}</tbody>
}
