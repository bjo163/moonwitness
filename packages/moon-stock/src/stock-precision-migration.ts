import type { getDb } from '@moon/orm'
type Database = ReturnType<typeof getDb>
export async function migrateStockPrecision(db: Database): Promise<void> {
  await db.transaction(async trx => {
    await trx.raw('SELECT pg_advisory_xact_lock(?, ?)', [1297040211, -1])
    await trx.raw('LOCK TABLE stock_move, stock_quant, stock_location IN ACCESS EXCLUSIVE MODE')
    const schema = (await trx.raw('SELECT current_schema() AS name')).rows[0].name
    for (const [table, names] of [['stock_move', ['product_uom_qty']], ['stock_quant', ['quantity', 'reserved_quantity']] ] as const) {
      const columns = await trx('information_schema.columns').where({ table_schema: schema, table_name: table }).whereIn('column_name', [...names]).select('data_type', 'numeric_precision', 'numeric_scale')
      const populated = await trx(table).first('id'), exact = columns.length === names.length && columns.every((column: any) => column.data_type === 'numeric' && column.numeric_precision === 38 && column.numeric_scale === 12)
      if (populated && !exact) throw new Error(`Reconcile populated legacy ${table} quantities before precision migration; automatic float conversion is refused`)
    }
    if (!await trx.schema.hasColumn('stock_move', 'company_id')) { if (await trx('stock_move').first('id')) throw new Error('Reconcile legacy stock move company ownership before migration'); await trx.schema.alterTable('stock_move', table => { table.integer('company_id').references('id').inTable('vx_org') }) }
    if (await trx('stock_move').whereNull('company_id').first('id') || await trx('stock_quant').whereNull('company_id').first('id')) throw new Error('Reconcile missing stock company ownership before migration')
    await trx.raw(`ALTER TABLE stock_move ALTER COLUMN product_uom_qty TYPE numeric(38,12) USING product_uom_qty::numeric(38,12), ALTER COLUMN product_uom_qty SET NOT NULL, ALTER COLUMN company_id SET NOT NULL, ALTER COLUMN product_id SET NOT NULL, ALTER COLUMN location_id SET NOT NULL, ALTER COLUMN location_dest_id SET NOT NULL, ALTER COLUMN state SET NOT NULL`)
    await trx.raw(`ALTER TABLE stock_quant ALTER COLUMN quantity TYPE numeric(38,12) USING quantity::numeric(38,12), ALTER COLUMN reserved_quantity TYPE numeric(38,12) USING reserved_quantity::numeric(38,12), ALTER COLUMN quantity SET NOT NULL, ALTER COLUMN reserved_quantity SET NOT NULL, ALTER COLUMN company_id SET NOT NULL, ALTER COLUMN product_id SET NOT NULL, ALTER COLUMN location_id SET NOT NULL`)
    const definitions: Record<string, string> = {
      stock_location_company_unique: 'ALTER TABLE stock_location ADD CONSTRAINT stock_location_company_unique UNIQUE (id, company_id)',
      stock_quant_location_company_fk: 'ALTER TABLE stock_quant ADD CONSTRAINT stock_quant_location_company_fk FOREIGN KEY (location_id, company_id) REFERENCES stock_location(id, company_id)',
      stock_move_location_company_fk: 'ALTER TABLE stock_move ADD CONSTRAINT stock_move_location_company_fk FOREIGN KEY (location_id, company_id) REFERENCES stock_location(id, company_id)',
      stock_move_destination_company_fk: 'ALTER TABLE stock_move ADD CONSTRAINT stock_move_destination_company_fk FOREIGN KEY (location_dest_id, company_id) REFERENCES stock_location(id, company_id)',
      stock_quant_scope_unique: 'ALTER TABLE stock_quant ADD CONSTRAINT stock_quant_scope_unique UNIQUE (company_id, product_id, location_id)',
      stock_quant_available_check: "ALTER TABLE stock_quant ADD CONSTRAINT stock_quant_available_check CHECK (quantity <> 'NaN'::numeric AND reserved_quantity <> 'NaN'::numeric AND quantity >= 0 AND reserved_quantity >= 0 AND reserved_quantity <= quantity)",
      stock_move_quantity_check: "ALTER TABLE stock_move ADD CONSTRAINT stock_move_quantity_check CHECK (product_uom_qty <> 'NaN'::numeric AND product_uom_qty >= 0)"
    }
    for (const [name, sql] of Object.entries(definitions)) if (!await trx('information_schema.table_constraints').where({ constraint_schema: schema, constraint_name: name }).first()) await trx.raw(sql)
    for (const prefix of ['reserved', 'completed', 'cancelled']) {
      if (!await trx.schema.hasColumn('stock_move', `${prefix}_by`)) await trx.schema.alterTable('stock_move', table => { table.integer(`${prefix}_by`).references('id').inTable('vx_user') })
      if (!await trx.schema.hasColumn('stock_move', `${prefix}_at`)) await trx.schema.alterTable('stock_move', table => { table.timestamp(`${prefix}_at`, { useTz: true }) })
    }
  })
}
