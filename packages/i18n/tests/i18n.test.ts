import { describe, expect, it } from 'vitest'
import * as i18n from '../src/index.js'
describe('@workspace/i18n', () => {
  it('exports localized system labels', () => {
    expect(Object.keys(i18n).length).toBeGreaterThan(0)
  })
})
