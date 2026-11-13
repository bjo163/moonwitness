import { createCtx, getModel, SUPERUSER_ID, loadJsonSeed } from '@moon/orm'

export async function loadDemoData() {
  const Change = getModel('cab.change')
  const Meeting = getModel('cab.meeting')
  const Decision = getModel('cab.decision')
  const Project = getModel('pj.project')
  if (!Change || !Meeting || !Decision) return

  const env = createCtx(SUPERUSER_ID, {}, getModel)

  const jsonSeed = loadJsonSeed<{
    changes?: { reference: string; title: string; description: string; projectCode: string; risk: string; status: string }[]
    meetings?: { title: string; status: string; scheduledFor: string }[]
    decisions?: { changeRef: string; meetingTitle: string; outcome: string; rationale: string }[]
  }>('cab')

  // Resolve project IDs by code
  const projectIds: Record<string, number> = {}
  if (Project) {
    for (const code of ['PROJECT-LUNAR-SCOPE', 'PROJECT-AEQ4-ENGINE', 'PROJECT-QURAN-GRAPH', 'PROJECT-ALLSKY-SEEING']) {
      const rows = await Project.fetch(Project, env, [['code', '=', code]])
      if (rows.length) projectIds[code] = rows[0].id as number
    }
  }

  // ── Change Requests / RFCs ──
  const changeSeeds = jsonSeed?.changes || [
    { reference: 'RFC-2026-001', title: 'Upgrade Lunar Ephemeris to VSOP87 Engine', description: 'Replace the current simplified moon position algorithm with the full VSOP87 planetary theory for sub-arcsecond precision at all latitudes.', projectCode: 'PROJECT-LUNAR-SCOPE', risk: 'medium', status: 'approved' },
    { reference: 'RFC-2026-002', title: 'Cross-App SSO Session Protocol', description: 'Implement unified cryptographic JWT session management across Web Portal (3000), Command Center (3001), and API (4000) with HttpOnly SameSite=Strict cookies.', projectCode: 'PROJECT-AEQ4-ENGINE', risk: 'high', status: 'in_review' },
    { reference: 'RFC-2026-003', title: 'Witness Engine V2 Schema Migration', description: 'Restructure the Witness knowledge graph schema to support the new engine module system with typed evidence candidates and score profiles.', projectCode: 'PROJECT-QURAN-GRAPH', risk: 'high', status: 'submitted' },
    { reference: 'RFC-2026-004', title: 'Fix Southern Hemisphere Qibla Algorithm', description: 'The great-circle bearing calculation produces inverted results below the equator. Requires correction in the core @moon/compute qibla module.', projectCode: 'PROJECT-LUNAR-SCOPE', risk: 'critical', status: 'approved' },
    { reference: 'RFC-2026-005', title: 'Immutable Audit Trail for Zakat Allocation', description: 'Introduce Merkle-tree cryptographic receipts for every approved financial movement in account.move to guarantee mathematical unalterability.', projectCode: 'PROJECT-AEQ4-ENGINE', risk: 'medium', status: 'submitted' },
    { reference: 'RFC-2026-006', title: 'High-Frequency MQTT Stream for Bosscha Dome', description: 'Deploy low-latency telemetry transport between physical dome rotary sensors and the MoonWitness Command Center telemetry dashboard.', projectCode: 'PROJECT-LUNAR-SCOPE', risk: 'low', status: 'approved' }
  ]
  const changeIds: Record<string, number> = {}
  for (const c of changeSeeds) {
    const rows = await Change.fetch(Change, env, [['reference', '=', c.reference]])
    if (!rows.length) {
      const row = await Change.spawn(Change, env, {
        reference: c.reference,
        title: c.title,
        description: c.description,
        projectId: projectIds[c.projectCode] || undefined,
        risk: c.risk,
        status: c.status
      })
      changeIds[c.reference] = row.id as number
    } else {
      changeIds[c.reference] = rows[0].id as number
    }
  }

  // ── Meetings ──
  const meetingSeeds = jsonSeed?.meetings || [
    { title: 'CAB Review Board — Sprint Rajab Review', status: 'completed', scheduledFor: '2026-08-25T14:00:00Z' },
    { title: 'Emergency RFC Review — Qibla Algorithm', status: 'completed', scheduledFor: '2026-09-01T10:00:00Z' },
    { title: 'Architecture Review Board — Sha\'ban Planning', status: 'scheduled', scheduledFor: '2026-09-10T13:00:00Z' }
  ]
  const meetingIds: Record<string, number> = {}
  for (const m of meetingSeeds) {
    const rows = await Meeting.fetch(Meeting, env, [['title', '=', m.title]])
    if (!rows.length) {
      const row = await Meeting.spawn(Meeting, env, m)
      meetingIds[m.title] = row.id as number
    } else {
      meetingIds[m.title] = rows[0].id as number
    }
  }

  // ── Decisions ──
  const decisionSeeds = jsonSeed?.decisions || [
    { changeRef: 'RFC-2026-001', meetingTitle: 'CAB Review Board — Sprint Rajab Review', outcome: 'approved', rationale: 'Algorithm verified against JPL Horizons dataset. Performance benchmarks show <2ms per computation. Approved for Sprint Rajab-01 integration.' },
    { changeRef: 'RFC-2026-003', meetingTitle: 'CAB Review Board — Sprint Rajab Review', outcome: 'deferred', rationale: 'Backward compatibility analysis incomplete. Requires migration plan for existing wx_entity and wx_relation records before approval.' },
    { changeRef: 'RFC-2026-004', meetingTitle: 'Emergency RFC Review — Qibla Algorithm', outcome: 'approved', rationale: 'Mathematical proof of inverted azimuth below equator accepted. Core library patch unit tests pass 100% on Southern coordinates.' },
    { changeRef: 'RFC-2026-006', meetingTitle: 'Architecture Review Board — Sha\'ban Planning', outcome: 'approved', rationale: 'Bandwidth consumption within acceptable threshold (<50KB/s per active sensor).' }
  ]
  for (const d of decisionSeeds) {
    const chId = changeIds[d.changeRef]
    const mtId = meetingIds[d.meetingTitle]
    if (!chId) continue
    const rows = await Decision.fetch(Decision, env, [['changeId', '=', chId]])
    if (!rows.length) {
      await Decision.spawn(Decision, env, {
        changeId: chId,
        meetingId: mtId || undefined,
        outcome: d.outcome,
        rationale: d.rationale
      })
    }
  }

  console.log(`[moon-cab] Demo data enriched: ${changeSeeds.length} RFCs, ${meetingSeeds.length} governance meetings, ${decisionSeeds.length} formal decisions`)
}
