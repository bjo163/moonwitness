export { NativeServer, publish, type MoonConfig } from './NativeServer.js'
export { FastifyAdapter, type FastifyAdapterConfig } from './fastify-adapter.js'
export { defineRoute, type RouteContext, type RouteDefinition } from './route-builder.js'
export { logger } from './logger.js'
export { ExternalCache, createProxyHandler, type ProxyOptions } from './proxy.js'

// Telemetry
export {
  bootstrapTelemetry,
  shutdownTelemetry,
  isTelemetryEnabled,
  startDomainSpan,
  withDomainSpan,
  type TelemetryConfig,
} from './telemetry.js'

// Utilities
export { parseBody, sendJson, parseUrl, setCorsConfig, getCorsConfig, getSecurityHeaders } from './utils/http.js'
export {
  verifyToken,
  issueJwt,
  validateUserSession,
  revokeUserSessions,
  authenticateRequest,
  resolveJwtPolicy,
  reloadCanonicalJwtPolicy,
  ALLOWED_JWT_ALGORITHMS,
  hashOtpToken,
  generateSecureOtp,
  createOtpChallenge,
  verifyOtpChallenge,
  AuthError,
  CANONICAL_JWT_POLICY,
  type AuthErrorCode,
  type JwtPolicy,
  type AllowedJwtAlgorithm,
  type JwtClaims,
  type VerifyTokenOptions,
  type AuthenticateRequestOptions,
  type OtpChallenge,
} from './utils/auth.js'

// Middleware
export { corsMiddleware } from './middleware/cors.js'

// Handlers
export {
  handleLogin,
  handleRegister,
  handleForgotPassword,
  handleVerifyOtp,
  handleResetPassword,
  handleLogout,
  handleGetSession,
  hashPassword,
  comparePassword,
  type AuthConfig,
} from './handlers/auth.js'
export {
  handleDbStatus,
  handleMetaModels,
  handleMetaModel,
  registerViewManifests,
  getViewManifest,
  type ViewManifest,
  type FieldMeta,
  type MatrixViewMode,
  type MatrixAccentColor,
} from './handlers/meta.js'
export { handleRest } from './handlers/rest.js'
export { handleRpc } from './handlers/rpc.js'
export {
  defineProcedure,
  getRegisteredProcedure,
  getAllRegisteredProcedures,
  isAllowedRpcMethod,
  validateRpcMethod,
  resolveRpcProcedure,
  type RpcProcedure,
  type RpcProcedureContext,
} from './rpc-registry.js'
export {
  handleSSE,
  broadcast,
  getActiveClientCount,
  closeAllSSEConnections,
  cleanupClient,
  type SSEClient,
  type SSEOptions
} from './handlers/sse.js'

// Router
export { globalRoutes, type Route, type ProxyRoute, type HttpHandler } from './router.js'

// Views
export { renderDashboard, renderSwaggerUI } from './views/dashboard.js'

export * from './vercel.js'
