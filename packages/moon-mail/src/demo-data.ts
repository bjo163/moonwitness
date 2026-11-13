import { createCtx, getModel, SUPERUSER_ID, loadJsonSeed } from '@moon/orm'

export async function loadDemoData() {
  const ActivityType = getModel('mail.activity.type')
  const Activity = getModel('mail.activity')
  const Message = getModel('mail.message')
  const User = getModel('vx.user')

  if (!ActivityType) return

  const env = createCtx(SUPERUSER_ID, {}, getModel)

  const jsonSeed = loadJsonSeed<{
    activityTypes?: { name: string; summary: string; icon: string; delayCount: number; delayUnit: string }[]
    activities?: { resModel: string; activityTypeName: string; summary: string; note: string; delayDays: number; state: string }[]
    messages?: { body: string; resModel: string; messageType: string }[]
  }>('mail')

  let adminUserId: number | undefined
  if (User) {
    const uRows = await User.fetch(User, env, [['login', '=', 'admin@moonwitness.org']])
    if (uRows.length) adminUserId = uRows[0].id as number
  }

  const activityTypeSeeds = jsonSeed?.activityTypes || [
    { name: 'To-Do / Action Item', summary: 'General action item or operational task', icon: 'CheckSquare', delayCount: 1, delayUnit: 'days' },
    { name: 'Observatory Briefing', summary: 'Observation briefing and telescope setup', icon: 'Compass', delayCount: 0, delayUnit: 'days' },
    { name: 'Pentashih Review Meeting', summary: 'Sacred text verification session', icon: 'BookOpen', delayCount: 3, delayUnit: 'days' },
    { name: 'RFC Governance Ballot', summary: 'Change advisory board decision voting', icon: 'Shield', delayCount: 7, delayUnit: 'days' },
    { name: 'Security Audit Check', summary: 'Periodic credential and permission review', icon: 'Key', delayCount: 14, delayUnit: 'days' },
    { name: 'Ephemeris Reconciliation', summary: 'Comparison between calculation and observations', icon: 'Activity', delayCount: 30, delayUnit: 'days' }
  ]

  const typeIds: Record<string, number> = {}
  for (const a of activityTypeSeeds) {
    const rows = await ActivityType.fetch(ActivityType, env, [['name', '=', a.name]])
    if (!rows.length) {
      const row = await ActivityType.spawn(ActivityType, env, a)
      typeIds[a.name] = row.id as number
    } else {
      typeIds[a.name] = rows[0].id as number
    }
  }

  // ── Sample Activities (Tasks/Reminders) ──
  if (Activity && adminUserId && typeIds['Observatory Briefing'] && typeIds['Pentashih Review Meeting']) {
    const today = new Date().toISOString().split('T')[0]
    const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]

    const activitySeeds = [
      {
        resModel: 'pj.project',
        resId: 1,
        activityTypeId: typeIds['Observatory Briefing'],
        summary: 'Monthly Crescent Sighting Coordination Meeting',
        note: 'Prepare optical sensors and align Bosscha telescope with Kandilli Observatory feed.',
        dateDeadline: today,
        userId: adminUserId,
        state: 'planned'
      },
      {
        resModel: 'wx.scripture',
        resId: 1,
        activityTypeId: typeIds['Pentashih Review Meeting'],
        summary: 'Review Surah Al-Kahf Transliteration Alignment',
        note: 'Ensure verse 1-10 orthography strictly follows the Uthmani standard decree.',
        dateDeadline: nextWeek,
        userId: adminUserId,
        state: 'planned'
      }
    ]

    for (const act of activitySeeds) {
      const actRows = await Activity.fetch(Activity, env, [
        ['resModel', '=', act.resModel],
        ['summary', '=', act.summary]
      ])
      if (!actRows.length) {
        await Activity.spawn(Activity, env, act)
      }
    }
  }

  // ── Sample System Chatter Messages ──
  if (Message && adminUserId) {
    const messageSeeds = [
      {
        body: 'Sistem observasi optik berhasil disinkronkan dengan data JPL Horizons (VSOP87).',
        resModel: 'pj.project',
        resId: 1,
        messageType: 'notification',
        authorId: adminUserId
      },
      {
        body: 'Pentashihan digital Surah Al-Mulk ayat 1-30 telah selesai diverifikasi oleh dewan pakar.',
        resModel: 'wx.scripture',
        resId: 1,
        messageType: 'comment',
        authorId: adminUserId
      }
    ]

    for (const msg of messageSeeds) {
      const msgRows = await Message.fetch(Message, env, [
        ['resModel', '=', msg.resModel],
        ['body', '=', msg.body]
      ])
      if (!msgRows.length) {
        await Message.spawn(Message, env, msg)
      }
    }
  }

  console.log(`[moon-mail] Demo data enriched: ${activityTypeSeeds.length} activity types, sample activities & system chatter messages`)
}
