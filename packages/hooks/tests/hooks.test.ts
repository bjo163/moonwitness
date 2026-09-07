import { describe, expect, it } from 'vitest'
import * as hooks from '../src/index.js'
describe('@workspace/hooks', () => {
  it('exports reusable hook entrypoints', () => {
    expect(typeof hooks.useMounted).toBe('function')
    expect(typeof hooks.useDebounce).toBe('function')
  })
})
