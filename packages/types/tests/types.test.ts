import { describe, expect, it } from 'vitest'
import * as types from '../src/index.js'
describe('@workspace/types', () => {
  it('has a populated canonical type entrypoint', () => {
    expect(Object.keys(types).length).toBeGreaterThan(0)
  })
})
