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
    table: { columns: ['name', 'type', 'warehouseId', 'parentId'], searchKeys: ['name'] },
    form: {
      title: 'STORAGE LOCATION',
      sections: [{ title: 'Location', columns: 2, fields: ['name', 'type', 'warehouseId', 'parentId'] }],
    },
  },

  'stock.move': {
    defaultView: 'table',
    accentColor: 'cyan',
    icon: 'ArrowRightLeft',
    table: {
      columns: ['reference', 'productId', 'quantity', 'sourceLocationId', 'destinationLocationId', 'status'],
      defaultSort: { field: 'createdAt', direction: 'desc' },
      searchKeys: ['reference'],
    },
    form: {
      title: 'INVENTORY MOVE',
      statusBar: { field: 'status' },
      sections: [
        { title: 'Move', columns: 2, fields: ['reference', 'productId', 'quantity', 'uom'] },
        { title: 'Locations', columns: 2, fields: ['sourceLocationId', 'destinationLocationId'] },
        { title: 'Status', columns: 2, fields: ['status', 'pickingId'] },
      ],
    },
  },
}
