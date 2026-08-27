import { createCtx, getModel, SUPERUSER_ID } from '@moon/orm'

export async function loadDemoData() {
  const Category = getModel('product.category')
  const Template = getModel('product.template')

  if (!Category || !Template) return

  const env = createCtx(SUPERUSER_ID, {}, getModel)

  // ── Categories ──
  const categorySeeds = [
    { name: 'Celestial Instruments' },
    { name: 'Sacred Publications' },
    { name: 'Digital Subscriptions' }
  ]
  const catIds: Record<string, number> = {}
  for (const c of categorySeeds) {
    const rows = await Category.fetch(Category, env, [['name', '=', c.name]])
    if (!rows.length) {
      const row = await Category.spawn(Category, env, c)
      catIds[c.name] = row.id as number
    } else {
      catIds[c.name] = rows[0].id as number
    }
  }

  // ── Product Templates ──
  const templateSeeds = [
    { name: 'Lunar Observation Telescope 200mm', category: 'Celestial Instruments', type: 'product', listPrice: 15000000, defaultCode: 'TEL-200M' },
    { name: 'Digital Qibla Azimuth Sensor Module', category: 'Celestial Instruments', type: 'product', listPrice: 2500000, defaultCode: 'QIBLA-MOD' },
    { name: 'Mushaf Al-Qur’an Uthmani Standard Edition', category: 'Sacred Publications', type: 'product', listPrice: 150000, defaultCode: 'QURAN-UTH' },
    { name: 'MoonWitness Enterprise Cloud Telemetry', category: 'Digital Subscriptions', type: 'service', listPrice: 500000, defaultCode: 'MW-CLOUD' }
  ]

  for (const t of templateSeeds) {
    const rows = await Template.fetch(Template, env, [['name', '=', t.name]])
    if (!rows.length) {
      await Template.spawn(Template, env, {
        name: t.name,
        categoryId: catIds[t.category] || undefined,
        type: t.type,
        listPrice: t.listPrice,
        defaultCode: t.defaultCode
      })
    }
  }

  console.log('[moon-product] Demo data loaded: 3 categories, 4 product templates')
}
