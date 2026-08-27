import { createCtx, getModel, SUPERUSER_ID } from '@moon/orm'

export async function loadDemoData() {
  const Location = getModel('stock.location')
  const Warehouse = getModel('stock.warehouse')

  if (!Location || !Warehouse) return

  const env = createCtx(SUPERUSER_ID, {}, getModel)

  // ── Locations ──
  const locationSeeds = [
    { name: 'Central Vault / Storage', usage: 'internal' },
    { name: 'Field Observation Bay', usage: 'internal' },
    { name: 'Customers / External', usage: 'customer' }
  ]
  const locIds: Record<string, number> = {}
  for (const l of locationSeeds) {
    const rows = await Location.fetch(Location, env, [['name', '=', l.name]])
    if (!rows.length) {
      const row = await Location.spawn(Location, env, l)
      locIds[l.name] = row.id as number
    } else {
      locIds[l.name] = rows[0].id as number
    }
  }

  // ── Warehouses ──
  const warehouseSeeds = [
    { code: 'MW-MAIN', name: 'MoonWitness Main Observatory Warehouse', loc: 'Central Vault / Storage' },
    { code: 'MW-FIELD', name: 'MoonWitness Field Station Depot', loc: 'Field Observation Bay' }
  ]
  for (const w of warehouseSeeds) {
    const rows = await Warehouse.fetch(Warehouse, env, [['code', '=', w.code]])
    if (!rows.length) {
      await Warehouse.spawn(Warehouse, env, {
        code: w.code,
        name: w.name,
        lotStockId: locIds[w.loc] || undefined
      })
    }
  }

  console.log('[moon-stock] Demo data loaded: 3 locations, 2 warehouses')
}
