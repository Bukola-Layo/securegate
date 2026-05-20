import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isVerified = token?.emailVerified !== null && token?.emailVerified !== undefined

    if (!isVerified) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*'],
}
