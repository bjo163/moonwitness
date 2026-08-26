import { Vertex, fields } from '@moon/orm'

/**
 * wx.source.artifact — Immutable Raw Artifact Record
 *
 * Represents a sealed binary/file artifact that was ingested into
 * the Witness pipeline. Once created, the raw bytes are immutable.
 *
 * Per #65 §Immutable raw artifact contract:
 *   - Preserve exact raw bytes or approved canonical source artifact
 *   - SHA-256 before parsing
 *   - Never overwrite an old revision in place
 *   - Source update → new artifact revision
 *   - Reject unexpected content type/format/size
 *   - Archive/extraction protects against path traversal & decompression bombs
 */
export default class WxSourceArtifact extends Vertex {
  static override _name = 'wx.source.artifact'
  static override _description = 'Immutable Raw Source Artifact'
  static override _public = true

  /** Parent manifest that declared this artifact */
  manifestId = fields.Many2one({ comodel: 'wx.source.manifest', required: true, index: true })

  /** Version/revision label for this specific artifact snapshot */
  revisionLabel = fields.Char({ required: true, size: 80 })

  /** SHA-256 hash of raw bytes — cryptographic seal */
  sha256 = fields.Char({ required: true, size: 64, index: true })

  /** File size in bytes */
  fileSize = fields.Integer({ required: true })

  /** MIME content type */
  mimeType = fields.Char({ required: true, size: 120 })

  /**
   * Relative path to immutable artifact store.
   * Convention: data/witness/artifacts/{manifest-code}/{revision}/
   */
  storagePath = fields.Char({ required: true, size: 500 })

  /** Link to Base attachment infrastructure (ir.attachment) */
  attachmentId = fields.Many2one({ comodel: 'ir.attachment', index: true })

  /** Artifact lifecycle status */
  status = fields.Selection({
    selection: [
      ['pending', 'Pending Verification'],
      ['verified', 'Verified'],
      ['rejected', 'Rejected — Hash Mismatch or Invalid'],
      ['superseded', 'Superseded by Newer Revision']
    ],
    required: true,
    default: 'pending'
  })

  /** When the artifact hash was verified */
  verifiedAt = fields.DateTime()

  /** Who verified the artifact */
  verifiedBy = fields.Many2one({ comodel: 'vx.user' })
}
