import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { EventEmitter } from 'node:events'
import {
  handleSSE,
  revokeUserSseClients,
  getActiveClientCount,
  closeAllSSEConnections
} from '../src/handlers/sse.js'
import { issueJwt } from '../src/utils/auth.js'

const JWT_SECRET = 'revocation-test-secret'

function createMockReqRes(options: {
  url?: string
  origin?: string
  authorization?: string
  lastEventId?: string
} = {}) {
  const reqEvents = new EventEmitter()
  const req: any = Object.assign(reqEvents, {
    url: options.url || '/live',
    headers: {
      host: 'localhost:3000',
      origin: options.origin,
      authorization: options.authorization,
      'last-event-id': options.lastEventId,
      'user-agent': 'TestClient/1.0',
      'x-forwarded-for': '127.0.0.1'
    },
    method: 'GET'
  })

  let statusCode = 200
  let headers: Record<string, string> = {}
  const writtenChunks: string[] = []
  let ended = false

  const res: any = {
    writeHead: vi.fn((code: number, hdrs: Record<string, string>) => {
      statusCode = code
      headers = hdrs
    }),
    write: vi.fn((chunk: string) => {
      writtenChunks.push(chunk)
      return true
    }),
    end: vi.fn(() => {
      ended = true
    }),
    get writableEnded() {
      return ended
    },
    get destroyed() {
      return false
    }
  }

  return {
    req,
    res,
    getWrittenChunks: () => writtenChunks,
    getHeaders: () => headers,
    getStatusCode: () => statusCode
  }
}

function tokenFor(userId: number, tokenVersion?: number): string {
  return issueJwt({ sub: userId, ...(tokenVersion !== undefined ? { tokenVersion } : {}) }, JWT_SECRET)
}

describe('SSE Session Revocation (#115)', () => {
  beforeEach(() => {
    closeAllSSEConnections('test_reset')
  })

  afterEach(() => {
    closeAllSSEConnections('test_cleanup')
  })

  it('registers uid and tokenVersion on authenticated SSE connections', () => {
    const token = tokenFor(7, 3)
    const mock = createMockReqRes({ authorization: `Bearer ${token}` })

    handleSSE(mock.req, mock.res, {
      jwtSecret: JWT_SECRET,
      heartbeatIntervalMs: 60000
    })

    expect(getActiveClientCount()).toBe(1)
    const chunks = mock.getWrittenChunks().join('')
    expect(chunks).toContain('event: connected')
  })

  it('rejects an invalid token with 401 when authentication is required', () => {
    const mock = createMockReqRes({ authorization: 'Bearer not-a-valid-token' })

    handleSSE(mock.req, mock.res, {
      jwtSecret: JWT_SECRET,
      heartbeatIntervalMs: 60000
    })

    expect(mock.getStatusCode()).toBe(401)
    expect(getActiveClientCount()).toBe(0)
  })

  it('allows anonymous connections when jwtSecret is present but allowAnonymous is true', () => {
    const mock = createMockReqRes()

    handleSSE(mock.req, mock.res, {
      jwtSecret: JWT_SECRET,
      allowAnonymous: true,
      heartbeatIntervalMs: 60000
    })

    expect(mock.getStatusCode()).toBe(200)
    expect(getActiveClientCount()).toBe(1)
  })

  it('closes only the target user connections and emits session_revoked', () => {
    const userA1 = createMockReqRes({ authorization: `Bearer ${tokenFor(42)}` })
    const userA2 = createMockReqRes({ authorization: `Bearer ${tokenFor(42)}` })
    const userB = createMockReqRes({ authorization: `Bearer ${tokenFor(99)}` })
    const anon = createMockReqRes()

    handleSSE(userA1.req, userA1.res, { jwtSecret: JWT_SECRET, heartbeatIntervalMs: 60000 })
    handleSSE(userA2.req, userA2.res, { jwtSecret: JWT_SECRET, heartbeatIntervalMs: 60000 })
    handleSSE(userB.req, userB.res, { jwtSecret: JWT_SECRET, heartbeatIntervalMs: 60000 })
    handleSSE(anon.req, anon.res, { jwtSecret: JWT_SECRET, allowAnonymous: true, heartbeatIntervalMs: 60000 })

    expect(getActiveClientCount()).toBe(4)

    const closed = revokeUserSseClients(42)

    expect(closed).toBe(2)
    expect(getActiveClientCount()).toBe(2)

    expect(userA1.getWrittenChunks().join('')).toContain('event: session_revoked')
    expect(userA2.getWrittenChunks().join('')).toContain('event: session_revoked')

    expect(userB.getWrittenChunks().join('')).not.toContain('event: session_revoked')
    expect(anon.getWrittenChunks().join('')).not.toContain('event: session_revoked')
    expect(userB.res.end).not.toHaveBeenCalled()
  })

  it('returns 0 when revoking connections for a user with none active', () => {
    const userB = createMockReqRes({ authorization: `Bearer ${tokenFor(99)}` })
    handleSSE(userB.req, userB.res, { jwtSecret: JWT_SECRET, heartbeatIntervalMs: 60000 })

    expect(revokeUserSseClients(1234)).toBe(0)
    expect(getActiveClientCount()).toBe(1)
  })

  it('remains backward compatible when no jwtSecret is supplied', () => {
    const mock = createMockReqRes()

    handleSSE(mock.req, mock.res, { heartbeatIntervalMs: 60000 })

    expect(mock.getStatusCode()).toBe(200)
    expect(getActiveClientCount()).toBe(1)
    expect(mock.getWrittenChunks()[0]).toContain('event: connected')
  })
})
