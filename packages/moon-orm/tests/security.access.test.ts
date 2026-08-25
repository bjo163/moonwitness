import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  getDb: vi.fn(),
}))

vi.mock('../src/config.js', () => ({
  getDb: mocks.getDb,
}))

import { createCtx } from '../src/env.js'
import {
  AuthorizationError,
  authSecurityContext,
  checkAccessRights,
  getRecordRulesDomain,
} from '../src/security.js'
import type { Vertex } from '../src/base.js'

type Row = Record<string, unknown>
type Tables = Record<string, Row[]>

class FakeQuery {
  private rows: Row[]

  constructor(rows: Row[]) {
    this.rows = [...rows]
  }

  where(column: string | Record<string, unknown>, value?: unknown): this {
    if (typeof column === 'string') {
      this.rows = this.rows.filter((row) => row[column] === value)
      return this
    }

    this.rows = this.rows.filter((row) =>
      Object.entries(column).every(([key, expected]) => row[key] === expected)
    )
    return this
  }

  whereIn(column: string, values: unknown[]): this {
    this.rows = this.rows.filter((row) => values.includes(row[column]))
    return this
  }

  async select(...columns: string[]): Promise<Row[]> {
    if (columns.length === 0 || columns.includes('*')) return this.rows
    return this.rows.map((row) =>
      Object.fromEntries(columns.map((column) => [column, row[column]]))
    )
  }

  async first(): Promise<Row | undefined> {
    return this.rows[0]
  }
}

function makeDb(tables: Tables) {
  return (table: string) => new FakeQuery(tables[table] ?? [])
}

function model(name: string, isPublic = false): typeof Vertex {
  return { _name: name, _public: isPublic } as unknown as typeof Vertex
}

function expectAuthError(error: unknown, code: AuthorizationError['code']) {
  expect(error).toBeInstanceOf(AuthorizationError)
  expect((error as AuthorizationError).code).toBe(code)
}

describe('Moon ORM fail-closed authorization', () => {
  beforeEach(() => {
    mocks.getDb.mockReset()
    mocks.getDb.mockReturnValue(makeDb({}))
  })

  it('allows superuser without security metadata', async () => {
    await expect(checkAccessRights(model('demo.model'), createCtx(1), 'permWrite')).resolves.toBeUndefined()
  })

  it('allows anonymous reads only for explicitly public models', async () => {
    await expect(checkAccessRights(model('public.model', true), createCtx(0), 'permRead')).resolves.toBeUndefined()

    await expect(checkAccessRights(model('public.model', true), createCtx(0), 'permWrite')).rejects.toSatisfy((error) => {
      expectAuthError(error, 'AUTH_REQUIRED')
      return true
    })
  })

  it('keeps anonymous auth exceptions narrow and explicit', async () => {
    const loginEnv = createCtx(0, authSecurityContext('login'))

    await expect(checkAccessRights(model('vx.user'), loginEnv, 'permRead')).resolves.toBeUndefined()
    await expect(checkAccessRights(model('vx.user'), loginEnv, 'permWrite')).rejects.toSatisfy((error) => {
      expectAuthError(error, 'AUTH_REQUIRED')
      return true
    })
  })

  it('denies authenticated users with no groups', async () => {
    mocks.getDb.mockReturnValue(makeDb({
      vx_user_vx_role_rel: [],
    }))

    await expect(checkAccessRights(model('demo.model'), createCtx(42), 'permRead')).rejects.toSatisfy((error) => {
      expectAuthError(error, 'ACCESS_DENIED')
      return true
    })
  })

  it('denies when model security metadata is missing', async () => {
    mocks.getDb.mockReturnValue(makeDb({
      vx_user_vx_role_rel: [{ vx_user_id: 42, vx_role_id: 7 }],
      mx_model: [],
    }))

    await expect(checkAccessRights(model('demo.model'), createCtx(42), 'permRead')).rejects.toSatisfy((error) => {
      expectAuthError(error, 'SECURITY_METADATA_MISSING')
      return true
    })
  })

  it('allows only an explicit matching grant', async () => {
    mocks.getDb.mockReturnValue(makeDb({
      vx_user_vx_role_rel: [{ vx_user_id: 42, vx_role_id: 7 }],
      mx_model: [{ id: 11, model: 'demo.model' }],
      mx_grant: [{ model_id: 11, group_id: 7, perm_read: true, perm_write: false }],
    }))

    const env = createCtx(42)
    await expect(checkAccessRights(model('demo.model'), env, 'permRead')).resolves.toBeUndefined()

    await expect(checkAccessRights(model('demo.model'), env, 'permWrite')).rejects.toSatisfy((error) => {
      expectAuthError(error, 'ACCESS_DENIED')
      return true
    })
  })

  it('fails closed when a persisted record rule cannot be evaluated', async () => {
    mocks.getDb.mockReturnValue(makeDb({
      vx_user_vx_role_rel: [{ vx_user_id: 42, vx_role_id: 7 }],
      mx_model: [{ id: 11, model: 'demo.model' }],
      ir_rule_res_groups_rel: [{ vx_role_id: 7, ir_rule_id: 5 }],
      mx_rule: [{ id: 5, model_id: 11, name: 'Broken rule', domain_force: '(()' }],
      vx_user: [{ id: 42, name: 'Operator' }],
    }))

    await expect(getRecordRulesDomain(model('demo.model'), createCtx(42))).rejects.toSatisfy((error) => {
      expectAuthError(error, 'SECURITY_RULE_INVALID')
      return true
    })
  })
})
