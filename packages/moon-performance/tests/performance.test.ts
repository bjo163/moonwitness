import { describe, expect, it } from 'vitest'
import performanceAddon, { IrDashboardWidget, PxCache, PxQuery, PxRequest, PxSystem } from '../src/index.js'
describe('@moon/performance addon', () => {
  it('exposes its manifest and telemetry models', () => {
    expect(performanceAddon.name).toBe('performance')
    expect(performanceAddon.models).toHaveLength(5)
    expect([PxRequest._name, PxCache._name, PxQuery._name, PxSystem._name, IrDashboardWidget._name]).toEqual(['px.request', 'px.cache', 'px.query', 'px.system', 'ir.dashboard.widget'])
  })
})
