import type { ViewManifest } from '@moon/orm'

export const views: Record<string, ViewManifest> = {
  'pj.project': {
    defaultView: 'table',
    accentColor: 'green',
    icon: 'FolderKanban',
    table: {
      columns: ['name', 'code', 'status', 'ownerId', 'startDate', 'endDate'],
      defaultSort: { field: 'createdAt', direction: 'desc' },
      searchKeys: ['name', 'code'],
    },
    form: {
      title: 'PROJECT PORTFOLIO',
      statusBar: { field: 'status' },
      sections: [
        { title: 'General', columns: 2, fields: ['name', 'code', 'ownerId', 'status'] },
        { title: 'Schedule', columns: 2, fields: ['startDate', 'endDate'] },
        { title: 'Description', columns: 1, fields: ['summary'] },
      ],
      chatter: true,
    },
  },

  'pj.task': {
    defaultView: 'kanban',
    accentColor: 'green',
    icon: 'ListChecks',
    kanban: {
      groupBy: 'stageId',
      titleField: 'title',
      subtitleField: 'projectId',
      priorityField: 'priority',
      dateField: 'dueDate',
      userField: 'assigneeId',
    },
    table: {
      columns: ['title', 'projectId', 'stageId', 'priority', 'assigneeId', 'dueDate', 'estimatedHours'],
      defaultSort: { field: 'createdAt', direction: 'desc' },
      searchKeys: ['title'],
    },
    form: {
      title: 'TASK MATRIX',
      statusBar: { field: 'stageId' },
      sections: [
        { title: 'Overview', columns: 2, fields: ['title', 'projectId', 'stageId', 'priority'] },
        { title: 'Assignment', columns: 2, fields: ['assigneeId', 'sprintId', 'milestoneId', 'ticketId'] },
        { title: 'Schedule', columns: 2, fields: ['dueDate', 'estimatedHours'] },
        { title: 'Specification', columns: 1, fields: ['description'] },
      ],
      chatter: true,
    },
  },

  'pj.stage': {
    defaultView: 'table',
    accentColor: 'green',
    icon: 'Columns3',
    table: {
      columns: ['name', 'sequence', 'projectId', 'fold', 'isClosing'],
      searchKeys: ['name'],
    },
    form: {
      title: 'PIPELINE STAGE',
      sections: [
        { title: 'Configuration', columns: 2, fields: ['name', 'sequence', 'projectId', 'fold', 'isClosing'] },
      ],
    },
  },

  'pj.sprint': {
    defaultView: 'table',
    accentColor: 'green',
    icon: 'Timer',
    table: {
      columns: ['name', 'projectId', 'status', 'startDate', 'endDate'],
      searchKeys: ['name'],
    },
    form: {
      title: 'SPRINT ITERATION',
      statusBar: { field: 'status' },
      sections: [
        { title: 'Sprint', columns: 2, fields: ['name', 'projectId', 'status'] },
        { title: 'Schedule', columns: 2, fields: ['startDate', 'endDate'] },
      ],
    },
  },

  'pj.milestone': {
    defaultView: 'table',
    accentColor: 'green',
    icon: 'Flag',
    table: {
      columns: ['name', 'projectId', 'deadline'],
      searchKeys: ['name'],
    },
    form: {
      title: 'MILESTONE',
      sections: [
        { title: 'Details', columns: 2, fields: ['name', 'projectId', 'deadline'] },
      ],
    },
  },
}
