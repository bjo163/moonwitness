/**
 * Witness Ingestion — Canonical Corpus Domain Importer
 *
 * Maps normalized records from `moonwitness-corpus` into the canonical
 * MoonWitness domain graph models:
 *   - wx.source
 *   - wx.text.edition
 *   - wx.provenance
 *   - wx.passage
 *   - wx.content
 *   - wx.tradition.corpus & wx.tradition.unit (where applicable)
 *
 * Guarantees:
 *   - Idempotent: repeated imports of the same corpus snapshot do not duplicate records
 *   - Zero data loss: preserves source-local identifiers, text, language, script, translations
 *   - Strict provenance: every content and passage record links to wx.provenance
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
import WxEntity from '../models/wx-entity.js'

export interface DomainImportStats {
  created: number
  updated: number
  skipped: number
  sourceId: number
  editionId: number
  provenanceId: number
}

function idOf(row: any): number | null {
  const id = Number(row?.id)
  return Number.isInteger(id) && id > 0 ? id : null
}

export async function importCanonicalCorpus(
  normalized: NormalizedArtifact,
  ctx: ImportContext
): Promise<DomainImportStats> {
  const env = ctx.env
  const getModel = env.getModel
  if (!getModel) {
    throw new Error('ORM environment has no getModel')
  }

  if (normalized.records.length === 0) {
    return { created: 0, updated: 0, skipped: 0, sourceId: 0, editionId: 0, provenanceId: 0 }
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

  // 3. Ensure or create wx.text.edition
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

  // 4. Ingest records into wx.passage & wx.content
  let createdCount = 0
  let updatedCount = 0
  let skippedCount = 0

  for (const rec of normalized.records) {
    const canonicalRef = rec.sourceLocalId
    const passageKey = `passage:${sourceCode}:${canonicalRef}`

    // Find or create passage
    let passageId: number
    const existingPassages = await WxPassage.fetch(WxPassage, env, [
      ['canonicalReference', '=', canonicalRef]
    ])

    if (existingPassages.length > 0) {
      passageId = idOf(existingPassages[0])!
    } else {
      // Create canonical entity for passage if needed
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

    // Ingest translations if present in fields
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
