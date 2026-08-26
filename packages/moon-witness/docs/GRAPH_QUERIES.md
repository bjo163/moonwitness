# Witness graph query contract

The Witness query surface is read-only, authenticated, and bounded. It exposes domain operations instead of accepting an arbitrary graph query language.

## Endpoints

All endpoints require a Bearer token and are evaluated through Moon ORM permissions and record rules.

```text
GET /api/witness/graph/entities?q=Musa&kind=PERSON&limit=20
GET /api/witness/graph/entities?stableKey=figure:musa
GET /api/witness/graph/entities/:entityId/profile
GET /api/witness/graph/passages?reference=QURAN:2:255
GET /api/witness/graph/passages/:passageId/content?limit=20
GET /api/witness/graph/passages/:passageId/tree?depth=2&limit=50
GET /api/witness/graph/figures/:entityId/mentions?limit=50
```

The implementation clamps result pages to 100 rows and hierarchy depth to 4. Missing or inaccessible graph anchors are returned as not found, so a caller cannot use a traversal to reveal an inaccessible label or count.

Passage content is returned as separate records. A translation, commentary, or derived result never replaces the original content witness. Figure mention results include the relation and resolved passage/scripture identity, while the relation's provenance remains available through the graph service.

## Query rules

- Use `stableKey` for exact identity resolution; aliases are search labels, not identity proof.
- Use `kind` to constrain entity lookup when the domain is known.
- Use `depth` and `limit` for every hierarchy/traversal request.
- Do not expose raw ORM domains or an arbitrary graph-language endpoint to clients.
- Keep unresolved identity candidates and internal evidence behind the same ORM authorization boundary as their graph anchors.
