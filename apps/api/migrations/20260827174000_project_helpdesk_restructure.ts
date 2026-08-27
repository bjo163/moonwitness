import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  // ── 1. Project Models (pj_*) ──
  if (!(await knex.schema.hasTable("pj_project"))) {
    if (await knex.schema.hasTable("cab_project")) {
      // If cab_project exists, create pj_project by copying or creating
      await knex.schema.createTable("pj_project", (table) => {
        table.increments("id").primary()
        table.string("name", 180).notNullable().index()
        table.string("code", 32).notNullable().unique().index()
        table.text("summary")
        table.integer("owner_id").unsigned().references("id").inTable("vx_user")
        table.string("status", 20).defaultTo("planned").index()
        table.date("start_date")
        table.date("end_date")
        table.boolean("is_active").defaultTo(true).index()
        table.timestamp("created_at").defaultTo(knex.fn.now())
        table.timestamp("updated_at").defaultTo(knex.fn.now())
      })
    } else {
      await knex.schema.createTable("pj_project", (table) => {
        table.increments("id").primary()
        table.string("name", 180).notNullable().index()
        table.string("code", 32).notNullable().unique().index()
        table.text("summary")
        table.integer("owner_id").unsigned().references("id").inTable("vx_user")
        table.string("status", 20).defaultTo("planned").index()
        table.date("start_date")
        table.date("end_date")
        table.boolean("is_active").defaultTo(true).index()
        table.timestamp("created_at").defaultTo(knex.fn.now())
        table.timestamp("updated_at").defaultTo(knex.fn.now())
      })
    }
  }

  if (!(await knex.schema.hasTable("pj_stage"))) {
    await knex.schema.createTable("pj_stage", (table) => {
      table.increments("id").primary()
      table.string("name", 80).notNullable()
      table.integer("sequence").defaultTo(1)
      table.integer("project_id").unsigned().notNullable().references("id").inTable("pj_project")
      table.boolean("fold").defaultTo(false)
      table.boolean("is_closing").defaultTo(false)
      table.boolean("is_active").defaultTo(true).index()
      table.timestamp("created_at").defaultTo(knex.fn.now())
      table.timestamp("updated_at").defaultTo(knex.fn.now())
    })
  }

  if (!(await knex.schema.hasTable("pj_milestone"))) {
    await knex.schema.createTable("pj_milestone", (table) => {
      table.increments("id").primary()
      table.string("name", 120).notNullable()
      table.integer("project_id").unsigned().notNullable().references("id").inTable("pj_project")
      table.date("deadline").index()
      table.boolean("is_reached").defaultTo(false)
      table.boolean("is_active").defaultTo(true).index()
      table.timestamp("created_at").defaultTo(knex.fn.now())
      table.timestamp("updated_at").defaultTo(knex.fn.now())
    })
  }

  if (!(await knex.schema.hasTable("pj_sprint"))) {
    await knex.schema.createTable("pj_sprint", (table) => {
      table.increments("id").primary()
      table.string("name", 80).notNullable()
      table.integer("project_id").unsigned().notNullable().references("id").inTable("pj_project")
      table.date("start_date")
      table.date("end_date")
      table.string("status", 20).defaultTo("draft").index()
      table.boolean("is_active").defaultTo(true).index()
      table.timestamp("created_at").defaultTo(knex.fn.now())
      table.timestamp("updated_at").defaultTo(knex.fn.now())
    })
  }

  if (!(await knex.schema.hasTable("pj_tag"))) {
    await knex.schema.createTable("pj_tag", (table) => {
      table.increments("id").primary()
      table.string("name", 40).notNullable().unique()
      table.string("color", 7).defaultTo("#00F0FF")
      table.boolean("is_active").defaultTo(true).index()
      table.timestamp("created_at").defaultTo(knex.fn.now())
      table.timestamp("updated_at").defaultTo(knex.fn.now())
    })
  }

  if (!(await knex.schema.hasTable("pj_task"))) {
    await knex.schema.createTable("pj_task", (table) => {
      table.increments("id").primary()
      table.string("title", 180).notNullable().index()
      table.text("description")
      table.integer("project_id").unsigned().notNullable().references("id").inTable("pj_project")
      table.integer("stage_id").unsigned().references("id").inTable("pj_stage")
      table.integer("assignee_id").unsigned().references("id").inTable("vx_user")
      table.string("priority", 20).defaultTo("normal").index()
      table.integer("sprint_id").unsigned().references("id").inTable("pj_sprint")
      table.integer("milestone_id").unsigned().references("id").inTable("pj_milestone")
      table.integer("ticket_id").unsigned()
      table.float("estimated_hours").defaultTo(0)
      table.date("due_date").index()
      table.boolean("is_active").defaultTo(true).index()
      table.timestamp("created_at").defaultTo(knex.fn.now())
      table.timestamp("updated_at").defaultTo(knex.fn.now())
    })
  }

  if (!(await knex.schema.hasTable("pj_task_tag_rel"))) {
    await knex.schema.createTable("pj_task_tag_rel", (table) => {
      table.integer("pj_task_id").unsigned().references("id").inTable("pj_task").onDelete("CASCADE")
      table.integer("pj_tag_id").unsigned().references("id").inTable("pj_tag").onDelete("CASCADE")
      table.primary(["pj_task_id", "pj_tag_id"])
    })
  }

  // ── 2. Helpdesk Models (hd_*) ──
  if (!(await knex.schema.hasTable("hd_team"))) {
    await knex.schema.createTable("hd_team", (table) => {
      table.increments("id").primary()
      table.string("name", 120).notNullable().index()
      table.string("code", 32).notNullable().unique().index()
      table.integer("leader_id").unsigned().references("id").inTable("vx_user")
      table.text("description")
      table.boolean("is_active").defaultTo(true).index()
      table.timestamp("created_at").defaultTo(knex.fn.now())
      table.timestamp("updated_at").defaultTo(knex.fn.now())
    })
  }

  if (!(await knex.schema.hasTable("hd_team_member_rel"))) {
    await knex.schema.createTable("hd_team_member_rel", (table) => {
      table.integer("hd_team_id").unsigned().references("id").inTable("hd_team").onDelete("CASCADE")
      table.integer("vx_user_id").unsigned().references("id").inTable("vx_user").onDelete("CASCADE")
      table.primary(["hd_team_id", "vx_user_id"])
    })
  }

  if (!(await knex.schema.hasTable("hd_stage"))) {
    await knex.schema.createTable("hd_stage", (table) => {
      table.increments("id").primary()
      table.string("name", 80).notNullable()
      table.integer("sequence").defaultTo(1)
      table.integer("team_id").unsigned().notNullable().references("id").inTable("hd_team")
      table.boolean("fold").defaultTo(false)
      table.boolean("is_closing").defaultTo(false)
      table.boolean("is_active").defaultTo(true).index()
      table.timestamp("created_at").defaultTo(knex.fn.now())
      table.timestamp("updated_at").defaultTo(knex.fn.now())
    })
  }

  if (!(await knex.schema.hasTable("hd_sla"))) {
    await knex.schema.createTable("hd_sla", (table) => {
      table.increments("id").primary()
      table.string("name", 80).notNullable()
      table.integer("team_id").unsigned().notNullable().references("id").inTable("hd_team")
      table.string("priority", 20).notNullable().index()
      table.float("response_hours").notNullable()
      table.float("resolution_hours").notNullable()
      table.boolean("is_active").defaultTo(true).index()
      table.timestamp("created_at").defaultTo(knex.fn.now())
      table.timestamp("updated_at").defaultTo(knex.fn.now())
    })
  }

  if (!(await knex.schema.hasTable("hd_tag"))) {
    await knex.schema.createTable("hd_tag", (table) => {
      table.increments("id").primary()
      table.string("name", 40).notNullable().unique()
      table.string("color", 7).defaultTo("#00F0FF")
      table.boolean("is_active").defaultTo(true).index()
      table.timestamp("created_at").defaultTo(knex.fn.now())
      table.timestamp("updated_at").defaultTo(knex.fn.now())
    })
  }

  if (!(await knex.schema.hasTable("hd_ticket"))) {
    await knex.schema.createTable("hd_ticket", (table) => {
      table.increments("id").primary()
      table.string("reference", 32).notNullable().unique().index()
      table.string("title", 180).notNullable().index()
      table.text("description")
      table.integer("team_id").unsigned().notNullable().references("id").inTable("hd_team")
      table.integer("stage_id").unsigned().references("id").inTable("hd_stage")
      table.integer("assignee_id").unsigned().references("id").inTable("vx_user")
      table.integer("partner_id").unsigned().references("id").inTable("vx_node")
      table.integer("project_id").unsigned().references("id").inTable("pj_project")
      table.string("priority", 20).defaultTo("normal").index()
      table.integer("sla_id").unsigned().references("id").inTable("hd_sla")
      table.timestamp("sla_deadline").index()
      table.string("sla_status", 20).defaultTo("on_track").index()
      table.integer("change_id").unsigned()
      table.boolean("is_active").defaultTo(true).index()
      table.timestamp("created_at").defaultTo(knex.fn.now())
      table.timestamp("updated_at").defaultTo(knex.fn.now())
    })
  }

  if (!(await knex.schema.hasTable("hd_ticket_tag_rel"))) {
    await knex.schema.createTable("hd_ticket_tag_rel", (table) => {
      table.integer("hd_ticket_id").unsigned().references("id").inTable("hd_ticket").onDelete("CASCADE")
      table.integer("hd_tag_id").unsigned().references("id").inTable("hd_tag").onDelete("CASCADE")
      table.primary(["hd_ticket_id", "hd_tag_id"])
    })
  }

  // ── 3. Update cab_change Foreign Key ──
  if (await knex.schema.hasTable("cab_change")) {
    try {
      await knex.raw('ALTER TABLE "cab_change" DROP CONSTRAINT IF EXISTS "cab_change_project_id_fkey"')
    } catch (_) {}

    try {
      await knex.raw('ALTER TABLE "cab_change" ADD CONSTRAINT "cab_change_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "pj_project"("id") ON DELETE SET NULL')
    } catch (_) {}

    const hasTicketId = await knex.schema.hasColumn("cab_change", "ticket_id")
    if (!hasTicketId) {
      await knex.schema.alterTable("cab_change", (table) => {
        table.integer("ticket_id").unsigned().references("id").inTable("hd_ticket")
      })
    }
  }

  console.log("✓ Project, Helpdesk, and CAB governance schema migration completed")
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("hd_ticket_tag_rel")
  await knex.schema.dropTableIfExists("hd_ticket")
  await knex.schema.dropTableIfExists("hd_tag")
  await knex.schema.dropTableIfExists("hd_sla")
  await knex.schema.dropTableIfExists("hd_stage")
  await knex.schema.dropTableIfExists("hd_team_member_rel")
  await knex.schema.dropTableIfExists("hd_team")
  await knex.schema.dropTableIfExists("pj_task_tag_rel")
  await knex.schema.dropTableIfExists("pj_task")
  await knex.schema.dropTableIfExists("pj_tag")
  await knex.schema.dropTableIfExists("pj_sprint")
  await knex.schema.dropTableIfExists("pj_milestone")
  await knex.schema.dropTableIfExists("pj_stage")
  await knex.schema.dropTableIfExists("pj_project")
}
