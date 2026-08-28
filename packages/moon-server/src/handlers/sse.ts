import type { IncomingMessage, ServerResponse } from 'node:http'
import { EventEmitter } from 'node:events'
import { getModel, createCtx, SUPERUSER_ID } from '@moon/orm'
import { logger } from '../logger.js'
import { parseUrl, resolveCorsOrigin, type CorsConfig } from '../utils/http.js'
import { verifyToken, AuthError, validateUserSession, type VerifyTokenOptions } from '../utils/auth.js'

// Global SSE state
if (!(globalThis as any).moonEmitter) {
  ;(globalThis as any).moonEmitter = new EventEmitter()
  ;(globalThis as any).moonEmitter.setMaxListeners(1000)
}

if (!(globalThis as any).moonActiveSSEClients) {
  ;(globalThis as any).moonActiveSSEClients = new Map<string, SSEClient>()
}

export interface SSEClient {
  id: string
  res: ServerResponse
  req: IncomingMessage
  ipAddress: string
  userAgent: string
  uid?: number
  tokenVersion?: number
  topics: Set<string> | null // null means all topics
  keepAliveTimer: NodeJS.Timeout
  authTimer: NodeJS.Timeout
  createdAt: number
  lastEventId?: string
  sessionRecordId?: number | null
}

export interface SSEOptions {
  cors?: CorsConfig
  heartbeatIntervalMs?: number
  jwtSecret?: string
  allowAnonymous?: boolean
  verifyTokenOptions?: VerifyTokenOptions
}

/**
 * Get active client count
 */
export function getActiveClientCount(): number {
  const clients = (globalThis as any).moonActiveSSEClients as Map<string, SSEClient>
  return clients.size
}

/**
 * Safe write helper to protect against closed/destroyed streams
 */
function safeWrite(client: SSEClient, data: string): boolean {
  if (client.res.writableEnded || client.res.destroyed) {
    return false
  }
  try {
    client.res.write(data)
    return true
  } catch (err) {
    logger.warn('moon.sse', `Failed to write SSE event to client ${client.id}:`, err)
    cleanupClient(client.id)
    return false
  }
}

/**
 * Broadcast event to all matching SSE clients
 */
export function broadcast(topic: string, payload: any, eventId?: string): void {
  const emitter = (globalThis as any).moonEmitter as EventEmitter
  if (emitter) {
    emitter.emit('moon_event', { topic, payload, eventId, timestamp: Date.now() })
  }
}

/**
 * Cleanup a single SSE client connection
 */
export function cleanupClient(clientId: string): void {
  const clients = (globalThis as any).moonActiveSSEClients as Map<string, SSEClient>
  const client = clients.get(clientId)
  if (!client) return

  clearInterval(client.keepAliveTimer)
  clearInterval(client.authTimer)
  clients.delete(clientId)

  // Update session record in DB if exists
  if (client.sessionRecordId) {
    try {
      const FxSession = getModel('fx.session')
      if (FxSession) {
        const env = createCtx(SUPERUSER_ID, {}, getModel as any)
        FxSession.morph(FxSession as any, env, client.sessionRecordId, {
          disconnectedAt: new Date()
        }).catch((e: any) => {
          logger.error('moon.metrics', 'Failed to update disconnectedAt', e)
        })
      }
    } catch {
      // Ignored during shutdown
    }
  }

  // Safely end stream if not already closed
  if (!client.res.writableEnded && !client.res.destroyed) {
    try {
      client.res.end()
    } catch {
      // Ignored
    }
  }

  // Broadcast leave event
  broadcast('system_connections', {
    activeCount: clients.size,
    action: 'left',
    clientId
  })
}

/**
 * Close all active SSE connections gracefully (e.g. during server shutdown)
 */
export function closeAllSSEConnections(reason = 'server_stopping'): void {
  const clients = (globalThis as any).moonActiveSSEClients as Map<string, SSEClient>
  for (const [clientId, client] of clients.entries()) {
    try {
      safeWrite(
        client,
        `event: shutdown\ndata: ${JSON.stringify({ reason, timestamp: Date.now() })}\n\n`
      )
    } catch {
      // Ignored
    }
    cleanupClient(clientId)
  }
}

