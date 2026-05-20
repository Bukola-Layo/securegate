import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyEmailSchema } from '@/lib/validations'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = verifyEmailSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const { token } = parsed.data

    const verificationToken = await db.verificationToken.findUnique({
      where: { token },
    })

    if (!verificationToken) {
      return NextResponse.json(
        { error: 'This link is invalid or has expired.' },
        { status: 400 }
      )
    }

    // Check token expiry
    if (verificationToken.expires < new Date()) {
      // Delete expired token
      await db.verificationToken.delete({ where: { id: verificationToken.id } })
      return NextResponse.json(
        { error: 'This link is invalid or has expired.' },
        { status: 400 }
      )
    }

    // Mark user as verified
    await db.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() },
    })

    // Delete consumed token — consumed tokens must not be reusable
    await db.verificationToken.delete({ where: { id: verificationToken.id } })

    return NextResponse.json(
      { message: 'Email verified successfully.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[VERIFY_EMAIL]', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
