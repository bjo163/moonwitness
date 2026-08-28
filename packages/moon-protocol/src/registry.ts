/**
 * ◈ MOONWITNESS PROTOCOL — CANONICAL ENDPOINT REGISTRY
 *
 * Single source of truth for API endpoint contracts. `defineEndpoint`
 * records declarative `EndpointDef`s; the OpenAPI generator and contract
 * tests consume this registry instead of a parallel handwritten document.
 *
 * Every entry's `auth` MUST match the runtime handler's actual auth policy
 * (see NativeServer dispatch + handleRest/handleRpc). Drift here is a bug.
 */
import { z } from 'zod'
import {
  EndpointDef,
  moonResponse,
  MoonErrorSchema,
} from './envelopes.ts'
import {
  LoginRequestSchema,
  RegisterRequestSchema,
  ForgotPasswordRequestSchema,
  VerifyOtpRequestSchema,
  ResetPasswordRequestSchema,
  AuthResponseSchema,
  SessionResponseSchema,
  AuthSuccessSchema,
} from './contracts/auth.ts'
import {
  HealthResponseSchema,
  DbStatusResponseSchema,
  MetaModelsResponseSchema,
} from './contracts/system.ts'
import { RpcRequestSchema, RpcResponseSchema } from './contracts/rpc.ts'

// ── REGISTRY ──────────────────────────────────────────────────────
const endpointRegistry: EndpointDef[] = []

/**
 * Register a canonical endpoint definition. Safe to call at module-load
 * time. The last registration for a given (method, path) wins so addons
 * can override built-ins intentionally.
 */
export function defineEndpoint(def: EndpointDef): void {
  const idx = endpointRegistry.findIndex(
    (e) => e.method === def.method && e.path === def.path
  )
  if (idx >= 0) endpointRegistry[idx] = def
  else endpointRegistry.push(def)
}

export function getEndpointRegistry(): EndpointDef[] {
  return endpointRegistry
}

export function resetEndpointRegistry(): void {
  endpointRegistry.length = 0
  registerBuiltInEndpoints()
}

// ── BUILT-IN ENDPOINTS (must match NativeServer runtime auth) ─────
function registerBuiltInEndpoints(): void {
  // Authentication (public unless noted)
  defineEndpoint({
    method: 'POST',
    path: '/auth/login',
    tags: ['Authentication'],
    description: 'Authenticate and obtain a JWT bearer token.',
    auth: 'none',
    body: LoginRequestSchema,
    response: AuthResponseSchema,
  })
  defineEndpoint({
    method: 'POST',
    path: '/auth/register',
    tags: ['Authentication'],
    description: 'Register a new account.',
    auth: 'none',
    body: RegisterRequestSchema,
    response: AuthResponseSchema,
  })
  defineEndpoint({
    method: 'POST',
    path: '/auth/forgot-password',
    tags: ['Authentication'],
    description: 'Request an OTP to reset a forgotten password.',
    auth: 'none',
    body: ForgotPasswordRequestSchema,
    response: AuthSuccessSchema,
  })
  defineEndpoint({
    method: 'POST',
    path: '/auth/verify-otp',
    tags: ['Authentication'],
    description: 'Verify an OTP sent for password reset.',
    auth: 'none',
    body: VerifyOtpRequestSchema,
    response: AuthResponseSchema,
  })
  defineEndpoint({
    method: 'POST',
    path: '/auth/reset-password',
    tags: ['Authentication'],
    description: 'Reset password using a verified OTP.',
    auth: 'none',
    body: ResetPasswordRequestSchema,
    response: AuthSuccessSchema,
  })
  defineEndpoint({
    method: 'POST',
    path: '/auth/logout',
    tags: ['Authentication'],
    description: 'Invalidate the current session token.',
    auth: 'user',
    response: AuthSuccessSchema,
  })
  defineEndpoint({
    method: 'GET',
    path: '/auth/me',
    tags: ['Authentication'],
    description: 'Get the current authenticated session.',
    auth: 'user',
    response: SessionResponseSchema,
  })
  defineEndpoint({
    method: 'GET',
    path: '/auth/session',
    tags: ['Authentication'],
    description: 'Alias of /auth/me.',
    auth: 'user',
    response: SessionResponseSchema,
  })

  // RPC (authenticated; unsafe dispatch tracked separately in #114)
  defineEndpoint({
    method: 'POST',
    path: '/rpc',
    tags: ['Core Engine'],
    description:
      'Execute a server method on a model. Requires authentication. ' +
      'Forbidden/mutating method names are rejected at runtime.',
    auth: 'user',
    body: RpcRequestSchema,
    response: RpcResponseSchema,
  })

  // System / introspection (public)
  defineEndpoint({
    method: 'GET',
    path: '/db/status',
    tags: ['Core Engine'],
    description: 'Database connectivity status.',
    auth: 'none',
    response: DbStatusResponseSchema,
  })
  defineEndpoint({
    method: 'GET',
    path: '/meta/models',
    tags: ['Core Engine'],
    description: 'List all registered models with metadata.',
    auth: 'none',
    response: MetaModelsResponseSchema,
  })
  defineEndpoint({
    method: 'GET',
    path: '/api/meta/model/{model}',
    tags: ['Core Engine'],
    description: 'Rich field + view schema for a single model.',
    auth: 'none',
    params: z.object({ model: z.string().regex(/^[a-z0-9.-]+$/) }),
    response: moonResponse(z.record(z.unknown())),
  })

  // SSE (ADMIN ONLY — was incorrectly marked public in the old handcrafted doc)
  defineEndpoint({
    method: 'GET',
    path: '/live',
    tags: ['Core Engine'],
    description: 'Server-Sent Events admin telemetry stream. Requires admin.',
    auth: 'admin',
  })

  // Health probes (public)
  defineEndpoint({
    method: 'GET',
    path: '/health',
    tags: ['Core Engine'],
    description: 'Liveness/readiness aggregate health probe.',
    auth: 'none',
    response: HealthResponseSchema,
  })
  defineEndpoint({
    method: 'GET',
    path: '/health/live',
    tags: ['Core Engine'],
    description: 'Liveness probe (process responsive, no DB dependency).',
    auth: 'none',
    response: HealthResponseSchema,
  })
  defineEndpoint({
    method: 'GET',
    path: '/health/ready',
    tags: ['Core Engine'],
    description: 'Readiness probe (checks database connectivity).',
    auth: 'none',
    response: HealthResponseSchema,
  })

  // Documentation (public)
  defineEndpoint({
    method: 'GET',
    path: '/openapi.json',
    tags: ['Core Engine'],
    description: 'This OpenAPI document (canonical, generated).',
    auth: 'none',
  })
  defineEndpoint({
    method: 'GET',
    path: '/docs',
    tags: ['Core Engine'],
    description: 'Interactive Swagger UI for this API.',
    auth: 'none',
  })
}

// Register built-ins on module load.
registerBuiltInEndpoints()

export { MoonErrorSchema }
