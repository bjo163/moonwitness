import { Vertex, fields } from '@moon/orm'

export default class IrDashboardWidget extends Vertex {
  static override _name = 'ir.dashboard.widget'
  static override _description = 'Custom KPI & Matrix Dashboard Widget'
  static override _rec_name = 'name'

  name = fields.Char({ required: true, size: 180, index: true })
  widgetType = fields.Selection({
    selection: [
      ['kpi_card', 'KPI Metric Card'],
      ['metric_chart', 'Distribution Bar Chart'],
      ['record_feed', 'Live Activity Feed']
    ],
    default: 'kpi_card',
    required: true,
    index: true
  })
  model = fields.Char({ required: true, size: 120, index: true, help: 'Target Model (e.g. hd.ticket, pj.task, cab.change)' })
  metricField = fields.Char({ size: 80, help: 'Target field for aggregate calculation (e.g. priority, status, durationMs)' })
  aggregation = fields.Selection({
    selection: [
      ['count', 'Record Count'],
      ['sum', 'Total Sum'],
      ['avg', 'Average Value']
    ],
    default: 'count',
    required: true
  })
  accentColor = fields.Selection({
    selection: [
      ['cyan', 'Cyber Cyan (#00F0FF)'],
      ['green', 'Cyber Green (#00FF66)'],
      ['yellow', 'Cyber Yellow (#FFE600)'],
      ['purple', 'Cyber Purple (#A100FF)'],
      ['pink', 'Cyber Pink (#FF0055)']
    ],
    default: 'cyan',
    required: true
  })
  sequence = fields.Integer({ default: 10, index: true })
  active = fields.Boolean({ default: true, index: true })
}
