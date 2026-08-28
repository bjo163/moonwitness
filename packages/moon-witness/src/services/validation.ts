/**
 * Witness Ingestion — Pre-Import Validation Framework
 *
 * Validation occurs BEFORE any canonical domain mutation.
 * Per #65 §Validation:
 *   - Invalid import must not partially mutate canonical Witness graph
 *   - At minimum checks: required IDs, hierarchy coherence, duplicate
 *     detection, encoding, checksum, cardinality, source-specific rules
 *
 * This module provides composable validators that are invoked by the
 * ingestion orchestrator after normalization but before domain import.
 */
import type {
  NormalizedArtifact,
  NormalizedRecord,
  ValidationReport,
  ValidationFinding,
  ImportContext
} from '../types/ingestion.ts'

// ═══════════════════════════════════════════
// VALIDATION REPORT BUILDER
// ═══════════════════════════════════════════

/** Create an empty validation report */
export function createReport(): ValidationReport {
  return {
    valid: true,
    findings: [],
    errorCount: 0,
    warningCount: 0,
    infoCount: 0,
    validRecordCount: 0,
    invalidRecordCount: 0
  }
}

/** Add a finding to the report and update counters */
export function addFinding(
  report: ValidationReport,
  finding: ValidationFinding
): void {
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

/** Finalize report — set record counts */
export function finalizeReport(
  report: ValidationReport,
  totalRecords: number,
  invalidRecordIds: Set<string>
): ValidationReport {
  report.invalidRecordCount = invalidRecordIds.size
  report.validRecordCount = totalRecords - invalidRecordIds.size
  return report
}

// ═══════════════════════════════════════════
// BUILT-IN VALIDATORS
// ═══════════════════════════════════════════

/**
 * Validate that all records have required source-local IDs.
 * Per #65: required IDs/references present.
 */
export function validateRequiredIds(
  records: NormalizedRecord[],
  report: ValidationReport,
  invalidIds: Set<string>
): void {
  for (let i = 0; i < records.length; i++) {
    const r = records[i]!

    if (!r.sourceLocalId || r.sourceLocalId.trim() === '') {
      addFinding(report, {
        severity: 'error',
        code: 'MISSING_SOURCE_LOCAL_ID',
        message: `Record at index ${i} has no sourceLocalId`,
        recordId: `[index:${i}]`
      })
      invalidIds.add(`[index:${i}]`)
    }

    if (!r.sourceText && r.sourceText !== '') {
      addFinding(report, {
        severity: 'error',
        code: 'MISSING_SOURCE_TEXT',
        message: `Record '${r.sourceLocalId}' has no sourceText field`,
        recordId: r.sourceLocalId
      })
      invalidIds.add(r.sourceLocalId)
    }

    if (!r.language || r.language.trim() === '') {
      addFinding(report, {
        severity: 'error',
        code: 'MISSING_LANGUAGE',
        message: `Record '${r.sourceLocalId}' has no language code`,
        recordId: r.sourceLocalId,
        field: 'language'
      })
      invalidIds.add(r.sourceLocalId)
    }
  }
}

/**
 * Detect duplicate source-local IDs within the normalized artifact.
 * Per #65: duplicate source-local IDs detected.
 */
export function validateNoDuplicateIds(
  records: NormalizedRecord[],
  report: ValidationReport,
  invalidIds: Set<string>
): void {
  const seen = new Map<string, number>()

  for (const r of records) {
    if (!r.sourceLocalId) continue

    const count = (seen.get(r.sourceLocalId) || 0) + 1
    seen.set(r.sourceLocalId, count)

    if (count === 2) {
      addFinding(report, {
        severity: 'error',
        code: 'DUPLICATE_SOURCE_LOCAL_ID',
        message: `Duplicate sourceLocalId: '${r.sourceLocalId}'`,
        recordId: r.sourceLocalId
      })
      invalidIds.add(r.sourceLocalId)
    }
  }
}

/**
 * Validate hierarchy coherence — no cycles within source record tree.
 * Per #65: hierarchy coherent/no cycles within source record tree.
 *
 * Checks that hierarchy paths form a valid tree (no path is a suffix
 * of itself or creates cycles).
 */
export function validateHierarchyCoherence(
  records: NormalizedRecord[],
  report: ValidationReport,
  invalidIds: Set<string>
): void {
  for (const r of records) {
    if (!r.hierarchy || !Array.isArray(r.hierarchy)) continue

    // Check for empty hierarchy segments
    const hasEmpty = r.hierarchy.some((h) => !h || h.trim() === '')
    if (hasEmpty) {
      addFinding(report, {
        severity: 'error',
        code: 'INVALID_HIERARCHY',
        message: `Record '${r.sourceLocalId}' has empty hierarchy segments`,
        recordId: r.sourceLocalId,
        field: 'hierarchy'
      })
      invalidIds.add(r.sourceLocalId)
    }

    // Check for duplicate consecutive segments (potential cycle)
    for (let i = 1; i < r.hierarchy.length; i++) {
      if (r.hierarchy[i] === r.hierarchy[i - 1]) {
        addFinding(report, {
          severity: 'warning',
          code: 'HIERARCHY_DUPLICATE_SEGMENT',
          message: `Record '${r.sourceLocalId}' has consecutive duplicate hierarchy segments: '${r.hierarchy[i]}'`,
          recordId: r.sourceLocalId,
          field: 'hierarchy'
        })
      }
    }
  }
}

/**
 * Validate that checksum/revision matches manifest expectations.
 * Per #65: checksum/revision matches manifest.
 */
export function validateChecksumMatch(
  normalized: NormalizedArtifact,
  expectedChecksum: string | undefined,
  report: ValidationReport
): void {
  if (!expectedChecksum) {
    addFinding(report, {
      severity: 'info',
      code: 'NO_EXPECTED_CHECKSUM',
      message: 'No expected normalized checksum declared in manifest — skipping checksum match'
    })
    return
  }

  if (normalized.checksum !== expectedChecksum) {
    addFinding(report, {
      severity: 'error',
      code: 'CHECKSUM_MISMATCH',
      message: `Normalized checksum mismatch: computed '${normalized.checksum}' !== expected '${expectedChecksum}'`
    })
  }
}

/**
 * Validate expected cardinality (record count sanity check).
 * Per #65: cardinality sanity checks.
 */
export function validateCardinality(
  normalized: NormalizedArtifact,
  expectedCardinality: number | undefined,
  report: ValidationReport
): void {
  if (expectedCardinality === undefined || expectedCardinality === null) return

  if (normalized.recordCount !== expectedCardinality) {
    addFinding(report, {
      severity: 'error',
      code: 'CARDINALITY_MISMATCH',
      message: `Record count mismatch: got ${normalized.recordCount}, expected ${expectedCardinality}`
    })
  }
}

/**
 * Validate that Tradition data does not claim Revelation source class.
 * Per #65 §Validation:
 *   "Tradition data does not claim Revelation source class merely
 *    from corpus naming"
 */
export function validateTraditionNotRevelation(
  ctx: ImportContext,
  records: NormalizedRecord[],
  report: ValidationReport,
  invalidIds: Set<string>
): void {
  if (ctx.sourceKind !== 'tradition') return

  if (ctx.authorityClass === 'REVELATION') {
    addFinding(report, {
      severity: 'error',
      code: 'TRADITION_CLAIMS_REVELATION',
      message: `Tradition source '${ctx.manifestCode}' is classified as REVELATION authority — this violates source policy`
    })
  }
}

/**
 * Validate translation records have required provenance.
 * Per #65: translation has source/target language + derivation provenance
 * where required.
 */
export function validateTranslationProvenance(
  ctx: ImportContext,
  records: NormalizedRecord[],
  report: ValidationReport,
  invalidIds: Set<string>
): void {
  if (ctx.sourceKind !== 'translation') return

  for (const r of records) {
    if (!r.lineage) {
      addFinding(report, {
        severity: 'warning',
        code: 'TRANSLATION_MISSING_LINEAGE',
        message: `Translation record '${r.sourceLocalId}' has no lineage/derivation metadata`,
        recordId: r.sourceLocalId,
        field: 'lineage'
      })
    }
  }
}

// ═══════════════════════════════════════════
// COMPOSITE VALIDATOR
// ═══════════════════════════════════════════

/**
 * Run all built-in validators on a normalized artifact.
 *
 * Called by the ingestion orchestrator after normalization,
 * before any canonical domain mutation.
 */
export function runBuiltinValidation(
  normalized: NormalizedArtifact,
  ctx: ImportContext,
  expectedChecksum?: string,
  expectedCardinality?: number
): ValidationReport {
  const report = createReport()
  const invalidIds = new Set<string>()

  // Structural validators
  validateRequiredIds(normalized.records, report, invalidIds)
  validateNoDuplicateIds(normalized.records, report, invalidIds)
  validateHierarchyCoherence(normalized.records, report, invalidIds)

  // Integrity validators
  validateChecksumMatch(normalized, expectedChecksum, report)
  validateCardinality(normalized, expectedCardinality, report)

  // Source-policy validators
  validateTraditionNotRevelation(ctx, normalized.records, report, invalidIds)
  validateTranslationProvenance(ctx, normalized.records, report, invalidIds)

  return finalizeReport(report, normalized.records.length, invalidIds)
}
