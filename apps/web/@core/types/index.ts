// MOONWITNESS OS - CENTRALIZED TYPES
// This module re-exports shared types from the monorepo and defines web-specific types.

export type * from "@workspace/types"

// ── UI COMPONENTS & WIDGETS ────────────────────────────────────────────────
export type ActionPillars =
  | "Observe the Sky"
  | "Explore Knowledge"
  | "Reflect on History"

export type SystemStatus =
  | "ONLINE"
  | "OFFLINE"
  | "SYNCING"
  | "WARNING"
  | "CRITICAL"

export type WidgetTelemetry = {
  id: string
  label: string
  value: string | number
  trend?: "up" | "down" | "stable"
  trendValue?: string
}

// ── CHAT & KHIDRA AI ───────────────────────────────────────────────────────
export type ChatMessage = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: string
  metadata?: Record<string, unknown>
}

// ── KNOWLEDGE GRAPH ────────────────────────────────────────────────────────
export type KnowledgeNode = {
  id: string
  label: string
  group: "Quran" | "Hadith" | "Tafsir" | "Science" | "History"
  weight: number
}

export type KnowledgeEdge = {
  source: string
  target: string
  relation: "references" | "explains" | "authenticates" | "derived_from"
}

export type KnowledgeGraphData = {
  nodes: KnowledgeNode[]
  edges: KnowledgeEdge[]
}
