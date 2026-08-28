import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { EventEmitter } from 'node:events'
import jwt from 'jsonwebtoken'
import {
  registerModel,
  setupOrm,
  Vertex,
  fields,
  ANONYMOUS_ID,
  SUPERUSER_ID,
  createCtx,
  getModel,
} from '@moon/orm'
import { handleRpc } from '../src/handlers/rpc.js'
import { logger } from '../src/logger.js'
import { validateRpcMethod, isAllowedRpcMethod, defineProcedure, getRegisteredProcedure, getAllRegisteredProcedures } from '../src/rpc-registry.js'

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
}

registerModel(VxUser)

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
      for (const r of rows) {
        Object.assign(r, vals)
      }
      return rows.length
    },
    then(resolve: (rows: Row[]) => void) {
      resolve(tables[table] ?? [])
    }
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
    },
    end: (data: string) => {
      responseData = data
    },
  }

  return {
    res,
    getResult: () => ({
      status: statusCode,
      body: responseData ? JSON.parse(responseData) : {},
    }),
  }
}

describe('RPC Registry (#114)', () => {
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
  })

  it('rejects invalid method name format with special characters', async () => {
    const token = jwt.sign({ sub: 42 }, TEST_SECRET, { algorithm: 'HS256' })
    const req = createMockRpcReq({ model: 'vx.user', method: 'bad-method!' }, `Bearer ${token}`)
    const { res, getResult } = createMockRes()

    await handleRpc(req, res, TEST_SECRET)
    const result = getResult()

    expect(result.status).toBe(403)
    expect(result.body.code).toBe('FORBIDDEN_METHOD')
    expect(result.body.error).toBe('Invalid method name format: bad-method!')
    expect(logger.warn).toHaveBeenCalledWith('moon.rpc.audit', 'Forbidden method', {
      uid: 42,
      model: 'vx.user',
      method: 'bad-method!',
      reason: 'Invalid method name format: bad-method!'
    })
  })

  it('rejects dunder methods', async () => {
    const token = jwt.sign({ sub: 42 }, TEST_SECRET, { algorithm: 'HS256' })
    const req = createMockRpcReq({ model: 'vx.user', method: '__init__' }, `Bearer ${token}`)
    const { res, getResult } = createMockRes()

    await handleRpc(req, res, TEST_SECRET)
    const result = getResult()

    expect(result.status).toBe(403)
    expect(result.body.code).toBe('FORBIDDEN_METHOD')
    expect(result.body.error).toBe('Dunder methods are not allowed: __init__')
  })

  it('rejects methods starting with underscore', async () => {
    const token = jwt.sign({ sub: 42 }, TEST_SECRET, { algorithm: 'HS256' })
    const req = createMockRpcReq({ model: 'vx.user', method: '_private' }, `Bearer ${token}`)
    const { res, getResult } = createMockRes()

    await handleRpc(req, res, TEST_SECRET)
    const result = getResult()

    expect(result.status).toBe(403)
    expect(result.body.code).toBe('FORBIDDEN_METHOD')
    expect(result.body.error).toBe('Private methods are not allowed: _private')
  })

  it('rejects all dangerous methods in the denylist', async () => {
    const dangerousMethods = [
      'spawn',
      'morph',
      'purge',
      'destroy',
      'unlink',
      'create',
      'write',
      'update',
      'delete',
      'transaction',
      'emitEvent',
      'getFieldDefs',
      'tableName'
    ]

    for (const method of dangerousMethods) {
      const token = jwt.sign({ sub: 42 }, TEST_SECRET, { algorithm: 'HS256' })
      const req = createMockRpcReq({ model: 'vx.user', method }, `Bearer ${token}`)
      const { res, getResult } = createMockRes()

      await handleRpc(req, res, TEST_SECRET)
      const result = getResult()

      expect(result.status).toBe(403)
      expect(result.body.code).toBe('FORBIDDEN_METHOD')
      expect(result.body.error).toBe(`Method ${method} is not registered for RPC access`)
    }
  })

  it('allows safe methods like fetch', async () => {
    const token = jwt.sign({ sub: 42 }, TEST_SECRET, { algorithm: 'HS256' })
    const req = createMockRpcReq({ model: 'vx.user', method: 'fetch', args: [] }, `Bearer ${token}`)
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
      method: 'fetch'
    })
  })

  it('rejects unregistered methods even if they exist on the model', async () => {
    const token = jwt.sign({ sub: 42 }, TEST_SECRET, { algorithm: 'HS256' })
    const req = createMockRpcReq({ model: 'vx.user', method: 'customUnregistered', args: [] }, `Bearer ${token}`)
    const { res, getResult } = createMockRes()

    await handleRpc(req, res, TEST_SECRET)
    const result = getResult()

    expect(result.status).toBe(403)
    expect(result.body.code).toBe('FORBIDDEN_METHOD')
    expect(result.body.error).toBe('Method customUnregistered is not registered for RPC access')
  })

  it('rejects invalid body schema with Zod validation', async () => {
    const token = jwt.sign({ sub: 42 }, TEST_SECRET, { algorithm: 'HS256' })
    const req = createMockRpcReq({ invalid: 'body' }, `Bearer ${token}`)
    const { res, getResult } = createMockRes()

    await handleRpc(req, res, TEST_SECRET)
    const result = getResult()

    expect(result.status).toBe(400)
    expect(result.body.code).toBe('INVALID_REQUEST')
    expect(logger.warn).toHaveBeenCalledWith('moon.rpc.audit', 'Invalid RPC body', {
      uid: 42,
      error: expect.any(String)
    })
  })

  it('rejects missing method in body via Zod validation', async () => {
    const token = jwt.sign({ sub: 42 }, TEST_SECRET, { algorithm: 'HS256' })
    const req = createMockRpcReq({ model: 'vx.user' }, `Bearer ${token}`)
    const { res, getResult } = createMockRes()

    await handleRpc(req, res, TEST_SECRET)
    const result = getResult()

    expect(result.status).toBe(400)
    expect(result.body.code).toBe('INVALID_REQUEST')
    expect(logger.warn).toHaveBeenCalledWith('moon.rpc.audit', 'Invalid RPC body', {
      uid: 42,
      error: expect.any(String)
    })
  })

  it('rejects nonexistent model', async () => {
    const token = jwt.sign({ sub: 42 }, TEST_SECRET, { algorithm: 'HS256' })
    const req = createMockRpcReq({ model: 'nonexistent.model', method: 'fetch' }, `Bearer ${token}`)
    const { res, getResult } = createMockRes()

    await handleRpc(req, res, TEST_SECRET)
    const result = getResult()

    expect(result.status).toBe(404)
    expect(result.body.code).toBe('MODEL_NOT_FOUND')
  })

  it('rejects method not found on model with 403 for unregistered methods', async () => {
    const token = jwt.sign({ sub: 42 }, TEST_SECRET, { algorithm: 'HS256' })
    const req = createMockRpcReq({ model: 'vx.user', method: 'nonexistent' }, `Bearer ${token}`)
    const { res, getResult } = createMockRes()

    await handleRpc(req, res, TEST_SECRET)
    const result = getResult()

    expect(result.status).toBe(403)
    expect(result.body.code).toBe('FORBIDDEN_METHOD')
    expect(result.body.error).toBe('Method nonexistent is not registered for RPC access')
  })

  it('audits successful RPC execution with uid, model, and method', async () => {
    const token = jwt.sign({ sub: 42 }, TEST_SECRET, { algorithm: 'HS256' })
    const req = createMockRpcReq({ model: 'vx.user', method: 'fetch', args: [] }, `Bearer ${token}`)
    const { res } = createMockRes()

    await handleRpc(req, res, TEST_SECRET)

    expect(logger.info).toHaveBeenCalledWith('moon.rpc.audit', 'RPC executed', {
      uid: 42,
      model: 'vx.user',
      method: 'fetch'
    })
  })
})

