import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { EventEmitter } from 'node:events'
import {
  handleSSE,
  broadcast,
  getActiveClientCount,
  closeAllSSEConnections,
  cleanupClient,
} from '../src/handlers/sse.js'

function createMockReqRes(options: {
  url?: string
  origin?: string
  lastEventId?: string
} = {}) {
  const reqEvents = new EventEmitter()
  const req: any = Object.assign(reqEvents, {
    url: options.url || '/live',
    headers: {
      host: 'localhost:3000',
      origin: options.origin,
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

  return { req, res, getWrittenChunks: () => writtenChunks, getHeaders: () => headers, getStatusCode: () => statusCode }
}

describe('Observability & SSE Real-time Telemetry (#19 / #21)', () => {
  beforeEach(() => {
    closeAllSSEConnections('test_reset')
  })

  afterEach(() => {
    closeAllSSEConnections('test_cleanup')
  })

  it('establishes SSE connection with correct stream headers and initial handshake', () => {
    const { req, res, getWrittenChunks, getHeaders } = createMockReqRes({
      origin: 'https://moonwitness.org'
    })

    handleSSE(req, res, {
      cors: { allowedOrigins: ['https://moonwitness.org'] },
      heartbeatIntervalMs: 60000
    })

    const headers = getHeaders()
    expect(headers['Content-Type']).toBe('text/event-stream')
    expect(headers['Cache-Control']).toBe('no-cache, no-transform')
    expect(headers['Connection']).toBe('keep-alive')
    expect(headers['X-Accel-Buffering']).toBe('no')
    expect(headers['Access-Control-Allow-Origin']).toBe('https://moonwitness.org')
    expect(headers['Access-Control-Allow-Credentials']).toBe('true')
    expect(headers['Vary']).toBe('Origin')

    expect(getActiveClientCount()).toBe(1)

    const chunks = getWrittenChunks()
    expect(chunks.length).toBeGreaterThanOrEqual(1)
    expect(chunks[0]).toContain('event: connected')
    expect(chunks[0]).toContain('"action":"connected"')
    expect(chunks[0]).toContain('"subscribedTopics":["*"]')
  })

  it('broadcasts events to all wildcard-subscribed clients', async () => {
    const mock1 = createMockReqRes()
    const mock2 = createMockReqRes()

    handleSSE(mock1.req, mock1.res, { heartbeatIntervalMs: 60000 })
    handleSSE(mock2.req, mock2.res, { heartbeatIntervalMs: 60000 })

    expect(getActiveClientCount()).toBe(2)

    broadcast('telemetry_update', { cpu: 42, memory: '1.2GB' }, 'evt-101')

    const chunks1 = mock1.getWrittenChunks()
    const chunks2 = mock2.getWrittenChunks()

    const lastChunk1 = chunks1[chunks1.length - 1]
    const lastChunk2 = chunks2[chunks2.length - 1]

    expect(lastChunk1).toContain('event: telemetry_update')
    expect(lastChunk1).toContain('id: evt-101')
    expect(lastChunk1).toContain('"cpu":42')

    expect(lastChunk2).toContain('event: telemetry_update')
    expect(lastChunk2).toContain('id: evt-101')
    expect(lastChunk2).toContain('"cpu":42')
  })

  it('filters events based on client channel/topic subscriptions', () => {
    const witnessMock = createMockReqRes({ url: '/live?channels=witness_graph,telemetry' })
    const astroMock = createMockReqRes({ url: '/live?topics=celestial_orbit' })

    handleSSE(witnessMock.req, witnessMock.res, { heartbeatIntervalMs: 60000 })
    handleSSE(astroMock.req, astroMock.res, { heartbeatIntervalMs: 60000 })

    // Broadcast witness event
    broadcast('witness_graph', { nodeId: 'verse:1:1' })

    // Broadcast orbit event
    broadcast('celestial_orbit', { altitude: 400 })

    const witnessChunks = witnessMock.getWrittenChunks().join('')
    const astroChunks = astroMock.getWrittenChunks().join('')

    // witnessMock should have witness_graph but NOT celestial_orbit
    expect(witnessChunks).toContain('event: witness_graph')
    expect(witnessChunks).toContain('verse:1:1')
    expect(witnessChunks).not.toContain('event: celestial_orbit')

    // astroMock should have celestial_orbit but NOT witness_graph
    expect(astroChunks).toContain('event: celestial_orbit')
    expect(astroChunks).toContain('"altitude":400')
    expect(astroChunks).not.toContain('event: witness_graph')
  })

  it('cleans up client registration and decrements active count on disconnect', () => {
    const mock = createMockReqRes()
    handleSSE(mock.req, mock.res, { heartbeatIntervalMs: 60000 })

    expect(getActiveClientCount()).toBe(1)

    // Trigger request close event
    mock.req.emit('close')

    expect(getActiveClientCount()).toBe(0)
  })

  it('emits heartbeat ping and telemetry event on heartbeat interval', () => {
    vi.useFakeTimers()
    try {
      const mock = createMockReqRes()
      handleSSE(mock.req, mock.res, { heartbeatIntervalMs: 5000 })

      const initialCount = mock.getWrittenChunks().length

      vi.advanceTimersByTime(5100)

      const chunksAfterHeartbeat = mock.getWrittenChunks()
      expect(chunksAfterHeartbeat.length).toBeGreaterThan(initialCount)

      const heartbeatChunk = chunksAfterHeartbeat.find((c) => c.includes('event: heartbeat'))
      expect(heartbeatChunk).toBeDefined()
      expect(heartbeatChunk).toContain('"activeClients":1')
    } finally {
      vi.useRealTimers()
    }
  })

  it('gracefully drains all connections on closeAllSSEConnections', () => {
    const mock1 = createMockReqRes()
    const mock2 = createMockReqRes()

    handleSSE(mock1.req, mock1.res, { heartbeatIntervalMs: 60000 })
    handleSSE(mock2.req, mock2.res, { heartbeatIntervalMs: 60000 })

    expect(getActiveClientCount()).toBe(2)

    closeAllSSEConnections('server_shutdown')

    expect(getActiveClientCount()).toBe(0)
    expect(mock1.res.end).toHaveBeenCalled()
    expect(mock2.res.end).toHaveBeenCalled()

    const chunk1 = mock1.getWrittenChunks().join('')
    expect(chunk1).toContain('event: shutdown')
    expect(chunk1).toContain('server_shutdown')
  })
})
