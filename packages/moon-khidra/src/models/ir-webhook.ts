import { Vertex, fields } from '@moon/orm'

export default class IrWebhook extends Vertex {
  static override _name = 'ir.webhook'
  static override _description = 'Outbound/Inbound Webhook Endpoint'
  static override _rec_name = 'name'

  name = fields.Char({ required: true, size: 180, index: true })
  url = fields.Char({ required: true, size: 500, help: 'Target destination HTTPS endpoint' })
  secretKey = fields.Char({ size: 128, help: 'Shared secret for HMAC SHA-256 signature verification' })
  eventTrigger = fields.Char({ default: '*', size: 100, index: true, help: 'Event topic (e.g. record.created, ticket.critical, *)' })
  headers = fields.Text({ help: 'Optional custom JSON HTTP headers' })
  active = fields.Boolean({ default: true, index: true })
}
