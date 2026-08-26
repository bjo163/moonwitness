import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const dataDir = 'x:/REPO/moonwitness/packages/moon-geo/src/data'
mkdirSync(dataDir, { recursive: true })

const provinces = [
  // Sumatera (10)
  { kemendagriCode: '11', bpsCode: '11', isoCode: 'ID-AC', name: 'Aceh', islandGroup: 'sumatera', timezone: 'WIB', lat: 4.6951, lng: 96.7494 },
  { kemendagriCode: '12', bpsCode: '12', isoCode: 'ID-SU', name: 'Sumatera Utara', islandGroup: 'sumatera', timezone: 'WIB', lat: 2.1154, lng: 99.5451 },
  { kemendagriCode: '13', bpsCode: '13', isoCode: 'ID-SB', name: 'Sumatera Barat', islandGroup: 'sumatera', timezone: 'WIB', lat: -0.7399, lng: 100.8000 },
  { kemendagriCode: '14', bpsCode: '14', isoCode: 'ID-RI', name: 'Riau', islandGroup: 'sumatera', timezone: 'WIB', lat: 0.2933, lng: 101.7068 },
  { kemendagriCode: '15', bpsCode: '15', isoCode: 'ID-JA', name: 'Jambi', islandGroup: 'sumatera', timezone: 'WIB', lat: -1.4852, lng: 102.4381 },
  { kemendagriCode: '16', bpsCode: '16', isoCode: 'ID-SS', name: 'Sumatera Selatan', islandGroup: 'sumatera', timezone: 'WIB', lat: -3.3194, lng: 104.9144 },
  { kemendagriCode: '17', bpsCode: '17', isoCode: 'ID-BE', name: 'Bengkulu', islandGroup: 'sumatera', timezone: 'WIB', lat: -3.5778, lng: 102.3464 },
  { kemendagriCode: '18', bpsCode: '18', isoCode: 'ID-LA', name: 'Lampung', islandGroup: 'sumatera', timezone: 'WIB', lat: -4.5586, lng: 105.4068 },
  { kemendagriCode: '19', bpsCode: '19', isoCode: 'ID-BB', name: 'Kepulauan Bangka Belitung', islandGroup: 'sumatera', timezone: 'WIB', lat: -2.7411, lng: 106.4406 },
  { kemendagriCode: '21', bpsCode: '21', isoCode: 'ID-KR', name: 'Kepulauan Riau', islandGroup: 'sumatera', timezone: 'WIB', lat: 3.9457, lng: 108.1429 },

  // Jawa (6)
  { kemendagriCode: '31', bpsCode: '31', isoCode: 'ID-JK', name: 'DKI Jakarta', islandGroup: 'jawa', timezone: 'WIB', lat: -6.2088, lng: 106.8456 },
  { kemendagriCode: '32', bpsCode: '32', isoCode: 'ID-JB', name: 'Jawa Barat', islandGroup: 'jawa', timezone: 'WIB', lat: -6.9175, lng: 107.6191 },
  { kemendagriCode: '33', bpsCode: '33', isoCode: 'ID-JT', name: 'Jawa Tengah', islandGroup: 'jawa', timezone: 'WIB', lat: -7.1510, lng: 110.1403 },
  { kemendagriCode: '34', bpsCode: '34', isoCode: 'ID-YO', name: 'DI Yogyakarta', islandGroup: 'jawa', timezone: 'WIB', lat: -7.7956, lng: 110.3695 },
  { kemendagriCode: '35', bpsCode: '35', isoCode: 'ID-JI', name: 'Jawa Timur', islandGroup: 'jawa', timezone: 'WIB', lat: -7.5361, lng: 112.2384 },
  { kemendagriCode: '36', bpsCode: '36', isoCode: 'ID-BT', name: 'Banten', islandGroup: 'jawa', timezone: 'WIB', lat: -6.4058, lng: 106.0640 },

  // Bali & Nusa Tenggara (3)
  { kemendagriCode: '51', bpsCode: '51', isoCode: 'ID-BA', name: 'Bali', islandGroup: 'bali_nusa_tenggara', timezone: 'WITA', lat: -8.4095, lng: 115.1889 },
  { kemendagriCode: '52', bpsCode: '52', isoCode: 'ID-NB', name: 'Nusa Tenggara Barat', islandGroup: 'bali_nusa_tenggara', timezone: 'WITA', lat: -8.6529, lng: 117.3616 },
  { kemendagriCode: '53', bpsCode: '53', isoCode: 'ID-NT', name: 'Nusa Tenggara Timur', islandGroup: 'bali_nusa_tenggara', timezone: 'WITA', lat: -8.6574, lng: 121.0794 },

  // Kalimantan (5)
  { kemendagriCode: '61', bpsCode: '61', isoCode: 'ID-KB', name: 'Kalimantan Barat', islandGroup: 'kalimantan', timezone: 'WIB', lat: -0.2787, lng: 111.4753 },
  { kemendagriCode: '62', bpsCode: '62', isoCode: 'ID-KT', name: 'Kalimantan Tengah', islandGroup: 'kalimantan', timezone: 'WIB', lat: -1.6815, lng: 113.3824 },
  { kemendagriCode: '63', bpsCode: '63', isoCode: 'ID-KS', name: 'Kalimantan Selatan', islandGroup: 'kalimantan', timezone: 'WITA', lat: -3.0926, lng: 115.2838 },
  { kemendagriCode: '64', bpsCode: '64', isoCode: 'ID-KI', name: 'Kalimantan Timur', islandGroup: 'kalimantan', timezone: 'WITA', lat: 0.5387, lng: 116.4194 },
  { kemendagriCode: '65', bpsCode: '65', isoCode: 'ID-KU', name: 'Kalimantan Utara', islandGroup: 'kalimantan', timezone: 'WITA', lat: 2.7259, lng: 116.9110 },

  // Sulawesi (6)
  { kemendagriCode: '71', bpsCode: '71', isoCode: 'ID-SA', name: 'Sulawesi Utara', islandGroup: 'sulawesi', timezone: 'WITA', lat: 0.6247, lng: 123.9750 },
  { kemendagriCode: '72', bpsCode: '72', isoCode: 'ID-ST', name: 'Sulawesi Tengah', islandGroup: 'sulawesi', timezone: 'WITA', lat: -1.4300, lng: 121.4456 },
  { kemendagriCode: '73', bpsCode: '73', isoCode: 'ID-SN', name: 'Sulawesi Selatan', islandGroup: 'sulawesi', timezone: 'WITA', lat: -3.6687, lng: 119.9741 },
  { kemendagriCode: '74', bpsCode: '74', isoCode: 'ID-SG', name: 'Sulawesi Tenggara', islandGroup: 'sulawesi', timezone: 'WITA', lat: -4.1449, lng: 122.1746 },
  { kemendagriCode: '75', bpsCode: '75', isoCode: 'ID-GO', name: 'Gorontalo', islandGroup: 'sulawesi', timezone: 'WITA', lat: 0.6999, lng: 122.4467 },
  { kemendagriCode: '76', bpsCode: '76', isoCode: 'ID-SR', name: 'Sulawesi Barat', islandGroup: 'sulawesi', timezone: 'WITA', lat: -2.8441, lng: 119.2321 },

  // Maluku (2)
  { kemendagriCode: '81', bpsCode: '81', isoCode: 'ID-MA', name: 'Maluku', islandGroup: 'maluku', timezone: 'WIT', lat: -3.2385, lng: 130.1453 },
  { kemendagriCode: '82', bpsCode: '82', isoCode: 'ID-MU', name: 'Maluku Utara', islandGroup: 'maluku', timezone: 'WIT', lat: 1.5709, lng: 127.8088 },

  // Papua (6 - includes 4 new provinces formed in 2022)
  { kemendagriCode: '91', bpsCode: '91', isoCode: 'ID-PA', name: 'Papua', islandGroup: 'papua', timezone: 'WIT', lat: -4.2699, lng: 138.0804 },
  { kemendagriCode: '92', bpsCode: '92', isoCode: 'ID-PB', name: 'Papua Barat', islandGroup: 'papua', timezone: 'WIT', lat: -1.3361, lng: 133.1747 },
  { kemendagriCode: '93', bpsCode: '93', isoCode: 'ID-PS', name: 'Papua Selatan', islandGroup: 'papua', timezone: 'WIT', lat: -7.5000, lng: 139.5000 },
  { kemendagriCode: '94', bpsCode: '94', isoCode: 'ID-PT', name: 'Papua Tengah', islandGroup: 'papua', timezone: 'WIT', lat: -3.5000, lng: 136.5000 },
  { kemendagriCode: '95', bpsCode: '95', isoCode: 'ID-PE', name: 'Papua Pegunungan', islandGroup: 'papua', timezone: 'WIT', lat: -4.0000, lng: 139.0000 },
  { kemendagriCode: '96', bpsCode: '96', isoCode: 'ID-PD', name: 'Papua Barat Daya', islandGroup: 'papua', timezone: 'WIT', lat: -1.0000, lng: 131.5000 }
]

