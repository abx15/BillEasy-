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
          <label className="text-sm font-bold text-foreground ml-1 tracking-tight">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'flex h-12 w-full rounded-input border border-border bg-white px-4 py-2 text-sm font-medium transition-all duration-300 placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-500 shadow-inner-soft hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive-500 focus:ring-destructive-50',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-destructive-600 font-bold ml-1">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
