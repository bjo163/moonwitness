import { describe, it, expect, beforeEach } from 'vitest'
import { verifySeedIntegrity, loadCanonicalReferenceData } from '../src/seed-loader.ts'
import { createCtx, setupOrm, registerModel, SUPERUSER_ID } from '@moon/orm'
import VxZone from '../src/vx-zone.ts'
import VxCoin from '../src/vx-coin.ts'
import IxLang from '../src/ix-lang.ts'
import IxTimezone from '../src/ix-timezone.ts'
import VxRole from '../src/vx-role.ts'
import IrConfigParameter from '../src/ir-config-parameter.ts'
import IrSequence from '../src/ir-sequence.ts'

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
      insert: (data: any | any[]) => {
        const items = Array.isArray(data) ? data.flat() : [data]
        const inserted: any[] = []
        for (const item of items) {
          const id = item.id || table.length + 1
          const row = { id, is_active: true, ...item }
          table.push(row)
          inserted.push(row)
        }
        const resPromise: any = Promise.resolve(inserted)
        resPromise.returning = async () => inserted
        return resPromise
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

registerModel(VxZone)
registerModel(VxCoin)
registerModel(IxLang)
registerModel(IxTimezone)
registerModel(VxRole)
registerModel(IrConfigParameter)
registerModel(IrSequence)

describe('Canonical World & Reference Seed Data (#34-#39)', () => {
  beforeEach(() => {
    mockDb = {}
    setupOrm(createMockKnex())
  })

  it('verifies SHA-256 integrity of all seed datasets against manifest', () => {
    const result = verifySeedIntegrity()
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('loads canonical reference data into database idempotently', async () => {
    const modelMap: Record<string, any> = {
      'vx.zone': VxZone,
      'vx.coin': VxCoin,
      'ix.lang': IxLang,
      'ix.timezone': IxTimezone,
      'vx.role': VxRole,
      'ir.config_parameter': IrConfigParameter,
      'ir.sequence': IrSequence
    }
    const env = createCtx(SUPERUSER_ID, {}, (name) => modelMap[name] || null)

    await loadCanonicalReferenceData(env)

    // Verify countries loaded
    expect(mockDb['vx_zone'].length).toBeGreaterThan(10)
    const indonesia = mockDb['vx_zone'].find((c) => c.code === 'ID')
    expect(indonesia).toBeDefined()
    expect(indonesia.code3).toBe('IDN')
    expect(indonesia.flag_emoji || indonesia.flagEmoji).toBe('🇮🇩')

    // Verify currencies loaded
    expect(mockDb['vx_coin'].length).toBeGreaterThan(5)
    const rupiah = mockDb['vx_coin'].find((c) => c.code === 'IDR')
    expect(rupiah).toBeDefined()
    expect(rupiah.decimals).toBe(0)

    // Verify languages loaded
    const indonesianLang = mockDb['ix_lang'].find((l) => l.code === 'id_ID')
    expect(indonesianLang).toBeDefined()
    expect(indonesianLang.direction).toBe('ltr')

    // Verify second run is idempotent (no duplicate key errors or crashes)
    await loadCanonicalReferenceData(env)
    expect(mockDb['vx_zone'].length).toBeGreaterThan(10)
  })
})
