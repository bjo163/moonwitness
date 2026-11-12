import assert from "node:assert/strict"
import { closeDb, getDb, setupOrm } from "@moon/orm"

const databaseUrl = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL

if (!databaseUrl?.startsWith("postgres")) {
  throw new Error("PostgreSQL certification requires TEST_DATABASE_URL or DATABASE_URL")
}

async function certifyPgvector() {
  setupOrm(databaseUrl as string)
  const db = getDb()

  try {
    const extensionResult = await db.raw(
      "SELECT extversion FROM pg_extension WHERE extname = 'vector'"
    )
    const extensions = (extensionResult as { rows?: Array<{ extversion: string }> }).rows ?? []
    assert.equal(extensions.length, 1, "The vector extension must be installed")
    assert.match(extensions[0]?.extversion ?? "", /^\d+\.\d+/)

    await db.raw(`
      CREATE TEMP TABLE moonwitness_vector_certification (
        id integer PRIMARY KEY,
        embedding vector(3) NOT NULL
      )
    `)
    await db.raw(`
      CREATE INDEX moonwitness_vector_certification_hnsw_idx
      ON moonwitness_vector_certification
      USING hnsw (embedding vector_cosine_ops)
    `)
    await db.raw(
      `INSERT INTO moonwitness_vector_certification (id, embedding)
       VALUES (?, ?::vector), (?, ?::vector), (?, ?::vector)`,
      [1, "[1,0,0]", 2, "[0,1,0]", 3, "[-1,0,0]"]
    )

    const result = await db.raw(
      `SELECT id, embedding <=> ?::vector AS cosine_distance
       FROM moonwitness_vector_certification
       ORDER BY embedding <=> ?::vector
       LIMIT 3`,
      ["[1,0,0]", "[1,0,0]"]
    )
    const neighbors = (result as {
      rows?: Array<{ id: number; cosine_distance: number | string }>
    }).rows ?? []

    assert.deepEqual(neighbors.map(({ id }) => id), [1, 2, 3])
    assert.ok(Math.abs(Number(neighbors[0]?.cosine_distance) - 0) < 1e-6)
    assert.ok(Math.abs(Number(neighbors[1]?.cosine_distance) - 1) < 1e-6)
    assert.ok(Math.abs(Number(neighbors[2]?.cosine_distance) - 2) < 1e-6)

    await db.raw("SET enable_seqscan = off")
    const planResult = await db.raw(`
      EXPLAIN (COSTS OFF)
      SELECT id
      FROM moonwitness_vector_certification
      ORDER BY embedding <=> '[1,0,0]'::vector
      LIMIT 1
    `)
    const planRows = (planResult as { rows?: Array<{ "QUERY PLAN": string }> }).rows ?? []
    assert.ok(
      planRows.some(({ "QUERY PLAN": line }) =>
        line.includes("moonwitness_vector_certification_hnsw_idx")
      ),
      "Cosine nearest-neighbor query must use the HNSW index"
    )

    console.info(
      `pgvector certification passed: vector ${extensions[0]?.extversion}, insert, cosine retrieval, HNSW`
    )
  } finally {
    await closeDb()
  }
}

certifyPgvector().catch((error: unknown) => {
  console.error("pgvector certification failed:", error)
  process.exitCode = 1
})
