import { createCtx, getModel, SUPERUSER_ID, loadJsonSeed } from '@moon/orm'

export async function loadDemoData() {
  const Stage = getModel('crm.stage')
  const Team = getModel('crm.team')
  const Lead = getModel('crm.lead')

  if (!Stage || !Team || !Lead) return

  const env = createCtx(SUPERUSER_ID, {}, getModel)

  const jsonSeed = loadJsonSeed<{
    stages?: { name: string; sequence?: number; isWon?: boolean }[]
    teams?: { name: string }[]
    leads?: { name: string; email: string; team: string; stage: string; expectedRevenue: number; probability: number }[]
  }>('crm')

  // ── CRM Stages ──
  const stageSeeds = jsonSeed?.stages || [
    { name: 'New Inquiries', sequence: 10, isWon: false },
    { name: 'Qualification & Review', sequence: 20, isWon: false },
    { name: 'Proposal / Partnership', sequence: 30, isWon: false },
    { name: 'Legal & Agreement Drafting', sequence: 35, isWon: false },
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
  const teamSeeds = jsonSeed?.teams || [
    { name: 'Global Observatory Network Outreach' },
    { name: 'Academic & Scripture Research Partnerships' },
    { name: 'Civilization Heritage Digitization Wing' },
    { name: 'Institutional Endowments & Zakat Advisory' }
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
  const leadSeeds = jsonSeed?.leads || [
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
    },
    {
      name: 'Istanbul Kandilli Observatory Celestial Ephemeris Sync',
      email: 'ephemeris@boun.edu.tr',
      team: 'Global Observatory Network Outreach',
      stage: 'Active Partnership',
      expectedRevenue: 85000000,
      probability: 100
    },
    {
      name: 'Al-Azhar University Cross-Scripture Concordance MoU',
      email: 'research-board@alazhar.edu.eg',
      team: 'Academic & Scripture Research Partnerships',
      stage: 'Legal & Agreement Drafting',
      expectedRevenue: 175000000,
      probability: 85
    },
    {
      name: 'Moroccan Royal Falak Society Joint Ru’yah Network',
      email: 'contact@maroc-falak.ma',
      team: 'Global Observatory Network Outreach',
      stage: 'New Inquiries',
      expectedRevenue: 30000000,
      probability: 25
    },
    {
      name: 'National Waqf Board Digital Transformation Initiative',
      email: 'digital@waqf-board.org',
      team: 'Institutional Endowments & Zakat Advisory',
      stage: 'Proposal / Partnership',
      expectedRevenue: 250000000,
      probability: 60
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

  console.log(`[moon-crm] Demo data enriched: ${stageSeeds.length} stages, ${teamSeeds.length} teams, ${leadSeeds.length} leads with pipeline tracking`)
}
