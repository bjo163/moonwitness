import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import knex from 'knex'
import { FastifyAdapter } from '../src/fastify-adapter.js'
import { teardownOrm } from '@moon/orm'

const STRONG_SECRET = 'production-grade-test-secret-32chars!!'
const ORIGINAL_NODE_ENV = process.env.NODE_ENV

function construct(database: any) {
  return new FastifyAdapter({ database, jwtSecret: STRONG_SECRET })
}

describe('Production database guard normalization (T-26)', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'production'
  })

  afterEach(async () => {
    process.env.NODE_ENV = ORIGINAL_NODE_ENV
    await teardownOrm()
  })

  it.each([
    ['empty string', ''],
    ['whitespace string', '   '],
    ['localhost URL', 'postgres://u:p@localhost:5432/moon'],
    ['loopback IP URL', 'postgres://u:p@127.0.0.1/moon'],
    ['sqlite URL', 'sqlite://./data/dev.db'],
    ['plain db file path', './data/dev.db'],
    [':memory:', ':memory:'],
    ['non-PostgreSQL dialect URL', 'mysql://u:p@db.internal/moon'],
  ])('rejects %s in production', (_label, database) => {
    expect(() => construct(database)).toThrow(/moon\.security/)
  })

  it('rejects undefined database in production', () => {
    expect(() => construct(undefined)).toThrow(/moon\.security/)
  })

  it('rejects a Knex.Config object pointing at localhost (the vacuous-guard regression)', () => {
    expect(() => construct({ client: 'pg', connection: { host: 'localhost', database: 'moon' } }))
      .toThrow(/non-localhost/)
  })

  it('rejects a Knex.Config object with a localhost connection string', () => {
    expect(() => construct({ client: 'pg', connection: 'postgres://u:p@localhost/moon' }))
      .toThrow(/non-localhost/)
  })

  it('rejects a Knex.Config SQLite object', () => {
    expect(() => construct({ client: 'better-sqlite3', connection: { filename: ':memory:' } }))
      .toThrow(/SQLite/)
  })

  it('rejects a Knex.Config object with a non-PostgreSQL dialect', () => {
    expect(() => construct({ client: 'mysql2', connection: { host: 'db.internal', database: 'moon' } }))
      .toThrow(/PostgreSQL/)
  })

  it('rejects a live Knex instance pointing at localhost', () => {
    const instance = knex({ client: 'pg', connection: { host: 'localhost', database: 'moon' } })
    try {
      expect(() => construct(instance)).toThrow(/non-localhost/)
    } finally {
      instance.destroy()
    }
  })

  it('accepts a valid PostgreSQL URL string', () => {
    expect(() => construct('postgres://u:p@db.internal:5432/moon')).not.toThrow()
  })

  it('accepts a valid Knex.Config object', () => {
    expect(() => construct({
      client: 'pg',
      connection: { host: 'db.internal', port: 5432, database: 'moon', user: 'u', password: 'p' },
    })).not.toThrow()
  })

  it('accepts a valid live Knex instance', () => {
    const instance = knex({ client: 'pg', connection: 'postgres://u:p@db.internal:5432/moon' })
    expect(() => construct(instance)).not.toThrow()
  })

  it('still permits localhost outside production', () => {
    process.env.NODE_ENV = 'test'
    expect(() => construct('postgres://u:p@localhost/moon')).not.toThrow()
  })
})