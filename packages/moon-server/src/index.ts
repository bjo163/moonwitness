export { NativeServer, publish, type MoonConfig } from './NativeServer.js'
export { Controller, Get, Post, Put, Delete, registerController } from './router.js'
export { logger } from './logger.js'
export { ExternalCache, createProxyHandler, type ProxyOptions } from './proxy.js'

// Utilities
export { parseBody, sendJson, parseUrl } from './utils/http.js'
export {
  verifyToken,
  issueJwt,
  validateUserSession,
  revokeUserSessions,
  hashOtpToken,
  generateSecureOtp,
  createOtpChallenge,
  verifyOtpChallenge,
  type JwtClaims,
  type VerifyTokenOptions,
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
  type AuthConfig,
} from './handlers/auth.js'
export { handleDbStatus, handleMetaModels } from './handlers/meta.js'
export { handleRest } from './handlers/rest.js'
export { handleRpc } from './handlers/rpc.js'
export {
  handleSSE,
  broadcast,
  getActiveClientCount,
  closeAllSSEConnections,
  cleanupClient,
  type SSEClient,
  type SSEOptions
} from './handlers/sse.js'

// Views
export { renderDashboard, renderSwaggerUI } from './views/dashboard.js'

export * from './vercel.js'

