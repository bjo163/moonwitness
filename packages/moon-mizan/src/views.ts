import type { ViewManifest } from '@moon/orm'

export const views: Record<string, ViewManifest> = {
  'mz.case': {
    defaultView: 'table',
    accentColor: 'purple',
    icon: 'Scale',
    table: {
      columns: ['title', 'status', 'method', 'authorId', 'createdAt'],
      defaultSort: { field: 'createdAt', direction: 'desc' },
      searchKeys: ['title'],
    },
    form: {
      title: 'ETHICAL ASSESSMENT CASE',
      statusBar: { field: 'status' },
      sections: [
        { title: 'Case', columns: 2, fields: ['title', 'status', 'method', 'authorId'] },
        { title: 'Details', columns: 1, fields: ['description'] },
      ],
      chatter: true,
    },
  },

  'mz.assessment': {
    defaultView: 'table',
    accentColor: 'purple',
    icon: 'ClipboardCheck',
    table: {
      columns: ['caseId', 'filterId', 'score', 'verdict'],
      searchKeys: ['verdict'],
    },
    form: {
      title: 'ASSESSMENT RESULT',
      sections: [
        { title: 'Assessment', columns: 2, fields: ['caseId', 'filterId', 'score', 'verdict'] },
        { title: 'Reasoning', columns: 1, fields: ['reasoning'] },
      ],
    },
  },
}
