"use client"

import React, { useState } from "react"
import { useMoonModel } from "@core/store/use-moon-model"
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
import { Loader2, Search, Plus, MoreHorizontal, Edit, Trash2 } from "lucide-react"

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
  tabs?: { id: string, label: string }[]
  activeTab?: string
  onTabChange?: (tabId: string) => void
  filterWidgets?: React.ReactNode
  customActions?: React.ReactNode
}

export function MoonDataTable({ 
  modelName, title, description, columns, icon,
  topWidgets, sideWidgets, tabs, activeTab, onTabChange, filterWidgets, customActions
}: MoonDataTableProps) {
  const { data, loading, error, create, update, remove } = useMoonModel(modelName)
  
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
  const filteredData = Array.isArray(data) ? data.filter((row: any) => {
    if (!searchQuery) return true
    const searchLower = searchQuery.toLowerCase()
    return columns.some(c => !c.hideInTable && String(row[c.name] || "").toLowerCase().includes(searchLower))
  }) : []

  return (
    <div className="flex flex-col gap-6">
      {/* Top Widgets Slot */}
      {topWidgets && (
        <div className="w-full">
          {topWidgets}
        </div>
      )}

      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {/* Main Content Area */}
        <div className={`flex flex-col gap-4 ${sideWidgets ? 'xl:w-3/4 w-full' : 'w-full'}`}>
          <div className="rounded-xl border border-cyan-900/30 bg-black/40 backdrop-blur-md shadow-[0_0_30px_rgba(34,211,238,0.03)] overflow-hidden flex flex-col">
            
            {/* Toolbar / Header */}
            <div className="p-4 border-b border-cyan-900/30 flex flex-col gap-4">
              {/* Tabs & Primary Actions */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                {tabs && tabs.length > 0 ? (
                  <div className="flex items-center gap-6 overflow-x-auto pb-1 md:pb-0 w-full md:w-auto scrollbar-hide">
                    {tabs.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => onTabChange && onTabChange(tab.id)}
                        className={`text-xs font-semibold tracking-wider uppercase transition-colors whitespace-nowrap pb-2 border-b-2 ${
                          activeTab === tab.id
                            ? "text-cyan-400 border-cyan-400"
                            : "text-slate-500 border-transparent hover:text-slate-300"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                      {icon}
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h2>
                      <p className="text-xs text-slate-400">{description}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  {customActions}
                  <Button 
                    onClick={() => { setFormData({}); setIsAddOpen(true) }}
                    className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold h-8 text-xs px-3 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    ADD RECORD
                  </Button>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col md:flex-row items-center gap-3 w-full">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2 h-4 w-4 text-slate-500" />
                  <Input 
                    placeholder="Search records..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-8 bg-black/50 border-cyan-900/50 text-xs text-slate-200 focus-visible:ring-cyan-500/50" 
                  />
                </div>
                
                <div className="flex-1 flex items-center gap-3 overflow-x-auto scrollbar-hide">
                  {filterWidgets}
                </div>
              </div>
            </div>

            {/* Table Area */}
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-cyan-900/30 bg-white/[0.02]">
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 w-12 text-center">
                      <input type="checkbox" className="rounded border-cyan-900/50 bg-black/50" />
                    </th>
                    {columns.filter(c => !c.hideInTable).map((col) => (
                      <th key={col.name} className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        {col.label}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading && Array.isArray(data) && data.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length + 2} className="px-4 py-12 text-center">
                        <Loader2 className="w-6 h-6 text-cyan-500 animate-spin mx-auto mb-2" />
                        <span className="text-xs text-slate-400 uppercase tracking-widest">Loading...</span>
                      </td>
                    </tr>
                  ) : !Array.isArray(data) || data.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length + 2} className="px-4 py-12 text-center text-slate-500 text-xs tracking-wider">
                        {error ? "Failed to load records." : "No records found."}
                      </td>
                    </tr>
                  ) : filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length + 2} className="px-4 py-12 text-center text-slate-500 text-xs tracking-wider">
                        No matches found.
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((row: any) => (
                      <tr key={row.id} className="border-b border-cyan-900/10 hover:bg-white/[0.02] transition-colors group">
                        <td className="px-4 py-3 text-center">
                          <input type="checkbox" className="rounded border-cyan-900/50 bg-black/50" />
                        </td>
                        {columns.filter(c => !c.hideInTable).map((col) => (
                          <td key={col.name} className="px-4 py-3 font-sans text-xs text-slate-300">
                            {col.render ? col.render(row[col.name], row) : (row[col.name] || "-")}
                          </td>
                        ))}
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEdit(row)} className="p-1.5 rounded bg-white/5 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 transition-colors">
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDelete(row.id)} className="p-1.5 rounded bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-400 transition-colors">
                              <MoreHorizontal className="w-3.5 h-3.5" />
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
            <div className="p-4 border-t border-cyan-900/30 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 tracking-wider">
                Showing {filteredData.length} records
              </span>
              <div className="flex items-center gap-1">
                {/* Pagination placeholder */}
                <button className="w-6 h-6 rounded flex items-center justify-center text-[10px] text-slate-500 hover:bg-white/5">&lt;</button>
                <button className="w-6 h-6 rounded flex items-center justify-center text-[10px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">1</button>
                <button className="w-6 h-6 rounded flex items-center justify-center text-[10px] text-slate-500 hover:bg-white/5">2</button>
                <button className="w-6 h-6 rounded flex items-center justify-center text-[10px] text-slate-500 hover:bg-white/5">&gt;</button>
              </div>
            </div>

          </div>
        </div>

        {/* Side Widgets Slot */}
        {sideWidgets && (
          <div className="w-full xl:w-1/4 flex flex-col gap-4">
            {sideWidgets}
          </div>
        )}
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="bg-slate-950 border-cyan-900/50">
          <DialogHeader>
            <DialogTitle className="text-cyan-400 uppercase tracking-wider text-sm font-bold">Add New {title}</DialogTitle>
            <DialogDescription className="text-xs">Create a new record in the system.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {columns.filter(c => !c.hideInForm).map(col => (
              <div key={col.name} className="flex flex-col gap-2">
                <Label htmlFor={col.name} className="text-xs text-slate-400">{col.label} {col.required && <span className="text-red-500">*</span>}</Label>
                <Input
                  id={col.name}
                  name={col.name}
                  type={col.type === "password" ? "password" : col.type === "email" ? "email" : "text"}
                  value={formData[col.name] || ""}
                  onChange={handleInputChange}
                  className="bg-black/50 border-cyan-900/50 text-slate-200 focus-visible:ring-cyan-500/50"
                  required={col.required}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsAddOpen(false)} className="text-xs h-8 text-slate-400 hover:text-slate-200">Cancel</Button>
            <Button onClick={() => handleSave(false)} disabled={isSubmitting} className="bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold h-8 px-6 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Record"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-slate-950 border-cyan-900/50">
          <DialogHeader>
            <DialogTitle className="text-cyan-400 uppercase tracking-wider text-sm font-bold">Edit {title}</DialogTitle>
            <DialogDescription className="text-xs">Update existing record details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {columns.filter(c => !c.hideInForm).map(col => (
              <div key={col.name} className="flex flex-col gap-2">
                <Label htmlFor={col.name} className="text-xs text-slate-400">{col.label} {col.required && <span className="text-red-500">*</span>}</Label>
                <Input
                  id={col.name}
                  name={col.name}
                  type={col.type === "password" ? "password" : col.type === "email" ? "email" : "text"}
                  value={formData[col.name] || ""}
                  onChange={handleInputChange}
                  className="bg-black/50 border-cyan-900/50 text-slate-200 focus-visible:ring-cyan-500/50"
                  required={col.required}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsEditOpen(false)} className="text-xs h-8 text-slate-400 hover:text-slate-200">Cancel</Button>
            <Button onClick={() => handleSave(true)} disabled={isSubmitting} className="bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold h-8 px-6 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Record"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
