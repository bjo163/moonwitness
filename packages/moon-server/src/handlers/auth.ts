import type { IncomingMessage, ServerResponse } from 'node:http'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'
import { getModel, createCtx, ANONYMOUS_ID, authSecurityContext } from '@moon/orm'
import { logger } from '../logger.js'
import { parseBody, sendJson } from '../utils/http.js'
import {
  generateSecureOtp,
  hashOtpToken,
  OTP_EXPIRY_MS,
  MAX_OTP_ATTEMPTS,
  issueJwt,
  validateUserSession,
  revokeUserSessions,
  verifyToken,
  authenticateRequest,
  resolveUserRole,
  AuthError,
} from '../utils/auth.js'
import { withDomainSpan } from '../telemetry.js'
import { SpanStatusCode } from '@opentelemetry/api'

export interface AuthConfig {
  jwtSecret: string
  emailFrom?: string
  emailService?: string
  emailUser?: string
  emailPass?: string
}

/**
 * Get mailer transport
 */
function getMailer(config: AuthConfig) {
  if (!config.emailUser || !config.emailPass) {
    return null
  }
  return nodemailer.createTransport({
    service: config.emailService || 'gmail',
    auth: {
      user: config.emailUser,
      pass: config.emailPass
    }
  })
}

/**
 * Handle login
 */
export async function handleLogin(
  req: IncomingMessage,
  res: ServerResponse,
  config: AuthConfig
): Promise<void> {
  return withDomainSpan('auth.login', async (span) => {
    try {
      const body = await parseBody(req)
      const { email, password } = body

      if (!email || !password) {
        span?.setStatus({ code: SpanStatusCode.OK })
        return sendJson(res, 400, { error: 'Email and password required' }, req)
      }

      const VxUser = getModel('vx.user')
      if (!VxUser) {
        span?.setStatus({ code: SpanStatusCode.OK })
        return sendJson(res, 500, { error: 'User model not found' }, req)
      }

      const env = createCtx(ANONYMOUS_ID, authSecurityContext('login'), getModel as any)
      const normalizedIdentifier = String(email || '').trim().toLowerCase()

      let users = await VxUser.fetch(VxUser as any, env, [['login', '=', normalizedIdentifier]])
      if (users.length === 0) {
        users = await VxUser.fetch(VxUser as any, env, [['email', '=', normalizedIdentifier]])
      }

      if (users.length === 0) {
        span?.setStatus({ code: SpanStatusCode.OK })
        return sendJson(res, 401, { error: 'Invalid credentials' }, req)
      }

      const user = users[0]
      
      if (!user.password) {
        span?.setStatus({ code: SpanStatusCode.OK })
        return sendJson(res, 401, { error: 'Invalid credentials' }, req)
      }

      const valid = await bcrypt.compare(password, user.password)
      if (!valid) {
        span?.setStatus({ code: SpanStatusCode.OK })
        return sendJson(res, 401, { error: 'Invalid credentials' }, req)
      }

      const token = issueJwt(
        { sub: user.id, email: user.email || user.login, tokenVersion: user.token_version || user.tokenVersion || 1 },
        config.jwtSecret
      )

      const { role, clearanceLevel } = await resolveUserRole(user.id, env)

      const userEmail = user.email || user.login || ''
      span?.setAttribute('auth.user_id', user.id)
      span?.setAttribute('auth.role', role)
      span?.setStatus({ code: SpanStatusCode.OK })
      logger.info('moon.auth', `User ${userEmail} authenticated via PostgreSQL database`)
      return sendJson(res, 200, { 
        token, 
        user: { 
          id: user.id, 
          email: userEmail, 
          name: user.name || user.login || 'TACTICAL OPERATOR',
          role,
          clearanceLevel,
          title: clearanceLevel >= 3 ? 'Supreme Fleet Commander' : 'Mission Specialist',
          partnerId: user.partner_id || user.partnerId
        } 
      }, req)
    } catch (err: any) {
      span?.setStatus({ code: SpanStatusCode.ERROR, message: err?.message || String(err) })
      span?.recordException(err instanceof Error ? err : new Error(String(err)))
      logger.error('moon.auth', 'Login error:', err)
      return sendJson(res, 500, { error: err?.message || 'Internal server error', detail: String(err) }, req)
    }
  })
}

/**
 * Handle register
 */
