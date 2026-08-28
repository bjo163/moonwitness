import { describe, expect, it } from 'vitest'
import { isRuntimeSchemaSyncAllowed } from '../src/runtime-schema.js'

describe('runtime schema lifecycle (#20)', () => {
  it('allows development runtime sync', () => {
    expect(isRuntimeSchemaSyncAllowed({ NODE_ENV: 'development' })).toBe(true)
    expect(isRuntimeSchemaSyncAllowed({ NODE_ENV: 'test' })).toBe(true)
  })

  it('forbids production runtime schema mutation', () => {
    expect(isRuntimeSchemaSyncAllowed({ NODE_ENV: 'production' })).toBe(false)
  })
})
