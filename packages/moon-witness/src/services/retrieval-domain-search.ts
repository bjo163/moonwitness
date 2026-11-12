import type { Ctx } from '@moon/orm'
import WxContent from '../models/wx-content.js'
import WxTraditionUnit from '../models/wx-tradition-unit.js'
import WxRoot from '../models/wx-root.js'
import WxLexeme from '../models/wx-lexeme.js'
import type { SearchResult } from './retrieval.js'

type TextMatcher = (text: string) => string
type SnippetBuilder = (text: string, query: string) => string

export async function searchScriptureContent(
  env: Ctx,
  query: string,
  normalizedQuery: string,
  normalize: TextMatcher,
  snippet: SnippetBuilder,
): Promise<SearchResult[]> {
  const contents = await WxContent.fetch(WxContent, env, [['active', '=', true]], undefined, { limit: 200 })
  return contents.flatMap((content: any) => {
    const text = content.text || ''
    const matches = text.toLowerCase().includes(query.toLowerCase()) ||
      (normalizedQuery.length >= 2 && normalize(text).includes(normalizedQuery))
    if (!matches) return []
    const translated = (content.contentType || content.content_type) === 'TRANSLATION'
    return [{
      id: `content:${content.id}`,
      type: 'SCRIPTURE',
      title: translated ? `Translation (${content.language || content.language_code || 'id'})` : 'Scripture Passage',
      reference: content.stableKey || content.stable_key || `content:${content.id}`,
      link: `/scripture/1?contentId=${content.id}`,
      snippet: snippet(text, query),
      language: content.language || content.language_code,
      script: content.script,
      edition: String(content.editionId || content.edition_id || ''),
      sourceRevision: content.revision || content.sourceRevision || content.source_revision,
      provenanceId: content.provenanceId || content.provenance_id || null,
    } satisfies SearchResult]
  })
}

export async function searchTraditionUnits(env: Ctx, query: string): Promise<SearchResult[]> {
  const units = await WxTraditionUnit.fetch(WxTraditionUnit, env, [['active', '=', true]], undefined, { limit: 100 })
  const lowerQuery = query.toLowerCase()
  return units.flatMap((unit: any) => {
    const stableKey = unit.stableKey || unit.stable_key || ''
    if (!stableKey.toLowerCase().includes(lowerQuery)) return []
    return [{
      id: `tradition:${unit.id}`,
      type: 'HADITH',
      title: `Tradition Unit ${stableKey}`,
      reference: stableKey,
      link: `/hadiths?unit=${unit.id}`,
      snippet: `Tradition report sequence #${unit.sequence || unit.id}`,
      provenanceId: unit.provenanceId || unit.provenance_id || null,
    } satisfies SearchResult]
  })
}

export async function searchLexical(
  env: Ctx,
  query: string,
  normalizedQuery: string,
  normalize: TextMatcher,
): Promise<SearchResult[]> {
  const results: SearchResult[] = []
  const roots = await WxRoot.fetch(WxRoot, env, [['active', '=', true]], undefined, { limit: 50 })
  for (const root of roots as any[]) {
    const writtenForm = root.writtenForm || root.written_form || ''
    if (writtenForm.includes(query) || normalize(writtenForm).includes(normalizedQuery)) {
      results.push({
        id: `root:${root.id}`,
        type: 'LEXICAL',
        title: `Arabic Root (${writtenForm})`,
        reference: root.stableKey || root.stable_key,
        link: '/matrix/wx.root',
        snippet: `Lexical root: ${writtenForm}`,
        language: root.languageCode || root.language_code,
        provenanceId: root.provenanceId || root.provenance_id || null,
      })
    }
  }

  const lexemes = await WxLexeme.fetch(WxLexeme, env, [['active', '=', true]], undefined, { limit: 50 })
  for (const lexeme of lexemes as any[]) {
    const lemma = lexeme.lemma || ''
    if (lemma.includes(query) || normalize(lemma).includes(normalizedQuery)) {
      results.push({
        id: `lexeme:${lexeme.id}`,
        type: 'LEXICAL',
        title: `Lemma: ${lemma}`,
        reference: lexeme.stableKey || lexeme.stable_key,
        link: '/matrix/wx.lexeme',
        snippet: `Lexical lemma form: ${lemma}`,
        language: lexeme.languageCode || lexeme.language_code,
        provenanceId: lexeme.provenanceId || lexeme.provenance_id || null,
      })
    }
  }
  return results
}
