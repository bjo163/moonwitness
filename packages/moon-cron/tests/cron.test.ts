import { describe, expect, it } from 'vitest'
import cronAddon, { IrCron, IrCronLog, IrQueueJob } from '../src/index.js'
describe('@moon/cron addon', () => {
  it('exposes its manifest and queue models', () => {
    expect(cronAddon.name).toBe('cron')
    expect(cronAddon.models).toHaveLength(3)
    expect([IrCron._name, IrCronLog._name, IrQueueJob._name]).toEqual(['ir.cron', 'ir.cron.log', 'ir.queue.job'])
  })
})
