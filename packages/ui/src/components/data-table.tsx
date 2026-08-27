"use client"

import React, { useState, useEffect, useCallback } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./card"
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

export type DataTableProps<T = any> = {
  modelName: string
  title: string
  description: string
  columns: CrudColumn[]
  icon?: React.ReactNode

  // UI Slots
  topWidgets?: React.ReactNode
  sideWidgets?: React.ReactNode
  tabs?: { id: string; label: string }[]
  activeTab?: string
  onTabChange?: (tabId: string) => void
  filters?: Record<string, any>
  filterWidgets?: React.ReactNode
  customActions?: React.ReactNode
  initialData?: T[]
}

type PageMeta = {
  total: number
  page: number
  pageSize: number
  lastPage: number
}

async function readJson(response: Response): Promise<any> {
  try {
    return await response.json()
  } catch {
    return null
  }
}

function apiError(payload: any, status: number): string {
  if (payload?.error && payload?.code) return `${payload.error} (${payload.code})`
  if (payload?.error) return String(payload.error)
  return `Request failed with HTTP ${status}`
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
  initialData = [],
}: DataTableProps<T>) {
  const [data, setData] = useState<T[]>(initialData)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const pageSize = 50
  const [meta, setMeta] = useState<PageMeta>({ total: 0, page: 1, pageSize, lastPage: 0 })

  const modelUrl = `/api/backend/api/${encodeURIComponent(modelName)}`
  const filterSignature = JSON.stringify(filters ?? {})
  const allowedFilterFields = ["id", ...columns.map((column) => column.name)].join(",")
  const searchableField =
    columns.find(
      (column) =>
        !column.hideInTable &&
        column.type !== "password" &&
        (column.type === undefined ||
          column.type === "text" ||
          column.type === "email" ||
          column.type === "select")
    )?.name ?? null

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearchTerm(searchQuery.trim())
      setPage(1)
    }, 250)
    return () => window.clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    setPage(1)
  }, [filterSignature, modelName])

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const allowed = new Set(allowedFilterFields.split(",").filter(Boolean))
      const activeFilters = JSON.parse(filterSignature) as Record<string, unknown>
      const domain: unknown[][] = []

      for (const [field, value] of Object.entries(activeFilters)) {
        if (value === undefined || value === null || value === "") continue
        if (!allowed.has(field)) {
          throw new Error(`Unsupported filter field: ${field}`)
        }
        domain.push([field, "=", value])
      }

      if (searchTerm) {
        if (!searchableField) {
          throw new Error("This table has no searchable text field")
        }
        domain.push([searchableField, "ilike", `%${searchTerm}%`])
      }

      const params = new URLSearchParams({
        page: String(page),
        limit: String(pageSize),
      })
      if (domain.length > 0) params.set("domain", JSON.stringify(domain))

      const response = await fetch(`${modelUrl}?${params.toString()}`, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      })
      const payload = await readJson(response)

      if (!response.ok) {
        throw new Error(apiError(payload, response.status))
      }
      if (!Array.isArray(payload?.data)) {
        throw new Error("Moon API returned an invalid collection response")
      }

      setData(payload.data as T[])
      const nextMeta = payload.meta
      setMeta({
        total: Number(nextMeta?.total ?? payload.data.length),
        page: Number(nextMeta?.page ?? page),
        pageSize: Number(nextMeta?.pageSize ?? pageSize),
        lastPage: Number(nextMeta?.lastPage ?? (payload.data.length > 0 ? 1 : 0)),
      })
    } catch (err: any) {
      setData([])
      setMeta({ total: 0, page, pageSize, lastPage: 0 })
      setError(err?.message || "Failed to load records")
    } finally {
      setLoading(false)
    }
  }, [allowedFilterFields, filterSignature, modelUrl, page, pageSize, searchTerm, searchableField])

  useEffect(() => {
    void fetchData()
  }, [fetchData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const column = columns.find((item) => item.name === e.target.name)
    let value: any = e.target.value
    if (column?.type === "number" && value !== "") value = Number(value)
    if (column?.type === "boolean") value = value === "true"
    setFormData((current) => ({ ...current, [e.target.name]: value }))
  }

  const getWritePayload = () => {
    const writable = new Set(columns.filter((column) => !column.hideInForm).map((column) => column.name))
    return Object.fromEntries(
      Object.entries(formData).filter(([field]) => writable.has(field))
    )
  }

  const handleSave = async (isEdit: boolean) => {
    if (isEdit && editingId === null) return

    setIsSubmitting(true)
    setError(null)
    try {
      const target = isEdit ? `${modelUrl}/${editingId}` : modelUrl
      const response = await fetch(target, {
        method: isEdit ? "PATCH" : "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(getWritePayload()),
      })
      const payload = await readJson(response)
      if (!response.ok) {
        throw new Error(apiError(payload, response.status))
      }

      setFormData({})
      setEditingId(null)
      setIsAddOpen(false)
      setIsEditOpen(false)
      await fetchData()
    } catch (err: any) {
      setError(err?.message || "Failed to save record")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return

    setError(null)
    try {
      const response = await fetch(`${modelUrl}/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      })
      const payload = await readJson(response)
      if (!response.ok) {
        throw new Error(apiError(payload, response.status))
      }
      await fetchData()
    } catch (err: any) {
      setError(err?.message || "Failed to delete record")
    }
  }

  return (
    <div className="space-y-6">
      {topWidgets && <div className="mb-6">{topWidgets}</div>}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className={`space-y-6 ${sideWidgets ? "lg:col-span-8" : "lg:col-span-12"}`}>
          <Card className="border-cyan-900/40 bg-black/60 shadow-xl backdrop-blur-md">
            <CardHeader className="border-b border-cyan-900/30 pb-4">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="flex items-center gap-3">
                  {icon && (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-950/40 text-cyan-400">
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
                    className="flex h-9 items-center gap-2 border border-cyan-500/50 bg-cyan-950/60 font-sans text-xs font-semibold text-cyan-300 hover:bg-cyan-900/60"
                  >
                    <Plus className="h-4 w-4" /> Add Record
                  </Button>
                </div>
              </div>

              {tabs && tabs.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2 border-t border-cyan-900/30 pt-3">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => onTabChange?.(tab.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                        activeTab === tab.id
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
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
                    className="h-9 border-cyan-900/50 bg-black/40 pl-9 font-sans text-xs text-white placeholder:text-slate-500 focus:border-cyan-500/50"
                  />
                </div>
                {filterWidgets && <div className="flex items-center gap-2">{filterWidgets}</div>}
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {error ? (
                <div role="alert" className="border-b border-rose-900/40 bg-rose-950/20 p-4 text-xs text-rose-300">
                  {error}
                </div>
              ) : null}

              {loading ? (
                <div className="flex items-center justify-center p-12 text-cyan-400">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : data.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-500">
                  {error ? "Records could not be loaded." : "No records found matching criteria."}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans text-slate-300">
                    <thead className="border-b border-cyan-900/30 bg-cyan-950/20 text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
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
                      {data.map((row: any) => (
                        <tr key={row.id} className="hover:bg-cyan-950/20 transition-colors">
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
                                onClick={() => {
                                  setEditingId(row.id)
                                  setFormData(
                                    Object.fromEntries(
                                      columns
                                        .filter((column) => !column.hideInForm)
                                        .map((column) => [column.name, row[column.name] ?? ""])
                                    )
                                  )
                                  setIsEditOpen(true)
                                }}
                                className="h-7 w-7 p-0 text-slate-400 hover:text-cyan-400"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => void handleDelete(row.id)}
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

              <div className="flex items-center justify-between border-t border-cyan-900/30 px-4 py-3 text-[11px] text-slate-400">
                <span>
                  {meta.total} records · page {meta.page} of {Math.max(meta.lastPage, 1)}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={loading || page <= 1}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={loading || meta.lastPage === 0 || page >= meta.lastPage}
                    onClick={() => setPage((current) => current + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {sideWidgets && <div className="space-y-6 lg:col-span-4">{sideWidgets}</div>}
      </div>

      <Dialog
        open={isAddOpen || isEditOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddOpen(false)
            setIsEditOpen(false)
            setEditingId(null)
          }
        }}
      >
        <DialogContent className="border-cyan-900/50 bg-[#05080E] text-white">
          <DialogHeader>
            <DialogTitle className="font-sans text-sm uppercase text-cyan-400 font-bold">
              {isEditOpen ? `Edit Record (#${editingId})` : "Add New Record"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Provide necessary parameters for the record below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {columns
              .filter((column) => !column.hideInForm)
              .map((column) => (
                <div key={column.name} className="space-y-1.5">
                  <Label className="text-xs text-slate-300">{column.label}</Label>
                  <Input
                    name={column.name}
                    type={
                      column.type === "select" || column.type === "boolean"
                        ? "text"
                        : column.type || "text"
                    }
                    value={formData[column.name] ?? ""}
                    onChange={handleInputChange}
                    placeholder={`Enter ${column.label}...`}
                    className="border-cyan-900/40 bg-black text-xs text-white"
                  />
                </div>
              ))}
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="ghost"
              onClick={() => {
                setIsAddOpen(false)
                setIsEditOpen(false)
                setEditingId(null)
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => void handleSave(isEditOpen)}
              disabled={isSubmitting}
              className="bg-cyan-600 text-white hover:bg-cyan-500 font-bold text-xs"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isEditOpen ? (
                "Save Changes"
              ) : (
                "Create Record"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export { DataTable as MoonDataTable }
