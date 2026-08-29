"use client"

import React, { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import type { FieldMeta } from "@workspace/types"
import { apiGet, apiPost } from "@moon/client"
import { APP_PORTS } from "@workspace/types"

const getApiBase = () => {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL
  }
  return `http://127.0.0.1:${APP_PORTS.API_BACKEND}`
}

export interface CosmicFieldWidgetProps {
  field: FieldMeta
  value: any
  onChange?: (val: any) => void
  disabled?: boolean
}

export function CosmicFieldWidget({
  field,
  value,
  onChange,
  disabled = false,
}: CosmicFieldWidgetProps) {
  const [comodelOptions, setComodelOptions] = useState<{ id: number; name: string }[]>([])
  const [comodelLoading, setComodelLoading] = useState(false)
  const [quickCreating, setQuickCreating] = useState(false)

  // Fetch Comodel options if autocomplete/many2one
  const fetchComodelOptions = () => {
    if ((field.type === "many2one" || field.widget === "autocomplete") && field.comodel) {
      setComodelLoading(true)
      apiGet<{ data: any[] }>(`${getApiBase()}/api/${field.comodel}?limit=50`)
        .then((res) => {
          const items = Array.isArray(res?.data) ? res.data : []
          setComodelOptions(
            items.map((r: any) => ({
              id: r.id,
              name: r.name || r.title || r.reference || r.code || `#${r.id}`,
            }))
          )
        })
        .catch(() => {})
        .finally(() => {
          setComodelLoading(false)
        })
    }
  }

  useEffect(() => {
    fetchComodelOptions()
  }, [field.type, field.widget, field.comodel])

  const handleQuickCreate = async () => {
    if (!field.comodel) return
    const name = window.prompt(`Enter name for new ${field.label} (${field.comodel}):`)
    if (!name || !name.trim()) return

    setQuickCreating(true)
    try {
      const res = await apiPost<any>(`${getApiBase()}/api/${field.comodel}`, {
        name: name.trim(),
        title: name.trim(),
      })
      const created = res?.data || res
      if (created?.id) {
        const newOption = {
          id: created.id,
          name: created.name || created.title || name.trim(),
        }
        setComodelOptions((prev) => [newOption, ...prev])
        onChange?.(created.id)
      }
    } catch (e: any) {
      alert(`Failed to create option: ${e?.message || e}`)
    } finally {
      setQuickCreating(false)
    }
  }

  // Boolean Toggle
  if (field.type === "boolean" || field.widget === "toggle") {
    return (
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={Boolean(value)}
          disabled={disabled || field.readonly}
          onChange={(e) => onChange?.(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-10 h-5 bg-muted border border-border peer-checked:bg-primary/20 peer-checked:border-primary rounded-full transition-all relative">
          <div className={`w-3.5 h-3.5 rounded-full absolute top-0.5 left-0.5 transition-transform ${value ? "translate-x-5 bg-primary" : "bg-muted-foreground"}`} />
        </div>
        <span className="text-xs text-foreground font-medium">
          {value ? "Enabled" : "Disabled"}
        </span>
      </label>
    )
  }

  // Textarea
  if (field.type === "text" || field.widget === "textarea") {
    return (
      <textarea
        value={value ?? ""}
        disabled={disabled || field.readonly}
        placeholder={`Enter ${field.label.toLowerCase()}...`}
        onChange={(e) => onChange?.(e.target.value)}
        rows={4}
        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors resize-y font-sans"
      />
    )
  }

  // Selection Dropdown
  if (field.type === "selection" && field.selection) {
    return (
      <select
        value={value ?? ""}
        disabled={disabled || field.readonly}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none transition-colors font-sans"
      >
        <option value="" disabled>-- Select {field.label} --</option>
        {field.selection.map(([val, lbl]) => (
          <option key={val} value={val} className="bg-card text-foreground">
            {lbl}
          </option>
        ))}
      </select>
    )
  }

  // Many2one Comodel Autocomplete with Quick-Create [+]
  if (field.type === "many2one" && field.comodel) {
    const rawVal = typeof value === "object" && value !== null ? value.id : value
    return (
      <div className="flex gap-2">
        <select
          value={rawVal ?? ""}
          disabled={disabled || field.readonly || comodelLoading}
          onChange={(e) => {
            const num = Number(e.target.value)
            onChange?.(isNaN(num) || !e.target.value ? null : num)
          }}
          className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none transition-colors font-sans"
        >
          <option value="">{comodelLoading ? "Loading options..." : `-- Select ${field.label} (${field.comodel}) --`}</option>
          {comodelOptions.map((opt) => (
            <option key={opt.id} value={opt.id} className="bg-card text-foreground">
              {opt.name}
            </option>
          ))}
        </select>
        {!field.readonly && !disabled && (
          <button
            type="button"
            disabled={quickCreating}
            onClick={handleQuickCreate}
            title={`Create new ${field.label}`}
            className="px-2.5 py-2 bg-secondary border border-border rounded-lg text-foreground hover:bg-accent transition-all text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    )
  }

  // Date / DateTime
  if (field.type === "date" || field.type === "datetime" || field.widget === "datepicker") {
    const dateVal = value ? String(value).slice(0, field.type === "date" ? 10 : 16) : ""
    return (
      <input
        type={field.type === "date" ? "date" : "datetime-local"}
        value={dateVal}
        disabled={disabled || field.readonly}
        onChange={(e) => onChange?.(e.target.value || null)}
        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none transition-colors font-sans"
      />
    )
  }

  // Number / Float / Integer
  if (field.type === "integer" || field.type === "float" || field.widget === "number") {
    return (
      <input
        type="number"
        value={value ?? ""}
        step={field.type === "float" ? "0.01" : "1"}
        disabled={disabled || field.readonly}
        placeholder={`0`}
        onChange={(e) => onChange?.(e.target.value === "" ? null : Number(e.target.value))}
        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none transition-colors font-sans"
      />
    )
  }

  // Default: Text / Char Input
  return (
    <input
      type="text"
      value={value ?? ""}
      maxLength={field.size}
      disabled={disabled || field.readonly}
      placeholder={`Enter ${field.label.toLowerCase()}...`}
      onChange={(e) => onChange?.(e.target.value)}
      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors font-sans"
    />
  )
}
