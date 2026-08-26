/**
 * Witness Ingestion — Cryptographic Hash Utilities
 *
 * Provides SHA-256 computation and deterministic fingerprint
 * generation for the ingestion pipeline.
 *
 * Uses Node.js built-in `crypto` module — no external dependencies.
 *
 * Per #65 §Immutable raw artifact contract:
 *   - SHA-256 before parsing
 *   - Archive/extraction code must protect against path traversal
 *     and decompression bombs
 */
import { createHash } from 'node:crypto'
import { createReadStream, statSync } from 'node:fs'
import { resolve, normalize, relative, isAbsolute } from 'node:path'

// ═══════════════════════════════════════════
// SHA-256 COMPUTATION
// ═══════════════════════════════════════════

/**
 * Compute SHA-256 hash of a Buffer.
 * Returns lowercase hex string (64 chars).
 */
export function sha256Buffer(data: Buffer): string {
  return createHash('sha256').update(data).digest('hex')
}

/**
 * Compute SHA-256 hash of a UTF-8 string.
 * Returns lowercase hex string (64 chars).
 */
export function sha256String(data: string): string {
  return createHash('sha256').update(data, 'utf8').digest('hex')
}

/**
 * Compute SHA-256 hash of a file by streaming.
 * Returns lowercase hex string (64 chars).
 *
 * Uses streaming to handle large artifacts without loading
 * entire file into memory.
 */
export function sha256File(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = createHash('sha256')
    const stream = createReadStream(filePath)

    stream.on('data', (chunk) => hash.update(chunk))
    stream.on('end', () => resolve(hash.digest('hex')))
    stream.on('error', (err) => reject(err))
  })
}

// ═══════════════════════════════════════════
// FINGERPRINT GENERATION
// ═══════════════════════════════════════════

/**
 * Generate a composite fingerprint for deterministic replay.
 *
 * Per #65 §Import state / snapshots and #64 §Engine run/replay:
 *   sha256(manifest_code + artifact_sha + parser_version + norm_version)
 *
 * Same inputs always produce the same fingerprint.
 */
export function computeFingerprint(
  manifestCode: string,
  artifactSha256: string,
  parserVersion: string,
  normalizationVersion: string
): string {
  const payload = [
    manifestCode,
    artifactSha256,
    parserVersion,
    normalizationVersion
  ].join('|')

  return sha256String(payload)
}

/**
 * Compute deterministic checksum of a NormalizedArtifact payload.
 *
 * Per #65 §Normalized record law:
 *   - Deterministic key/row ordering
 *   - No current timestamp/random UUID in checksum payload
 *   - Same raw + same parser + same norm schema = identical checksum
 *
 * Serializes records with stable key ordering, then SHA-256.
 */
export function computeNormalizedChecksum(
  records: Array<Record<string, unknown>>
): string {
  const stableJson = JSON.stringify(records, Object.keys(records[0] || {}).sort())
  return sha256String(stableJson)
}

/**
 * Compute checksum of an ordered array of NormalizedRecord objects.
 * Uses deterministic serialization with sorted keys.
 */
export function computeRecordsChecksum(
  records: Array<Record<string, unknown>>
): string {
  const lines = records.map((r) => stableSerialize(r))
  return sha256String(lines.join('\n'))
}

/**
 * Stable JSON serialization with deterministic key ordering.
 * Recursively sorts object keys at all depths.
 */
export function stableSerialize(obj: unknown): string {
  return JSON.stringify(obj, (_key, value) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const sorted: Record<string, unknown> = {}
      for (const k of Object.keys(value).sort()) {
        sorted[k] = value[k]
      }
      return sorted
    }
    return value
  })
}

// ═══════════════════════════════════════════
// PATH SAFETY
// ═══════════════════════════════════════════

/** Maximum allowed file size for artifact ingestion (500 MB) */
const MAX_ARTIFACT_SIZE = 500 * 1024 * 1024

/**
 * Validate an artifact file path for safety.
 *
 * Per #65 §Immutable raw artifact contract:
 *   - Archive/extraction code must protect against path traversal
 *   - Reject unexpected content type/format/size
 *
 * @param filePath - Path to validate
 * @param baseDir - Allowed base directory
 * @returns Resolved absolute path if safe
 * @throws Error on path traversal or size violation
 */
export function validateArtifactPath(
  filePath: string,
  baseDir: string
): string {
  const resolvedBase = resolve(baseDir)
  const resolvedPath = resolve(baseDir, normalize(filePath))

  // Path traversal protection
  const rel = relative(resolvedBase, resolvedPath)
  if (rel.startsWith('..') || isAbsolute(rel)) {
    throw new Error(
      `SECURITY: Path traversal detected — '${filePath}' escapes base directory`
    )
  }

  // Size check
  try {
    const stat = statSync(resolvedPath)
    if (stat.size > MAX_ARTIFACT_SIZE) {
      throw new Error(
        `SECURITY: Artifact exceeds maximum allowed size ` +
        `(${stat.size} bytes > ${MAX_ARTIFACT_SIZE} bytes)`
      )
    }
  } catch (err: unknown) {
    if (err instanceof Error && 'code' in err && (err as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`Artifact file not found: ${resolvedPath}`)
    }
    throw err
  }

  return resolvedPath
}
