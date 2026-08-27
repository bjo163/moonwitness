import { Vertex, fields } from '@moon/orm'

export default class IrCronLog extends Vertex {
  static override _name = 'ir.cron.log'
  static override _description = 'Cron Execution Log'
  static override _rec_name = 'executedAt'

  cronId = fields.Many2one({ comodel: 'ir.cron', required: true, index: true })
  status = fields.Selection({
    selection: [
      ['success', 'Success'],
      ['failed', 'Failed'],
      ['running', 'Running']
    ],
    default: 'running',
    required: true,
    index: true
  })
  executedAt = fields.DateTime({ required: true, index: true })
  durationMs = fields.Float({ default: 0.0 })
  message = fields.Text()
  error = fields.Text()
}
