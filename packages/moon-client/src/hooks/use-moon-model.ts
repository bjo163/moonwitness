"use client"

import { useState, useEffect, useCallback } from "react"
import { apiGet, apiPost, apiPut, apiDelete } from "../api-client"

export function useMoonModel<T = any>(
  modelName: string,
  initialParams?: Record<string, any>
) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const basePath = `/api/models/${modelName}`

  const fetch = useCallback(
    async (params?: Record<string, any>) => {
      setLoading(true)
      try {
        const queryParams = new URLSearchParams()
        if (params) {
          for (const [k, v] of Object.entries(params)) {
            if (v !== undefined && v !== null) {
              queryParams.append(k, String(v))
            }
          }
        }
        const qs = queryParams.toString()
        const url = qs ? `${basePath}?${qs}` : basePath
        const res = await apiGet(url).catch(() => [])

        const safeData = Array.isArray(res)
          ? res
          : (res as any)?.data && Array.isArray((res as any).data)
            ? (res as any).data
            : []
        setData(safeData)
        setError(null)
        return safeData
      } catch (err: any) {
        console.error(`[useMoonModel] fetch ${modelName} error:`, err)
        setError(err)
        setData([])
        return []
      } finally {
        setLoading(false)
      }
    },
    [basePath, modelName]
  )

  const create = async (payload: Partial<T>) => {
    const res = await apiPost(basePath, payload)
    await fetch(initialParams)
    return res
  }

  const update = async (id: number | string, payload: Partial<T>) => {
    const res = await apiPut(`${basePath}/${id}`, payload)
    await fetch(initialParams)
    return res
  }

  const remove = async (id: number | string) => {
    const res = await apiDelete(`${basePath}/${id}`)
    await fetch(initialParams)
    return res
  }

  useEffect(() => {
    fetch(initialParams)
  }, [fetch, initialParams])

  return {
    data,
    loading,
    error,
    fetch,
    create,
    update,
    remove,
  }
}
