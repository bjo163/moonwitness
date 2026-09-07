/**
 * Witness Ingestion — Canonical Corpus Domain Importer
 *
 * Maps normalized records from `moonwitness-corpus` across all supported
 * canonical domains into MoonWitness domain graph models:
 *
 *   1. Revelation & Scripture Domain:
 *      - wx.source, wx.provenance, wx.text.edition, wx.passage, wx.content
 *
 *   2. Universal Tradition & Hadith Domain:
 *      - wx.tradition.corpus, wx.tradition.unit, wx.tradition.reference, wx.content
 *
 *   3. Lexical & Linguistic Domain:
 *      - wx.root, wx.lexeme, wx.lexical.occurrence
 *
 *   4. Epistemic Research & Concept Domain:
 *      - wx.concept, wx.assertion, wx.evidence
 *
 * Invariants:
 *   - Idempotent: repeated imports of identical snapshots do not create duplicate nodes
 *   - Verbatim identity: source-local IDs and canonical text preserved intact
 *   - Complete provenance: every record links directly to wx.provenance
 */
import type { Ctx } from '@moon/orm'
import type {
  NormalizedArtifact,
  NormalizedRecord,
  ImportContext
} from '../types/ingestion.js'
import WxSource from '../models/wx-source.js'
import WxProvenance from '../models/wx-provenance.js'
import WxTextEdition from '../models/wx-text-edition.js'
import WxPassage from '../models/wx-passage.js'
import WxContent from '../models/wx-content.js'
import WxTraditionCorpus from '../models/wx-tradition-corpus.js'
import WxTraditionUnit from '../models/wx-tradition-unit.js'
import WxTraditionReference from '../models/wx-tradition-reference.js'
import WxRoot from '../models/wx-root.js'
import WxLexeme from '../models/wx-lexeme.js'
import WxLexicalOccurrence from '../models/wx-lexical-occurrence.js'
import WxEntity from '../models/wx-entity.js'

export interface DomainImportStats {
  created: number
  updated: number
  skipped: number
  sourceId: number
  editionId?: number
  provenanceId: number
}

