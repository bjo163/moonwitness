# Legacy Witness migration

`planLegacyMigration()` converts legacy Witness rows into deterministic operations. `executeLegacyMigration()` applies those operations through Moon ORM and records each result in `wx.legacy.mapping`.

## Guarantees

- Mapping keys include adapter version, source model, source record ID, and the source checksum.
- Re-running the same plan skips already mapped/skipped operations.
- A changed legacy checksum creates a new source-scoped operation and marks the previous mapping `STALE`; canonical content is not silently overwritten.
- Missing parents and missing source/provenance context are recorded as `UNRESOLVED` and can be retried from a later cursor.
- Scripture books/verses become hierarchical passages; original text and each translation become separate content records.
- Free-text narrators remain unresolved attributions. They are never automatically merged into a figure.
- Legacy grades remain source-aware assessments and require explicit provenance before persistence.
- Legacy Asma rows become non-authoritative divine-expression candidates; an exact corpus occurrence is required before an occurrence is created.
- Bookmarks and history remain in their user-scoped legacy models.

## Workflow

```ts
const plan = planLegacyMigration(batches, { adapterVersion: 'legacy-witness-v1' })
const result = await executeLegacyMigration(env, plan, {
  sourceId,
  provenanceId,
  maxOperations: 500
})
```

Use `plan.cursor` as the next resumable cursor. Run with `dryRun: true` to inspect operation counts without changing the database. Migration is intentionally separate from corpus ingestion: source artifacts and approved corpus imports remain governed by the #65 ingestion pipeline.
