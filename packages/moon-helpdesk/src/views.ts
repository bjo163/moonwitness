import type { ViewManifest } from '@moon/orm'

export const views: Record<string, ViewManifest> = {
  'hd.ticket': {
    defaultView: 'kanban',
    accentColor: 'yellow',
    icon: 'Ticket',
    kanban: {
      groupBy: 'stageId',
      titleField: 'title',
      subtitleField: 'reference',
      priorityField: 'priority',
      badgeField: 'slaStatus',
      userField: 'assigneeId',
    },
    table: {
      columns: ['reference', 'title', 'teamId', 'stageId', 'priority', 'slaStatus', 'assigneeId'],
      defaultSort: { field: 'createdAt', direction: 'desc' },
      searchKeys: ['reference', 'title'],
    },
    form: {
      title: 'SUPPORT TICKET',
      statusBar: { field: 'stageId' },
      headerActions: [
        { label: 'Escalate to RFC', action: 'action_escalate_cab', variant: 'warning' },
      ],
      sections: [
        { title: 'Ticket Info', columns: 2, fields: ['reference', 'title', 'teamId', 'priority'] },
        { title: 'Assignment', columns: 2, fields: ['assigneeId', 'partnerId', 'projectId', 'changeId'] },
        { title: 'SLA & Governance', columns: 2, fields: ['slaId', 'slaDeadline', 'slaStatus'] },
        { title: 'Problem Details', columns: 1, fields: ['description'] },
      ],
      chatter: true,
    },
  },

  'hd.team': {
    defaultView: 'table',
    accentColor: 'yellow',
    icon: 'Users',
    table: {
      columns: ['name', 'leaderId', 'description'],
      searchKeys: ['name'],
    },
    form: {
      title: 'SUPPORT TEAM',
      sections: [
        { title: 'Team', columns: 2, fields: ['name', 'leaderId'] },
        { title: 'Description', columns: 1, fields: ['description'] },
      ],
    },
  },

  'hd.stage': {
    defaultView: 'table',
    accentColor: 'yellow',
    icon: 'Columns3',
    table: { columns: ['name', 'sequence', 'teamId', 'fold', 'isClosing'], searchKeys: ['name'] },
    form: {
      title: 'TICKET STAGE',
      sections: [{ title: 'Configuration', columns: 2, fields: ['name', 'sequence', 'teamId', 'fold', 'isClosing'] }],
    },
  },

  'hd.sla': {
    defaultView: 'table',
    accentColor: 'yellow',
    icon: 'Clock',
    table: { columns: ['name', 'teamId', 'priority', 'responseHours', 'resolutionHours'], searchKeys: ['name'] },
    form: {
      title: 'SLA POLICY',
      sections: [{ title: 'Policy', columns: 2, fields: ['name', 'teamId', 'priority', 'responseHours', 'resolutionHours'] }],
    },
  },
}
