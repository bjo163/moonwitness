import { Vertex, fields } from '@moon/orm'

export default class MzFilter extends Vertex {
  static _name = 'mz.filter'
  static _description = 'Mizan Four-Filter Answer'

  assessmentId = fields.Many2one({ comodel: 'mz.assessment', required: true, index: true })
  stage = fields.Selection({
    selection: [
      ['primary', 'Primary Filter'],
      ['secondary', 'Secondary Filter']
    ],
    required: true,
    default: 'primary',
    index: true
  })
  position = fields.Integer({ required: true, min: 1, max: 4 })
  label = fields.Char({ required: true, size: 120 })
  answer = fields.Selection({
    selection: [
      ['yes', 'Yes'],
      ['no', 'No'],
      ['unknown', 'Unknown']
    ],
    required: true,
    default: 'unknown'
  })
  note = fields.Text()
}
