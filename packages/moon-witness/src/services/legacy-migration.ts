import { sha256String, stableSerialize } from './hash.ts'
import {
  LEGACY_WITNESS_MODELS,
  type LegacyMigrationCursor,
  type LegacyMigrationOperation,
  type LegacyMigrationPlan,
  type LegacyRecord,
  type LegacyRecordBatch,
  type LegacyWitnessModel,
  type MigrationOperationStatus
} from '../types/migration.ts'

const DEFAULT_ADAPTER_VERSION = 'legacy-witness-v1'
const MODEL_ORDER = new Map<LegacyWitnessModel, number>(LEGACY_WITNESS_MODELS.map((model, index) => [model, index]))
const NORMATIVE_FAMILIES = ['quran', 'tawrat', 'torah', 'zabur', 'psalm', 'injil', 'gospel']

function text(record: LegacyRecord, ...keys: string[]): string {
  for (const key of keys) {
    const value = record[key]
    if (value !== undefined && value !== null && String(value).trim()) return String(value).trim()
  }
  return ''
}

function number(record: LegacyRecord, ...keys: string[]): number | null {
  for (const key of keys) {
    const parsed = Number(record[key])
    if (Number.isInteger(parsed) && parsed > 0) return parsed
  }
  return null
}

function sourceId(record: LegacyRecord): string {
  return String(record.id)
}

function sourceChecksum(record: LegacyRecord): string {
  return sha256String(stableSerialize(record))
}

function mappingKey(adapterVersion: string, model: LegacyWitnessModel, id: string, checksum: string, suffix: string): string {
  return `legacy:${adapterVersion}:${model}:${id}:${checksum.slice(0, 16)}:${suffix}`
}

function operation(
  record: LegacyRecord,
  adapterVersion: string,
  targetModel: string,
  suffix: string,
  fields: Record<string, unknown>,
  options: { targetCanonicalKey?: string; parentCanonicalKey?: string; status?: MigrationOperationStatus; warning?: string } = {}
): LegacyMigrationOperation {
  const id = sourceId(record)
  const checksum = sourceChecksum(record)
  const key = mappingKey(adapterVersion, record._legacyModel as LegacyWitnessModel, id, checksum, suffix)
  return {
    operationKey: key,
    mappingKey: key,
    sourceModel: record._legacyModel as LegacyWitnessModel,
    sourceRecordId: id,
    sourceChecksum: checksum,
    adapterVersion,
    targetModel,
    targetCanonicalKey: options.targetCanonicalKey,
    parentCanonicalKey: options.parentCanonicalKey,
    status: options.status ?? 'READY',
    fields,
    warning: options.warning
  }
}

function withModel(model: LegacyWitnessModel, record: LegacyRecord): LegacyRecord {
  return { ...record, _legacyModel: model }
}

function scriptureKey(record: LegacyRecord): string {
  return `legacy:wx.scripture:${sourceId(record)}`
}

function bookKey(record: LegacyRecord): string {
  return `legacy:wx.scripture.book:${sourceId(record)}`
}

function verseKey(record: LegacyRecord): string {
  return `legacy:wx.scripture.verse:${sourceId(record)}`
}

function traditionKey(record: LegacyRecord): string {
  return `legacy:wx.tradition:${sourceId(record)}`
}

function itemKey(record: LegacyRecord): string {
  return `legacy:wx.tradition.item:${sourceId(record)}`
}

function asmaKey(record: LegacyRecord): string {
  return `legacy:wx.asmaul.husna:${sourceId(record)}`
}

function isNormativeScripture(record: LegacyRecord): boolean {
  const haystack = [text(record, 'slug', 'canonicalCode', 'name', 'originalName'), text(record, 'religion')].join(' ').toLowerCase()
  return NORMATIVE_FAMILIES.some((family) => haystack.includes(family))
}

function scriptureOperation(record: LegacyRecord, adapterVersion: string): LegacyMigrationOperation {
  const canonical = scriptureKey(record)
  const normative = isNormativeScripture(record)
  return operation(record, adapterVersion, 'wx.scripture', 'scripture', {
    entity: {
      canonicalKey: canonical,
      kind: 'SCRIPTURE_FAMILY',
      label: text(record, 'name', 'originalName') || `Legacy scripture ${sourceId(record)}`,
      sourceClass: normative ? 'REVELATION' : 'UNKNOWN',
      authorityClass: normative ? 'PRIMARY_SOURCE' : 'NOT_APPLICABLE',
      epistemicLane: 'UNRESOLVED',
      operationalStatus: normative ? 'ESTABLISHED' : 'PROVISIONAL'
    },
    canonicalCode: canonical,
    normative,
    legacyType: text(record, 'type') || 'unknown'
  }, { targetCanonicalKey: canonical })
}

