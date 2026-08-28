import { describe, it, expect, beforeEach } from 'vitest'
import { createCtx, setupOrm, registerModel, SUPERUSER_ID } from '../src/index.js'
import IrModelData from '../../moon-base/src/ir-model-data.js'
import IrSequence from '../../moon-base/src/ir-sequence.js'
import IrConfigParameter from '../../moon-base/src/ir-config-parameter.js'
import IrAttachment from '../../moon-base/src/ir-attachment.js'

let mockDb: Record<string, any[]> = {}

function createMockKnex() {
  const conn: any = (tableName: string) => {
    if (!mockDb[tableName]) mockDb[tableName] = []
    const table = mockDb[tableName]

    const queryObj: any = {
      _where: {} as Record<string, any>,
      where: (clause: any, val?: any) => {
        if (typeof clause === 'function') {
          clause(queryObj)
          return queryObj
        }
        if (typeof clause === 'object') {
          for (const [k, v] of Object.entries(clause)) {
            const rawKey = k.includes('.') ? k.split('.').pop()! : k
            queryObj._where[rawKey] = v
          }
        } else if (typeof clause === 'string' && val !== undefined) {
          const rawKey = clause.includes('.') ? clause.split('.').pop()! : clause
          queryObj._where[rawKey] = val
        }
        return queryObj
      },
      andWhere: (clause: any, val?: any) => queryObj.where(clause, val),
      orWhere: (clause: any, val?: any) => queryObj.where(clause, val),
      whereNot: (clause: any, val?: any) => queryObj.where(clause, val),
      whereIn: (col: string, vals: any[]) => {
        const rawKey = col.includes('.') ? col.split('.').pop()! : col
        queryObj._whereIn = { col: rawKey, vals }
        return queryObj
      },
      select: () => queryObj,
      orderBy: () => queryObj,
      limit: () => queryObj,
      offset: () => queryObj,
      first: async () => {
        return table.find((row) => {
          for (const [k, v] of Object.entries(queryObj._where)) {
            if (row[k] !== v) return false
          }
          return true
        }) || null
      },
      insert: async (data: any | any[]) => {
        const items = Array.isArray(data) ? data.flat() : [data]
        const inserted = []
        for (const item of items) {
          const id = item.id || table.length + 1
          const row = { id, ...item }
          table.push(row)
          inserted.push(row)
        }
        return inserted
      },
      update: async (data: any) => {
        let count = 0
        for (const row of table) {
          let match = true
          for (const [k, v] of Object.entries(queryObj._where)) {
            if (row[k] !== v) match = false
          }
          if (match) {
            Object.assign(row, data)
            count++
          }
        }
        return count
      },
      then: (resolve: (rows: any[]) => void, reject?: (err: any) => void) => {
        try {
          const filtered = table.filter((row) => {
            for (const [k, v] of Object.entries(queryObj._where)) {
              if (row[k] !== v) return false
            }
            return true
          })
          resolve(filtered)
        } catch (e) {
          if (reject) reject(e)
        }
      }
    }
    return queryObj
  }

  conn.transaction = async (cb: any) => await cb(conn)
  conn.raw = (sql: string, bindings: any[]) => ({ sql, bindings })
  conn.on = () => conn
  return conn
}

registerModel(IrModelData)
registerModel(IrSequence)
registerModel(IrConfigParameter)
registerModel(IrAttachment)

describe('Base Kernel Primitives: External IDs, Sequences, Config (#31)', () => {
  beforeEach(() => {
    mockDb = {
      ir_model_data: [
        { id: 1, module: 'base', name: 'group_admin', model: 'vx.role', res_id: 10, is_active: true }
      ],
      ir_sequence: [
        { id: 1, name: 'Invoice', code: 'account.invoice', prefix: 'INV/2026/', padding: 4, number_next: 1, number_increment: 1, is_active: true }
      ],
      ir_config_parameter: [
        { id: 1, key: 'system.maintenance_mode', value: 'false', is_active: true }
      ]
    }
    setupOrm(createMockKnex())
  })

  it('resolves XML external IDs to model and res_id', async () => {
    const env = createCtx(SUPERUSER_ID, {}, (name) => (name === 'ir.model.data' ? IrModelData : null))
    const resolved = await IrModelData.xmlidToResId(env, 'base.group_admin')

    expect(resolved).toEqual({ model: 'vx.role', resId: 10 })
  })

  it('generates sequential codes with padding atomically via IrSequence', async () => {
    const env = createCtx(SUPERUSER_ID, {}, (name) => (name === 'ir.sequence' ? IrSequence : null))
    const code1 = await IrSequence.nextByCode(env, 'account.invoice')
    expect(code1).toBe('INV/2026/0001')

    const code2 = await IrSequence.nextByCode(env, 'account.invoice')
    expect(code2).toBe('INV/2026/0002')
  })

  it('gets and sets system config parameters via IrConfigParameter', async () => {
    const env = createCtx(SUPERUSER_ID, {}, (name) => (name === 'ir.config_parameter' ? IrConfigParameter : null))
    const val = await IrConfigParameter.getParam(env, 'system.maintenance_mode')
    expect(val).toBe('false')

    await IrConfigParameter.setParam(env, 'system.maintenance_mode', 'true')
    const updatedVal = await IrConfigParameter.getParam(env, 'system.maintenance_mode')
    expect(updatedVal).toBe('true')
  })
})
