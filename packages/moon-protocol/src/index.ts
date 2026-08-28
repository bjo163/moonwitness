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
} from './envelopes.ts'

// ── WITNESS CONTRACTS (Scripture, Hadith, Astronomy, Engine) ──
export * from './contracts/witness.ts'

// ── AUTH CONTRACTS (Login, Session, Clearance) ────────────────
export * from './contracts/auth.ts'

// ── CAB CONTRACTS (Projects, Tasks, Changes, Meetings) ───────
export * from './contracts/cab.ts'

// ── SYSTEM CONTRACTS (Health, DB, Metrics, Mizan) ─────────────
export * from './contracts/system.ts'

// ── SSE CONTRACTS (Typed Realtime Topics) ─────────────────────
export * from './contracts/sse.ts'

// ── EXTERNAL CONTRACTS (NASA, USGS, Weather, Markets) ─────────
export * from './contracts/external.ts'

// ── MATRIX CONTRACTS (Server-Driven UI Schema & Views) ────────
export * from './contracts/matrix.ts'

// ── RPC + GENERIC REST WIRE CONTRACTS ─────────────────────────
export * from './contracts/rpc.ts'
export * from './contracts/rest.ts'

// ── CANONICAL ENDPOINT REGISTRY (Single Source of Truth) ──────
export {
  defineEndpoint,
  getEndpointRegistry,
  resetEndpointRegistry,
} from './registry.ts'
