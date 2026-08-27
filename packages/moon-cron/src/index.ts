import IrCron from './models/ir-cron.js'
import IrCronLog from './models/ir-cron-log.js'
import IrQueueJob from './models/ir-queue-job.js'

export { loadDemoData } from './demo-data.js'
export { views } from './views.js'
export { CronRunner, globalCronRunner, computeNextCallDate } from './runner.js'
export { CosmicQueue, CosmicWorker } from './queue.js'
export type { Job, JobOptions, JobProcessor } from './queue.js'
export { IrCron, IrCronLog, IrQueueJob }

export default {
  name: 'cron',
  description: 'Background Job Scheduling, Queue Workers, and Interval Execution Engine',
  depends: ['base'],
  models: [IrCron, IrCronLog, IrQueueJob]
}