export async function handleRegister(
  req: IncomingMessage,
  res: ServerResponse,
  config: AuthConfig
): Promise<void> {
  try {
    const body = await parseBody(req)
    const { email, password, name } = body

    if (!email || !password) {
      return sendJson(res, 400, { error: 'Email and password required' }, req)
    }

    const VxUser = getModel('vx.user')
    const VxNode = getModel('vx.node')
    if (!VxUser) {
      return sendJson(res, 500, { error: 'User model not found' }, req)
    }

    const env = createCtx(ANONYMOUS_ID, authSecurityContext('register'), getModel as any)

    // Check if user exists
    const existing = await VxUser.fetch(VxUser as any, env, [['email', '=', email]])
    if (existing.length > 0) {
      return sendJson(res, 409, { error: 'Email already registered' }, req)
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Find default company
    let defaultCompanyId = undefined
    if (VxNode) {
      const companies = await VxNode.fetch(VxNode as any, env, [['isCompany', '=', true]])
      if (companies.length > 0) {
        defaultCompanyId = companies[0].id
      }
    }

    // Create user
    const user = await VxUser.transaction(env, async (txEnv: any) => {
      const sanitizedName = (name || email.split('@')[0]).replace(/[^A-Za-z0-9 ]/g, ' ')
      return await VxUser.spawn(VxUser as any, txEnv, {
        name: sanitizedName,
        email,
        password: hashedPassword,
        companyId: defaultCompanyId,
        tokenVersion: 1
      })
    })

    const { role, clearanceLevel } = await resolveUserRole(user.id, env)

    const token = issueJwt(
      { sub: user.id, email: user.email, tokenVersion: 1, role, clearanceLevel },
      config.jwtSecret
    )

    logger.info('moon.auth', `New user registered: ${email}`)
    return sendJson(res, 201, { 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        partnerId: user.partner_id,
        role,
        clearanceLevel
      } 
    }, req)
  } catch (err: any) {
    logger.error('moon.auth', 'Registration error:', err)
    return sendJson(res, 500, { error: 'Internal server error' }, req)
  }
}

/**
 * Handle forgot password
 */
