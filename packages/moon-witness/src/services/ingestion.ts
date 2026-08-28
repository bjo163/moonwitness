/**
 * Witness Ingestion — Pipeline Orchestrator Service
 *
 * Central orchestrator for the deterministic corpus ingestion pipeline.
 * Coordinates: manifest resolution → artifact verification → parse →
 * normalize → validate → (domain import hook) → snapshot creation.
 *
 * Per #65 §Core pipeline and #64 v1.4:
 *   - Production runtime must not depend on live external websites
 *   - No network calls inside canonical graph builders
 *   - Invalid import = zero canonical partial mutation
 *   - Identical manifest/artifact/parser = idempotent
 *
 * Per user directive: this service is transport-only for graph data.
 * Business logic resides in models/services.
 * Do NOT put ingestion logic in HTTP routes.
 */
import { readFileSync } from 'node:fs'
import type { Ctx } from '@moon/orm'
import type {
  WitnessSourceAdapter,
  ImportContext,
  NormalizedArtifact,
  ValidationReport,
  ImportResult,
  ArtifactVerification
} from '../types/ingestion.ts'
import {
  sha256Buffer,
  sha256File,
  computeFingerprint,
  computeRecordsChecksum,
  validateArtifactPath
} from './hash.ts'
import { runBuiltinValidation } from './validation.ts'

// ═══════════════════════════════════════════
// ADAPTER REGISTRY
// ═══════════════════════════════════════════

/** Registered source adapters by code */
const adapterRegistry = new Map<string, WitnessSourceAdapter>()

/**
 * Register a source-specific adapter.
 * Per #65: adapters are source-specific; do not create one
 * parser full of corpus-name conditionals.
 */
export function registerAdapter(adapter: WitnessSourceAdapter): void {
  if (adapterRegistry.has(adapter.code)) {
    throw new Error(
      `Adapter '${adapter.code}' is already registered. ` +
      `Duplicate adapter codes are not allowed.`
    )
  }
  adapterRegistry.set(adapter.code, adapter)
}

/** Retrieve a registered adapter by code */
export function getAdapter(code: string): WitnessSourceAdapter | undefined {
  return adapterRegistry.get(code)
}

/** List all registered adapter codes */
export function listAdapters(): string[] {
  return Array.from(adapterRegistry.keys())
}

/** Clear all registered adapters (for testing) */
export function clearAdapters(): void {
  adapterRegistry.clear()
}

// ═══════════════════════════════════════════
// ARTIFACT VERIFICATION
// ═══════════════════════════════════════════

/**
 * Verify an artifact file against its manifest declaration.
 *
 * Per #65 §Immutable raw artifact contract:
 *   - SHA-256 before parsing
 *   - Reject unexpected content type/format/size
 *   - Archive/extraction protects against path traversal
 *
 * @param artifactPath - Path to the raw artifact file
 * @param expectedSha256 - Expected SHA-256 from manifest
 * @param baseDir - Allowed base directory for path safety
 */
export async function verifyArtifact(
  artifactPath: string,
  expectedSha256: string,
  baseDir: string
): Promise<ArtifactVerification> {
  // Path safety check (throws on traversal/bomb)
  const safePath = validateArtifactPath(artifactPath, baseDir)

  // Compute SHA-256 via streaming
  const computedSha256 = await sha256File(safePath)

  // Detect MIME type from file content (basic detection)
  const mimeType = detectMimeType(safePath)

  // Get file size
  const { statSync } = await import('node:fs')
  const stat = statSync(safePath)

  return {
    valid: computedSha256 === expectedSha256,
    computedSha256,
    expectedSha256,
    fileSize: stat.size,
    mimeType
  }
}

// ═══════════════════════════════════════════
// NORMALIZATION
// ═══════════════════════════════════════════

/**
 * Run the full parse → normalize pipeline for an artifact.
 *
 * Per #65 §Normalized record law:
 *   Same raw artifact + same parser version + same normalization schema
 *   MUST produce byte-for-byte identical normalized output.
 *
 * @param artifactPath - Path to raw artifact file
 * @param adapterCode - Adapter code to use
 * @param ctx - Import context
 * @param baseDir - Base directory for path safety
 */
export async function normalizeArtifact(
  artifactPath: string,
  adapterCode: string,
  ctx: ImportContext,
  baseDir: string
): Promise<NormalizedArtifact> {
  const adapter = adapterRegistry.get(adapterCode)
  if (!adapter) {
    throw new Error(`No adapter registered for code '${adapterCode}'`)
  }

  // Read raw bytes
  const safePath = validateArtifactPath(artifactPath, baseDir)
  const rawBytes = readFileSync(safePath)

  // Parse raw → intermediate
  const parsed = await adapter.parse(rawBytes, ctx)

  // Normalize intermediate → deterministic output
  const normalized = await adapter.normalize(parsed, ctx)

  // Recompute checksum to ensure determinism
  const computedChecksum = computeRecordsChecksum(
    normalized.records as unknown as Array<Record<string, unknown>>
  )
  normalized.checksum = computedChecksum

  return normalized
}

