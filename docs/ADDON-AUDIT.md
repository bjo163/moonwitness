# MoonWitness Addon Audit Matrix & Boundary Specification

Status: **Canonical Foundation Audit** (Tracks GitHub Issue #7 & #1).

## 1. Addon Audit Table

| Addon Package | Owned Models | Custom Routes | Direct DB Access | Cross-Addon Dependencies | Compliance Status & Action |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`@moon/base`** | `vx.user`, `vx.node`, `vx.org`, `vx.zone`, `vx.coin`, `vx.role`, `mx.model`, `mx.grant`, `mx.rule`, `ix.lang`, `ix.dict`, `fx.msg`, `fx.track`, `mx.metric`, `fx.session` | *None* | Seeding & initial schema loading (`base-data.ts`, `seed.ts`) | Base foundation (no external domain dependencies) | ✅ **Compliant**: Owns core platform security & identity. Common CRUD handled via auto-generated ORM REST. |
| **`@moon/witness`** | `wx.scripture`, `wx.scripture.book`, `wx.scripture.verse`, `wx.tradition`, `wx.tradition.item`, `wx.devotion`, `wx.asmaul.husna`, `wx.bookmark`, `wx.history` | `/api/witness/hadith`, `/api/witness/quran/search` (Aggregations) | Seeding script utilities only | `@moon/base` | ✅ **Compliant**: Divine knowledge compendiums. Custom routes limited to complex search/pagination aggregations. |
| **`@moon/cab`** | `cab.project`, `cab.task`, `cab.change`, `cab.meeting`, `cab.decision` | `/api/cab/summary` (Aggregated dashboard metric summary) | *None* | `@moon/base` | ✅ **Compliant**: Change Advisory Board domain. Queries use ORM `search` / `searchCount`. No bypass. |
| **`@moon/mizan`** | `mz.case`, `mz.assessment`, `mz.filter`, `mz.reference` | `/api/mizan/evaluate`, `/api/mizan/summary` | *None* | `@moon/base` | ✅ **Compliant**: Tabayyun & justice intelligence engine. Business rules encapsulated in model methods. |
| **`@moon/khidra`** | `kh.conversation`, `kh.message` | `/api/kh/brainstorm` | *None* | `@moon/base` | ✅ **Compliant**: AI prophetic wisdom assistant and conversational telemetry. |
| **`@moon/shootgun`** | `sg.operation` | *None* | *None* | `@moon/base` | ✅ **Compliant**: Tactical system operations & action logs. Pure ORM CRUD. |
| **`@moon/performance`**| `px.system`, `px.event`, `px.metric`, `px.query` | Performance telemetry middleware | *None* | `@moon/base` | ✅ **Compliant**: Non-invasive telemetry tracking middleware logging into ORM models. |

---

## 2. Boundary Invariants

1. **ORM As Single Persistence Path**:
   - No addon introduces its own Knex instance or repository layer. All persistence goes through `Vertex`, `Recordset`, `QueryBuilder`, and `Ctx`.
2. **Transport-Only Server**:
   - `@moon/server` contains zero domain-specific logic for CAB, Mizan, or Witness.
   - Standard model CRUD (`GET /api/:model`, `GET /api/:model/:id`, `POST /api/:model`, `PUT /api/:model/:id`, `DELETE /api/:model/:id`) is automatically dispatched by the server's REST handler.
3. **Fail-Closed Authorization & Declarative Rules**:
   - All models enforce fail-closed security. Access requires matching `mx.grant` permissions or explicitly declared public-read status.
   - Record rules (`mx.rule`) are evaluated declaratively without executing dynamic JavaScript (`new Function` / `eval`).
4. **Minimal Custom Routes**:
   - Custom addon routes are strictly reserved for operations that cannot be represented by standard single-model CRUD (e.g. cross-table metrics aggregation, external search indexing).
