import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { EventEmitter } from 'node:events'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import {
  registerModel,
  setupOrm,
  Vertex,
  fields,
} from '@moon/orm'
import { handleRpc } from '../src/handlers/rpc.js'
import { logger } from '../src/logger.js'
import {
  validateRpcMethod,
  isAllowedRpcMethod,
  defineProcedure,
  getRegisteredProcedure,
  getAllRegisteredProcedures,
} from '../src/rpc-registry.js'

const TEST_SECRET = 'super-secret-jwt-key-for-rpc-security-test-32chars!'

class VxUser extends Vertex {
  static override _name = 'vx.user'
  static override _public = true
  static override _softDelete = false
  email = fields.Char({ required: true })
  name = fields.Char()
  password = fields.Char({ required: true })
  tokenVersion = fields.Integer({ default: 1 })
  isActive = fields.Boolean({ default: true })

  static async customUnregistered() {
    return 'must-never-be-remotely-visible'
  }
}

registerModel(VxUser)

defineProcedure({
  name: 'operator.echo',
  description: 'Test-only explicit procedure',
  input: z.object({
    model: z.string(),
    args: z.array(z.string()).length(1),
    kwargs: z.record(z.unknown()),
  }),
  output: z.object({ echo: z.string() }),
  handler: async (_ctx, input) => ({ echo: input.args[0]! }),
})

type Row = Record<string, any>
type Tables = Record<string, Row[]>

function makeDb(tables: Tables) {
  const dbFn: any = (table: string) => ({
    table,
    where: () => dbFn,
    andWhere: () => dbFn,
    orWhere: () => dbFn,
    whereIn: () => dbFn,
    select: () => dbFn,
    orderBy: () => dbFn,
    limit: () => dbFn,
    offset: () => dbFn,
    async count() {
      const rows = tables[table] ?? []
      return [{ count: rows.length }]
    },
    async first() {
      return (tables[table] ?? [])[0]
    },
    async update(vals: Record<string, any>) {
      const rows = tables[table] ?? []
      for (const r of rows) Object.assign(r, vals)
      return rows.length
    },
    then(resolve: (rows: Row[]) => void) {
      resolve(tables[table] ?? [])
    },
  })
  dbFn.transaction = async (cb: (trx: any) => Promise<any>) => cb(dbFn)
  dbFn.raw = (sql: string) => sql
  dbFn.on = () => {}
  return dbFn
}

function createMockRpcReq(body: any, authHeader?: string): IncomingMessage {
  const emitter = new EventEmitter() as any
  emitter.headers = {
    ...(authHeader !== undefined ? { authorization: authHeader } : {}),
  }
  emitter.destroy = () => {}
  emitter.method = 'POST'
  emitter.url = '/rpc'

  process.nextTick(() => {
    emitter.emit('data', JSON.stringify(body))
    emitter.emit('end')
  })

  return emitter
}

function createMockRes(): { res: ServerResponse; getResult: () => { status: number; body: any } } {
  let statusCode = 200
  let responseData = ''
  const res: any = {
    statusCode: 200,
    setHeader: vi.fn(),
    writeHead: (code: number) => {
      statusCode = code
      res.statusCode = code
    },
    end: (data?: string) => {
      responseData = data ?? ''
      res.writableEnded = true
    },
    writableEnded: false,
  }

  return {
    res,
    getResult: () => ({
      status: statusCode,
      body: responseData ? JSON.parse(responseData) : {},
    }),
  }
}

function authToken() {
  return `Bearer ${jwt.sign({ sub: 42 }, TEST_SECRET, { algorithm: 'HS256' })}`
}

beforeEach(() => {
  setupOrm(makeDb({
    vx_user: [
      {
        id: 42,
        email: 'operator@moonwitness.org',
        name: 'Operator Alice',
        password: 'hashed-password',
        token_version: 1,
        is_active: true,
      },
    ],
    mx_model: [{ id: 1, model: 'vx.user' }],
  }))
  vi.spyOn(logger, 'warn').mockImplementation(() => {})
  vi.spyOn(logger, 'info').mockImplementation(() => {})
  vi.spyOn(logger, 'error').mockImplementation(() => {})
})

