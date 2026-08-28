import GeoProvince from './models/geo-province.js'
import GeoCity from './models/geo-city.js'
import GeoDistrict from './models/geo-district.js'
import GeoVillage from './models/geo-village.js'
import GeoPostal from './models/geo-postal.js'
import GeoHistory from './models/geo-history.js'
import GeoSourceSnapshot from './models/geo-source-snapshot.js'
import GeoCandidate from './models/geo-candidate.js'

export { loadDemoData } from './demo-data.js'
export { views } from './views.js'
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

export * from './engine/watcher.js'
export * from './engine/diff.js'
export * from './engine/monitor.js'

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
