import type { OdooClient } from '@moon/odoo-bridge'
import type { NormalizedArtifact, ImportContext } from '../types/ingestion.js'

export type OdooImportBootstrap = { sourceId: number; provenanceId: number }

export async function ensureOdooImportBootstrap(
  normalized: NormalizedArtifact,
  ctx: ImportContext,
  client: OdooClient,
  sessionId: string,
): Promise<OdooImportBootstrap> {
  const first = normalized.records[0]?.fields || {}
  const manifestRows = await client.callWithSession<any[]>(sessionId, { model: 'moon.witness.source.manifest', method: 'search_read', args: [[['code', '=', ctx.manifestCode]]], kwargs: { fields: ['id'], limit: 1 } })
  if (!manifestRows[0]?.id) {
    await client.callWithSession(sessionId, {
      model: 'moon.witness.source.manifest',
      method: 'create',
      args: [{ name: ctx.manifestCode, code: ctx.manifestCode, source_kind: ctx.sourceKind, parser_version: ctx.parserVersion, normalization_version: ctx.normalizationVersion, policy_version: String(first.policyVersion || '1.0.0'), manifest_checksum: normalized.checksum }],
      kwargs: {},
    })
  }

  const policyVersion = String(first.policyVersion || '1.0.0')
  const policyRows = await client.callWithSession<any[]>(sessionId, { model: 'moon.witness.source.policy', method: 'search_read', args: [[['name', '=', ctx.manifestCode], ['version', '=', policyVersion]]], kwargs: { fields: ['id'], limit: 1 } })
  if (!policyRows[0]?.id) {
    await client.callWithSession(sessionId, {
      model: 'moon.witness.source.policy',
      method: 'create',
      args: [{ name: ctx.manifestCode, version: policyVersion, authority_class: ctx.authorityClass, allowed_engine_use: 'CONTEXTUAL', source_kind: ctx.sourceKind, rules: {} }],
      kwargs: {},
    })
  }

  const sourceKey = `source:${String(first.sourceCode || ctx.manifestCode || 'corpus-source')}`
  const sourceRows = await client.callWithSession<Record<string, unknown>[]>(sessionId, { model: 'moon.witness.source', method: 'search_read', args: [[['stable_key', '=', sourceKey]]], kwargs: { fields: ['id', 'name'] } })
  const sourceId = sourceRows[0]?.id
    ? Number(sourceRows[0].id)
    : Number(await client.callWithSession(sessionId, { model: 'moon.witness.source', method: 'create', args: [{ name: String(first.sourceName || ctx.manifestCode || 'Corpus Source'), stable_key: sourceKey, source_class: ctx.sourceKind === 'tradition' ? 'HADITH' : 'OTHER', corpus: String(first.corpusCode || 'moonwitness-corpus'), revision: String(first.corpusVersion || '1.0.0') }], kwargs: {} }))
  if (!sourceId) throw new Error('Odoo source creation returned no id')

  const provenanceRows = await client.callWithSession<Record<string, unknown>[]>(sessionId, { model: 'moon.witness.provenance', method: 'search_read', args: [[['source_id', '=', sourceId], ['checksum', '=', normalized.checksum], ['revision', '=', ctx.normalizationVersion]]], kwargs: { fields: ['id'], limit: 1 } })
  const provenanceId = provenanceRows[0]?.id
    ? Number(provenanceRows[0].id)
    : Number(await client.callWithSession(sessionId, { model: 'moon.witness.provenance', method: 'create', args: [{ name: `Import ${ctx.manifestCode}`, source_id: sourceId, revision: ctx.normalizationVersion, checksum: normalized.checksum, method: 'canonical-corpus-importer' }], kwargs: {} }))
  if (!provenanceId) throw new Error('Odoo provenance creation returned no id')
  return { sourceId, provenanceId }
}
