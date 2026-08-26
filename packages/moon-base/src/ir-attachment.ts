import { Vertex, fields } from '@moon/orm'

export default class IrAttachment extends Vertex {
  static override _name = 'ir.attachment'
  static override _description = 'Binary Attachment'

  name = fields.Char({ required: true, size: 255 })
  resModel = fields.Char({ size: 120, index: true })
  resId = fields.Integer({ index: true })
  mimetype = fields.Char({ size: 120 })
  fileSize = fields.Integer()
  url = fields.Char({ size: 500 })
  checksum = fields.Char({ size: 64 })
  companyId = fields.Many2one({ comodel: 'vx.org' })
}
