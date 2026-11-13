import { describe, expect, it } from 'vitest'
import helpdeskAddon, { HdSla, HdStage, HdTag, HdTeam, HdTicket } from '../src/index.js'
describe('@moon/helpdesk addon', () => {
  it('exposes its manifest and models', () => {
    expect(helpdeskAddon.name).toBe('helpdesk')
    expect(helpdeskAddon.models).toHaveLength(5)
    expect([HdTeam._name, HdStage._name, HdTicket._name, HdSla._name, HdTag._name]).toEqual(['hd.team', 'hd.stage', 'hd.ticket', 'hd.sla', 'hd.tag'])
  })
})
