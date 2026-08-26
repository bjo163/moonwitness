"use client"

import { useState, useEffect, useRef } from "react"
import type { TelemetryMetric, SystemStatus } from "@workspace/types"

export interface RealtimeTelemetryPacket {
  channel: string
  timestamp: string
  payload: any
  status: "NORMAL" | "WARNING" | "CRITICAL"
}

export interface UseRealtimeStreamOptions<T> {
  endpoint?: string
  initialData?: T
  onMessage?: (packet: RealtimeTelemetryPacket) => void
  onError?: (err: Event) => void
}

/**
 * Universal React Hook for resilient Server-Sent Events (SSE) telemetry
 */
export function useRealtimeStream<T = any>(
  channel: string,
  options: UseRealtimeStreamOptions<T> = {}
) {
  const {
    endpoint = "/api/intel/briefing",
    initialData,
    onMessage,
    onError,
  } = options

  const [data, setData] = useState<T | undefined>(initialData)
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [errorCount, setErrorCount] = useState(0)

  const eventSourceRef = useRef<EventSource | null>(null)
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    let isMounted = true

    function connect() {
      try {
        const url = `${endpoint}?channel=${encodeURIComponent(channel)}`
        const es = new EventSource(url)
        eventSourceRef.current = es

        es.onopen = () => {
          if (!isMounted) return
          setIsConnected(true)
          setErrorCount(0)
        }

        es.onmessage = (event) => {
          if (!isMounted) return
          try {
            const parsed: RealtimeTelemetryPacket = JSON.parse(event.data)
            setData(parsed.payload)
            setLastUpdated(parsed.timestamp || new Date().toISOString())
            if (onMessage) onMessage(parsed)
          } catch {
            // Handle plain string messages
            setData(event.data as any)
            setLastUpdated(new Date().toISOString())
          }
        }

        es.onerror = (err) => {
          if (!isMounted) return
          setIsConnected(false)
          setErrorCount((prev) => prev + 1)
          if (onError) onError(err)

          es.close()

          // Exponential backoff reconnect
          const backoff = Math.min(30000, 2000 * Math.pow(1.5, errorCount))
          retryTimeoutRef.current = setTimeout(connect, backoff)
        }
      } catch (err) {
        setIsConnected(false)
      }
    }

    connect()

    return () => {
      isMounted = false
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
    }
  }, [channel, endpoint, errorCount, onMessage, onError])

  return {
    data,
    isConnected,
    lastUpdated,
    errorCount,
  }
}