import { describe, it, expect } from 'vitest'
import {
  HadithItemSchema,
  HadithListResponseSchema,
  SurahSchema,
  SurahDetailResponseSchema,
  LoginRequestSchema,
  CabSummaryResponseSchema,
  SSE_TOPIC_MAP,
  PaginationMetaSchema,
} from '@moon/protocol'

describe('@moon/protocol — API Contract & Schema Layer', () => {
  it('validates Hadith item and list schemas', () => {
    const rawHadith = {
      number: 1,
      textArabic: 'إنما الأعمال بالنيات',
      textId: 'Sesungguhnya amal itu tergantung niatnya',
      textEn: 'Actions are by intentions',
      grade: 'Shahih',
    }

    const parsed = HadithItemSchema.parse(rawHadith)
    expect(parsed.number).toBe(1)
    expect(parsed.textArabic).toBe('إنما الأعمال بالنيات')

    const rawList = {
      book: { id: 1, name: 'Shahih Bukhari', slug: 'bukhari', totalItems: 7563 },
      page: 1,
      limit: 20,
      items: [rawHadith],
    }

    const listParsed = HadithListResponseSchema.parse(rawList)
    expect(listParsed.items).toHaveLength(1)
    expect(listParsed.book.slug).toBe('bukhari')
  })

  it('validates Surah and Surah Detail schemas', () => {
    const rawSurah = {
      number: 1,
      name: 'Al-Fatihah',
      versesCount: 7,
      revelationType: 'Meccan',
    }

    const parsed = SurahSchema.parse(rawSurah)
    expect(parsed.number).toBe(1)
    expect(parsed.name).toBe('Al-Fatihah')

    const rawDetail = {
      surah: rawSurah,
      ayahs: [
        { number: 1, textArabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', translationId: 'Dengan nama Allah...' },
      ],
    }

    const detailParsed = SurahDetailResponseSchema.parse(rawDetail)
    expect(detailParsed.ayahs).toHaveLength(1)
  })

  it('validates auth request schemas and rejects invalid email', () => {
    expect(() => LoginRequestSchema.parse({ email: 'not-an-email', password: '123' })).toThrow()
    expect(LoginRequestSchema.parse({ email: 'admin@moonwitness.org', password: 'secretpassword' })).toBeDefined()
  })

  it('defines SSE topic contracts with valid payload schemas', () => {
    expect(SSE_TOPIC_MAP.chat_global).toBeDefined()
    expect(SSE_TOPIC_MAP.system_metric).toBeDefined()
    expect(SSE_TOPIC_MAP.prayer_alert).toBeDefined()

    const metric = SSE_TOPIC_MAP.system_metric.parse({
      name: 'active_connections',
      value: 42,
      unit: 'clients',
    })
    expect(metric.value).toBe(42)
  })

  it('validates pagination metadata schema', () => {
    const meta = PaginationMetaSchema.parse({
      total: 100,
      page: 1,
      pageSize: 20,
      lastPage: 5,
    })
    expect(meta.lastPage).toBe(5)
  })
})
