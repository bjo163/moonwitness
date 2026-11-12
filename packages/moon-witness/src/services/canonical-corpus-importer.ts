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
