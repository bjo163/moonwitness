import {
  seedBaseData
} from './seed.js'
import {
  loadBaseData
} from './base-data.js'
import VxZone from './vx-zone.js'
import VxRole from './vx-role.js'
import MxModel from './mx-model.js'
import MxGrant from './mx-grant.js'
import MxRule from './mx-rule.js'
import VxUser from './vx-user.js'
import IxLang from './ix-lang.js'
import IxDict from './ix-dict.js'
import { FxMsg, FxTrack } from './fx-msg.js'
import VxNode from './vx-node.js'
import VxOrg from './vx-org.js'
import VxCoin from './vx-coin.js'
import MxMetric from './mx-metric.js'
import FxSession from './fx-session.js'

export { loadModels } from '@moon/orm'

export { seedBaseData, loadBaseData, VxZone, VxRole, MxModel, MxGrant, MxRule, VxUser, VxNode, VxOrg, VxCoin, IxLang, IxDict, FxMsg, FxTrack, MxMetric, FxSession }

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
      password: process.env.BOOTSTRAP_SYSTEM_PASSWORD || 'system_internal_service_key',
      isCompany: false
    },
    {
      mode: 'bot',
      name: 'Bot',
      email: 'bot@local',
      password: process.env.BOOTSTRAP_BOT_PASSWORD || 'bot_internal_service_key',
      isCompany: false
    },
    {
      mode: 'admin',
      name: 'Administrator',
      email: process.env.BOOTSTRAP_ADMIN_EMAIL || 'admin@moonwitness.org',
      password: process.env.BOOTSTRAP_ADMIN_PASSWORD || 'admin_dev_password',
      isCompany: false
    }
  ]
}

export default {
  name: 'base',
  description: 'Core base addon',
  depends: [],
  models: [
    VxUser,
    VxNode,
    VxOrg,
    VxZone,
    VxCoin,
    VxRole,
    MxModel,
    MxGrant,
    MxRule,
    IxLang,
    IxDict,
    FxMsg,
    FxTrack,
    MxMetric,
    FxSession
  ]
}
