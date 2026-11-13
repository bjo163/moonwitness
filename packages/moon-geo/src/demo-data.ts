import { createCtx, getModel, SUPERUSER_ID, loadJsonSeed } from '@moon/orm'

export async function loadDemoData() {
  const Province = getModel('geo.province')
  const City = getModel('geo.city')
  const District = getModel('geo.district')

  if (!Province || !City) return

  const env = createCtx(SUPERUSER_ID, {}, getModel)

  const jsonSeed = loadJsonSeed<{
    provinces?: { kemendagriCode: string; name: string; islandGroup: string; timezone: string; lat: number; lng: number }[]
    cities?: { kemendagriCode: string; provinceCode: string; name: string; type: string; lat: number; lng: number }[]
    districts?: { kemendagriCode: string; cityCode: string; name: string; lat: number; lng: number }[]
  }>('geo')

  // ── Sample Key Provinces across Archipelago ──
  const provinceSeeds = jsonSeed?.provinces || [
    { kemendagriCode: '11', name: 'Aceh', islandGroup: 'sumatera', timezone: 'WIB', lat: 4.6951, lng: 96.7494 },
    { kemendagriCode: '12', name: 'Sumatera Utara', islandGroup: 'sumatera', timezone: 'WIB', lat: 2.1154, lng: 99.5451 },
    { kemendagriCode: '13', name: 'Sumatera Barat', islandGroup: 'sumatera', timezone: 'WIB', lat: -0.7399, lng: 100.8000 },
    { kemendagriCode: '31', name: 'DKI Jakarta', islandGroup: 'jawa', timezone: 'WIB', lat: -6.2088, lng: 106.8456 },
    { kemendagriCode: '32', name: 'Jawa Barat', islandGroup: 'jawa', timezone: 'WIB', lat: -6.9175, lng: 107.6191 },
    { kemendagriCode: '33', name: 'Jawa Tengah', islandGroup: 'jawa', timezone: 'WIB', lat: -7.1509, lng: 110.1402 },
    { kemendagriCode: '34', name: 'DI Yogyakarta', islandGroup: 'jawa', timezone: 'WIB', lat: -7.7956, lng: 110.3695 },
    { kemendagriCode: '35', name: 'Jawa Timur', islandGroup: 'jawa', timezone: 'WIB', lat: -7.5360, lng: 112.2384 },
    { kemendagriCode: '51', name: 'Bali', islandGroup: 'bali_nusa_tenggara', timezone: 'WITA', lat: -8.4095, lng: 115.1889 },
    { kemendagriCode: '64', name: 'Kalimantan Timur (IKN Nusantara)', islandGroup: 'kalimantan', timezone: 'WITA', lat: -0.5387, lng: 116.4194 },
    { kemendagriCode: '73', name: 'Sulawesi Selatan', islandGroup: 'sulawesi', timezone: 'WITA', lat: -3.6687, lng: 119.9740 },
    { kemendagriCode: '91', name: 'Papua', islandGroup: 'papua', timezone: 'WIT', lat: -4.2699, lng: 138.0804 }
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

  // ── Sample Observatory & Strategic Astronomical Cities ──
  const citySeeds = jsonSeed?.cities || [
    { kemendagriCode: '11.71', provinceCode: '11', name: 'Kota Banda Aceh (Pusat Rukyatul Hilal)', type: 'kota', lat: 5.5483, lng: 95.3238 },
    { kemendagriCode: '12.71', provinceCode: '12', name: 'Kota Medan (OIF UMSU Observatory)', type: 'kota', lat: 3.5952, lng: 98.6722 },
    { kemendagriCode: '13.71', provinceCode: '13', name: 'Kota Padang', type: 'kota', lat: -0.9471, lng: 100.4172 },
    { kemendagriCode: '31.74', provinceCode: '31', name: 'Kota Jakarta Selatan', type: 'kota', lat: -6.2615, lng: 106.8106 },
    { kemendagriCode: '31.71', provinceCode: '31', name: 'Kota Jakarta Pusat (Planetarium Jakarta)', type: 'kota', lat: -6.1865, lng: 106.8341 },
    { kemendagriCode: '32.73', provinceCode: '32', name: 'Kota Bandung (Observatorium Bosscha Lembang)', type: 'kota', lat: -6.8247, lng: 107.6174 },
    { kemendagriCode: '33.74', provinceCode: '33', name: 'Kota Semarang', type: 'kota', lat: -6.9666, lng: 110.4166 },
    { kemendagriCode: '34.71', provinceCode: '34', name: 'Kota Yogyakarta', type: 'kota', lat: -7.7956, lng: 110.3695 },
    { kemendagriCode: '35.78', provinceCode: '35', name: 'Kota Surabaya', type: 'kota', lat: -7.2575, lng: 112.7521 },
    { kemendagriCode: '35.79', provinceCode: '35', name: 'Kota Batu', type: 'kota', lat: -7.8671, lng: 112.5239 },
    { kemendagriCode: '51.71', provinceCode: '51', name: 'Kota Denpasar', type: 'kota', lat: -8.6705, lng: 115.2126 },
    { kemendagriCode: '64.72', provinceCode: '64', name: 'Kota Samarinda', type: 'kota', lat: -0.5022, lng: 117.1537 },
    { kemendagriCode: '73.71', provinceCode: '73', name: 'Kota Makassar (Observatorium Unismuh)', type: 'kota', lat: -5.1477, lng: 119.4327 },
    { kemendagriCode: '91.71', provinceCode: '91', name: 'Kota Jayapura', type: 'kota', lat: -2.5916, lng: 140.6690 }
  ]

  const cityIds: Record<string, number> = {}
  for (const c of citySeeds) {
    const rows = await City.fetch(City, env, [['kemendagriCode', '=', c.kemendagriCode]])
    if (!rows.length) {
      const row = await City.spawn(City, env, {
        kemendagriCode: c.kemendagriCode,
        provinceId: provIds[c.provinceCode] || undefined,
        name: c.name,
        type: c.type,
        lat: c.lat,
        lng: c.lng
      })
      cityIds[c.kemendagriCode] = row.id as number
    } else {
      cityIds[c.kemendagriCode] = rows[0].id as number
    }
  }

  // ── Sample Districts (Kecamatan) ──
  if (District) {
    const districtSeeds = jsonSeed?.districts || [
      { kemendagriCode: '32.73.01', cityCode: '32.73', name: 'Kecamatan Coblong (ITB Kampus)', lat: -6.8905, lng: 107.6105 },
      { kemendagriCode: '32.73.02', cityCode: '32.73', name: 'Kecamatan Sukasari', lat: -6.8675, lng: 107.5892 },
      { kemendagriCode: '31.71.01', cityCode: '31.71', name: 'Kecamatan Menteng (Taman Ismail Marzuki)', lat: -6.1963, lng: 106.8378 }
    ]

    for (const d of districtSeeds) {
      const cId = cityIds[d.cityCode]
      if (!cId) continue
      const dRows = await District.fetch(District, env, [['kemendagriCode', '=', d.kemendagriCode]])
      if (!dRows.length) {
        await District.spawn(District, env, {
          kemendagriCode: d.kemendagriCode,
          cityId: cId,
          name: d.name,
          lat: d.lat,
          lng: d.lng
        })
      }
    }
  }

  console.log(`[moon-geo] Demo data enriched: ${provinceSeeds.length} provinces, ${citySeeds.length} observatory cities, and key districts seeded`)
}
