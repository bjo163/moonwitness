import { createCtx, getModel, SUPERUSER_ID, loadJsonSeed } from '@moon/orm'

export async function loadDemoData() {
  const Project = getModel('pj.project')
  const Stage = getModel('pj.stage')
  const Task = getModel('pj.task')
  const Milestone = getModel('pj.milestone')
  const Sprint = getModel('pj.sprint')
  const Tag = getModel('pj.tag')
  if (!Project || !Stage || !Task || !Milestone || !Sprint || !Tag) return

  const env = createCtx(SUPERUSER_ID, {}, getModel)
  const company = await getModel('vx.user')?.fetch(getModel('vx.user') as any, env, [['id', '=', SUPERUSER_ID]])
  const companyId = company?.[0]?.companyId

  const jsonSeed = loadJsonSeed<{
    tags?: { name: string; color: string }[]
    projects?: { code: string; name: string; summary: string; status: string }[]
    milestones?: { name: string; projectCode: string; deadline: string }[]
    sprints?: { name: string; projectCode: string; status: string; startDate: string; endDate: string }[]
    tasks?: { title: string; projectCode: string; stage: string; priority: string; dueDate: string; estimatedHours: number }[]
  }>('project')

  // ── Tags ──
  const tagSeeds = jsonSeed?.tags || [
    { name: 'Backend', color: '#00F0FF' },
    { name: 'Frontend', color: '#A100FF' },
    { name: 'Algorithm', color: '#00FF66' },
    { name: 'DevOps', color: '#FFE600' },
    { name: 'Research', color: '#FF0055' }
  ]
  for (const t of tagSeeds) {
    const rows = await Tag.fetch(Tag, env, [['name', '=', t.name]])
    if (!rows.length) await Tag.spawn(Tag, env, t)
  }

  // ── Projects ──
  const projectSeeds = jsonSeed?.projects || [
    { code: 'PROJECT-LUNAR-SCOPE', name: 'Cosmic Optical Grid Calibration', summary: 'Upgrade the lunar ephemeris engine to VSOP87 precision and calibrate the optical observation grid across 12 observatory nodes.', status: 'active' },
    { code: 'PROJECT-QURAN-GRAPH', name: 'Universal Root Concordance Mapping', summary: 'Build a comprehensive Arabic root concordance with lexical occurrence tracking across all 114 Surahs and cross-scripture semantic links.', status: 'active' },
    { code: 'PROJECT-AEQ4-ENGINE', name: 'AEQ4 Temporal Engine Deployment', summary: 'Deploy the AEQ4 timestamp engine based on 4-Kitab divine temporal framework with countdown to 1 Muharram 1449H epoch.', status: 'planned' }
  ]

  const projectIds: Record<string, number> = {}
  for (const p of projectSeeds) {
    const rows = await Project.fetch(Project, env, [['code', '=', p.code]])
    if (!rows.length) {
      const row = await Project.spawn(Project, env, { ...p, companyId })
      projectIds[p.code] = row.id as number
    } else {
      projectIds[p.code] = rows[0].id as number
    }
  }

  // ── Stages (per project) ──
  const stageNames = ['Backlog', 'In Progress', 'Code Review', 'Testing', 'Done']
  const stageCache: Record<string, Record<string, number>> = {}
  for (const code of Object.keys(projectIds)) {
    const codeCache: Record<string, number> = {}
    stageCache[code] = codeCache
    let seq = 10
    for (const sName of stageNames) {
      const rows = await Stage.fetch(Stage, env, [
        ['projectId', '=', projectIds[code]],
        ['name', '=', sName]
      ])
      if (!rows.length) {
        const row = await Stage.spawn(Stage, env, {
          name: sName,
          sequence: seq,
          projectId: projectIds[code],
          fold: sName === 'Done',
          isClosing: sName === 'Done'
        })
        codeCache[sName] = row.id as number
      } else {
        codeCache[sName] = rows[0].id as number
      }
      seq += 10
    }
  }

  // ── Milestones ──
  const milestoneSeeds = jsonSeed?.milestones || [
    { name: 'Alpha Release', projectCode: 'PROJECT-LUNAR-SCOPE', deadline: '2026-09-15' },
    { name: 'Beta Testing', projectCode: 'PROJECT-QURAN-GRAPH', deadline: '2026-10-01' },
    { name: 'Epoch Countdown Go-Live', projectCode: 'PROJECT-AEQ4-ENGINE', deadline: '2027-06-01' }
  ]
  const milestoneIds: Record<string, number> = {}
  for (const m of milestoneSeeds) {
    const pId = projectIds[m.projectCode]
    if (!pId) continue
    const rows = await Milestone.fetch(Milestone, env, [
      ['name', '=', m.name],
      ['projectId', '=', pId]
    ])
    if (!rows.length) {
      const row = await Milestone.spawn(Milestone, env, {
        name: m.name,
        projectId: pId,
        deadline: m.deadline
      })
      milestoneIds[m.name] = row.id as number
    } else {
      milestoneIds[m.name] = rows[0].id as number
    }
  }

  // ── Sprints ──
  const sprintSeeds = jsonSeed?.sprints || [
    { name: 'Sprint Rajab-01', projectCode: 'PROJECT-LUNAR-SCOPE', status: 'active', startDate: '2026-08-20', endDate: '2026-09-03' },
    { name: 'Sprint Rajab-02', projectCode: 'PROJECT-QURAN-GRAPH', status: 'draft', startDate: '2026-09-03', endDate: '2026-09-17' }
  ]
  const sprintIds: Record<string, number> = {}
  for (const s of sprintSeeds) {
    const pId = projectIds[s.projectCode]
    if (!pId) continue
    const rows = await Sprint.fetch(Sprint, env, [
      ['name', '=', s.name],
      ['projectId', '=', pId]
    ])
    if (!rows.length) {
      const row = await Sprint.spawn(Sprint, env, {
        name: s.name,
        projectId: pId,
        status: s.status,
        startDate: s.startDate,
        endDate: s.endDate
      })
      sprintIds[s.name] = row.id as number
    } else {
      sprintIds[s.name] = rows[0].id as number
    }
  }

  // ── Tasks ──
  const taskSeeds = jsonSeed?.tasks || [
    { title: 'Implement VSOP87 ephemeris algorithm', projectCode: 'PROJECT-LUNAR-SCOPE', stage: 'In Progress', priority: 'high', dueDate: '2026-09-10', estimatedHours: 24 },
    { title: 'Calibrate optical grid node network', projectCode: 'PROJECT-LUNAR-SCOPE', stage: 'Backlog', priority: 'normal', dueDate: '2026-09-12', estimatedHours: 16 },
    { title: 'Setup lunar observation data pipeline', projectCode: 'PROJECT-LUNAR-SCOPE', stage: 'Code Review', priority: 'normal', dueDate: '2026-09-08', estimatedHours: 12 },
    { title: 'Fine-tune Bosscha CCD camera integration', projectCode: 'PROJECT-LUNAR-SCOPE', stage: 'Testing', priority: 'high', dueDate: '2026-09-14', estimatedHours: 18 },
    { title: 'Design concordance tree visualization', projectCode: 'PROJECT-QURAN-GRAPH', stage: 'In Progress', priority: 'normal', dueDate: '2026-09-20', estimatedHours: 20 },
    { title: 'Integrate root morphology database', projectCode: 'PROJECT-QURAN-GRAPH', stage: 'Backlog', priority: 'high', dueDate: '2026-09-25', estimatedHours: 32 },
    { title: 'Benchmark cross-scripture entity linkage', projectCode: 'PROJECT-QURAN-GRAPH', stage: 'Code Review', priority: 'normal', dueDate: '2026-09-18', estimatedHours: 14 },
    { title: 'Build countdown widget component', projectCode: 'PROJECT-AEQ4-ENGINE', stage: 'In Progress', priority: 'critical', dueDate: '2027-05-01', estimatedHours: 8 },
    { title: 'Create epoch configuration panel', projectCode: 'PROJECT-AEQ4-ENGINE', stage: 'Backlog', priority: 'high', dueDate: '2027-05-15', estimatedHours: 12 },
    { title: 'Harmonize 4-Kitab temporal chronology matrices', projectCode: 'PROJECT-AEQ4-ENGINE', stage: 'Backlog', priority: 'critical', dueDate: '2027-05-20', estimatedHours: 40 }
  ]
  for (const t of taskSeeds) {
    const pId = projectIds[t.projectCode]
    if (!pId) continue
    const rows = await Task.fetch(Task, env, [
      ['title', '=', t.title],
      ['projectId', '=', pId]
    ])
    if (!rows.length) {
      const stageId = stageCache[t.projectCode]?.[t.stage]
      await Task.spawn(Task, env, {
        title: t.title,
        projectId: pId,
        companyId,
        stageId: stageId || undefined,
        priority: t.priority,
        dueDate: t.dueDate,
        estimatedHours: t.estimatedHours
      })
    }
  }

  console.log(`[moon-project] Demo data enriched: ${projectSeeds.length} projects, ${milestoneSeeds.length} milestones, ${sprintSeeds.length} sprints, ${taskSeeds.length} tasks`)
}
