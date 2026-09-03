import { getModel, createCtx, SUPERUSER_ID } from '@moon/orm'
import type IrQueueJob from './models/ir-queue-job.js'

export interface JobOptions {
  priority?: number
  delayMs?: number
  maxAttempts?: number
  backoffMs?: number
}

export interface Job<T = any> {
  id: number
  name: string
  queueName: string
  data: T
  attempts: number
  maxAttempts: number
  progress: number
  updateProgress: (pct: number) => Promise<void>
}

export type JobProcessor<T = any, R = any> = (job: Job<T>) => Promise<R>

export class TaskQueue<T = any> {
  public readonly queueName: string

  constructor(queueName = 'default') {
    this.queueName = queueName
  }

  /**
   * Add a new job to the queue.
   */
  async add(name: string, data: T, opts: JobOptions = {}): Promise<number | null> {
    const IrQueueJobModel = getModel('ir.queue.job') as typeof IrQueueJob
    if (!IrQueueJobModel) throw new Error('Model ir.queue.job is not registered in ORM')

    const env = createCtx(SUPERUSER_ID, {}, getModel as any)
    const now = Date.now()
    const nextRunAt = new Date(now + (opts.delayMs || 0))

    const record = await IrQueueJobModel.spawn(IrQueueJobModel, env, {
      name,
      queueName: this.queueName,
      status: opts.delayMs && opts.delayMs > 0 ? 'delayed' : 'waiting',
      priority: opts.priority ?? 5,
      payload: JSON.stringify(data ?? {}),
      maxAttempts: opts.maxAttempts ?? 3,
      backoffMs: opts.backoffMs ?? 1000,
      nextRunAt,
      progress: 0,
      attempts: 0,
    })

    return record?.id ?? null
  }

  /**
   * Retry a failed or waiting job immediately.
   */
  async retry(jobId: number): Promise<boolean> {
    const IrQueueJobModel = getModel('ir.queue.job') as typeof IrQueueJob
    if (!IrQueueJobModel) return false
    const env = createCtx(SUPERUSER_ID, {}, getModel as any)
    await IrQueueJobModel.morph(IrQueueJobModel, env, jobId, {
      status: 'waiting',
      nextRunAt: new Date(),
      error: null,
    })
    return true
  }

  /**
   * Get job statistics for this queue.
   */
  async getJobCounts(): Promise<Record<string, number>> {
    const IrQueueJobModel = getModel('ir.queue.job') as typeof IrQueueJob
    if (!IrQueueJobModel) return { waiting: 0, active: 0, completed: 0, failed: 0 }
    const env = createCtx(SUPERUSER_ID, {}, getModel as any)

    const jobs = await IrQueueJobModel.query(env).where('queueName', this.queueName).fetch()
    const counts: Record<string, number> = { waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0 }
    for (const j of jobs) {
      const st = String(j.status)
      counts[st] = (counts[st] || 0) + 1
    }
    return counts
  }
}

export class TaskWorker<T = any, R = any> {
  public readonly queueName: string
  private processor: JobProcessor<T, R>
  private concurrency: number
  private pollIntervalMs: number
  private timer: NodeJS.Timeout | null = null
  private activeJobsCount = 0
  private isProcessing = false

  constructor(
    queueName: string,
    processor: JobProcessor<T, R>,
    opts: { concurrency?: number; pollIntervalMs?: number } = {}
  ) {
    this.queueName = queueName
    this.processor = processor
    this.concurrency = opts.concurrency ?? 5
    this.pollIntervalMs = opts.pollIntervalMs ?? 2000
  }

  start(): void {
    if (this.timer) return
    this.timer = setInterval(() => {
      this.tick().catch((e) => console.error(`[TaskWorker:${this.queueName}] Loop error:`, e))
    }, this.pollIntervalMs)
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  private async tick(): Promise<void> {
    if (this.isProcessing || this.activeJobsCount >= this.concurrency) return
    this.isProcessing = true

    try {
      const IrQueueJobModel = getModel('ir.queue.job') as typeof IrQueueJob
      if (!IrQueueJobModel) return

      const env = createCtx(SUPERUSER_ID, {}, getModel as any)
      const now = new Date()
      const availableSlots = this.concurrency - this.activeJobsCount

      const pendingJobs = await IrQueueJobModel.query(env)
        .where('queueName', this.queueName)
        .where('status', 'in', ['waiting', 'delayed'])
        .where('nextRunAt', '<=', now)
        .orderBy('priority', 'asc')
        .limit(availableSlots)
        .fetch()

      for (const jobRecord of pendingJobs) {
        this.activeJobsCount++
        this.processJob(jobRecord).finally(() => {
          this.activeJobsCount--
        })
      }
    } catch (err) {
      console.error(`[TaskWorker:${this.queueName}] Tick error:`, err)
    } finally {
      this.isProcessing = false
    }
  }

  private async processJob(jobRecord: any): Promise<void> {
    const IrQueueJobModel = getModel('ir.queue.job') as typeof IrQueueJob
    const env = createCtx(SUPERUSER_ID, {}, getModel as any)
    const startTime = Date.now()

    // Morph state to Active
    await IrQueueJobModel.morph(IrQueueJobModel, env, jobRecord.id, {
      status: 'active',
      startedAt: new Date(),
      attempts: (jobRecord.attempts || 0) + 1,
    })

    let data: T = {} as T
    try {
      if (jobRecord.payload) data = JSON.parse(jobRecord.payload)
    } catch {
      data = jobRecord.payload
    }

    const jobInstance: Job<T> = {
      id: jobRecord.id,
      name: jobRecord.name,
      queueName: jobRecord.queueName,
      data,
      attempts: (jobRecord.attempts || 0) + 1,
      maxAttempts: jobRecord.maxAttempts || 3,
      progress: jobRecord.progress || 0,
      updateProgress: async (pct: number) => {
        await IrQueueJobModel.morph(IrQueueJobModel, env, jobRecord.id, { progress: Math.min(100, Math.max(0, pct)) })
      },
    }

    try {
      const result = await this.processor(jobInstance)
      const durationMs = Date.now() - startTime

      await IrQueueJobModel.morph(IrQueueJobModel, env, jobRecord.id, {
        status: 'completed',
        progress: 100,
        result: result !== undefined ? JSON.stringify(result) : null,
        finishedAt: new Date(),
        durationMs,
      })
    } catch (err: any) {
      const durationMs = Date.now() - startTime
      const attempts = (jobRecord.attempts || 0) + 1
      const maxAttempts = jobRecord.maxAttempts || 3
      const errorMsg = err?.stack || err?.message || String(err)

      if (attempts < maxAttempts) {
        // Calculate Exponential Backoff Delay
        const backoffMs = (jobRecord.backoffMs || 1000) * Math.pow(2, attempts - 1)
        const nextRunAt = new Date(Date.now() + backoffMs)

        await IrQueueJobModel.morph(IrQueueJobModel, env, jobRecord.id, {
          status: 'delayed',
          error: `[Attempt ${attempts}/${maxAttempts}] ${errorMsg}`,
          nextRunAt,
          durationMs,
        })
      } else {
        // Mark as Failed (Dead-Letter)
        await IrQueueJobModel.morph(IrQueueJobModel, env, jobRecord.id, {
          status: 'failed',
          error: `[Final Failure after ${attempts} attempts] ${errorMsg}`,
          finishedAt: new Date(),
          durationMs,
        })
      }
    }
  }
}
