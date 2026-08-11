import { Vertex, fields } from '@moon/orm'

export default class MzCase extends Vertex {
  static _name = 'mz.case'
  static _description = 'Mizan Learning Case'

  title = fields.Char({ required: true, size: 180, index: true })
  caseText = fields.Text({ required: true })
  subjectAlias = fields.Char({ size: 80 })
  subjectAge = fields.Integer({ min: 0, max: 130 })
  status = fields.Selection({
    selection: [
      ['draft', 'Draft'],
      ['assessed', 'Assessed'],
      ['needs_reference', 'Needs Internal Reference'],
      ['archived', 'Archived']
    ],
    default: 'draft',
    index: true
  })
  createdAt = fields.DateTime({ autoNowAdd: true, index: true })
}
