import { Vertex, fields } from '@moon/orm'

export default class IrCron extends Vertex {
  static override _name = 'ir.cron'
  static override _description = 'Scheduled Background Action'
  static override _rec_name = 'name'

  name = fields.Char({ required: true, size: 180, index: true })
  model = fields.Char({ required: true, size: 120, index: true })
  method = fields.Char({ required: true, size: 120 })
  args = fields.Text({ help: 'Optional JSON parameters passed to the method' })
  intervalNumber = fields.Integer({ default: 1, required: true })
  intervalType = fields.Selection({
    selection: [
      ['minutes', 'Minutes'],
      ['hours', 'Hours'],
      ['days', 'Days'],
      ['weeks', 'Weeks'],
      ['months', 'Months']
    ],
    default: 'hours',
    required: true,
    index: true
  })
  active = fields.Boolean({ default: true, index: true })
  nextCall = fields.DateTime({ required: true, index: true })
  lastCall = fields.DateTime()
  priority = fields.Integer({ default: 5, index: true })
  numberCall = fields.Integer({ default: -1, help: '-1 for infinite runs, or maximum executions' })
  runCount = fields.Integer({ default: 0 })
  doall = fields.Boolean({ default: false, help: 'Repeat missed occurrences immediately on server boot' })
}
