import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import knex, { type Knex } from 'knex'
import { applyDomain } from '../src/domain-query.js'
import { ALLOWED_RECORD_RULE_OPERATORS, AuthorizationError, getRecordRulesDomain } from '../src/security.js'
import { setDialect } from '../src/dialect.js'
import { setupOrm, teardownOrm, getDb } from '../src/config.js'
import { createCtx } from '../src/env.js'
import type { Vertex } from '../src/base.js'

const operators = [...ALLOWED_RECORD_RULE_OPERATORS]

interface RecordedClause {
  method: string
  args: unknown[]
}

class QueryRecorder {
  clauses: RecordedClause[] = []

  private record(method: string, args: unknown[]): this {
    this.clauses.push({ method, args })
    return this
  }

  where(...args: unknown[]): this { return this.record('where', args) }
  whereNot(...args: unknown[]): this { return this.record('whereNot', args) }
  whereIn(...args: unknown[]): this { return this.record('whereIn', args) }
  whereNotIn(...args: unknown[]): this { return this.record('whereNotIn', args) }
  whereRaw(...args: unknown[]): this { return this.record('whereRaw', args) }
}

function valueFor(operator: string): unknown {
  if (operator === 'in' || operator === 'not in') return [1, 2]
  if (operator === 'child_of' || operator === 'parent_of') return 5
  if (operator.includes('like')) return 'abc'
  return 7
}

describe('record-rule operator parity (UR-BE-001)', () => {
  beforeAll(() => {
    setDialect('sqlite')
  })

  it('tests exactly the live allowlist, not a hardcoded copy', () => {
    expect(ALLOWED_RECORD_RULE_OPERATORS.size).toBe(17)
    expect(operators.length).toBe(ALLOWED_RECORD_RULE_OPERATORS.size)
  })

  it.each(operators)('operator "%s" adds at least one constraining clause', (operator) => {
    const recorder = new QueryRecorder()
    applyDomain(recorder, [['name', operator, valueFor(operator)]])
    expect(recorder.clauses.length).toBeGreaterThanOrEqual(1)
  })

  it('throws an authorization error for an unknown operator without emitting a query', () => {
    const recorder = new QueryRecorder()
    let caught: unknown
    try {
      applyDomain(recorder, [['name', 'bogus', 1]])
    } catch (err) {
      caught = err
    }
    expect(caught).toBeInstanceOf(AuthorizationError)
    expect(caught).toMatchObject({ code: 'SECURITY_RULE_INVALID', statusCode: 403 })
    expect((caught as Error).message).toContain('bogus')
    expect(recorder.clauses).toHaveLength(0)
  })

  it('maps ilike-family operators per dialect', () => {
    setDialect('pg')
    try {
      for (const operator of ['ilike', 'not ilike', '=ilike']) {
        const recorder = new QueryRecorder()
        applyDomain(recorder, [['name', operator, 'abc']])
        expect(recorder.clauses[0]!.args[1]).toBe('ilike')
      }
    } finally {
      setDialect('sqlite')
    }
    for (const operator of ['ilike', 'not ilike', '=ilike']) {
      const recorder = new QueryRecorder()
      applyDomain(recorder, [['name', operator, 'abc']])
      expect(recorder.clauses[0]!.args[1]).toBe('like')
    }
  })

  it('keeps "=like" patterns exact while "like" wraps substrings', () => {
    const exact = new QueryRecorder()
    applyDomain(exact, [['name', '=like', 'a%']])
    expect(exact.clauses[0]!.args[2]).toBe('a%')

    const substring = new QueryRecorder()
    applyDomain(substring, [['name', 'like', 'a']])
    expect(substring.clauses[0]!.args[2]).toBe('%a%')
  })
})

describe('tenant isolation through record rules (S-04)', () => {
  let db: Knex

  beforeAll(async () => {
    db = knex({
      client: 'better-sqlite3',
      connection: { filename: ':memory:' },
      useNullAsDefault: true,
    })
    setupOrm(db)

    await db.schema.createTable('vx_user', (t) => {
      t.increments('id').primary()
      t.integer('company_id')
    })
    await db.schema.createTable('vx_user_vx_role_rel', (t) => {
      t.integer('vx_user_id')
      t.integer('vx_role_id')
    })
    await db.schema.createTable('mx_model', (t) => {
      t.increments('id').primary()
      t.string('model')
    })
    await db.schema.createTable('mx_rule', (t) => {
      t.increments('id').primary()
      t.integer('model_id')
      t.string('domain_force')
      t.boolean('perm_read')
    })
    await db.schema.createTable('mx_rule_vx_role_rel', (t) => {
      t.integer('mx_rule_id')
      t.integer('vx_role_id')
    })
    await db.schema.createTable('demo_tenant', (t) => {
      t.increments('id').primary()
      t.integer('company_id')
    })

    await db('vx_user').insert({ id: 42, company_id: 7 })
    await db('vx_user_vx_role_rel').insert({ vx_user_id: 42, vx_role_id: 7 })
    await db('mx_model').insert({ id: 11, model: 'demo.tenant' })
    await db('mx_rule').insert({
      id: 1,
      model_id: 11,
      domain_force: '[["company_id", "=", "$user.company_id"]]',
      perm_read: true,
    })
    await db('demo_tenant').insert([
      { id: 1, company_id: 7 },
      { id: 2, company_id: 8 },
      { id: 3, company_id: 7 },
    ])
  })

  afterAll(async () => {
    await teardownOrm()
  })

  it('non-superuser only sees rows of their own company', async () => {
    const model = { _name: 'demo.tenant', _public: false } as unknown as typeof Vertex
    const domain = await getRecordRulesDomain(model, createCtx(42), 'permRead')
    expect(domain).toEqual([['company_id', '=', 7]])

    const query = getDb()('demo_tenant')
    applyDomain(query, domain, 'demo_tenant')
    const rows = (await query.select('id', 'company_id')) as Array<{ id: number; company_id: number }>

    expect(rows.map((r) => r.id).sort()).toEqual([1, 3])
    expect(rows.every((r) => r.company_id === 7)).toBe(true)
  })
})