"use client"

import { useState, useEffect, useCallback } from "react"
import { APP_PORTS } from "@workspace/types"
import type { ModelSchema, ViewManifest, FieldMeta } from "@workspace/types"

const getApiBase = () => {
  if (typeof window !== "undefined" && (window as any).NEXT_PUBLIC_API_URL) {
    return (window as any).NEXT_PUBLIC_API_URL
  }
  return `http://127.0.0.1:${APP_PORTS.API_BACKEND}`
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers)
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json")
  if (typeof window !== "undefined") {
    try {
      const token = localStorage.getItem("mw_session_token")
      if (token && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`)
      }
    } catch {}
  }
  const res = await fetch(url, { ...init, headers, credentials: "include" })
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(errBody.error || `HTTP ${res.status}: ${res.statusText}`)
  }
  return res.json()
}

/** In-memory cache for fetched model schemas */
const schemaCache = new Map<string, ModelSchema>()

/**
 * ◈ useModelSchema — Reactive Model Schema Introspection Hook
 *
 * Fetches the rich field definitions, widget hints, constraints,
 * and view manifest for any registered Vertex model.
 */
export function useModelSchema(model: string) {
  const [schema, setSchema] = useState<ModelSchema | null>(() => schemaCache.get(model) || null)
  const [loading, setLoading] = useState(!schemaCache.has(model))
  const [error, setError] = useState<Error | null>(null)

  const fetchSchema = useCallback(async () => {
    if (!model) return
    if (schemaCache.has(model)) {
      setSchema(schemaCache.get(model)!)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const url = `${getApiBase()}/api/meta/model/${encodeURIComponent(model)}`
      const data = await fetchJson<ModelSchema>(url)
      schemaCache.set(model, data)
      setSchema(data)
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setLoading(false)
    }
  }, [model])

  useEffect(() => {
    fetchSchema()
  }, [fetchSchema])

  return { schema, loading, error, refetch: fetchSchema }
}

export interface UseModelRecordsOptions {
  page?: number
  limit?: number
  order?: string
  domain?: unknown[]
  withRelations?: string[]
  searchQuery?: string
  searchFields?: string[]
  autoFetch?: boolean
}

export interface UseModelRecordsReturn {
  records: any[]
  total: number
  page: number
  limit: number
  totalPages: number
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
  createRecord: (vals: Record<string, unknown>) => Promise<any>
  updateRecord: (id: number, vals: Record<string, unknown>) => Promise<any>
  deleteRecord: (id: number) => Promise<boolean>
}

/**
 * ◈ useModelRecords — Universal CRUD Data Hook for the celestial Matrix Engine
 */
export function useModelRecords(
  model: string,
  options: UseModelRecordsOptions = {}
): UseModelRecordsReturn {
  const {
    page = 1,
    limit = 50,
    order,
    domain,
    withRelations,
    searchQuery,
    searchFields,
    autoFetch = true,
  } = options

  const [records, setRecords] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(autoFetch)
  const [error, setError] = useState<Error | null>(null)

  const fetchRecords = useCallback(async () => {
    if (!model) return
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      params.set("page", String(page))
      params.set("limit", String(limit))
      if (order) params.set("order", order)
      if (domain && domain.length > 0) params.set("domain", JSON.stringify(domain))
      if (withRelations && withRelations.length > 0) params.set("with", withRelations.join(","))

      const url = `${getApiBase()}/api/${encodeURIComponent(model)}?${params.toString()}`
      const response = await fetchJson<any>(url)

      if (response && response.data) {
        let rows = Array.isArray(response.data) ? response.data : [response.data]

        // Client-side search refinement if searchQuery is provided
        if (searchQuery && searchQuery.trim() && searchFields && searchFields.length > 0) {
          const q = searchQuery.toLowerCase().trim()
          rows = rows.filter((row: any) =>
            searchFields.some((f) => {
              const val = row[f]
              return val !== undefined && val !== null && String(val).toLowerCase().includes(q)
            })
          )
        }

        setRecords(rows)
        setTotal(response.total ?? rows.length)
        setTotalPages(response.totalPages ?? Math.ceil((response.total ?? rows.length) / limit))
      } else {
        setRecords([])
        setTotal(0)
      }
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)))
      setRecords([])
    } finally {
      setLoading(false)
    }
  }, [model, page, limit, order, JSON.stringify(domain), withRelations?.join(","), searchQuery, searchFields?.join(",")])

  useEffect(() => {
    if (autoFetch) {
      fetchRecords()
    }
  }, [fetchRecords, autoFetch])

  const createRecord = useCallback(
    async (vals: Record<string, unknown>) => {
      const url = `${getApiBase()}/api/${encodeURIComponent(model)}`
      const res = await fetchJson<any>(url, {
        method: "POST",
        body: JSON.stringify(vals),
      })
      await fetchRecords()
      return res?.data || res
    },
    [model, fetchRecords]
  )

  const updateRecord = useCallback(
    async (id: number, vals: Record<string, unknown>) => {
      const url = `${getApiBase()}/api/${encodeURIComponent(model)}/${id}`
      const res = await fetchJson<any>(url, {
        method: "PUT",
        body: JSON.stringify(vals),
      })
      await fetchRecords()
      return res?.data || res
    },
    [model, fetchRecords]
  )

  const deleteRecord = useCallback(
    async (id: number) => {
      const url = `${getApiBase()}/api/${encodeURIComponent(model)}/${id}`
      await fetchJson(url, { method: "DELETE" })
      await fetchRecords()
      return true
    },
    [model, fetchRecords]
  )

  return {
    records,
    total,
    page,
    limit,
    totalPages,
    loading,
    error,
    refetch: fetchRecords,
    createRecord,
    updateRecord,
    deleteRecord,
  }
}
