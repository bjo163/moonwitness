import type { ViewManifest } from '@moon/orm'

export const views: Record<string, ViewManifest> = {
  'px.request': {
    defaultView: 'table',
    accentColor: 'purple',
    icon: 'Activity',
    table: {
      columns: ['method', 'path', 'statusCode', 'latencyMs', 'timestamp'],
      defaultSort: { field: 'timestamp', direction: 'desc' },
      searchKeys: ['path', 'method'],
    },
    metrics: {
      groupBy: 'statusCode',
      aggregateField: 'latencyMs',
    },
    form: {
      title: 'REQUEST TELEMETRY',
      sections: [
        { title: 'Request', columns: 2, fields: ['method', 'path', 'statusCode', 'latencyMs'] },
        { title: 'Timing', columns: 2, fields: ['timestamp', 'userId'] },
      ],
    },
  },

  'px.query': {
    defaultView: 'table',
    accentColor: 'purple',
    icon: 'Database',
    table: {
      columns: ['query', 'durationMs', 'isSlow', 'timestamp'],
      defaultSort: { field: 'timestamp', direction: 'desc' },
      searchKeys: ['query'],
    },
    form: {
      title: 'QUERY BENCHMARK',
      sections: [
        { title: 'Query', columns: 2, fields: ['query', 'durationMs', 'isSlow'] },
        { title: 'Context', columns: 2, fields: ['timestamp', 'model'] },
      ],
    },
  },

  'ir.dashboard.widget': {
    defaultView: 'table',
    accentColor: 'purple',
    icon: 'LayoutDashboard',
    table: {
      columns: ['name', 'widgetType', 'model', 'aggregation', 'accentColor', 'sequence', 'active'],
      defaultSort: { field: 'sequence', direction: 'asc' },
      searchKeys: ['name', 'model'],
    },
    kanban: {
      groupBy: 'widgetType',
      titleField: 'name',
      subtitleField: 'model',
    },
    form: {
      title: 'DASHBOARD WIDGET CONFIGURATION',
      sections: [
        { title: 'Widget Identity', columns: 2, fields: ['name', 'widgetType', 'model', 'sequence'] },
        { title: 'Data Aggregation & Visuals', columns: 2, fields: ['metricField', 'aggregation', 'accentColor', 'active'] },
      ],
    },
  },
}
