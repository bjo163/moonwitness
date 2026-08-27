import type { ViewManifest } from '@moon/orm'

export const views: Record<string, ViewManifest> = {
  'crm.lead': {
    defaultView: 'kanban',
    accentColor: 'green',
    icon: 'Handshake',
    kanban: {
      groupBy: 'stageId',
      titleField: 'name',
      subtitleField: 'partnerId',
      userField: 'userId',
    },
    table: {
      columns: ['name', 'stageId', 'partnerId', 'userId', 'teamId', 'expectedRevenue', 'probability', 'type'],
      defaultSort: { field: 'createdAt', direction: 'desc' },
      searchKeys: ['name', 'email'],
    },
    form: {
      title: 'PARTNERSHIP LEAD',
      statusBar: { field: 'stageId' },
      sections: [
        { title: 'Lead', columns: 2, fields: ['name', 'type', 'partnerId', 'companyId'] },
        { title: 'Contact', columns: 2, fields: ['email', 'phone'] },
        { title: 'Pipeline', columns: 2, fields: ['stageId', 'userId', 'teamId'] },
        { title: 'Forecast', columns: 2, fields: ['expectedRevenue', 'probability'] },
      ],
      chatter: true,
    },
  },

  'crm.stage': {
    defaultView: 'table',
    accentColor: 'green',
    icon: 'Columns3',
    table: { columns: ['name', 'sequence'], searchKeys: ['name'] },
    form: {
      title: 'PIPELINE STAGE',
      sections: [{ title: 'Configuration', columns: 2, fields: ['name', 'sequence'] }],
    },
  },

  'crm.team': {
    defaultView: 'table',
    accentColor: 'green',
    icon: 'Users',
    table: { columns: ['name', 'leaderId'], searchKeys: ['name'] },
    form: {
      title: 'OUTREACH TEAM',
      sections: [{ title: 'Team', columns: 2, fields: ['name', 'leaderId'] }],
    },
  },
}
