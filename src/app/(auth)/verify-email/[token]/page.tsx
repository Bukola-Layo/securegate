'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'

type VerifyEmailPageProps = {
  params: { token: string }
}

export default function VerifyEmailPage({ params }: VerifyEmailPageProps) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function verify() {
      try {
        const res = await fetch('/api/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: params.token }),
        })

        const data = await res.json()

        if (res.ok) {
          setStatus('success')
          setMessage(data.message)
        } else {
          setStatus('error')
          setMessage(data.error)
        }
      } catch {
        setStatus('error')
        setMessage('Something went wrong. Please try again.')
      }
    }

    verify()
  }, [params.token])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-sm">
        <Card>
          <div className="text-center">
            {status === 'loading' && (
              <>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <svg className="w-6 h-6 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-on-surface mb-2">Verifying your email...</h2>
                <p className="text-sm text-on-surface-variant">Please wait while we verify your email address.</p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[hsl(152,69%,31%)]/10 mb-4">
                  <svg className="w-6 h-6 text-[hsl(152,69%,31%)]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-on-surface mb-2">Email verified!</h2>
                <p className="text-sm text-on-surface-variant">{message}</p>
                <Link
                  href="/login"
                  className="inline-block mt-6 text-sm bg-primary text-on-primary px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Go to login
                </Link>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-error/10 mb-4">
                  <svg className="w-6 h-6 text-error" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-on-surface mb-2">Verification failed</h2>
                <p className="text-sm text-on-surface-variant">{message}</p>
                <Link
                  href="/login"
                  className="inline-block mt-6 text-sm text-primary font-medium hover:opacity-80 transition-opacity"
                >
                  ← Back to login
                </Link>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
