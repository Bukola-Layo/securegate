import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/password'
import { resetPasswordSchema } from '@/lib/validations'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = resetPasswordSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const { token, password } = parsed.data

    const resetToken = await db.passwordResetToken.findUnique({
      where: { token },
    })

    if (!resetToken) {
      return NextResponse.json(
        { error: 'This link is invalid or has expired.' },
        { status: 400 }
      )
    }

    // Check token expiry
    if (resetToken.expires < new Date()) {
      await db.passwordResetToken.delete({ where: { id: resetToken.id } })
      return NextResponse.json(
        { error: 'This link is invalid or has expired.' },
        { status: 400 }
      )
    }

    const hashedPassword = await hashPassword(password)

    // Update password
    await db.user.update({
      where: { email: resetToken.email },
      data: { password: hashedPassword },
    })

    // Delete consumed token — consumed tokens must not be reusable
    await db.passwordResetToken.delete({ where: { id: resetToken.id } })

    return NextResponse.json(
      { message: 'Password has been reset successfully.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[RESET_PASSWORD]', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
