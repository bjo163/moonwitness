# ◈ @moon/mail

```
╔══════════════════════════════════════════════════════════════════════════╗
║  PACKAGE:        @moon/mail                                              ║
║  SYSTEM VERSION: MoonWitness OS V9.0 (Divine Operating System Matrix)    ║
║  PKG VERSION:    9.0.0                                                   ║
║  CLASSIFICATION: TIER 3 — TRANSACTIONAL EMAIL & OTP DISPATCH HUB         ║
║  STATUS:         ████████████████████████████████ ACTIVE (SOVEREIGN)     ║
╚══════════════════════════════════════════════════════════════════════════╝
```

## 🌌 Overview
`@moon/mail` provides cryptographic One-Time Password (OTP) verification templates, password recovery dispatchers, and system telemetry alert emails with provider fallback (SMTP / Resend / Console).

---

## 📦 Public API Surface

| Function | Parameters | Description |
|---|---|---|
| `sendTransactionalEmail()` | `options: EmailPayload` | Dispatches tactical email via configured transport |
| `renderOtpEmailTemplate()` | `otp: string, expiryMin: number` | Produces dark sci-fi responsive HTML email template |
| `verifyMailTransport()` | `() => Promise<boolean>` | Health check verifying outgoing SMTP connection |

---

## 🚀 Usage

```typescript
import { sendTransactionalEmail, renderOtpEmailTemplate } from "@moon/mail"

// 1. Dispatching Password Recovery OTP
const htmlBody = renderOtpEmailTemplate("784912", 15)

await sendTransactionalEmail({
  to: "operator@moonwitness.org",
  subject: "◈ MOONWITNESS OS — SECURITY CLEARANCE CHALLENGE",
  html: htmlBody,
})
```

---

## 🛡️ Architectural Boundaries
- Belongs to **Tier 3 (Domain Intelligence & Services)**.
- Consumes `@workspace/types`.

---

## 🧪 Verification
```bash
pnpm --filter @moon/mail test
```

## ??? View Configuration

This package exports declarative view manifests for the **Cosmic Matrix Engine** (src/views.ts):
- Introspected automatically by `@moon/server` at `GET /api/meta/model/:name`
- Rendered dynamically in Command Center via `<CosmicModelWorkspace model="..." />`
- Supported view modes: Kanban Pipeline, Sortable Table, Responsive Form Modal, and Activity Chatter.
