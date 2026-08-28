// Telemetry, Logging & Intelligence Domain Types

export type SystemStatus =
  | "ONLINE"
  | "OFFLINE"
  | "SYNCING"
  | "WARNING"
  | "CRITICAL"
  | "STANDBY"

export type LogSender = "SYSTEM" | "KHIDRA_AI" | "USER" | "SUCCESS" | "WARN" | "CRITICAL"

export interface LogItem {
  id: string
  timestamp: string
  sender: LogSender
  message: string
  code?: string
}

export interface TelemetryMetric {
  id: string
  label: string
  value: string | number
  unit?: string
  trend?: "up" | "down" | "stable"
  trendValue?: string
  status?: SystemStatus
}

export interface WidgetTelemetry {
  id: string
  label: string
  value: string | number
  trend?: "up" | "down" | "stable"
  trendValue?: string
}

export interface MissionItem {
  id: string
  title: string
  subtitle: string
  status: "COMPLETE" | "IN_PROGRESS" | "PENDING" | string
  progress?: string
}

export interface IntelligenceBriefing {
  id: string
  title: string
  category: "INTEL" | "ALERT" | "HISTORY" | "CELESTIAL"
  summary: string
  timestamp: string
  priority: "HIGH" | "MEDIUM" | "LOW"
}

export interface MissionStatus {
  title: string
  level: number
  xp: number
  maxXp: number
  knowledgePoints: number
  researchScore: number
  missionRank: string
  globalRank: string
}

export interface FeedItem {
  id: string
  category: string
  title: string
  subtitle: string
  time: string
  url?: string
}

export interface GlobalMonitoringItem {
  name: string
  value: string
  status: string
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: string
  metadata?: Record<string, unknown>
}

export interface KnowledgeNode {
  id: string
  label: string
  group: "Quran" | "Hadith" | "Tafsir" | "Science" | "History"
  weight: number
}

export interface KnowledgeEdge {
  source: string
  target: string
  relation: "references" | "explains" | "authenticates" | "derived_from"
}

export interface KnowledgeGraphData {
  nodes: KnowledgeNode[]
  edges: KnowledgeEdge[]
}
