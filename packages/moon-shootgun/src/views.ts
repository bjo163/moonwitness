import type { ViewManifest } from '@moon/orm'

export const views: Record<string, ViewManifest> = {
  'sg.operation': {
    defaultView: 'table',
    accentColor: 'pink',
    icon: 'Crosshair',
    table: {
      columns: ['name', 'type', 'status', 'scriptureRef', 'createdAt'],
      defaultSort: { field: 'createdAt', direction: 'desc' },
      searchKeys: ['name'],
    },
    form: {
      title: 'OPERATION RECORD',
      sections: [
        { title: 'Operation', columns: 2, fields: ['name', 'type', 'status', 'scriptureRef'] },
        { title: 'Details', columns: 1, fields: ['description'] },
      ],
    },
  },
}
