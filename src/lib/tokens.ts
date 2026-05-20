import crypto from 'crypto'
import { db } from '@/lib/db'

const VERIFICATION_EXPIRY_MS = 15 * 60 * 1000 // 15 minutes
const RESET_EXPIRY_MS = 60 * 60 * 1000 // 1 hour

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export async function createVerificationToken(email: string) {
  // Delete any existing token for this email first — only one active token per flow
  await db.verificationToken.deleteMany({ where: { identifier: email } })

  const token = generateToken()
  const expires = new Date(Date.now() + VERIFICATION_EXPIRY_MS)

  return db.verificationToken.create({
    data: { identifier: email, token, expires },
  })
}

export async function createPasswordResetToken(email: string) {
  await db.passwordResetToken.deleteMany({ where: { email } })

  const token = generateToken()
  const expires = new Date(Date.now() + RESET_EXPIRY_MS)

  return db.passwordResetToken.create({
    data: { email, token, expires },
  })
}
