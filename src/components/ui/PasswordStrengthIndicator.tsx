import React from 'react'

type PasswordStrengthIndicatorProps = {
  password: string
}

function getStrength(password: string): { level: number; label: string } {
  if (password.length === 0) return { level: 0, label: '' }

  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++
  if (password.length >= 10) score++

  if (score <= 1) return { level: 1, label: 'Weak' }
  if (score <= 3) return { level: 2, label: 'Fair' }
  return { level: 3, label: 'Strong' }
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const { level, label } = getStrength(password)

  if (password.length === 0) return null

  const barColors = [
    level >= 1 ? 'bg-error' : 'bg-outline-variant',
    level >= 2 ? 'bg-[hsl(45,93%,47%)]' : 'bg-outline-variant',
    level >= 3 ? 'bg-[hsl(152,69%,31%)]' : 'bg-outline-variant',
  ]

  const labelColor =
    level === 1
      ? 'text-error'
      : level === 2
        ? 'text-[hsl(45,93%,47%)]'
        : 'text-[hsl(152,69%,31%)]'

  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {barColors.map((color, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${color}`}
          />
        ))}
      </div>
      <p className={`text-xs ${labelColor}`}>{label}</p>
    </div>
  )
}
