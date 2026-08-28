import { sha256String, stableSerialize } from './hash.js'
import type {
  EngineOutputAuthorityClass,
  EngineScope,
  EngineScopeInput,
  EngineSourceRevision,
  RevelationFamily
} from '../types/engine.js'

const REVELATION_FAMILIES = new Set<RevelationFamily>(['QURAN', 'TAWRAT', 'ZABUR', 'INJIL'])
const AUTHORITY_CLASSES = new Set<EngineOutputAuthorityClass>([
  'PRIMARY_SOURCE',
  'TRANSLATION',
  'TRANSMISSION_REPORT',
  'SOURCE_SUMMARY',
  'SCHOLARLY_INTERPRETATION',
  'DERIVED',
  'HYPOTHESIS',
  'AI_ASSISTED'
])

function uniqueStrings(values: string[] | undefined, normalize: (value: string) => string): string[] {
  return [...new Set((values ?? []).map(normalize).filter(Boolean))].sort()
}

function ids(values: number[] | undefined, name: string): number[] {
  const normalized = [...new Set((values ?? []).map(Number))].sort((left, right) => left - right)
  if (normalized.some((value) => !Number.isSafeInteger(value) || value < 1)) {
    throw new Error(`${name} must contain positive integer identifiers`)
  }
  return normalized
}

function revisions(values: EngineSourceRevision[] | undefined): EngineSourceRevision[] {
  const seen = new Set<string>()
  const normalized = (values ?? []).map((value) => {
    const sourceKey = value.sourceKey?.trim()
    const revision = value.revision?.trim()
    if (!sourceKey || !revision) throw new Error('Every engine source revision requires sourceKey and revision')
    const family = value.family?.trim().toUpperCase() as RevelationFamily | undefined
    if (family && !REVELATION_FAMILIES.has(family)) throw new Error(`Unsupported revelation family: ${family}`)
    const authorityClass = value.authorityClass?.trim().toUpperCase() as EngineOutputAuthorityClass | undefined
    if (authorityClass && !AUTHORITY_CLASSES.has(authorityClass)) throw new Error(`Unsupported authority class: ${authorityClass}`)
    const editionKey = value.editionKey?.trim() || undefined
    const key = `${sourceKey}\u0000${editionKey ?? ''}\u0000${revision}`
    if (seen.has(key)) throw new Error(`Duplicate engine source revision: ${sourceKey}@${revision}`)
    seen.add(key)
    return { sourceKey, revision, editionKey, family, authorityClass }
  })
  return normalized.sort((left, right) => stableSerialize(left).localeCompare(stableSerialize(right)))
}

/**
 * Normalize all execution scopes before a module sees them. The default is the
 * fixed normative Revelation family set; Hadith and derived assertions remain
 * opt-in and source policy checks stay the responsibility of graph-backed modules.
 */
export function resolveEngineScope(input: EngineScopeInput = {}): EngineScope {
  const scriptureFamilies = uniqueStrings(input.scriptureFamilies, (value) => value.trim().toUpperCase()) as RevelationFamily[]
  const selectedFamilies: RevelationFamily[] = scriptureFamilies.length ? scriptureFamilies : ['QURAN', 'TAWRAT', 'ZABUR', 'INJIL']
  if (selectedFamilies.some((value) => !REVELATION_FAMILIES.has(value))) {
    throw new Error('Scope scriptureFamilies supports only QURAN, TAWRAT, ZABUR, and INJIL')
  }

  const authorityClasses = uniqueStrings(input.authorityClasses, (value) => value.trim().toUpperCase()) as EngineOutputAuthorityClass[]
  const selectedAuthorityClasses: EngineOutputAuthorityClass[] = authorityClasses.length ? authorityClasses : ['PRIMARY_SOURCE']
  if (selectedAuthorityClasses.some((value) => !AUTHORITY_CLASSES.has(value))) {
    throw new Error('Scope authorityClasses contains an unsupported output authority class')
  }

  const maxDepth = input.traversal?.maxDepth ?? 2
  const maxNodes = input.traversal?.maxNodes ?? 100
  if (!Number.isInteger(maxDepth) || maxDepth < 0 || maxDepth > 4) throw new Error('Scope traversal.maxDepth must be an integer from 0 through 4')
  if (!Number.isInteger(maxNodes) || maxNodes < 1 || maxNodes > 500) throw new Error('Scope traversal.maxNodes must be an integer from 1 through 500')

  return {
    scriptureFamilies: selectedFamilies,
    sourceRevisions: revisions(input.sourceRevisions),
    languagePreferences: uniqueStrings(input.languagePreferences, (value) => value.trim().toLowerCase()),
    authorityClasses: selectedAuthorityClasses,
    includeHadith: input.includeHadith === true,
    includeDerivedAssertions: input.includeDerivedAssertions === true,
    figureIds: ids(input.figureIds, 'Scope figureIds'),
    conceptIds: ids(input.conceptIds, 'Scope conceptIds'),
    relationCodes: uniqueStrings(input.relationCodes, (value) => value.trim().toUpperCase()),
    eventIds: ids(input.eventIds, 'Scope eventIds'),
    placeIds: ids(input.placeIds, 'Scope placeIds'),
    traversal: { maxDepth, maxNodes }
  }
}

export function checksumEngineScope(scope: EngineScope): string {
  return sha256String(stableSerialize(scope))
}
