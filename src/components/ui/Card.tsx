import React from 'react'

type CardProps = {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`
        bg-surface-container-lowest rounded-2xl
        border border-outline-variant
        shadow-lg shadow-primary/5
        p-8
        ${className}
      `}
    >
      {children}
    </div>
  )
}
