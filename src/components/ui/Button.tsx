import React from 'react'

type ButtonProps = {
  label: string
  isLoading?: boolean
  type?: 'submit' | 'button' | 'reset'
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  disabled?: boolean
  id?: string
}

export function Button({
  label,
  isLoading = false,
  type = 'button',
  onClick,
  variant = 'primary',
  disabled = false,
  id,
}: ButtonProps) {
  const baseClasses =
    'w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed'

  const variantClasses = {
    primary:
      'bg-primary text-on-primary hover:opacity-90 focus:ring-primary shadow-sm',
    secondary:
      'bg-secondary-container text-on-surface-variant hover:opacity-90 focus:ring-secondary border border-outline-variant',
    ghost:
      'bg-transparent text-primary hover:bg-surface-container-high focus:ring-primary',
  }

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Processing...
        </span>
      ) : (
        label
      )}
    </button>
  )
}
