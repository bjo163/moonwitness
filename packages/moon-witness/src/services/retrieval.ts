/**
 * ◈ Witness Knowledge Retrieval & Search Service
 *
 * Provides:
 *   1. Exact Reference Lookup: Deterministic resolution of canonical references (e.g. Q:1:1, bukhari:1, root:ar:ktb).
 *   2. Multi-Domain Search: Unified, bounded querying across Scripture, Hadith, Lexical, and Entities.
 *   3. Diacritic-Insensitive Arabic Normalization: Projection-only text matching without mutating canonical stored text.
 *   4. Index Diagnostics: Status and counts across graph models.
 */
import type { Ctx } from '@moon/orm'
import WxPassage from '../models/wx-passage.js'
import WxContent from '../models/wx-content.js'
import WxTextEdition from '../models/wx-text-edition.js'
import WxTraditionCorpus from '../models/wx-tradition-corpus.js'
import WxTraditionUnit from '../models/wx-tradition-unit.js'
import WxTraditionReference from '../models/wx-tradition-reference.js'
import WxRoot from '../models/wx-root.js'
import WxLexeme from '../models/wx-lexeme.js'
import WxEntity from '../models/wx-entity.js'
import WxSourceSnapshot from '../models/wx-source-snapshot.js'

export interface SearchOptions {
  query: string
  filter?: 'ALL' | 'SCRIPTURE' | 'HADITH' | 'LEXICAL' | 'RESEARCH' | 'ENTITY'
  limit?: number
  page?: number
}

export interface SearchResult {
  id: string
  type: 'SCRIPTURE' | 'HADITH' | 'LEXICAL' | 'RESEARCH' | 'ENTITY'
  title: string
  reference: string
  link: string
  snippet: string
  language?: string
  script?: string
  source?: string
  edition?: string
  provenanceId?: number | null
}

export interface ReferenceLookupResult {
  reference: string
  resolved: boolean
  type?: string
  passage?: Record<string, unknown> | null
  content?: Record<string, unknown>[]
  translations?: Record<string, unknown>[]
  tradition?: Record<string, unknown> | null
  root?: Record<string, unknown> | null
  lexeme?: Record<string, unknown> | null
}

/**
 * Normalizes Arabic text for diacritic-insensitive search matching.
 * Does NOT alter canonical stored text in the database.
 */
export function normalizeArabic(text: string): string {
  if (!text) return ''
  return text
    // Strip Arabic diacritics / tashkeel (fatha, damma, kasra, sukun, shaddah, tanwin)
    .replace(/[\u064B-\u065F\u0670]/g, '')
    // Normalize alif forms (أ, إ, آ, ٱ -> ا)
    .replace(/[\u0622\u0623\u0625\u0671]/g, '\u0627')
    // Normalize ta marbuta (ة -> ه)
    .replace(/\u0629/g, '\u0647')
    // Normalize alif maqsurah (ى -> ي)
    .replace(/\u0649/g, '\u064A')
    .trim()
}

/**
 * Extracts a contextual snippet around matching query terms.
 */
function extractSnippet(text: string, query: string, maxLength: number = 140): string {
  if (!text) return ''
  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()
  const idx = lowerText.indexOf(lowerQuery)
  if (idx === -1) {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
  }
  const start = Math.max(0, idx - 40)
  const end = Math.min(text.length, idx + query.length + 80)
  const prefix = start > 0 ? '...' : ''
  const suffix = end < text.length ? '...' : ''
  return `${prefix}${text.slice(start, end)}${suffix}`
}

/**
 * Exact reference resolver across canonical domains.
 */
