/**
 * ◈ MOONWITNESS PROTOCOL — WITNESS API CONTRACTS
 *
 * Zod schemas for all /api/witness/* endpoints.
 * Types are INFERRED from schemas — never hand-written.
 *
 * Covers: Scripture, Quran, Hadith, Asmaul Husna, Devotion,
 *         Astronomy, Bookmarks, History, Traditions, Graph Engine
 */
import { z } from 'zod'
import type { EndpointDef } from '../envelopes.js'

// ═══════════════════════════════════════════
// 🏷️ PROVENANCE & CANONICAL SOURCE SCHEMAS
// ═══════════════════════════════════════════

export const ProvenanceMetadataSchema = z.object({
  sourceKey: z.string().optional(),
  sourceName: z.string().optional(),
  edition: z.string().nullable().optional(),
  revision: z.string().nullable().optional(),
  publisher: z.string().nullable().optional(),
  language: z.string().nullable().optional(),
  license: z.string().nullable().optional(),
  retrievedAt: z.string().nullable().optional(),
  checksum: z.string().nullable().optional(),
  validationStatus: z
    .enum(['ingested', 'normalized', 'validated', 'published', 'archived'])
    .default('published'),
})

// ═══════════════════════════════════════════
// 📖 SCRIPTURE & QURAN SCHEMAS
// ═══════════════════════════════════════════

export const ScriptureSchema = z.object({
  id: z.number(),
  name: z.string(),
  originalName: z.string().nullable().optional(),
  slug: z.string(),
  religion: z.string().nullable().optional(),
  type: z.enum(['canonical', 'additional', 'philosophy']).optional(),
  booksCount: z.number().default(0),
  chaptersCount: z.number().default(0),
  versesCount: z.number().default(0),
  authenticityStatus: z.string().nullable().optional(),
  revelationEra: z.string().nullable().optional(),
  prophet: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  coverImageUrl: z.string().nullable().optional(),
  themeColor: z.string().nullable().optional(),
  provenance: ProvenanceMetadataSchema.optional(),
})

export const SurahSchema = z.object({
  number: z.number(),
  name: z.string(),
  nameOriginal: z.string().nullable().optional(),
  versesCount: z.number(),
  revelationType: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
})

export const AyahSchema = z.object({
  number: z.number(),
  textArabic: z.string().nullable().optional(),
  textLatin: z.string().nullable().optional(),
  translationId: z.string().nullable().optional(),
  audioUrl: z.string().nullable().optional(),
  juz: z.number().nullable().optional(),
  page: z.number().nullable().optional(),
  provenance: ProvenanceMetadataSchema.optional(),
})

export const SurahDetailResponseSchema = z.object({
  surah: z.object({
    number: z.number(),
    name: z.string(),
    nameOriginal: z.string().nullable().optional(),
    versesCount: z.number(),
    revelationType: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    audioUrl: z.string().nullable().optional(),
  }),
  ayahs: z.array(AyahSchema),
})

export const SurahListResponseSchema = z.object({
  scripture: z.object({
    id: z.number(),
    name: z.string(),
    versesCount: z.number().optional(),
  }),
  surahs: z.array(SurahSchema),
})

export const ScriptureListResponseSchema = z.object({
  scriptures: z.array(ScriptureSchema),
})

export const SearchResultItemSchema = z.object({
  id: z.string(),
  type: z.enum(['SCRIPTURE', 'HADITH', 'LEXICAL', 'RESEARCH', 'ENTITY']),
  title: z.string(),
  reference: z.string(),
  link: z.string(),
  snippet: z.string(),
  language: z.string().optional(),
  script: z.string().optional(),
  source: z.string().optional(),
  edition: z.string().optional(),
  provenanceId: z.number().nullable().optional(),
})

export const SearchResponseSchema = z.object({
  query: z.string(),
  filter: z.string().default('ALL'),
  total: z.number(),
  page: z.number().default(1),
  limit: z.number().default(20),
  results: z.array(SearchResultItemSchema),
})

export const ReferenceLookupResponseSchema = z.object({
  reference: z.string(),
  resolved: z.boolean(),
  type: z.string().optional(),
  passage: z.record(z.unknown()).nullable().optional(),
  content: z.array(z.record(z.unknown())).optional(),
  translations: z.array(z.record(z.unknown())).optional(),
  tradition: z.record(z.unknown()).nullable().optional(),
  root: z.record(z.unknown()).nullable().optional(),
  lexeme: z.record(z.unknown()).nullable().optional(),
})

export const QuranSearchResultSchema = z.object({
  query: z.string(),
  count: z.number(),
  results: z.array(z.record(z.unknown())),
})

// ═══════════════════════════════════════════
// 📜 HADITH & TRADITION SCHEMAS
// ═══════════════════════════════════════════

export const HadithBookSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  totalItems: z.number().nullable().optional(),
  gradeLevel: z.string().nullable().optional(),
})

export const HadithItemSchema = z.object({
  number: z.number(),
  textArabic: z.string().nullable().optional(),
  textId: z.string().nullable().optional(),
  textEn: z.string().nullable().optional(),
  grade: z.string().nullable().optional(),
  narratorChain: z.string().nullable().optional(),
  provenance: ProvenanceMetadataSchema.optional(),
})

export const HadithListResponseSchema = z.object({
  book: HadithBookSchema,
  page: z.number(),
  limit: z.number(),
  items: z.array(HadithItemSchema),
})

export const HadithBooksResponseSchema = z.object({
  books: z.array(z.record(z.unknown())),
})

