import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { auditThemeTokens, getContrastRatio } from './audit-theme-tokens.mjs'
const css = readFileSync(new URL('../packages/ui/src/styles/globals.css', import.meta.url), 'utf8')
describe('canonical theme token audit', () => {
  it('accepts the canonical light/dark theme', () => {
    expect(auditThemeTokens(css)).toEqual({ themeParity: [], accessibility: [], cyberVarMisuse: [] })
  })
  it('checks normal text contrast at 4.5:1', () => {
    const result = auditThemeTokens(css.replace('--muted-foreground: #666670;', '--muted-foreground: #71717a;'))
    expect(result.accessibility.some(f => f.issue.includes('muted/muted-foreground'))).toBe(true)
  })
  it('detects missing tokens and utility mappings', () => {
    const result = auditThemeTokens(css.replace('--color-primary: var(--primary);', '').replace('--primary: #0369a1;', ''))
    expect(result.themeParity.some(f => f.token.includes(':root missing canonical token --primary'))).toBe(true)
    expect(result.themeParity.some(f => f.token.includes('--color-primary'))).toBe(true)
  })
  it('rejects font variable cycles', () => {
    const result = auditThemeTokens(css.replace('--font-sans: "Geist", sans-serif;', '--font-sans: var( --font-sans, sans-serif);'))
    expect(result.themeParity.some(f => f.token.includes('Self-referencing'))).toBe(true)
  })
  it('calculates opaque sRGB contrast without treating alpha as opaque', () => {
    expect(getContrastRatio('#fff', '#000')).toBe(21)
    expect(getContrastRatio('#ffffff80', '#000')).toBeNull()
    expect(getContrastRatio('#zzzzzz', '#000')).toBeNull()
  })
  it('reports unverified formats instead of silently passing them', () => {
    const result = auditThemeTokens(css.replace('--primary: #0369a1;', '--primary: rgba(0, 0, 0, 0.5);'))
    expect(result.accessibility.some(f => f.issue.includes('unverified'))).toBe(true)
  })
  it('detects duplicate declarations and missing dark mode', () => {
    expect(auditThemeTokens(css.replace('--primary: #0369a1;', '--primary: #0369a1; --primary: #ffffff;')).themeParity.some(f => f.token.includes('duplicates'))).toBe(true)
    expect(auditThemeTokens(css.replace('.dark {', '.other {')).themeParity.some(f => f.token.includes('Missing .dark'))).toBe(true)
  })
})
