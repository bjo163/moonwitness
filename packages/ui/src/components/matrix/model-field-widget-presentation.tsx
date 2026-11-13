"use client"

import React from "react"
import { Plus } from "lucide-react"
import type { FieldMeta } from "@workspace/types"

export type ModelFieldControlProps = {
  field: FieldMeta
  value: any
  onChange?: (value: any) => void
  disabled: boolean
}

function isDisabled(field: FieldMeta, disabled: boolean) {
  return disabled || field.readonly
}

export function ModelFieldBoolean({ field, value, onChange, disabled }: ModelFieldControlProps) {
  return (
    <label className="flex cursor-pointer select-none items-center gap-3">
      <input
        type="checkbox"
        checked={Boolean(value)}
        disabled={isDisabled(field, disabled)}
        onChange={(event) => onChange?.(event.target.checked)}
        className="peer sr-only"
      />
      <div className="relative h-5 w-10 rounded-full border border-border bg-muted transition-all peer-checked:border-primary peer-checked:bg-primary/20">
        <div
          className={`absolute top-0.5 left-0.5 h-3.5 w-3.5 rounded-full transition-transform ${
            value ? "translate-x-5 bg-primary" : "bg-muted-foreground"
          }`}
        />
      </div>
      <span className="text-xs font-medium text-foreground">{value ? "Enabled" : "Disabled"}</span>
    </label>
  )
}

export function ModelFieldTextarea({ field, value, onChange, disabled }: ModelFieldControlProps) {
  return (
    <textarea
      value={value ?? ""}
      disabled={isDisabled(field, disabled)}
      placeholder={`Enter ${field.label.toLowerCase()}...`}
      onChange={(event) => onChange?.(event.target.value)}
      rows={4}
      className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2 font-sans text-xs text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none"
    />
  )
}

export function ModelFieldSelection({ field, value, onChange, disabled }: ModelFieldControlProps) {
  return (
    <select
      value={value ?? ""}
      disabled={isDisabled(field, disabled)}
      onChange={(event) => onChange?.(event.target.value)}
      className="w-full rounded-lg border border-border bg-background px-3 py-2 font-sans text-xs text-foreground transition-colors focus:border-primary focus:outline-none"
    >
      <option value="" disabled>
        -- Select {field.label} --
      </option>
      {field.selection?.map(([valueKey, label]) => (
        <option key={valueKey} value={valueKey} className="bg-card text-foreground">
          {label}
        </option>
      ))}
    </select>
  )
}

type ModelFieldMany2OneProps = ModelFieldControlProps & {
  options: { id: number; name: string }[]
  loading: boolean
  quickCreating: boolean
  onQuickCreate: () => void
}

export function ModelFieldMany2One({
  field,
  value,
  onChange,
  disabled,
  options,
  loading,
  quickCreating,
  onQuickCreate,
}: ModelFieldMany2OneProps) {
  const rawValue = typeof value === "object" && value !== null ? value.id : value

  return (
    <div className="flex gap-2">
      <select
        value={rawValue ?? ""}
        disabled={isDisabled(field, disabled) || loading}
        onChange={(event) => {
          const numberValue = Number(event.target.value)
          onChange?.(Number.isNaN(numberValue) || !event.target.value ? null : numberValue)
        }}
        className="flex-1 rounded-lg border border-border bg-background px-3 py-2 font-sans text-xs text-foreground transition-colors focus:border-primary focus:outline-none"
      >
        <option value="">
          {loading ? "Loading options..." : `-- Select ${field.label} (${field.comodel}) --`}
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.id} className="bg-card text-foreground">
            {option.name}
          </option>
        ))}
      </select>
      {!field.readonly && !disabled && (
        <button
          type="button"
          disabled={quickCreating}
          onClick={onQuickCreate}
          title={`Create new ${field.label}`}
          aria-label={`Create new ${field.label}`}
          className="rounded-lg border border-border bg-secondary px-2.5 py-2 text-xs text-foreground transition-all hover:bg-accent"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}

export function ModelFieldDate({ field, value, onChange, disabled }: ModelFieldControlProps) {
  const dateValue = value ? String(value).slice(0, field.type === "date" ? 10 : 16) : ""
  return (
    <input
      type={field.type === "date" ? "date" : "datetime-local"}
      value={dateValue}
      disabled={isDisabled(field, disabled)}
      onChange={(event) => onChange?.(event.target.value || null)}
      className="w-full rounded-lg border border-border bg-background px-3 py-2 font-sans text-xs text-foreground transition-colors focus:border-primary focus:outline-none"
    />
  )
}

export function ModelFieldNumber({ field, value, onChange, disabled }: ModelFieldControlProps) {
  return (
    <input
      type="number"
      value={value ?? ""}
      step={field.type === "float" ? "0.01" : "1"}
      disabled={isDisabled(field, disabled)}
      placeholder="0"
      onChange={(event) => onChange?.(event.target.value === "" ? null : Number(event.target.value))}
      className="w-full rounded-lg border border-border bg-background px-3 py-2 font-sans text-xs text-foreground transition-colors focus:border-primary focus:outline-none"
    />
  )
}

export function ModelFieldText({ field, value, onChange, disabled }: ModelFieldControlProps) {
  return (
    <input
      type="text"
      value={value ?? ""}
      maxLength={field.size}
      disabled={isDisabled(field, disabled)}
      placeholder={`Enter ${field.label.toLowerCase()}...`}
      onChange={(event) => onChange?.(event.target.value)}
      className="w-full rounded-lg border border-border bg-background px-3 py-2 font-sans text-xs text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none"
    />
  )
}
