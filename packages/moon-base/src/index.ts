import {
  seedBaseData
} from './seed.js'
import {
  loadBaseData
} from './base-data.js'
import {
  verifySeedIntegrity,
  loadCanonicalReferenceData
} from './seed-loader.js'
import VxZone from './vx-zone.js'
import VxZoneSubdivision from './vx-zone-subdivision.js'
import VxRole from './vx-role.js'
import MxModel from './mx-model.js'
import MxGrant from './mx-grant.js'
import MxRule from './mx-rule.js'
import VxUser from './vx-user.js'
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

export { loadModels } from '@moon/orm'

export {
  seedBaseData,
  loadBaseData,
  verifySeedIntegrity,
  loadCanonicalReferenceData,
  VxZone,
  VxZoneSubdivision,
  VxRole,
  MxModel,
  MxGrant,
  MxRule,
  VxUser,
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
  IrAttachment
}

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

import { randomBytes } from 'node:crypto'

const getSecureBootstrapSecret = (envKey: string): string => {
  const proc = (globalThis as any).process
  const envVal = proc && proc.env ? proc.env[envKey] : undefined
  if (envVal && typeof envVal === 'string' && envVal.trim().length > 0) {
    return envVal.trim()
  }
  return randomBytes(32).toString('base64url')
}

const getBootstrapEnv = (envKey: string): string | undefined => {
  const proc = (globalThis as any).process
  const envVal = proc && proc.env ? proc.env[envKey] : undefined
  return typeof envVal === 'string' && envVal.trim().length > 0 ? envVal.trim() : undefined
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
      isCompany: false
    },
    {
      mode: 'bot',
      name: 'Bot',
      email: 'bot@local',
      password: getSecureBootstrapSecret('BOOTSTRAP_BOT_PASSWORD'),
      isCompany: false
    },
    {
      mode: 'admin',
      name: 'Administrator',
      email: getBootstrapEnv('BOOTSTRAP_ADMIN_EMAIL') || 'admin@moonwitness.org',
      password: getSecureBootstrapSecret('BOOTSTRAP_ADMIN_PASSWORD'),
      isCompany: false
    }
  ]
}

export default {
  name: 'base',
  description: 'Core base kernel addon',
  depends: [],
  models: [
    VxUser,
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
    IrAttachment
  ]
}
