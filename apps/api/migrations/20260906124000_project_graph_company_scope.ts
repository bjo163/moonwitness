import type { Knex } from 'knex'

const tables = ['pj_stage', 'pj_milestone', 'pj_sprint', 'pj_tag']

export async function up(db: Knex): Promise<void> {
  for (const table of tables) {
    if (!(await db.schema.hasColumn(table, 'company_id'))) {
      await db.schema.alterTable(table, (t) => {
        t.integer('company_id').unsigned().nullable().index()
        t.foreign('company_id').references('id').inTable('vx_org').onDelete('SET NULL')
      })
    }
  }
  for (const table of ['pj_stage', 'pj_milestone', 'pj_sprint']) {
    await db.raw(`UPDATE "${table}" child SET "company_id" = project."company_id" FROM "pj_project" project WHERE child."project_id" = project."id" AND child."company_id" IS NULL`)
  }
  await db.raw('UPDATE "pj_tag" tag SET "company_id" = org.id FROM "vx_org" org WHERE tag."company_id" IS NULL AND org.id = (SELECT MIN(id) FROM "vx_org")')
}

export async function down(db: Knex): Promise<void> {
  for (const table of tables) {
    if (await db.schema.hasColumn(table, 'company_id')) await db.schema.alterTable(table, (t) => t.dropColumn('company_id'))
  }
}
