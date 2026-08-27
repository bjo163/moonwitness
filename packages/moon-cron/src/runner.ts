import { getModel, createCtx, SUPERUSER_ID } from '@moon/orm'
import type IrCron from './models/ir-cron.js'
import type IrCronLog from './models/ir-cron-log.js'

/**
 * Calculate the next execution date based on interval settings.
 */
export function computeNextCallDate(
  baseDate: Date,
  intervalNumber: number,
  intervalType: string
): Date {
  const next = new Date(baseDate.getTime())
  switch (intervalType) {
    case 'minutes':
      next.setMinutes(next.getMinutes() + intervalNumber)
      break
    case 'hours':
      next.setHours(next.getHours() + intervalNumber)
      break
    case 'days':
      next.setDate(next.getDate() + intervalNumber)
      break
    case 'weeks':
      next.setDate(next.getDate() + intervalNumber * 7)
      break
    case 'months':
      next.setMonth(next.getMonth() + intervalNumber)
      break
    default:
      next.setHours(next.getHours() + intervalNumber)
  }
  return next
}

export class CronRunner {
  private timer: NodeJS.Timeout | null = null
  private running = false
  private pollIntervalMs: number

  constructor(pollIntervalMs = 30000) {
    this.pollIntervalMs = pollIntervalMs
  }

  /**
   * Execute a single cron job by ID.
   */
  public async executeCron(cronId: number): Promise<{ success: boolean; durationMs: number; error?: string }> {
    const IrCronModel = getModel('ir.cron') as typeof IrCron
    const IrCronLogModel = getModel('ir.cron.log') as typeof IrCronLog
    if (!IrCronModel || !IrCronLogModel) {
      return { success: false, durationMs: 0, error: 'Cron models not registered' }
    }

    const env = createCtx(SUPERUSER_ID, {}, getModel as any)
    const cron = await IrCronModel.query(env).where('id', cronId).first()
    if (!cron) {
      return { success: false, durationMs: 0, error: `Cron #${cronId} not found` }
    }

    const startTime = Date.now()
    let status: 'success' | 'failed' = 'success'
    let errorMsg: string | undefined
    let resultMsg = 'Execution completed'

    try {
      const TargetModel = getModel(cron.model)
      if (TargetModel && typeof (TargetModel as any)[cron.method] === 'function') {
        let args: any[] = []
        if (cron.args) {
          try {
            args = JSON.parse(cron.args)
            if (!Array.isArray(args)) args = [args]
          } catch {
            args = [cron.args]
          }
        }
        await (TargetModel as any)[cron.method](env, ...args)
      } else {
        resultMsg = `No-op: Target method ${cron.model}.${cron.method} evaluated`
      }
    } catch (err: any) {
      status = 'failed'
      errorMsg = err?.message || String(err)
      resultMsg = `Failed: ${errorMsg}`
    }

    const durationMs = Date.now() - startTime
    const now = new Date()

    // Write Execution Log
    try {
      await IrCronLogModel.spawn(IrCronLogModel, env, {
        cronId: cron.id,
        status,
        executedAt: now,
        durationMs,
        message: resultMsg,
        error: errorMsg,
      })
    } catch (logErr) {
      console.error('[CronRunner] Failed to write log:', logErr)
    }

    // Advance Cron Next Call Date
    const nextCall = computeNextCallDate(now, cron.intervalNumber || 1, cron.intervalType || 'hours')
    const remainingCalls = cron.numberCall > 0 ? cron.numberCall - 1 : cron.numberCall
    const isActive = remainingCalls === 0 ? false : cron.active

    try {
      await IrCronModel.morph(IrCronModel, env, cron.id, {
        lastCall: now,
        nextCall,
        runCount: (cron.runCount || 0) + 1,
        numberCall: remainingCalls,
        active: isActive,
      })
    } catch (updateErr) {
      console.error('[CronRunner] Failed to update cron status:', updateErr)
    }

    return { success: status === 'success', durationMs, error: errorMsg }
  }

  /**
   * Process all currently due cron jobs.
   */
  public async processDueCrons(): Promise<number> {
    if (this.running) return 0
    this.running = true

    try {
      const IrCronModel = getModel('ir.cron') as typeof IrCron
      if (!IrCronModel) return 0

      const env = createCtx(SUPERUSER_ID, {}, getModel as any)
      const now = new Date()

      const dueCrons = await IrCronModel.query(env)
        .where('active', true)
        .where('nextCall', '<=', now)
        .orderBy('priority', 'asc')
        .limit(20)
        .fetch()

      for (const cron of dueCrons) {
        await this.executeCron(cron.id)
      }

      return dueCrons.length
    } catch (err) {
      console.error('[CronRunner] Error during cron execution loop:', err)
      return 0
    } finally {
      this.running = false
    }
  }

  /**
   * Start the periodic background scheduler loop.
   */
  public start(): void {
    if (this.timer) return
    this.timer = setInterval(() => {
      this.processDueCrons().catch((e) => console.error('[CronRunner] Loop error:', e))
    }, this.pollIntervalMs)
  }

  /**
   * Stop the background scheduler.
   */
  public stop(): void {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }
}

export const globalCronRunner = new CronRunner()
