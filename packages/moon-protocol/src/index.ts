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
} from './envelopes.js'

// ── WITNESS CONTRACTS (Scripture, Hadith, Astronomy, Engine) ──
export * from './contracts/witness.js'
export * from './contracts/mizan.js'

// ── AUTH CONTRACTS (Login, Session, Clearance) ────────────────
export * from './contracts/auth.js'

// ── CAB CONTRACTS (Projects, Tasks, Changes, Meetings) ───────
export * from './contracts/cab.js'

// ── SYSTEM CONTRACTS (Health, DB, Metrics, Mizan) ─────────────
export * from './contracts/system.js'

// ── COOLIFY OPS CONTRACTS (Deployment connector read model) ───
export * from './contracts/coolify-ops.js'

// ── SSE CONTRACTS (Typed Realtime Topics) ─────────────────────
export * from './contracts/sse.js'

// ── EXTERNAL CONTRACTS (NASA, USGS, Weather, Markets) ─────────
export * from './contracts/external.js'

// ── MATRIX CONTRACTS (Server-Driven UI Schema & Views) ────────
export * from './contracts/matrix.js'

// ── RPC + GENERIC REST WIRE CONTRACTS ─────────────────────────
export * from './contracts/rpc.js'
export * from './contracts/rest.js'

// ── CANONICAL ENDPOINT REGISTRY (Single Source of Truth) ──────
export {
  defineEndpoint,
  getEndpointRegistry,
  resetEndpointRegistry,
} from './registry.js'
