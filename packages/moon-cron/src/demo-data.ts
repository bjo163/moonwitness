import { getModel, createCtx, SUPERUSER_ID, loadJsonSeed } from '@moon/orm'
import type IrCron from './models/ir-cron.js'
import type IrCronLog from './models/ir-cron-log.js'
import type IrQueueJob from './models/ir-queue-job.js'

export async function loadDemoData(): Promise<void> {
  const IrCronModel = getModel('ir.cron') as typeof IrCron
  const IrCronLogModel = getModel('ir.cron.log') as typeof IrCronLog
  const IrQueueJobModel = getModel('ir.queue.job') as typeof IrQueueJob
  if (!IrCronModel || !IrCronLogModel) return

  const env = createCtx(SUPERUSER_ID, {}, getModel as any)
  const now = new Date()

  const jsonSeed = loadJsonSeed<{
    crons?: { name: string; model: string; method: string; intervalNumber: number; intervalType: string; priority: number; active?: boolean }[]
    logs?: { cronName: string; status: string; durationMs: number; message: string }[]
    jobs?: { name: string; queueName: string; status: string; priority: number; progress: number; attempts: number; maxAttempts: number; durationMs?: number; payload: string; result?: string }[]
  }>('cron')

  const cronSeeds = jsonSeed?.crons || [
    {
      name: 'Telemetry Log Pruning',
      model: 'px.request',
      method: 'pruneOldLogs',
      intervalNumber: 1,
      intervalType: 'days',
      priority: 8,
      active: true,
    },
    {
      name: 'Support Ticket SLA Breach Monitor',
      model: 'hd.ticket',
      method: 'checkSlaBreaches',
      intervalNumber: 15,
      intervalType: 'minutes',
      priority: 2,
      active: true,
    },
    {
      name: 'Celestial Ephemeris & Hilal Sync',
      model: 'geo.city',
      method: 'recomputeSunMoonPositions',
      intervalNumber: 6,
      intervalType: 'hours',
      priority: 4,
      active: true,
    },
    {
      name: 'System Resource Heartbeat Telemetry',
      model: 'px.system',
      method: 'recordHeartbeat',
      intervalNumber: 5,
      intervalType: 'minutes',
      priority: 1,
      active: true,
    }
  ]

  const cronMap: Record<string, any> = {}
  for (const c of cronSeeds) {
    const existing = await IrCronModel.fetch(IrCronModel, env, [['name', '=', c.name]])
    if (!existing.length) {
      const row = await IrCronModel.spawn(IrCronModel, env, {
        ...c,
        nextCall: new Date(now.getTime() + c.intervalNumber * (c.intervalType === 'days' ? 86400000 : c.intervalType === 'hours' ? 3600000 : 60000)),
        active: c.active ?? true,
      })
      cronMap[c.name] = row
    } else {
      cronMap[c.name] = existing[0]
    }
  }

  // Seed execution logs
  const logSeeds = jsonSeed?.logs || [
    {
      cronName: 'System Resource Heartbeat Telemetry',
      status: 'success',
      durationMs: 42.5,
      message: 'Recorded system metrics successfully (memory: 48MB, activeClients: 12)',
    },
    {
      cronName: 'Support Ticket SLA Breach Monitor',
      status: 'success',
      durationMs: 18.2,
      message: 'Scanned 14 active support tickets. 0 breaches detected.',
    }
  ]

  for (const l of logSeeds) {
    const parentCron = cronMap[l.cronName]
    if (parentCron) {
      await IrCronLogModel.spawn(IrCronLogModel, env, {
        cronId: parentCron.id,
        status: l.status,
        executedAt: new Date(now.getTime() - 300000),
        durationMs: l.durationMs,
        message: l.message,
      })
    }
  }

  // Seed sample queue jobs if model is registered
  if (IrQueueJobModel) {
    const jobSeeds = jsonSeed?.jobs || [
      {
        name: 'Batch Celestial Telemetry Aggregator',
        queueName: 'celestial-compute',
        status: 'completed',
        priority: 3,
        progress: 100,
        attempts: 1,
        maxAttempts: 3,
        durationMs: 1800,
        payload: JSON.stringify({ batchSize: 50, date: now.toISOString().slice(0, 10) }),
        result: JSON.stringify({ processedCount: 50, success: true }),
      },
      {
        name: 'Dispatch RFC Status Digest Notification',
        queueName: 'notifications',
        status: 'active',
        priority: 2,
        progress: 65,
        attempts: 1,
        maxAttempts: 3,
        payload: JSON.stringify({ channel: 'email', recipients: ['council@moonwitness.org'] }),
      },
      {
        name: 'Transactional Stock Valuation Recompute',
        queueName: 'finance',
        status: 'waiting',
        priority: 5,
        progress: 0,
        attempts: 0,
        maxAttempts: 3,
        payload: JSON.stringify({ fiscalYear: 1448 }),
      }
    ]

    for (const j of jobSeeds) {
      const existing = await IrQueueJobModel.fetch(IrQueueJobModel, env, [['name', '=', j.name]])
      if (!existing.length) {
        await IrQueueJobModel.spawn(IrQueueJobModel, env, {
          ...j,
          nextRunAt: now,
          startedAt: now,
          finishedAt: j.status === 'completed' ? now : undefined,
        })
      }
    }
  }

  console.log(`[moon-cron] Demo data enriched: ${cronSeeds.length} cron jobs, ${logSeeds.length} logs, queue jobs seeded`)
}