/**
 * Revoke all active SSE connections belonging to a specific user.
 * Closes each matching connection and emits a `session_revoked` event
 * before tearing down the stream. Returns the number of clients closed.
 */
export function revokeUserSseClients(userId: number): number {
  const clients = (globalThis as any).moonActiveSSEClients as Map<string, SSEClient>
  let closed = 0

  for (const [clientId, client] of clients.entries()) {
    if (client.uid !== userId) continue

    try {
      safeWrite(
        client,
        `event: session_revoked\ndata: ${JSON.stringify({
          reason: 'revoked',
          userId,
          timestamp: Date.now()
        })}\n\n`
      )
    } catch {
      // Ignored
    }

    cleanupClient(clientId)
    closed++
  }

  return closed
}

/**
 * Handle SSE (Server-Sent Events) connections
 * Pattern: GET /live[?channels=...,topics=...]
 */
export function handleSSE(
  req: IncomingMessage,
  res: ServerResponse,
  options: SSEOptions = {}
): void {
  const { searchParams } = parseUrl(req)
  const reqOrigin = req.headers.origin as string | undefined
  const allowedOrigin = resolveCorsOrigin(reqOrigin, options.cors)

  const headers: Record<string, string> = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
    'X-Content-Type-Options': 'nosniff'
  }

  if (allowedOrigin) {
    headers['Access-Control-Allow-Origin'] = allowedOrigin
    if (allowedOrigin !== '*') {
      headers['Vary'] = 'Origin'
      if (options.cors?.allowCredentials !== false) {
        headers['Access-Control-Allow-Credentials'] = 'true'
      }
    }
  }

  let uid: number | undefined
  let tokenVersion: number | undefined

  if (options.jwtSecret) {
    try {
      const decoded: any = verifyToken(req, options.jwtSecret, options.verifyTokenOptions)
      if (decoded && decoded.sub && Number(decoded.sub) > 0) {
        uid = Number(decoded.sub)
        if (decoded.tokenVersion !== undefined) {
          tokenVersion = Number(decoded.tokenVersion)
        }
      }
    } catch (err) {
      if (err instanceof AuthError && !options.allowAnonymous) {
        const errHeaders: Record<string, string> = {
          'Content-Type': 'application/json',
          ...(allowedOrigin ? { 'Access-Control-Allow-Origin': allowedOrigin } : {})
        }
        res.writeHead(401, errHeaders)
        res.end(JSON.stringify({ error: err.code, message: err.message }))
        return
      }
      logger.warn('moon.sse', `Anonymous SSE fallback for unauthenticated request:`, err)
    }
  }

  res.writeHead(200, headers)

  const clientId = Math.random().toString(36).substring(2, 11)
  const clients = (globalThis as any).moonActiveSSEClients as Map<string, SSEClient>

  // Parse topic subscriptions from query params
  const rawTopics =
    searchParams.get('channels') ||
    searchParams.get('topics') ||
    searchParams.get('events')

  let subscribedTopics: Set<string> | null = null
  if (rawTopics && rawTopics.trim() !== '') {
    const list = rawTopics.split(',').map((t) => t.trim()).filter(Boolean)
    if (!list.includes('*')) {
      subscribedTopics = new Set(list)
    }
  }

  // Parse Last-Event-ID for reconnection tracking
  const lastEventId =
    (req.headers['last-event-id'] as string) ||
    searchParams.get('lastEventId') ||
    undefined

  // Extract client networking info
  const reqAny = req as any
  const ipAddress = (
    String(
      reqAny.headers['x-forwarded-for'] ||
      (reqAny.socket && reqAny.socket.remoteAddress) ||
      'unknown'
    ).split(',')[0] || 'unknown'
  ).trim()
  const userAgent = reqAny.headers['user-agent'] || 'unknown'

  // Heartbeat timer (ping comment + typed heartbeat event)
  const heartbeatInterval = options.heartbeatIntervalMs ?? 15000
  const keepAliveTimer = setInterval(() => {
    safeWrite(client, ': ping\n\n')
    safeWrite(
      client,
      `event: heartbeat\ndata: ${JSON.stringify({
        timestamp: Date.now(),
        activeClients: clients.size,
        uptime: process.uptime()
      })}\n\n`
    )
  }, heartbeatInterval)

  // Session revalidation timer
  let authTimer: NodeJS.Timeout
  if (uid !== undefined) {
    const authInterval = 60000
    authTimer = setInterval(async () => {
      if (!clients.has(clientId)) {
        clearInterval(authTimer)
        return
      }

      try {
        const authEnv = createCtx(SUPERUSER_ID, {}, getModel as any)
        await validateUserSession(authEnv, uid, tokenVersion)
      } catch (err) {
        if (err instanceof AuthError) {
          logger.warn('moon.sse', `Session revalidation failed for client ${clientId}:`, err.message)
          safeWrite(
            client,
            `event: session_revoked\ndata: ${JSON.stringify({
              reason: 'revoked',
              userId: uid,
              timestamp: Date.now(),
              message: err.message
            })}\n\n`
          )
          cleanupClient(clientId)
        } else {
          logger.error('moon.sse', `Unexpected error during session revalidation for client ${clientId}:`, err)
        }
      }
    }, authInterval)
  } else {
    authTimer = setInterval(() => {}, 60000)
  }

  const client: SSEClient = {
    id: clientId,
    res,
    req,
    ipAddress,
    userAgent,
    uid,
    tokenVersion,
    topics: subscribedTopics,
    keepAliveTimer,
    authTimer,
    createdAt: Date.now(),
    lastEventId,
    sessionRecordId: null
  }

  clients.set(clientId, client)

  // Send initial connection handshake event
  safeWrite(
    client,
    `event: connected\ndata: ${JSON.stringify({
      topic: 'system_connections',
      payload: {
        activeCount: clients.size,
        action: 'connected',
        clientId,
        subscribedTopics: subscribedTopics ? Array.from(subscribedTopics) : ['*'],
        lastEventId
      }
    })}\n\n`
  )

  // Event listener router
  const onEvent = (e: { topic: string; payload: any; eventId?: string; timestamp: number }) => {
    if (client.topics !== null && !client.topics.has(e.topic)) {
      return
    }
    const eventIdLine = e.eventId ? `id: ${e.eventId}\n` : ''
    safeWrite(
      client,
      `${eventIdLine}event: ${e.topic}\ndata: ${JSON.stringify(e)}\n\n`
    )
  }

  const emitter = (globalThis as any).moonEmitter as EventEmitter
  emitter.on('moon_event', onEvent)

  // Record session in database if available
  const FxSession = getModel('fx.session')
  if (FxSession) {
    const env = createCtx(SUPERUSER_ID, {}, getModel as any)
    let country = 'Unknown'
    if (ipAddress === '127.0.0.1' || ipAddress === '::1') {
      country = 'Localhost'
    }

    FxSession.spawn(FxSession as any, env, {
      clientId,
      ipAddress,
      userAgent,
      country
    })
      .then((rec: any) => {
        client.sessionRecordId = rec.id
      })
      .catch((e: any) => {
        logger.error('moon.metrics', 'Failed to save fx.session', e)
      })
  }

  // Broadcast joined event
  setTimeout(() => {
    broadcast('system_connections', {
      activeCount: clients.size,
      action: 'joined',
      clientId,
      ip: ipAddress
    })
  }, 50)

  // Disconnect listener
  const onDisconnect = () => {
    clearInterval(authTimer)
    emitter.removeListener('moon_event', onEvent)
    req.removeListener('close', onDisconnect)
    req.removeListener('error', onDisconnect)
    cleanupClient(clientId)
  }

  req.on('close', onDisconnect)
  req.on('error', onDisconnect)
}
