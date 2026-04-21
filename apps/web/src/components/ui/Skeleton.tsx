'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'default' | 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string | number
  height?: string | number
  lines?: number // for text variant
}

export function Skeleton({ 
  className = '', 
  variant = 'default',
  width,
  height,
  lines = 1
}: SkeletonProps) {
  const variantClasses = {
    default: 'rounded-lg',
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  }

  const style: React.CSSProperties = {}
  if (width) style.width = typeof width === 'number' ? `${width}px` : width
  if (height) style.height = typeof height === 'number' ? `${height}px` : height

  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('space-y-1', className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-4 bg-muted animate-pulse rounded',
              index === lines - 1 && 'w-3/4' // Last line is shorter
            )}
            style={index === 0 ? style : undefined}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'bg-muted animate-pulse',
        variantClasses[variant],
        className
      )}
      style={style}
    />
  )
}

// Card skeleton component
export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={cn('card', className)}>
      <div className="card-header">
        <Skeleton variant="text" width="60%" height="20px" />
        <Skeleton variant="text" width="40%" height="16px" className="mt-2" />
      </div>
      <div className="card-content">
        <div className="space-y-3">
          <Skeleton variant="text" height="16px" />
          <Skeleton variant="text" height="16px" />
          <Skeleton variant="text" width="80%" height="16px" />
        </div>
      </div>
      <div className="card-footer">
        <Skeleton variant="rectangular" width="100px" height="36px" />
      </div>
    </div>
  )
}

// Table row skeleton component
export function TableRowSkeleton({ columns = 4, className = '' }: { columns?: number; className?: string }) {
  return (
    <tr className={cn('border-b border-border', className)}>
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="py-3 px-4">
          <Skeleton variant="text" height="16px" />
        </td>
      ))}
    </tr>
  )
}

// Avatar skeleton component
export function AvatarSkeleton({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  return (
    <Skeleton 
      variant="circular" 
      className={cn(sizeClasses[size], className)}
    />
  )
}

// List skeleton component
export function ListSkeleton({ items = 3, className = '' }: { items?: number; className?: string }) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3">
          <AvatarSkeleton />
          <div className="flex-1 space-y-1">
            <Skeleton variant="text" width="40%" height="16px" />
            <Skeleton variant="text" width="60%" height="14px" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Stats card skeleton component
export function StatsCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={cn('card', className)}>
      <div className="card-content">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton variant="text" width="80px" height="14px" />
            <Skeleton variant="text" width="120px" height="24px" />
          </div>
          <Skeleton variant="circular" width="48px" height="48px" />
        </div>
        <div className="mt-4">
          <Skeleton variant="text" width="100px" height="14px" />
        </div>
      </div>
    </div>
  )
}
