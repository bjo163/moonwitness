import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { handleRest } from '../src/handlers/rest.ts'
import { registerModel, setupOrm, Vertex, fields } from '@moon/orm'
import jwt from 'jsonwebtoken'

const TEST_SECRET = 'test-secret-key-32-chars-for-rest-bounds!'

class VxUser extends Vertex {
  static override _name = 'vx.user'
  static override _public = true
  email = fields.Char()
  name = fields.Char()
  password = fields.Char()
  tokenVersion = fields.Integer({ default: 1 })
  isActive = fields.Boolean({ default: true })
}

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

registerModel(VxUser)
registerModel(SampleItem)

type Row = Record<string, any>
type Tables = Record<string, Row[]>

class FakeDbQuery {
  private tableName: string
  private tables: Tables
  private filters: Array<(row: Row) => boolean> = []

  constructor(tableName: string, tables: Tables) {
    this.tableName = tableName
    this.tables = tables
    if (!this.tables[tableName]) {
      this.tables[tableName] = []
    }
  }

  where(columnOrFn: string | Record<string, any> | ((qb: any) => void), opOrVal?: any, val?: any): this {
    if (typeof columnOrFn === 'function') {
      columnOrFn(this)
      return this
    }

    if (typeof columnOrFn === 'object' && columnOrFn !== null) {
      this.filters.push((row) =>
        Object.entries(columnOrFn).every(([key, expected]) => row[key] === expected)
      )
      return this
    }

    const column = String(columnOrFn).replace(`${this.tableName}.`, '')
    if (val !== undefined) {
      const op = String(opOrVal).toLowerCase()
      if (op === '=' || op === '==') {
        if (val === null) {
          this.filters.push((row) => row[column] === null || row[column] === undefined)
        } else {
          this.filters.push((row) => row[column] === val)
        }
      }
    } else {
      if (opOrVal === null) {
        this.filters.push((row) => row[column] === null || row[column] === undefined)
      } else {
        this.filters.push((row) => row[column] === opOrVal)
      }
    }

    return this
  }

  andWhere(columnOrFn: string | Record<string, any> | ((qb: any) => void), opOrVal?: any, val?: any): this {
    return this.where(columnOrFn, opOrVal, val)
  }

  orWhere(columnOrFn: string | Record<string, any> | ((qb: any) => void), opOrVal?: any, val?: any): this {
    return this.where(columnOrFn, opOrVal, val)
  }

  whereIn(columnOrFn: string, values: any[]): this {
    const column = String(columnOrFn).replace(`${this.tableName}.`, '')
    this.filters.push((row) => values.includes(row[column]))
    return this
  }

  select(..._columns: string[]): this {
    return this
  }

  orderBy(_column: string, _direction?: string): this {
    return this
  }

  limit(_count: number): this {
    return this
  }

  offset(_count: number): this {
    return this
  }

  async count(_column?: string): Promise<{ count: number }[]> {
    const rows = this.executeFilter()
    return [{ count: rows.length }]
  }

  async first(): Promise<Row | undefined> {
    const results = this.executeFilter()
    return results[0]
  }

  private executeFilter(): Row[] {
    let rows = [...(this.tables[this.tableName] ?? [])]
    for (const filter of this.filters) {
      rows = rows.filter(filter)
    }
    return rows
  }

  async update(vals: Record<string, any>): Promise<number> {
    const rows = this.executeFilter()
    for (const r of rows) {
      Object.assign(r, vals)
    }
    return rows.length
  }

  then(resolve: (rows: Row[]) => void): void {
    resolve(this.executeFilter())
  }
}

function makeDb(tables: Tables) {
  const dbFn: any = (table: string) => new FakeDbQuery(table, tables)
  dbFn.transaction = async (cb: (trx: any) => Promise<any>) => cb(dbFn)
  dbFn.raw = (sql: string) => sql
  dbFn.on = vi.fn()
  return dbFn
}

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
  beforeEach(() => {
    setupOrm(
      makeDb({
        vx_user: [{ id: 1, email: 'admin@moonwitness.org', name: 'Admin', token_version: 1, is_active: true }],
        sample_items: [],
      })
    )
  })

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
