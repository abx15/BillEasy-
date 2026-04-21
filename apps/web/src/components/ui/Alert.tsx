'use client'

import { cn } from '@/lib/utils'
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react'
import { ReactNode } from 'react'

interface AlertProps {
  variant?: 'default' | 'destructive' | 'success' | 'warning'
  className?: string
  children: ReactNode
  dismissible?: boolean
  onDismiss?: () => void
}

const alertVariants = {
  variant: {
    default: 'bg-background text-foreground border-border',
    destructive: 'bg-destructive/10 text-destructive border-destructive/20',
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
  },
  icon: {
    default: Info,
    destructive: AlertCircle,
    success: CheckCircle,
    warning: AlertCircle,
  },
}

export function Alert({ variant = 'default', className, children, dismissible = false, onDismiss }: AlertProps) {
  const Icon = alertVariants.icon[variant]

  return (
    <div
      className={cn(
        'relative flex items-start gap-3 rounded-lg border p-4',
        alertVariants.variant[variant],
        className
      )}
    >
      <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
      <div className="flex-1 text-sm">{children}</div>
      {dismissible && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

export function AlertDescription({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('text-sm opacity-90', className)}>{children}</div>
}
