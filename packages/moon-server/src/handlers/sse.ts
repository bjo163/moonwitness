import type { IncomingMessage, ServerResponse } from 'node:http'
import { EventEmitter } from 'node:events'
import { getModel, createCtx, SUPERUSER_ID } from '@moon/orm'
import { logger } from '../logger.js'

// Global SSE state
if (!(globalThis as any).moonEmitter) {
  (globalThis as any).moonEmitter = new EventEmitter()
}

if (!(globalThis as any).moonActiveClients) {
  (globalThis as any).moonActiveClients = new Set<string>()
}

/**
 * Get active client count
 */
export function getActiveClientCount(): number {
  const clients = (globalThis as any).moonActiveClients as Set<string>
  return clients.size
}

/**
 * Broadcast event to all SSE clients
 */
export function broadcast(topic: string, payload: any): void {
  if ((globalThis as any).moonEmitter) {
    (globalThis as any).moonEmitter.emit('moon_event', { topic, payload })
  }
}

/**
 * Handle SSE (Server-Sent Events) connections
 * Pattern: GET /live
 */
export function handleSSE(req: IncomingMessage, res: ServerResponse): void {
  const origin = (req.headers.origin as string) || '*'

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': 'true',
    'X-Accel-Buffering': 'no'
  })

  const clientId = Math.random().toString(36).substring(2, 11)
  const activeClients = (globalThis as any).moonActiveClients as Set<string>
  activeClients.add(clientId)

  // Extract client info
  const reqAny = req as any
  const ipAddress = (
    String(
      reqAny.headers['x-forwarded-for'] ||
      (reqAny.socket && reqAny.socket.remoteAddress) ||
      'unknown'
    ).split(',')[0] || 'unknown'
  ).trim()
  const userAgent = reqAny.headers['user-agent'] || 'unknown'

  // Send initial connection event
  res.write(
    `data: ${JSON.stringify({
      topic: 'system_connections',
      payload: {
        activeCount: activeClients.size,
        action: 'connected',
        clientId
      }
    })}\n\n`
  )

  // Keepalive ping every 15s
  const interval = setInterval(() => {
    res.write(':\n\n')
  }, 15000)

  // Event listener
  const onEvent = (e: any) => {
    res.write(`data: ${JSON.stringify(e)}\n\n`)
  }

  const emitter = (globalThis as any).moonEmitter as EventEmitter
  emitter.on('moon_event', onEvent)

  // Save session to database
  let sessionRecordId: number | null = null
  const FxSession = getModel('fx.session')

  if (FxSession) {
    const env = createCtx(SUPERUSER_ID, {}, getModel as any)

    let country = 'Unknown'
    if (ipAddress === '127.0.0.1' || ipAddress === '::1') {
      country = 'Localhost'
    } else {
      // GeoIP lookup (async, non-blocking)
      fetch(`http://ip-api.com/json/${ipAddress}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 'success' && sessionRecordId) {
            FxSession.morph(FxSession as any, env, sessionRecordId, {
              country: data.country
            }).catch(() => {})
          }
        })
        .catch(() => {})
    }

    FxSession.spawn(FxSession as any, env, {
      clientId,
      ipAddress,
      userAgent,
      country
    })
      .then((rec) => {
        sessionRecordId = rec.id
      })
      .catch((e) => {
        logger.error('moon.metrics', 'Failed to save fx.session', e)
      })
  }

  // Broadcast join event
  setTimeout(() => {
    broadcast('system_connections', {
      activeCount: activeClients.size,
      action: 'joined',
      clientId,
      ip: ipAddress
    })
  }, 100)

  // Cleanup on disconnect
  req.on('close', () => {
    clearInterval(interval)
    emitter.removeListener('moon_event', onEvent)
    activeClients.delete(clientId)

    // Update session disconnect time
    if (FxSession && sessionRecordId) {
      const env = createCtx(SUPERUSER_ID, {}, getModel as any)
      FxSession.morph(FxSession as any, env, sessionRecordId, {
        disconnectedAt: new Date()
      }).catch((e) => {
        logger.error('moon.metrics', 'Failed to update disconnectedAt', e)
      })
    }

    // Broadcast leave event
    broadcast('system_connections', {
      activeCount: activeClients.size,
      action: 'left',
      clientId
    })
  })
}
