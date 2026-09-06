import { test } from 'vitest'
import assert from 'node:assert/strict'
import { researchUiFindings } from './audit-research-ui.mjs'

const file = 'apps/web/components/home/public-home.tsx'

test('detects responsive promotional classes with source line locations', () => {
  const findings = researchUiFindings(file, '<div>\n<h1 className="sm:text-7xl uppercase py-20">Title</h1></div>')
  assert.equal(findings.length, 3)
  assert.ok(findings.every(item => item.line === 2))
})

test('accepts compact reading and ignores source text and domain visualizations', () => {
  assert.deepEqual(researchUiFindings(file, '<p className="text-base leading-relaxed">uppercase text-7xl</p>'), [])
  assert.deepEqual(researchUiFindings('apps/web/views/observatory/chart.tsx', '<div className="text-7xl" />'), [])
  assert.deepEqual(researchUiFindings('apps/web/components/shell/cosmic-3d-background.tsx', '<div className="blur-[160px]" />'), [])
})

test('handles Windows paths and multiline classes', () => {
  assert.equal(researchUiFindings(file.replaceAll('/', '\\'), '<div className="text-sm\n backdrop-blur-md" />').length, 1)
})

test('detects arbitrary huge font sizes, gap spacing, and animations across publication components', () => {
  const authFile = 'apps/web/components/auth/auth-form.tsx'
  const findings = researchUiFindings(authFile, '<div className="text-[48px] gap-16 animate-bounce tracking-wider" />')
  assert.equal(findings.length, 4)
})
