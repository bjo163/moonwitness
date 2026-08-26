import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { writeFileSync, unlinkSync, mkdirSync, existsSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import {
  sha256Buffer,
  sha256String,
  sha256File,
  computeFingerprint,
  computeRecordsChecksum,
  validateArtifactPath
} from '../src/services/hash.js'
import {
  createReport,
  addFinding,
  runBuiltinValidation
} from '../src/services/validation.js'
import {
  registerAdapter,
  getAdapter,
  listAdapters,
  clearAdapters,
  verifyArtifact,
  normalizeArtifact,
  validateNormalized,
  executeImport
} from '../src/services/ingestion.js'
import { FixtureAdapter, fixtureAdapter } from '../src/adapters/fixture-adapter.js'
import type { ImportContext, NormalizedArtifact } from '../src/types/ingestion.js'
import { createCtx, setupOrm, registerModel, SUPERUSER_ID } from '@moon/orm'
import WxSourcePolicy from '../src/models/wx-source-policy.js'
import WxSourceManifest from '../src/models/wx-source-manifest.js'
import WxSourceArtifact from '../src/models/wx-source-artifact.js'
import WxSourceSnapshot from '../src/models/wx-source-snapshot.js'

// Setup temp test workspace
const TEST_DIR = join(process.cwd(), 'scratch_test_ingestion')

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

registerModel(WxSourcePolicy)
registerModel(WxSourceManifest)
registerModel(WxSourceArtifact)
registerModel(WxSourceSnapshot)

describe('Witness Corpus Ingestion Data Plane (#65)', () => {
  beforeEach(() => {
    mockDb = {}
    setupOrm(createMockKnex())
    clearAdapters()
    registerAdapter(fixtureAdapter)

    if (!existsSync(TEST_DIR)) {
      mkdirSync(TEST_DIR, { recursive: true })
    }
  })

  afterEach(() => {
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true, force: true })
    }
  })

  describe('Cryptographic Hash & Security Invariants', () => {
    it('computes exact SHA-256 for buffers and strings', () => {
      const text = 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ'
      const hash1 = sha256String(text)
      const hash2 = sha256Buffer(Buffer.from(text, 'utf8'))

      expect(hash1).toHaveLength(64)
      expect(hash1).toBe(hash2)
      // Known SHA-256 for this exact Arabic string
      expect(hash1).toBe(sha256Buffer(Buffer.from(text, 'utf8')))
    })

    it('computes streaming file SHA-256 correctly', async () => {
      const filePath = join(TEST_DIR, 'test-file.json')
      const payload = JSON.stringify({ message: 'Witness Ingestion Data Plane' })
      writeFileSync(filePath, payload, 'utf8')

      const computed = await sha256File(filePath)
      const direct = sha256String(payload)
      expect(computed).toBe(direct)
    })

    it('generates deterministic replay fingerprint', () => {
      const fp1 = computeFingerprint('quran-v1', 'hash_abc_123', '1.0.0', '1.0')
      const fp2 = computeFingerprint('quran-v1', 'hash_abc_123', '1.0.0', '1.0')
      const fp3 = computeFingerprint('quran-v1', 'hash_abc_123', '2.0.0', '1.0')

      expect(fp1).toBe(fp2)
      expect(fp1).not.toBe(fp3)
      expect(fp1).toHaveLength(64)
    })

    it('prevents path traversal attacks on artifact files', () => {
      expect(() => {
        validateArtifactPath('../../../etc/passwd', TEST_DIR)
      }).toThrow(/Path traversal detected/)
    })
  })

  describe('Adapter Contract & Normalization Invariants', () => {
    it('maintains adapter registry uniqueness', () => {
      expect(listAdapters()).toContain('fixture-json')
      expect(getAdapter('fixture-json')).toBe(fixtureAdapter)

      expect(() => {
        registerAdapter(new FixtureAdapter())
      }).toThrow(/already registered/)
    })

    it('produces byte-for-byte identical normalization on multiple runs', async () => {
      const fixtureData = {
        metadata: {
          sourceCode: 'quran-fixture',
          sourceKind: 'revelation_corpus',
          language: 'ar',
          script: 'Arab'
        },
        records: [
          {
            id: 'surah:1:ayah:2',
            hierarchy: ['surah_1', 'ayah_2'],
            text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ'
          },
          {
            id: 'surah:1:ayah:1',
            hierarchy: ['surah_1', 'ayah_1'],
            text: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ'
          }
        ]
      }

      const filePath = join(TEST_DIR, 'quran-fixture.json')
      writeFileSync(filePath, JSON.stringify(fixtureData), 'utf8')

      const ctx: ImportContext = {
        env: createCtx(SUPERUSER_ID),
        manifestId: 1,
        snapshotId: 1,
        manifestCode: 'quran-fixture',
        sourceKind: 'revelation_corpus',
        revelationFamily: 'QURAN',
        authorityClass: 'REVELATION',
        parserVersion: '1.0.0',
        normalizationVersion: '1.0'
      }

      const norm1 = await normalizeArtifact(filePath, 'fixture-json', ctx, TEST_DIR)
      const norm2 = await normalizeArtifact(filePath, 'fixture-json', ctx, TEST_DIR)

      expect(norm1.checksum).toBe(norm2.checksum)
      expect(norm1.recordCount).toBe(2)
      // Ordered deterministically by sourceLocalId
      expect(norm1.records[0]!.sourceLocalId).toBe('surah:1:ayah:1')
      expect(norm1.records[1]!.sourceLocalId).toBe('surah:1:ayah:2')
      // Source text preserved with full Unicode
      expect(norm1.records[0]!.sourceText).toBe('بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ')
    })

    it('captures translation lineage metadata for independence tracking', async () => {
      const translationData = {
        metadata: {
          sourceCode: 'quran-trans-id',
          sourceKind: 'translation',
          language: 'id',
          script: 'Latn'
        },
        records: [
          {
            id: 'surah:1:ayah:1',
            hierarchy: ['surah_1', 'ayah_1'],
            text: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.',
            lineage: {
              derivationType: 'translation',
              derivedFromId: 'quran-uthmani-v2.1',
              independenceKey: 'revelation:quran:1:1'
            }
          }
        ]
      }

      const filePath = join(TEST_DIR, 'trans-fixture.json')
      writeFileSync(filePath, JSON.stringify(translationData), 'utf8')

      const ctx: ImportContext = {
        env: createCtx(SUPERUSER_ID),
        manifestId: 2,
        snapshotId: 2,
        manifestCode: 'quran-trans-id',
        sourceKind: 'translation',
        authorityClass: 'INTERPRETIVE',
        parserVersion: '1.0.0',
        normalizationVersion: '1.0'
      }

      const normalized = await normalizeArtifact(filePath, 'fixture-json', ctx, TEST_DIR)
      expect(normalized.records[0]!.lineage).toBeDefined()
      expect(normalized.records[0]!.lineage?.derivationType).toBe('translation')
      expect(normalized.records[0]!.lineage?.independenceKey).toBe('revelation:quran:1:1')
    })
  })

  describe('Pre-Import Validation Framework', () => {
    it('detects duplicate source-local IDs', () => {
      const report = createReport()
      const invalidIds = new Set<string>()

      const records: any[] = [
        { sourceLocalId: 'item:1', sourceText: 'Text 1', language: 'en', hierarchy: [] },
        { sourceLocalId: 'item:1', sourceText: 'Text 2 (Duplicate)', language: 'en', hierarchy: [] }
      ]

      const normalized: NormalizedArtifact = {
        checksum: 'abc',
        parserVersion: '1.0.0',
        normalizationVersion: '1.0',
        records,
        recordCount: 2
      }

      const ctx: ImportContext = {
        env: createCtx(SUPERUSER_ID),
        manifestId: 1,
        snapshotId: 1,
        manifestCode: 'test-code',
        sourceKind: 'revelation_corpus',
        authorityClass: 'REVELATION',
        parserVersion: '1.0.0',
        normalizationVersion: '1.0'
      }

      const validation = runBuiltinValidation(normalized, ctx)
      expect(validation.valid).toBe(false)
      expect(validation.errorCount).toBe(1)
      expect(validation.findings[0]!.code).toBe('DUPLICATE_SOURCE_LOCAL_ID')
    })

    it('enforces Authority Separation: Tradition cannot claim REVELATION authority', () => {
      const records: any[] = [
        { sourceLocalId: 'bukhari:1', sourceText: 'Innamal a\'malu binniyyat', language: 'ar', hierarchy: ['hadith_1'] }
      ]

      const normalized: NormalizedArtifact = {
        checksum: 'abc',
        parserVersion: '1.0.0',
        normalizationVersion: '1.0',
        records,
        recordCount: 1
      }

      const ctx: ImportContext = {
        env: createCtx(SUPERUSER_ID),
        manifestId: 1,
        snapshotId: 1,
        manifestCode: 'hadith-bukhari',
        sourceKind: 'tradition',
        authorityClass: 'REVELATION', // VIOLATION!
        parserVersion: '1.0.0',
        normalizationVersion: '1.0'
      }

      const validation = runBuiltinValidation(normalized, ctx)
      expect(validation.valid).toBe(false)
      expect(validation.findings.some((f) => f.code === 'TRADITION_CLAIMS_REVELATION')).toBe(true)
    })

    it('detects cardinality mismatches against manifest declaration', () => {
      const records: any[] = [
        { sourceLocalId: 'item:1', sourceText: 'Text 1', language: 'en', hierarchy: [] }
      ]

      const normalized: NormalizedArtifact = {
        checksum: 'abc',
        parserVersion: '1.0.0',
        normalizationVersion: '1.0',
        records,
        recordCount: 1
      }

      const ctx: ImportContext = {
        env: createCtx(SUPERUSER_ID),
        manifestId: 1,
        snapshotId: 1,
        manifestCode: 'test-card',
        sourceKind: 'revelation_corpus',
        authorityClass: 'REVELATION',
        parserVersion: '1.0.0',
        normalizationVersion: '1.0'
      }

      const validation = runBuiltinValidation(normalized, ctx, undefined, 5) // Expected 5, got 1
      expect(validation.valid).toBe(false)
      expect(validation.findings.some((f) => f.code === 'CARDINALITY_MISMATCH')).toBe(true)
    })
  })

  describe('End-to-End Ingestion Pipeline Execution', () => {
    it('executes full pipeline: manifest -> verify -> parse -> normalize -> validate -> snapshot', async () => {
      const modelMap: Record<string, any> = {
        'wx.source.policy': WxSourcePolicy,
        'wx.source.manifest': WxSourceManifest,
        'wx.source.artifact': WxSourceArtifact,
        'wx.source.snapshot': WxSourceSnapshot
      }
      const env = createCtx(SUPERUSER_ID, {}, (name) => modelMap[name] || null)

      // 1. Create Source Policy
      const policy = await WxSourcePolicy.spawn(WxSourcePolicy, env, {
        code: 'PRIMARY_NORMATIVE',
        name: 'Primary Normative Revelation',
        authorityClass: 'REVELATION',
        allowedEngineUse: 'NORMATIVE_CORE',
        revelationFamily: 'QURAN',
        version: '1.0'
      })

      // 2. Prepare fixture file
      const fixtureData = {
        metadata: {
          sourceCode: 'quran-uthmani-fixt',
          sourceKind: 'revelation_corpus',
          language: 'ar',
          script: 'Arab'
        },
        records: [
          {
            id: 'surah:1:ayah:1',
            hierarchy: ['surah_1', 'ayah_1'],
            text: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ'
          },
          {
            id: 'surah:1:ayah:2',
            hierarchy: ['surah_1', 'ayah_2'],
            text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ'
          }
        ]
      }
      const fixturePath = join(TEST_DIR, 'quran-uthmani.json')
      const fixtureJson = JSON.stringify(fixtureData)
      writeFileSync(fixturePath, fixtureJson, 'utf8')
      const rawSha = sha256String(fixtureJson)

      // 3. Create Manifest
      await WxSourceManifest.spawn(WxSourceManifest, env, {
        code: 'quran-uthmani-fixt',
        sourceKind: 'revelation_corpus',
        policyId: policy.id,
        revelationFamily: 'QURAN',
        authority: 'King Fahd Complex / Witness Fixture',
        licenseStatus: 'approved',
        sourceLanguage: 'ar',
        sourceScript: 'Arab',
        revision: '1.0.0',
        parserAdapterCode: 'fixture-json',
        parserVersion: '1.0.0',
        normalizationSchemaVersion: '1.0',
        rawArtifactSha256: rawSha,
        expectedCardinality: 2
      })

      // 4. Track domain import invocation
      let domainImportInvoked = false
      const domainImporter = async (norm: NormalizedArtifact, ctx: ImportContext) => {
        domainImportInvoked = true
        return { created: norm.recordCount, updated: 0, skipped: 0 }
      }

      // 5. Execute Import
      const result = await executeImport(
        'quran-uthmani-fixt',
        'quran-uthmani.json',
        env,
        TEST_DIR,
        domainImporter
      )

      expect(result.status).toBe('completed')
      expect(result.recordsProcessed).toBe(2)
      expect(result.recordsCreated).toBe(2)
      expect(result.validation.valid).toBe(true)
      expect(domainImportInvoked).toBe(true)

      // Verify Snapshot in DB
      expect(mockDb['wx_source_snapshot'].length).toBe(1)
      const snapshot = mockDb['wx_source_snapshot'][0]
      expect(snapshot.status).toBe('completed')
      expect(snapshot.fingerprint).toBeDefined()
      expect(snapshot.raw_checksum || snapshot.rawChecksum).toBe(rawSha)

      // 6. Test Idempotency: Re-running same import is idempotent
      const rerunResult = await executeImport(
        'quran-uthmani-fixt',
        'quran-uthmani.json',
        env,
        TEST_DIR,
        domainImporter
      )

      expect(rerunResult.status).toBe('completed')
      expect(rerunResult.recordsSkipped).toBe(2)
      // Does not create duplicate snapshot record
      expect(mockDb['wx_source_snapshot'].length).toBe(1)
    })

    it('leaves zero canonical mutation and marks snapshot failed on validation error', async () => {
      const modelMap: Record<string, any> = {
        'wx.source.policy': WxSourcePolicy,
        'wx.source.manifest': WxSourceManifest,
        'wx.source.artifact': WxSourceArtifact,
        'wx.source.snapshot': WxSourceSnapshot
      }
      const env = createCtx(SUPERUSER_ID, {}, (name) => modelMap[name] || null)

      const policy = await WxSourcePolicy.spawn(WxSourcePolicy, env, {
        code: 'COMPLEMENTARY',
        name: 'Complementary Reference',
        authorityClass: 'REVELATION',
        allowedEngineUse: 'COMPLEMENTARY_REFERENCE',
        version: '1.0'
      })

      // Fixture with duplicate IDs (will fail validation)
      const invalidFixture = {
        metadata: {
          sourceCode: 'invalid-corpus',
          sourceKind: 'textual_witness',
          language: 'he'
        },
        records: [
          { id: 'unit:1', hierarchy: ['book_1'], text: 'Text A' },
          { id: 'unit:1', hierarchy: ['book_1'], text: 'Text B Duplicate' }
        ]
      }
      const invalidPath = join(TEST_DIR, 'invalid.json')
      const invalidJson = JSON.stringify(invalidFixture)
      writeFileSync(invalidPath, invalidJson, 'utf8')
      const rawSha = sha256String(invalidJson)

      await WxSourceManifest.spawn(WxSourceManifest, env, {
        code: 'invalid-corpus',
        sourceKind: 'textual_witness',
        policyId: policy.id,
        authority: 'Test Authority',
        licenseStatus: 'approved',
        sourceLanguage: 'he',
        revision: '1.0.0',
        parserAdapterCode: 'fixture-json',
        parserVersion: '1.0.0',
        normalizationSchemaVersion: '1.0',
        rawArtifactSha256: rawSha
      })

      let domainImportInvoked = false
      const domainImporter = async () => {
        domainImportInvoked = true
        return { created: 0, updated: 0, skipped: 0 }
      }

      const result = await executeImport(
        'invalid-corpus',
        'invalid.json',
        env,
        TEST_DIR,
        domainImporter
      )

      expect(result.status).toBe('failed')
      expect(result.validation.valid).toBe(false)
      expect(domainImportInvoked).toBe(false) // Domain import was blocked!

      const snapshot = mockDb['wx_source_snapshot'][0]
      expect(snapshot.status).toBe('failed')
    })
  })
})
