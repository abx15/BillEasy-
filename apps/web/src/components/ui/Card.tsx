'use client'

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'glass' | 'outline'
  noPadding?: boolean
}

export function Card({ 
  children, 
  className, 
  variant = 'default',
  noPadding = false 
}: CardProps) {
  const variants = {
    default: 'bg-white border-gray-200 shadow-soft hover:shadow-medium',
    glass: 'bg-white/70 backdrop-blur-md border border-white/20 shadow-soft',
    outline: 'bg-transparent border-gray-200',
  }

  return (
    <div className={cn(
      'rounded-[1rem] border transition-all duration-300 overflow-hidden',
      variants[variant],
      !noPadding && 'p-6',
      className
    )}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: CardProps) {
  return (
    <div className={cn('p-6 pb-4', className)}>
      {children}
    </div>
  )
}

export function CardContent({ children, className }: CardProps) {
  return (
    <div className={cn('p-6 pt-0', className)}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className }: CardProps) {
  return (
    <div className={cn('p-6 pt-4 border-t border-gray-200', className)}>
      {children}
    </div>
  )
}
