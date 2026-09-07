import { describe, expect, it } from 'vitest'
import { importCanonicalCorpus } from '../src/services/canonical-corpus-importer.js'
import type { NormalizedArtifact, ImportContext } from '../src/types/ingestion.js'

describe('canonical corpus importer Odoo lane', () => {
  it('persists source, provenance and idempotent passages through Odoo', async () => {
    const calls: Array<{ model: string; method: string }> = []
    let nextId = 10
    const existing = new Map<string, number>()
    const odooClient = {
      callWithSession: async (_session: string, request: { model: string; method: string; args?: unknown[] }) => {
        calls.push({ model: request.model, method: request.method })
        if (request.method === 'search_read' && request.model === 'moon.witness.source') return []
        if (request.method === 'search_read' && request.model === 'moon.witness.provenance') return [{ id: 2 }]
        if (request.method === 'search_read' && request.model === 'moon.witness.content') return []
        if (request.method === 'search_read' && request.model === 'moon.witness.text.edition') return []
        if (request.method === 'search_read' && (request.model === 'moon.witness.source.manifest' || request.model === 'moon.witness.source.policy')) return []
        if (request.method === 'search_read' && request.model === 'moon.witness.passage') {
          const values = request.args?.[0] as Array<Array<unknown>>
          const ref = values?.find((item) => item[0] === 'canonical_reference')?.[2]
          const id = existing.get(String(ref))
          return id ? [{ id }] : []
        }
        if (request.method === 'create' && request.model === 'moon.witness.source') return 1
        if (request.method === 'create' && request.model === 'moon.witness.provenance') return 2
        if (request.method === 'create' && request.model === 'moon.witness.passage') {
          const values = request.args?.[0] as Record<string, unknown>
          const id = ++nextId
          existing.set(String(values.canonical_reference), id)
          return id
        }
        if (request.method === 'create' && request.model === 'moon.witness.content') return ++nextId
        if (request.method === 'create' && request.model === 'moon.witness.text.edition') return ++nextId
        if (request.method === 'create' && (request.model === 'moon.witness.source.manifest' || request.model === 'moon.witness.source.policy')) return ++nextId
        if (request.method === 'write') return true
        throw new Error(`Unexpected Odoo call ${request.model}.${request.method}`)
      },
    }
    const normalized: NormalizedArtifact = {
      checksum: 'a'.repeat(64), parserVersion: '1', normalizationVersion: '1', recordCount: 1,
      records: [{ sourceLocalId: 'quran:1:1', hierarchy: ['quran', '1', '1'], sourceText: 'Read', language: 'en', fields: { sourceCode: 'quran' } }],
    }
    const context = { env: {} as ImportContext['env'], manifestId: 1, snapshotId: 1, manifestCode: 'smoke', sourceKind: 'revelation_corpus', authorityClass: 'REVELATION', parserVersion: '1', normalizationVersion: '1', odooClient, odooSessionId: 'opaque-session' } as ImportContext
    const first = await importCanonicalCorpus(normalized, context)
    const second = await importCanonicalCorpus(normalized, context)
    expect(first).toMatchObject({ created: 1, updated: 0, sourceId: 1, provenanceId: 2 })
    expect(second).toMatchObject({ created: 0, updated: 1, sourceId: 1, provenanceId: 2 })
    expect(calls.some((call) => call.model === 'wx.source')).toBe(false)
  })

  it.each([
    ['tradition', 'moon.witness.tradition.corpus', 'moon.witness.tradition.unit'],
    ['lexical', 'moon.witness.entity', 'moon.witness.root'],
  ] as const)('uses canonical Odoo models for %s ingestion', async (sourceKind, firstModel, secondModel) => {
    const calls: string[] = []
    const odooClient = {
      callWithSession: async (_session: string, request: { model: string; method: string }) => {
        calls.push(`${request.model}.${request.method}`)
        if (request.method === 'search_read') return []
        if (request.method === 'create') return calls.length + 10
        if (request.method === 'write') return true
        throw new Error(`Unexpected Odoo call ${request.model}.${request.method}`)
      },
    }
    const normalized: NormalizedArtifact = {
      checksum: 'b'.repeat(64), parserVersion: '1', normalizationVersion: '1', recordCount: 1,
      records: [{ sourceLocalId: '1', hierarchy: ['domain', '1'], sourceText: 'sample', language: 'ar', fields: sourceKind === 'tradition' ? { compendium: 'bukhari' } : { lemmas: [{ lemma: 'كتب' }] } }],
    }
    const context = { env: {} as ImportContext['env'], manifestId: 1, snapshotId: 1, manifestCode: 'smoke', sourceKind, authorityClass: sourceKind === 'lexical' ? 'RESEARCH' : 'TRADITION', parserVersion: '1', normalizationVersion: '1', odooClient, odooSessionId: 'opaque-session' } as ImportContext
    await importCanonicalCorpus(normalized, context)
    expect(calls.some((call) => call.startsWith(`${firstModel}.`))).toBe(true)
    expect(calls.some((call) => call.startsWith(`${secondModel}.`))).toBe(true)
    expect(calls.some((call) => call.startsWith('wx.'))).toBe(false)
  })
})
