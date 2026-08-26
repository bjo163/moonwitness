import { Vertex, fields } from '@moon/orm'

export default class IxLang extends Vertex {
  static override _name = 'ix.lang'
  static override _description = 'Languages'

  name = fields.Char({ required: true, size: 80 })
  nativeName = fields.Char({ size: 80 })
  code = fields.Char({ required: true, unique: true, index: true, size: 10 })
  isoCode = fields.Char({ size: 16 })
  urlCode = fields.Char({ size: 16 })
  script = fields.Char({ size: 20 })
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
