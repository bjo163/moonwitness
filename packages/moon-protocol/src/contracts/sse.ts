/**
 * ◈ MOONWITNESS PROTOCOL — SSE TOPIC CONTRACTS
 *
 * Typed payload schemas for Server-Sent Events topics.
 * Ensures both publish() and useRealtimeStream() are type-safe.
 */
import { z } from 'zod'

// ═══════════════════════════════════════════
// 📡 SSE TOPIC PAYLOAD SCHEMAS
// ═══════════════════════════════════════════

export const ChatGlobalPayloadSchema = z.object({
  text: z.string(),
  sender: z.string().optional(),
  timestamp: z.string().optional(),
})

export const SystemMetricPayloadSchema = z.object({
  name: z.string(),
  value: z.number(),
  unit: z.string().optional(),
  timestamp: z.string().optional(),
})

export const ModuleUpdatePayloadSchema = z.object({
  moduleId: z.string(),
  action: z.enum(['created', 'updated', 'deleted']),
  data: z.record(z.unknown()).optional(),
})

export const PrayerAlertPayloadSchema = z.object({
  name: z.string(),
  time: z.string(),
  location: z.string().optional(),
})

export const CrashReportPayloadSchema = z.object({
  error: z.string(),
  stack: z.string().optional(),
  userId: z.string().optional(),
  module: z.string().optional(),
  url: z.string().optional(),
  timestamp: z.string().optional(),
})

// ═══════════════════════════════════════════
// 📡 SSE TOPIC MAP (Single Source of Truth)
// ═══════════════════════════════════════════

/**
 * Master SSE Topic Map — defines every valid topic and its payload shape.
 *
 * Usage (backend):
 *   typedPublish('chat_global', { text: 'Hello' })
 *
 * Usage (frontend):
 *   const data = useTypedStream('chat_global')
 */
export const SSE_TOPIC_MAP = {
  chat_global: ChatGlobalPayloadSchema,
  system_metric: SystemMetricPayloadSchema,
  module_update: ModuleUpdatePayloadSchema,
  prayer_alert: PrayerAlertPayloadSchema,
  crash_report: CrashReportPayloadSchema,
} as const

export type SSETopicName = keyof typeof SSE_TOPIC_MAP

export type SSETopicPayload<K extends SSETopicName> = z.infer<(typeof SSE_TOPIC_MAP)[K]>

// ═══════════════════════════════════════════
// INFERRED TYPES
// ═══════════════════════════════════════════

export type ChatGlobalPayload = z.infer<typeof ChatGlobalPayloadSchema>
export type SystemMetricPayload = z.infer<typeof SystemMetricPayloadSchema>
export type ModuleUpdatePayload = z.infer<typeof ModuleUpdatePayloadSchema>
export type PrayerAlertPayload = z.infer<typeof PrayerAlertPayloadSchema>
export type CrashReportPayload = z.infer<typeof CrashReportPayloadSchema>
