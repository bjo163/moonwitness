import { randomBytes } from 'node:crypto'
import { seedBaseData } from './seed.js'
import { loadBaseData } from './base-data.js'
import { verifySeedIntegrity, loadCanonicalReferenceData } from './seed-loader.js'
import { loadDemoData } from './demo-data.js'
import { views } from './views.js'
import VxZone from './vx-zone.js'
import VxZoneSubdivision from './vx-zone-subdivision.js'
import VxRole from './vx-role.js'
import MxModel from './mx-model.js'
import MxGrant from './mx-grant.js'
import MxRule from './mx-rule.js'
import VxUser from './vx-user.js'
import VxAuthChallenge from './vx-auth-challenge.js'
import IxLang from './ix-lang.js'
import IxDict from './ix-dict.js'
import IxTimezone from './ix-timezone.js'
import { FxMsg, FxTrack } from './fx-msg.js'
import VxNode from './vx-node.js'
import VxOrg from './vx-org.js'
import VxCoin from './vx-coin.js'
import MxMetric from './mx-metric.js'
import FxSession from './fx-session.js'
import IrModelData from './ir-model-data.js'
import IrSequence from './ir-sequence.js'
import IrConfigParameter from './ir-config-parameter.js'
import IrAttachment from './ir-attachment.js'
import IrReport from './models/ir-report.js'
import IrVersion from './models/ir-version.js'

export { loadModels } from '@moon/orm'

export {
  seedBaseData,
  loadBaseData,
  loadDemoData,
  views,
  verifySeedIntegrity,
  loadCanonicalReferenceData,
  VxZone,
  VxZoneSubdivision,
  VxRole,
  MxModel,
  MxGrant,
  MxRule,
  VxUser,
  VxAuthChallenge,
  VxNode,
  VxOrg,
  VxCoin,
  IxLang,
  IxDict,
  IxTimezone,
  FxMsg,
  FxTrack,
  MxMetric,
  FxSession,
  IrModelData,
  IrSequence,
  IrConfigParameter,
  IrAttachment,
  IrReport,
  IrVersion
}

export {
  generateTotp,
  verifyTotp,
  generateTotpSecret,
  generateTotpUri
} from './totp.js'

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

const readBootstrapEnv = (envKey: string): string | undefined => {
  const proc = (globalThis as any).process
  const envVal = proc && proc.env ? proc.env[envKey] : undefined
  return typeof envVal === 'string' && envVal.trim().length > 0 ? envVal.trim() : undefined
}

const getSecureBootstrapSecret = (envKey: string): string => {
  return readBootstrapEnv(envKey) ?? randomBytes(32).toString('base64url')
}

const getBootstrapAdminEmail = (): string => {
  const email = readBootstrapEnv('BOOTSTRAP_ADMIN_EMAIL')
  if (email) return email
  if (process.env.NODE_ENV === 'production') {
    throw new Error('BOOTSTRAP_ADMIN_EMAIL is required for production installation')
  }
  return 'admin@moonwitness.org'
}

const getBootstrapAdminPassword = (): string => {
  const password = readBootstrapEnv('BOOTSTRAP_ADMIN_PASSWORD')
  if (password) return password
  if (process.env.NODE_ENV === 'production') {
    throw new Error('BOOTSTRAP_ADMIN_PASSWORD is required for production installation')
  }
  // Development installs may proceed without a reusable source-known credential.
  // Operators who need to log in must provide BOOTSTRAP_ADMIN_PASSWORD explicitly.
  return randomBytes(32).toString('base64url')
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
      password: getSecureBootstrapSecret('BOOTSTRAP_SYSTEM_PASSWORD'),
      isCompany: false,
      isAdmin: false,
    },
    {
      mode: 'bot',
      name: 'Bot',
      email: 'bot@local',
      password: getSecureBootstrapSecret('BOOTSTRAP_BOT_PASSWORD'),
      isCompany: false,
      isAdmin: false,
    },
    {
      mode: 'admin',
      name: 'Administrator',
      email: getBootstrapAdminEmail(),
      password: getBootstrapAdminPassword(),
      isCompany: false,
      isAdmin: true,
    }
  ]
}

export default {
  name: 'base',
  description: 'Core base kernel addon',
  depends: [],
  models: [
    VxUser,
    VxAuthChallenge,
    VxNode,
    VxOrg,
    VxZone,
    VxZoneSubdivision,
    VxCoin,
    VxRole,
    MxModel,
    MxGrant,
    MxRule,
    IxLang,
    IxDict,
    IxTimezone,
    FxMsg,
    FxTrack,
    MxMetric,
    FxSession,
    IrModelData,
    IrSequence,
    IrConfigParameter,
    IrAttachment,
    IrReport,
    IrVersion
  ]
}