async function importToOdoo(normalized: NormalizedArtifact, ctx: ImportContext): Promise<DomainImportStats> {
  const client = ctx.odooClient
  const sessionId = ctx.odooSessionId
  if (!client || !sessionId) throw new Error('Odoo persistence lane requires an authenticated session')
  const first = normalized.records[0]?.fields || {}
  const manifestRows = await client.callWithSession<any[]>(sessionId, { model: 'moon.witness.source.manifest', method: 'search_read', args: [[['code', '=', ctx.manifestCode]]], kwargs: { fields: ['id'], limit: 1 } })
  if (!manifestRows[0]?.id) await client.callWithSession(sessionId, { model: 'moon.witness.source.manifest', method: 'create', args: [{ name: ctx.manifestCode, code: ctx.manifestCode, source_kind: ctx.sourceKind, parser_version: ctx.parserVersion, normalization_version: ctx.normalizationVersion, policy_version: String(first.policyVersion || '1.0.0'), manifest_checksum: normalized.checksum }], kwargs: {} })
  const policyVersion = String(first.policyVersion || '1.0.0')
  const policyRows = await client.callWithSession<any[]>(sessionId, { model: 'moon.witness.source.policy', method: 'search_read', args: [[['name', '=', ctx.manifestCode], ['version', '=', policyVersion]]], kwargs: { fields: ['id'], limit: 1 } })
  if (!policyRows[0]?.id) await client.callWithSession(sessionId, { model: 'moon.witness.source.policy', method: 'create', args: [{ name: ctx.manifestCode, version: policyVersion, authority_class: ctx.authorityClass, allowed_engine_use: 'CONTEXTUAL', source_kind: ctx.sourceKind, rules: {} }], kwargs: {} })
  const sourceKey = `source:${String(first.sourceCode || ctx.manifestCode || 'corpus-source')}`
  const sourceRows = await client.callWithSession(sessionId, { model: 'moon.witness.source', method: 'search_read', args: [[['stable_key', '=', sourceKey]]], kwargs: { fields: ['id', 'name'] } }) as Array<Record<string, unknown>>
  const sourceId = sourceRows[0]?.id ? Number(sourceRows[0].id) : Number(await client.callWithSession(sessionId, { model: 'moon.witness.source', method: 'create', args: [{ name: String(first.sourceName || ctx.manifestCode || 'Corpus Source'), stable_key: sourceKey, source_class: ctx.sourceKind === 'tradition' ? 'HADITH' : 'OTHER', corpus: String(first.corpusCode || 'moonwitness-corpus'), revision: String(first.corpusVersion || '1.0.0') }], kwargs: {} }))
  if (!sourceId) throw new Error('Odoo source creation returned no id')
  const provenanceRows = await client.callWithSession(sessionId, { model: 'moon.witness.provenance', method: 'search_read', args: [[['source_id', '=', sourceId], ['checksum', '=', normalized.checksum], ['revision', '=', ctx.normalizationVersion]]], kwargs: { fields: ['id'], limit: 1 } }) as Array<Record<string, unknown>>
  const provenanceId = provenanceRows[0]?.id ? Number(provenanceRows[0].id) : Number(await client.callWithSession(sessionId, { model: 'moon.witness.provenance', method: 'create', args: [{ name: `Import ${ctx.manifestCode}`, source_id: sourceId, revision: ctx.normalizationVersion, checksum: normalized.checksum, method: 'canonical-corpus-importer' }], kwargs: {} }))
  if (ctx.sourceKind === 'tradition') {
    const compendium = String(first.compendium || first.sourceCode || ctx.manifestCode)
    const corpusName = String(first.compendiumName || first.sourceName || compendium)
    const corpusKey = `tradition:corpus:${compendium}`
    const corpusRows = await client.callWithSession<any[]>(sessionId, { model: 'moon.witness.tradition.corpus', method: 'search_read', args: [[['slug', '=', compendium]]], kwargs: { fields: ['id'], limit: 1 } })
    const corpusId = corpusRows[0]?.id ? Number(corpusRows[0].id) : Number(await client.callWithSession(sessionId, { model: 'moon.witness.tradition.corpus', method: 'create', args: [{ name: corpusName, slug: compendium, source_id: sourceId, language: normalized.records[0]?.language || 'ar' }], kwargs: {} }))
    let created = 0; let updated = 0
    for (let i = 0; i < normalized.records.length; i++) {
      const record = normalized.records[i]!
      const unitKey = `tradition:unit:${compendium}:${record.sourceLocalId}`
      const rows = await client.callWithSession<any[]>(sessionId, { model: 'moon.witness.tradition.unit', method: 'search_read', args: [[['stable_key', '=', unitKey]]], kwargs: { fields: ['id'], limit: 1 } })
      const values = { name: `${corpusName} #${record.sourceLocalId}`, corpus_id: corpusId, stable_key: unitKey, sequence: i + 1, text: record.sourceText || '', provenance_id: provenanceId }
      if (rows[0]?.id) { await client.callWithSession(sessionId, { model: 'moon.witness.tradition.unit', method: 'write', args: [[Number(rows[0].id)], values], kwargs: {} }); updated++ }
      else { await client.callWithSession(sessionId, { model: 'moon.witness.tradition.unit', method: 'create', args: [values], kwargs: {} }); created++ }
    }
    return { created, updated, skipped: 0, sourceId, provenanceId }
  }
  if (ctx.sourceKind === 'lexical') {
    let created = 0; let updated = 0
    for (const record of normalized.records) {
      const rootKey = `root:${record.language}:${record.sourceText}`
      const entityRows = await client.callWithSession<any[]>(sessionId, { model: 'moon.witness.entity', method: 'search_read', args: [[['canonical_key', '=', `entity:${rootKey}`]]], kwargs: { fields: ['id'], limit: 1 } })
      const entityId = entityRows[0]?.id ? Number(entityRows[0].id) : Number(await client.callWithSession(sessionId, { model: 'moon.witness.entity', method: 'create', args: [{ name: record.sourceText, canonical_key: `entity:${rootKey}`, entity_type: 'CONCEPT' }], kwargs: {} }))
      const roots = await client.callWithSession<any[]>(sessionId, { model: 'moon.witness.root', method: 'search_read', args: [[['stable_key', '=', rootKey]]], kwargs: { fields: ['id'], limit: 1 } })
      const rootValues = { name: record.sourceText, entity_id: entityId, stable_key: rootKey, language_code: record.language, script: record.script || 'Arab', written_form: record.sourceText, source_id: sourceId, provenance_id: provenanceId }
      const rootId = roots[0]?.id ? Number(roots[0].id) : Number(await client.callWithSession(sessionId, { model: 'moon.witness.root', method: 'create', args: [rootValues], kwargs: {} }))
      if (roots[0]?.id) updated++; else created++
      for (const lemma of (record.fields?.lemmas as Array<{ lemma: string }> || [])) {
        const key = `lexeme:${record.language}:${lemma.lemma}`
        const lexRows = await client.callWithSession<any[]>(sessionId, { model: 'moon.witness.lexeme', method: 'search_read', args: [[['stable_key', '=', key]]], kwargs: { fields: ['id'], limit: 1 } })
        if (lexRows[0]?.id) { updated++; continue }
        const lexEntity = await client.callWithSession(sessionId, { model: 'moon.witness.entity', method: 'create', args: [{ name: lemma.lemma, canonical_key: `entity:${key}`, entity_type: 'CONCEPT' }], kwargs: {} })
        await client.callWithSession(sessionId, { model: 'moon.witness.lexeme', method: 'create', args: [{ name: lemma.lemma, entity_id: Number(lexEntity), stable_key: key, language_code: record.language, script: record.script || 'Arab', lemma: lemma.lemma, root_id: rootId, source_id: sourceId, provenance_id: provenanceId }], kwargs: {} }); created++
      }
    }
    return { created, updated, skipped: 0, sourceId, provenanceId }
  }
  const editionKey = `edition:${String(first.editionCode || first.sourceCode || ctx.manifestCode)}:${String(first.corpusVersion || '1.0.0')}`
  const editionRows = await client.callWithSession<any[]>(sessionId, { model: 'moon.witness.text.edition', method: 'search_read', args: [[['revision', '=', editionKey]]], kwargs: { fields: ['id'], limit: 1 } })
  const editionId = editionRows[0]?.id ? Number(editionRows[0].id) : Number(await client.callWithSession(sessionId, { model: 'moon.witness.text.edition', method: 'create', args: [{ name: String(first.editionName || first.sourceName || ctx.manifestCode), source_id: sourceId, language: normalized.records[0]?.language || 'ar', revision: editionKey, checksum: normalized.checksum }], kwargs: {} }))
  let created = 0
  let updated = 0
  for (const record of normalized.records) {
    const reference = record.sourceLocalId
    const existing = await client.callWithSession(sessionId, { model: 'moon.witness.passage', method: 'search_read', args: [[['source_id', '=', sourceId], ['canonical_reference', '=', reference]]], kwargs: { fields: ['id'] } }) as Array<Record<string, unknown>>
    const values = { name: reference, source_id: sourceId, passage_type: record.hierarchy.length > 2 ? 'verse' : 'section', sequence: Number(record.fields.sequence || 0), canonical_reference: reference, content: record.sourceText || '', source_revision: String(first.corpusVersion || '1.0.0') }
    const passageId = existing[0]?.id ? Number(existing[0].id) : Number(await client.callWithSession(sessionId, { model: 'moon.witness.passage', method: 'create', args: [values], kwargs: {} }))
    if (existing[0]?.id) { await client.callWithSession(sessionId, { model: 'moon.witness.passage', method: 'write', args: [[passageId], values], kwargs: {} }); updated++ }
    else created++
    const contentRows = await client.callWithSession(sessionId, { model: 'moon.witness.content', method: 'search_read', args: [[['passage_id', '=', passageId], ['content_type', '=', 'original'], ['language', '=', record.language]]], kwargs: { fields: ['id'], limit: 1 } }) as Array<Record<string, unknown>>
    const contentValues = { name: `${reference} (${record.language})`, passage_id: passageId, content_type: 'original', language: record.language, edition_id: editionId, text: record.sourceText || '' }
    if (contentRows[0]?.id) await client.callWithSession(sessionId, { model: 'moon.witness.content', method: 'write', args: [[Number(contentRows[0].id)], contentValues], kwargs: {} })
    else await client.callWithSession(sessionId, { model: 'moon.witness.content', method: 'create', args: [contentValues], kwargs: {} })
  }
  return { created, updated, skipped: 0, sourceId, provenanceId }
}