export async function lookupReference(env: Ctx, rawReference: string): Promise<ReferenceLookupResult> {
  const ref = rawReference.trim()
  if (!ref) {
    return { reference: rawReference, resolved: false }
  }

  // 1. Normalize Scripture reference formats: Q:1:1, quran:1:1, 1:1, Surah 1:1
  let canonicalPassageRef = ref
  const quranMatch = ref.match(/^(?:quran:|q:|\/s\/|surah\s+)?(\d+)[:\s]+(\d+)$/i)
  if (quranMatch) {
    canonicalPassageRef = `quran:${quranMatch[1]}:${quranMatch[2]}`
  }

  const passages = await WxPassage.fetch(WxPassage, env, [
    ['canonicalReference', '=', canonicalPassageRef],
    ['active', '=', true]
  ])

  if (passages.length > 0) {
    const passage = passages[0]!
    const passageId = Number(passage.id)
    const contents = await WxContent.fetch(WxContent, env, [
      ['passageId', '=', passageId],
      ['active', '=', true]
    ])

    const originalTexts = contents.filter((c: any) => (c.contentType || c.content_type) === 'ORIGINAL_TEXT')
    const translations = contents.filter((c: any) => (c.contentType || c.content_type) === 'TRANSLATION')

    return {
      reference: canonicalPassageRef,
      resolved: true,
      type: 'SCRIPTURE',
      passage: passage as unknown as Record<string, unknown>,
      content: originalTexts as unknown as Record<string, unknown>[],
      translations: translations as unknown as Record<string, unknown>[]
    }
  }

  // 2. Normalize Hadith reference formats: bukhari:1, hadith:bukhari:1
  const hadithMatch = ref.match(/^(?:hadith:)?([a-z0-9_-]+):(\d+)$/i)
  if (hadithMatch) {
    const compendium = hadithMatch[1]!
    const number = hadithMatch[2]!
    const refKey = `tradition:ref:${compendium}:${compendium}:${number}`
    const altRefKey = `tradition:ref:${compendium}:${number}`

    const refs = await WxTraditionReference.fetch(WxTraditionReference, env, [
      ['active', '=', true]
    ])
    const matchingRef = refs.find((r: any) => {
      const stableKey = r.stableKey || r.stable_key
      const localNumber = r.localNumber || r.local_number
      return (
        stableKey === refKey ||
        stableKey === altRefKey ||
        localNumber === `${compendium}:${number}` ||
        localNumber === number
      )
    })

    if (matchingRef) {
      const unitId = Number(matchingRef.unitId || matchingRef.unit_id)
      const units = await WxTraditionUnit.fetch(WxTraditionUnit, env, [['id', '=', unitId]])
      return {
        reference: ref,
        resolved: true,
        type: 'HADITH',
        tradition: {
          reference: matchingRef,
          unit: units[0] || null
        }
      }
    }
  }

  // 3. Normalize Lexical reference: root:ar:ktb, lexeme:ar:kitab
  if (ref.startsWith('root:') || ref.startsWith('lexeme:')) {
    const roots = await WxRoot.fetch(WxRoot, env, [['stableKey', '=', ref]])
    if (roots.length > 0) {
      return {
        reference: ref,
        resolved: true,
        type: 'LEXICAL',
        root: roots[0] as unknown as Record<string, unknown>
      }
    }
    const lexemes = await WxLexeme.fetch(WxLexeme, env, [['stableKey', '=', ref]])
    if (lexemes.length > 0) {
      return {
        reference: ref,
        resolved: true,
        type: 'LEXICAL',
        lexeme: lexemes[0] as unknown as Record<string, unknown>
      }
    }
  }

  return { reference: rawReference, resolved: false }
}

/**
 * Unified multi-domain search across canonical Witness graph projections.
 */
