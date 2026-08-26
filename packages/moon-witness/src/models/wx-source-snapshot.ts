import { Vertex, fields } from '@moon/orm'

/**
 * wx.source.snapshot — Import Execution Audit Trail
 *
 * Every import run persists an immutable snapshot record that captures
 * the complete provenance chain: which manifest, which artifact, which
 * parser/normalization versions, checksums, and results.
 *
 * Per #65 §Import state / snapshots:
 *   - Identical manifest/artifact/parser combination is idempotent
 *   - Does not create duplicate snapshots/imports
 *   - Persists diagnostics and row counts for auditability
 *
 * Per #64 §Engine run/replay contract:
 *   - Fingerprint enables deterministic replay verification
 */
export default class WxSourceSnapshot extends Vertex {
  static override _name = 'wx.source.snapshot'
  static override _description = 'Source Import Execution Snapshot'
  static override _public = true

  /** The manifest that was imported */
  manifestId = fields.Many2one({ comodel: 'wx.source.manifest', required: true, index: true })

  /** The specific artifact that was consumed */
  artifactId = fields.Many2one({ comodel: 'wx.source.artifact', required: true, index: true })

  /** Policy version at time of import */
  policyVersion = fields.Char({ required: true, size: 20 })

  /** Parser adapter version used */
  parserVersion = fields.Char({ required: true, size: 20 })

  /** Normalization schema version used */
  normalizationVersion = fields.Char({ required: true, size: 20 })

  /** SHA-256 of raw artifact at import time — must match artifact record */
  rawChecksum = fields.Char({ required: true, size: 64 })

  /** SHA-256 of deterministic normalized output */
  normalizedChecksum = fields.Char({ required: true, size: 64 })

  /** Import execution status */
  status = fields.Selection({
    selection: [
      ['running', 'Running'],
      ['completed', 'Completed Successfully'],
      ['failed', 'Failed — See Diagnostics'],
      ['rolled_back', 'Rolled Back']
    ],
    required: true,
    default: 'running'
  })

  /** When import execution started */
  startedAt = fields.DateTime({ required: true })

  /** When import execution completed (success or failure) */
  completedAt = fields.DateTime()

  /** Total records processed from normalized artifact */
  recordsProcessed = fields.Integer({ default: 0 })

  /** Records successfully created in canonical graph */
  recordsCreated = fields.Integer({ default: 0 })

  /** Records updated (idempotent re-import) */
  recordsUpdated = fields.Integer({ default: 0 })

  /** Records skipped (already exist, unchanged) */
  recordsSkipped = fields.Integer({ default: 0 })

  /** Records rejected (validation failure) */
  recordsRejected = fields.Integer({ default: 0 })

  /** Validation messages and import diagnostics (JSON) */
  diagnostics = fields.Text()

  /**
   * Composite fingerprint for deterministic replay:
   * sha256(manifest_code + artifact_sha + parser_version + norm_version)
   */
  fingerprint = fields.Char({ required: true, size: 64, index: true })

  /** Who executed the import */
  importedBy = fields.Many2one({ comodel: 'vx.user' })
}
