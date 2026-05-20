'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PasswordStrengthIndicator } from '@/components/ui/PasswordStrengthIndicator'
import Link from 'next/link'

type FieldErrors = {
  name?: string
  email?: string
  password?: string
}

export function SignUpForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    setFieldErrors({})
    setIsLoading(true)

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.fieldErrors) {
          setFieldErrors(data.fieldErrors)
        } else {
          setFormError(data.error || 'Something went wrong. Please try again.')
        }
      } else {
        setSuccess(true)
      }
    } catch {
      setFormError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-background">
        <div className="w-full max-w-sm">
          <Card>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[hsl(152,69%,31%)]/10 mb-4">
                <svg className="w-6 h-6 text-[hsl(152,69%,31%)]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-on-surface mb-2">Check your email</h2>
              <p className="text-sm text-on-surface-variant">
                We&apos;ve sent a verification link to <strong className="text-on-surface">{email}</strong>. Please check your inbox and click the link to activate your account.
              </p>
              <p className="text-xs text-outline mt-4">The link expires in 15 minutes.</p>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-sm">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary mb-4">
            <svg className="w-6 h-6 text-on-primary" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-on-surface">Create your account</h1>
          <p className="text-sm text-on-surface-variant mt-1">Join SecureGate to get started</p>
        </div>

        <Card>
          {formError && (
            <div className="rounded-lg bg-error-container/30 border border-error/20 px-4 py-3 text-sm text-error mb-6">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="signup-name"
              label="Full name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              placeholder="Jane Doe"
              error={fieldErrors.name}
              required
            />

            <Input
              id="signup-email"
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
              error={fieldErrors.email}
              required
            />

            <div>
              <Input
                id="signup-password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="••••••••"
                error={fieldErrors.password}
                required
              />
              <PasswordStrengthIndicator password={password} />
            </div>

            <Button
              id="signup-submit"
              label="Create account"
              type="submit"
              isLoading={isLoading}
            />
          </form>

          <p className="mt-6 text-center text-sm text-on-surface-variant">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-primary font-medium hover:opacity-80 transition-opacity"
            >
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
