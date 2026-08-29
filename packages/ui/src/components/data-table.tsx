"use client"

import React, { useState, useEffect, useCallback } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./card"
import { Badge } from "./badge"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./dialog"
import {
  Loader2,
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react"
import { useMoonModel } from "@moon/client"

export type CrudColumn = {
  name: string
  label: string
  type?: "text" | "email" | "password" | "number" | "boolean" | "select"
  required?: boolean
  hideInTable?: boolean
  hideInForm?: boolean
  render?: (val: any, row: any) => React.ReactNode
}

export type DataTableProps<T = any> = {
  modelName: string
  title: string
  description: string
  columns: CrudColumn[]
  icon?: React.ReactNode

  topWidgets?: React.ReactNode
  sideWidgets?: React.ReactNode
  tabs?: { id: string; label: string }[]
  activeTab?: string
  onTabChange?: (tabId: string) => void
  filters?: Record<string, any>
  filterWidgets?: React.ReactNode
  customActions?: React.ReactNode
}

export function DataTable<T = any>({
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
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [editingId, setEditingId] = useState<number | string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { data, loading, error, fetch, create, update, remove } = useMoonModel<T>(modelName, filters)

  useEffect(() => {
    fetch(filters)
  }, [filters, fetch])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async (isEdit: boolean) => {
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      if (isEdit && editingId != null) {
        await update(editingId, formData as Partial<T>)
      } else {
        await create(formData as Partial<T>)
      }
      setFormData({})
      setIsAddOpen(false)
      setIsEditOpen(false)
    } catch (err: any) {
      setSubmitError(err.message || "Save failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number | string) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return
    try {
      await remove(id)
    } catch (err: any) {
      console.error(err)
    }
  }

  const filteredData = data.filter((item: any) => {
    if (!searchQuery.trim()) return true
    return Object.values(item).some(
      (val) => typeof val === "string" && val.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <div className="space-y-6">
      {topWidgets && <div className="mb-6">{topWidgets}</div>}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className={`space-y-6 ${sideWidgets ? "lg:col-span-8" : "lg:col-span-12"}`}>
          <Card className="border-border bg-black/60 shadow-xl backdrop-blur-md">
            <CardHeader className="border-b border-border pb-4">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="flex items-center gap-3">
                  {icon && (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted text-primary">
                      {icon}
                    </div>
                  )}
                  <div>
                    <CardTitle className="font-sans text-lg font-bold tracking-wide text-white uppercase">
                      {title}
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-400">
                      {description}
                    </CardDescription>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {customActions}
                  <Button
                    onClick={() => {
                      setFormData({})
                      setEditingId(null)
                      setIsAddOpen(true)
                    }}
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
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                        activeTab === tab.id
                          ? "bg-primary/10 text-primary border border-border"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative max-w-sm flex-1">
                  <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search records..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 border-border bg-black/40 pl-9 font-sans text-xs text-white placeholder:text-slate-500 focus:border-border"
                  />
                </div>
                {filterWidgets && <div className="flex items-center gap-2">{filterWidgets}</div>}
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {error ? (
                <div className="flex items-center justify-center gap-2 p-12 text-xs text-rose-400">
                  <span>Failed to load {modelName} records.</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fetch(filters)}
                    className="text-primary hover:text-primary"
                  >
                    Retry
                  </Button>
                </div>
              ) : loading ? (
                <div className="flex items-center justify-center p-12 text-primary">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : filteredData.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-500">
                  No records found matching criteria.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans text-slate-300">
                    <thead className="border-b border-border bg-muted text-[10px] font-bold text-primary uppercase tracking-wider">
                      <tr>
                        {columns
                          .filter((col) => !col.hideInTable)
                          .map((col) => (
                            <th key={col.name} className="px-4 py-3">
                              {col.label}
                            </th>
                          ))}
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cyan-900/20 font-mono">
                      {filteredData.map((row: any) => (
                        <tr key={row.id} className="hover:bg-muted transition-colors">
                          {columns
                            .filter((col) => !col.hideInTable)
                            .map((col) => (
                              <td key={col.name} className="px-4 py-3 font-sans">
                                {col.render ? col.render(row[col.name], row) : String(row[col.name] ?? "-")}
                              </td>
                            ))}
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                aria-label={`Edit ${title} record ${row.id}`}
                                title={`Edit record ${row.id}`}
                                onClick={() => {
                                  setEditingId(row.id)
                                  setFormData(row)
                                  setIsEditOpen(true)
                                }}
                                className="h-7 w-7 p-0 text-slate-400 hover:text-primary"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                aria-label={`Delete ${title} record ${row.id}`}
                                title={`Delete record ${row.id}`}
                                onClick={() => handleDelete(row.id)}
                                className="h-7 w-7 p-0 text-slate-400 hover:text-rose-400"
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
              )}
            </CardContent>
          </Card>
        </div>

        {sideWidgets && <div className="space-y-6 lg:col-span-4">{sideWidgets}</div>}
      </div>

      {submitError && (
        <div className="text-xs text-rose-400">{submitError}</div>
      )}

      {/* Add / Edit Dialogs */}
      <Dialog open={isAddOpen || isEditOpen} onOpenChange={(open) => { if (!open) { setIsAddOpen(false); setIsEditOpen(false); setSubmitError(null); } }}>
        <DialogContent className="border-border bg-card text-white">
          <DialogHeader>
            <DialogTitle className="font-sans text-sm uppercase text-primary font-bold">
              {isEditOpen ? `Edit Record (#${editingId})` : `Add New Record`}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Provide necessary parameters for the record below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {columns
              .filter((c) => !c.hideInForm)
              .map((c) => (
                <div key={c.name} className="space-y-1.5">
                  <Label htmlFor={`${modelName}-${c.name}-field`} className="text-xs text-slate-300">{c.label}</Label>
                  <Input
                    id={`${modelName}-${c.name}-field`}
                    name={c.name}
                    type={c.type || "text"}
                    value={formData[c.name] || ""}
                    onChange={handleInputChange}
                    placeholder={`Enter ${c.label}...`}
                    className="border-border bg-black text-xs text-white"
                  />
                </div>
              ))}
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={() => { setIsAddOpen(false); setIsEditOpen(false); setSubmitError(null); }}>
              Cancel
            </Button>
            <Button
              onClick={() => handleSave(isEditOpen)}
              disabled={isSubmitting}
              className="bg-primary text-white hover:bg-primary font-bold text-xs"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : isEditOpen ? "Save Changes" : "Create Record"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
