"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { safeGetStorage, safeSetStorage } from "./use-local-storage"

export interface UseResourceOptions<T> {
  /** Optional initial data before fetch completes */
  initialData?: T | null
  /** Auto-fetch on mount. Defaults to true */
  autoFetch?: boolean
  /** Dependencies that trigger a refetch when changed */
  deps?: any[]
  /** Polling interval in ms. Set to 0 or omit to disable polling */
  pollIntervalMs?: number
  /** Optional localStorage key for persistent offline fallback */
  storageKey?: string
  /** Callback fired on successful fetch */
  onSuccess?: (data: T) => void
  /** Callback fired on error */
  onError?: (error: Error) => void
}

export interface UseResourceReturn<T> {
  data: T | null
  loading: boolean
  isRefetching: boolean
  error: Error | null
  refetch: () => Promise<T | null>
  mutate: (newData: T | ((prev: T | null) => T), persist?: boolean) => void
}

/**
 * ◈ ENTERPRISE RESOURCE HOOK
 *
 * SWR-like lightweight resource fetcher with optional localStorage caching,
 * background polling, manual mutation, and error boundaries.
 */
export function useResource<T>(
  fetcher: () => Promise<T>,
  options: UseResourceOptions<T> = {}
): UseResourceReturn<T> {
  const {
    initialData = null,
    autoFetch = true,
    deps = [],
    pollIntervalMs = 0,
    storageKey,
    onSuccess,
    onError,
  } = options

  const [data, setData] = useState<T | null>(() => {
    if (initialData !== null) return initialData
    if (storageKey) {
      try {
        const saved = safeGetStorage(storageKey)
        if (saved) return JSON.parse(saved) as T
      } catch (e) {
        console.warn(`[useResource] Failed to read from storage[${storageKey}]:`, e)
      }
    }
    return null
  })

  const [loading, setLoading] = useState<boolean>(autoFetch && data === null)
  const [isRefetching, setIsRefetching] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const executeFetch = useCallback(
    async (isBackground = false): Promise<T | null> => {
      if (isBackground) {
        setIsRefetching(true)
      } else {
        setLoading(true)
      }
      setError(null)

      try {
        const result = await fetcherRef.current()
        setData(result)

        if (storageKey) {
          try {
            safeSetStorage(storageKey, JSON.stringify(result))
          } catch (e) {
            console.warn(`[useResource] Failed to save to storage[${storageKey}]:`, e)
          }
        }

        onSuccess?.(result)
        return result
      } catch (err: any) {
        const errorObj = err instanceof Error ? err : new Error(String(err))
        setError(errorObj)
        onError?.(errorObj)
        return null
      } finally {
        setLoading(false)
        setIsRefetching(false)
      }
    },
    [storageKey, onSuccess, onError]
  )

  useEffect(() => {
    if (autoFetch) {
      executeFetch(data !== null)
    }
  }, [autoFetch, executeFetch, ...deps])

  // Polling setup
  useEffect(() => {
    if (!pollIntervalMs || pollIntervalMs <= 0) return

    const timer = setInterval(() => {
      executeFetch(true)
    }, pollIntervalMs)

    return () => clearInterval(timer)
  }, [pollIntervalMs, executeFetch])

  const mutate = useCallback(
    (newData: T | ((prev: T | null) => T), shouldPersist = true) => {
      setData((prev) => {
        const next = typeof newData === "function" ? (newData as (prev: T | null) => T)(prev) : newData
        if (shouldPersist && storageKey) {
          try {
            safeSetStorage(storageKey, JSON.stringify(next))
          } catch (e) {
            console.warn(`[useResource] Failed to persist mutation to storage[${storageKey}]:`, e)
          }
        }
        return next
      })
    },
    [storageKey]
  )

  return {
    data,
    loading,
    isRefetching,
    error,
    refetch: () => executeFetch(data !== null),
    mutate,
  }
}
