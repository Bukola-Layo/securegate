import React from 'react'

type InputProps = {
  id: string
  label: string
  type?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  autoComplete?: string
  disabled?: boolean
  required?: boolean
}

export function Input({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  autoComplete,
  disabled = false,
  required = false,
}: InputProps) {
  const errorId = error ? `${id}-error` : undefined

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-on-surface-variant mb-1"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        disabled={disabled}
        required={required}
        aria-describedby={errorId}
        aria-invalid={!!error}
        className={`
          mt-1 block w-full rounded-lg border px-3 py-2.5 text-sm
          text-on-surface bg-surface-container-lowest
          placeholder:text-outline
          focus:outline-none focus:ring-2 focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-200
          ${error
            ? 'border-error focus:ring-error'
            : 'border-outline-variant focus:ring-primary'
          }
        `}
      />
      {error && (
        <p id={errorId} className="mt-1 text-xs text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
