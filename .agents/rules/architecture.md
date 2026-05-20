---
trigger: always_on
---

# Architecture Rules — SecureGate

## Framework: Next.js 14 App Router

SecureGate is built exclusively on the **Next.js 14 App Router**. There is no Pages Router. Do not mix conventions.

---

## Routing Conventions

### Auth Routes
All authentication pages live under `src/app/(auth)/`. The `(auth)` group is a route group — it does not appear in the URL.

```
src/app/(auth)/login/page.tsx           → /login
src/app/(auth)/signup/page.tsx          → /signup
src/app/(auth)/verify-email/[token]/page.tsx  → /verify-email/:token
src/app/(auth)/forgot-password/page.tsx → /forgot-password
src/app/(auth)/reset-password/[token]/page.tsx → /reset-password/:token
```

### Protected Routes
```
src/app/dashboard/page.tsx              → /dashboard (protected)
```

### API Routes
All API routes live under `src/app/api/`. Every route file is named `route.ts`.

```
src/app/api/auth/[...nextauth]/route.ts   ← NextAuth catch-all handler
src/app/api/register/route.ts             ← POST: create user
src/app/api/verify-email/route.ts         ← POST: verify token
src/app/api/forgot-password/route.ts      ← POST: send reset email
src/app/api/reset-password/route.ts       ← POST: apply new password
```

---

## Middleware

`src/middleware.ts` sits at the project root (`src/`) level. It runs on the Edge runtime.

**Responsibilities:**
- Protect `/dashboard` — redirect unauthenticated users to `/login`
- Protect `/dashboard` from unverified users — redirect to a notice page
- Apply rate limiting on login and forgot-password endpoints

```ts
// matcher config — only run middleware where needed
export const config = {
  matcher: ['/dashboard/:path*', '/api/auth/signin', '/api/forgot-password'],
}
```

---

## Library Layer (`src/lib/`)

Every shared utility lives here. **No business logic inside route handlers or components.**

| File                  | Responsibility                                      |
|-----------------------|-----------------------------------------------------|
| `lib/auth.ts`         | NextAuth config object — options, providers, callbacks |
| `lib/db.ts`           | Prisma client singleton                             |
| `lib/email.ts`        | Resend client + send functions                      |
| `lib/tokens.ts`       | Token generation, save, lookup, expiry, delete      |
| `lib/validations.ts`  | All Zod schemas                                     |
| `lib/rate-limit.ts`   | Upstash rate limiter factory                        |
| `lib/password.ts`     | bcrypt hash and compare wrappers                    |

### Prisma Singleton Pattern

```ts
// src/lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const db =
  globalForPrisma.prisma ?? new PrismaClient({ log: ['error'] })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

Never instantiate `new PrismaClient()` outside of `lib/db.ts`.

---

## Database Schema (Prisma)

Three models. No more for this scope.

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  password      String    // always bcrypt hash
  emailVerified DateTime?
  createdAt     DateTime  @default(now())
}

model VerificationToken {
  id         String   @id @default(cuid())
  identifier String   // user email
  token      String   @unique
  expires    DateTime
}

model PasswordResetToken {
  id      String   @id @default(cuid())
  email   String
  token   String   @unique
  expires DateTime
}
```

---

## Session Strategy

Use **JWT sessions** (not database sessions). Justification:
- No additional DB table needed for this scope
- Stateless — works well on Vercel's Edge/serverless architecture
- Session is invalidated on logout via client-side cookie clearing

Set in `lib/auth.ts`:
```ts
session: { strategy: 'jwt' }
```

---

## Component Architecture

```
src/components/
├── ui/           ← Primitive, reusable, stateless (Button, Input, Label, Card)
└── forms/        ← Stateful form components (LoginForm, SignUpForm, etc.)
```

- `ui/` components receive all data via props — no internal fetch calls.
- `forms/` components own their own state, validation display, and submission logic.
- Pages are thin — they import a single form component and render it.

---

## Email Templates

```
src/emails/
├── VerificationEmail.tsx   ← Email sent on signup
└── PasswordResetEmail.tsx  ← Email sent on forgot-password
```

Built with React Email. Rendered server-side using `render()` from `@react-email/render`.

---

## What This Architecture Is NOT

- Not a monorepo. Single Next.js app only.
- Not using server actions for auth mutations — use explicit API route handlers.
- Not using the `pages/` directory. App Router only.
- Not using any global state library (Redux, Zustand). React state + server session only.