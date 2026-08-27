import { Vertex, fields } from '@moon/orm'

export default class IrReport extends Vertex {
  static override _name = 'ir.report'
  static override _description = 'Printable Report Template Definition'
  static override _rec_name = 'name'

  name = fields.Char({ required: true, size: 180, index: true })
  model = fields.Char({ required: true, size: 120, index: true, help: 'Target Model (e.g. pj.project, hd.ticket, cab.change)' })
  reportType = fields.Selection({
    selection: [
      ['briefing', 'Operational Briefing Memorandum'],
      ['audit', 'Compliance & SLA Audit Sheet'],
      ['certificate', 'Official Certificate / Credential'],
      ['slip', 'Transaction & Dispatch Slip']
    ],
    default: 'briefing',
    required: true,
    index: true
  })
  orientation = fields.Selection({
    selection: [
      ['portrait', 'Portrait (Standard A4)'],
      ['landscape', 'Landscape (Wide Matrix)']
    ],
    default: 'portrait',
    required: true
  })
  headerTitle = fields.Char({ size: 180, help: 'Custom header banner text' })
  footerNotice = fields.Text({ help: 'Confidentiality notice or regulatory disclaimer' })
  showQrCode = fields.Boolean({ default: true, help: 'Include dynamic SHA-256 cryptographic verification QR code' })
  active = fields.Boolean({ default: true, index: true })
}
