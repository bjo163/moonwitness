import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import knex, { type Knex } from 'knex'
import { Vertex } from '../src/base.js'
import { fields } from '../src/fields.js'
import { createCtx } from '../src/env.js'
import { setupOrm, teardownOrm } from '../src/config.js'
import { ACL_CACHE_TTL_MS, invalidateAclCache } from '../src/security.js'

// Measured on the pre-optimization code with this same harness: a cold
// Vertex.fetch as uid 42 issued 10 queries (roles + model looked up twice,
// unfiltered mx_rule_vx_role_rel scan), and a warm read also issued 10.
const BASELINE_QUERIES_PER_READ = 10

class AclDemo extends Vertex {
  static override _name = 'acl.demo'
  name = fields.Char()
  companyId = fields.Integer()
}

class MxRule extends Vertex {
  static override _name = 'mx.rule'
  name = fields.Char()
  modelId = fields.Integer()
  domainForce = fields.Char()
  permRead = fields.Boolean()
}

class MxGrant extends Vertex {
  static override _name = 'mx.grant'
  modelId = fields.Integer()
  groupId = fields.Integer()
  permRead = fields.Boolean()
}

let db: Knex
let queries: string[] = []

async function seedSchema(): Promise<void> {
  await db.schema.createTable('vx_user', (t) => {
    t.increments('id').primary()
    t.string('name')
    t.integer('company_id')
    t.integer('partner_id')
  })
  await db.schema.createTable('vx_node', (t) => {
    t.increments('id').primary()
    t.string('name')
    t.string('email')
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
  await db.schema.createTable('mx_grant', (t) => {
    t.increments('id').primary()
    t.integer('model_id')
    t.integer('group_id')
    t.boolean('perm_read')
    t.boolean('perm_write')
    t.boolean('perm_create')
    t.boolean('perm_unlink')
    t.string('updated_at')
  })
  await db.schema.createTable('mx_rule', (t) => {
    t.increments('id').primary()
    t.integer('model_id')
    t.string('name')
    t.string('domain_force')
    t.boolean('perm_read')
    t.boolean('perm_write')
    t.boolean('perm_create')
    t.boolean('perm_unlink')
    t.string('updated_at')
  })
  await db.schema.createTable('mx_rule_vx_role_rel', (t) => {
    t.integer('mx_rule_id')
    t.integer('vx_role_id')
  })
  await db.schema.createTable('acl_demo', (t) => {
    t.increments('id').primary()
    t.string('name')
    t.integer('company_id')
    t.string('parent_path')
    t.boolean('is_active')
    t.string('created_at')
    t.string('updated_at')
  })

  await db('vx_user').insert({ id: 42, name: 'Alice', company_id: 7, partner_id: 900 })
  await db('vx_node').insert({ id: 900, name: 'Alice Partner', email: 'alice@example.com', company_id: 7 })
  await db('vx_user_vx_role_rel').insert({ vx_user_id: 42, vx_role_id: 10 })
  await db('mx_model').insert({ id: 100, model: 'acl.demo' })
  await db('mx_grant').insert({
    id: 1, model_id: 100, group_id: 10,
    perm_read: true, perm_write: true, perm_create: true, perm_unlink: true,
  })
  await db('mx_rule').insert({
    id: 1, model_id: 100, name: 'Company isolation',
    domain_force: '[["company_id", "=", "$user.company_id"]]',
    perm_read: true, perm_write: true, perm_create: true, perm_unlink: true,
  })
  await db('mx_rule_vx_role_rel').insert({ mx_rule_id: 1, vx_role_id: 10 })
  await db('acl_demo').insert([
    { id: 1, name: 'Own A', company_id: 7, is_active: true },
    { id: 2, name: 'Foreign', company_id: 8, is_active: true },
    { id: 3, name: 'Own B', company_id: 7, is_active: true },
  ])
}

function readAs(uid: number): Promise<Record<string, unknown>[]> {
  queries = []
  return Vertex.fetch(AclDemo, createCtx(uid), []) as Promise<Record<string, unknown>[]>
}

describe('ACL query counts (UR-BE-013)', () => {
  beforeEach(async () => {
    invalidateAclCache()
    db = knex({
      client: 'better-sqlite3',
      connection: { filename: ':memory:' },
      useNullAsDefault: true,
    })
    db.on('query', (q: { sql: string }) => queries.push(q.sql))
    await seedSchema()
    setupOrm(db)
    queries = []
  })

  afterEach(async () => {
    vi.useRealTimers()
    await teardownOrm()
  })

  it('cold read beats the baseline and never scans mx_rule_vx_role_rel unfiltered', async () => {
    const rows = await readAs(42)
    const cold = queries.length
    expect(rows.map((r) => r.id).sort()).toEqual([1, 3])
    expect(cold).toBeLessThan(BASELINE_QUERIES_PER_READ)

    const relQueries = queries.filter((sql) => sql.includes('mx_rule_vx_role_rel'))
    expect(relQueries.length).toBeGreaterThan(0)
    for (const sql of relQueries) {
      expect(sql.toLowerCase()).toContain('where')
    }
  })

  it('warm read within the TTL issues only the data query', async () => {
    await readAs(42)
    const warmRows = await readAs(42)
    expect(warmRows.map((r) => r.id).sort()).toEqual([1, 3])
    expect(queries.length).toBe(1)
    expect(queries[0]).toContain('acl_demo')
  })

  it('re-queries after the cache TTL expires', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    await readAs(42)
    vi.setSystemTime(Date.now() + ACL_CACHE_TTL_MS + 1)
    await readAs(42)
    expect(queries.length).toBeGreaterThan(1)
  })

  it('applies rule changes made through the ORM immediately', async () => {
    await readAs(42)
    await Vertex.morph(MxRule, createCtx(1), 1, {
      domainForce: '[["company_id", "=", 8]]',
    })
    const rows = await readAs(42)
    expect(rows.map((r) => r.id)).toEqual([2])
  })

  it('applies grant revocation made through the ORM immediately', async () => {
    await readAs(42)
    await Vertex.morph(MxGrant, createCtx(1), 1, { permRead: false })
    await expect(readAs(42)).rejects.toMatchObject({ code: 'ACCESS_DENIED' })
  })
})