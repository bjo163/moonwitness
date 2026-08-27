import type { ViewManifest } from '@moon/orm'

export const views: Record<string, ViewManifest> = {
  'geo.province': {
    defaultView: 'table',
    accentColor: 'yellow',
    icon: 'Map',
    table: {
      columns: ['name', 'code', 'latitude', 'longitude'],
      searchKeys: ['name', 'code'],
    },
    form: {
      title: 'PROVINCE / REGION',
      sections: [
        { title: 'Identity', columns: 2, fields: ['name', 'code'] },
        { title: 'Coordinates', columns: 2, fields: ['latitude', 'longitude'] },
      ],
    },
  },

  'geo.city': {
    defaultView: 'table',
    accentColor: 'yellow',
    icon: 'Building',
    table: {
      columns: ['name', 'provinceId', 'latitude', 'longitude'],
      searchKeys: ['name'],
    },
    form: {
      title: 'OBSERVATORY CITY',
      sections: [
        { title: 'City', columns: 2, fields: ['name', 'provinceId'] },
        { title: 'Coordinates', columns: 2, fields: ['latitude', 'longitude'] },
      ],
    },
  },
}
