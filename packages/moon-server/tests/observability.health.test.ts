import { describe, it, expect, vi } from 'vitest'
import { handleHealth, handleDbStatus, handleLiveness, handleReadiness } from '../src/handlers/meta.ts'
import type { IncomingMessage, ServerResponse } from 'node:http'

function createMockReqRes(url = '/health') {
  const req: Partial<IncomingMessage> = {
    method: 'GET',
    url,
    headers: {}
  }
  let statusCode = 200
  let writtenData = ''
  const res: Partial<ServerResponse> = {
    writeHead: vi.fn((status: number) => {
      statusCode = status
      return res as any
    }),
    end: vi.fn((chunk?: any) => {
      if (chunk) writtenData = chunk.toString()
    }),
    setHeader: vi.fn()
  }

  return {
    req: req as IncomingMessage,
    res: res as ServerResponse,
    getStatusCode: () => statusCode,
    getData: () => (writtenData ? JSON.parse(writtenData) : null)
  }
}

vi.mock('@moon/orm', () => {
  return {
    getDb: () => ({
      client: { driverName: 'pg' },
      raw: async (sql: string) => {
        if (sql.includes('FAIL')) {
          throw new Error('Database connection failed')
        }
        return [{ ping: 1 }]
      }
    }),
    registry: new Map()
  }
})

describe('Observability: Health, Liveness & Readiness Probes (#18, #21)', () => {
  it('returns 200 OK for /health/live without querying database', () => {
    const { req, res, getStatusCode, getData } = createMockReqRes('/health/live')
    handleLiveness(req, res)

    expect(getStatusCode()).toBe(200)
    const data = getData()
    expect(data.status).toBe('live')
    expect(data.memory).toBeDefined()
    expect(typeof data.uptime).toBe('number')
  })

  it('returns 200 OK for /health/ready when database is connected', async () => {
    const { req, res, getStatusCode, getData } = createMockReqRes('/health/ready')
    await handleReadiness(req, res)

    expect(getStatusCode()).toBe(200)
    const data = getData()
    expect(data.status).toBe('ready')
    expect(data.database).toBe('connected')
  })

  it('returns 200 OK and healthy payload for general /health', async () => {
    const { req, res, getStatusCode, getData } = createMockReqRes('/health')
    await handleHealth(req, res)

    expect(getStatusCode()).toBe(200)
    const data = getData()
    expect(data.status).toBe('healthy')
    expect(data.database).toBe('connected')
    expect(data.memory).toBeDefined()
    expect(typeof data.uptime).toBe('number')
  })

  it('returns 200 OK for /db/status', async () => {
    const { req, res, getStatusCode, getData } = createMockReqRes('/db/status')
    await handleDbStatus(req, res)

    expect(getStatusCode()).toBe(200)
    const data = getData()
    expect(data.status).toBe('connected')
    expect(data.driver).toBe('pg')
  })
})