describe('RPC explicit procedure boundary (#114)', () => {
  it('keeps canonical readonly compatibility as explicit built-in procedures', () => {
    expect(isAllowedRpcMethod('fetch')).toBe(true)
    expect(isAllowedRpcMethod('count')).toBe(true)
    expect(isAllowedRpcMethod('searchCount')).toBe(true)
    expect(isAllowedRpcMethod('readGroup')).toBe(true)
    expect(getRegisteredProcedure('fetch')?.handler).toBeTypeOf('function')
  })

  it('rejects invalid, private, dunder, mutation, inherited and new static methods', async () => {
    const forbidden = [
      'bad-method!',
      '__init__',
      '_private',
      'spawn',
      'morph',
      'purge',
      'transaction',
      'getFieldDefs',
      'tableName',
      'processRelationalTuples',
      'validateData',
      'customUnregistered',
    ]

    for (const method of forbidden) {
      const req = createMockRpcReq({ model: 'vx.user', method, args: [] }, authToken())
      const { res, getResult } = createMockRes()
      await handleRpc(req, res, TEST_SECRET)
      expect(getResult().status).toBe(403)
      expect(getResult().body.code).toBe('FORBIDDEN_METHOD')
    }
  })

  it('executes fetch only through its registered handler', async () => {
    const req = createMockRpcReq({ model: 'vx.user', method: 'fetch', args: [] }, authToken())
    const { res, getResult } = createMockRes()

    await handleRpc(req, res, TEST_SECRET)
    const result = getResult()

    expect(result.status).toBe(200)
    expect(result.body.result).toEqual([
      {
        id: 42,
        email: 'operator@moonwitness.org',
        name: 'Operator Alice',
        password: 'hashed-password',
        token_version: 1,
        is_active: true,
      },
    ])
    expect(logger.info).toHaveBeenCalledWith('moon.rpc.audit', 'RPC executed', {
      uid: 42,
      model: 'vx.user',
      method: 'fetch',
    })
  })

  it('runs an explicitly registered custom procedure', async () => {
    const req = createMockRpcReq(
      { model: 'vx.user', method: 'operator.echo', args: ['hello'], kwargs: {} },
      authToken(),
    )
    const { res, getResult } = createMockRes()

    await handleRpc(req, res, TEST_SECRET)

    expect(getResult()).toEqual({ status: 200, body: { result: { echo: 'hello' } } })
  })

  it('rejects malformed per-procedure input before handler execution', async () => {
    const procedure = getRegisteredProcedure('operator.echo')!
    const spy = vi.spyOn(procedure, 'handler')
    const req = createMockRpcReq(
      { model: 'vx.user', method: 'operator.echo', args: [123], kwargs: {} },
      authToken(),
    )
    const { res, getResult } = createMockRes()

    await handleRpc(req, res, TEST_SECRET)

    expect(getResult().status).toBe(400)
    expect(getResult().body.code).toBe('RPC_VALIDATION_ERROR')
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })

  it('rejects invalid envelope bodies', async () => {
    const req = createMockRpcReq({ invalid: 'body' }, authToken())
    const { res, getResult } = createMockRes()

    await handleRpc(req, res, TEST_SECRET)

    expect(getResult().status).toBe(400)
    expect(getResult().body.code).toBe('INVALID_REQUEST')
  })

  it('rejects nonexistent models without invoking the procedure', async () => {
    const procedure = getRegisteredProcedure('fetch')!
    const spy = vi.spyOn(procedure, 'handler')
    const req = createMockRpcReq({ model: 'nonexistent.model', method: 'fetch', args: [] }, authToken())
    const { res, getResult } = createMockRes()

    await handleRpc(req, res, TEST_SECRET)

    expect(getResult().status).toBe(404)
    expect(getResult().body.code).toBe('MODEL_NOT_FOUND')
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })

  it('exposes only registered names, never class shape', () => {
    expect(validateRpcMethod('customUnregistered').ok).toBe(false)
    expect(validateRpcMethod('processRelationalTuples').ok).toBe(false)
    expect(validateRpcMethod('fetch').ok).toBe(true)
    expect(validateRpcMethod('operator.echo').ok).toBe(true)
    expect(getAllRegisteredProcedures().map((p) => p.name)).toEqual(
      expect.arrayContaining(['fetch', 'count', 'searchCount', 'readGroup', 'operator.echo']),
    )
  })
})
