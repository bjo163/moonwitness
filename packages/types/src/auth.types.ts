// Auth, RBAC & Clearance Domain Types

export type UserRole = "superadmin" | "admin" | "moderator" | "editor" | "scholar" | "explorer" | "user"
export type UserStatus = "active" | "pending" | "disabled" | "banned"

export interface UserProfile {
  id?: string | number
  name?: string
  email?: string
  title?: string
  role?: UserRole | string
  avatar?: string
  avatarUrl?: string
  level?: number
  clearanceLevel?: number
  badges?: string[]
  phone?: string
  lastLogin?: string
  preferences?: string
}

export interface UserEntity {
  id: number | string
  name: string
  email: string
  role: UserRole | string
  status: UserStatus | string
  lastActive?: string
  team?: string
  createdAt?: string
  phone?: string
  lastLogin?: string
  preferences?: string
}

export interface OperatorClearance {
  operatorId: string
  callsign: string
  level: number
  tier: "ALPHA" | "BETA" | "GAMMA" | "OMEGA"
  allowedModules: string[]
  canApproveRfc: boolean
  canDeployHotfix: boolean
}

export interface SessionState {
  isAuthenticated: boolean
  token?: string
  user: UserProfile | null
  expiresAt?: number
}

export interface PermissionMatrix {
  module: string
  read: boolean
  write: boolean
  delete: boolean
  admin: boolean
}
