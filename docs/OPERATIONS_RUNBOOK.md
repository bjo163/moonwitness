# ◈ MOONWITNESS OS — PRODUCTION OPERATIONS RUNBOOK

```
╔══════════════════════════════════════════════════════════════════════════╗
║  CLASSIFICATION: PRODUCTION OPERATIONS AUTHORITY DOCUMENT               ║
║  SYSTEM:         MoonWitness OS (Dual-Portal & Canonical Engine)         ║
║  VERSION:        v0.2.0 (Release Candidate V10.0 Matrix)                 ║
║  CORPUS TARGET:  bjo163/moonwitness-corpus @ v1.0.0                      ║
╚══════════════════════════════════════════════════════════════════════════╝
```

---

## 1. Release Architecture & Topology

```text
moonwitness-corpus (Immutable Release v1.0.0, Checksum Verified)
       │
       ▼
MoonWitness Release Engine
       │
       ├── 1. Database Migrations (Forward-compatible PostgreSQL via @moon/orm)
       ├── 2. Witness Ingestion & Snapshot (wx.source.snapshot, wx.provenance)
       ├── 3. Canonical Search Projection (Atomic diacritic-insensitive index)
       └── 4. Engine Runtime & Multi-Portal API (Port 4000)
              │
       ┌──────┴────────────────┐
       ▼                       ▼
Public Portal (Port 3000)   Command Center (Port 3001)
```

---

## 2. Standard Deployment Procedure

### Step 1: Pre-Flight Release Check
Run the deterministic pre-flight validator:
```bash
pnpm release:check
```

### Step 2: Quality & Certification Verification
Ensure constitutional rules and knowledge certification test gates pass:
```bash
pnpm certify:knowledge
pnpm audit:ci
```

### Step 3: Production Build & Asset Packaging
Compile Next.js and backend engines:
```bash
pnpm turbo build
```

### Step 4: Process Activation
Reload cluster processes using PM2 or Docker Compose:
```bash
# PM2 Zero-downtime cluster reload:
pm2 reload ecosystem.config.cjs --update-env

# Or Docker Compose rolling upgrade:
docker-compose --env-file .env.production up -d --build
```

---

## 3. Four-Dimensional Rollback Strategy

| Dimension | Rollback Vector | Procedure | Recovery Time (RTO) |
|---|---|---|---|
| **1. Application Binary** | Git Tag / Docker Image Tag | Deploy previous release tag: `git checkout v0.1.9 && pnpm build && pm2 reload all` | `< 2 minutes` |
| **2. Database Schema** | Forward-Compatible ORM | Schema definitions maintain additive compatibility; no destructive drops | `< 1 minute` |
| **3. Corpus Release** | Pinned Revision Restoration | Rollback active corpus revision via Command Center: `POST /api/witness/corpus/sync` with prior revision | `< 3 minutes` |
| **4. Search Index** | Atomic Index Rotation | Trigger index rebuild: `POST /api/witness/corpus/reindex` | `< 1 minute` |

---

## 4. Corpus Promotion Protocol

1. **Pre-Promotion Dry Run**:
   - Verify artifact SHA-256 and schema compatibility without mutating live database records.
2. **Snapshot Creation**:
   - Ingest new release into `wx.source.snapshot` with status `COMMITTED`.
3. **Atomic Search Index Refresh**:
   - Populate new index projection, verify coverage parity with canonical counts, and swap active pointers.
4. **Health Verification**:
   - Query `/api/witness/corpus/status` and `/api/witness/corpus/health`.

---

## 5. Health Check Endpoints & Observability

| Service / Metric | Endpoint | Expected Status |
|---|---|---|
| API Liveness | `GET http://localhost:4000/livez` | `200 OK` |
| API Readiness | `GET http://localhost:4000/readyz` | `200 OK` |
| Database Connection | `GET http://localhost:4000/db/status` | `200 OK (connected: true)` |
| Corpus Health | `GET http://localhost:4000/api/witness/corpus/health` | `200 OK (orphans: 0, indexValid: true)` |
| Corpus Status | `GET http://localhost:4000/api/witness/corpus/status` | `200 OK (activeRelease: "v1.0.0")` |

---

## 6. Disaster Recovery & Emergency Contacts

- **RTO (Recovery Time Objective)**: `< 5 minutes` for full service restoration from cold backup.
- **RPO (Recovery Point Objective)**: `< 1 hour` (point-in-time PostgreSQL WAL and immutable corpus git tags).
- **Incident Escalation**: Operations Command `/cab` RFC ticket generation.
