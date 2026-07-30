import { Vertex, fields } from '@moon/orm'

export default class IxDict extends Vertex {
  static _name = 'ix.dict'
  static _description = 'Translation'

  name = fields.Char({ required: true, index: true })
  resId = fields.Integer({ index: true })
  lang = fields.Char({ required: true, index: true })
  type = fields.Selection({
    selection: [
      ['model', 'Model Field'],
      ['view', 'View'],
      ['code', 'Code']
    ],
    required: true,
    index: true
  })
  src = fields.Text({ required: true })
  value = fields.Text()
  module = fields.Char({ index: true })
  state = fields.Selection({
    selection: [
      ['to_translate', 'To Translate'],
      ['translated', 'Translated']
    ],
    default: 'to_translate'
  })
}