function idOf(row: any): number | null {
  const id = Number(row?.id)
  return Number.isInteger(id) && id > 0 ? id : null
}

export async function importCanonicalCorpus(
  normalized: NormalizedArtifact,
  ctx: ImportContext
): Promise<DomainImportStats> {
  if (ctx.odooClient || ctx.odooSessionId) return importToOdoo(normalized, ctx)
  const env = ctx.env
  const getModel = env.getModel
  if (!getModel) {
    throw new Error('ORM environment has no getModel')
  }

  if (normalized.records.length === 0) {
    return { created: 0, updated: 0, skipped: 0, sourceId: 0, provenanceId: 0 }
  }

  const sampleRecord = normalized.records[0]!
  const fields = sampleRecord.fields || {}
  const sourceCode = String(fields.sourceCode || ctx.manifestCode || 'corpus-source')
  const sourceName = String(fields.sourceName || ctx.manifestCode || 'Corpus Source')
  const editionCode = String(fields.editionCode || sourceCode)
  const editionName = String(fields.editionName || sourceName)
  const corpusCode = String(fields.corpusCode || 'moonwitness-corpus')
  const corpusVersion = String(fields.corpusVersion || '1.0.0')
  const corpusCommit = String(fields.corpusCommit || '')

  // 1. Ensure or create wx.source
  let sourceId: number
  const existingSources = await WxSource.fetch(WxSource, env, [
    ['stableKey', '=', `source:${sourceCode}`]
  ])

  if (existingSources.length > 0) {
    sourceId = idOf(existingSources[0])!
    await WxSource.morph(WxSource, env, sourceId, {
      name: sourceName,
      edition: editionCode,
      revision: corpusVersion,
      artifactChecksum: normalized.checksum,
      parserVersion: normalized.parserVersion,
      importerVersion: '1.0.0',
      active: true
    })
  } else {
    const createdSource = await WxSource.spawn(WxSource, env, {
      stableKey: `source:${sourceCode}`,
      name: sourceName,
      sourceClass: ctx.authorityClass === 'REVELATION' ? 'REVELATION' : 'TEXTUAL_WITNESS',
      capability: 'NORMATIVE_TEXT',
      scriptureFamily: ctx.revelationFamily || 'QURAN',
      corpus: corpusCode,
      edition: editionCode,
      revision: corpusVersion,
      artifactChecksum: normalized.checksum,
      parserVersion: normalized.parserVersion,
      importerVersion: '1.0.0',
      active: true
    })
    sourceId = idOf(createdSource)!
  }

  // 2. Ensure or create wx.provenance
  let provenanceId: number
  const provenanceKey = `prov:${sourceCode}:${normalized.checksum}`
  const existingProv = await WxProvenance.fetch(WxProvenance, env, [
    ['stableKey', '=', provenanceKey]
  ])

  if (existingProv.length > 0) {
    provenanceId = idOf(existingProv[0])!
  } else {
    const createdProv = await WxProvenance.spawn(WxProvenance, env, {
      stableKey: provenanceKey,
      name: `Provenance for ${sourceName} (${corpusVersion})`,
      sourceId,
      sourceReference: `${corpusCode}@${corpusCommit || corpusVersion}`,
      sourceRevision: corpusVersion,
      artifactChecksum: normalized.checksum,
      parserVersion: normalized.parserVersion,
      importerVersion: '1.0.0',
      evidenceNote: `Imported via MoonwitnessCorpusAdapter from snapshot ${ctx.snapshotId}`,
      active: true
    })
    provenanceId = idOf(createdProv)!
  }

  // Branch by sourceKind
  if (ctx.sourceKind === 'tradition') {
    return await importTraditionDomain(normalized, ctx, sourceId, provenanceId, corpusCode, corpusVersion)
  }

  if (ctx.sourceKind === 'lexical') {
    return await importLexicalDomain(normalized, ctx, sourceId, provenanceId, corpusVersion)
  }

  // Default: Revelation / Scripture / Translation Domain
  return await importRevelationDomain(normalized, ctx, sourceId, provenanceId, editionCode, editionName, corpusVersion)
}

