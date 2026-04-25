'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { AlertCircle, CheckCircle2, Info, XCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const alertVariants = cva(
  'relative w-full rounded-2xl p-4 flex gap-3 transition-all duration-300 border shadow-soft',
  {
    variants: {
      variant: {
        default: 'bg-white border-slate-200 text-slate-900',
        destructive: 'bg-rose-50 border-rose-100 text-rose-900',
        success: 'bg-emerald-50 border-emerald-100 text-emerald-900',
        warning: 'bg-amber-50 border-amber-100 text-amber-900',
        info: 'bg-blue-50 border-blue-100 text-blue-900',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const icons = {
  default: Info,
  destructive: AlertCircle,
  success: CheckCircle2,
  warning: AlertCircle,
  info: Info,
}

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  onClose?: () => void
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', children, onClose, ...props }, ref) => {
    const Icon = icons[variant as keyof typeof icons] || Info

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        <div className="flex-shrink-0">
          <Icon className="h-5 w-5 opacity-90" />
        </div>
        <div className="flex-1 text-sm font-semibold leading-relaxed">
          {children}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 ml-auto hover:opacity-70 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  }
)
Alert.displayName = 'Alert'

export { Alert }
