/**
 * ◈ MOONWITNESS PROTOCOL — SYSTEM API CONTRACTS
 *
 * Zod schemas for health, metrics, DB status, and meta endpoints.
 */
import { z } from 'zod'

export const HealthResponseSchema = z.object({
  status: z.enum(['ok', 'degraded', 'down']),
  uptime: z.number().optional(),
  version: z.string().optional(),
})

export const DbStatusResponseSchema = z.object({
  connected: z.boolean(),
  version: z.string().optional(),
  tables: z.number().optional(),
})

export const ModelMetaSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  fieldCount: z.number().optional(),
  isPublic: z.boolean().optional(),
})

export const MetaModelsResponseSchema = z.object({
  models: z.array(ModelMetaSchema),
})

export const PerformanceStatsSchema = z.object({
  requests: z.array(z.record(z.unknown())),
  cache: z.array(z.record(z.unknown())),
  slowQueries: z.array(z.record(z.unknown())),
  system: z.record(z.unknown()).nullable(),
  summary: z.object({
    totalRequests: z.number(),
    avgLatency: z.number(),
    cacheHitRate: z.number(),
    slowQueryCount: z.number(),
  }),
})

export const MizanDecisionSchema = z.object({
  decision: z.object({
    method: z.string(),
    confidence: z.number().optional(),
    reasoning: z.string().optional(),
  }),
})

export const MizanSummarySchema = z.object({
  total: z.number(),
  assessed: z.number(),
  needsReference: z.number(),
})

export const DashboardDataSchema = z.object({
  missionStatus: z.record(z.unknown()).nullable(),
  todayMission: z.array(z.record(z.unknown())).nullable(),
  todayPrayer: z.array(z.record(z.unknown())).nullable(),
  aiBriefing: z.array(z.record(z.unknown())).nullable(),
  knowledgeFeed: z.array(z.record(z.unknown())).nullable(),
  activeProjects: z.array(z.record(z.unknown())).nullable(),
  tasksOverview: z.record(z.unknown()).nullable(),
  moonObservatory: z.record(z.unknown()).nullable(),
  globalMonitoring: z.array(z.record(z.unknown())).nullable(),
})

export const DashboardResponseSchema = z.object({
  success: z.boolean(),
  status: z.enum(['success', 'partial', 'unavailable']),
  generatedAt: z.string().datetime().optional(),
  sources: z.record(z.enum(['success', 'unavailable', 'not_configured'])).optional(),
  data: DashboardDataSchema,
})

// ═══════════════════════════════════════════
// INFERRED TYPES
// ═══════════════════════════════════════════

export type HealthResponse = z.infer<typeof HealthResponseSchema>
export type DbStatusResponse = z.infer<typeof DbStatusResponseSchema>
export type ModelMeta = z.infer<typeof ModelMetaSchema>
export type PerformanceStats = z.infer<typeof PerformanceStatsSchema>
export type MizanDecision = z.infer<typeof MizanDecisionSchema>
export type MizanSummary = z.infer<typeof MizanSummarySchema>
export type DashboardData = z.infer<typeof DashboardDataSchema>
export type DashboardResponse = z.infer<typeof DashboardResponseSchema>
