import { getModel, createCtx, SUPERUSER_ID } from '@moon/orm'
import type IrCron from './models/ir-cron.ts'
import type IrCronLog from './models/ir-cron-log.ts'
import type IrQueueJob from './models/ir-queue-job.ts'

export async function loadDemoData(): Promise<void> {
  const IrCronModel = getModel('ir.cron') as typeof IrCron
  const IrCronLogModel = getModel('ir.cron.log') as typeof IrCronLog
  const IrQueueJobModel = getModel('ir.queue.job') as typeof IrQueueJob
  if (!IrCronModel || !IrCronLogModel) return

  const env = createCtx(SUPERUSER_ID, {}, getModel as any)
  const now = new Date()

  // Seed standard background scheduled jobs
  const cron1 = await IrCronModel.spawn(IrCronModel, env, {
    name: 'Telemetry Log Pruning',
    model: 'px.request',
    method: 'pruneOldLogs',
    intervalNumber: 1,
    intervalType: 'days',
    nextCall: new Date(now.getTime() + 86400000),
    active: true,
    priority: 8,
  })

  const cron2 = await IrCronModel.spawn(IrCronModel, env, {
    name: 'Support Ticket SLA Breach Monitor',
    model: 'hd.ticket',
    method: 'checkSlaBreaches',
    intervalNumber: 15,
    intervalType: 'minutes',
    nextCall: new Date(now.getTime() + 900000),
    active: true,
    priority: 2,
  })

  const cron3 = await IrCronModel.spawn(IrCronModel, env, {
    name: 'Celestial Ephemeris & Hilal Sync',
    model: 'geo.city',
    method: 'recomputeSunMoonPositions',
    intervalNumber: 6,
    intervalType: 'hours',
    nextCall: new Date(now.getTime() + 21600000),
    active: true,
    priority: 4,
  })

  const cron4 = await IrCronModel.spawn(IrCronModel, env, {
    name: 'System Resource Heartbeat Telemetry',
    model: 'px.system',
    method: 'recordHeartbeat',
    intervalNumber: 5,
    intervalType: 'minutes',
    nextCall: new Date(now.getTime() + 300000),
    active: true,
    priority: 1,
  })

  // Seed sample execution logs
  if (cron4) {
    await IrCronLogModel.spawn(IrCronLogModel, env, {
      cronId: cron4.id,
      status: 'success',
      executedAt: new Date(now.getTime() - 300000),
      durationMs: 42.5,
      message: 'Recorded system metrics successfully (memory: 48MB, activeClients: 12)',
    })
  }

  if (cron2) {
    await IrCronLogModel.spawn(IrCronLogModel, env, {
      cronId: cron2.id,
      status: 'success',
      executedAt: new Date(now.getTime() - 900000),
      durationMs: 18.2,
      message: 'Scanned 14 active support tickets. 0 breaches detected.',
    })
  }

  // Seed sample queue jobs if model is registered
  if (IrQueueJobModel) {
    await IrQueueJobModel.spawn(IrQueueJobModel, env, {
      name: 'Batch Celestial Telemetry Aggregator',
      queueName: 'celestial-compute',
      status: 'completed',
      priority: 3,
      progress: 100,
      attempts: 1,
      maxAttempts: 3,
      nextRunAt: new Date(now.getTime() - 600000),
      startedAt: new Date(now.getTime() - 600000),
      finishedAt: new Date(now.getTime() - 598200),
      durationMs: 1800,
      payload: JSON.stringify({ batchSize: 50, date: now.toISOString().slice(0, 10) }),
      result: JSON.stringify({ processedCount: 50, success: true }),
    })

    await IrQueueJobModel.spawn(IrQueueJobModel, env, {
      name: 'Dispatch RFC Status Digest Notification',
      queueName: 'notifications',
      status: 'active',
      priority: 2,
      progress: 65,
      attempts: 1,
      maxAttempts: 3,
      nextRunAt: now,
      startedAt: new Date(now.getTime() - 4000),
      payload: JSON.stringify({ channel: 'email', recipients: ['council@moonwitness.org'] }),
    })

    await IrQueueJobModel.spawn(IrQueueJobModel, env, {
      name: 'Transactional Stock Valuation Recompute',
      queueName: 'finance',
      status: 'waiting',
      priority: 5,
      progress: 0,
      attempts: 0,
      maxAttempts: 3,
      nextRunAt: new Date(now.getTime() + 120000),
      payload: JSON.stringify({ fiscalYear: 1448 }),
    })
  }
}
