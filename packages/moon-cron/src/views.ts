import type { ViewManifest } from '@moon/orm'

export const views: Record<string, ViewManifest> = {
  'ir.cron': {
    defaultView: 'table',
    accentColor: 'yellow',
    icon: 'Clock',
    table: {
      columns: ['name', 'model', 'intervalNumber', 'intervalType', 'nextCall', 'active', 'priority'],
      defaultSort: { field: 'nextCall', direction: 'asc' },
      searchKeys: ['name', 'model', 'method'],
    },
    form: {
      title: 'SCHEDULED CRON ACTION',
      sections: [
        { title: 'Task Definition', columns: 2, fields: ['name', 'model', 'method', 'priority'] },
        { title: 'Interval & Trigger', columns: 2, fields: ['intervalNumber', 'intervalType', 'nextCall', 'active'] },
        { title: 'Execution Stats', columns: 2, fields: ['lastCall', 'runCount', 'numberCall'] },
        { title: 'Parameters', columns: 1, fields: ['args'] },
      ],
      chatter: true,
    },
  },

  'ir.cron.log': {
    defaultView: 'table',
    accentColor: 'yellow',
    icon: 'Activity',
    table: {
      columns: ['cronId', 'status', 'durationMs', 'executedAt', 'message'],
      defaultSort: { field: 'executedAt', direction: 'desc' },
      searchKeys: ['message', 'error'],
    },
    form: {
      title: 'CRON EXECUTION LOG',
      sections: [
        { title: 'Execution Details', columns: 2, fields: ['cronId', 'status', 'durationMs', 'executedAt'] },
        { title: 'Diagnostic Output', columns: 1, fields: ['message', 'error'] },
      ],
    },
  },

  'ir.queue.job': {
    defaultView: 'table',
    accentColor: 'yellow',
    icon: 'Layers',
    table: {
      columns: ['name', 'queueName', 'status', 'priority', 'progress', 'attempts', 'nextRunAt', 'durationMs'],
      defaultSort: { field: 'nextRunAt', direction: 'desc' },
      searchKeys: ['name', 'queueName', 'error'],
    },
    kanban: {
      groupBy: 'status',
      titleField: 'name',
      subtitleField: 'queueName',
      priorityField: 'priority',
      dateField: 'nextRunAt',
    },
    form: {
      title: 'BACKGROUND QUEUE JOB',
      sections: [
        { title: 'Job Identity', columns: 2, fields: ['name', 'queueName', 'status', 'priority'] },
        { title: 'Execution Timing', columns: 2, fields: ['nextRunAt', 'startedAt', 'finishedAt', 'durationMs'] },
        { title: 'Retry Policy & Progress', columns: 2, fields: ['progress', 'attempts', 'maxAttempts', 'backoffMs'] },
        { title: 'Input Payload & Result', columns: 1, fields: ['payload', 'result', 'error'] },
      ],
    },
  },
}
