"use client"

import { useRealtimeStream } from "./realtime-stream"
import type { SSETopicName, SSETopicPayload } from "@moon/protocol"

export interface UseCosmicTelemetryOptions<K extends SSETopicName> {
  initialData?: SSETopicPayload<K>
  onMessage?: (payload: SSETopicPayload<K>) => void
  onError?: (err: Event) => void
}

/**
 * ◈ useCosmicTelemetry — Strongly-Typed Reactive SSE Hook
 *
 * Subscribes to backend Server-Sent Event channels mapped to @moon/protocol topics.
 * Returns strictly-typed telemetry payload matching the topic's Zod schema.
 */
export function useCosmicTelemetry<K extends SSETopicName>(
  topic: K,
  options: UseCosmicTelemetryOptions<K> = {}
) {
  const { initialData, onMessage, onError } = options

  return useRealtimeStream<SSETopicPayload<K>>(topic, {
    endpoint: "/api/intel/briefing",
    initialData,
    onMessage: onMessage ? (packet) => onMessage(packet.payload) : undefined,
    onError,
  })
}
