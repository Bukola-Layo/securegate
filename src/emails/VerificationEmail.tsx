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

type VerificationEmailProps = {
  verificationUrl: string
}

export const VerificationEmail = ({ verificationUrl }: VerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Verify your email address for SecureGate</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Verify your email address</Heading>
        <Text style={text}>
          Thank you for signing up for SecureGate. Please verify your email address by
          clicking the link below.
        </Text>
        <Link href={verificationUrl} style={button}>
          Verify Email Address
        </Link>
        <Text style={text}>
          Or copy and paste this URL into your browser:{' '}
          <Link href={verificationUrl} style={anchor}>
            {verificationUrl}
          </Link>
        </Text>
        <Text style={muted}>This link expires in 15 minutes.</Text>
      </Container>
    </Body>
  </Html>
)

export default VerificationEmail

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
