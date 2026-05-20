'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (res.status === 429) {
        setFormError('Too many requests. Please wait before trying again.')
      } else {
        // We return a success response even if the email is not found to prevent
        // user enumeration attacks — an attacker must not learn which emails are registered.
        setSubmitted(true)
      }
    } catch {
      setFormError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (submitted) {
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
                If that email address is in our system, we&apos;ve sent a password reset link. Check your inbox.
              </p>
              <p className="text-xs text-outline mt-4">The link expires in 1 hour.</p>
              <Link
                href="/login"
                className="inline-block mt-6 text-sm text-primary font-medium hover:opacity-80 transition-opacity"
              >
                ← Back to login
              </Link>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary mb-4">
            <svg className="w-6 h-6 text-on-primary" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-on-surface">Forgot password?</h1>
          <p className="text-sm text-on-surface-variant mt-1">Enter your email and we&apos;ll send you a reset link</p>
        </div>

        <Card>
          {formError && (
            <div className="rounded-lg bg-error-container/30 border border-error/20 px-4 py-3 text-sm text-error mb-6">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="forgot-email"
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
              required
            />

            <Button
              id="forgot-submit"
              label="Send reset link"
              type="submit"
              isLoading={isLoading}
            />
          </form>

          <p className="mt-6 text-center text-sm text-on-surface-variant">
            <Link
              href="/login"
              className="text-primary font-medium hover:opacity-80 transition-opacity"
            >
              ← Back to login
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
