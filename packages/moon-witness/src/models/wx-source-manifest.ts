import { Vertex, fields } from '@moon/orm'

/**
 * wx.source.manifest — Approved Dataset / Corpus Declaration
 *
 * Every approved dataset, corpus, or edition must declare a manifest
 * before it can enter the Witness ingestion pipeline. The manifest is
 * the single source of truth for what a source IS, how to parse it,
 * and what its expected checksums are.
 *
 * Per #65 §Required source manifest, each manifest declares:
 *   source identity, kind, policy, parser/normalization versions,
 *   expected SHA-256 hashes, and dependency chain.
 *
 * Manifest timestamps are operational metadata and must NOT change
 * deterministic normalized payload checksums.
 */
export default class WxSourceManifest extends Vertex {
  static override _name = 'wx.source.manifest'
  static override _description = 'Approved Source / Corpus Manifest'
  static override _public = true

  /** Stable unique source code / external ID (e.g. 'quran-uthmani-v2.1') */
  code = fields.Char({ required: true, unique: true, size: 120, index: true })

  /** Source kind classification */
  sourceKind = fields.Selection({
    selection: [
      ['revelation_corpus', 'Revelation Corpus'],
      ['textual_witness', 'Textual Witness / Edition'],
      ['tradition', 'Tradition / Hadith Collection'],
      ['translation', 'Translation'],
      ['lexical', 'Lexical / Morphology Dataset'],
      ['metadata', 'Metadata / Reference Data'],
      ['research', 'Research / Academic Dataset']
    ],
    required: true,
    index: true
  })

  /** Source policy gate — determines authority class */
  policyId = fields.Many2one({ comodel: 'wx.source.policy', required: true, index: true })

  /** Optional Revelation family context */
  revelationFamily = fields.Selection({
    selection: [
      ['QURAN', 'Al-Qur\'an'],
      ['TAWRAT', 'Tawrat (Torah)'],
      ['ZABUR', 'Zabur (Psalms)'],
      ['INJIL', 'Injil (Gospel)']
    ]
  })

  /** Publisher / authority name */
  authority = fields.Char({ required: true, size: 200 })

  /** Canonical source reference URL */
  canonicalUrl = fields.Char({ size: 500 })

  /** License / usage approval status */
  licenseStatus = fields.Selection({
    selection: [
      ['approved', 'Approved'],
      ['pending_review', 'Pending Review'],
      ['restricted', 'Restricted'],
      ['excluded', 'Excluded']
    ],
    required: true,
    default: 'pending_review'
  })

  /** ISO 639 language code (e.g. 'ar', 'he', 'en') */
  sourceLanguage = fields.Char({ required: true, size: 10 })

  /** ISO 15924 script identifier (e.g. 'Arab', 'Latn', 'Hebr') */
  sourceScript = fields.Char({ size: 10 })

  /** Edition / publication identifier */
  edition = fields.Char({ size: 120 })

  /** Revision / version string */
  revision = fields.Char({ required: true, size: 60 })

  /** Parser adapter code — must match a registered WitnessSourceAdapter.code */
  parserAdapterCode = fields.Char({ required: true, size: 80 })

  /** Parser adapter version string */
  parserVersion = fields.Char({ required: true, size: 20 })

  /** Normalization schema version */
  normalizationSchemaVersion = fields.Char({ required: true, size: 20 })

  /** Expected SHA-256 of raw artifact bytes */
  rawArtifactSha256 = fields.Char({ size: 64 })

  /** Expected SHA-256 of deterministic normalized output */
  normalizedArtifactSha256 = fields.Char({ size: 64 })

  /** Expected record count — optional sanity check */
  expectedCardinality = fields.Integer()

  /** Extended key-value metadata (JSON) */
  metadata = fields.Text()
}
