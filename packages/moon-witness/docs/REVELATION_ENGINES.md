# Revelation & Cross-Scripture Engines

Status: Canonical documentation for Revelation query and cross-scripture comparison engines (#58).

## Overview

The Revelation engine family provides reproducible, bounded domain queries and multi-scripture comparative intelligence over the canonical MoonWitness knowledge graph.

### 1. Revelation Query Engine (`revelation.query`)
- **Module Code**: `revelation.query@1.0.0`
- **Deterministic**: Yes
- **Input Schema**: `REVELATION_QUERY_INPUT_V1`
- **Output Schema**: `WITNESS_ENGINE_RESULT_V1`
- **Capabilities**:
  - Resolves canonical passage witnesses across the four sacred families (`QURAN`, `TAWRAT`, `ZABUR`, `INJIL`).
  - Separates original text, textual witnesses, and translations into distinct findings with exact provenance.
  - Maintains strict language filtering and edition boundaries.

### 2. Cross-Scripture Comparison Engine (`revelation.cross-scripture`)
- **Module Code**: `revelation.cross-scripture@1.0.0`
- **Deterministic**: Yes
- **Input Schema**: `CROSS_SCRIPTURE_COMPARISON_INPUT_V1`
- **Output Schema**: `WITNESS_ENGINE_RESULT_V1`
- **Capabilities**:
  - Compares entities (Figures, Concepts, Events) across all 4 revelation families without creating synthetic parallels.
  - Retains conflicting statements in the explicit `conflicts` array.
  - Filters derived assertions unless explicitly requested (`includeDerivedAssertions: true`).
