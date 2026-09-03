import type { ViewManifest } from '@moon/orm'

export const views: Record<string, ViewManifest> = {
  'stock.warehouse': {
    defaultView: 'table',
    accentColor: 'cyan',
    icon: 'Warehouse',
    table: { columns: ['name', 'code', 'companyId'], searchKeys: ['name', 'code'] },
    form: {
      title: 'WAREHOUSE',
      sections: [{ title: 'Warehouse', columns: 2, fields: ['name', 'code', 'companyId'] }],
    },
  },

  'stock.location': {
    defaultView: 'table',
    accentColor: 'cyan',
    icon: 'MapPin',
    table: { columns: ['name', 'usage', 'locationId', 'companyId'], searchKeys: ['name'] },
    form: {
      title: 'STORAGE LOCATION',
      sections: [{ title: 'Location', columns: 2, fields: ['name', 'usage', 'locationId', 'companyId'] }],
    },
  },

  'stock.move': {
    defaultView: 'table',
    accentColor: 'cyan',
    icon: 'ArrowRightLeft',
    table: {
      columns: ['name', 'productId', 'productUomQty', 'locationId', 'locationDestId', 'state'],
      defaultSort: { field: 'createdAt', direction: 'desc' },
      searchKeys: ['name'],
    },
    form: {
      title: 'INVENTORY MOVE',
      statusBar: { field: 'state' },
      sections: [
        { title: 'Move', columns: 2, fields: ['name', 'productId', 'productUomQty', 'companyId'] },
        { title: 'Locations', columns: 2, fields: ['locationId', 'locationDestId'] },
        { title: 'Status', columns: 2, fields: ['state', 'pickingId'] },
      ],
    },
  },
}