export async function handleForgotPassword(
  req: IncomingMessage,
  res: ServerResponse,
  config: AuthConfig
): Promise<void> {
  try {
    const body = await parseBody(req)
    const { email } = body

    if (!email) {
      return sendJson(res, 400, { error: 'Email required' }, req)
    }

    const VxUser = getModel('vx.user')
    const VxAuthChallenge = getModel('vx.auth.challenge')
    if (!VxUser || !VxAuthChallenge) {
      return sendJson(res, 500, { error: 'Auth models not found' }, req)
    }

    const env = createCtx(ANONYMOUS_ID, authSecurityContext('password-recovery'), getModel as any)
    const users = await VxUser.fetch(VxUser as any, env, [['email', '=', email]])

    if (users.length === 0) {
      // Don't reveal if user exists
      return sendJson(res, 200, { message: 'If account exists, OTP has been sent' }, req)
    }

    const user = users[0]
    const otpCode = generateSecureOtp()
    const tokenHash = hashOtpToken(user.id, otpCode)
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS).toISOString()

    await VxAuthChallenge.transaction(env, async (txEnv: any) => {
      // Invalidate any previous active challenges for this user and purpose
      const activeChallenges = await VxAuthChallenge.fetch(VxAuthChallenge as any, txEnv, [
        ['userId', '=', user.id],
        ['purpose', '=', 'password_recovery'],
        ['consumedAt', '=', null]
      ])
      for (const ch of activeChallenges) {
        await VxAuthChallenge.morph(VxAuthChallenge as any, txEnv, ch.id, {
          consumedAt: new Date().toISOString()
        })
      }

      // Spawn new secure challenge with hashed token
      await VxAuthChallenge.spawn(VxAuthChallenge as any, txEnv, {
        userId: user.id,
        purpose: 'password_recovery',
        tokenHash,
        expiresAt,
        attempts: 0,
        maxAttempts: MAX_OTP_ATTEMPTS
      })
    })

    // Send email if mailer is configured
    try {
      const mailer = getMailer(config)
      if (mailer) {
        const fromAddress = config.emailFrom || (config.emailUser ? `"MoonWitness Security" <${config.emailUser}>` : '"MoonWitness Security"')
        await mailer.sendMail({
          from: fromAddress,
          to: email,
          subject: 'Your Password Reset Code',
          html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
              <h2 style="color: #0ea5e9;">MoonWitness OS - Password Reset</h2>
              <p>Hello ${user.name},</p>
              <p>You requested a password reset. Please use the following 6-digit code to proceed:</p>
              <div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #0f172a; margin: 20px 0; text-align: center;">
                ${otpCode}
              </div>
              <p>This code will expire in 15 minutes.</p>
              <p style="color: #64748b; font-size: 12px; margin-top: 30px;">If you did not request this, please ignore this email.</p>
            </div>
          `
        })
        logger.info('moon.auth', `OTP sent to ${email}`)
      } else {
        logger.warn('moon.auth', `Mail transport is not configured. OTP generated for ${email} but email sending was skipped.`)
      }
    } catch (emailErr) {
      logger.error('moon.auth', 'Failed to send OTP email:', emailErr)
    }

    return sendJson(res, 200, { message: 'Password reset code has been sent to your email' }, req)
  } catch (err: any) {
    process.stderr.write(`\n>>> FORGOT ERROR: ${err?.message}\n${err?.stack}\n`)
    logger.error('moon.auth', 'Forgot password error:', err)
    return sendJson(res, 500, { error: 'Internal server error' }, req)
  }
}

/**
 * Handle verify OTP
 */
export async function handleVerifyOtp(
  req: IncomingMessage,
  res: ServerResponse,
  _config: AuthConfig
): Promise<void> {
  try {
    const body = await parseBody(req)
    const { email, code } = body

    if (!email || !code) {
      return sendJson(res, 400, { error: 'Email and code required' }, req)
    }

    const VxUser = getModel('vx.user')
    const VxAuthChallenge = getModel('vx.auth.challenge')
    if (!VxUser || !VxAuthChallenge) {
      return sendJson(res, 500, { error: 'Auth models not found' }, req)
    }

    const env = createCtx(ANONYMOUS_ID, authSecurityContext('password-recovery'), getModel as any)
    const users = await VxUser.fetch(VxUser as any, env, [['email', '=', email]])

    if (users.length === 0) {
      return sendJson(res, 400, { error: 'Invalid request' }, req)
    }

    const user = users[0]
    const tokenHash = hashOtpToken(user.id, String(code).trim())

    const challenges = await VxAuthChallenge.fetch(
      VxAuthChallenge as any,
      env,
      [
        ['userId', '=', user.id],
        ['purpose', '=', 'password_recovery']
      ],
      undefined,
      { order: 'createdAt desc', limit: 1 }
    )

    if (challenges.length === 0) {
      return sendJson(res, 400, { error: 'No active verification code found' }, req)
    }

    const challenge = challenges[0]
    const attempts = Number(challenge.attempts || 0)
    const maxAttempts = Number(challenge.max_attempts || challenge.maxAttempts || MAX_OTP_ATTEMPTS)

    if (challenge.consumed_at || challenge.consumedAt) {
      return sendJson(res, 400, { error: 'Verification code has already been used' }, req)
    }

    if (attempts >= maxAttempts) {
      return sendJson(res, 400, { error: 'Maximum OTP attempts exceeded' }, req)
    }

    const expiresAt = new Date(challenge.expires_at || challenge.expiresAt)
    if (Date.now() > expiresAt.getTime()) {
      return sendJson(res, 400, { error: 'Verification code has expired' }, req)
    }

    const actualHash = challenge.token_hash || challenge.tokenHash
    if (actualHash !== tokenHash) {
      const newAttempts = attempts + 1
      await VxAuthChallenge.morph(VxAuthChallenge as any, env, challenge.id, {
        attempts: newAttempts
      })
      if (newAttempts >= maxAttempts) {
        return sendJson(res, 400, { error: 'Maximum OTP attempts exceeded' }, req)
      }
      return sendJson(res, 400, { error: 'Invalid verification code' }, req)
    }

    logger.info('moon.auth', `OTP verified for ${email}`)
    return sendJson(res, 200, { success: true, message: 'Code verified successfully' }, req)
  } catch (err: any) {
    logger.error('moon.auth', 'Verify OTP error:', err)
    return sendJson(res, 500, { error: 'Internal server error' }, req)
  }
}

/**
 * Handle reset password
 */
export async function handleResetPassword(
  req: IncomingMessage,
  res: ServerResponse,
  _config: AuthConfig
): Promise<void> {
  try {
    const body = await parseBody(req)
    const { email, code, newPassword } = body

    if (!email || !code || !newPassword) {
      return sendJson(res, 400, { error: 'Email, code, and new password required' }, req)
    }

    const VxUser = getModel('vx.user')
    const VxAuthChallenge = getModel('vx.auth.challenge')
    if (!VxUser || !VxAuthChallenge) {
      return sendJson(res, 500, { error: 'Auth models not found' }, req)
    }

    const env = createCtx(ANONYMOUS_ID, authSecurityContext('password-recovery'), getModel as any)
    const users = await VxUser.fetch(VxUser as any, env, [['email', '=', email]])

    if (users.length === 0) {
      return sendJson(res, 400, { error: 'Invalid request' }, req)
    }

    const user = users[0]
    const tokenHash = hashOtpToken(user.id, String(code).trim())

    const challenges = await VxAuthChallenge.fetch(
      VxAuthChallenge as any,
      env,
      [
        ['userId', '=', user.id],
        ['purpose', '=', 'password_recovery']
      ],
      undefined,
      { order: 'createdAt desc', limit: 1 }
    )

    if (challenges.length === 0) {
      return sendJson(res, 400, { error: 'No active verification code found' }, req)
    }

    const challenge = challenges[0]
    const attempts = Number(challenge.attempts || 0)
    const maxAttempts = Number(challenge.max_attempts || challenge.maxAttempts || MAX_OTP_ATTEMPTS)

    if (challenge.consumed_at || challenge.consumedAt) {
      return sendJson(res, 400, { error: 'Verification code has already been used' }, req)
    }

    if (attempts >= maxAttempts) {
      return sendJson(res, 400, { error: 'Maximum OTP attempts exceeded' }, req)
    }

    const expiresAt = new Date(challenge.expires_at || challenge.expiresAt)
    if (Date.now() > expiresAt.getTime()) {
      return sendJson(res, 400, { error: 'Verification code has expired' }, req)
    }

    const actualHash = challenge.token_hash || challenge.tokenHash
    if (actualHash !== tokenHash) {
      const newAttempts = attempts + 1
      await VxAuthChallenge.morph(VxAuthChallenge as any, env, challenge.id, {
        attempts: newAttempts
      })
      if (newAttempts >= maxAttempts) {
        return sendJson(res, 400, { error: 'Maximum OTP attempts exceeded' }, req)
      }
      return sendJson(res, 400, { error: 'Invalid verification code' }, req)
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    const nextTokenVersion = (Number(user.token_version || user.tokenVersion || 1)) + 1

    await VxUser.transaction(env, async (txEnv: any) => {
      // 1. Consume the challenge
      await VxAuthChallenge.morph(VxAuthChallenge as any, txEnv, challenge.id, {
        consumedAt: new Date().toISOString()
      })

      // 2. Update user password and advance tokenVersion
      await VxUser.morph(VxUser as any, txEnv, user.id, {
        password: hashedPassword,
        tokenVersion: nextTokenVersion
      })
    })

    logger.info('moon.auth', `Password reset successfully for ${email} (token version advanced to ${nextTokenVersion})`)
    return sendJson(res, 200, { message: 'Password has been reset successfully' }, req)
  } catch (err: any) {
    logger.error('moon.auth', 'Reset password error:', err)
    return sendJson(res, 500, { error: 'Internal server error' }, req)
  }
}

/**
 * Handle logout / session revocation
 */
export async function handleLogout(
  req: IncomingMessage,
  res: ServerResponse,
  config: AuthConfig
): Promise<void> {
  return withDomainSpan('auth.logout', async (span) => {
    try {
      const auth = await authenticateRequest(req, config.jwtSecret, { allowAnonymous: false })
      await revokeUserSessions(auth.uid)
      span?.setAttribute('auth.user_id', auth.uid)
      span?.setStatus({ code: SpanStatusCode.OK })
      logger.info('moon.auth', `User id ${auth.uid} logged out (session revoked)`)

      return sendJson(res, 200, { message: 'Logged out successfully' }, req)
    } catch (err: any) {
      if (err instanceof AuthError) {
        span?.setStatus({ code: SpanStatusCode.OK })
        return sendJson(res, err.statusCode, { error: err.message, code: err.code }, req)
      }
      span?.setStatus({ code: SpanStatusCode.ERROR, message: err?.message || String(err) })
      span?.recordException(err instanceof Error ? err : new Error(String(err)))
      logger.error('moon.auth', 'Logout error:', err)
      return sendJson(res, 500, { error: 'Internal server error', code: 'INTERNAL_ERROR' }, req)
    }
  })
}

/**
 * Handle get current authenticated session / me
 */
export async function handleGetSession(
  req: IncomingMessage,
  res: ServerResponse,
  config: AuthConfig
): Promise<void> {
  try {
    const session = await authenticateRequest(req, config.jwtSecret, { allowAnonymous: false })
    return sendJson(res, 200, { user: session }, req)
  } catch (err: any) {
    if (err instanceof AuthError) {
      return sendJson(res, err.statusCode, { error: err.message, code: err.code }, req)
    }
    logger.error('moon.auth', 'Get session error:', err)
    return sendJson(res, 500, {
      error: err?.message || 'Internal server error',
      code: 'INTERNAL_ERROR'
    }, req)
  }
}

