import type { ViewManifest } from '@moon/orm'

export const views: Record<string, ViewManifest> = {
  'mz.case': {
    defaultView: 'table',
    accentColor: 'purple',
    icon: 'Scale',
    table: {
      columns: ['title', 'status', 'subjectAlias', 'subjectAge', 'createdAt'],
      defaultSort: { field: 'createdAt', direction: 'desc' },
      searchKeys: ['title'],
    },
    form: {
      title: 'ETHICAL ASSESSMENT CASE',
      statusBar: { field: 'status' },
      sections: [
        { title: 'Case', columns: 2, fields: ['title', 'status', 'subjectAlias', 'subjectAge'] },
        { title: 'Details', columns: 1, fields: ['caseText'] },
      ],
      chatter: true,
    },
  },

  'mz.assessment': {
    defaultView: 'table',
    accentColor: 'purple',
    icon: 'ClipboardCheck',
    table: {
      columns: ['caseId', 'method', 'totalWeight', 'confidence', 'isFinalized'],
      searchKeys: ['action', 'limitation'],
    },
    form: {
      title: 'ASSESSMENT RESULT',
      sections: [
        { title: 'Assessment', columns: 2, fields: ['caseId', 'method', 'totalWeight', 'confidence', 'isFinalized'] },
        { title: 'Results', columns: 1, fields: ['rightResult', 'leftResult', 'action', 'limitation'] },
      ],
    },
  },
}
