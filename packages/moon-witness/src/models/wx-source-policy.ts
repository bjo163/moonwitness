import { Vertex, fields } from '@moon/orm'
import { SOURCE_POLICY_ROLE_SELECTION } from '../graph/contracts.ts'

/**
 * wx.source.policy — Source Classification & Authority Gate
 *
 * Defines how each source/corpus is classified for Witness engine use.
 * Per #64 §source-policy gate, every import must resolve a policy that
 * determines the authority class and allowed engine use mode.
 *
 * Current project policy:
 *   - Qur'an = PRIMARY_NORMATIVE core
 *   - Tawrat/Zabur/Injil = COMPLEMENTARY_REVELATION_REFERENCE
 *   - Hadith = TRADITION_CONTEXT
 *   - Commentary/research = INTERPRETIVE_CONTEXT / RESEARCH_ONLY
 */
export default class WxSourcePolicy extends Vertex {
  static override _name = 'wx.source.policy'
  static override _description = 'Source Classification & Authority Gate'
  static override _public = true

  /** Unique stable policy code (e.g. 'PRIMARY_NORMATIVE') */
  code = fields.Char({ required: true, unique: true, size: 80, index: true })

  /** Human-readable policy label */
  name = fields.Char({ required: true, size: 150 })

  /** Detailed explanation of this policy classification */
  description = fields.Text()

  /** Optional Revelation family context */
  revelationFamily = fields.Selection({
    selection: [
      ['QURAN', 'Al-Qur\'an'],
      ['TAWRAT', 'Tawrat (Torah)'],
      ['ZABUR', 'Zabur (Psalms)'],
      ['INJIL', 'Injil (Gospel)']
    ]
  })

  /** Authority class — how this source relates to normative knowledge */
  authorityClass = fields.Selection({
    selection: [
      ['REVELATION', 'Revelation Source'],
      ['TRADITION', 'Tradition / Oral Transmission'],
      ['INTERPRETIVE', 'Interpretive / Commentary'],
      ['RESEARCH', 'Research / Academic'],
      ['EXCLUDED', 'Excluded from Engine']
    ],
    required: true
  })

  /** Allowed engine use mode — controls how downstream modules may consume */
  allowedEngineUse = fields.Selection({
    selection: [
      ['NORMATIVE_CORE', 'Primary Normative Core'],
      ['COMPLEMENTARY_REFERENCE', 'Complementary Revelation Reference'],
      ['CONTEXTUAL', 'Contextual / Supporting'],
      ['RESEARCH_ONLY', 'Research Only — No Normative Weight'],
      ['EXCLUDED', 'Excluded from All Engine Use']
    ],
    required: true
  })

  /** Policy version string — enables policy evolution tracking */
  version = fields.Char({ required: true, size: 20, default: '1.0' })

  // Versioned graph-policy lineage (#50); retained alongside ingestion fields.
  stableKey = fields.Char({ required: true, unique: true, index: true, size: 220 })
  policyCode = fields.Char({ required: true, size: 120, index: true })
  policyVersion = fields.Char({ required: true, size: 80, index: true })
  sourceId = fields.Many2one({ comodel: 'wx.source', required: true, index: true })
  sourceRevision = fields.Char({ size: 160, index: true })
  role = fields.Selection({ selection: SOURCE_POLICY_ROLE_SELECTION, required: true, index: true })
  originalRevelationEquated = fields.Boolean({ default: false })
  corroborationRole = fields.Char({ size: 120, index: true })
  allowedEngineUses = fields.Text()
  policyNote = fields.Text()
  validFrom = fields.DateTime({ index: true })
  validTo = fields.DateTime({ index: true })
  active = fields.Boolean({ default: true, index: true })
}
