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
          <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-black/40 shadow-sm backdrop-blur-md">
            {/* Toolbar / Header */}
            <div className="flex flex-col gap-4 border-b border-border p-4">
              {/* Tabs & Primary Actions */}
              <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                {tabs && tabs.length > 0 ? (
                  <div className="scrollbar-hide flex w-full items-center gap-6 overflow-x-auto pb-1 md:w-auto md:pb-0">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => onTabChange && onTabChange(tab.id)}
                        className={`border-b-2 pb-2 text-xs font-semibold tracking-wider whitespace-nowrap uppercase transition-colors ${
                          activeTab === tab.id
                            ? "border-border text-primary"
                            : "border-transparent text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg border border-border bg-primary/10 p-2 text-primary">
                      {icon}
                    </div>
                    <div>
                      <h2 className="text-sm font-bold tracking-wider text-white uppercase">
                        {title}
                      </h2>
                      <p className="text-xs text-slate-400">{description}</p>
                    </div>
                  </div>
                )}

                <div className="flex w-full items-center justify-end gap-3 md:w-auto">
                  {customActions}
                  <Button
                    onClick={() => {
                      setFormData({})
                      setIsAddOpen(true)
                    }}
                    className="h-8 bg-primary px-3 text-xs font-semibold text-black shadow-sm hover:bg-primary"
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    ADD RECORD
                  </Button>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="flex w-full flex-col items-center gap-3 md:flex-row">
                <div className="relative w-full md:w-64">
                  <Search className="absolute top-2 left-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    placeholder="Search records..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 border-border bg-black/50 pl-9 text-xs text-slate-200 focus-visible:ring-cyan-500/50"
                  />
                </div>

                <div className="scrollbar-hide flex flex-1 items-center gap-3 overflow-x-auto">
                  {filterWidgets}
                </div>
              </div>
            </div>

            {/* Table Area */}
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-border bg-white/[0.02]">
                    <th className="w-12 px-4 py-3 text-center text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                      <input
                        type="checkbox"
                        className="rounded border-border bg-black/50"
                      />
                    </th>
                    {columns
                      .filter((c) => !c.hideInTable)
                      .map((col) => (
                        <th
                          key={col.name}
                          className="px-4 py-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase"
                        >
                          {col.label}
                        </th>
                      ))}
                    <th className="px-4 py-3 text-right text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading && Array.isArray(data) && data.length === 0 ? (
                    <tr>
                      <td
                        colSpan={columns.length + 2}
                        className="px-4 py-12 text-center"
                      >
                        <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin text-primary" />
                        <span className="text-xs tracking-widest text-slate-400 uppercase">
                          Loading...
                        </span>
                      </td>
                    </tr>
                  ) : !Array.isArray(data) || data.length === 0 ? (
                    <tr>
                      <td
                        colSpan={columns.length + 2}
                        className="px-4 py-12 text-center text-xs tracking-wider text-slate-500"
                      >
                        {error
                          ? "Failed to load records."
                          : "No records found."}
                      </td>
                    </tr>
                  ) : filteredData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={columns.length + 2}
                        className="px-4 py-12 text-center text-xs tracking-wider text-slate-500"
                      >
                        No matches found.
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((row: any) => (
                      <tr
                        key={row.id}
                        className="group border-b border-border transition-colors hover:bg-white/[0.02]"
                      >
                        <td className="px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            className="rounded border-border bg-black/50"
                          />
                        </td>
                        {columns
                          .filter((c) => !c.hideInTable)
                          .map((col) => (
                            <td
                              key={col.name}
                              className="px-4 py-3 font-sans text-xs text-slate-300"
                            >
                              {col.render
                                ? col.render(row[col.name], row)
                                : row[col.name] || "-"}
                            </td>
                          ))}
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-50 transition-opacity group-hover:opacity-100">
                            <button
                              onClick={() => openEdit(row)}
                              className="rounded bg-white/5 p-1.5 text-slate-400 transition-colors hover:bg-primary/10 hover:text-primary"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(row.id)}
                              className="rounded bg-white/5 p-1.5 text-slate-400 transition-colors hover:bg-red-500/20 hover:text-red-400"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <button className="rounded bg-white/5 p-1.5 text-slate-400 transition-colors hover:bg-white/10">
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer / Pagination */}
            <div className="flex items-center justify-between border-t border-border p-4">
              <span className="text-[10px] tracking-wider text-slate-500">
                Showing {filteredData.length} records
              </span>
              <div className="flex items-center gap-1">
                {/* Pagination placeholder */}
                <button className="flex h-6 w-6 items-center justify-center rounded text-[10px] text-slate-500 hover:bg-white/5">
                  &lt;
                </button>
                <button className="flex h-6 w-6 items-center justify-center rounded border border-border bg-primary/10 text-[10px] text-primary">
                  1
                </button>
                <button className="flex h-6 w-6 items-center justify-center rounded text-[10px] text-slate-500 hover:bg-white/5">
                  2
                </button>
                <button className="flex h-6 w-6 items-center justify-center rounded text-[10px] text-slate-500 hover:bg-white/5">
                  &gt;
                </button>
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

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="border-border bg-slate-950">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold tracking-wider text-primary uppercase">
              Add New {title}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Create a new record in the system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {columns
              .filter((c) => !c.hideInForm)
              .map((col) => (
                <div key={col.name} className="flex flex-col gap-2">
                  <Label htmlFor={col.name} className="text-xs text-slate-400">
                    {col.label}{" "}
                    {col.required && <span className="text-red-500">*</span>}
                  </Label>
                  <Input
                    id={col.name}
                    name={col.name}
                    type={
                      col.type === "password"
                        ? "password"
                        : col.type === "email"
                          ? "email"
                          : "text"
                    }
                    value={formData[col.name] || ""}
                    onChange={handleInputChange}
                    className="border-border bg-black/50 text-slate-200 focus-visible:ring-cyan-500/50"
                    required={col.required}
                  />
                </div>
              ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => setIsAddOpen(false)}
              className="h-8 text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleSave(false)}
              disabled={isSubmitting}
              className="h-8 bg-primary px-6 text-xs font-semibold text-black shadow-sm hover:bg-primary"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save Record"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="border-border bg-slate-950">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold tracking-wider text-primary uppercase">
              Edit {title}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Update existing record details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {columns
              .filter((c) => !c.hideInForm)
              .map((col) => (
                <div key={col.name} className="flex flex-col gap-2">
                  <Label htmlFor={col.name} className="text-xs text-slate-400">
                    {col.label}{" "}
                    {col.required && <span className="text-red-500">*</span>}
                  </Label>
                  <Input
                    id={col.name}
                    name={col.name}
                    type={
                      col.type === "password"
                        ? "password"
                        : col.type === "email"
                          ? "email"
                          : "text"
                    }
                    value={formData[col.name] || ""}
                    onChange={handleInputChange}
                    className="border-border bg-black/50 text-slate-200 focus-visible:ring-cyan-500/50"
                    required={col.required}
                  />
                </div>
              ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => setIsEditOpen(false)}
              className="h-8 text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleSave(true)}
              disabled={isSubmitting}
              className="h-8 bg-primary px-6 text-xs font-semibold text-black shadow-sm hover:bg-primary"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Update Record"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
