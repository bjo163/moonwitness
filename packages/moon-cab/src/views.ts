import type { ViewManifest } from '@moon/orm'

export const views: Record<string, ViewManifest> = {
  'cab.change': {
    defaultView: 'kanban',
    accentColor: 'purple',
    icon: 'ShieldCheck',
    kanban: {
      groupBy: 'status',
      titleField: 'title',
      subtitleField: 'reference',
      priorityField: 'risk',
      dateField: 'scheduledFor',
      userField: 'requesterId',
    },
    table: {
      columns: ['reference', 'title', 'projectId', 'status', 'risk', 'requesterId', 'scheduledFor'],
      defaultSort: { field: 'createdAt', direction: 'desc' },
      searchKeys: ['reference', 'title'],
    },
    form: {
      title: 'CHANGE REQUEST (RFC)',
      statusBar: { field: 'status' },
      sections: [
        { title: 'Request', columns: 2, fields: ['reference', 'title', 'projectId', 'ticketId'] },
        { title: 'Governance', columns: 2, fields: ['requesterId', 'ownerId', 'status', 'risk'] },
        { title: 'Schedule', columns: 2, fields: ['scheduledFor'] },
        { title: 'Description', columns: 1, fields: ['description'] },
      ],
      chatter: true,
    },
  },

  'cab.meeting': {
    defaultView: 'table',
    accentColor: 'purple',
    icon: 'CalendarDays',
    table: {
      columns: ['title', 'scheduledFor', 'status', 'facilitatorId'],
      defaultSort: { field: 'scheduledFor', direction: 'desc' },
      searchKeys: ['title'],
    },
    form: {
      title: 'GOVERNANCE MEETING',
      sections: [
        { title: 'Meeting', columns: 2, fields: ['title', 'scheduledFor', 'status', 'facilitatorId'] },
        { title: 'Attendees', columns: 1, fields: ['attendeeIds'] },
        { title: 'Notes', columns: 1, fields: ['notes'] },
      ],
    },
  },

  'cab.decision': {
    defaultView: 'table',
    accentColor: 'purple',
    icon: 'Gavel',
    table: {
      columns: ['changeId', 'meetingId', 'outcome', 'rationale'],
      searchKeys: ['rationale'],
    },
    form: {
      title: 'GOVERNANCE DECISION',
      sections: [
        { title: 'Decision', columns: 2, fields: ['changeId', 'meetingId', 'outcome'] },
        { title: 'Rationale', columns: 1, fields: ['rationale'] },
      ],
    },
  },
}
