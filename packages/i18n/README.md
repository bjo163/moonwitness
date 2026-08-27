# ◈ @workspace/i18n

```
╔══════════════════════════════════════════════════════════════════════════╗
║  PACKAGE:        @workspace/i18n                                         ║
║  SYSTEM VERSION: MoonWitness OS V9.0 (Divine Operating System Matrix)    ║
║  PKG VERSION:    9.0.0                                                   ║
║  CLASSIFICATION: TIER 5 — MULTILINGUAL & COSMIC LOCALIZATION ENGINE      ║
║  STATUS:         ████████████████████████████████ ACTIVE (SOVEREIGN)     ║
╚══════════════════════════════════════════════════════════════════════════╝
```

## 🌌 Overview
`@workspace/i18n` provides localized strings, Arabic script formatting helpers, RTL layout utilities, and multi-language translation dictionaries (`id`, `en`, `ar`) across all MoonWitness OS modules.

---

## 📦 Public API Surface

| Function / Constant | Parameters | Description |
|---|---|---|
| `t()` | `enText: string, idText?: string, arText?: string` | Translation resolver based on active locale |
| `formatArabicNumber()` | `num: number \| string` | Converts standard digits (1, 2, 3) into Arabic Eastern numerals (١, ٢, ٣) |
| `SUPPORTED_LOCALES` | `['id', 'en', 'ar']` | Supported system languages |

---

## 🚀 Usage

```tsx
import { t, formatArabicNumber } from "@workspace/i18n"

// 1. Localized UI Label
const headerTitle = t("COSMIC OBSERVATORY", "OBSERVATORIUM KOSMIK", "المرصد الكوني")

// 2. Arabic Numerals Formatting
const verseNumber = formatArabicNumber(255) // "٢٥٥"
```

---

## 🛡️ Architectural Boundaries
- Belongs to **Tier 5 (React UI & Localization)**. Zero external network dependencies.

---

## 🧪 Verification
```bash
pnpm --filter @workspace/i18n typecheck
```
