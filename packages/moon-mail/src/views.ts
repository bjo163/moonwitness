import type { ViewManifest } from '@moon/orm'

export const views: Record<string, ViewManifest> = {
  'mail.message': {
    defaultView: 'table',
    accentColor: 'cyan',
    icon: 'MessageSquare',
    table: {
      columns: ['resModel', 'resId', 'messageType', 'authorId', 'createdAt'],
      defaultSort: { field: 'createdAt', direction: 'desc' },
      searchKeys: ['body', 'resModel'],
    },
    form: {
      title: 'CHATTER MESSAGE',
      sections: [
        { title: 'Message', columns: 2, fields: ['resModel', 'resId', 'messageType', 'authorId'] },
        { title: 'Content', columns: 1, fields: ['body'] },
      ],
    },
  },

  'mail.activity': {
    defaultView: 'table',
    accentColor: 'cyan',
    icon: 'CalendarCheck',
    table: {
      columns: ['resModel', 'resId', 'activityTypeId', 'userId', 'dateDeadline', 'state'],
      defaultSort: { field: 'dateDeadline', direction: 'asc' },
      searchKeys: ['summary'],
    },
    form: {
      title: 'SCHEDULED ACTIVITY',
      sections: [
        { title: 'Activity', columns: 2, fields: ['activityTypeId', 'userId', 'dateDeadline', 'state'] },
        { title: 'Reference', columns: 2, fields: ['resModel', 'resId'] },
        { title: 'Notes', columns: 1, fields: ['summary', 'note'] },
      ],
    },
  },
}
