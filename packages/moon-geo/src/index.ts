import GeoProvince from './models/geo-province.ts'
import GeoCity from './models/geo-city.ts'
import GeoDistrict from './models/geo-district.ts'
import GeoVillage from './models/geo-village.ts'
import GeoPostal from './models/geo-postal.ts'
import GeoHistory from './models/geo-history.ts'
import GeoSourceSnapshot from './models/geo-source-snapshot.ts'
import GeoCandidate from './models/geo-candidate.ts'

export { loadDemoData } from './demo-data.ts'
export { views } from './views.ts'
export {
  GeoProvince,
  GeoCity,
  GeoDistrict,
  GeoVillage,
  GeoPostal,
  GeoHistory,
  GeoSourceSnapshot,
  GeoCandidate
}

export * from './engine/watcher.ts'
export * from './engine/diff.ts'
export * from './engine/monitor.ts'

export default {
  name: 'geo',
  description: 'Indonesia-First Deep Geo-Graph, Official Source Watcher, and Administrative Reconciliation Engine',
  depends: ['base'],
  models: [
    GeoProvince,
    GeoCity,
    GeoDistrict,
    GeoVillage,
    GeoPostal,
    GeoHistory,
    GeoSourceSnapshot,
    GeoCandidate
  ]
}
