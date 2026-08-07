import type { IncomingMessage, ServerResponse } from 'node:http'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'
import { getModel, createCtx, ANONYMOUS_ID } from '@moon/orm'
import { logger } from '../logger.js'
import { parseBody, sendJson } from '../utils/http.js'

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
  return nodemailer.createTransport({
    service: config.emailService || 'gmail',
    auth: {
      user: config.emailUser || 'rocksoultech@gmail.com',
      pass: config.emailPass || 'qpva imgx ndcu nbnt'
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
  try {
    const body = await parseBody(req)
    const { email, password } = body

    if (!email || !password) {
      return sendJson(res, 400, { error: 'Email and password required' }, req)
    }

    const VxUser = getModel('vx.user')
    if (!VxUser) {
      return sendJson(res, 500, { error: 'User model not found' }, req)
    }

    const env = createCtx(ANONYMOUS_ID, {}, getModel as any)
    const users = await VxUser.fetch(VxUser as any, env, [['email', '=', email]])

    if (users.length === 0) {
      return sendJson(res, 401, { error: 'Invalid credentials' }, req)
    }

    const user = users[0]
    
    if (!user.password) {
      return sendJson(res, 401, { error: 'Invalid credentials' }, req)
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return sendJson(res, 401, { error: 'Invalid credentials' }, req)
    }

    const token = jwt.sign(
      { sub: user.id, email: user.email },
      config.jwtSecret,
      { expiresIn: '7d' }
    )

    logger.info('moon.auth', `User ${email} logged in`)
    return sendJson(res, 200, { 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        partnerId: user.partner_id
      } 
    }, req)
  } catch (err: any) {
    logger.error('moon.auth', 'Login error:', err)
    return sendJson(res, 500, { error: 'Internal server error' }, req)
  }
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

    const env = createCtx(ANONYMOUS_ID, {}, getModel as any)

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
        companyId: defaultCompanyId
      })
    })

    const token = jwt.sign(
      { sub: user.id, email: user.email },
      config.jwtSecret,
      { expiresIn: '7d' }
    )

    logger.info('moon.auth', `New user registered: ${email}`)
    return sendJson(res, 201, { 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        partnerId: user.partner_id
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
    if (!VxUser) {
      return sendJson(res, 500, { error: 'User model not found' }, req)
    }

    const env = createCtx(ANONYMOUS_ID, {}, getModel as any)
    const users = await VxUser.fetch(VxUser as any, env, [['email', '=', email]])

    if (users.length === 0) {
      // Don't reveal if user exists
      return sendJson(res, 200, { message: 'If account exists, OTP has been sent' }, req)
    }

    const user = users[0]
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpires = new Date(Date.now() + 15 * 60000) // 15 minutes

    await VxUser.transaction(env, async (txEnv: any) => {
      await VxUser.morph(VxUser as any, txEnv, user.id, { otpCode, otpExpires })
    })

    // Send email
    try {
      const mailer = getMailer(config)
      await mailer.sendMail({
        from: config.emailFrom || '"Moonwitness Security" <rocksoultech@gmail.com>',
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
    } catch (emailErr) {
      logger.error('moon.auth', 'Failed to send OTP email:', emailErr)
      // Continue anyway - OTP is saved in DB
    }

    return sendJson(res, 200, { message: 'Password reset code has been sent to your email' }, req)
  } catch (err: any) {
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
  config: AuthConfig
): Promise<void> {
  try {
    const body = await parseBody(req)
    const { email, code } = body

    if (!email || !code) {
      return sendJson(res, 400, { error: 'Email and code required' }, req)
    }

    const VxUser = getModel('vx.user')
    if (!VxUser) {
      return sendJson(res, 500, { error: 'User model not found' }, req)
    }

    const env = createCtx(ANONYMOUS_ID, {}, getModel as any)
    const users = await VxUser.fetch(VxUser as any, env, [['email', '=', email]])

    if (users.length === 0) {
      return sendJson(res, 400, { error: 'Invalid request' }, req)
    }

    const user = users[0]

    if (!user.otp_code || user.otp_code !== code) {
      return sendJson(res, 400, { error: 'Invalid verification code' }, req)
    }

    if (user.otp_expires && new Date(user.otp_expires) < new Date()) {
      return sendJson(res, 400, { error: 'Verification code has expired' }, req)
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
  config: AuthConfig
): Promise<void> {
  try {
    const body = await parseBody(req)
    const { email, code, newPassword } = body

    if (!email || !code || !newPassword) {
      return sendJson(res, 400, { error: 'Email, code, and new password required' }, req)
    }

    const VxUser = getModel('vx.user')
    if (!VxUser) {
      return sendJson(res, 500, { error: 'User model not found' }, req)
    }

    const env = createCtx(ANONYMOUS_ID, {}, getModel as any)
    const users = await VxUser.fetch(VxUser as any, env, [['email', '=', email]])

    if (users.length === 0) {
      return sendJson(res, 400, { error: 'Invalid request' }, req)
    }

    const user = users[0]

    if (!user.otp_code || user.otp_code !== code) {
      return sendJson(res, 400, { error: 'Invalid verification code' }, req)
    }

    if (user.otp_expires && new Date(user.otp_expires) < new Date()) {
      return sendJson(res, 400, { error: 'Verification code has expired' }, req)
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await VxUser.transaction(env, async (txEnv: any) => {
      await VxUser.morph(VxUser as any, txEnv, user.id, {
        password: hashedPassword,
        otpCode: null,
        otpExpires: null
      })
    })

    logger.info('moon.auth', `Password reset successfully for ${email}`)
    return sendJson(res, 200, { message: 'Password has been reset successfully' }, req)
  } catch (err: any) {
    logger.error('moon.auth', 'Reset password error:', err)
    return sendJson(res, 500, { error: 'Internal server error' }, req)
  }
}