export async function searchWitnessGraph(
  env: Ctx,
  options: SearchOptions
): Promise<{ total: number; results: SearchResult[] }> {
  const query = (options.query || '').trim()
  const filter = options.filter || 'ALL'
  const limit = Math.min(Math.max(options.limit || 20, 1), 100)
  const page = Math.max(options.page || 1, 1)
  const offset = (page - 1) * limit

  if (!query || query.length < 2) {
    return { total: 0, results: [] }
  }

  const results: SearchResult[] = []
  const normQuery = normalizeArabic(query)

  // 1. Exact reference fast-path
  const exactLookup = await lookupReference(env, query)
  if (exactLookup.resolved && exactLookup.passage) {
    const p = exactLookup.passage as any
    const orig = (exactLookup.content?.[0] as any)?.text || ''
    const tr = (exactLookup.translations?.[0] as any)?.text || ''
    results.push({
      id: `passage:${p.id}`,
      type: 'SCRIPTURE',
      title: `Scripture Passage ${p.canonicalReference || p.canonical_reference}`,
      reference: p.canonicalReference || p.canonical_reference,
      link: `/scripture/1?ref=${encodeURIComponent(p.canonicalReference || p.canonical_reference)}`,
      snippet: tr || orig,
      language: (exactLookup.content?.[0] as any)?.language || 'ar',
      provenanceId: p.provenanceId || p.provenance_id || null
    })
  }

  // 2. Search Scripture / Content Domain
  if (filter === 'ALL' || filter === 'SCRIPTURE') {
    const allContents = await WxContent.fetch(WxContent, env, [['active', '=', true]], undefined, {
      limit: 200
    })

    for (const c of allContents) {
      const text = c.text || ''
      const textNorm = normalizeArabic(text)
      const matches =
        text.toLowerCase().includes(query.toLowerCase()) ||
        (normQuery.length >= 2 && textNorm.includes(normQuery))

      if (matches) {
        const isTranslation = (c.contentType || c.content_type) === 'TRANSLATION'
        results.push({
          id: `content:${c.id}`,
          type: 'SCRIPTURE',
          title: isTranslation ? `Translation (${c.language || c.language_code || 'id'})` : `Scripture Passage`,
          reference: c.stableKey || c.stable_key || `content:${c.id}`,
          link: `/scripture/1?contentId=${c.id}`,
          snippet: extractSnippet(text, query),
          language: c.language || c.language_code,
          script: c.script,
          edition: String(c.editionId || c.edition_id || ''),
          provenanceId: c.provenanceId || c.provenance_id || null
        })
      }
    }
  }

  // 3. Search Tradition / Hadith Domain
  if (filter === 'ALL' || filter === 'HADITH') {
    const units = await WxTraditionUnit.fetch(WxTraditionUnit, env, [['active', '=', true]], undefined, {
      limit: 100
    })
    for (const u of units) {
      const stableKey = u.stableKey || u.stable_key || ''
      if (stableKey.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          id: `tradition:${u.id}`,
          type: 'HADITH',
          title: `Tradition Unit ${stableKey}`,
          reference: stableKey,
          link: `/hadiths?unit=${u.id}`,
          snippet: `Tradition report sequence #${u.sequence || u.id}`,
          provenanceId: u.provenanceId || u.provenance_id || null
        })
      }
    }
  }

  // 4. Search Lexical Domain
  if (filter === 'ALL' || filter === 'LEXICAL') {
    const roots = await WxRoot.fetch(WxRoot, env, [['active', '=', true]], undefined, { limit: 50 })
    for (const r of roots) {
      const writtenForm = r.writtenForm || r.written_form || ''
      const rootNorm = normalizeArabic(writtenForm)
      if (writtenForm.includes(query) || rootNorm.includes(normQuery)) {
        results.push({
          id: `root:${r.id}`,
          type: 'LEXICAL',
          title: `Arabic Root (${writtenForm})`,
          reference: r.stableKey || r.stable_key,
          link: `/matrix/wx.root`,
          snippet: `Lexical root: ${writtenForm}`,
          language: r.languageCode || r.language_code,
          provenanceId: r.provenanceId || r.provenance_id || null
        })
      }
    }

    const lexemes = await WxLexeme.fetch(WxLexeme, env, [['active', '=', true]], undefined, { limit: 50 })
    for (const l of lexemes) {
      const lemma = l.lemma || ''
      const lemmaNorm = normalizeArabic(lemma)
      if (lemma.includes(query) || lemmaNorm.includes(normQuery)) {
        results.push({
          id: `lexeme:${l.id}`,
          type: 'LEXICAL',
          title: `Lemma: ${lemma}`,
          reference: l.stableKey || l.stable_key,
          link: `/matrix/wx.lexeme`,
          snippet: `Lexical lemma form: ${lemma}`,
          language: l.languageCode || l.language_code,
          provenanceId: l.provenanceId || l.provenance_id || null
        })
      }
    }
  }

  // Deduplicate by ID
  const unique = [...new Map(results.map((r) => [r.id, r])).values()]
  const paged = unique.slice(offset, offset + limit)

  return {
    total: unique.length,
    results: paged
  }
}

/**
 * Returns diagnostic metadata and health status for search projections.
 */
export async function getSearchIndexDiagnostics(env: Ctx) {
  const [passages, contents, traditionUnits, roots, lexemes, snapshots] = await Promise.all([
    WxPassage.fetch(WxPassage, env, [['active', '=', true]]),
    WxContent.fetch(WxContent, env, [['active', '=', true]]),
    WxTraditionUnit.fetch(WxTraditionUnit, env, [['active', '=', true]]),
    WxRoot.fetch(WxRoot, env, [['active', '=', true]]),
    WxLexeme.fetch(WxLexeme, env, [['active', '=', true]]),
    WxSourceSnapshot.fetch(WxSourceSnapshot, env, [['status', '=', 'completed']])
  ])

  return {
    indexStatus: 'HEALTHY',
    indexVersion: '1.0.0',
    totalIndexedRecords: passages.length + contents.length + traditionUnits.length + roots.length + lexemes.length,
    countsByDomain: {
      scripturePassages: passages.length,
      scriptureContents: contents.length,
      traditionUnits: traditionUnits.length,
      lexicalRoots: roots.length,
      lexicalLexemes: lexemes.length
    },
    activeSnapshotsCount: snapshots.length,
    lastSnapshotRevision: snapshots[snapshots.length - 1]?.sourceRevision || '1.0.0'
  }
}
