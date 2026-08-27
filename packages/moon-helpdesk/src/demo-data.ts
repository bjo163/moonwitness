import { createCtx, getModel, SUPERUSER_ID } from '@moon/orm'

export async function loadDemoData() {
  const Team = getModel('hd.team')
  const Stage = getModel('hd.stage')
  const Ticket = getModel('hd.ticket')
  const Sla = getModel('hd.sla')
  const Tag = getModel('hd.tag')
  if (!Team || !Stage || !Ticket || !Sla || !Tag) return

  const env = createCtx(SUPERUSER_ID, {}, getModel)

  // ── Tags ──
  const tagSeeds = [
    { name: 'Bug', color: '#FF0055' },
    { name: 'Feature Request', color: '#A100FF' },
    { name: 'Documentation', color: '#00F0FF' },
    { name: 'Performance', color: '#FFE600' }
  ]
  for (const t of tagSeeds) {
    const rows = await Tag.fetch(Tag, env, [['name', '=', t.name]])
    if (!rows.length) await Tag.spawn(Tag, env, t)
  }

  // ── Teams ──
  const teamSeeds = [
    { code: 'COSMIC-SUPPORT', name: 'Cosmic Observatory Support', description: 'Handles all observatory, celestial computation, and qibla direction issues.' },
    { code: 'SCRIPTURE-DESK', name: 'Scripture & Knowledge Desk', description: 'Handles scripture text accuracy, hadith verification, and knowledge graph issues.' }
  ]
  const teamIds: Record<string, number> = {}
  for (const t of teamSeeds) {
    const rows = await Team.fetch(Team, env, [['code', '=', t.code]])
    if (!rows.length) {
      const row = await Team.spawn(Team, env, t)
      teamIds[t.code] = row.id as number
    } else {
      teamIds[t.code] = rows[0].id as number
    }
  }

  // ── Stages (per team) ──
  const stageNames = ['New', 'Investigating', 'In Progress', 'Resolved', 'Closed']
  const stageCache: Record<string, Record<string, number>> = {}
  for (const code of Object.keys(teamIds)) {
    const codeCache: Record<string, number> = {}
    stageCache[code] = codeCache
    let seq = 10
    for (const sName of stageNames) {
      const rows = await Stage.fetch(Stage, env, [
        ['teamId', '=', teamIds[code]],
        ['name', '=', sName]
      ])
      if (!rows.length) {
        const row = await Stage.spawn(Stage, env, {
          name: sName,
          sequence: seq,
          teamId: teamIds[code],
          fold: sName === 'Closed',
          isClosing: sName === 'Closed' || sName === 'Resolved'
        })
        codeCache[sName] = row.id as number
      } else {
        codeCache[sName] = rows[0].id as number
      }
      seq += 10
    }
  }

  // ── SLA Policies ──
  const slaSeeds = [
    { name: 'Urgent SLA', teamCode: 'COSMIC-SUPPORT', priority: 'urgent', responseHours: 1, resolutionHours: 4 },
    { name: 'High SLA', teamCode: 'COSMIC-SUPPORT', priority: 'high', responseHours: 4, resolutionHours: 24 },
    { name: 'Normal SLA', teamCode: 'COSMIC-SUPPORT', priority: 'normal', responseHours: 8, resolutionHours: 72 },
    { name: 'Low SLA', teamCode: 'COSMIC-SUPPORT', priority: 'low', responseHours: 24, resolutionHours: 168 },
    { name: 'Scripture Urgent', teamCode: 'SCRIPTURE-DESK', priority: 'urgent', responseHours: 2, resolutionHours: 8 },
    { name: 'Scripture Normal', teamCode: 'SCRIPTURE-DESK', priority: 'normal', responseHours: 12, resolutionHours: 96 }
  ]
  for (const s of slaSeeds) {
    const tId = teamIds[s.teamCode]
    if (!tId) continue
    const rows = await Sla.fetch(Sla, env, [['name', '=', s.name], ['teamId', '=', tId]])
    if (!rows.length) {
      await Sla.spawn(Sla, env, {
        name: s.name,
        teamId: tId,
        priority: s.priority,
        responseHours: s.responseHours,
        resolutionHours: s.resolutionHours
      })
    }
  }

  // ── Tickets ──
  const ticketSeeds = [
    { reference: 'TKT-0001', title: 'Moon phase calculation off by 2% at high latitudes', teamCode: 'COSMIC-SUPPORT', stage: 'Investigating', priority: 'high' },
    { reference: 'TKT-0002', title: 'Qibla compass shows wrong direction in Southern Hemisphere', teamCode: 'COSMIC-SUPPORT', stage: 'New', priority: 'urgent' },
    { reference: 'TKT-0003', title: 'Missing diacritics in Surah Al-Baqarah verse 255', teamCode: 'SCRIPTURE-DESK', stage: 'In Progress', priority: 'normal' },
    { reference: 'TKT-0004', title: 'Prayer time notification not triggering at Fajr', teamCode: 'COSMIC-SUPPORT', stage: 'Resolved', priority: 'high' },
    { reference: 'TKT-0005', title: 'Request: Add Tafsir Ibn Kathir cross-references', teamCode: 'SCRIPTURE-DESK', stage: 'New', priority: 'low' }
  ]
  for (const t of ticketSeeds) {
    const tId = teamIds[t.teamCode]
    if (!tId) continue
    const rows = await Ticket.fetch(Ticket, env, [['reference', '=', t.reference]])
    if (!rows.length) {
      const stageId = stageCache[t.teamCode]?.[t.stage]
      await Ticket.spawn(Ticket, env, {
        reference: t.reference,
        title: t.title,
        teamId: tId,
        stageId: stageId || undefined,
        priority: t.priority,
        slaStatus: t.priority === 'urgent' ? 'at_risk' : 'on_track'
      })
    }
  }

  console.log('[moon-helpdesk] Demo data loaded: 2 teams, 10 stages, 6 SLAs, 5 tickets')
}
