import bcrypt from 'bcryptjs'
import { getModel } from '../models/registry.js'
import type { FastifyRequest, FastifyReply } from 'fastify'

const BCRYPT_ROUNDS = 10

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS)
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function loginHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { email, password } = request.body as {
    email: string
    password: string
  }

  const User = getModel('res.user')
  if (!User) {
    return reply.status(500).send({ error: 'User model not loaded' })
  }

  const rows = await User.searchRead(User, [['email', '=', email]])
  if (!rows.length) {
    return reply.status(401).send({ error: 'Invalid credentials' })
  }

  const user = rows[0] as {
    id: number
    email: string
    name: string
    password: string
    partner_id?: number
  }

  const isValid = await comparePassword(password, user.password)
  if (!isValid) {
    return reply.status(401).send({ error: 'Invalid credentials' })
  }

  const token = await request.jwtSign({
    sub: user.id,
    email: user.email
  })

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      partnerId: user.partner_id ?? null
    }
  }
}