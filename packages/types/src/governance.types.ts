// CAB Governance, Projects & Missions Domain Types

export type RfcStatus = "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "DEPLOYED"
export type RfcImpact = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"

export interface CabMember {
  id: string
  name: string
  role: "CHAIR" | "SECURITY" | "ARCHITECT" | "OPERATOR" | "MEMBER"
  votesCount?: number
  avatar?: string
}

export interface CabRfc {
  id: string
  rfcNumber: string
  title: string
  description: string
  proposer: string
  status: RfcStatus
  impact: RfcImpact
  moduleTarget: string
  approvals: string[]
  rejections: string[]
  createdDate: string
  targetReleaseDate?: string
}

export interface CabMeeting {
  id: string
  sessionCode: string
  title: string
  scheduledTime: string
  agendaRfcs: string[] // list of RFC IDs
  status: "SCHEDULED" | "IN_PROGRESS" | "CONCLUDED"
  minutesOfMeeting?: string
}

export interface ProjectItem {
  id: string
  title: string
  subtitle: string
  progress: number
  category?: string
  status: "ACTIVE" | "COMPLETED" | "HOLD"
}

export interface TaskItem {
  id: string
  title: string
  due: "Today" | "Tomorrow" | "Upcoming" | string
  completed: boolean
  priority?: "low" | "medium" | "high"
}

export interface CovenantDocument {
  id: string
  title: string
  recipient: string
  signatoriesCount: number
  issuedDate: string
  verifiedHash: string
}

export interface AmbassadorCertificate {
  id: string
  operatorName: string
  clearanceLevel: number
  issuedHijriDate: string
  status: "VALID" | "REVOKED"
  digitalSeal: string
}