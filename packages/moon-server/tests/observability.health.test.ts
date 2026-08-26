import { describe, it, expect, vi } from 'vitest'
import { handleHealth, handleDbStatus } from '../src/handlers/meta.js'
import type { IncomingMessage, ServerResponse } from 'node:http'

function createMockReqRes() {
  const req: Partial<IncomingMessage> = {
    method: 'GET',
    url: '/health',
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

describe('Observability: Health & Telemetry Probes (#18)', () => {
  it('returns 200 OK and healthy payload when database probe succeeds', async () => {
    const { req, res, getStatusCode, getData } = createMockReqRes()
    await handleHealth(req, res)

    expect(getStatusCode()).toBe(200)
    const data = getData()
    expect(data.status).toBe('healthy')
    expect(data.database).toBe('connected')
    expect(data.memory).toBeDefined()
    expect(typeof data.uptime).toBe('number')
  })

  it('returns 200 OK for /db/status', async () => {
    const { req, res, getStatusCode, getData } = createMockReqRes()
    await handleDbStatus(req, res)

    expect(getStatusCode()).toBe(200)
    const data = getData()
    expect(data.status).toBe('connected')
    expect(data.driver).toBe('pg')
  })
})
