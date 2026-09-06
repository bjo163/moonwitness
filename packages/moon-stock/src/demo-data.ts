import { createCtx, getModel, SUPERUSER_ID, loadJsonSeed } from '@moon/orm'

export async function loadDemoData() {
  const Location = getModel('stock.location')
  const Warehouse = getModel('stock.warehouse')
  const Picking = getModel('stock.picking')
  const Org = getModel('vx.org')

  if (!Location || !Warehouse) return

  const env = createCtx(SUPERUSER_ID, {}, getModel)

  let mainCompanyId: number | undefined
  if (Org) {
    const compRows = await Org.fetch(Org, env, [['name', '=', 'MoonWitness']])
    if (compRows.length) mainCompanyId = compRows[0].id as number
  }

  const jsonSeed = loadJsonSeed<{
    locations?: { name: string; usage: string }[]
    warehouses?: { code: string; name: string; loc: string }[]
    pickings?: { name: string; loc: string; destLoc: string; state: string }[]
  }>('stock')

  // ── Locations ──
  const locationSeeds = jsonSeed?.locations || [
    { name: 'Central Vault / Storage', usage: 'internal' },
    { name: 'Field Observation Bay', usage: 'internal' },
    { name: 'Optical Calibration Lab', usage: 'internal' },
    { name: 'Transit / Dispatch Staging', usage: 'transit' },
    { name: 'Customers / External', usage: 'customer' },
    { name: 'Suppliers / Vendors', usage: 'supplier' }
  ]
  const locIds: Record<string, number> = {}
  for (const l of locationSeeds) {
    const rows = await Location.fetch(Location, env, [['name', '=', l.name]])
    if (!rows.length) {
      const row = await Location.spawn(Location, env, {
        name: l.name,
        usage: l.usage,
        companyId: mainCompanyId
      })
      locIds[l.name] = row.id as number
    } else {
      locIds[l.name] = rows[0].id as number
    }
  }

  // ── Warehouses ──
  const warehouseSeeds = jsonSeed?.warehouses || [
    { code: 'MW-MAIN', name: 'MoonWitness Main Observatory Warehouse', loc: 'Central Vault / Storage' },
    { code: 'MW-FIELD', name: 'MoonWitness Field Station Depot', loc: 'Field Observation Bay' },
    { code: 'MW-LAB', name: 'MoonWitness Calibration & Optics Lab', loc: 'Optical Calibration Lab' }
  ]
  for (const w of warehouseSeeds) {
    const rows = await Warehouse.fetch(Warehouse, env, [['code', '=', w.code]])
    if (!rows.length) {
      await Warehouse.spawn(Warehouse, env, {
        code: w.code,
        name: w.name,
        lotStockId: locIds[w.loc] || undefined,
        companyId: mainCompanyId
      })
    }
  }

  // ── Sample Pickings ──
  if (Picking) {
    const pickings = jsonSeed?.pickings || [
      {
        name: 'WH/OUT/2026/0001',
        loc: 'Central Vault / Storage',
        destLoc: 'Field Observation Bay',
        state: 'draft'
      },
      {
        name: 'WH/INT/2026/0002',
        loc: 'Field Observation Bay',
        destLoc: 'Optical Calibration Lab',
        state: 'confirmed'
      },
      {
        name: 'WH/DISP/2026/0003',
        loc: 'Central Vault / Storage',
        destLoc: 'Customers / External',
        state: 'draft'
      }
    ]

    for (const p of pickings) {
      const pRows = await Picking.fetch(Picking, env, [['name', '=', p.name]])
      if (!pRows.length && locIds[p.loc] && locIds[p.destLoc]) {
        await Picking.spawn(Picking, env, {
          name: p.name,
          locationId: locIds[p.loc],
          locationDestId: locIds[p.destLoc],
          companyId: mainCompanyId,
          state: p.state
        })
      }
    }
  }

  console.log(`[moon-stock] Demo data enriched: ${locationSeeds.length} locations, ${warehouseSeeds.length} warehouses, pickings initialized`)
}
