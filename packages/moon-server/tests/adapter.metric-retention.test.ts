import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { EventEmitter } from 'node:events'
import { FastifyAdapter } from '../src/fastify-adapter.js'
import { registerModel, teardownOrm } from '@moon/orm'
import { MxMetric } from '@moon/base'

const TEST_SECRET = 'super-secret-jwt-key-for-unit-testing-32chars!'

registerModel(MxMetric)

type Row = Record<string, any>
type Tables = Record<string, Row[]>

class FakeDbQuery {
  private tableName: string
  private tables: Tables
  private filters: Array<(row: Row) => boolean> = []
  constructor(tableName: string, tables: Tables) {
    this.tableName = tableName
    this.tables = tables
    if (!this.tables[tableName]) this.tables[tableName] = []
  }
  where(columnOrFn: any, opOrVal?: any, val?: any): this {
    if (typeof columnOrFn === 'function') { columnOrFn(this); return this }
    if (typeof columnOrFn === 'object' && columnOrFn !== null) {
      this.filters.push((row) => Object.entries(columnOrFn).every(([k, v]) => row[k] === v))
      return this
    }
    const column = String(columnOrFn).replace(`${this.tableName}.`, '')
    if (val !== undefined) {
      const op = String(opOrVal).toLowerCase()
      if (op === '=' || op === '==') this.filters.push((row) => row[column] === val)
      else if (op === 'in') this.filters.push((row) => (Array.isArray(val) ? val : [val]).includes(row[column]))
    } else {
      this.filters.push((row) => row[column] === opOrVal)
    }
    return this
  }
  andWhere(c: any, o?: any, v?: any): this { return this.where(c, o, v) }
  orWhere(c: any, o?: any, v?: any): this { return this.where(c, o, v) }
  whereIn(column: string, values: any[]): this {
    const col = String(column).replace(`${this.tableName}.`, '')
    this.filters.push((row) => values.includes(row[col]))
    return this
  }
  select(): this { return this }
  orderBy(): this { return this }
  limit(): this { return this }
  offset(): this { return this }
  async count() { return [{ count: this.executeFilter().length }] }
  async first() { return this.executeFilter()[0] }
  private executeFilter(): Row[] {
    let rows = [...(this.tables[this.tableName] ?? [])]
    for (const f of this.filters) rows = rows.filter(f)
    return rows
  }
  async update(vals: Record<string, any>) {
    const rows = this.executeFilter()
    for (const r of rows) Object.assign(r, vals)
    return rows.length
  }
  insert(vals: any) {
    const rowsToInsert = Array.isArray(vals) ? vals : [vals]
    const tableRows = this.tables[this.tableName] ?? []
    const createdRows: Row[] = []
    for (const v of rowsToInsert) {
      const newRow = { id: v.id ?? tableRows.length + 1, ...v }
      tableRows.push(newRow)
      createdRows.push(newRow)
    }
    return { returning: () => Promise.resolve(createdRows) }
  }
  then(resolve: (rows: Row[]) => void) { resolve(this.executeFilter()) }
}

function makeDb(tables: Tables) {
  const dbFn: any = (table: string) => new FakeDbQuery(table, tables)
  dbFn.transaction = async (cb: (trx: any) => Promise<any>) => cb(dbFn)
  dbFn.raw = (sql: string) => sql
  dbFn.on = () => {}
  const introspection: any = {
    from: () => introspection,
    where: () => introspection,
    whereRaw: () => introspection,
    andWhere: () => introspection,
    then: (resolve: (rows: Row[]) => void) => resolve([]),
  }
  dbFn.select = () => introspection
  return dbFn
}

function setClientCount(n: number) {
  ;(globalThis as any).moonActiveSSEClients = new Map(Array.from({ length: n }, (_, i) => [`c${i}`, {}]))
}

describe('Connection metric retention (T-28)', () => {
  let adapter: FastifyAdapter
  let tables: Tables

  beforeEach(async () => {
    ;(globalThis as any).moonEmitter = new EventEmitter()
    setClientCount(0)
    tables = {
      vx_user: [{ id: 1, email: 'root@moonwitness.org', name: 'Root', password: 'h', token_version: 1, is_active: true }],
      mx_model: [],
      mx_metric: [],
    }
    adapter = new FastifyAdapter({ database: makeDb(tables), jwtSecret: TEST_SECRET, port: 0 })
    await adapter.start()
  })

  afterEach(async () => {
    setClientCount(0)
    await adapter.stop()
    await teardownOrm()
  })

  it('unrefs the periodic metric timer so it cannot hold the process open', () => {
    expect((adapter as any).metricInterval.hasRef()).toBe(false)
  })

  it('keeps a single bounded active_connections row with the latest value after 24h of ticks', async () => {
    const flush = (adapter as any).flushConnectionMetric.bind(adapter)
    let lastCount = 0
    for (let tick = 0; tick < 1440; tick++) {
      lastCount = tick % 7
      setClientCount(lastCount)
      await flush()
    }
    const rows = tables.mx_metric.filter((r) => r.name === 'active_connections')
    expect(rows.length).toBe(1)
    expect(rows[0].value).toBe(lastCount)
  })
})