'use client'

import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, ...props }, ref) => {
    return (
      <div className="space-y-2 group">
        {label && (
          <label className="text-sm font-bold text-neutral-900 ml-1 tracking-tight">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'flex h-12 w-full rounded-input border border-neutral-300 bg-white px-4 py-2 text-sm font-medium transition-all duration-300 placeholder:text-neutral-500 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary shadow-inner-soft hover:border-neutral-500 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus:ring-red-50',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600 font-bold ml-1">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
