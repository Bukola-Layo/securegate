---
trigger: always_on
---

# Security Rules — SecureGate

## Governing Principle

> "Your system's security must not depend on secrecy of its design."
> — Kerckhoffs's Principle

Security in SecureGate comes from correct implementation, not obscurity. Every rule in this file is non-negotiable. Violating any of them is a critical failure, not a style issue.

---

## 1. Password Hashing

**Always use bcrypt via `bcryptjs`. Salt rounds must be 12.**

```ts
// src/lib/password.ts
import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 12

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS)
}

export async function verifyPassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed)
}
```

**Why 12 rounds?** bcrypt is intentionally slow. 12 rounds makes each hash take ~250ms — negligible for a real user, but devastating for a brute-force attacker running thousands of attempts.

**Never use:**
- `sha256`, `md5`, `sha1` — fast hashing algorithms, vulnerable to rainbow table and dictionary attacks
- `bcrypt.hashSync()` in async contexts — it blocks the event loop
- Salt rounds below 10 — insufficient work factor

**Verification in DB:** A correctly hashed password always starts with `$2b$12$`. If you see plain text or a hex string, it was stored wrong.

---

## 2. Token Generation

All tokens (email verification, password reset) must be cryptographically random.

```ts
// src/lib/tokens.ts
import crypto from 'crypto'
import { db } from '@/lib/db'

const VERIFICATION_EXPIRY_MS = 15 * 60 * 1000      // 15 minutes
const RESET_EXPIRY_MS        = 60 * 60 * 1000      // 1 hour

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex') // 64-char hex string
}

export async function createVerificationToken(email: string) {
  // Delete any existing token for this email first
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
```

**Rules:**
- Never use `Math.random()` for security tokens — it is not cryptographically secure.
- Always delete the old token before creating a new one (one active token per user per flow).
- Always delete the token **immediately after use** — consumed tokens must not be reusable.
- Always check `expires > new Date()` before accepting a token.

---

## 3. Rate Limiting

### Login Endpoint
- **5 attempts per IP per 10 minutes**
- After limit hit: return `429 Too Many Requests`
- Message: `"Too many login attempts. Please wait before trying again."`

### Forgot Password Endpoint
- **3 attempts per IP per 15 minutes**
- Same 429 response pattern

```ts
// src/lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export const loginRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '10 m'),
  analytics: false,
})

export const forgotPasswordRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '15 m'),
  analytics: false,
})
```

**Usage in middleware or route handler:**
```ts
const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1'
const { success } = await loginRateLimit.limit(ip)
if (!success) {
  return NextResponse.json(
    { error: 'Too many login attempts. Please wait before trying again.' },
    { status: 429 }
  )
}
```

---

## 4. Error Message Security

**The golden rule: error messages must never confirm or deny the existence of a user, email, or password.**

| Scenario                       | Wrong Message ❌                        | Correct Message ✅                      |
|-------------------------------|----------------------------------------|-----------------------------------------|
| Wrong password                | "Incorrect password"                   | "Invalid email or password"             |
| Email not registered          | "No account found for this email"      | "Invalid email or password"             |
| Forgot password, no account   | "That email is not registered"         | "If that email exists, a reset link has been sent." |
| Token expired                 | "Token expired"                        | "This link is invalid or has expired."  |
| Token not found               | "Token not found"                      | "This link is invalid or has expired."  |

**Never return stack traces, Prisma errors, or raw exception messages to the client.**

---

## 5. Input Validation

**All input is validated on the server using Zod. Client-side validation is UX-only — never trust it for security.**

```ts
// Every POST handler must start with this pattern
const body = await req.json()
const parsed = schema.safeParse(body)
if (!parsed.success) {
  return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
}
const data = parsed.data // typed and safe to use
```

**Never:**
- Use `req.json()` output directly without parsing
- Query the database with unvalidated user input
- Assume an email field actually contains an email

---

## 6. Environment Variables

```ts
// Always access env vars through process.env
// Always assert they exist at startup, not lazily

// src/lib/email.ts
if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set')
}
```

**Rules:**
- `.env.local` must be in `.gitignore` before the first commit.
- All secrets go in Vercel's Environment Variables dashboard — never in code.
- Never log environment variables, even in development.
- The `NEXTAUTH_SECRET` must be a long, random string: `openssl rand -base64 32`

---

## 7. HTTP Security Headers

Add to `next.config.js`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

---

## 8. Session Security

- Session strategy: JWT (stateless)
- `NEXTAUTH_SECRET` must be set — NextAuth will refuse to start without it in production
- On logout: call `signOut({ callbackUrl: '/login' })` — this clears the JWT cookie
- Never store sensitive data (passwords, tokens) in the session JWT payload

```ts
// src/lib/auth.ts — callbacks
callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id
      token.emailVerified = user.emailVerified
    }
    return token
  },
  async session({ session, token }) {
    if (token) {
      session.user.id = token.id as string
      session.user.emailVerified = token.emailVerified as Date | null
    }
    return session
  },
},
```

---

## 9. Protected Route Enforcement

Middleware must enforce this rule: **a user is allowed to see /dashboard if and only if:**
1. They have a valid session (authenticated)
2. Their `emailVerified` is not null (verified)

```ts
// src/middleware.ts
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isVerified = token?.emailVerified !== null && token?.emailVerified !== undefined

    if (!isVerified) {
      return NextResponse.redirect(new URL('/verify-email-notice', req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = { matcher: ['/dashboard/:path*'] }
```

---

## 10. Security Checklist (Run Before Every Commit)

- [ ] No plain-text passwords in DB
- [ ] No secrets in source code
- [ ] `.env.local` not tracked by git
- [ ] Rate limiting active on login and forgot-password
- [ ] All tokens checked for expiry before use
- [ ] All error messages non-enumerable
- [ ] All inputs validated with Zod on the server
- [ ] Security headers present in `next.config.js`
- [ ] No stack traces returned to the client