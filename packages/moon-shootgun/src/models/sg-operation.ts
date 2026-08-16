import { Vertex, fields } from '@moon/orm'

export default class SgOperation extends Vertex {
  static _name = 'sg.operation'
  static _description = 'Shootgun Operation Record'
  static _public = true

  name = fields.Char({ required: true, size: 180, index: true })
  argument = fields.Text()
  targetUrl = fields.Text()
  targetImage = fields.Text()
  wisdom = fields.Text()
  verseIds = fields.Many2many({
    comodel: 'wx.scripture.verse',
    relation: 'sg_operation_verse_rel'
  })
}