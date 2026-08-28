import IrCron from './models/ir-cron.ts'
import IrCronLog from './models/ir-cron-log.ts'
import IrQueueJob from './models/ir-queue-job.ts'

export { loadDemoData } from './demo-data.ts'
export { views } from './views.ts'
export { CronRunner, globalCronRunner, computeNextCallDate } from './runner.ts'
export { CosmicQueue, CosmicWorker } from './queue.ts'
export type { Job, JobOptions, JobProcessor } from './queue.ts'
export { IrCron, IrCronLog, IrQueueJob }

export default {
  name: 'cron',
  description: 'Background Job Scheduling, Queue Workers, and Interval Execution Engine',
  depends: ['base'],
  models: [IrCron, IrCronLog, IrQueueJob]
}