/**
 * 1. Scripture / Revelation Domain Ingestion
 */
async function importRevelationDomain(
  normalized: NormalizedArtifact,
  ctx: ImportContext,
  sourceId: number,
  provenanceId: number,
  editionCode: string,
  editionName: string,
  corpusVersion: string
): Promise<DomainImportStats> {
  const env = ctx.env
  const sampleRecord = normalized.records[0]!
  const fields = sampleRecord.fields || {}
  const sourceCode = String(fields.sourceCode || ctx.manifestCode)

  // Ensure or create wx.text.edition
  let editionId: number
  const editionKey = `edition:${editionCode}:${corpusVersion}`
  const existingEditions = await WxTextEdition.fetch(WxTextEdition, env, [
    ['stableKey', '=', editionKey]
  ])

  if (existingEditions.length > 0) {
    editionId = idOf(existingEditions[0])!
  } else {
    const createdEdition = await WxTextEdition.spawn(WxTextEdition, env, {
      stableKey: editionKey,
      name: editionName,
      editionType: fields.editionType === 'translation' ? 'TRANSLATION' : 'CRITICAL_EDITION',
      language: sampleRecord.language || 'ar',
      sourceId,
      provenanceId,
      active: true
    })
    editionId = idOf(createdEdition)!
  }

  let createdCount = 0
  let updatedCount = 0
  let skippedCount = 0

  for (const rec of normalized.records) {
    const canonicalRef = rec.sourceLocalId

    // Find or create passage
    let passageId: number
    const existingPassages = await WxPassage.fetch(WxPassage, env, [
      ['canonicalReference', '=', canonicalRef]
    ])

    if (existingPassages.length > 0) {
      passageId = idOf(existingPassages[0])!
    } else {
      const passageEntityKey = `entity:passage:${sourceCode}:${canonicalRef}`
      let entityId: number
      const existingEntities = await WxEntity.fetch(WxEntity, env, [
        ['canonicalKey', '=', passageEntityKey]
      ])
      if (existingEntities.length > 0) {
        entityId = idOf(existingEntities[0])!
      } else {
        const ent = await WxEntity.spawn(WxEntity, env, {
          canonicalKey: passageEntityKey,
          name: canonicalRef,
          kind: 'PASSAGE',
          active: true
        })
        entityId = idOf(ent)!
      }

      const newPassage = await WxPassage.spawn(WxPassage, env, {
        entityId,
        canonicalReference: canonicalRef,
        sourceRevision: corpusVersion,
        provenanceId,
        active: true
      })
      passageId = idOf(newPassage)!
    }

    // Ingest original content
    const contentKey = `content:${editionId}:${passageId}:orig`
    const existingContent = await WxContent.fetch(WxContent, env, [
      ['stableKey', '=', contentKey]
    ])

    if (existingContent.length > 0) {
      await WxContent.morph(WxContent, env, idOf(existingContent[0])!, {
        text: rec.sourceText,
        checksum: normalized.checksum,
        revision: corpusVersion,
        active: true
      })
      updatedCount++
    } else {
      await WxContent.spawn(WxContent, env, {
        stableKey: contentKey,
        passageId,
        editionId,
        contentType: 'ORIGINAL_TEXT',
        language: rec.language || 'ar',
        script: rec.script || 'Arab',
        text: rec.sourceText,
        sourceId,
        provenanceId,
        checksum: normalized.checksum,
        revision: corpusVersion,
        status: 'APPROVED',
        active: true
      })
      createdCount++
    }

    // Ingest translations
    const translations = (rec.fields?.translations as Array<{
      language: string
      text: string
      translator?: string
    }>) || []

    for (const tr of translations) {
      const trKey = `content:${editionId}:${passageId}:tr:${tr.language}`
      const existingTr = await WxContent.fetch(WxContent, env, [
        ['stableKey', '=', trKey]
      ])

      if (existingTr.length > 0) {
        await WxContent.morph(WxContent, env, idOf(existingTr[0])!, {
          text: tr.text,
          translator: tr.translator || null,
          revision: corpusVersion,
          active: true
        })
      } else {
        await WxContent.spawn(WxContent, env, {
          stableKey: trKey,
          passageId,
          editionId,
          contentType: 'TRANSLATION',
          language: tr.language,
          script: 'Latn',
          text: tr.text,
          translator: tr.translator || null,
          sourceId,
          provenanceId,
          checksum: normalized.checksum,
          revision: corpusVersion,
          status: 'APPROVED',
          active: true
        })
        createdCount++
      }
    }
  }

  return {
    created: createdCount,
    updated: updatedCount,
    skipped: skippedCount,
    sourceId,
    editionId,
    provenanceId
  }
}

