/**
 * ◈ MOONWITNESS — STANDARD API ENVELOPES
 *
 * Unified response shapes for ALL API endpoints.
 * Every Moon API response MUST conform to one of these envelopes.
 */
import { z } from 'zod'

// ── SUCCESS ENVELOPE ──────────────────────────────────────────
export const PaginationMetaSchema = z.object({
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  lastPage: z.number(),
})

export type PaginationMeta = z.infer<typeof PaginationMetaSchema>

/**
 * Standard success response wrapper.
 * Use for single-object responses.
 */
export function moonResponse<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    data: dataSchema,
  })
}

/**
 * Paginated list response wrapper.
 * Use for list endpoints with pagination.
 */
export function paginatedResponse<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    data: z.array(itemSchema),
    meta: PaginationMetaSchema,
  })
}

// ── ERROR ENVELOPE ────────────────────────────────────────────
export const MoonErrorSchema = z.object({
  error: z.string(),
  code: z.string().optional(),
  details: z.unknown().optional(),
})

export type MoonError = z.infer<typeof MoonErrorSchema>

// ── COMMON FIELD SCHEMAS ──────────────────────────────────────
/** Reusable ID field (integer) */
export const IdSchema = z.number().int().positive()

/** Reusable ISO datetime string */
export const DateTimeSchema = z.string().datetime().or(z.string())

/** Reusable slug field */
export const SlugSchema = z.string().regex(/^[a-z0-9-]+$/).max(80)

// ── ENDPOINT DEFINITION CONTRACT ──────────────────────────────
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export interface EndpointDef<
  TQuery extends z.ZodTypeAny = z.ZodTypeAny,
  TBody extends z.ZodTypeAny = z.ZodTypeAny,
  TResponse extends z.ZodTypeAny = z.ZodTypeAny,
> {
  method: HttpMethod
  path: string
  description?: string
  auth?: 'none' | 'user' | 'admin'
  query?: TQuery
  body?: TBody
  response: TResponse
}
