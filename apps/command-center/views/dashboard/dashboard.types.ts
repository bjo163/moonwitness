export type DashboardData = {
  missionStatus: Record<string, unknown> | null
  todayMission: Array<Record<string, any>> | null
  todayPrayer: Array<Record<string, any>> | null
  aiBriefing: Array<Record<string, any>> | null
  knowledgeFeed: Array<Record<string, any>> | null
  activeProjects: Array<Record<string, any>> | null
  tasksOverview: Record<string, any> | null
  moonObservatory: Record<string, any> | null
  globalMonitoring: Array<Record<string, any>> | null
}

export type ServiceStatus = 'online' | 'offline' | 'checking'

export type PolyglotService = {
  name: string
  url: string
  port: number
  status: ServiceStatus
  latencyMs?: number
}
