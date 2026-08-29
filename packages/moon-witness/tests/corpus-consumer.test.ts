import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { writeFileSync, unlinkSync, mkdirSync, existsSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import {
  sha256Buffer,
  sha256String,
  sha256File,
  computeFingerprint,
  computeRecordsChecksum
} from '../src/services/hash.js'
import {
  registerAdapter,
  getAdapter,
  clearAdapters,
  verifyArtifact,
  normalizeArtifact,
  validateNormalized,
  executeImport
} from '../src/services/ingestion.js'
import {
  MoonwitnessCorpusAdapter,
  moonwitnessCorpusAdapter,
  type CorpusReleasePayload
} from '../src/adapters/moonwitness-corpus-adapter.js'
import { importCanonicalCorpus } from '../src/services/canonical-corpus-importer.js'
import type { ImportContext, NormalizedArtifact } from '../src/types/ingestion.js'
import { createCtx, setupOrm, registerModel, SUPERUSER_ID } from '@moon/orm'
import WxSourcePolicy from '../src/models/wx-source-policy.js'
import WxSourceManifest from '../src/models/wx-source-manifest.js'
import WxSourceArtifact from '../src/models/wx-source-artifact.js'
import WxSourceSnapshot from '../src/models/wx-source-snapshot.js'
import WxSource from '../src/models/wx-source.js'
import WxProvenance from '../src/models/wx-provenance.js'
import WxTextEdition from '../src/models/wx-text-edition.js'
import WxPassage from '../src/models/wx-passage.js'
import WxContent from '../src/models/wx-content.js'
import WxEntity from '../src/models/wx-entity.js'

const TEST_DIR = join(process.cwd(), 'scratch_test_corpus')

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
        return (
          table.find((row) => {
            for (const [k, v] of Object.entries(queryObj._where)) {
              if (row[k] !== v) return false
            }
            return true
          }) || null
        )
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
            if (row[k] !== v) {
              match = false
              break
            }
          }
          if (match) {
            Object.assign(row, data)
            count++
          }
        }
        return count
      },
      delete: async () => {
        const remaining = table.filter((row) => {
          for (const [k, v] of Object.entries(queryObj._where)) {
            if (row[k] === v) return false
          }
          return true
        })
        const deletedCount = table.length - remaining.length
        table.length = 0
        table.push(...remaining)
        return deletedCount
      },
      then: (resolve: any, reject: any) => {
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
registerModel(WxSource)
registerModel(WxProvenance)
registerModel(WxTextEdition)
registerModel(WxPassage)
registerModel(WxContent)
registerModel(WxEntity)

describe('Phase 10B — @moon/witness Canonical Corpus Consumer', () => {
  beforeEach(() => {
    mockDb = {}
    setupOrm(createMockKnex())
    clearAdapters()
    registerAdapter(moonwitnessCorpusAdapter)
    if (!existsSync(TEST_DIR)) {
      mkdirSync(TEST_DIR, { recursive: true })
    }
  })

  afterEach(() => {
    clearAdapters()
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true, force: true })
    }
  })

  describe('MoonwitnessCorpusAdapter Unit Tests', () => {
    it('parses valid corpus release payload', async () => {
      const payload: CorpusReleasePayload = {
        release: {
          corpus: 'moonwitness-corpus',
          version: '1.0.0',
          commit: 'a1b2c3d4',
          schemaVersion: '1.0',
          source: {
            code: 'quran-uthmani',
            name: 'Al-Qur\'an al-Karim (Uthmani)',
            language: 'ar',
            script: 'Arab'
          }
        },
        records: [
          {
            id: 'quran:1:1',
            hierarchy: ['quran', 'surah_1', 'ayah_1'],
            text: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ'
          }
        ]
      }

      const buffer = Buffer.from(JSON.stringify(payload), 'utf8')
      const ctx: ImportContext = {
        env: {} as any,
        manifestId: 1,
        snapshotId: 1,
        manifestCode: 'quran-manifest',
        sourceKind: 'revelation_corpus',
        authorityClass: 'REVELATION',
        parserVersion: '1.0.0',
        normalizationVersion: '1.0'
      }

      const parsed = await moonwitnessCorpusAdapter.parse(buffer, ctx)
      expect(parsed.release.corpus).toBe('moonwitness-corpus')
      expect(parsed.records.length).toBe(1)
      expect(parsed.records[0].id).toBe('quran:1:1')
    })

    it('normalizes corpus records deterministically with translations and lineage', async () => {
      const payload: CorpusReleasePayload = {
        release: {
          corpus: 'moonwitness-corpus',
          version: '1.0.0',
          commit: 'a1b2c3d4',
          schemaVersion: '1.0',
          source: {
            code: 'quran-uthmani',
            name: 'Al-Qur\'an al-Karim (Uthmani)',
            language: 'ar'
          },
          edition: {
            code: 'quran.id.kemenag',
            name: 'Terjemahan Kemenag RI',
            editionType: 'translation',
            translator: 'Kemenag RI'
          }
        },
        records: [
          {
            id: 'quran:1:2',
            hierarchy: ['quran', 'surah_1', 'ayah_2'],
            text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
            translations: [
              {
                language: 'id',
                translator: 'Kemenag RI',
                text: 'Segala puji bagi Allah, Tuhan seluruh alam.'
              }
            ]
          },
          {
            id: 'quran:1:1',
            hierarchy: ['quran', 'surah_1', 'ayah_1'],
            text: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
            translations: [
              {
                language: 'id',
                translator: 'Kemenag RI',
                text: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.'
              }
            ]
          }
        ]
      }

      const ctx: ImportContext = {
        env: {} as any,
        manifestId: 1,
        snapshotId: 1,
        manifestCode: 'quran-manifest',
        sourceKind: 'revelation_corpus',
        authorityClass: 'REVELATION',
        parserVersion: '1.0.0',
        normalizationVersion: '1.0'
      }

      const normalized = await moonwitnessCorpusAdapter.normalize(payload, ctx)
      expect(normalized.recordCount).toBe(2)
      // Sorted deterministically by id
      expect(normalized.records[0].sourceLocalId).toBe('quran:1:1')
      expect(normalized.records[1].sourceLocalId).toBe('quran:1:2')
      expect(normalized.checksum).toBeDefined()
    })

    it('rejects duplicate or invalid records during validation', async () => {
      const normalized: NormalizedArtifact = {
        checksum: 'test-chk',
        parserVersion: '1.0.0',
        normalizationVersion: '1.0',
        recordCount: 2,
        records: [
          {
            sourceLocalId: 'dup:1',
            hierarchy: ['h1'],
            sourceText: 'Text 1',
            language: 'ar',
            fields: {}
          },
          {
            sourceLocalId: 'dup:1',
            hierarchy: ['h1'],
            sourceText: 'Text 2',
            language: 'ar',
            fields: {}
          }
        ]
      }

      const ctx: ImportContext = {
        env: {} as any,
        manifestId: 1,
        snapshotId: 1,
        manifestCode: 'quran-manifest',
        sourceKind: 'revelation_corpus',
        authorityClass: 'REVELATION',
        parserVersion: '1.0.0',
        normalizationVersion: '1.0'
      }

      const report = await moonwitnessCorpusAdapter.validate(normalized, ctx)
      expect(report.valid).toBe(false)
      expect(report.errorCount).toBeGreaterThan(0)
    })
  })

  describe('End-to-End Canonical Corpus Pipeline & Domain Importer', () => {
    it('successfully imports corpus release into canonical graph models with strict provenance', async () => {
      const mockKnex = createMockKnex()
      const modelMap: Record<string, any> = {
        'wx.source.policy': WxSourcePolicy,
        'wx.source.manifest': WxSourceManifest,
        'wx.source.artifact': WxSourceArtifact,
        'wx.source.snapshot': WxSourceSnapshot,
        'wx.source': WxSource,
        'wx.provenance': WxProvenance,
        'wx.text.edition': WxTextEdition,
        'wx.passage': WxPassage,
        'wx.content': WxContent,
        'wx.entity': WxEntity
      }

      const env = createCtx(SUPERUSER_ID, {}, (name) => modelMap[name] || null)

      // 1. Create Policy
      const policy = await WxSourcePolicy.spawn(WxSourcePolicy, env, {
        code: 'QURAN_NORMATIVE',
        name: 'Quran Normative Policy',
        authorityClass: 'REVELATION',
        allowedEngineUse: 'NORMATIVE_CORE',
        revelationFamily: 'QURAN',
        version: '1.0'
      })

      // 2. Prepare Corpus Release Artifact
      const corpusPayload: CorpusReleasePayload = {
        release: {
          corpus: 'moonwitness-corpus',
          version: '1.0.0',
          commit: 'e2f4a6b8',
          schemaVersion: '1.0',
          source: {
            code: 'quran-uthmani',
            name: 'Al-Qur\'an al-Karim (Uthmani)',
            language: 'ar',
            script: 'Arab'
          },
          edition: {
            code: 'quran-uthmani-v1',
            name: 'Mushaf Madinah Uthmani',
            editionType: 'original'
          }
        },
        records: [
          {
            id: 'quran:1:1',
            hierarchy: ['quran', 'surah_1', 'ayah_1'],
            text: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
            translations: [
              {
                language: 'id',
                translator: 'Kemenag RI',
                text: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.'
              }
            ]
          },
          {
            id: 'quran:1:2',
            hierarchy: ['quran', 'surah_1', 'ayah_2'],
            text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
            translations: [
              {
                language: 'id',
                translator: 'Kemenag RI',
                text: 'Segala puji bagi Allah, Tuhan seluruh alam.'
              }
            ]
          }
        ]
      }

      const artifactFileName = 'quran-release-1.0.0.json'
      const artifactPath = join(TEST_DIR, artifactFileName)
      const artifactJson = JSON.stringify(corpusPayload)
      writeFileSync(artifactPath, artifactJson, 'utf8')
      const rawSha = sha256String(artifactJson)

      // 3. Create Manifest
      await WxSourceManifest.spawn(WxSourceManifest, env, {
        code: 'quran-canonical-manifest',
        sourceKind: 'revelation_corpus',
        policyId: policy.id,
        revelationFamily: 'QURAN',
        authority: 'King Fahd Complex / MoonWitness Corpus',
        licenseStatus: 'approved',
        sourceLanguage: 'ar',
        sourceScript: 'Arab',
        revision: '1.0.0',
        parserAdapterCode: 'moonwitness-corpus',
        parserVersion: '1.0.0',
        normalizationSchemaVersion: '1.0',
        rawArtifactSha256: rawSha,
        expectedCardinality: 2
      })

      // 4. Run Import with importCanonicalCorpus
      const result = await executeImport(
        'quran-canonical-manifest',
        artifactFileName,
        env,
        TEST_DIR,
        importCanonicalCorpus
      )

      expect(result.status).toBe('completed')
      expect(result.recordsProcessed).toBe(2)
      expect(result.recordsCreated).toBe(4) // 2 original texts + 2 translations
      expect(result.validation.valid).toBe(true)

      // 5. Verify Canonical Models in Database
      expect(mockDb['wx_source'].length).toBe(1)
      const src = mockDb['wx_source'][0]
      expect(src.stable_key || src.stableKey).toBe('source:quran-uthmani')

      expect(mockDb['wx_provenance'].length).toBe(1)
      const prov = mockDb['wx_provenance'][0]
      expect(prov.source_revision || prov.sourceRevision).toBe('1.0.0')

      expect(mockDb['wx_text_edition'].length).toBe(1)
      expect(mockDb['wx_passage'].length).toBe(2)
      expect(mockDb['wx_content'].length).toBe(4)

      // 6. Test Idempotency: Second run skips records
      const rerunResult = await executeImport(
        'quran-canonical-manifest',
        artifactFileName,
        env,
        TEST_DIR,
        importCanonicalCorpus
      )

      expect(rerunResult.status).toBe('completed')
      expect(rerunResult.recordsSkipped).toBe(2)
      expect(mockDb['wx_source'].length).toBe(1)
      expect(mockDb['wx_source_snapshot'].length).toBe(1)
    })
  })
})
