export const LEGACY_WITNESS_MODELS = [
  'wx.scripture',
  'wx.scripture.book',
  'wx.scripture.verse',
  'wx.tradition',
  'wx.tradition.item',
  'wx.asmaul.husna',
  'wx.bookmark',
  'wx.history'
] as const

export type LegacyWitnessModel = (typeof LEGACY_WITNESS_MODELS)[number]

export interface LegacyRecord {
  id: number | string
  [field: string]: unknown
}

export interface LegacyRecordBatch {
  model: LegacyWitnessModel
  records: LegacyRecord[]
}

export type MigrationOperationStatus = 'READY' | 'UNRESOLVED' | 'SKIPPED'

/** One deterministic, resumable unit of legacy migration work. */
export interface LegacyMigrationOperation {
  operationKey: string
  mappingKey: string
  sourceModel: LegacyWitnessModel
  sourceRecordId: string
  sourceChecksum: string
  adapterVersion: string
  targetModel: string
  targetCanonicalKey?: string
  parentCanonicalKey?: string
  status: MigrationOperationStatus
  fields: Record<string, unknown>
  warning?: string
}

export interface LegacyMigrationCursor {
  model: LegacyWitnessModel
  sourceRecordId: string
}

export interface LegacyMigrationPlan {
  adapterVersion: string
  operations: LegacyMigrationOperation[]
  cursor: LegacyMigrationCursor | null
  counts: {
    ready: number
    unresolved: number
    skipped: number
  }
}