function bookOperation(record: LegacyRecord, adapterVersion: string, scriptureById: Map<string, string>): LegacyMigrationOperation {
  const scriptureId = number(record, 'scriptureId', 'scripture_id')
  const parentCanonicalKey = scriptureId ? scriptureById.get(String(scriptureId)) : undefined
  const sequence = number(record, 'bookNumber', 'book_number', 'number') ?? 0
  const canonical = bookKey(record)
  const warning = parentCanonicalKey ? undefined : 'Legacy book has no resolvable scripture parent; kept as unresolved migration work.'
  return operation(record, adapterVersion, 'wx.passage', 'passage', {
    entity: {
      canonicalKey: canonical,
      kind: 'BOOK',
      label: text(record, 'name', 'nameOriginal') || `Legacy book ${sourceId(record)}`,
      sourceClass: 'SCRIPTURAL_METADATA',
      authorityClass: 'SOURCE_SUMMARY',
      epistemicLane: 'UNRESOLVED',
      operationalStatus: 'PROVISIONAL'
    },
    scriptureLegacyId: scriptureId,
    passageType: 'BOOK',
    sequence,
    localNumber: sequence,
    canonicalReference: `legacy:book:${sourceId(record)}`
  }, {
    targetCanonicalKey: canonical,
    parentCanonicalKey,
    status: parentCanonicalKey && scriptureId ? 'READY' : 'UNRESOLVED',
    warning
  })
}

function contentOperation(
  record: LegacyRecord,
  adapterVersion: string,
  suffix: string,
  passageCanonicalKey: string,
  contentType: string,
  languageCode: string,
  content: string
): LegacyMigrationOperation | null {
  if (!content.trim()) return null
  return operation(record, adapterVersion, 'wx.content', suffix, {
    passageCanonicalKey,
    contentType,
    languageCode,
    text: content,
    revision: sourceChecksum(record).slice(0, 16),
    status: 'PROVISIONAL'
  }, { targetCanonicalKey: `${passageCanonicalKey}:content:${suffix}`, parentCanonicalKey: passageCanonicalKey })
}

function verseOperations(record: LegacyRecord, adapterVersion: string, passageByBookId: Map<string, string>): LegacyMigrationOperation[] {
  const bookId = number(record, 'bookId', 'book_id')
  const parentCanonicalKey = bookId ? passageByBookId.get(String(bookId)) : undefined
  const canonical = verseKey(record)
  const scriptureLegacyId = number(record, 'scriptureId', 'scripture_id')
  const sequence = number(record, 'verseNumber', 'verse_number', 'number') ?? 0
  const warning = parentCanonicalKey && scriptureLegacyId
    ? undefined
    : 'Legacy verse has no complete scripture/book parent; kept as unresolved migration work.'
  const verse = operation(record, adapterVersion, 'wx.passage', 'passage', {
    entity: {
      canonicalKey: canonical,
      kind: 'PASSAGE',
      label: text(record, 'canonicalReference', 'reference') || `Legacy verse ${sourceId(record)}`,
      sourceClass: 'REVELATION',
      authorityClass: 'PRIMARY_SOURCE',
      epistemicLane: 'UNRESOLVED',
      operationalStatus: 'PROVISIONAL'
    },
    scriptureLegacyId,
    passageType: 'VERSE',
    sequence,
    localNumber: sequence,
    canonicalReference: `legacy:verse:${sourceId(record)}`
  }, {
    targetCanonicalKey: canonical,
    parentCanonicalKey,
    status: parentCanonicalKey && scriptureLegacyId ? 'READY' : 'UNRESOLVED',
    warning
  })
  const operations = [verse]
  const original = contentOperation(record, adapterVersion, 'original', canonical, 'ORIGINAL_TEXT', 'und', text(record, 'textOriginal', 'text_original'))
  const indonesian = contentOperation(record, adapterVersion, 'translation-id', canonical, 'TRANSLATION', 'id', text(record, 'translationId', 'translation_id'))
  const english = contentOperation(record, adapterVersion, 'translation-en', canonical, 'TRANSLATION', 'en', text(record, 'translationEn', 'translation_en'))
  for (const content of [original, indonesian, english]) if (content) operations.push(content)
  return operations
}

