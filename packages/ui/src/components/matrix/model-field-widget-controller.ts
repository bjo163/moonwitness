"use client"

import { useEffect, useState } from "react"
import type { FieldMeta } from "@workspace/types"
import { apiGet, apiPost } from "@moon/client"
import { APP_PORTS } from "@workspace/types"

export type ComodelOption = { id: number; name: string }

function getApiBase() {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL
  }
  return `http://127.0.0.1:${APP_PORTS.API_BACKEND}`
}

export function useModelFieldWidgetController(field: FieldMeta, onChange?: (value: any) => void) {
  const [comodelOptions, setComodelOptions] = useState<ComodelOption[]>([])
  const [comodelLoading, setComodelLoading] = useState(false)
  const [quickCreating, setQuickCreating] = useState(false)

  useEffect(() => {
    if (!((field.type === "many2one" || field.widget === "autocomplete") && field.comodel)) return

    setComodelLoading(true)
    apiGet<{ data: any[] }>(`${getApiBase()}/api/${field.comodel}?limit=50`)
      .then((res) => {
        const items = Array.isArray(res?.data) ? res.data : []
        setComodelOptions(
          items.map((record: any) => ({
            id: record.id,
            name: record.name || record.title || record.reference || record.code || `#${record.id}`,
          })),
        )
      })
      .catch(() => {})
      .finally(() => {
        setComodelLoading(false)
      })
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
        setComodelOptions((previous) => [newOption, ...previous])
        onChange?.(created.id)
      }
    } catch (error: any) {
      alert(`Failed to create option: ${error?.message || error}`)
    } finally {
      setQuickCreating(false)
    }
  }

  return { comodelOptions, comodelLoading, quickCreating, handleQuickCreate }
}
