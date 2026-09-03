import type { ViewManifest } from '@moon/orm'

export const views: Record<string, ViewManifest> = {
  'geo.province': {
    defaultView: 'table',
    accentColor: 'yellow',
    icon: 'Map',
    table: {
      columns: ['name', 'kemendagriCode', 'lat', 'lng'],
      searchKeys: ['name', 'kemendagriCode'],
    },
    form: {
      title: 'PROVINCE / REGION',
      sections: [
        { title: 'Identity', columns: 2, fields: ['name', 'kemendagriCode'] },
        { title: 'Coordinates', columns: 2, fields: ['lat', 'lng'] },
      ],
    },
  },

  'geo.city': {
    defaultView: 'table',
    accentColor: 'yellow',
    icon: 'Building',
    table: {
      columns: ['name', 'provinceId', 'lat', 'lng'],
      searchKeys: ['name'],
    },
    form: {
      title: 'OBSERVATORY CITY',
      sections: [
        { title: 'City', columns: 2, fields: ['name', 'provinceId', 'kemendagriCode'] },
        { title: 'Coordinates', columns: 2, fields: ['lat', 'lng'] },
      ],
    },
  },
}
