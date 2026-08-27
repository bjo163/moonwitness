import { Vertex, fields } from '@moon/orm'

export default class IrAutomation extends Vertex {
  static override _name = 'ir.automation'
  static override _description = 'Automated Workflow Trigger Rule'
  static override _rec_name = 'name'

  name = fields.Char({ required: true, size: 180, index: true })
  model = fields.Char({ required: true, size: 120, index: true, help: 'Target Model (e.g. hd.ticket, cab.change, pj.task)' })
  trigger = fields.Selection({
    selection: [
      ['on_create', 'On Record Creation'],
      ['on_update', 'On Record Mutation'],
      ['on_time', 'On Time / Interval Elapsed']
    ],
    default: 'on_create',
    required: true,
    index: true
  })
  domain = fields.Text({ help: 'Optional JSON filter criteria (e.g. {"priority": "critical"})' })
  actionType = fields.Selection({
    selection: [
      ['create_activity', 'Schedule Activity & Reminder'],
      ['enqueue_job', 'Enqueue Worker Queue Job'],
      ['update_fields', 'Auto-Mutate Target Fields'],
      ['webhook', 'Dispatch Webhook Payload']
    ],
    default: 'create_activity',
    required: true
  })
  actionData = fields.Text({ help: 'JSON parameters for the chosen action' })
  active = fields.Boolean({ default: true, index: true })
}
