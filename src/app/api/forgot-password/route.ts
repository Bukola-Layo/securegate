import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { forgotPasswordSchema } from '@/lib/validations'
import { createPasswordResetToken } from '@/lib/tokens'
import { sendPasswordResetEmail } from '@/lib/email'
import { forgotPasswordRateLimit } from '@/lib/rate-limit'

export async function POST(req: Request) {
  try {
    // Rate limiting (best-effort — fails open if Redis is unavailable)
    if (forgotPasswordRateLimit) {
      try {
        const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1'
        const { success } = await forgotPasswordRateLimit.limit(ip)
        if (!success) {
          return NextResponse.json(
            { error: 'Too many requests. Please wait before trying again.' },
            { status: 429 }
          )
        }
      } catch (rateLimitError) {
        console.error('[FORGOT_PASSWORD] Rate limit check failed:', rateLimitError)
      }
    }

    const body = await req.json()
    const parsed = forgotPasswordSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const { email } = parsed.data

    const user = await db.user.findUnique({
      where: { email },
    })

    // We return a success response even if the email is not found to prevent
    // user enumeration attacks — an attacker must not learn which emails are registered.
    if (user) {
      try {
        const resetToken = await createPasswordResetToken(email)
        await sendPasswordResetEmail(email, resetToken.token)
      } catch (emailError) {
        console.error('[FORGOT_PASSWORD] Failed to send email:', emailError)
      }
    }

    return NextResponse.json(
      { message: 'If that email exists, a reset link has been sent.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[FORGOT_PASSWORD]', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
