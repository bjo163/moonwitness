import { Vertex, fields } from '@moon/orm'

export default class IrWebhookLog extends Vertex {
  static override _name = 'ir.webhook.log'
  static override _description = 'Webhook Dispatch Audit Log'
  static override _rec_name = 'event'

  webhookId = fields.Many2one({ comodel: 'ir.webhook', required: true, index: true })
  event = fields.Char({ required: true, size: 100, index: true })
  status = fields.Selection({
    selection: [
      ['success', 'Delivered (2xx)'],
      ['failed', 'Failed / Timeout'],
      ['pending', 'Pending Dispatch']
    ],
    default: 'pending',
    required: true,
    index: true
  })
  responseCode = fields.Integer({ default: 0 })
  durationMs = fields.Float({ default: 0.0 })
  payload = fields.Text({ help: 'JSON payload sent to remote endpoint' })
  responseBody = fields.Text({ help: 'Response payload returned from remote endpoint' })
  error = fields.Text({ help: 'Delivery failure reason' })
}
