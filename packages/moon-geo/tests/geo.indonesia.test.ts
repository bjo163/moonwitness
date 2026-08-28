import { describe, it, expect, beforeEach } from 'vitest'
import {
  GeoProvince,
  GeoCity,
  GeoDistrict,
  GeoVillage,
  GeoPostal,
  GeoHistory,
  GeoSourceSnapshot,
  GeoCandidate,
  ingestSourceSnapshot,
  computeGeoSemanticDiff,
  runGeoSourceMonitoring
} from '../src/index.ts'
import geoAddon from '../src/index.js'
import { createCtx, setupOrm, registerModel, SUPERUSER_ID } from '@moon/orm'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const fixtureDataFile = join(__dirname, '../src/data/indonesia-hierarchy.json')

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

registerModel(GeoProvince)
registerModel(GeoCity)
registerModel(GeoDistrict)
registerModel(GeoVillage)
registerModel(GeoPostal)
registerModel(GeoHistory)
registerModel(GeoSourceSnapshot)
registerModel(GeoCandidate)

describe('Indonesia-First Deep Geo-Graph & Automated Source Monitoring (#40-#48)', () => {
  beforeEach(() => {
    mockDb = {}
    setupOrm(createMockKnex())
  })

  it('exports addon manifest with base dependency and all 8 geo models', () => {
    expect(geoAddon.name).toBe('geo')
    expect(geoAddon.depends).toContain('base')
    expect(geoAddon.models).toHaveLength(8)
  })

  it('ingests official source snapshot with deterministic SHA-256 checksum (#46)', () => {
    const snapshot = ingestSourceSnapshot('kemendagri.wilayah', fixtureDataFile, '2026.1')
    expect(snapshot.sourceName).toBe('kemendagri.wilayah')
    expect(snapshot.checksum).toHaveLength(64)
    expect(snapshot.data.provinces).toHaveLength(38)

    // Check all 4 newly created Papua provinces (2022 law)
    const names = snapshot.data.provinces.map((p: any) => p.name)
    expect(names).toContain('Papua Selatan')
    expect(names).toContain('Papua Tengah')
    expect(names).toContain('Papua Pegunungan')
    expect(names).toContain('Papua Barat Daya')
  })

  it('computes semantic diff and classifies changes into AUTO_SAFE, REVIEW_REQUIRED, BLOCKED (#47)', () => {
    const existing = [
      { kemendagriCode: '31', name: 'DKI Jakarta' },
      { kemendagriCode: '32', name: 'Jawa Barat' }
    ]
    const incoming = [
      { kemendagriCode: '31', name: 'DKI Jakarta' }, // Unchanged
      { kemendagriCode: '32', name: 'Jawa Barat Raya' }, // Renamed -> REVIEW_REQUIRED
      { kemendagriCode: '96', name: 'Papua Barat Daya' } // New -> AUTO_SAFE
    ]

    const diff = computeGeoSemanticDiff(existing, incoming)
    expect(diff.totalCandidates).toBe(2)
    expect(diff.autoSafeCount).toBe(1)
    expect(diff.reviewRequiredCount).toBe(1)
    expect(diff.blockedCount).toBe(0)

    const createCandidate = diff.candidates.find((c) => c.action === 'create')
    expect(createCandidate?.policy).toBe('AUTO_SAFE')

    const updateCandidate = diff.candidates.find((c) => c.action === 'update')
    expect(updateCandidate?.policy).toBe('REVIEW_REQUIRED')
  })

  it('triggers BLOCKED circuit breaker when a province disappears unexpectedly (#47, #48)', () => {
    const existing = [
      { kemendagriCode: '31', name: 'DKI Jakarta' },
      { kemendagriCode: '32', name: 'Jawa Barat' }
    ]
    const incoming = [
      { kemendagriCode: '31', name: 'DKI Jakarta' }
      // Missing Jawa Barat!
    ]

    const diff = computeGeoSemanticDiff(existing, incoming)
    expect(diff.blockedCount).toBe(1)
    const blocked = diff.candidates.find((c) => c.policy === 'BLOCKED')
    expect(blocked?.action).toBe('deprecate')
    expect(blocked?.reason).toContain('circuit breaker')
  })

  it('executes monitor orchestrator and produces durable report (#48)', async () => {
    const modelMap: Record<string, any> = {
      'geo.province': GeoProvince,
      'geo.city': GeoCity,
      'geo.district': GeoDistrict,
      'geo.village': GeoVillage,
      'geo.postal': GeoPostal,
      'geo.history': GeoHistory,
      'geo.source.snapshot': GeoSourceSnapshot,
      'geo.candidate': GeoCandidate
    }
    const env = createCtx(SUPERUSER_ID, {}, (name) => modelMap[name] || null)

    const report = await runGeoSourceMonitoring('kemendagri.wilayah', fixtureDataFile, env)
    expect(report.status).toBe('COMPLETED')
    expect(report.appliedCount).toBe(38)
    expect(mockDb['geo_province']).toHaveLength(38)

    // Running again results in NO_CHANGE
    const secondReport = await runGeoSourceMonitoring('kemendagri.wilayah', fixtureDataFile, env)
    expect(secondReport.status).toBe('NO_CHANGE')
    expect(secondReport.appliedCount).toBe(0)
  })
})