// ═══════════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════════

/**
 * Validate a normalized artifact before domain import.
 *
 * Runs built-in validators AND adapter-specific validation.
 * Per #65 §Validation: validation occurs BEFORE canonical domain mutation.
 *
 * @param normalized - Normalized artifact to validate
 * @param adapterCode - Adapter code for adapter-specific validation
 * @param ctx - Import context
 * @param expectedChecksum - Expected normalized checksum from manifest
 * @param expectedCardinality - Expected record count from manifest
 */
export async function validateNormalized(
  normalized: NormalizedArtifact,
  adapterCode: string,
  ctx: ImportContext,
  expectedChecksum?: string,
  expectedCardinality?: number
): Promise<ValidationReport> {
  // Run built-in validators
  const report = runBuiltinValidation(
    normalized,
    ctx,
    expectedChecksum,
    expectedCardinality
  )

  // Run adapter-specific validation
  const adapter = adapterRegistry.get(adapterCode)
  if (adapter) {
    const adapterReport = await adapter.validate(normalized, ctx)

    // Merge adapter findings into main report
    for (const finding of adapterReport.findings) {
      report.findings.push(finding)
      if (finding.severity === 'error') {
        report.errorCount++
        report.valid = false
      } else if (finding.severity === 'warning') {
        report.warningCount++
      } else {
        report.infoCount++
      }
    }
  }

  return report
}

// ═══════════════════════════════════════════
// IMPORT ORCHESTRATOR
// ═══════════════════════════════════════════

/**
 * Domain import callback type.
 * The actual domain import logic lives in #51/#53/#54 modules.
 * This callback is invoked by the orchestrator after validation passes.
 */
export type DomainImporter = (
  normalized: NormalizedArtifact,
  ctx: ImportContext
) => Promise<{
  created: number
  updated: number
  skipped: number
}>

/**
 * Execute the full ingestion pipeline for a manifest.
 *
 * Pipeline:
 *   1. Resolve manifest & adapter
 *   2. Verify artifact SHA-256
 *   3. Parse & normalize (deterministic)
 *   4. Validate (built-in + adapter-specific)
 *   5. Check idempotency (duplicate fingerprint)
 *   6. Run domain import (if provided)
 *   7. Create snapshot audit record
 *
 * Per #65 §Transaction/import boundary:
 *   - Canonical domain application is transactional
 *   - Failure leaves no half-applied canonical graph revision
 *   - Do not allow --force to bypass integrity invariants
 *
 * @param manifestCode - The manifest code to import
 * @param artifactPath - Path to the raw artifact file
 * @param env - ORM context
 * @param baseDir - Base directory for artifact storage
 * @param domainImporter - Optional domain import callback
 */
/**
 * Robustly extract a numeric database ID from a scalar, Many2one tuple,
 * or relational object.
 */
function extractNumericId(val: unknown): number | null {
  if (val === null || val === undefined || val === false) return null
  if (typeof val === 'number') return val
  if (Array.isArray(val)) {
    return extractNumericId(val[0])
  }
  if (typeof val === 'object' && val && 'id' in val) {
    return extractNumericId((val as any).id)
  }
  const parsed = Number(val)
  return isNaN(parsed) ? null : parsed
}

