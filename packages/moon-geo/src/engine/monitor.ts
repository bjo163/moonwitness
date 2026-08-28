import { ingestSourceSnapshot } from './watcher.ts'
import { computeGeoSemanticDiff, DiffResult } from './diff.ts'
import { Ctx, createCtx, getModel, SUPERUSER_ID } from '@moon/orm'
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const defaultDataFile = join(__dirname, '../data/indonesia-hierarchy.json')

export interface MonitoringReport {
  runId: string
  sourceName: string
  status: 'COMPLETED' | 'NO_CHANGE' | 'REVIEW_REQUIRED' | 'BLOCKED'
  executedAt: string
  diffSummary: {
    total: number
    autoSafe: number
    reviewRequired: number
    blocked: number
  }
  appliedCount: number
  details: string[]
}

/**
 * Orchestrate scheduled / CLI geo source monitoring run with anomaly circuit breakers
 */
export async function runGeoSourceMonitoring(
  sourceName: string = 'kemendagri.wilayah',
  dataFile: string = defaultDataFile,
  env?: Ctx
): Promise<MonitoringReport> {
  const activeEnv = env || createCtx(SUPERUSER_ID, {}, getModel)
  const runId = `RUN-${Date.now()}`

  if (!existsSync(dataFile)) {
    throw new Error(`Data file not found: ${dataFile}`)
  }

  const snapshot = ingestSourceSnapshot(sourceName, dataFile, 'latest')

  const GeoProvince = getModel('geo.province')
  const existingProvinces: any[] = GeoProvince
    ? await GeoProvince.fetch(GeoProvince, activeEnv, [])
    : []

  const diff: DiffResult = computeGeoSemanticDiff(
    existingProvinces.map((p) => ({ kemendagriCode: p.kemendagri_code || p.kemendagriCode, name: p.name })),
    snapshot.data.provinces || []
  )

  let status: MonitoringReport['status'] = 'COMPLETED'
  if (diff.blockedCount > 0) {
    status = 'BLOCKED'
  } else if (diff.reviewRequiredCount > 0) {
    status = 'REVIEW_REQUIRED'
  } else if (diff.totalCandidates === 0) {
    status = 'NO_CHANGE'
  }

  let appliedCount = 0
  const details: string[] = []

  // Apply AUTO_SAFE candidates if no BLOCKED invariant triggered
  if (status !== 'BLOCKED' && GeoProvince) {
    for (const candidate of diff.candidates) {
      if (candidate.policy === 'AUTO_SAFE' && candidate.action === 'create') {
        await GeoProvince.spawn(GeoProvince, activeEnv, candidate.payload)
        appliedCount++
        details.push(`[AUTO_SAFE] Created province ${candidate.payload.name} (${candidate.payload.kemendagriCode})`)
      } else {
        details.push(`[${candidate.policy}] ${candidate.reason}`)
      }
    }
  } else {
    for (const candidate of diff.candidates) {
      details.push(`[${candidate.policy}] ${candidate.reason}`)
    }
  }

  return {
    runId,
    sourceName,
    status,
    executedAt: new Date().toISOString(),
    diffSummary: {
      total: diff.totalCandidates,
      autoSafe: diff.autoSafeCount,
      reviewRequired: diff.reviewRequiredCount,
      blocked: diff.blockedCount
    },
    appliedCount,
    details
  }
}
