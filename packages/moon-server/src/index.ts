export { NativeServer, publish, type MoonConfig } from './NativeServer.ts'
export { Controller, Get, Post, Put, Delete, registerController } from './router.ts'
export { defineRoute, type RouteContext, type RouteDefinition } from './route-builder.ts'
export { logger } from './logger.ts'
export { ExternalCache, createProxyHandler, type ProxyOptions } from './proxy.ts'

// Utilities
export { parseBody, sendJson, parseUrl, setCorsConfig, getCorsConfig, getSecurityHeaders } from './utils/http.ts'
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
} from './utils/auth.ts'

// Middleware
export { corsMiddleware } from './middleware/cors.ts'

// Handlers
export {
  handleLogin,
  handleRegister,
  handleForgotPassword,
  handleVerifyOtp,
  handleResetPassword,
  handleLogout,
  handleGetSession,
  type AuthConfig,
} from './handlers/auth.ts'
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
} from './handlers/meta.ts'
export { handleRest } from './handlers/rest.ts'
export { handleRpc } from './handlers/rpc.ts'
export {
  handleSSE,
  broadcast,
  getActiveClientCount,
  closeAllSSEConnections,
  cleanupClient,
  type SSEClient,
  type SSEOptions
} from './handlers/sse.ts'

// Views
export { renderDashboard, renderSwaggerUI } from './views/dashboard.ts'

export * from './vercel.ts'

