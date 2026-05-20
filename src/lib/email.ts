import nodemailer from 'nodemailer'
import { render } from '@react-email/render'
import VerificationEmail from '@/emails/VerificationEmail'
import PasswordResetEmail from '@/emails/PasswordResetEmail'

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error('SMTP_HOST, SMTP_USER, and SMTP_PASS must be set')
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })
}

const APP_NAME = 'SecureGate'
const FROM_EMAIL = process.env.SMTP_FROM || 'noreply@securegate.app'

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email/${token}`

  try {
    const html = await render(VerificationEmail({ verificationUrl: verifyUrl }))

    await getTransporter().sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: `${APP_NAME} — Verify your email address`,
      html,
    })
  } catch (error) {
    console.error('[SEND_VERIFICATION_EMAIL]', error)
    throw error
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${token}`

  try {
    const html = await render(PasswordResetEmail({ resetUrl }))

    await getTransporter().sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: `${APP_NAME} — Reset your password`,
      html,
    })
  } catch (error) {
    console.error('[SEND_PASSWORD_RESET_EMAIL]', error)
    throw error
  }
}
