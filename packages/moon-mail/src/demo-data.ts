import { createCtx, getModel, SUPERUSER_ID } from '@moon/orm'

export async function loadDemoData() {
  const ActivityType = getModel('mail.activity.type')
  if (!ActivityType) return

  const env = createCtx(SUPERUSER_ID, {}, getModel)

  const activityTypeSeeds = [
    { name: 'To-Do / Action Item', summary: 'General action item or operational task', icon: 'CheckSquare', delayCount: 1, delayUnit: 'days' },
    { name: 'Observatory Briefing', summary: 'Observation briefing and telescope setup', icon: 'Compass', delayCount: 0, delayUnit: 'days' },
    { name: 'Pentashih Review Meeting', summary: 'Sacred text verification session', icon: 'BookOpen', delayCount: 3, delayUnit: 'days' },
    { name: 'RFC Governance Ballot', summary: 'Change advisory board decision voting', icon: 'Shield', delayCount: 7, delayUnit: 'days' }
  ]

  for (const a of activityTypeSeeds) {
    const rows = await ActivityType.fetch(ActivityType, env, [['name', '=', a.name]])
    if (!rows.length) {
      await ActivityType.spawn(ActivityType, env, a)
    }
  }

  console.log('[moon-mail] Demo data loaded: 4 activity types')
}
