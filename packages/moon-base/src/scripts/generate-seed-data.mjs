import { writeFileSync, mkdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join } from 'node:path'

const dataDir = 'x:/REPO/moonwitness/packages/moon-base/src/data'
mkdirSync(dataDir, { recursive: true })

// 1. Countries (ISO 3166-1)
const countries = [
  { code: 'ID', code3: 'IDN', numberCode: '360', name: 'Indonesia', nativeName: 'Indonesia', continent: 'Asia', capital: 'Jakarta', dialCode: '+62', flagEmoji: '🇮🇩', currencyCode: 'IDR', lat: -0.7893, lng: 113.9213 },
  { code: 'SA', code3: 'SAU', numberCode: '682', name: 'Saudi Arabia', nativeName: 'المملكة العربية السعودية', continent: 'Asia', capital: 'Riyadh', dialCode: '+966', flagEmoji: '🇸🇦', currencyCode: 'SAR', lat: 23.8859, lng: 45.0792 },
  { code: 'MY', code3: 'MYS', numberCode: '458', name: 'Malaysia', nativeName: 'Malaysia', continent: 'Asia', capital: 'Kuala Lumpur', dialCode: '+60', flagEmoji: '🇲🇾', currencyCode: 'MYR', lat: 4.2105, lng: 101.9758 },
  { code: 'SG', code3: 'SGP', numberCode: '702', name: 'Singapore', nativeName: 'Singapore', continent: 'Asia', capital: 'Singapore', dialCode: '+65', flagEmoji: '🇸🇬', currencyCode: 'SGD', lat: 1.3521, lng: 103.8198 },
  { code: 'TR', code3: 'TUR', numberCode: '792', name: 'Turkey', nativeName: 'Türkiye', continent: 'Asia', capital: 'Ankara', dialCode: '+90', flagEmoji: '🇹🇷', currencyCode: 'TRY', lat: 38.9637, lng: 35.2433 },
  { code: 'EG', code3: 'EGY', numberCode: '818', name: 'Egypt', nativeName: 'مصر', continent: 'Africa', capital: 'Cairo', dialCode: '+20', flagEmoji: '🇪🇬', currencyCode: 'EGP', lat: 26.8206, lng: 30.8025 },
  { code: 'AE', code3: 'ARE', numberCode: '784', name: 'United Arab Emirates', nativeName: 'الإمارات العربية المتحدة', continent: 'Asia', capital: 'Abu Dhabi', dialCode: '+971', flagEmoji: '🇦🇪', currencyCode: 'AED', lat: 23.4241, lng: 53.8478 },
  { code: 'QA', code3: 'QAT', numberCode: '634', name: 'Qatar', nativeName: 'قطر', continent: 'Asia', capital: 'Doha', dialCode: '+974', flagEmoji: '🇶🇦', currencyCode: 'QAR', lat: 25.3548, lng: 51.1839 },
  { code: 'PS', code3: 'PSE', numberCode: '275', name: 'Palestine', nativeName: 'فلسطين', continent: 'Asia', capital: 'Jerusalem', dialCode: '+970', flagEmoji: '🇵🇸', currencyCode: 'JOD', lat: 31.9522, lng: 35.2332 },
  { code: 'US', code3: 'USA', numberCode: '840', name: 'United States', nativeName: 'United States', continent: 'Americas', capital: 'Washington, D.C.', dialCode: '+1', flagEmoji: '🇺🇸', currencyCode: 'USD', lat: 37.0902, lng: -95.7129 },
  { code: 'GB', code3: 'GBR', numberCode: '826', name: 'United Kingdom', nativeName: 'United Kingdom', continent: 'Europe', capital: 'London', dialCode: '+44', flagEmoji: '🇬🇧', currencyCode: 'GBP', lat: 55.3781, lng: -3.4360 },
  { code: 'JP', code3: 'JPN', numberCode: '392', name: 'Japan', nativeName: '日本', continent: 'Asia', capital: 'Tokyo', dialCode: '+81', flagEmoji: '🇯🇵', currencyCode: 'JPY', lat: 36.2048, lng: 138.2529 },
  { code: 'DE', code3: 'DEU', numberCode: '276', name: 'Germany', nativeName: 'Deutschland', continent: 'Europe', capital: 'Berlin', dialCode: '+49', flagEmoji: '🇩🇪', currencyCode: 'EUR', lat: 51.1657, lng: 10.4515 },
  { code: 'FR', code3: 'FRA', numberCode: '250', name: 'France', nativeName: 'France', continent: 'Europe', capital: 'Paris', dialCode: '+33', flagEmoji: '🇫🇷', currencyCode: 'EUR', lat: 46.2276, lng: 2.2137 },
  { code: 'AU', code3: 'AUS', numberCode: '036', name: 'Australia', nativeName: 'Australia', continent: 'Oceania', capital: 'Canberra', dialCode: '+61', flagEmoji: '🇦🇺', currencyCode: 'AUD', lat: -25.2744, lng: 133.7751 }
]

