import { describe, expect, it } from 'vitest'
import { AutoAvatar } from '../src/index.js'
describe('@workspace/auto-avatar', () => {
  it('exports the avatar component', () => {
    expect(typeof AutoAvatar).toBe('function')
  })
})
