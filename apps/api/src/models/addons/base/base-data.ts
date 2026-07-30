import { getModel } from '../../registry.js'
import bcrypt from 'bcryptjs'
import {
  DEFAULT_COUNTRY_CODE,
  DEFAULT_CURRENCY_CODE,
  PARTNER_SEED_DATA,
  COUNTRY_SEED_DATA,
  CURRENCY_SEED_DATA
} from './index.js'

const BCRYPT_ROUNDS = 10

function isBcryptHash(value: string): boolean {
  return /^\$2[aby]\$\d{2}\$/.test(value)
}

export async function loadBaseData() {
  const Country = getModel('res.country')
  const Currency = getModel('res.currency')
  const Partner = getModel('res.partner')
  const Company = getModel('res.company')
  const User = getModel('res.user')

  if (!Country || !Currency || !Partner || !Company || !User) {
    return
  }

  const countryCache = new Map<string, number>()
  const currencyCache = new Map<string, number>()

  for (const item of COUNTRY_SEED_DATA) {
    const rows = await Country.searchRead(Country, [['code', '=', item.code]])
    if (!rows.length) {
      const row = await Country.create(Country, item)
      countryCache.set(item.code, row.id as number)
    } else {
      countryCache.set(item.code, rows[0].id as number)
    }
  }

  for (const item of CURRENCY_SEED_DATA) {
    const rows = await Currency.searchRead(Currency, [['code', '=', item.code]])
    if (!rows.length) {
      const row = await Currency.create(Currency, item)
      currencyCache.set(item.code, row.id as number)
    } else {
      currencyCache.set(item.code, rows[0].id as number)
    }
  }

  const defaultCountryId = countryCache.get(DEFAULT_COUNTRY_CODE)
  const defaultCurrencyId = currencyCache.get(DEFAULT_CURRENCY_CODE)

  let companyPartnerId: number | undefined
  {
    const rows = await Partner.searchRead(Partner, [['name', '=', PARTNER_SEED_DATA.company.name], ['isCompany', '=', true]])
    if (!rows.length) {
      const vals: Record<string, unknown> = {
        name: PARTNER_SEED_DATA.company.name,
        isCompany: true
      }
      if (defaultCountryId) vals.countryId = defaultCountryId
      const row = await Partner.create(Partner, vals)
      companyPartnerId = row.id as number
    } else {
      companyPartnerId = rows[0].id as number
    }
  }

  if (companyPartnerId) {
    const companyRows = await Company.searchRead(Company, [['partnerId', '=', companyPartnerId]])
    if (!companyRows.length) {
      const vals: Record<string, unknown> = {
        partnerId: companyPartnerId,
        name: PARTNER_SEED_DATA.company.name
      }
      if (defaultCurrencyId) vals.currencyId = defaultCurrencyId
      await Company.create(Company, vals)
    }
  }

  if (companyPartnerId) {
    for (const u of PARTNER_SEED_DATA.users) {
      const partnerRows = await Partner.searchRead(Partner, [['name', '=', u.name], ['isCompany', '=', u.isCompany]])
      let partnerId: number | undefined
      if (!partnerRows.length) {
        const vals: Record<string, unknown> = {
          name: u.name,
          isCompany: u.isCompany
        }
        if (defaultCountryId) vals.countryId = defaultCountryId
        vals.companyId = companyPartnerId
        const row = await Partner.create(Partner, vals)
        partnerId = row.id as number
      } else {
        partnerId = partnerRows[0].id as number
      }

      if (partnerId) {
        const userRows = await User.searchRead(User, [['email', '=', u.email]])
        const hashedPassword = await bcrypt.hash(u.password, BCRYPT_ROUNDS)

        if (!userRows.length) {
          await User.create(User, {
            name: u.name,
            email: u.email,
            password: hashedPassword,
            partnerId
          })
        } else {
          const existingUser = userRows[0] as { id: number; password: string }
          if (!isBcryptHash(existingUser.password)) {
            await User.write(User, existingUser.id, { password: hashedPassword })
          }
        }
      }
    }
  }
}
