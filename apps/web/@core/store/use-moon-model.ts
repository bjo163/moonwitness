import { useState, useEffect, useCallback } from 'react'
import { useMoonStore } from './moon-store'

export function useMoonModel<T = any>(modelName: string) {
  const { client, request } = useMoonStore()
  
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetch = useCallback(async (params?: Record<string, any>) => {
    setLoading(true)
    try {
      // Use query builder logic directly
      const q = client.model<T>(modelName)
      
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          if (k === 'limit') q.limit(v)
          else if (k === 'page') q.page(v)
          else if (k === 'with') q.with(v)
          else q.where(k, v)
        }
      }
      
      const res = await q.fetch()
      console.log(`[useMoonModel] fetch ${modelName} raw response:`, res)
      
      const safeData = Array.isArray(res) 
        ? res 
        : ((res as any)?.data && Array.isArray((res as any).data)) 
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
  }, [client, modelName])

  const create = async (payload: Partial<T>) => {
    const res = await client.model(modelName).create(payload)
    await fetch() // Refresh data
    return res
  }

  const update = async (id: number, payload: Partial<T>) => {
    const res = await client.model(modelName).update(id, payload)
    await fetch() // Refresh data
    return res
  }

  const remove = async (id: number) => {
    const res = await client.model(modelName).delete(id)
    await fetch() // Refresh data
    return res
  }

  // Initial fetch on mount
  useEffect(() => {
    fetch()
  }, [fetch])

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
