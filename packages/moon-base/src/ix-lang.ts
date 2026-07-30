import { Vertex, fields } from '@moon/orm'

export default class IxLang extends Vertex {
  static _name = 'ix.lang'
  static _description = 'Languages'

  name = fields.Char({ required: true })
  code = fields.Char({ required: true, unique: true, index: true })
  isoCode = fields.Char({ size: 16 })
  urlCode = fields.Char({ size: 16 })
  direction = fields.Selection({
    selection: [
      ['ltr', 'Left-to-Right'],
      ['rtl', 'Right-to-Left']
    ],
    default: 'ltr',
    required: true
  })
  active = fields.Boolean({ default: true, index: true })
}
