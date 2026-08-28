import { createCtx, getDb, getModel, registry, SUPERUSER_ID } from '@moon/orm'
import bcrypt from 'bcryptjs'
import {
  DEFAULT_COUNTRY_CODE,
  DEFAULT_CURRENCY_CODE,
  PARTNER_SEED_DATA,
  COUNTRY_SEED_DATA,
  CURRENCY_SEED_DATA
} from './index.js'

const BCRYPT_ROUNDS = 10

export async function loadBaseData() {
  const Country = getModel('vx.zone')
  const Currency = getModel('vx.coin')
  const Partner = getModel('vx.node')
  const Company = getModel('vx.org')
  const User = getModel('vx.user')
  const Groups = getModel('vx.role')
  const MxModel = getModel('mx.model')
  const MxGrant = getModel('mx.grant')
  const Lang = getModel('ix.lang')

  if (!Country || !Currency || !Partner || !Company || !User || !Groups || !MxModel || !MxGrant || !Lang) {
    return
  }

  const env = createCtx(SUPERUSER_ID, {}, getModel)
  const db = getDb()
  const conn = env.trx || db

  let adminGroupId: number
  const groupRows = await Groups.fetch(Groups, env, [['name', '=', 'Admin']])
  if (!groupRows.length) {
    const row = await Groups.spawn(Groups, env, { name: 'Admin' })
    adminGroupId = row.id as number
  } else {
    adminGroupId = groupRows[0].id as number
  }

  const securedModels = Array.from(registry.values())
    .filter((modelClass) => !modelClass._abstract && Boolean(modelClass._name))
    .map((modelClass) => modelClass._name)
    .sort()

  const modelIds: Record<string, number> = {}
  for (const m of securedModels) {
    const mRows = await MxModel.fetch(MxModel, env, [['model', '=', m]])
    if (!mRows.length) {
      const row = await MxModel.spawn(MxModel, env, { model: m, name: m })
      modelIds[m] = row.id as number
    } else {
      modelIds[m] = mRows[0].id as number
    }
  }

  for (const m of securedModels) {
    const mId = modelIds[m]
    const accRows = await MxGrant.fetch(MxGrant, env, [['modelId', '=', mId], ['groupId', '=', adminGroupId]])
    if (!accRows.length) {
      await MxGrant.spawn(MxGrant, env, {
        name: `${m} admin access`,
        modelId: mId,
        groupId: adminGroupId,
        permRead: true,
        permWrite: true,
        permCreate: true,
        permUnlink: true
      })
    }
  }

  const langs = [
    { code: 'en_US', name: 'English (US)', isoCode: 'en', urlCode: 'en', direction: 'ltr' },
    { code: 'id_ID', name: 'Indonesian', isoCode: 'id', urlCode: 'id', direction: 'ltr' }
  ]
  for (const l of langs) {
    const lRows = await Lang.fetch(Lang, env, [['code', '=', l.code]])
    if (!lRows.length) {
      await Lang.spawn(Lang, env, l)
    }
  }

  const countryCache = new Map<string, number>()
  const currencyCache = new Map<string, number>()

  for (const item of COUNTRY_SEED_DATA) {
    const rows = await Country.fetch(Country, env, [['code', '=', item.code]])
    if (!rows.length) {
      const row = await Country.spawn(Country, env, item)
      countryCache.set(item.code, row.id as number)
    } else {
      countryCache.set(item.code, rows[0].id as number)
    }
  }

  for (const item of CURRENCY_SEED_DATA) {
    const rows = await Currency.fetch(Currency, env, [['code', '=', item.code]])
    if (!rows.length) {
      const row = await Currency.spawn(Currency, env, item)
      currencyCache.set(item.code, row.id as number)
    } else {
      currencyCache.set(item.code, rows[0].id as number)
    }
  }

  const defaultCountryId = countryCache.get(DEFAULT_COUNTRY_CODE)
  const defaultCurrencyId = currencyCache.get(DEFAULT_CURRENCY_CODE)

  let companyPartnerId: number | undefined
  {
    const rows = await Partner.fetch(Partner, env, [['name', '=', PARTNER_SEED_DATA.company.name], ['isCompany', '=', true]])
    if (!rows.length) {
      const vals: Record<string, unknown> = {
        name: PARTNER_SEED_DATA.company.name,
        isCompany: true
      }
      if (defaultCountryId) vals.countryId = defaultCountryId
      const row = await Partner.spawn(Partner, env, vals)
      companyPartnerId = row.id as number
    } else {
      companyPartnerId = rows[0].id as number
    }
  }

  let actualCompanyId: number | undefined
  if (companyPartnerId) {
    const companyRows = await Company.fetch(Company, env, [['partnerId', '=', companyPartnerId]])
    if (!companyRows.length) {
      const vals: Record<string, unknown> = {
        partnerId: companyPartnerId,
        name: PARTNER_SEED_DATA.company.name
      }
      if (defaultCurrencyId) vals.currencyId = defaultCurrencyId
      const compRow = await Company.spawn(Company, env, vals)
      actualCompanyId = compRow.id as number
    } else {
      actualCompanyId = companyRows[0].id as number
    }
  }

  if (actualCompanyId) {
    for (const u of PARTNER_SEED_DATA.users) {
      const partnerRows = await Partner.fetch(Partner, env, [['name', '=', u.name], ['isCompany', '=', u.isCompany]])
      let partnerId: number | undefined
      if (!partnerRows.length) {
        const vals: Record<string, unknown> = { name: u.name, isCompany: u.isCompany }
        if (defaultCountryId) vals.countryId = defaultCountryId
        vals.companyId = actualCompanyId
        const row = await Partner.spawn(Partner, env, vals)
        partnerId = row.id as number
      } else {
        partnerId = partnerRows[0].id as number
      }

      if (partnerId) {
        const userRows = await User.fetch(User, env, [['email', '=', u.email]])
        let userId: number
        if (!userRows.length) {
          const hashedPassword = await bcrypt.hash(u.password, BCRYPT_ROUNDS)
          const uRow = await User.spawn(User, env, {
            name: u.name,
            email: u.email,
            login: u.email,
            password: hashedPassword,
            partnerId,
            companyId: actualCompanyId
          })
          userId = uRow.id as number
        } else {
          const existingUser = userRows[0] as { id: number }
          userId = existingUser.id
          // Canonical seed may repair non-secret metadata, but must never rotate or
          // reset an operator-managed credential on an existing human account.
          await conn('vx_user').where({ id: existingUser.id }).update({ login: u.email })
        }

        if (u.isAdmin) {
          const exists = await conn('vx_user_vx_role_rel')
            .where({ vx_user_id: userId, vx_role_id: adminGroupId })
            .first()
          if (!exists) {
            await conn('vx_user_vx_role_rel').insert({
              vx_user_id: userId,
              vx_role_id: adminGroupId
            })
          }
        }
      }
    }
  }
}