describe('RPC Registry (#114)', () => {
  it('allows safe readonly methods by default', () => {
    expect(isAllowedRpcMethod('fetch')).toBe(true)
    expect(isAllowedRpcMethod('count')).toBe(true)
    expect(isAllowedRpcMethod('searchCount')).toBe(true)
    expect(isAllowedRpcMethod('readGroup')).toBe(true)
  })

  it('blocks dangerous methods by default', () => {
    expect(isAllowedRpcMethod('spawn')).toBe(false)
    expect(isAllowedRpcMethod('morph')).toBe(false)
    expect(isAllowedRpcMethod('purge')).toBe(false)
    expect(isAllowedRpcMethod('processRelationalTuples')).toBe(false)
    expect(isAllowedRpcMethod('validateData')).toBe(false)
  })

  it('validates method names with explicit error messages', () => {
    expect(validateRpcMethod('bad!').error).toBe('Invalid method name format: bad!')
    expect(validateRpcMethod('__init__').error).toBe('Dunder methods are not allowed: __init__')
    expect(validateRpcMethod('_private').error).toBe('Private methods are not allowed: _private')
    expect(validateRpcMethod('spawn').error).toBe('Method spawn is not registered for RPC access')
    expect(validateRpcMethod('nonexistent').error).toBe('Method nonexistent is not registered for RPC access')
    expect(validateRpcMethod('fetch').ok).toBe(true)
  })

  it('supports explicit procedure registration via defineProcedure', () => {
    defineProcedure({
      name: 'custom.fetch',
      description: 'Custom fetch procedure',
    })

    const procedures = getAllRegisteredProcedures()
    expect(procedures.some(p => p.name === 'custom.fetch')).toBe(true)
    expect(getRegisteredProcedure('custom.fetch')?.name).toBe('custom.fetch')
  })
})