export async function executeImport(
  manifestCode: string,
  artifactPath: string,
  env: Ctx,
  baseDir: string,
  domainImporter?: DomainImporter
): Promise<ImportResult> {
  const diagnostics: string[] = []
  const startedAt = new Date().toISOString()

  // 1. Resolve manifest
  const getModel = env.getModel
  if (!getModel) {
    throw new Error('ORM environment has no getModel — cannot resolve manifest')
  }

  const ManifestModel = getModel('wx.source.manifest')
  const ArtifactModel = getModel('wx.source.artifact')
  const SnapshotModel = getModel('wx.source.snapshot')
  const PolicyModel = getModel('wx.source.policy')

  if (!ManifestModel || !ArtifactModel || !SnapshotModel || !PolicyModel) {
    throw new Error(
      'Required ingestion models not registered (wx.source.manifest, ' +
      'wx.source.artifact, wx.source.snapshot, wx.source.policy)'
    )
  }

  const manifests = await ManifestModel.fetch(ManifestModel, env, [
    ['code', '=', manifestCode]
  ])
  if (manifests.length === 0) {
    throw new Error(`Manifest not found: '${manifestCode}'`)
  }
  const manifest = manifests[0]

  // Resolve policy (handle Many2one [id, name] tuple or number)
  const policyId = extractNumericId(manifest.policy_id || manifest.policyId)
  if (!policyId) {
    throw new Error(`Manifest '${manifestCode}' has no valid policyId`)
  }

  const policies = await PolicyModel.fetch(PolicyModel, env, [
    ['id', '=', policyId]
  ])
  if (policies.length === 0) {
    throw new Error(`Policy not found for manifest '${manifestCode}'`)
  }
  const policy = policies[0]

  // 2. Resolve adapter
  const adapterCode = manifest.parser_adapter_code || manifest.parserAdapterCode
  const adapter = adapterRegistry.get(adapterCode)
  if (!adapter) {
    throw new Error(
      `No adapter registered for '${adapterCode}' ` +
      `(required by manifest '${manifestCode}')`
    )
  }

  // 3. Verify artifact
  const expectedSha = manifest.raw_artifact_sha256 || manifest.rawArtifactSha256
  diagnostics.push(`Verifying artifact: ${artifactPath}`)

  const verification = await verifyArtifact(
    artifactPath,
    expectedSha || '',
    baseDir
  )

  if (expectedSha && !verification.valid) {
    diagnostics.push(
      `SHA-256 MISMATCH: computed=${verification.computedSha256} expected=${expectedSha}`
    )
    throw new Error(
      `Artifact SHA-256 mismatch for manifest '${manifestCode}': ` +
      `computed ${verification.computedSha256} !== expected ${expectedSha}`
    )
  }
  diagnostics.push(`Artifact verified: SHA-256=${verification.computedSha256}`)

  // Create artifact record
  const artifactRecord = await ArtifactModel.spawn(ArtifactModel, env, {
    manifestId: manifest.id,
    revisionLabel: manifest.revision || manifest.revision,
    sha256: verification.computedSha256,
    fileSize: verification.fileSize,
    mimeType: verification.mimeType,
    storagePath: artifactPath,
    status: 'verified',
    verifiedAt: new Date().toISOString()
  })

  // 4. Build import context
  const parserVersion = manifest.parser_version || manifest.parserVersion
  const normVersion = manifest.normalization_schema_version || manifest.normalizationSchemaVersion
  const authorityClass = policy.authority_class || policy.authorityClass
  const sourceKind = manifest.source_kind || manifest.sourceKind
  const revFamily = manifest.revelation_family || manifest.revelationFamily

  // Compute fingerprint for idempotency
  const fingerprint = computeFingerprint(
    manifestCode,
    verification.computedSha256,
    parserVersion,
    normVersion
  )

  // 5. Check idempotency — same fingerprint = already imported
  const existingSnapshots = await SnapshotModel.fetch(SnapshotModel, env, [
    ['fingerprint', '=', fingerprint],
    ['status', '=', 'completed']
  ])
  if (existingSnapshots.length > 0) {
    diagnostics.push(`Idempotent: snapshot with fingerprint ${fingerprint} already exists`)
    return {
      snapshotId: existingSnapshots[0].id,
      status: 'completed',
      fingerprint,
      normalizedChecksum: existingSnapshots[0].normalized_checksum || existingSnapshots[0].normalizedChecksum,
      recordsProcessed: 0,
      recordsCreated: 0,
      recordsUpdated: 0,
      recordsSkipped: existingSnapshots[0].records_processed || existingSnapshots[0].recordsProcessed || 0,
      recordsRejected: 0,
      validation: { valid: true, findings: [], errorCount: 0, warningCount: 0, infoCount: 0, validRecordCount: 0, invalidRecordCount: 0 },
      diagnostics
    }
  }

  // Create snapshot record (status: running)
  const snapshotRecord = await SnapshotModel.spawn(SnapshotModel, env, {
    manifestId: manifest.id,
    artifactId: artifactRecord.id,
    policyVersion: policy.version || '1.0',
    parserVersion,
    normalizationVersion: normVersion,
    rawChecksum: verification.computedSha256,
    normalizedChecksum: '', // will be updated after normalization
    status: 'running',
    startedAt,
    fingerprint
  })

  const ctx: ImportContext = {
    env,
    manifestId: manifest.id,
    snapshotId: snapshotRecord.id,
    manifestCode,
    sourceKind,
    revelationFamily: revFamily || undefined,
    authorityClass,
    parserVersion,
    normalizationVersion: normVersion
  }

  try {
    // 6. Parse & normalize
    diagnostics.push('Starting parse & normalize...')
    const normalized = await normalizeArtifact(
      artifactPath,
      adapterCode,
      ctx,
      baseDir
    )
    diagnostics.push(`Normalized: ${normalized.recordCount} records, checksum=${normalized.checksum}`)

    // 7. Validate
    diagnostics.push('Running validation...')
    const expectedNormChecksum = manifest.normalized_artifact_sha256 || manifest.normalizedArtifactSha256
    const expectedCard = manifest.expected_cardinality || manifest.expectedCardinality
    const validation = await validateNormalized(
      normalized,
      adapterCode,
      ctx,
      expectedNormChecksum || undefined,
      expectedCard || undefined
    )

    if (!validation.valid) {
      diagnostics.push(`Validation FAILED: ${validation.errorCount} errors`)
      // Update snapshot to failed — no domain mutation
      await SnapshotModel.morph(SnapshotModel, env, snapshotRecord.id, {
        status: 'failed',
        completedAt: new Date().toISOString(),
        normalizedChecksum: normalized.checksum,
        recordsProcessed: normalized.recordCount,
        recordsRejected: validation.invalidRecordCount,
        diagnostics: JSON.stringify({ diagnostics, validation: validation.findings })
      })

      return {
        snapshotId: snapshotRecord.id,
        status: 'failed',
        fingerprint,
        normalizedChecksum: normalized.checksum,
        recordsProcessed: normalized.recordCount,
        recordsCreated: 0,
        recordsUpdated: 0,
        recordsSkipped: 0,
        recordsRejected: validation.invalidRecordCount,
        validation,
        diagnostics
      }
    }
    diagnostics.push(`Validation passed: ${validation.validRecordCount} valid records`)

    // 8. Domain import (if callback provided)
    let created = 0
    let updated = 0
    let skipped = 0

    if (domainImporter) {
      diagnostics.push('Starting domain import...')
      const importResult = await domainImporter(normalized, ctx)
      created = importResult.created
      updated = importResult.updated
      skipped = importResult.skipped
      diagnostics.push(`Domain import complete: created=${created} updated=${updated} skipped=${skipped}`)
    } else {
      diagnostics.push('No domain importer provided — snapshot only (dry run)')
      skipped = normalized.recordCount
    }

    // 9. Finalize snapshot
    await SnapshotModel.morph(SnapshotModel, env, snapshotRecord.id, {
      status: 'completed',
      completedAt: new Date().toISOString(),
      normalizedChecksum: normalized.checksum,
      recordsProcessed: normalized.recordCount,
      recordsCreated: created,
      recordsUpdated: updated,
      recordsSkipped: skipped,
      recordsRejected: 0,
      diagnostics: JSON.stringify({ diagnostics })
    })

    return {
      snapshotId: snapshotRecord.id,
      status: 'completed',
      fingerprint,
      normalizedChecksum: normalized.checksum,
      recordsProcessed: normalized.recordCount,
      recordsCreated: created,
      recordsUpdated: updated,
      recordsSkipped: skipped,
      recordsRejected: 0,
      validation,
      diagnostics
    }
  } catch (err: unknown) {
    // Transaction failure — roll back snapshot
    const errorMsg = err instanceof Error ? err.message : String(err)
    diagnostics.push(`IMPORT ERROR: ${errorMsg}`)

    await SnapshotModel.morph(SnapshotModel, env, snapshotRecord.id, {
      status: 'rolled_back',
      completedAt: new Date().toISOString(),
      diagnostics: JSON.stringify({ diagnostics, error: errorMsg })
    })

    throw err
  }
}

// ═══════════════════════════════════════════
// UTILITY
// ═══════════════════════════════════════════

/**
 * Basic MIME type detection from file magic bytes.
 * For production, a more comprehensive detection library could be used.
 */
function detectMimeType(filePath: string): string {
  try {
    const fd = readFileSync(filePath, { flag: 'r' })
    const header = fd.subarray(0, 4)

    // JSON
    if (header[0] === 0x7B || header[0] === 0x5B) {
      return 'application/json'
    }
    // XML
    if (header[0] === 0x3C && header[1] === 0x3F) {
      return 'application/xml'
    }
    // ZIP/GZIP
    if (header[0] === 0x50 && header[1] === 0x4B) {
      return 'application/zip'
    }
    if (header[0] === 0x1F && header[1] === 0x8B) {
      return 'application/gzip'
    }
    // CSV/TSV (starts with printable ASCII)
    if (header.every((b) => b >= 0x20 && b <= 0x7E)) {
      return 'text/plain'
    }

    return 'application/octet-stream'
  } catch {
    return 'application/octet-stream'
  }
}
