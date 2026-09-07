---
name: canonical-corpus-manifest-ingestion
description: >-
  Use this skill when ingesting, parsing, or verifying canonical corpus manifests, SHA-256 artifacts,
  and immutable snapshot revisions in @moon/witness.
---

# Canonical Corpus Manifest Ingestion (Subatomic Skill)

Governs cryptographic artifact verification, JSON/JSONL manifest parsing, and idempotent snapshot generation in `@moon/witness/src/services/canonical-corpus-importer.ts`.

## Ingestion Data Pipeline

```text
1. Fetch release manifest from moonwitness-corpus
2. Verify SHA-256 hash of downloaded artifact against manifest declaration
3. Check idempotent source snapshot:
   - If snapshot exists with matching checksum -> skip re-ingestion
   - If new snapshot -> parse passages and stream into knowledge graph
4. Create immutable moon.witness.snapshot and moon.witness.provenance record
```

## Checksum Verification Pattern

```typescript
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

export async function verifyArtifactChecksum(filePath: string, expectedSha256: string): Promise<boolean> {
  const content = await readFile(filePath);
  const actualHash = createHash("sha256").update(content).digest("hex");
  return actualHash.toLowerCase() === expectedSha256.toLowerCase();
}
```

## Invariant Rules

- **Zero In-Place Mutation**: A verified snapshot is immutable. Any content correction requires a new revision label and new checksum.
- **Idempotency**: Running the ingestion service multiple times on the same manifest produces zero duplicate database rows.
- **Provenance Link**: Every ingested passage must link to its source snapshot ID.

## Verification Runbook

```bash
# Sync corpus manifests
pnpm corpus:sync

# Run canonical importer tests
vitest run packages/moon-witness/tests/canonical-corpus-importer.odoo.test.ts
```
