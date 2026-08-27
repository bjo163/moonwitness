import { createCtx, getModel, SUPERUSER_ID } from '@moon/orm'

export async function loadDemoData() {
  const Province = getModel('geo.province')
  const City = getModel('geo.city')

  if (!Province || !City) return

  const env = createCtx(SUPERUSER_ID, {}, getModel)

  // ── Sample Key Provinces ──
  const provinceSeeds = [
    { kemendagriCode: '31', name: 'DKI Jakarta', islandGroup: 'jawa', timezone: 'WIB', lat: -6.2088, lng: 106.8456 },
    { kemendagriCode: '32', name: 'Jawa Barat', islandGroup: 'jawa', timezone: 'WIB', lat: -6.9175, lng: 107.6191 },
    { kemendagriCode: '33', name: 'Jawa Tengah', islandGroup: 'jawa', timezone: 'WIB', lat: -7.1509, lng: 110.1402 },
    { kemendagriCode: '34', name: 'DI Yogyakarta', islandGroup: 'jawa', timezone: 'WIB', lat: -7.7956, lng: 110.3695 },
    { kemendagriCode: '35', name: 'Jawa Timur', islandGroup: 'jawa', timezone: 'WIB', lat: -7.5360, lng: 112.2384 }
  ]

  const provIds: Record<string, number> = {}
  for (const p of provinceSeeds) {
    const rows = await Province.fetch(Province, env, [['kemendagriCode', '=', p.kemendagriCode]])
    if (!rows.length) {
      const row = await Province.spawn(Province, env, p)
      provIds[p.kemendagriCode] = row.id as number
    } else {
      provIds[p.kemendagriCode] = rows[0].id as number
    }
  }

  // ── Sample Cities / Observatories ──
  const citySeeds = [
    { kemendagriCode: '31.74', provinceCode: '31', name: 'Kota Jakarta Selatan', type: 'kota', lat: -6.2615, lng: 106.8106 },
    { kemendagriCode: '32.73', provinceCode: '32', name: 'Kota Bandung (Observatorium Bosscha)', type: 'kota', lat: -6.8247, lng: 107.6174 },
    { kemendagriCode: '33.74', provinceCode: '33', name: 'Kota Semarang', type: 'kota', lat: -6.9666, lng: 110.4166 },
    { kemendagriCode: '34.71', provinceCode: '34', name: 'Kota Yogyakarta', type: 'kota', lat: -7.7956, lng: 110.3695 },
    { kemendagriCode: '35.78', provinceCode: '35', name: 'Kota Surabaya', type: 'kota', lat: -7.2575, lng: 112.7521 }
  ]

  for (const c of citySeeds) {
    const rows = await City.fetch(City, env, [['kemendagriCode', '=', c.kemendagriCode]])
    if (!rows.length) {
      await City.spawn(City, env, {
        kemendagriCode: c.kemendagriCode,
        provinceId: provIds[c.provinceCode] || undefined,
        name: c.name,
        type: c.type,
        lat: c.lat,
        lng: c.lng
      })
    }
  }

  console.log('[moon-geo] Demo data loaded: 5 key provinces, 5 observatory cities')
}
