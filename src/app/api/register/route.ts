import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/password'
import { registerSchema } from '@/lib/validations'
import { createVerificationToken } from '@/lib/tokens'
import { sendVerificationEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        const field = issue.path[0]
        if (typeof field === 'string') {
          fieldErrors[field] = issue.message
        }
      }
      return NextResponse.json({ error: 'Invalid input', fieldErrors }, { status: 400 })
    }

    const { name, email, password } = parsed.data

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    const hashedPassword = await hashPassword(password)

    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    // Generate verification token and send email
    try {
      const verificationToken = await createVerificationToken(email)
      await sendVerificationEmail(email, verificationToken.token)
    } catch (emailError) {
      console.error('[REGISTER] Failed to send verification email:', emailError)
    }

    return NextResponse.json(
      { message: 'Account created. Please check your email to verify your account.' },
      { status: 201 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('[REGISTER] Error:', errorMessage)
    console.error('[REGISTER] Full error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.', details: errorMessage },
      { status: 500 }
    )
  }
}