const cities = [
  // DKI Jakarta
  { kemendagriCode: '31.71', bpsCode: '3171', name: 'Kota Jakarta Pusat', type: 'kota', provinceCode: '31' },
  { kemendagriCode: '31.72', bpsCode: '3172', name: 'Kota Jakarta Utara', type: 'kota', provinceCode: '31' },
  { kemendagriCode: '31.73', bpsCode: '3173', name: 'Kota Jakarta Barat', type: 'kota', provinceCode: '31' },
  { kemendagriCode: '31.74', bpsCode: '3174', name: 'Kota Jakarta Selatan', type: 'kota', provinceCode: '31' },
  { kemendagriCode: '31.75', bpsCode: '3175', name: 'Kota Jakarta Timur', type: 'kota', provinceCode: '31' },
  { kemendagriCode: '31.01', bpsCode: '3101', name: 'Kabupaten Kepulauan Seribu', type: 'kabupaten', provinceCode: '31' },

  // Jawa Barat
  { kemendagriCode: '32.73', bpsCode: '3273', name: 'Kota Bandung', type: 'kota', provinceCode: '32' },
  { kemendagriCode: '32.71', bpsCode: '3271', name: 'Kota Bogor', type: 'kota', provinceCode: '32' },
  { kemendagriCode: '32.76', bpsCode: '3276', name: 'Kota Depok', type: 'kota', provinceCode: '32' },
  { kemendagriCode: '32.75', bpsCode: '3275', name: 'Kota Bekasi', type: 'kota', provinceCode: '32' },
  { kemendagriCode: '32.04', bpsCode: '3204', name: 'Kabupaten Bandung', type: 'kabupaten', provinceCode: '32' },
  { kemendagriCode: '32.01', bpsCode: '3201', name: 'Kabupaten Bogor', type: 'kabupaten', provinceCode: '32' },

  // Jawa Timur
  { kemendagriCode: '35.78', bpsCode: '3578', name: 'Kota Surabaya', type: 'kota', provinceCode: '35' },
  { kemendagriCode: '35.73', bpsCode: '3573', name: 'Kota Malang', type: 'kota', provinceCode: '35' },

  // Bali
  { kemendagriCode: '51.71', bpsCode: '5171', name: 'Kota Denpasar', type: 'kota', provinceCode: '51' },
  { kemendagriCode: '51.03', bpsCode: '5103', name: 'Kabupaten Badung', type: 'kabupaten', provinceCode: '51' },

  // Papua Barat Daya
  { kemendagriCode: '96.71', bpsCode: '9671', name: 'Kota Sorong', type: 'kota', provinceCode: '96' },
  { kemendagriCode: '96.01', bpsCode: '9601', name: 'Kabupaten Sorong', type: 'kabupaten', provinceCode: '96' }
]

const sampleDistricts = [
  { kemendagriCode: '32.73.01', name: 'Sukasari', cityCode: '32.73' },
  { kemendagriCode: '32.73.02', name: 'Coblong', cityCode: '32.73' },
  { kemendagriCode: '32.73.03', name: 'Babakan Ciparay', cityCode: '32.73' }
]

const sampleVillages = [
  { kemendagriCode: '32.73.02.1001', name: 'Dago', type: 'kelurahan', districtCode: '32.73.02', postalCode: '40135' },
  { kemendagriCode: '32.73.02.1002', name: 'Sadang Serang', type: 'kelurahan', districtCode: '32.73.02', postalCode: '40133' },
  { kemendagriCode: '32.73.02.1003', name: 'Sekeloa', type: 'kelurahan', districtCode: '32.73.02', postalCode: '40134' }
]

const dataset = {
  version: '2026.1',
  generatedAt: new Date().toISOString(),
  provinces,
  cities,
  sampleDistricts,
  sampleVillages
}

writeFileSync(join(dataDir, 'indonesia-hierarchy.json'), JSON.stringify(dataset, null, 2) + '\n', 'utf8')
console.log(`Generated Indonesia hierarchy: ${provinces.length} provinces, ${cities.length} cities.`)
