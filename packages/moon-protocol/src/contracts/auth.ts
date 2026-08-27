/**
 * ◈ MOONWITNESS PROTOCOL — AUTH API CONTRACTS
 *
 * Zod schemas for all /auth/* endpoints.
 */
import { z } from 'zod'

// ═══════════════════════════════════════════
// 🔐 AUTH REQUEST SCHEMAS
// ═══════════════════════════════════════════

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const RegisterRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).optional(),
})

export const ForgotPasswordRequestSchema = z.object({
  email: z.string().email(),
})

export const VerifyOtpRequestSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(4),
})

export const ResetPasswordRequestSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(4),
  newPassword: z.string().min(6),
})

// ═══════════════════════════════════════════
// 🔐 AUTH RESPONSE SCHEMAS
// ═══════════════════════════════════════════

export const UserProfileSchema = z.object({
  id: z.number().or(z.string()),
  name: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  role: z.string().default('user'),
  avatar: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
  level: z.number().optional(),
  clearanceLevel: z.number().optional(),
  badges: z.array(z.string()).optional(),
  phone: z.string().nullable().optional(),
  lastLogin: z.string().nullable().optional(),
  preferences: z.string().nullable().optional(),
})

export const AuthResponseSchema = z.object({
  token: z.string(),
  user: UserProfileSchema,
})

export const SessionResponseSchema = z.object({
  authenticated: z.boolean(),
  user: UserProfileSchema.nullable(),
})

export const AuthSuccessSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
})

// ═══════════════════════════════════════════
// 🛡️ CLEARANCE & PERMISSION SCHEMAS
// ═══════════════════════════════════════════

export const UserRoleSchema = z.enum([
  'superadmin', 'admin', 'moderator', 'editor', 'scholar', 'explorer', 'user'
])

export const UserStatusSchema = z.enum([
  'active', 'pending', 'disabled', 'banned'
])

export const OperatorClearanceSchema = z.object({
  operatorId: z.string(),
  callsign: z.string(),
  level: z.number().min(1).max(3),
  tier: z.enum(['ALPHA', 'BETA', 'GAMMA', 'OMEGA']),
  allowedModules: z.array(z.string()),
  canApproveRfc: z.boolean(),
  canDeployHotfix: z.boolean(),
})

export const UserEntitySchema = z.object({
  id: z.number().or(z.string()),
  name: z.string(),
  email: z.string(),
  role: z.string(),
  status: z.string(),
  lastActive: z.string().optional(),
  team: z.string().optional(),
  createdAt: z.string().optional(),
  phone: z.string().optional(),
  lastLogin: z.string().optional(),
  preferences: z.string().optional(),
})

// ═══════════════════════════════════════════
// INFERRED TYPES
// ═══════════════════════════════════════════

export type LoginRequest = z.infer<typeof LoginRequestSchema>
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>
export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordRequestSchema>
export type VerifyOtpRequest = z.infer<typeof VerifyOtpRequestSchema>
export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>
export type UserProfile = z.infer<typeof UserProfileSchema>
export type AuthResponse = z.infer<typeof AuthResponseSchema>
export type SessionResponse = z.infer<typeof SessionResponseSchema>
export type UserRole = z.infer<typeof UserRoleSchema>
export type UserStatus = z.infer<typeof UserStatusSchema>
export type OperatorClearance = z.infer<typeof OperatorClearanceSchema>
export type UserEntity = z.infer<typeof UserEntitySchema>
