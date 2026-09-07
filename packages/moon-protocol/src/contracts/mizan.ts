import { z } from 'zod'

export const MizanEvaluateRequestSchema = z.object({
  request_key: z.string().min(1),
  assessment_id: z.string().min(1),
  profile_code: z.string().min(1),
  profile_version: z.string().min(1),
  source_revision: z.string().min(1),
  lines: z.array(z.object({
    criterion_code: z.string().min(1),
    answer: z.enum(['unknown', 'pass', 'fail', 'not_applicable']),
    score: z.number().min(0).max(1).nullable(),
    score_available: z.boolean(),
    reason: z.string().min(1),
  })),
  general_sufficient: z.enum(['unknown', 'sufficient', 'insufficient']),
  balance_state: z.enum(['unknown', 'absent', 'present']),
  reference_weight: z.number().min(0).max(4),
})

export const MizanEvaluateResponseSchema = z.object({
  request_key: z.string(),
  state: z.enum(['queued', 'running', 'succeeded', 'failed', 'stale']),
  method: z.enum(['general', 'general_limited', 'prophetic']).nullable(),
  score_available: z.boolean(),
  total_weight: z.number().min(0).max(21).nullable(),
  score_max: z.number().min(0).max(21).nullable(),
  limitation: z.string().nullable(),
  engine_version: z.string(),
  contract_version: z.string(),
})

export type MizanEvaluateRequest = z.infer<typeof MizanEvaluateRequestSchema>
export type MizanEvaluateResponse = z.infer<typeof MizanEvaluateResponseSchema>