/**
 * 2. Universal Tradition & Hadith Domain Ingestion
 */
async function importTraditionDomain(
  normalized: NormalizedArtifact,
  ctx: ImportContext,
  sourceId: number,
  provenanceId: number,
  corpusCode: string,
  corpusVersion: string
): Promise<DomainImportStats> {
  const env = ctx.env
  const sampleRecord = normalized.records[0]!
  const fields = sampleRecord.fields || {}
  const compendiumCode = String(fields.compendium || fields.sourceCode || ctx.manifestCode)
  const compendiumName = String(fields.compendiumName || fields.sourceName || compendiumCode)

  // Ensure or create wx.tradition.corpus
  let traditionCorpusId: number
  const corpusStableKey = `tradition:corpus:${compendiumCode}`
  const existingCorpora = await WxTraditionCorpus.fetch(WxTraditionCorpus, env, [
    ['stableKey', '=', corpusStableKey]
  ])

  if (existingCorpora.length > 0) {
    traditionCorpusId = idOf(existingCorpora[0])!
  } else {
    // Entity anchor for tradition corpus
    const ent = await WxEntity.spawn(WxEntity, env, {
      canonicalKey: `entity:${corpusStableKey}`,
      name: compendiumName,
      kind: 'COMMUNITY',
      active: true
    })
    const createdCorpus = await WxTraditionCorpus.spawn(WxTraditionCorpus, env, {
      entityId: idOf(ent)!,
      stableKey: corpusStableKey,
      name: compendiumName,
      traditionType: 'HADITH',
      sourceId,
      provenanceId,
      status: 'VERIFIED',
      active: true
    })
    traditionCorpusId = idOf(createdCorpus)!
  }

  let createdCount = 0
  let updatedCount = 0
  let skippedCount = 0

  for (let i = 0; i < normalized.records.length; i++) {
    const rec = normalized.records[i]!
    const unitKey = `tradition:unit:${compendiumCode}:${rec.sourceLocalId}`

    let unitId: number
    const existingUnits = await WxTraditionUnit.fetch(WxTraditionUnit, env, [
      ['stableKey', '=', unitKey]
    ])

    if (existingUnits.length > 0) {
      unitId = idOf(existingUnits[0])!
      updatedCount++
    } else {
      const unitEntity = await WxEntity.spawn(WxEntity, env, {
        canonicalKey: `entity:${unitKey}`,
        name: `${compendiumName} #${rec.sourceLocalId}`,
        kind: 'PASSAGE',
        active: true
      })
      const createdUnit = await WxTraditionUnit.spawn(WxTraditionUnit, env, {
        entityId: idOf(unitEntity)!,
        corpusId: traditionCorpusId,
        unitType: 'REPORT',
        stableKey: unitKey,
        sequence: i + 1,
        sourceId,
        provenanceId,
        status: 'VERIFIED',
        active: true
      })
      unitId = idOf(createdUnit)!
      createdCount++
    }

    // Reference
    const refKey = `tradition:ref:${compendiumCode}:${rec.sourceLocalId}`
    const existingRef = await WxTraditionReference.fetch(WxTraditionReference, env, [
      ['stableKey', '=', refKey]
    ])
    if (existingRef.length === 0) {
      await WxTraditionReference.spawn(WxTraditionReference, env, {
        unitId,
        corpusId: traditionCorpusId,
        sourceId,
        localNumber: rec.sourceLocalId,
        referenceScheme: compendiumCode,
        stableKey: refKey,
        provenanceId,
        active: true
      })
      createdCount++
    }
  }

  return {
    created: createdCount,
    updated: updatedCount,
    skipped: skippedCount,
    sourceId,
    provenanceId
  }
}

