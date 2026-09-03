import type { ViewManifest } from '@moon/orm'

export const views: Record<string, ViewManifest> = {
  'kh.conversation': {
    defaultView: 'table',
    accentColor: 'purple',
    icon: 'BrainCircuit',
    table: {
      columns: ['title', 'userId', 'sessionId', 'createdAt'],
      defaultSort: { field: 'createdAt', direction: 'desc' },
      searchKeys: ['title'],
    },
    form: {
      title: 'AI DIALOGUE LOG',
      sections: [
        { title: 'Conversation', columns: 2, fields: ['title', 'userId', 'sessionId'] },
      ],
    },
  },

  'ir.automation': {
    defaultView: 'table',
    accentColor: 'purple',
    icon: 'Zap',
    table: {
      columns: ['name', 'model', 'trigger', 'actionType', 'active'],
      defaultSort: { field: 'name', direction: 'asc' },
      searchKeys: ['name', 'model'],
    },
    kanban: {
      groupBy: 'trigger',
      titleField: 'name',
      subtitleField: 'model',
    },
    form: {
      title: 'AUTOMATION RULE CONFIGURATION',
      sections: [
        { title: 'Trigger Rule', columns: 2, fields: ['name', 'model', 'trigger', 'active'] },
        { title: 'Filter Criteria', columns: 1, fields: ['domain'] },
        { title: 'Action Target', columns: 2, fields: ['actionType', 'actionData'] },
      ],
      chatter: true,
    },
  },

  'ir.webhook': {
    defaultView: 'table',
    accentColor: 'purple',
    icon: 'Globe',
    table: {
      columns: ['name', 'url', 'eventTrigger', 'active'],
      defaultSort: { field: 'name', direction: 'asc' },
      searchKeys: ['name', 'url'],
    },
    form: {
      title: 'OUTBOUND WEBHOOK GATEWAY',
      sections: [
        { title: 'Endpoint Destination', columns: 2, fields: ['name', 'url', 'eventTrigger', 'active'] },
        { title: 'Security & Headers', columns: 1, fields: ['secretKey', 'headers'] },
      ],
    },
  },

  'ir.webhook.log': {
    defaultView: 'table',
    accentColor: 'purple',
    icon: 'Activity',
    table: {
      columns: ['webhookId', 'event', 'status', 'responseCode', 'durationMs'],
      defaultSort: { field: 'id', direction: 'desc' },
      searchKeys: ['event', 'error'],
    },
    form: {
      title: 'WEBHOOK DISPATCH AUDIT LOG',
      sections: [
        { title: 'Delivery Telemetry', columns: 2, fields: ['webhookId', 'event', 'status', 'responseCode', 'durationMs'] },
        { title: 'Payload & Diagnostic Trace', columns: 1, fields: ['payload', 'responseBody', 'error'] },
      ],
    },
  },
}