function traditionOperation(record: LegacyRecord, adapterVersion: string): LegacyMigrationOperation {
  const canonical = traditionKey(record)
  const category = text(record, 'category').toLowerCase()
  const traditionType = category.includes('hadith') || category.includes('prophetic') ? 'HADITH' : 'OTHER'
  return operation(record, adapterVersion, 'wx.tradition.corpus', 'corpus', {
    entity: {
      canonicalKey: canonical,
      kind: 'TRADITION_CORPUS',
      label: text(record, 'name', 'originalName') || `Legacy tradition ${sourceId(record)}`,
      sourceClass: 'TRADITION_REPORT',
      authorityClass: 'TRANSMISSION_REPORT',
      epistemicLane: 'UNRESOLVED',
      operationalStatus: 'PROVISIONAL'
    },
    stableKey: canonical,
    name: text(record, 'name', 'originalName') || `Legacy tradition ${sourceId(record)}`,
    originalName: text(record, 'originalName', 'original_name') || undefined,
    traditionType
  }, { targetCanonicalKey: canonical })
}

function traditionItemOperations(record: LegacyRecord, adapterVersion: string, corpusById: Map<string, string>): LegacyMigrationOperation[] {
  const collectionId = number(record, 'collectionId', 'collection_id')
  const parentCanonicalKey = collectionId ? corpusById.get(String(collectionId)) : undefined
  const canonical = itemKey(record)
  const warning = parentCanonicalKey ? undefined : 'Legacy tradition item has no resolvable corpus parent; raw record remains available for retry.'
  const unit = operation(record, adapterVersion, 'wx.tradition.unit', 'unit', {
    entity: {
      canonicalKey: canonical,
      kind: 'TRADITION_UNIT',
      label: text(record, 'title') || `Legacy report ${sourceId(record)}`,
      sourceClass: 'TRADITION_REPORT',
      authorityClass: 'TRANSMISSION_REPORT',
      epistemicLane: 'UNRESOLVED',
      operationalStatus: 'PROVISIONAL'
    },
    corpusCanonicalKey: parentCanonicalKey,
    unitType: 'REPORT',
    stableKey: canonical,
    sequence: number(record, 'number') ?? 0
  }, {
    targetCanonicalKey: canonical,
    parentCanonicalKey,
    status: parentCanonicalKey ? 'READY' : 'UNRESOLVED',
    warning
  })
  const operations = [unit]
  const original = contentOperation(record, adapterVersion, 'matn-original', canonical, 'MATN', 'und', text(record, 'textOriginal', 'text_original'))
  const indonesian = contentOperation(record, adapterVersion, 'translation-id', canonical, 'TRANSLATION', 'id', text(record, 'translationId', 'translation_id'))
  const english = contentOperation(record, adapterVersion, 'translation-en', canonical, 'TRANSLATION', 'en', text(record, 'translationEn', 'translation_en'))
  for (const content of [original, indonesian, english]) if (content) operations.push(content)
  const narrator = text(record, 'narrator')
  if (narrator) operations.push(operation(record, adapterVersion, 'wx.tradition.attribution', 'narrator', {
    unitCanonicalKey: canonical,
    rawFigureName: narrator,
    roleCode: 'NARRATOR',
    status: 'UNRESOLVED'
  }, {
    targetCanonicalKey: `${canonical}:attribution:narrator`,
    parentCanonicalKey: canonical,
    status: 'UNRESOLVED',
    warning: 'Narrator text is preserved as unresolved raw attribution; no automatic figure merge is performed.'
  }))
  const grade = text(record, 'grade')
  if (grade) operations.push(operation(record, adapterVersion, 'wx.tradition.assessment', 'grade', {
    unitCanonicalKey: canonical,
    assessmentScheme: 'LEGACY_GRADE',
    rawValue: grade,
    normalizedCategory: grade.toUpperCase(),
    status: 'PROVISIONAL'
  }, {
    targetCanonicalKey: `${canonical}:assessment:legacy-grade`,
    parentCanonicalKey: canonical,
    status: 'UNRESOLVED',
    warning: 'Legacy grade is preserved as source metadata and requires an explicit provenance context before persistence.'
  }))
  return operations
}

function asmaOperation(record: LegacyRecord, adapterVersion: string): LegacyMigrationOperation {
  const canonical = asmaKey(record)
  return operation(record, adapterVersion, 'wx.divine.expression', 'expression', {
    entity: {
      canonicalKey: canonical,
      kind: 'CONCEPT',
      label: text(record, 'nameLatin', 'name_latin', 'nameArabic', 'name_arabic') || `Legacy expression ${sourceId(record)}`,
      sourceClass: 'UNKNOWN',
      authorityClass: 'DERIVED',
      epistemicLane: 'UNRESOLVED',
      operationalStatus: 'PROVISIONAL'
    },
    languageCode: 'ar',
    lexicalForm: text(record, 'nameArabic', 'name_arabic') || text(record, 'nameLatin', 'name_latin'),
    expressionType: 'NAME',
    quranReference: text(record, 'quranReference', 'quran_reference') || undefined,
    legacyGrouping: 'ASMAUL_HUSNA',
    requiresExactOccurrence: true
  }, {
    targetCanonicalKey: canonical,
    status: 'UNRESOLVED',
    warning: 'Legacy fixed-list Asma row is retained as a non-authoritative expression candidate; exact corpus occurrence is not assumed.'
  })
}

