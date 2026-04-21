'use client'

import { cn } from '@/lib/utils'

type BadgeStatus = 
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'destructive'
  | 'secondary'
  | 'outline'
  | 'PAID'
  | 'PENDING'
  | 'PARTIAL'
  | 'LOW'
  | 'OUT_OF_STOCK'

interface BadgeProps {
  children: React.ReactNode
  status?: BadgeStatus
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const statusClasses: Record<BadgeStatus, string> = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/80',
  primary: 'bg-primary text-primary-foreground hover:bg-primary/80',
  success: 'bg-success text-success-foreground hover:bg-success/80',
  warning: 'bg-warning text-warning-foreground hover:bg-warning/80',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/80',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  outline: 'text-foreground border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  
  // Bill status specific colors
  PAID: 'bg-success text-success-foreground',
  PENDING: 'bg-warning text-warning-foreground',
  PARTIAL: 'bg-primary text-primary-foreground',
  
  // Stock status specific colors
  LOW: 'bg-warning text-warning-foreground',
  OUT_OF_STOCK: 'bg-destructive text-destructive-foreground',
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm',
}

export function Badge({ children, status = 'default', className = '', size = 'md' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        statusClasses[status],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  )
}

// Status-specific badge components
export function StatusBadge({ status, children, ...props }: Omit<BadgeProps, 'status'> & { status: 'PAID' | 'PENDING' | 'PARTIAL' }) {
  return <Badge status={status} {...props}>{children}</Badge>
}

export function StockBadge({ status, children, ...props }: Omit<BadgeProps, 'status'> & { status: 'LOW' | 'OUT_OF_STOCK' }) {
  return <Badge status={status} {...props}>{children}</Badge>
}

// Icon badge component
interface IconBadgeProps extends BadgeProps {
  icon: React.ReactNode
}

export function IconBadge({ icon, children, ...props }: IconBadgeProps) {
  return (
    <Badge {...props}>
      <span className="mr-1">{icon}</span>
      {children}
    </Badge>
  )
}