// 2. Currencies (ISO 4217)
const currencies = [
  { code: 'IDR', numberCode: '360', name: 'Indonesian Rupiah', symbol: 'Rp', decimals: 0, rounding: 1, active: true },
  { code: 'USD', numberCode: '840', name: 'US Dollar', symbol: '$', decimals: 2, rounding: 0.01, active: true },
  { code: 'EUR', numberCode: '978', name: 'Euro', symbol: '€', decimals: 2, rounding: 0.01, active: true },
  { code: 'SAR', numberCode: '682', name: 'Saudi Riyal', symbol: '﷼', decimals: 2, rounding: 0.01, active: true },
  { code: 'MYR', numberCode: '458', name: 'Malaysian Ringgit', symbol: 'RM', decimals: 2, rounding: 0.01, active: true },
  { code: 'SGD', numberCode: '702', name: 'Singapore Dollar', symbol: 'S$', decimals: 2, rounding: 0.01, active: true },
  { code: 'GBP', numberCode: '826', name: 'British Pound', symbol: '£', decimals: 2, rounding: 0.01, active: true },
  { code: 'JPY', numberCode: '392', name: 'Japanese Yen', symbol: '¥', decimals: 0, rounding: 1, active: true },
  { code: 'AED', numberCode: '784', name: 'UAE Dirham', symbol: 'د.إ', decimals: 2, rounding: 0.01, active: true },
  { code: 'TRY', numberCode: '949', name: 'Turkish Lira', symbol: '₺', decimals: 2, rounding: 0.01, active: true },
  { code: 'QAR', numberCode: '634', name: 'Qatari Riyal', symbol: 'ر.ق', decimals: 2, rounding: 0.01, active: true }
]

// 3. Languages
const languages = [
  { code: 'en_US', name: 'English (US)', nativeName: 'English (US)', isoCode: 'en', script: 'Latn', direction: 'ltr', active: true },
  { code: 'id_ID', name: 'Indonesian', nativeName: 'Bahasa Indonesia', isoCode: 'id', script: 'Latn', direction: 'ltr', active: true },
  { code: 'ar_SA', name: 'Arabic (Saudi Arabia)', nativeName: 'العربية', isoCode: 'ar', script: 'Arab', direction: 'rtl', active: true },
  { code: 'ms_MY', name: 'Malay', nativeName: 'Bahasa Melayu', isoCode: 'ms', script: 'Latn', direction: 'ltr', active: true },
  { code: 'tr_TR', name: 'Turkish', nativeName: 'Türkçe', isoCode: 'tr', script: 'Latn', direction: 'ltr', active: true }
]

// 4. Timezones
const timezones = [
  { name: 'Asia/Jakarta', tzName: 'WIB', utcOffset: '+07:00', countryCode: 'ID' },
  { name: 'Asia/Makassar', tzName: 'WITA', utcOffset: '+08:00', countryCode: 'ID' },
  { name: 'Asia/Jayapura', tzName: 'WIT', utcOffset: '+09:00', countryCode: 'ID' },
  { name: 'Asia/Riyadh', tzName: 'AST', utcOffset: '+03:00', countryCode: 'SA' },
  { name: 'Asia/Dubai', tzName: 'GST', utcOffset: '+04:00', countryCode: 'AE' },
  { name: 'Asia/Singapore', tzName: 'SGT', utcOffset: '+08:00', countryCode: 'SG' },
  { name: 'Asia/Kuala_Lumpur', tzName: 'MYT', utcOffset: '+08:00', countryCode: 'MY' },
  { name: 'UTC', tzName: 'UTC', utcOffset: '+00:00', countryCode: '' }
]

// 5. Roles & System Data
const systemData = {
  roles: [
    { name: 'Admin', description: 'System Administrator with full management access' },
    { name: 'Operator', description: 'Terminal Operator for monitoring and telemetry' },
    { name: 'User', description: 'Standard authenticated member' },
    { name: 'Public', description: 'Unauthenticated public guest' }
  ],
  configParameters: [
    { key: 'system.title', value: 'MoonWitness Operating System' },
    { key: 'system.version', value: '3.0.0' },
    { key: 'geo.default_country', value: 'ID' },
    { key: 'geo.default_currency', value: 'IDR' }
  ],
  sequences: [
    { name: 'Standard Transaction', code: 'moon.tx', prefix: 'TX/%(year)s/', padding: 5, numberNext: 1 },
    { name: 'Audit Log Sequence', code: 'moon.audit', prefix: 'AUD/%(year)s/', padding: 6, numberNext: 1 }
  ]
}

function writeJson(filename, data) {
  const content = JSON.stringify(data, null, 2) + '\n'
  writeFileSync(join(dataDir, filename), content, 'utf8')
  const hash = createHash('sha256').update(content).digest('hex')
  return { filename, hash, size: Buffer.byteLength(content) }
}

const manifest = {
  version: '1.0.0',
  generatedAt: new Date().toISOString(),
  files: [
    writeJson('countries.json', countries),
    writeJson('currencies.json', currencies),
    writeJson('languages.json', languages),
    writeJson('timezones.json', timezones),
    writeJson('system-data.json', systemData)
  ]
}

writeFileSync(join(dataDir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8')
console.log('Seed data files and manifest generated successfully.')
