import { describe, expect, it } from 'vitest'
import projectAddon, { PjMilestone, PjProject, PjSprint, PjStage, PjTag, PjTask } from '../src/index.js'

describe('@moon/project addon', () => {
  it('exports the canonical addon manifest', () => {
    expect(projectAddon.name).toBe('project')
    expect(projectAddon.depends).toContain('base')
    expect(projectAddon.models).toHaveLength(6)
  })

  it('registers the complete project model set', () => {
    expect(PjProject._name).toBe('pj.project')
    expect(PjTask._name).toBe('pj.task')
    expect(PjStage._name).toBe('pj.stage')
    expect(PjMilestone._name).toBe('pj.milestone')
    expect(PjSprint._name).toBe('pj.sprint')
    expect(PjTag._name).toBe('pj.tag')
  })
})
