import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  const exists = async (table: string) => await knex.schema.hasTable(table)

  if (!(await exists("vx_zone"))) {
    await knex.schema.createTable("vx_zone", (table) => {
      table.increments("id").primary()
      table.string("name", 120).notNullable()
      table.string("native_name", 120)
      table.string("code", 2).notNullable().unique().index()
      table.string("code3", 3).unique().index()
      table.string("number_code", 3)
      table.string("continent", 40)
      table.string("capital", 80)
      table.string("dial_code", 20)
      table.string("flag_emoji", 10)
      table.string("currency_code", 3)
      table.float("lat")
      table.float("lng")
      table.boolean("active").defaultTo(true).index()
      table.timestamp("created_at").defaultTo(knex.fn.now())
      table.timestamp("updated_at").defaultTo(knex.fn.now())
    })
  }

  if (!(await exists("vx_coin"))) {
    await knex.schema.createTable("vx_coin", (table) => {
      table.increments("id").primary()
      table.string("name", 80).notNullable()
      table.string("symbol", 10).notNullable()
      table.string("code", 3).notNullable().unique().index()
      table.string("number_code", 3)
      table.integer("decimals").defaultTo(2)
      table.float("rounding").defaultTo(0.01)
      table.boolean("active").defaultTo(true).index()
      table.timestamp("created_at").defaultTo(knex.fn.now())
      table.timestamp("updated_at").defaultTo(knex.fn.now())
    })
  }

  if (!(await exists("vx_role"))) {
    await knex.schema.createTable("vx_role", (table) => {
      table.increments("id").primary()
      table.string("name").notNullable()
      table.timestamp("created_at").defaultTo(knex.fn.now())
      table.timestamp("updated_at").defaultTo(knex.fn.now())
    })
  }

  if (!(await exists("mx_model"))) {
    await knex.schema.createTable("mx_model", (table) => {
      table.increments("id").primary()
      table.string("model").notNullable().unique()
      table.string("name").notNullable()
      table.timestamp("created_at").defaultTo(knex.fn.now())
      table.timestamp("updated_at").defaultTo(knex.fn.now())
    })
  }

  if (!(await exists("ix_lang"))) {
    await knex.schema.createTable("ix_lang", (table) => {
      table.increments("id").primary()
      table.string("name", 80).notNullable()
      table.string("native_name", 80)
      table.string("code", 10).notNullable().unique().index()
      table.string("iso_code", 16)
      table.string("url_code", 16)
      table.string("script", 20)
      table.string("direction", 10).notNullable().defaultTo("ltr")
      table.boolean("active").defaultTo(true).index()
      table.timestamp("created_at").defaultTo(knex.fn.now())
      table.timestamp("updated_at").defaultTo(knex.fn.now())
    })
  }

  if (!(await exists("ix_dict"))) {
    await knex.schema.createTable("ix_dict", (table) => {
      table.increments("id").primary()
      table.string("name").notNullable().index()
      table.integer("res_id").unsigned().index()
      table.string("lang").notNullable().index()
      table.string("type").notNullable().index()
      table.text("src").notNullable()
      table.text("value")
      table.string("module").index()
      table.string("state", 20).defaultTo("to_translate")
      table.timestamp("created_at").defaultTo(knex.fn.now())
      table.timestamp("updated_at").defaultTo(knex.fn.now())
    })
  }

  if (!(await exists("mx_metric"))) {
    await knex.schema.createTable("mx_metric", (table) => {
      table.increments("id").primary()
      table.string("name", 120).notNullable().index()
      table.float("value").notNullable()
      table.timestamp("timestamp").defaultTo(knex.fn.now()).index()
      table.timestamp("created_at").defaultTo(knex.fn.now())
      table.timestamp("updated_at").defaultTo(knex.fn.now())
    })
  }

  if (!(await exists("fx_session"))) {
    await knex.schema.createTable("fx_session", (table) => {
      table.increments("id").primary()
      table.string("client_id").notNullable().index()
      table.string("ip_address").index()
      table.text("user_agent")
      table.string("country").index()
      table.timestamp("connected_at").defaultTo(knex.fn.now()).index()
      table.timestamp("disconnected_at").index()
      table.timestamp("created_at").defaultTo(knex.fn.now())
      table.timestamp("updated_at").defaultTo(knex.fn.now())
    })
  }

  if (!(await exists("ix_timezone"))) {
    await knex.schema.createTable("ix_timezone", (table) => {
      table.increments("id").primary()
      table.string("name", 80).notNullable().unique().index()
      table.string("tz_name", 20)
      table.string("utc_offset", 10).notNullable()
      table.string("country_code", 2).index()
      table.timestamp("created_at").defaultTo(knex.fn.now())
      table.timestamp("updated_at").defaultTo(knex.fn.now())
    })
  }

  if (!(await exists("ir_model_data"))) {
    await knex.schema.createTable("ir_model_data", (table) => {
      table.increments("id").primary()
      table.string("name", 120).notNullable().index()
      table.string("module", 80).notNullable().index()
      table.string("model", 120).notNullable().index()
      table.integer("res_id").unsigned().notNullable().index()
      table.boolean("noupdate").defaultTo(false)
      table.timestamp("created_at").defaultTo(knex.fn.now())
      table.timestamp("updated_at").defaultTo(knex.fn.now())
    })
  }

  if (!(await exists("ir_config_parameter"))) {
    await knex.schema.createTable("ir_config_parameter", (table) => {
      table.increments("id").primary()
      table.string("key", 120).notNullable().unique().index()
      table.text("value").notNullable()
      table.timestamp("created_at").defaultTo(knex.fn.now())
      table.timestamp("updated_at").defaultTo(knex.fn.now())
    })
  }

  if (!(await exists("ir_report"))) {
    await knex.schema.createTable("ir_report", (table) => {
      table.increments("id").primary()
      table.string("name", 180).notNullable().index()
      table.string("model", 120).notNullable().index()
      table.string("report_type", 20).notNullable().index()
      table.string("orientation", 20).notNullable().defaultTo("portrait")
      table.string("header_title", 180)
      table.text("footer_notice")
      table.boolean("show_qr_code").defaultTo(true)
      table.boolean("active").defaultTo(true).index()
      table.timestamp("created_at").defaultTo(knex.fn.now())
      table.timestamp("updated_at").defaultTo(knex.fn.now())
    })
  }

  if (!(await exists("vx_node"))) {
    await knex.schema.createTable("vx_node", (table) => {
      table.increments("id").primary()
      table.string("name", 120).notNullable()
      table.string("email", 120).unique().index()
      table.string("phone", 40)
      table.string("mobile", 40)
      table.string("street", 120)
      table.string("street2", 120)
      table.string("city", 80)
      table.string("zip", 20)
      table.integer("country_id").unsigned().index()
      table.integer("company_id").unsigned().index()
      table.integer("parent_id").unsigned().index()
      table.boolean("is_company").defaultTo(false)
      table.timestamp("created_at").defaultTo(knex.fn.now())
      table.timestamp("updated_at").defaultTo(knex.fn.now())
      table.timestamp("deleted_at")
      table.foreign("country_id").references("id").inTable("vx_zone")
      table.foreign("parent_id").references("id").inTable("vx_node")
    })
  }

  if (!(await exists("vx_org"))) {
    await knex.schema.createTable("vx_org", (table) => {
      table.increments("id").primary()
      table.integer("partner_id").unsigned().index()
      table.string("name", 120).notNullable()
      table.string("email", 120)
      table.string("phone", 40)
      table.string("website", 120)
      table.integer("currency_id").unsigned().index()
      table.timestamp("created_at").defaultTo(knex.fn.now())
      table.timestamp("updated_at").defaultTo(knex.fn.now())
      table.foreign("partner_id").references("id").inTable("vx_node")
      table.foreign("currency_id").references("id").inTable("vx_coin")
    })
  }

  if ((await exists("vx_node")) && (await exists("vx_org"))) {
    await knex.schema.alterTable("vx_node", (table) => {
      table.foreign("company_id").references("id").inTable("vx_org")
    })
  }

  if (!(await exists("vx_user"))) {
    await knex.schema.createTable("vx_user", (table) => {
      table.increments("id").primary()
      table.integer("partner_id").unsigned().notNullable().index()
      table.string("login", 120).unique().index()
      table.string("password", 255).notNullable()
      table.integer("company_id").unsigned().index()
      table.string("nickname", 50)
      table.string("github_url", 100)
      table.integer("token_version").defaultTo(1)
      table.boolean("two_factor_enabled").defaultTo(false).index()
      table.string("two_factor_secret", 64)
      table.text("recovery_codes")
      table.timestamp("created_at").defaultTo(knex.fn.now())
      table.timestamp("updated_at").defaultTo(knex.fn.now())
      table.timestamp("deleted_at")
      table.timestamp("otp_expires")
      table.foreign("partner_id").references("id").inTable("vx_node")
      table.foreign("company_id").references("id").inTable("vx_org")
    })
  }

  if (!(await exists("fx_msg"))) {
    await knex.schema.createTable("fx_msg", (table) => {
      table.increments("id").primary()
      table.string("res_model").notNullable().index()
      table.integer("res_id").unsigned().notNullable().index()
      table.string("message_type", 20).defaultTo("notification")
      table.text("body")
      table.integer("author_id").unsigned().index()
      table.timestamp("created_at").defaultTo(knex.fn.now())
      table.timestamp("updated_at").defaultTo(knex.fn.now())
      table.foreign("author_id").references("id").inTable("vx_user")
    })
  }

  if (!(await exists("fx_track"))) {
    await knex.schema.createTable("fx_track", (table) => {
      table.increments("id").primary()
      table.integer("message_id").unsigned().notNullable().index()
      table.string("field_name").notNullable()
      table.text("old_value")
      table.text("new_value")
      table.timestamp("created_at").defaultTo(knex.fn.now())
      table.timestamp("updated_at").defaultTo(knex.fn.now())
      table.foreign("message_id").references("id").inTable("fx_msg")
    })
  }

  if (!(await exists("vx_auth_challenge"))) {
    await knex.schema.createTable("vx_auth_challenge", (table) => {
      table.increments("id").primary()
      table.integer("user_id").unsigned().notNullable().index()
      table.string("purpose", 30).notNullable().defaultTo("password_recovery")
      table.string("token_hash", 128).notNullable().index()
      table.timestamp("expires_at").notNullable()
      table.integer("attempts").defaultTo(0)
      table.integer("max_attempts").defaultTo(5)
      table.timestamp("consumed_at")
      table.timestamp("created_at").defaultTo(knex.fn.now())
      table.timestamp("updated_at").defaultTo(knex.fn.now())
      table.foreign("user_id").references("id").inTable("vx_user")
    })
  }

  if (!(await exists("vx_zone_subdivision"))) {
    await knex.schema.createTable("vx_zone_subdivision", (table) => {
      table.increments("id").primary()
      table.string("name", 120).notNullable()
      table.string("code", 20).notNullable().unique().index()
      table.integer("country_id").unsigned().notNullable().index()
      table.string("type", 20).defaultTo("province")
      table.timestamp("created_at").defaultTo(knex.fn.now())
      table.timestamp("updated_at").defaultTo(knex.fn.now())
      table.foreign("country_id").references("id").inTable("vx_zone")
    })
  }

  if (!(await exists("mx_grant"))) {
    await knex.schema.createTable("mx_grant", (table) => {
      table.increments("id").primary()
      table.string("name").notNullable()
      table.integer("model_id").unsigned().notNullable().index()
      table.integer("group_id").unsigned().notNullable().index()
      table.boolean("perm_read").defaultTo(false)
      table.boolean("perm_write").defaultTo(false)
      table.boolean("perm_create").defaultTo(false)
      table.boolean("perm_unlink").defaultTo(false)
      table.timestamp("created_at").defaultTo(knex.fn.now())
      table.timestamp("updated_at").defaultTo(knex.fn.now())
      table.foreign("model_id").references("id").inTable("mx_model")
      table.foreign("group_id").references("id").inTable("vx_role")
    })
  }

  if (!(await exists("mx_rule"))) {
    await knex.schema.createTable("mx_rule", (table) => {
      table.increments("id").primary()
      table.string("name", 120).notNullable()
      table.integer("model_id").unsigned().notNullable().index()
      table.text("domain_force").notNullable()
      table.boolean("active").defaultTo(true).index()
      table.boolean("perm_read").defaultTo(true)
      table.boolean("perm_write").defaultTo(true)
      table.boolean("perm_create").defaultTo(true)
      table.boolean("perm_unlink").defaultTo(true)
      table.timestamp("created_at").defaultTo(knex.fn.now())
      table.timestamp("updated_at").defaultTo(knex.fn.now())
      table.foreign("model_id").references("id").inTable("mx_model")
    })
  }

  if (!(await exists("ir_sequence"))) {
    await knex.schema.createTable("ir_sequence", (table) => {
      table.increments("id").primary()
      table.string("name", 120).notNullable()
      table.string("code", 80).notNullable().unique().index()
      table.string("prefix", 40)
      table.string("suffix", 40)
      table.integer("padding").defaultTo(4)
      table.integer("number_next").defaultTo(1)
      table.integer("number_increment").defaultTo(1)
      table.integer("company_id").unsigned().index()
      table.timestamp("created_at").defaultTo(knex.fn.now())
      table.timestamp("updated_at").defaultTo(knex.fn.now())
      table.foreign("company_id").references("id").inTable("vx_org")
    })
  }

  if (!(await exists("ir_attachment"))) {
    await knex.schema.createTable("ir_attachment", (table) => {
      table.increments("id").primary()
      table.string("name", 255).notNullable()
      table.string("res_model", 120).index()
      table.integer("res_id").unsigned().index()
      table.string("mimetype", 120)
      table.integer("file_size")
      table.string("url", 500)
      table.string("checksum", 64)
      table.integer("company_id").unsigned().index()
      table.timestamp("created_at").defaultTo(knex.fn.now())
      table.timestamp("updated_at").defaultTo(knex.fn.now())
      table.foreign("company_id").references("id").inTable("vx_org")
    })
  }

  if (!(await exists("ir_version"))) {
    await knex.schema.createTable("ir_version", (table) => {
      table.increments("id").primary()
      table.string("res_model", 120).notNullable().index()
      table.integer("res_id").unsigned().notNullable().index()
      table.integer("user_id").unsigned().index()
      table.string("summary", 250).defaultTo("Record updated")
      table.text("changed_fields")
      table.text("old_values")
      table.text("new_values")
      table.timestamp("created_at").defaultTo(knex.fn.now())
      table.timestamp("updated_at").defaultTo(knex.fn.now())
      table.foreign("user_id").references("id").inTable("vx_user")
    })
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("ir_version")
  await knex.schema.dropTableIfExists("ir_attachment")
  await knex.schema.dropTableIfExists("ir_sequence")
  await knex.schema.dropTableIfExists("ir_config_parameter")
  await knex.schema.dropTableIfExists("ir_model_data")
  await knex.schema.dropTableIfExists("ix_timezone")
  await knex.schema.dropTableIfExists("vx_auth_challenge")
  await knex.schema.dropTableIfExists("fx_session")
  await knex.schema.dropTableIfExists("mx_metric")
  await knex.schema.dropTableIfExists("fx_track")
  await knex.schema.dropTableIfExists("fx_msg")
  await knex.schema.dropTableIfExists("ix_dict")
  await knex.schema.dropTableIfExists("ix_lang")
  await knex.schema.dropTableIfExists("mx_rule")
  await knex.schema.dropTableIfExists("mx_grant")
  await knex.schema.dropTableIfExists("mx_model")
  await knex.schema.dropTableIfExists("vx_role")
  await knex.schema.dropTableIfExists("vx_zone_subdivision")
  await knex.schema.dropTableIfExists("ir_report")
  await knex.schema.dropTableIfExists("vx_coin")
  await knex.schema.dropTableIfExists("vx_org")
  await knex.schema.dropTableIfExists("vx_node")
  await knex.schema.dropTableIfExists("vx_user")
  await knex.schema.dropTableIfExists("vx_zone")
}
