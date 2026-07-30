import knex from 'knex';

async function main() {
  const db = knex({
    client: 'pg',
    connection: 'postgres://postgres:Youknowm%403@localhost:5432/moonwitness'
  });

  const query = `
    DO $$ DECLARE
        r RECORD;
    BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
            EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
    END $$;
  `;

  await db.raw(query);
  console.log('All tables dropped');
  process.exit(0);
}

main();
