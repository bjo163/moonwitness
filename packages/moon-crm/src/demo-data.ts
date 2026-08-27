import { createCtx, getModel, SUPERUSER_ID } from '@moon/orm'

export async function loadDemoData() {
  const Stage = getModel('crm.stage')
  const Team = getModel('crm.team')
  const Lead = getModel('crm.lead')

  if (!Stage || !Team || !Lead) return

  const env = createCtx(SUPERUSER_ID, {}, getModel)

  // ── CRM Stages ──
  const stageSeeds = [
    { name: 'New Inquiries', sequence: 10, isWon: false },
    { name: 'Qualification & Review', sequence: 20, isWon: false },
    { name: 'Proposal / Partnership', sequence: 30, isWon: false },
    { name: 'Active Partnership', sequence: 40, isWon: true }
  ]
  const stageIds: Record<string, number> = {}
  for (const s of stageSeeds) {
    const rows = await Stage.fetch(Stage, env, [['name', '=', s.name]])
    if (!rows.length) {
      const row = await Stage.spawn(Stage, env, s)
      stageIds[s.name] = row.id as number
    } else {
      stageIds[s.name] = rows[0].id as number
    }
  }

  // ── CRM Teams ──
  const teamSeeds = [
    { name: 'Global Observatory Network Outreach' },
    { name: 'Academic & Scripture Research Partnerships' }
  ]
  const teamIds: Record<string, number> = {}
  for (const t of teamSeeds) {
    const rows = await Team.fetch(Team, env, [['name', '=', t.name]])
    if (!rows.length) {
      const row = await Team.spawn(Team, env, t)
      teamIds[t.name] = row.id as number
    } else {
      teamIds[t.name] = rows[0].id as number
    }
  }

  // ── CRM Leads ──
  const leadSeeds = [
    {
      name: 'Granada Astronomical Center Collaboration',
      email: 'partnerships@granada-astro.es',
      team: 'Global Observatory Network Outreach',
      stage: 'Proposal / Partnership',
      expectedRevenue: 50000000,
      probability: 70
    },
    {
      name: 'Alexandria Islamic Heritage Digitization Grant',
      email: 'heritage@alexandria-univ.edu.eg',
      team: 'Academic & Scripture Research Partnerships',
      stage: 'Qualification & Review',
      expectedRevenue: 120000000,
      probability: 50
    }
  ]

  for (const l of leadSeeds) {
    const rows = await Lead.fetch(Lead, env, [['name', '=', l.name]])
    if (!rows.length) {
      await Lead.spawn(Lead, env, {
        name: l.name,
        email: l.email,
        teamId: teamIds[l.team] || undefined,
        stageId: stageIds[l.stage] || undefined,
        expectedRevenue: l.expectedRevenue,
        probability: l.probability
      })
    }
  }

  console.log('[moon-crm] Demo data loaded: 4 stages, 2 teams, 2 leads')
}
