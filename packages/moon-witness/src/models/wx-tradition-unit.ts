import { Vertex, fields, type Ctx } from '@moon/orm'
import { RECORD_STATUS_SELECTION } from '../graph/contracts.js'

const TRADITION_UNIT_TYPE_SELECTION: Array<[string, string]> = [
  ['REPORT', 'Report'],
  ['TRACTATE', 'Tractate'],
  ['CHAPTER', 'Chapter'],
  ['SECTION', 'Section'],
  ['SAYING', 'Saying'],
  ['TEACHING', 'Teaching'],
  ['PASSAGE', 'Passage'],
  ['UNIT', 'Unit']
]

function relationId(value: unknown): number | null {
  if (typeof value === 'number') return value
  if (Array.isArray(value)) return relationId(value[0])
  if (value && typeof value === 'object' && 'id' in value) return relationId((value as { id: unknown }).id)
  return null
}

/** Hierarchical unit/report identity with no mandatory Hadith-only semantics. */
export default class WxTraditionUnit extends Vertex {
  static _name = 'wx.tradition.unit'
  static _description = 'Witness Tradition / Transmission Unit'
  static _rec_name = 'stableKey'

  entityId = fields.Many2one({ comodel: 'wx.entity', required: true, index: true })
  corpusId = fields.Many2one({ comodel: 'wx.tradition.corpus', required: true, index: true })
  parentId = fields.Many2one({ comodel: 'wx.tradition.unit', index: true })
  unitType = fields.Selection({ selection: TRADITION_UNIT_TYPE_SELECTION, required: true, index: true })
  stableKey = fields.Char({ required: true, unique: true, size: 240, index: true })
  sequence = fields.Integer({ default: 0, index: true })
  sourceId = fields.Many2one({ comodel: 'wx.source', index: true })
  provenanceId = fields.Many2one({ comodel: 'wx.provenance', index: true })
  status = fields.Selection({ selection: RECORD_STATUS_SELECTION, default: 'PROVISIONAL', required: true, index: true })
  active = fields.Boolean({ default: true, index: true })

  static async beforeSave(
    modelClass: typeof Vertex,
    env: Ctx,
    values: Record<string, unknown>,
    id?: number
  ): Promise<void> {
    const parentId = relationId(values.parentId)
    if (!parentId) return
    if (id && parentId === id) throw new Error('A tradition unit cannot be its own parent')
    const corpusId = relationId(values.corpusId)
    if (!corpusId || !env.getModel) return
    const Unit = env.getModel(modelClass._name)
    if (!Unit) return
    const [parent] = await (Unit as any).fetch(Unit, env, [['id', '=', parentId]])
    if (parent && relationId(parent.corpus_id ?? parent.corpusId) !== corpusId) {
      throw new Error('A tradition unit parent must belong to the same corpus')
    }
  }
}
