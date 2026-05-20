import { Resend } from 'resend'
import { render } from '@react-email/render'
import VerificationEmail from '@/emails/VerificationEmail'
import PasswordResetEmail from '@/emails/PasswordResetEmail'

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set')
}

const resend = new Resend(process.env.RESEND_API_KEY)

const APP_NAME = 'SecureGate'
const FROM_EMAIL = 'SecureGate <onboarding@resend.dev>'

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email/${token}`

  try {
    const html = await render(VerificationEmail({ verificationUrl: verifyUrl }))
    
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `${APP_NAME} — Verify your email address`,
      html,
    })

    if (result.error) {
      console.error('[EMAIL_ERROR]', result.error)
      throw new Error(`Failed to send verification email: ${result.error.message}`)
    }

    return result
  } catch (error) {
    console.error('[SEND_VERIFICATION_EMAIL]', error)
    throw error
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${token}`

  try {
    const html = await render(PasswordResetEmail({ resetUrl }))
    
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `${APP_NAME} — Reset your password`,
      html,
    })

    if (result.error) {
      console.error('[EMAIL_ERROR]', result.error)
      throw new Error(`Failed to send password reset email: ${result.error.message}`)
    }

    return result
  } catch (error) {
    console.error('[SEND_PASSWORD_RESET_EMAIL]', error)
    throw error
  }
}
