import type { ViewManifest } from '@moon/orm'

export const views: Record<string, ViewManifest> = {
  'account.account': {
    defaultView: 'table',
    accentColor: 'cyan',
    icon: 'BookText',
    table: {
      columns: ['code', 'name', 'type', 'reconcile'],
      searchKeys: ['code', 'name'],
    },
    form: {
      title: 'CHART OF ACCOUNTS',
      sections: [
        { title: 'Account', columns: 2, fields: ['code', 'name', 'type', 'reconcile'] },
      ],
    },
  },

  'account.journal': {
    defaultView: 'table',
    accentColor: 'cyan',
    icon: 'Receipt',
    table: { columns: ['name', 'code', 'type'], searchKeys: ['name', 'code'] },
    form: {
      title: 'FINANCIAL JOURNAL',
      sections: [{ title: 'Journal', columns: 2, fields: ['name', 'code', 'type'] }],
    },
  },

  'account.move': {
    defaultView: 'table',
    accentColor: 'cyan',
    icon: 'FileSpreadsheet',
    table: {
      columns: ['name', 'journalId', 'date', 'status', 'amount'],
      defaultSort: { field: 'date', direction: 'desc' },
      searchKeys: ['name'],
    },
    form: {
      title: 'JOURNAL ENTRY',
      statusBar: { field: 'status' },
      sections: [
        { title: 'Entry', columns: 2, fields: ['name', 'journalId', 'date', 'status'] },
        { title: 'Amount', columns: 2, fields: ['amount', 'ref'] },
      ],
    },
  },
}
