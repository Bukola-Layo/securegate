'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setFormError('Invalid email or password')
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch {
      setFormError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-sm">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary mb-4">
            <svg className="w-6 h-6 text-on-primary" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-on-surface">Welcome back</h1>
          <p className="text-sm text-on-surface-variant mt-1">Sign in to your SecureGate account</p>
        </div>

        <Card>
          {formError && (
            <div className="rounded-lg bg-error-container/30 border border-error/20 px-4 py-3 text-sm text-error mb-6">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="login-email"
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
              required
            />

            <Input
              id="login-password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
              required
            />

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-xs text-primary hover:opacity-80 transition-opacity"
              >
                Forgot your password?
              </Link>
            </div>

            <Button
              id="login-submit"
              label="Sign in"
              type="submit"
              isLoading={isLoading}
            />
          </form>

          <p className="mt-6 text-center text-sm text-on-surface-variant">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="text-primary font-medium hover:opacity-80 transition-opacity"
            >
              Sign up
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
