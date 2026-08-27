/**
 * ◈ MOONWITNESS PROTOCOL — CAB (Change Advisory Board) CONTRACTS
 *
 * Zod schemas for all /api/cab/* endpoints.
 */
import { z } from 'zod'

export const CabProjectSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: z.string().optional(),
  priority: z.string().optional(),
  updatedAt: z.string().optional(),
})

export const CabTaskSchema = z.object({
  id: z.number(),
  title: z.string(),
  status: z.string().optional(),
  dueDate: z.string().optional(),
  assignee: z.string().optional(),
  priority: z.string().optional(),
})

export const CabChangeSchema = z.object({
  id: z.number(),
  title: z.string(),
  status: z.string().optional(),
  scheduledFor: z.string().optional(),
  riskLevel: z.string().optional(),
  submittedBy: z.string().optional(),
})

export const CabMeetingSchema = z.object({
  id: z.number(),
  title: z.string().optional(),
  status: z.string(),
  scheduledFor: z.string().optional(),
})

export const CabMetricsSchema = z.object({
  submitted: z.number(),
  approved: z.number(),
  blocked: z.number(),
})

export const CabSummaryResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    projects: z.array(CabProjectSchema),
    tasks: z.array(CabTaskSchema),
    changes: z.array(CabChangeSchema),
    meetings: z.array(CabMeetingSchema),
    metrics: CabMetricsSchema,
  }),
})

// ═══════════════════════════════════════════
// INFERRED TYPES
// ═══════════════════════════════════════════

export type CabProject = z.infer<typeof CabProjectSchema>
export type CabTask = z.infer<typeof CabTaskSchema>
export type CabChange = z.infer<typeof CabChangeSchema>
export type CabMeeting = z.infer<typeof CabMeetingSchema>
export type CabMetrics = z.infer<typeof CabMetricsSchema>
export type CabSummaryResponse = z.infer<typeof CabSummaryResponseSchema>
