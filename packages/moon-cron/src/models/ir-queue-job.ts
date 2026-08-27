import { Vertex, fields } from '@moon/orm'

export default class IrQueueJob extends Vertex {
  static override _name = 'ir.queue.job'
  static override _description = 'Background Queue Job Instance'
  static override _rec_name = 'name'

  name = fields.Char({ required: true, size: 180, index: true })
  queueName = fields.Char({ default: 'default', size: 80, index: true })
  status = fields.Selection({
    selection: [
      ['waiting', 'Waiting'],
      ['active', 'Active (Processing)'],
      ['completed', 'Completed'],
      ['failed', 'Failed'],
      ['delayed', 'Delayed']
    ],
    default: 'waiting',
    required: true,
    index: true
  })
  priority = fields.Integer({ default: 5, index: true, help: '1 (Highest) to 10 (Lowest)' })
  payload = fields.Text({ help: 'JSON serialized job input arguments' })
  result = fields.Text({ help: 'JSON serialized return value on completion' })
  error = fields.Text({ help: 'Failure reason and stacktrace' })
  progress = fields.Integer({ default: 0, help: '0 to 100 percentage completion' })
  attempts = fields.Integer({ default: 0 })
  maxAttempts = fields.Integer({ default: 3 })
  backoffMs = fields.Integer({ default: 1000, help: 'Base delay in ms for exponential retry' })
  nextRunAt = fields.DateTime({ required: true, index: true })
  startedAt = fields.DateTime()
  finishedAt = fields.DateTime()
  durationMs = fields.Float({ default: 0.0 })
}
