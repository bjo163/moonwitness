import type { Knex } from 'knex'

export async function up(db: Knex): Promise<void> {
  for (const table of ['pj_project', 'pj_task']) {
    if (!(await db.schema.hasColumn(table, 'company_id'))) {
      await db.schema.alterTable(table, (t) => {
        t.integer('company_id').unsigned().nullable().index()
        t.foreign('company_id').references('id').inTable('vx_org').onDelete('SET NULL')
      })
    }
  }
  await db.raw('UPDATE "pj_project" p SET "company_id" = u."company_id" FROM "vx_user" u WHERE p."owner_id" = u."id" AND p."company_id" IS NULL')
  await db.raw('UPDATE "pj_task" t SET "company_id" = p."company_id" FROM "pj_project" p WHERE t."project_id" = p."id" AND t."company_id" IS NULL')
}

export async function down(db: Knex): Promise<void> {
  for (const table of ['pj_task', 'pj_project']) {
    if (await db.schema.hasColumn(table, 'company_id')) {
      await db.schema.alterTable(table, (t) => t.dropColumn('company_id'))
    }
  }
}