function skippedOperation(record: LegacyRecord, adapterVersion: string, reason: string): LegacyMigrationOperation {
  return operation(record, adapterVersion, 'legacy.retained', 'retained', { retained: true }, {
    status: 'SKIPPED',
    warning: reason
  })
}

function afterCursor(model: LegacyWitnessModel, id: string, cursor: LegacyMigrationCursor | undefined): boolean {
  if (!cursor) return true
  const modelIndex = MODEL_ORDER.get(model)!
  const cursorIndex = MODEL_ORDER.get(cursor.model)!
  return modelIndex > cursorIndex || (modelIndex === cursorIndex && compareRecordIds(id, cursor.sourceRecordId) > 0)
}

function compareRecordIds(left: string, right: string): number {
  const leftNumber = Number(left)
  const rightNumber = Number(right)
  if (Number.isSafeInteger(leftNumber) && Number.isSafeInteger(rightNumber)) return leftNumber - rightNumber
  return left.localeCompare(right, undefined, { numeric: true })
}

/**
 * Build a deterministic migration plan. The plan contains no database writes;
 * a worker can persist each mapping operation and resume from its cursor.
 */
export function planLegacyMigration(
  batches: LegacyRecordBatch[],
  options: { adapterVersion?: string; cursor?: LegacyMigrationCursor } = {}
): LegacyMigrationPlan {
  const adapterVersion = options.adapterVersion?.trim() || DEFAULT_ADAPTER_VERSION
  const records = new Map<LegacyWitnessModel, LegacyRecord[]>()
  for (const model of LEGACY_WITNESS_MODELS) records.set(model, [])
  for (const batch of batches) {
    const target = records.get(batch.model)
    if (!target) continue
    target.push(...batch.records.filter((record) => afterCursor(batch.model, sourceId(record), options.cursor)).map((record) => withModel(batch.model, record)))
  }
  for (const rows of records.values()) rows.sort((a, b) => sourceId(a).localeCompare(sourceId(b), undefined, { numeric: true }))

  const scriptureById = new Map(records.get('wx.scripture')!.map((record) => [sourceId(record), scriptureKey(record)]))
  const bookById = new Map(records.get('wx.scripture.book')!.map((record) => [sourceId(record), bookKey(record)]))
  const traditionById = new Map(records.get('wx.tradition')!.map((record) => [sourceId(record), traditionKey(record)]))
  const operations: LegacyMigrationOperation[] = []
  for (const record of records.get('wx.scripture')!) operations.push(scriptureOperation(record, adapterVersion))
  for (const record of records.get('wx.scripture.book')!) operations.push(bookOperation(record, adapterVersion, scriptureById))
  for (const record of records.get('wx.scripture.verse')!) operations.push(...verseOperations(record, adapterVersion, bookById))
  for (const record of records.get('wx.tradition')!) operations.push(traditionOperation(record, adapterVersion))
  for (const record of records.get('wx.tradition.item')!) operations.push(...traditionItemOperations(record, adapterVersion, traditionById))
  for (const record of records.get('wx.asmaul.husna')!) operations.push(asmaOperation(record, adapterVersion))
  for (const record of records.get('wx.bookmark')!) operations.push(skippedOperation(record, adapterVersion, 'User bookmark remains in the legacy user-scoped model and is not copied into the public knowledge graph.'))
  for (const record of records.get('wx.history')!) operations.push(skippedOperation(record, adapterVersion, 'User history remains in the legacy user-scoped model and is not copied into the public knowledge graph.'))

  const counts = operations.reduce((result, item) => {
    if (item.status === 'READY') result.ready += 1
    if (item.status === 'UNRESOLVED') result.unresolved += 1
    if (item.status === 'SKIPPED') result.skipped += 1
    return result
  }, { ready: 0, unresolved: 0, skipped: 0 })
  const last = operations.at(-1)
  return {
    adapterVersion,
    operations,
    cursor: last ? { model: last.sourceModel, sourceRecordId: last.sourceRecordId } : options.cursor ?? null,
    counts
  }
}

export { DEFAULT_ADAPTER_VERSION }
