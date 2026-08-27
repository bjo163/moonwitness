import type { ViewManifest } from '@moon/orm'

export const views: Record<string, ViewManifest> = {
  'product.template': {
    defaultView: 'table',
    accentColor: 'cyan',
    icon: 'Package',
    table: {
      columns: ['name', 'categoryId', 'type', 'listPrice', 'standardCost'],
      searchKeys: ['name'],
    },
    form: {
      title: 'PRODUCT CATALOG',
      sections: [
        { title: 'Product', columns: 2, fields: ['name', 'categoryId', 'type'] },
        { title: 'Pricing', columns: 2, fields: ['listPrice', 'standardCost'] },
        { title: 'Description', columns: 1, fields: ['description'] },
      ],
    },
  },

  'product.category': {
    defaultView: 'table',
    accentColor: 'cyan',
    icon: 'LayoutGrid',
    table: { columns: ['name', 'parentId'], searchKeys: ['name'] },
    form: {
      title: 'PRODUCT CATEGORY',
      sections: [{ title: 'Category', columns: 2, fields: ['name', 'parentId'] }],
    },
  },
}
