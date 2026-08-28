import type { Ctx } from '@moon/orm'
import WxScoreResult from '../models/wx-score-result.ts'
import { sha256String, stableSerialize } from './hash.ts'
import type { WitnessScoreResult } from './scoring.ts'

export interface PersistScoreInput {
  score: WitnessScoreResult
  evidenceIds?: number[]
  sourceRevisions: string[]
  targetEntityId?: number
  targetRelationId?: number
  targetAssertionId?: number
  findingKey?: string
}

/** Stores one immutable score version; profile/source changes necessarily create a new key. */
export async function persistScoreResult(ctx: Ctx, input: PersistScoreInput): Promise<Record<string, unknown>> {
  const revisions = [...new Set(input.sourceRevisions)].sort()
  const evidenceIds = [...new Set(input.evidenceIds ?? [])].sort((a, b) => a - b)
  const resultKey = `score:${sha256String(stableSerialize({ score: input.score, evidenceIds, revisions, targetEntityId: input.targetEntityId, targetRelationId: input.targetRelationId, targetAssertionId: input.targetAssertionId, findingKey: input.findingKey }))}`
  return WxScoreResult.spawn(WxScoreResult, ctx, {
    resultKey, profileCode: input.score.profileCode, profileVersion: input.score.profileVersion,
    targetEntityId: input.targetEntityId, targetRelationId: input.targetRelationId, targetAssertionId: input.targetAssertionId, findingKey: input.findingKey,
    dimensionsJson: stableSerialize(input.score.dimensions), compositeBp: input.score.composite === undefined ? undefined : Math.round(input.score.composite * 100), coverageBp: Math.round(input.score.coverage * 10000), status: input.score.status,
    evidenceIdsJson: stableSerialize(evidenceIds), sourceRevisionFingerprint: sha256String(stableSerialize(revisions)), formulaFingerprint: input.score.formulaFingerprint, createdAt: new Date().toISOString(), active: true
  })
}
