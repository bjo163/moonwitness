import { randomBytes } from 'node:crypto'
import { seedBaseData } from './seed.ts'
import { loadBaseData } from './base-data.ts'
import { verifySeedIntegrity, loadCanonicalReferenceData } from './seed-loader.ts'
import { loadDemoData } from './demo-data.ts'
import { views } from './views.ts'
import VxZone from './vx-zone.ts'
import VxZoneSubdivision from './vx-zone-subdivision.ts'
import VxRole from './vx-role.ts'
import MxModel from './mx-model.ts'
import MxGrant from './mx-grant.ts'
import MxRule from './mx-rule.ts'
import VxUser from './vx-user.ts'
import VxAuthChallenge from './vx-auth-challenge.ts'
import IxLang from './ix-lang.ts'
import IxDict from './ix-dict.ts'
import IxTimezone from './ix-timezone.ts'
import { FxMsg, FxTrack } from './fx-msg.ts'
import VxNode from './vx-node.ts'
import VxOrg from './vx-org.ts'
import VxCoin from './vx-coin.ts'
import MxMetric from './mx-metric.ts'
import FxSession from './fx-session.ts'
import IrModelData from './ir-model-data.ts'
import IrSequence from './ir-sequence.ts'
import IrConfigParameter from './ir-config-parameter.ts'
import IrAttachment from './ir-attachment.ts'
import IrReport from './models/ir-report.ts'
import IrVersion from './models/ir-version.ts'

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
} from './totp.ts'

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
