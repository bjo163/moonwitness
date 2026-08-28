/**
 * ◈ MOONWITNESS PROTOCOL — CANONICAL REST WIRE CONTRACT
 *
 * Single source of truth for the generic model REST surface
 * (`/api/{model}` and `/api/{model}/{id}`). Owns normative wire
 * grammar: pagination/resource bounds, order/domain/filter syntax,
 * relation-expansion syntax, and the envelope used by every operation.
 *
 * `@moon/server` MUST consume these schemas (not recreate them) so the
 * runtime contract and the OpenAPI document cannot drift.
 */
import { z } from 'zod'
import {
  EndpointDef,
  MoonErrorSchema,
  paginatedResponse,
  moonResponse,
} from '../envelopes.ts'

// ── NORMATIVE BOUNDS (mirrored by handleRest at runtime) ───────────
export const MAX_LIMIT = 100
export const DEFAULT_LIMIT = 80
export const MAX_RELATIONS = 5

export const RESERVED_REST_PARAMS = [
  'page',
  'limit',
  'with',
  'order',
  'sort',
  'domain',
] as const

/** Order/domain grammar accepted by the runtime query engine. */
export const ORDER_REGEX =
  /^[a-zA-Z0-9_]+(\s+(asc|desc|ASC|DESC))?(\s*,\s*[a-zA-Z0-9_]+(\s+(asc|desc|ASC|DESC))?)*$/
export const DOMAIN_OPERATORS = [
  '=',
  '!=',
  '>',
  '>=',
  '<',
  '<=',
  'in',
  'not in',
  'like',
  'ilike',
] as const

export const DOMAIN_OPERATOR_SET = new Set<string>(DOMAIN_OPERATORS)

// ── QUERY CONTRACT ────────────────────────────────────────────────
/**
 * Reserved list controls. Dynamic per-model field filters (any other
 * query key) are validated against the model at runtime, not here.
 */
export const RestListQuerySchema = z.object({
  page: z
    .number()
    .int()
    .positive()
    .describe('1-based page index (positive integer).'),
  limit: z
    .number()
    .int()
    .min(1)
    .max(MAX_LIMIT)
    .describe(`Page size, 1–${MAX_LIMIT}.`),
  with: z
    .string()
    .max(200)
    .describe(
      `Comma-separated relation fields to expand (max ${MAX_RELATIONS}, no nesting).`
    ),
  order: z
    .string()
    .regex(ORDER_REGEX)
    .describe('Comma-separated "field [asc|desc]" ordering.'),
  sort: z
    .string()
    .regex(ORDER_REGEX)
    .describe('Alias of "order".'),
  domain: z
    .string()
    .describe(
      'JSON array of [field, operator, value] clauses. Operators: ' +
        DOMAIN_OPERATORS.join(', ') +
        '.'
    ),
})

export type RestListQuery = z.infer<typeof RestListQuerySchema>

// ── ERROR ENVELOPE ────────────────────────────────────────────────
export const RestErrorSchema = MoonErrorSchema
export type RestError = z.infer<typeof RestErrorSchema>

// ── RECORD BODY CONTRACT ──────────────────────────────────────────
/** Write body is a bag of model fields; validated per-model at runtime. */
export const RestWriteBodySchema = z.record(z.string(), z.unknown())

// ── GENERIC RECORD SCHEMA (runtime records are open objects) ──────
export const RestRecordSchema = z.record(z.string(), z.unknown())

// ── MODEL-PARAMETERIZED ENDPOINT BUILDERS ────────────────────────
export function restListEndpoint(model: string): EndpointDef {
  return {
    method: 'GET',
    path: `/api/${model}`,
    description:
      `List ${model} records. Supports pagination (page/limit), ordering ` +
      `(order/sort), domain filtering (domain JSON), relation expansion ` +
      `(with), and arbitrary per-model field equality filters as additional ` +
      `query parameters.`,
    auth: 'none',
    query: RestListQuerySchema,
    response: paginatedResponse(RestRecordSchema),
  }
}

export function restCreateEndpoint(model: string): EndpointDef {
  return {
    method: 'POST',
    path: `/api/${model}`,
    description: `Create a ${model} record. Body is a non-empty object of model fields.`,
    auth: 'none',
    body: RestWriteBodySchema,
    response: moonResponse(RestRecordSchema),
    successStatus: 201,
  }
}

export function restGetEndpoint(model: string): EndpointDef {
  return {
    method: 'GET',
    path: `/api/${model}/{id}`,
    description: `Get a single ${model} record by id. Supports relation expansion (with).`,
    auth: 'none',
    params: z.object({ id: z.number().int().positive() }),
    response: moonResponse(RestRecordSchema),
  }
}

export function restUpdateEndpoint(model: string): EndpointDef {
  return {
    method: 'PUT',
    path: `/api/${model}/{id}`,
    description: `Update a ${model} record. PATCH is accepted with the same body contract.`,
    auth: 'none',
    params: z.object({ id: z.number().int().positive() }),
    body: RestWriteBodySchema,
    response: moonResponse(RestRecordSchema),
  }
}

export function restDeleteEndpoint(model: string): EndpointDef {
  return {
    method: 'DELETE',
    path: `/api/${model}/{id}`,
    description: `Delete a ${model} record by id.`,
    auth: 'none',
    params: z.object({ id: z.number().int().positive() }),
    response: moonResponse(z.object({ success: z.boolean() })),
  }
}

/** All five CRUD endpoint definitions for a model. */
export function restEndpointDefs(model: string): EndpointDef[] {
  return [
    restListEndpoint(model),
    restCreateEndpoint(model),
    restGetEndpoint(model),
    restUpdateEndpoint(model),
    restDeleteEndpoint(model),
  ]
}
