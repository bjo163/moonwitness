# ◈ apps/command-center — Tactical Governance Terminal

```
╔══════════════════════════════════════════════════════════════════════════╗
║  APPLICATION:    apps/command-center                                     ║
║  SYSTEM VERSION: MoonWitness OS V9.0 (Divine Operating System Matrix)    ║
║  APP VERSION:    9.0.0                                                   ║
║  PORT:           3001 (APP_PORTS.COMMAND_CENTER)                         ║
║  CLASSIFICATION: TIER 6 — TACTICAL GOVERNANCE & ADMINISTRATIVE TERMINAL  ║
║  STATUS:         ████████████████████████████████ ACTIVE (SOVEREIGN)     ║
╚══════════════════════════════════════════════════════════════════════════╝
```

> **Tactical Governance, Administration & System Operations Terminal**  
> Built with Next.js 16 App Router, `@workspace/ui`, `@workspace/hooks`, and `@moon/client`.

---

## 🛡️ Key Capabilities

- **Administrative Database Controls**: Hadith Compendiums, Quranic Verses, and Operator User Database with real API integration & resilient caching via `ResourceTable`.
- **CAB Civilizational Governance**: RFC Voting, milestone evaluations, and peace covenant verification.
- **Universal Single Sign-On (SSO)**: Seamless cross-port session synchronization with `apps/web` (`mw_session` cookie).
- **Universal Command Palette**: Tactical shortcut indexing across all administrative windows (`Cmd+K`).
- **Telemetry & Logs**: Real-time server diagnostics and system performance charts.

---

## 🚀 Running Locally

```bash
# Start Command Center on Port 3001
pnpm --filter command-center dev
```

---

## 🧪 Verification
```bash
pnpm --filter command-center typecheck
```