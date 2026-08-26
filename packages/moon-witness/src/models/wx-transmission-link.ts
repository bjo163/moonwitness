import { Vertex, fields, type Ctx } from '@moon/orm'

/** Ordered chain member; sequence is meaningful only within its chain. */
export default class WxTransmissionLink extends Vertex {
  static _name = 'wx.transmission.link'
  static _description = 'Witness Transmission Chain Link'

  chainId = fields.Many2one({ comodel: 'wx.transmission.chain', required: true, index: true })
  sequence = fields.Integer({ required: true, min: 0, index: true })
  figureId = fields.Many2one({ comodel: 'wx.figure', index: true })
  rawFigureName = fields.Char({ size: 240, index: true })
  roleMode = fields.Char({ size: 120 })
  rawSourceSpan = fields.Text()
  uncertainty = fields.Char({ size: 120 })
  provenanceId = fields.Many2one({ comodel: 'wx.provenance', required: true, index: true })
  active = fields.Boolean({ default: true, index: true })

  static async beforeSave(
    modelClass: typeof Vertex,
    env: Ctx,
    values: Record<string, unknown>,
    id?: number
  ): Promise<void> {
    if (!env.getModel || values.chainId === undefined || values.sequence === undefined) return
    const Link = env.getModel(modelClass._name)
    if (!Link) return
    const links = await (Link as any).fetch(Link, env, [['chainId', '=', values.chainId], ['sequence', '=', values.sequence]])
    if (links.some((link: { id: number }) => link.id !== id)) {
      throw new Error('A transmission chain cannot contain duplicate sequence positions')
    }
  }
}
