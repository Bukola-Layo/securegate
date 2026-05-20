# AGENTS.md — SecureGate Project Context

## What Is This Project?

SecureGate is a **production-ready, standalone authentication system** built as a Next.js 14 App Router application. It is not a full product — it is the deeply-executed auth layer you would extract from any serious application and study under a microscope.

This file is the master context document for every AI agent, tool, or developer working on this codebase. Read it fully before writing a single line of code.

---

## Project Identity

| Field        | Value                                      |
|--------------|--------------------------------------------|
| Project Name | SecureGate                                 |
| Type         | Standalone Auth & Security App             |
| Framework    | Next.js 14 (App Router)                    |
| Language     | TypeScript (strict mode)                   |
| Database     | PostgreSQL via Prisma ORM                  |
| Auth         | NextAuth.js (Credentials Provider)         |
| Email        | Resend + React Email                       |
| Validation   | Zod (server-side only)                     |
| Rate Limit   | Upstash Redis / custom middleware          |
| Styling      | Tailwind CSS                               |
| Deployment   | Vercel                                     |
| Repo         | GitHub                                     |

---

## Feature Scope (Build Only What Is Listed)

- [x] Sign Up — form validation, password strength indicator, email confirmation via Resend
- [x] Login — email + password, NextAuth session, non-leaking error messages
- [x] Email Verification — token link, expiry check, account verified in DB
- [x] Protected Dashboard — accessible only to verified + authenticated users
- [x] Forgot Password — request reset, receive email, submit new password, token expires
- [x] Rate Limiting — brute-force protection on login + forgot-password endpoints
- [x] Logout — clean session destruction, redirect to /login
- [x] Password Hashing — bcrypt with salt rounds of 12

**NOT in scope (YAGNI):** Social login, MFA, audit logs, payments (unless extended), admin panel.

---

## Repository Structure

```
securegate/
├── .agents/                  ← AI agent context (this folder)
│   ├── AGENTS.md
│   ├── rules/
│   │   ├── architecture.md
│   │   ├── code-styles.md
│   │   ├── design-system.md
│   │   └── security.md
│   ├── skills/
│   │   ├── flutterwave-integration/
│   │   ├── component-builder/
│   │   ├── api-route-scaffolder/
│   │   └── db-migration-runner/
│   └── workflows/
│       ├── new-component.md
│       └── new-api-route.md
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   ├── verify-email/[token]/
│   │   │   ├── forgot-password/
│   │   │   └── reset-password/[token]/
│   │   ├── dashboard/
│   │   └── api/
│   │       ├── auth/[...nextauth]/
│   │       ├── register/
│   │       ├── verify-email/
│   │       ├── forgot-password/
│   │       └── reset-password/
│   ├── components/
│   │   ├── ui/
│   │   └── forms/
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── db.ts
│   │   ├── email.ts
│   │   ├── tokens.ts
│   │   └── validations.ts
│   ├── emails/
│   │   ├── VerificationEmail.tsx
│   │   └── PasswordResetEmail.tsx
│   └── middleware.ts
├── .env.local                ← NEVER commit this
├── .gitignore
├── next.config.js
├── REFLECTION.md
└── README.md
```

---

## Environment Variables

These must exist in `.env.local` locally and in the Vercel dashboard for production. **Never hardcode them.**

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
RESEND_API_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

---

## Agent Instruction Index

| Concern          | Read This File                              |
|------------------|---------------------------------------------|
| Architecture     | `.agents/rules/architecture.md`             |
| Code Style       | `.agents/rules/code-styles.md`              |
| Design System    | `.agents/rules/design-system.md`            |
| Security Rules   | `.agents/rules/security.md`                 |
| Build a Component| `.agents/skills/component-builder/SKILL.md` |
| Build an API Route| `.agents/skills/api-route-scaffolder/SKILL.md` |
| Run DB Migration | `.agents/skills/db-migration-runner/SKILL.md` |
| Flutterwave      | `.agents/skills/flutterwave-integration/SKILL.md` |
| New Component WF | `.agents/workflows/new-component.md`        |
| New API Route WF | `.agents/workflows/new-api-route.md`        |

---

## Cardinal Rules for Every Agent

1. **Never commit `.env.local`** — check `.gitignore` before every push.
2. **Never store plain-text passwords** — bcrypt with 12 salt rounds, always.
3. **Never leak whether an email exists** — forgot-password always returns success.
4. **Never trust client input** — validate everything with Zod on the server.
5. **Never skip token expiry checks** — verification tokens: 15 min; reset tokens: 1 hour.
6. **Never write a route handler that does more than one job** — split concerns.
7. **Always handle the error path before the happy path.**
8. **Always read the relevant rule file before generating code for that concern.**