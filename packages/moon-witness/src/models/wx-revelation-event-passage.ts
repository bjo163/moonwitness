import { Vertex, fields } from '@moon/orm'

/** Provenance-bearing structural link between an event and one or more passages. */
export default class WxRevelationEventPassage extends Vertex {
  static _name = 'wx.revelation.event.passage'
  static _description = 'Revelation Event Passage Link'

  eventId = fields.Many2one({ comodel: 'wx.revelation.event', required: true, index: true })
  passageId = fields.Many2one({ comodel: 'wx.passage', required: true, index: true })
  sourceReference = fields.Char({ size: 240 })
  provenanceId = fields.Many2one({ comodel: 'wx.provenance', required: true, index: true })
  active = fields.Boolean({ default: true, index: true })
}
