---
trigger: always_on
---

# Code Style Rules — SecureGate

## Language: TypeScript (Strict Mode)

All files are `.ts` or `.tsx`. The `tsconfig.json` must include:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitAny": true
  }
}
```

**Never use `any`.** Use `unknown` and narrow the type. If a third-party lib forces `any`, wrap it in a typed helper.

---

## Naming Conventions

| Thing              | Convention         | Example                          |
|--------------------|--------------------|----------------------------------|
| Files (components) | PascalCase         | `LoginForm.tsx`                  |
| Files (utils/lib)  | kebab-case         | `rate-limit.ts`                  |
| Files (routes)     | lowercase          | `route.ts`, `page.tsx`           |
| React components   | PascalCase         | `PasswordStrengthIndicator`      |
| Functions          | camelCase          | `generateVerificationToken()`    |
| Constants          | SCREAMING_SNAKE    | `SALT_ROUNDS`, `TOKEN_EXPIRY_MS` |
| Types/Interfaces   | PascalCase         | `SessionUser`, `RegisterInput`   |
| Zod schemas        | camelCase + Schema | `registerSchema`, `loginSchema`  |
| DB models (Prisma) | PascalCase         | `User`, `VerificationToken`      |
| Env vars           | SCREAMING_SNAKE    | `SMTP_PASS`                 |

---

## File Structure Within a File

Order sections as follows:

```ts
// 1. Imports (external → internal → types)
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { RegisterInput } from '@/lib/validations'

// 2. Constants (if any)
const SALT_ROUNDS = 12

// 3. Main export (function, component, or config object)
export async function POST(req: Request) { ... }

// 4. Helper functions used only in this file (bottom of file)
function buildErrorResponse(message: string) { ... }
```

---

## API Route Handlers

Every route handler follows this exact pattern:

```ts
export async function POST(req: Request) {
  try {
    // 1. Parse and validate input
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    // 2. Rate limit check (if applicable)
    // 3. Business logic
    // 4. Return success response

  } catch (error) {
    console.error('[ROUTE_NAME]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

Rules:
- Always use `try/catch` at the top level of every handler.
- Never return stack traces or raw error objects to the client.
- Always return `NextResponse.json()` — never `Response` directly.
- Log errors server-side with a tag: `console.error('[REGISTER]', error)`.

---

## Zod Validation

All Zod schemas live in `src/lib/validations.ts`. Never define inline schemas in route handlers.

```ts
// src/lib/validations.ts
import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number')
    .regex(/[^a-zA-Z0-9]/, 'Must contain a special character'),
})

export type RegisterInput = z.infer<typeof registerSchema>
```

Use `safeParse()` — never `parse()` in route handlers (it throws unhandled exceptions).

---

## React Components

```tsx
// Good — explicit prop types, no implicit returns on multi-line
type ButtonProps = {
  label: string
  isLoading?: boolean
  onClick: () => void
}

export function Button({ label, isLoading = false, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="..."
    >
      {isLoading ? 'Loading...' : label}
    </button>
  )
}
```

Rules:
- Always define prop types explicitly — no inline object types in the function signature.
- Use named exports, not default exports, for components (except `page.tsx` and `layout.tsx`).
- Pages (`page.tsx`) are `default export` as required by Next.js.
- No component should be longer than ~150 lines. Extract sub-components if needed.

---

## Imports

Use the `@/` path alias for all internal imports:

```ts
// Good
import { db } from '@/lib/db'
import { LoginForm } from '@/components/forms/LoginForm'

// Bad
import { db } from '../../../lib/db'
```

Import order (enforced by project convention):
1. React / Next.js
2. Third-party packages
3. Internal `@/lib/`
4. Internal `@/components/`
5. Types

---

## Error Messages (User-Facing)

Rules:
- Never say "User not found" or "Wrong password" separately — always use: `"Invalid email or password"`
- Never expose whether a token is expired vs. not found — use: `"This link is invalid or has expired"`
- Never expose internal error details — log server-side, return generic message client-side
- Every form error must be specific enough for the user to act on it

```ts
// Bad
return NextResponse.json({ error: error.message }, { status: 500 })

// Good
console.error('[VERIFY_EMAIL]', error)
return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
```

---

## Comments

- Do not comment what the code does — write readable code instead.
- Do comment **why** a decision was made, especially for security choices.

```ts
// We return a success response even if the email is not found to prevent
// user enumeration attacks — an attacker must not learn which emails are registered.
return NextResponse.json({ message: 'If that email exists, a reset link has been sent.' })
```

---

## Forbidden Patterns

| Pattern                         | Why Forbidden                              |
|---------------------------------|--------------------------------------------|
| `console.log` in production     | Use `console.error` with tags only         |
| `any` type                      | Defeats TypeScript's purpose               |
| Inline Zod schemas in handlers  | Breaks single-responsibility               |
| `new PrismaClient()` in routes  | Causes connection pool exhaustion          |
| Hardcoded secrets               | Critical security violation                |
| `process.exit()`                | Never in Next.js                           |
| Default exports for components  | Except `page.tsx` / `layout.tsx`           |