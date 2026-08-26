import { describe, expect, it } from 'vitest'
import { planLegacyMigration } from '../src/services/legacy-migration.js'
import { executeLegacyMigration } from '../src/services/legacy-migration-executor.js'
import type { LegacyRecordBatch } from '../src/types/migration.js'

const batches: LegacyRecordBatch[] = [
  {
    model: 'wx.scripture',
    records: [{ id: 1, slug: 'quran', name: 'Quran', type: 'canonical' }]
  },
  {
    model: 'wx.scripture.book',
    records: [{ id: 2, scriptureId: 1, bookNumber: 2, name: 'Al-Baqarah' }]
  },
  {
    model: 'wx.scripture.verse',
    records: [{ id: 3, scriptureId: 1, bookId: 2, verseNumber: 255, textOriginal: 'source', translationId: 'Indonesia', translationEn: 'English' }]
  },
  {
    model: 'wx.tradition',
    records: [{ id: 4, slug: 'legacy-hadith', name: 'Legacy Hadith', category: 'Hadith' }]
  },
  {
    model: 'wx.tradition.item',
    records: [{ id: 5, collectionId: 4, number: 1, textOriginal: 'matn', narrator: 'Raw narrator', grade: 'HASAN' }]
  },
  {
    model: 'wx.asmaul.husna',
    records: [{ id: 6, nameArabic: 'الرَّحْمَنُ', nameLatin: 'Ar-Rahman', quranReference: '1:1' }]
  },
  {
    model: 'wx.bookmark',
    records: [{ id: 7, userId: 10, verseId: 3 }]
  }
]

describe('legacy Witness migration plan (#55)', () => {
  it('produces deterministic, ordered operations with stable mapping keys', () => {
    const first = planLegacyMigration(batches)
    const second = planLegacyMigration(batches)
    expect(first).toEqual(second)
    expect(first.operations.map((item) => item.sourceModel)).toEqual([
      'wx.scripture',
      'wx.scripture.book',
      'wx.scripture.verse',
      'wx.scripture.verse',
      'wx.scripture.verse',
      'wx.scripture.verse',
      'wx.tradition',
      'wx.tradition.item',
      'wx.tradition.item',
      'wx.tradition.item',
      'wx.tradition.item',
      'wx.asmaul.husna',
      'wx.bookmark'
    ])
    expect(first.operations.every((item) => item.mappingKey.startsWith('legacy:legacy-witness-v1:'))).toBe(true)
    expect(first.cursor).toEqual({ model: 'wx.bookmark', sourceRecordId: '7' })
  })

  it('keeps translations separate and preserves unresolved narrator/grade semantics', () => {
    const plan = planLegacyMigration(batches)
    const content = plan.operations.filter((item) => item.targetModel === 'wx.content')
    expect(content.map((item) => item.fields.contentType)).toEqual(['ORIGINAL_TEXT', 'TRANSLATION', 'TRANSLATION', 'MATN'])
    const narrator = plan.operations.find((item) => item.targetModel === 'wx.tradition.attribution')
    expect(narrator?.status).toBe('UNRESOLVED')
    expect(narrator?.fields.rawFigureName).toBe('Raw narrator')
    expect(narrator?.warning).toMatch(/no automatic figure merge/)
    const grade = plan.operations.find((item) => item.targetModel === 'wx.tradition.assessment')
    expect(grade?.fields.rawValue).toBe('HASAN')
    expect(grade?.status).toBe('UNRESOLVED')
  })

  it('does not treat the fixed Asma list as authoritative corpus occurrences', () => {
    const plan = planLegacyMigration(batches)
    const expression = plan.operations.find((item) => item.targetModel === 'wx.divine.expression')
    expect(expression?.status).toBe('UNRESOLVED')
    expect(expression?.fields.requiresExactOccurrence).toBe(true)
    expect(expression?.warning).toMatch(/non-authoritative/)
  })

  it('marks missing parents unresolved and supports resumable cursors', () => {
    const missingParent: LegacyRecordBatch = {
      model: 'wx.scripture.book',
      records: [{ id: 20, scriptureId: 999, bookNumber: 1, name: 'Detached' }]
    }
    const unresolved = planLegacyMigration([missingParent])
    expect(unresolved.operations[0]?.status).toBe('UNRESOLVED')
    expect(unresolved.operations[0]?.parentCanonicalKey).toBeUndefined()

    const resumed = planLegacyMigration(batches, { cursor: { model: 'wx.scripture.book', sourceRecordId: '2' } })
    expect(resumed.operations.some((item) => item.sourceModel === 'wx.scripture')).toBe(false)
    expect(resumed.operations.some((item) => item.sourceModel === 'wx.scripture.book')).toBe(false)

    const numericIds = planLegacyMigration([{
      model: 'wx.scripture.book',
      records: [
        { id: 2, scriptureId: 1, bookNumber: 2, name: 'Two' },
        { id: 10, scriptureId: 1, bookNumber: 10, name: 'Ten' }
      ]
    }], { cursor: { model: 'wx.scripture.book', sourceRecordId: '2' } })
    expect(numericIds.operations.map((item) => item.sourceRecordId)).toEqual(['10'])
  })

  it('changes the source-scoped mapping when a legacy record checksum changes', () => {
    const changed = batches.map((batch) => ({ ...batch, records: batch.records.map((record) => ({ ...record })) }))
    changed[0]!.records[0] = { ...changed[0]!.records[0], name: 'Quran revised' }
    const originalKey = planLegacyMigration(batches).operations[0]?.mappingKey
    const changedKey = planLegacyMigration(changed).operations[0]?.mappingKey
    expect(changedKey).not.toBe(originalKey)
  })

  it('supports dry-run batches without touching the ORM and returns a resumable cursor', async () => {
    const plan = planLegacyMigration(batches)
    const result = await executeLegacyMigration({} as any, plan, { dryRun: true, maxOperations: 2 })
    expect(result.processed).toBe(2)
    expect(result.mapped).toBe(2)
    expect(result.cursor).toEqual({ model: 'wx.scripture.book', sourceRecordId: '2' })
    expect(result.failed).toBe(0)
  })
})
