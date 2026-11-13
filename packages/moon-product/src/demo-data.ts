import { createCtx, getModel, SUPERUSER_ID, loadJsonSeed } from '@moon/orm'

export async function loadDemoData() {
  const Category = getModel('product.category')
  const Template = getModel('product.template')
  const Product = getModel('product.product')
  const Pricelist = getModel('product.pricelist')
  const Currency = getModel('vx.coin')

  if (!Category || !Template) return

  const env = createCtx(SUPERUSER_ID, {}, getModel)

  const jsonSeed = loadJsonSeed<{
    categories?: { name: string; description?: string }[]
    templates?: any[]
    pricelists?: { name: string; discountPolicy?: string }[]
  }>('product')

  // ── Categories ──
  const categorySeeds = jsonSeed?.categories || [
    { name: 'Celestial Instruments' },
    { name: 'Sacred Publications' },
    { name: 'Digital Subscriptions' },
    { name: 'Observatory Hardware' },
    { name: 'Education & Training' }
  ]
  const catIds: Record<string, number> = {}
  for (const c of categorySeeds) {
    const rows = await Category.fetch(Category, env, [['name', '=', c.name]])
    if (!rows.length) {
      const row = await Category.spawn(Category, env, { name: c.name })
      catIds[c.name] = row.id as number
    } else {
      catIds[c.name] = rows[0].id as number
    }
  }

  // ── Product Templates ──
  const templateSeeds = jsonSeed?.templates || [
    { name: 'Lunar Observation Telescope 200mm', category: 'Celestial Instruments', type: 'product', listPrice: 15000000, defaultCode: 'TEL-200M', barcode: '89910010001', weight: 8.5 },
    { name: 'Digital Qibla Azimuth Sensor Module', category: 'Celestial Instruments', type: 'product', listPrice: 2500000, defaultCode: 'QIBLA-MOD', barcode: '89910010002', weight: 0.35 },
    { name: 'Mushaf Al-Qur’an Uthmani Standard Edition', category: 'Sacred Publications', type: 'product', listPrice: 150000, defaultCode: 'QURAN-UTH', barcode: '89910010003', weight: 0.9 },
    { name: 'Tafsir Ibn Kathir 10 Volume Complete Set', category: 'Sacred Publications', type: 'product', listPrice: 1850000, defaultCode: 'TAFSIR-IK-10', barcode: '89910010004', weight: 12.0 },
    { name: 'MoonWitness Enterprise Cloud Telemetry', category: 'Digital Subscriptions', type: 'service', listPrice: 500000, defaultCode: 'MW-CLOUD', barcode: '89910010005', weight: 0 },
    { name: 'Observatory API Satellite Data Feed (Annual)', category: 'Digital Subscriptions', type: 'service', listPrice: 3500000, defaultCode: 'MW-SAT-API', barcode: '89910010006', weight: 0 },
    { name: 'High-Precision Theodolite & Tripod Mount', category: 'Observatory Hardware', type: 'product', listPrice: 8200000, defaultCode: 'THEOD-820', barcode: '89910010007', weight: 6.2 },
    { name: 'Certified Hilal Observer Certification Course', category: 'Education & Training', type: 'service', listPrice: 750000, defaultCode: 'COURSE-HILAL', barcode: '89910010008', weight: 0 }
  ]

  const templateIds: Record<string, number> = {}
  for (const t of templateSeeds) {
    const rows = await Template.fetch(Template, env, [['name', '=', t.name]])
    let tmplId: number
    if (!rows.length) {
      const row = await Template.spawn(Template, env, {
        name: t.name,
        categoryId: catIds[t.category] || undefined,
        type: t.type,
        listPrice: t.listPrice,
        defaultCode: t.defaultCode,
        barcode: t.barcode
      })
      tmplId = row.id as number
    } else {
      tmplId = rows[0].id as number
    }
    templateIds[t.name] = tmplId

    // Also ensure ProductProduct variant exists for each template
    if (Product) {
      const prodRows = await Product.fetch(Product, env, [['productTmplId', '=', tmplId]])
      if (!prodRows.length) {
        await Product.spawn(Product, env, {
          productTmplId: tmplId,
          defaultCode: t.defaultCode,
          barcode: t.barcode,
          weight: t.weight,
          volume: 0.0
        })
      }
    }
  }

  // ── Pricelists ──
  if (Pricelist && Currency) {
    const currencyRows = await Currency.fetch(Currency, env, [['name', '=', 'IDR']])
    const currId = currencyRows[0]?.id as number | undefined
    if (currId) {
      const pricelists = jsonSeed?.pricelists?.map(p => ({ ...p, currencyId: currId })) || [
        { name: 'Standard Observatory Catalog (IDR)', currencyId: currId, discountPolicy: 'with_discount' },
        { name: 'Academic & Pesantren Partner Rate (IDR)', currencyId: currId, discountPolicy: 'without_discount' }
      ]
      for (const pl of pricelists) {
        const plRows = await Pricelist.fetch(Pricelist, env, [['name', '=', pl.name]])
        if (!plRows.length) {
          await Pricelist.spawn(Pricelist, env, pl)
        }
      }
    }
  }

  console.log(`[moon-product] Demo data enriched: ${categorySeeds.length} categories, ${templateSeeds.length} product templates, variants & pricelists seeded`)
}
