import { describe, expect, it } from 'vitest'
import shootgunAddon, { SgOperation } from '../src/index.js'
describe('@moon/shootgun addon', () => {
  it('exposes its manifest and operation model', () => {
    expect(shootgunAddon.name).toBe('shootgun')
    expect(shootgunAddon.models).toHaveLength(1)
    expect(SgOperation._name).toBe('sg.operation')
  })
})