export const TraditionCollectionSchema = z.object({
  collection: z.record(z.unknown()),
  items: z.array(z.record(z.unknown())),
})

export const TraditionsResponseSchema = z.object({
  traditions: z.array(TraditionCollectionSchema),
})

// ═══════════════════════════════════════════
// ✨ ASMAUL HUSNA SCHEMAS
// ═══════════════════════════════════════════

export const AsmaulHusnaItemSchema = z.object({
  number: z.number(),
  name: z.string().optional(),
  arabic: z.string().optional(),
  transliteration: z.string().optional(),
  meaning: z.string().optional(),
  description: z.string().nullable().optional(),
})

export const AsmaulHusnaResponseSchema = z.object({
  count: z.number(),
  names: z.array(AsmaulHusnaItemSchema),
})

// ═══════════════════════════════════════════
// 🤲 DEVOTION SCHEMAS
// ═══════════════════════════════════════════

export const DevotionItemSchema = z.object({
  id: z.number().optional(),
  number: z.number().optional(),
  type: z.string().optional(),
  category: z.string().optional(),
  arabic: z.string().nullable().optional(),
  transliteration: z.string().nullable().optional(),
  translation: z.string().nullable().optional(),
  reference: z.string().nullable().optional(),
  count: z.number().nullable().optional(),
})

export const DevotionListResponseSchema = z.object({
  count: z.number(),
  devotions: z.array(DevotionItemSchema),
})

// ═══════════════════════════════════════════
// 🌙 ASTRONOMY SCHEMAS
// ═══════════════════════════════════════════

export const MoonPhaseResponseSchema = z.object({
  date: z.string(),
  phaseName: z.string(),
  illumination: z.number(),
  distance: z.number(),
})

export const PrayerTimesSchema = z.object({
  fajr: z.string(),
  sunrise: z.string(),
  dhuhr: z.string(),
  asr: z.string(),
  maghrib: z.string(),
  isha: z.string(),
})

export const PrayerTimesResponseSchema = z.object({
  date: z.string(),
  coordinates: z.object({ lat: z.number(), lng: z.number() }),
  hijriDate: z.string().optional(),
  hijriMonth: z.string().optional(),
  times: PrayerTimesSchema,
})

// ═══════════════════════════════════════════
// 📌 BOOKMARK & HISTORY SCHEMAS
// ═══════════════════════════════════════════

export const BookmarkSchema = z.object({
  id: z.number().optional(),
  userId: z.number(),
  bookId: z.number().optional(),
  verseId: z.number().optional(),
  createdAt: z.string().optional(),
})

export const ReadingHistorySchema = z.object({
  id: z.number().optional(),
  userId: z.number(),
  bookId: z.number().optional(),
  lastVerseId: z.number().optional(),
  updatedAt: z.string().optional(),
})

// ═══════════════════════════════════════════
// 🔬 WITNESS ENGINE SCHEMAS
// ═══════════════════════════════════════════

export const EngineModuleSchema = z.object({
  code: z.string(),
  version: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
})

export const EngineRunInputSchema = z.object({
  moduleCode: z.string(),
  moduleVersion: z.string(),
  input: z.record(z.unknown()).default({}),
  ai: z.record(z.unknown()).optional(),
})

export const EngineRunResultSchema = z.object({
  runId: z.number().or(z.string()).optional(),
  status: z.string().optional(),
  findings: z.array(z.record(z.unknown())).optional(),
  output: z.record(z.unknown()).optional(),
})

// ═══════════════════════════════════════════
// INFERRED TYPES (auto-generated from Zod)
// ═══════════════════════════════════════════

export const ProvenanceMetadata = ProvenanceMetadataSchema
export type ProvenanceMetadata = z.infer<typeof ProvenanceMetadataSchema>

export type Scripture = z.infer<typeof ScriptureSchema>
export type Surah = z.infer<typeof SurahSchema>
export type Ayah = z.infer<typeof AyahSchema>
export type SurahDetailResponse = z.infer<typeof SurahDetailResponseSchema>
export type SurahListResponse = z.infer<typeof SurahListResponseSchema>
export type ScriptureListResponse = z.infer<typeof ScriptureListResponseSchema>
export type SearchResultItem = z.infer<typeof SearchResultItemSchema>
export type SearchResponse = z.infer<typeof SearchResponseSchema>
export type ReferenceLookupResponse = z.infer<typeof ReferenceLookupResponseSchema>
export type QuranSearchResult = z.infer<typeof QuranSearchResultSchema>

export type HadithBook = z.infer<typeof HadithBookSchema>
export type HadithItem = z.infer<typeof HadithItemSchema>
export type HadithListResponse = z.infer<typeof HadithListResponseSchema>

export type AsmaulHusnaItem = z.infer<typeof AsmaulHusnaItemSchema>
export type AsmaulHusnaResponse = z.infer<typeof AsmaulHusnaResponseSchema>

export type DevotionItem = z.infer<typeof DevotionItemSchema>
export type DevotionListResponse = z.infer<typeof DevotionListResponseSchema>

export type MoonPhaseResponse = z.infer<typeof MoonPhaseResponseSchema>
export type PrayerTimes = z.infer<typeof PrayerTimesSchema>
export type PrayerTimesResponse = z.infer<typeof PrayerTimesResponseSchema>

export type Bookmark = z.infer<typeof BookmarkSchema>
export type ReadingHistory = z.infer<typeof ReadingHistorySchema>

export type EngineModule = z.infer<typeof EngineModuleSchema>
export type EngineRunInput = z.infer<typeof EngineRunInputSchema>
export type EngineRunResult = z.infer<typeof EngineRunResultSchema>