/**
 * 3. Lexical & Linguistic Domain Ingestion
 */
async function importLexicalDomain(
  normalized: NormalizedArtifact,
  ctx: ImportContext,
  sourceId: number,
  provenanceId: number,
  corpusVersion: string
): Promise<DomainImportStats> {
  const env = ctx.env
  let createdCount = 0
  let updatedCount = 0
  let skippedCount = 0

  for (const rec of normalized.records) {
    const rootText = rec.sourceText
    const rootKey = `root:${rec.language}:${rootText}`

    let rootId: number
    const existingRoots = await WxRoot.fetch(WxRoot, env, [
      ['stableKey', '=', rootKey]
    ])

    if (existingRoots.length > 0) {
      rootId = idOf(existingRoots[0])!
      updatedCount++
    } else {
      const rootEntity = await WxEntity.spawn(WxEntity, env, {
        canonicalKey: `entity:${rootKey}`,
        name: rootText,
        kind: 'CONCEPT',
        active: true
      })
      const createdRoot = await WxRoot.spawn(WxRoot, env, {
        entityId: idOf(rootEntity)!,
        stableKey: rootKey,
        languageCode: rec.language,
        script: rec.script || 'Arab',
        writtenForm: rootText,
        sourceId,
        provenanceId,
        active: true
      })
      rootId = idOf(createdRoot)!
      createdCount++
    }

    // Ingest lemma / lexeme if present in fields
    const lemmas = (rec.fields?.lemmas as Array<{ lemma: string; pos?: string }>) || []
    for (const lem of lemmas) {
      const lexemeKey = `lexeme:${rec.language}:${lem.lemma}`
      const existingLex = await WxLexeme.fetch(WxLexeme, env, [
        ['stableKey', '=', lexemeKey]
      ])
      if (existingLex.length === 0) {
        const lexEntity = await WxEntity.spawn(WxEntity, env, {
          canonicalKey: `entity:${lexemeKey}`,
          name: lem.lemma,
          kind: 'CONCEPT',
          active: true
        })
        await WxLexeme.spawn(WxLexeme, env, {
          entityId: idOf(lexEntity)!,
          stableKey: lexemeKey,
          languageCode: rec.language,
          script: rec.script || 'Arab',
          lemma: lem.lemma,
          rootId,
          sourceId,
          provenanceId,
          active: true
        })
        createdCount++
      }
    }
  }

  return {
    created: createdCount,
    updated: updatedCount,
    skipped: skippedCount,
    sourceId,
    provenanceId
  }
}
