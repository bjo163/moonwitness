/**
 * ◈ MOONWITNESS PROTOCOL — API CONTRACT LAYER
 *
 * Single Source of Truth for all API endpoint types, schemas, and contracts.
 * Used by: Backend (validation), Frontend (type-safe calls), OpenAPI (docs).
 *
 * @module @moon/protocol
 */

// ── ENVELOPE INFRASTRUCTURE ───────────────────────────────────
export {
  PaginationMetaSchema,
  MoonErrorSchema,
  IdSchema,
  DateTimeSchema,
  SlugSchema,
  moonResponse,
  paginatedResponse,
  type PaginationMeta,
  type MoonError,
  type HttpMethod,
  type EndpointDef,
} from './envelopes'

// ── WITNESS CONTRACTS (Scripture, Hadith, Astronomy, Engine) ──
export * from './contracts/witness'

// ── AUTH CONTRACTS (Login, Session, Clearance) ────────────────
export * from './contracts/auth'

// ── CAB CONTRACTS (Projects, Tasks, Changes, Meetings) ───────
export * from './contracts/cab'

// ── SYSTEM CONTRACTS (Health, DB, Metrics, Mizan) ─────────────
export * from './contracts/system'

// ── SSE CONTRACTS (Typed Realtime Topics) ─────────────────────
export * from './contracts/sse'

// ── EXTERNAL CONTRACTS (NASA, USGS, Weather, Markets) ─────────
export * from './contracts/external'

// ── MATRIX CONTRACTS (Server-Driven UI Schema & Views) ────────
export * from './contracts/matrix'
