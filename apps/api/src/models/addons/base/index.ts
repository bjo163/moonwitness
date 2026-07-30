import {
  seedBaseData
} from './seed.js'
import {
  loadBaseData
} from './base-data.js'

export { loadModels } from '../../registry.js'

export { seedBaseData, loadBaseData }

export const SYSTEM_MODE = 'system'
export const BOT_MODE = 'bot'

export const DEFAULT_COUNTRY_CODE = 'ID'
export const DEFAULT_CURRENCY_CODE = 'IDR'
export const DEFAULT_COMPANY_NAME = 'MoonWitness'

export const COUNTRY_SEED_DATA = [
  { name: 'Indonesia', code: 'ID' },
  { name: 'Malaysia', code: 'MY' },
  { name: 'Singapore', code: 'SG' },
  { name: 'Thailand', code: 'TH' }
]

export const CURRENCY_SEED_DATA = [
  { name: 'Rupiah', symbol: 'Rp', code: 'IDR' },
  { name: 'Malaysian Ringgit', symbol: 'RM', code: 'MYR' }
]

export const COMPANY_SEED = {
  name: 'MoonWitness',
  countryCode: 'ID',
  currencyCode: 'IDR'
}

export const PARTNER_SEED_DATA = {
  company: {
    name: 'MoonWitness',
    isCompany: true,
    countryCode: 'ID'
  },
  users: [
    {
      mode: 'system',
      name: 'System',
      email: 'system@local',
      password: 'system',
      isCompany: false
    },
    {
      mode: 'bot',
      name: 'Bot',
      email: 'bot@local',
      password: 'bot',
      isCompany: false
    }
  ]
}

export default {
  name: 'base',
  description: 'Core base addon',
  depends: [],
  models: [
    './user',
    './partner',
    './company',
    './country',
    './currency'
  ]
}
