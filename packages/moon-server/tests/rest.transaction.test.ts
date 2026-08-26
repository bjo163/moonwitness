import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  getModel: vi.fn(),
  createCtx: vi.fn(),
  parseBody: vi.fn(),
  parseUrl: vi.fn(),
  sendJson: vi.fn(),
  authenticateRequest: vi.fn(),
  verifyToken: vi.fn(),
}))

vi.mock('@moon/orm', () => ({
  getModel: mocks.getModel,
  createCtx: mocks.createCtx,
}))

vi.mock('../src/utils/http.js', () => ({
  parseBody: mocks.parseBody,
  parseUrl: mocks.parseUrl,
  sendJson: mocks.sendJson,
}))

vi.mock('../src/utils/auth.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../src/utils/auth.js')>()
  return {
    ...actual,
    authenticateRequest: mocks.authenticateRequest,
    verifyToken: mocks.verifyToken,
  }
})

import { handleRest } from '../src/handlers/rest.js'

function makeModel() {
  const txEnv = { uid: 42, trx: { id: 'real-transaction' } }
  const transaction = vi.fn(async (_env: unknown, callback: (env: unknown) => Promise<unknown>) => callback(txEnv))
  const spawn = vi.fn(async () => ({ id: 7, name: 'created' }))
  const morph = vi.fn(async () => true)
  const purge = vi.fn(async () => true)
  const first = vi.fn(async () => ({ id: 7, name: 'updated' }))
  const where = vi.fn(() => ({ first }))
  const query = vi.fn(() => ({ where }))

  return {
    model: { transaction, spawn, morph, purge, query },
    transaction,
    spawn,
    morph,
    purge,
    txEnv,
  }
}

describe('REST write transaction context', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.authenticateRequest.mockResolvedValue({ uid: 42 })
    mocks.verifyToken.mockReturnValue({ sub: 42 })
    mocks.createCtx.mockReturnValue({ uid: 42, trx: undefined })
    mocks.parseBody.mockResolvedValue({ name: 'value' })
    mocks.parseUrl.mockReturnValue({ searchParams: new URLSearchParams() })
    mocks.sendJson.mockImplementation(() => undefined)
  })

  it.each([
    ['POST', undefined],
    ['PUT', '7'],
    ['DELETE', '7'],
  ] as const)('%s creates a clean request context and enters the model transaction', async (method, id) => {
    const { model, transaction, txEnv, spawn, morph, purge } = makeModel()
    mocks.getModel.mockReturnValue(model)

    const req = { method, url: id ? `/api/test.model/${id}` : '/api/test.model' }
    const res = {}
    const match = [req.url, 'test.model', id] as unknown as RegExpMatchArray

    await handleRest(req as never, res as never, match, 'secret')

    expect(mocks.createCtx).toHaveBeenCalledTimes(1)
    expect(mocks.createCtx).toHaveBeenCalledWith(42, {}, mocks.getModel)
    expect(mocks.createCtx.mock.calls[0]).toHaveLength(3)
    expect(transaction).toHaveBeenCalledTimes(1)

    if (method === 'POST') {
      expect(spawn).toHaveBeenCalledWith(model, txEnv, { name: 'value' })
    } else if (method === 'PUT') {
      expect(morph).toHaveBeenCalledWith(model, txEnv, 7, { name: 'value' })
    } else {
      expect(purge).toHaveBeenCalledWith(model, txEnv, 7)
    }
  })
})
