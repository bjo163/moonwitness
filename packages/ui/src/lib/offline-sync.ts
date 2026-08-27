"use client"

import { useState, useEffect, useCallback } from "react"

export interface PendingMutation {
  id: string
  model: string
  operation: "create" | "update" | "delete"
  recordId?: string | number
  payload?: any
  timestamp: number
}

const STORAGE_KEY = "moonwitness_offline_queue_v1"

function getStoredQueue(): PendingMutation[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveQueue(queue: PendingMutation[]) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(queue))
  } catch {}
}

export const offlineQueue = {
  enqueue(mutation: Omit<PendingMutation, "id" | "timestamp">): PendingMutation {
    const queue = getStoredQueue()
    const item: PendingMutation = {
      ...mutation,
      id: `mut_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: Date.now(),
    }
    queue.push(item)
    saveQueue(queue)
    return item
  },

  getAll(): PendingMutation[] {
    return getStoredQueue()
  },

  remove(id: string) {
    const queue = getStoredQueue().filter((m) => m.id !== id)
    saveQueue(queue)
  },

  clear() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  },
}

export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [pendingCount, setPendingCount] = useState(0)

  const refreshCount = useCallback(() => {
    setPendingCount(offlineQueue.getAll().length)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return

    setIsOnline(navigator.onLine)
    refreshCount()

    const handleOnline = () => {
      setIsOnline(true)
      refreshCount()
    }

    const handleOffline = () => {
      setIsOnline(false)
      refreshCount()
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [refreshCount])

  return { isOnline, pendingCount, refreshCount }
}
