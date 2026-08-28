import { describe, it, expect } from 'vitest'
import {
  CrmStage,
  CrmTeam,
  CrmLead
} from '../src/index.js'
import crmAddon from '../src/index.js'

describe('@moon/crm Addon (#24)', () => {
  it('exports addon manifest with base and mail dependencies', () => {
    expect(crmAddon.name).toBe('crm')
    expect(crmAddon.depends).toContain('base')
    expect(crmAddon.depends).toContain('mail')
    expect(crmAddon.models.length).toBe(3)
  })

  it('defines CRM stage, team, and lead models', () => {
    expect(CrmStage._name).toBe('crm.stage')
    expect(CrmTeam._name).toBe('crm.team')
    expect(CrmLead._name).toBe('crm.lead')
  })
})
