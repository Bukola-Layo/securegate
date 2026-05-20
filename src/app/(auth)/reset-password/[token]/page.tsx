import { ResetPasswordForm } from '@/components/forms/ResetPasswordForm'

type ResetPasswordPageProps = {
  params: { token: string }
}

export default function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  return <ResetPasswordForm token={params.token} />
}
