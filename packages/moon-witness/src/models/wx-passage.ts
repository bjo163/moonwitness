import { Vertex, fields, type Ctx } from '@moon/orm'
import { PASSAGE_TYPE_SELECTION } from '../graph/contracts.js'

function relationId(value: unknown): number | null {
  if (typeof value === 'number') return value
  if (Array.isArray(value)) return relationId(value[0])
  if (value && typeof value === 'object' && 'id' in value) {
    return relationId((value as { id: unknown }).id)
  }
  return null
}

/** Canonical arbitrary-depth passage hierarchy for all Revelation families. */
export default class WxPassage extends Vertex {
  static _name = 'wx.passage'
  static _description = 'Canonical Scripture / Revelation Passage'

  entityId = fields.Many2one({ comodel: 'wx.entity', required: true, index: true })
  scriptureId = fields.Many2one({ comodel: 'wx.scripture', required: true, index: true })
  parentId = fields.Many2one({ comodel: 'wx.passage', index: true })
  passageType = fields.Selection({ selection: PASSAGE_TYPE_SELECTION, required: true, index: true })
  sequence = fields.Integer({ required: true, default: 0, index: true })
  canonicalReference = fields.Char({ required: true, size: 180, index: true })
  localNumber = fields.Integer({ index: true })
  startNumber = fields.Integer()
  endNumber = fields.Integer()
  sourceRevision = fields.Char({ size: 160, index: true })
  provenanceId = fields.Many2one({ comodel: 'wx.provenance', index: true })
  active = fields.Boolean({ default: true, index: true })

  static async beforeSave(
    modelClass: typeof Vertex,
    env: Ctx,
    values: Record<string, unknown>,
    id?: number
  ): Promise<void> {
    const parentId = relationId(values.parentId)
    if (!parentId) return
    if (id && parentId === id) throw new Error('A passage cannot be its own parent')

    const scriptureId = relationId(values.scriptureId)
    if (!scriptureId || !env.getModel) return
    const Passage = env.getModel(modelClass._name)
    if (!Passage) return
    const [parent] = await (Passage as any).fetch(Passage, env, [['id', '=', parentId]])
    if (parent && relationId(parent.scripture_id ?? parent.scriptureId) !== scriptureId) {
      throw new Error('A passage parent must belong to the same scripture')
    }
  }
}
