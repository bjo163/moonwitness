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

    await expect(checkAccessRights(model('public.model', true), createCtx(0), 'permWrite')).rejects.toMatchObject({
      name: 'AuthorizationError',
      code: 'AUTH_REQUIRED',
      statusCode: 401,
    })
  })

  it('keeps anonymous auth exceptions narrow and explicit', async () => {
    const loginEnv = createCtx(0, authSecurityContext('login'))

    await expect(checkAccessRights(model('vx.user'), loginEnv, 'permRead')).resolves.toBeUndefined()
    await expect(checkAccessRights(model('vx.user'), loginEnv, 'permWrite')).rejects.toMatchObject({
      code: 'AUTH_REQUIRED',
    })
  })

  it('denies authenticated users with no groups', async () => {
    mocks.getDb.mockReturnValue(makeDb({
      vx_user_vx_role_rel: [],
    }))

    await expect(checkAccessRights(model('demo.model'), createCtx(42), 'permRead')).rejects.toMatchObject({
      code: 'ACCESS_DENIED',
      statusCode: 403,
    })
  })

  it('denies when model security metadata is missing', async () => {
    mocks.getDb.mockReturnValue(makeDb({
      vx_user_vx_role_rel: [{ vx_user_id: 42, vx_role_id: 7 }],
      mx_model: [],
    }))

    await expect(checkAccessRights(model('demo.model'), createCtx(42), 'permRead')).rejects.toMatchObject({
      code: 'SECURITY_METADATA_MISSING',
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

    await expect(checkAccessRights(model('demo.model'), env, 'permWrite')).rejects.toMatchObject({
      code: 'ACCESS_DENIED',
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

    await expect(getRecordRulesDomain(model('demo.model'), createCtx(42))).rejects.toMatchObject({
      code: 'SECURITY_RULE_INVALID',
    })
  })

  it('evaluates declarative record rules and resolves user variables safely', async () => {
    mocks.getDb.mockReturnValue(makeDb({
      vx_user_vx_role_rel: [{ vx_user_id: 42, vx_role_id: 7 }],
      mx_model: [{ id: 11, model: 'demo.model' }],
      ir_rule_res_groups_rel: [{ vx_role_id: 7, ir_rule_id: 5 }],
      mx_rule: [{
        id: 5,
        model_id: 11,
        name: 'Owner or company rule',
        domain_force: '[["owner_id", "=", "$user.id"], ["company_id", "in", "$user.company_ids"]]'
      }],
      vx_user: [{ id: 42, name: 'Operator', company_id: 99, company_ids: [99, 100] }],
    }))

    const domain = await getRecordRulesDomain(model('demo.model'), createCtx(42))
    expect(domain).toEqual([
      ['owner_id', '=', 42],
      ['company_id', 'in', [99, 100]],
    ])
  })

  it('combines multiple record rules with OR logic deterministically', async () => {
    mocks.getDb.mockReturnValue(makeDb({
      vx_user_vx_role_rel: [{ vx_user_id: 42, vx_role_id: 7 }],
      mx_model: [{ id: 11, model: 'demo.model' }],
      ir_rule_res_groups_rel: [
        { vx_role_id: 7, ir_rule_id: 1 },
        { vx_role_id: 7, ir_rule_id: 2 }
      ],
      mx_rule: [
        { id: 1, model_id: 11, name: 'Rule 1', domain_force: '[["state", "=", "public"]]' },
        { id: 2, model_id: 11, name: 'Rule 2', domain_force: '[["owner_id", "=", "$user.id"]]' },
      ],
      vx_user: [{ id: 42, name: 'Operator' }],
    }))

    const domain = await getRecordRulesDomain(model('demo.model'), createCtx(42))
    expect(domain).toEqual([
      '|',
      ['state', '=', 'public'],
      ['owner_id', '=', 42]
    ])
  })

  it('rejects dynamic code injection without executing JavaScript', async () => {
    mocks.getDb.mockReturnValue(makeDb({
      vx_user_vx_role_rel: [{ vx_user_id: 42, vx_role_id: 7 }],
      mx_model: [{ id: 11, model: 'demo.model' }],
      ir_rule_res_groups_rel: [{ vx_role_id: 7, ir_rule_id: 9 }],
      mx_rule: [{
        id: 9,
        model_id: 11,
        name: 'Malicious rule',
        domain_force: 'process.exit(1) || [["a", "=", 1]]'
      }],
      vx_user: [{ id: 42, name: 'Operator' }],
    }))

    await expect(getRecordRulesDomain(model('demo.model'), createCtx(42))).rejects.toMatchObject({
      code: 'SECURITY_RULE_INVALID',
    })
  })

  it('fails closed on unknown user variables', async () => {
    mocks.getDb.mockReturnValue(makeDb({
      vx_user_vx_role_rel: [{ vx_user_id: 42, vx_role_id: 7 }],
      mx_model: [{ id: 11, model: 'demo.model' }],
      ir_rule_res_groups_rel: [{ vx_role_id: 7, ir_rule_id: 10 }],
      mx_rule: [{
        id: 10,
        model_id: 11,
        name: 'Unknown var rule',
        domain_force: '[["secret_field", "=", "$user.nonexistent_field"]]'
      }],
      vx_user: [{ id: 42, name: 'Operator' }],
    }))

    await expect(getRecordRulesDomain(model('demo.model'), createCtx(42))).rejects.toMatchObject({
      code: 'SECURITY_RULE_INVALID',
    })
  })

  it('exposes authorization failures as a typed error', () => {
    const error = new AuthorizationError('ACCESS_DENIED', 'denied')
    expect(error).toBeInstanceOf(Error)
    expect(error.statusCode).toBe(403)
  })
})
