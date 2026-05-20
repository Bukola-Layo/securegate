import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from '@react-email/components'
import * as React from 'react'

type PasswordResetEmailProps = {
  resetUrl: string
}

export const PasswordResetEmail = ({ resetUrl }: PasswordResetEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset your SecureGate password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Reset your password</Heading>
        <Text style={text}>
          We received a request to reset your password for your SecureGate account. 
          If you didn&apos;t make this request, you can safely ignore this email.
        </Text>
        <Link href={resetUrl} style={button}>
          Reset Password
        </Link>
        <Text style={text}>
          Or copy and paste this URL into your browser:{' '}
          <Link href={resetUrl} style={anchor}>
            {resetUrl}
          </Link>
        </Text>
        <Text style={muted}>This link expires in 1 hour.</Text>
      </Container>
    </Body>
  </Html>
)

export default PasswordResetEmail

const main = {
  backgroundColor: '#fafafa',
  fontFamily: 'Inter, sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  border: '1px solid #e4e4e7',
}

const h1 = {
  color: '#18181b',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '32px',
  margin: '0 0 20px',
}

const text = {
  color: '#71717a',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 0 24px',
}

const button = {
  backgroundColor: '#18181b',
  borderRadius: '6px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '14px',
  fontWeight: '500',
  lineHeight: '40px',
  textAlign: 'center' as const,
  textDecoration: 'none',
  padding: '0 24px',
  margin: '0 0 24px',
}

const anchor = {
  color: '#18181b',
  textDecoration: 'underline',
}

const muted = {
  color: '#a1a1aa',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '0',
}
