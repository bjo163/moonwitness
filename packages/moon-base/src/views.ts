import type { ViewManifest } from '@moon/orm'

export const views: Record<string, ViewManifest> = {
  'vx.user': {
    defaultView: 'table',
    accentColor: 'cyan',
    icon: 'UserCog',
    table: {
      columns: ['name', 'email', 'login', 'phone', 'level', 'isActive'],
      defaultSort: { field: 'name', direction: 'asc' },
      searchKeys: ['name', 'email', 'login', 'phone'],
    },
    form: {
      title: 'OPERATOR PROFILE',
      sections: [
        { title: 'Identity', columns: 2, fields: ['name', 'email', 'login'] },
        { title: 'Contact', columns: 2, fields: ['phone', 'avatarUrl'] },
        { title: 'Status & Level', columns: 2, fields: ['isActive', 'level', 'lastLogin'] },
        { title: 'Preferences', columns: 1, fields: ['preferences'] },
      ],
    },
  },

  'vx.node': {
    defaultView: 'table',
    accentColor: 'cyan',
    icon: 'Building2',
    table: {
      columns: ['name', 'email', 'phone', 'isCompany', 'parentId'],
      searchKeys: ['name', 'email'],
    },
    form: {
      title: 'ENTITY NODE',
      sections: [
        { title: 'Identity', columns: 2, fields: ['name', 'isCompany', 'parentId'] },
        { title: 'Contact', columns: 2, fields: ['email', 'phone', 'mobile'] },
        { title: 'Address', columns: 2, fields: ['street', 'city', 'zip', 'countryId'] },
      ],
    },
  },

  'vx.role': {
    defaultView: 'table',
    accentColor: 'cyan',
    icon: 'Shield',
    table: { columns: ['name', 'users'], searchKeys: ['name'] },
    form: {
      title: 'SECURITY ROLE',
      sections: [
        { title: 'Role', columns: 2, fields: ['name', 'users'] },
      ],
    },
  },

  'ir.report': {
    defaultView: 'table',
    accentColor: 'cyan',
    icon: 'FileText',
    table: {
      columns: ['name', 'model', 'reportType', 'orientation', 'active'],
      defaultSort: { field: 'name', direction: 'asc' },
      searchKeys: ['name', 'model'],
    },
    form: {
      title: 'REPORT TEMPLATE CONFIGURATION',
      sections: [
        { title: 'Document Identity', columns: 2, fields: ['name', 'model', 'reportType', 'orientation'] },
        { title: 'Styling & Content', columns: 2, fields: ['headerTitle', 'showQrCode', 'active'] },
        { title: 'Regulatory Footer', columns: 1, fields: ['footerNotice'] },
      ],
    },
  },

  'ir.version': {
    defaultView: 'table',
    accentColor: 'cyan',
    icon: 'History',
    table: {
      columns: ['resModel', 'resId', 'userId', 'summary', 'changedFields'],
      defaultSort: { field: 'id', direction: 'desc' },
      searchKeys: ['resModel', 'summary'],
    },
    form: {
      title: 'MUTATION VERSION AUDIT',
      sections: [
        { title: 'Record Target', columns: 2, fields: ['resModel', 'resId', 'userId', 'summary'] },
        { title: 'Field Modification Diff', columns: 1, fields: ['changedFields', 'oldValues', 'newValues'] },
      ],
    },
  },
}
