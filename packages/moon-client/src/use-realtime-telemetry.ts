"use client"

import { useRealtimeStream } from "./realtime-stream"
import type { SSETopicName, SSETopicPayload } from "@moon/protocol"

export interface UseRealtimeTelemetryOptions<K extends SSETopicName> {
  initialData?: SSETopicPayload<K>
  onMessage?: (payload: SSETopicPayload<K>) => void
  onError?: (err: Event) => void
}

/**
 * ◈ useRealtimeTelemetry — Strongly-Typed Reactive SSE Hook
 *
 * Subscribes to backend Server-Sent Event channels mapped to @moon/protocol topics.
 * Returns strictly-typed telemetry payload matching the topic's Zod schema.
 */
export function useRealtimeTelemetry<K extends SSETopicName>(
  topic: K,
  options: UseRealtimeTelemetryOptions<K> = {}
) {
  const { initialData, onMessage, onError } = options

  return useRealtimeStream<SSETopicPayload<K>>(topic, {
    endpoint: "/api/intel/briefing",
    initialData,
    onMessage: onMessage ? (packet) => onMessage(packet.payload) : undefined,
    onError,
  })
}
