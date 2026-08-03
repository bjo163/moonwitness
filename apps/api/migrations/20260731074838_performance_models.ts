import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // px.request - HTTP Request Performance Metrics
  await knex.schema.createTable('px_request', (table) => {
    table.increments('id').primary();
    table.string('method', 10).notNullable().index();
    table.text('path').notNullable();
    table.float('latency_ms').notNullable();
    table.integer('status_code').notNullable().index();
    table.string('cache_status', 10).defaultTo('N/A').index();
    table.text('user_agent');
    table.string('ip_address', 50);
    table.integer('request_size');
    table.integer('response_size');
    table.text('error_message');
    table.timestamp('timestamp').defaultTo(knex.fn.now()).index();
  });

  // px.cache - Cache Performance Statistics
  await knex.schema.createTable('px_cache', (table) => {
    table.increments('id').primary();
    table.string('cache_key', 500).notNullable().index();
    table.integer('hit_count').defaultTo(0);
    table.integer('miss_count').defaultTo(0);
    table.integer('stale_count').defaultTo(0);
    table.float('hit_rate');
    table.float('avg_latency_ms');
    table.integer('ttl_seconds');
    table.integer('cache_size');
    table.timestamp('period_start').index();
    table.timestamp('period_end').index();
    table.timestamp('last_access');
  });

  // px.query - Database Query Performance Metrics
  await knex.schema.createTable('px_query', (table) => {
    table.increments('id').primary();
    table.string('model', 100).notNullable().index();
    table.string('operation', 20).notNullable().index();
    table.float('execution_ms').notNullable().index();
    table.boolean('is_slow').defaultTo(false).index();
    table.string('query_hash', 64).index();
    table.integer('record_count');
    table.integer('user_id').unsigned().references('id').inTable('vx_user');
    table.text('stack_trace');
    table.boolean('had_error').defaultTo(false).index();
    table.text('error_message');
    table.timestamp('timestamp').defaultTo(knex.fn.now()).index();
  });

  // px.system - System Resource Metrics
  await knex.schema.createTable('px_system', (table) => {
    table.increments('id').primary();
    table.float('memory_used_mb');
    table.float('memory_total_mb');
    table.float('memory_usage_percent');
    table.float('cpu_usage_percent');
    table.float('event_loop_lag_ms');
    table.integer('active_connections');
    table.integer('total_connections');
    table.integer('db_pool_active');
    table.integer('db_pool_idle');
    table.integer('uptime_seconds');
    table.timestamp('timestamp').defaultTo(knex.fn.now()).index();
  });

  console.log('✓ Created performance monitoring tables');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('px_system');
  await knex.schema.dropTableIfExists('px_query');
  await knex.schema.dropTableIfExists('px_cache');
  await knex.schema.dropTableIfExists('px_request');
  console.log('✓ Dropped performance monitoring tables');
}
