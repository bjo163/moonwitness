import { describe, it, expect, vi } from 'vitest'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { handleRest } from '../src/handlers/rest.js'
import { registerModel, Vertex, fields } from '@moon/orm'
import jwt from 'jsonwebtoken'

const TEST_SECRET = 'test-secret-key-32-chars-for-rest-bounds!'

class SampleItem extends Vertex {
  static override _name = 'sample.item'
  static override _table = 'sample_items'
  static override _public = true
  static override _fields = {
    id: fields.Integer(),
    name: fields.Char(),
    status: fields.Selection([['draft', 'Draft'], ['done', 'Done']]),
    authorId: fields.Many2one({ comodel: 'sample.author' })
  }

  name = fields.Char()
  status = fields.Selection([['draft', 'Draft'], ['done', 'Done']])
  authorId = fields.Many2one({ comodel: 'sample.author' })
}

registerModel(SampleItem)

function createReq(method: string, url: string, body?: any): IncomingMessage {
  const token = jwt.sign({ sub: 1 }, TEST_SECRET, { expiresIn: '1h' })
  const req: any = {
    method,
    url,
    headers: {
      host: 'localhost:4000',
      authorization: `Bearer ${token}`,
      'content-type': 'application/json'
    },
    on: vi.fn((event: string, cb: Function) => {
      if (event === 'data' && body) {
        cb(JSON.stringify(body))
      }
      if (event === 'end') {
        cb()
      }
      return req
    }),
    removeListener: vi.fn()
  }
  return req
}

function createRes(): { res: ServerResponse; getStatus: () => number; getBody: () => any } {
  let status = 200
  let bodyStr = ''
  const res: any = {
    headersSent: false,
    writeHead: (code: number) => {
      status = code
    },
    end: (str: string) => {
      bodyStr = str
    }
  }
  return {
    res,
    getStatus: () => status,
    getBody: () => (bodyStr ? JSON.parse(bodyStr) : null)
  }
}

describe('REST Query Controls & Input Validation (#17)', () => {
  it('rejects invalid order parameter containing SQL injection syntax', async () => {
    const req = createReq('GET', '/api/sample.item?order=id;DROP+TABLE+users')
    const { res, getStatus, getBody } = createRes()

    await handleRest(req, res, ['/api/sample.item', 'sample.item', undefined] as any, TEST_SECRET)

    expect(getStatus()).toBe(400)
    expect(getBody().code).toBe('INVALID_ORDER')
  })

  it('rejects invalid JSON domain syntax with 400 Bad Request', async () => {
    const req = createReq('GET', '/api/sample.item?domain=not_a_valid_json')
    const { res, getStatus, getBody } = createRes()

    await handleRest(req, res, ['/api/sample.item', 'sample.item', undefined] as any, TEST_SECRET)

    expect(getStatus()).toBe(400)
    expect(getBody().code).toBe('INVALID_DOMAIN')
  })

  it('rejects empty or non-object body on POST with 400 Bad Request', async () => {
    const req = createReq('POST', '/api/sample.item', {})
    const { res, getStatus, getBody } = createRes()

    await handleRest(req, res, ['/api/sample.item', 'sample.item', undefined] as any, TEST_SECRET)

    expect(getStatus()).toBe(400)
    expect(getBody().code).toBe('INVALID_REQUEST_BODY')
  })

  it('rejects invalid relation field in with parameter with 400 Bad Request', async () => {
    // 'name' is a Char field, not a relation
    const req = createReq('GET', '/api/sample.item?with=name')
    const { res, getStatus, getBody } = createRes()

    await handleRest(req, res, ['/api/sample.item', 'sample.item', undefined] as any, TEST_SECRET)

    expect(getStatus()).toBe(400)
    expect(getBody().code).toBe('INVALID_RELATION')
    expect(getBody().error).toContain("Field 'name' is not a relation")
  })

  it('rejects malformed relation name containing illegal characters', async () => {
    const req = createReq('GET', '/api/sample.item?with=author;DROP+TABLE')
    const { res, getStatus, getBody } = createRes()

    await handleRest(req, res, ['/api/sample.item', 'sample.item', undefined] as any, TEST_SECRET)

    expect(getStatus()).toBe(400)
    expect(getBody().code).toBe('INVALID_RELATION')
  })

  it('rejects query fields containing illegal parameter characters with 400 Bad Request', async () => {
    const req = createReq('GET', '/api/sample.item?author%20id=1')
    const { res, getStatus, getBody } = createRes()

    await handleRest(req, res, ['/api/sample.item', 'sample.item', undefined] as any, TEST_SECRET)

    expect(getStatus()).toBe(400)
    expect(getBody().code).toBe('INVALID_QUERY_FIELD')
  })
})
