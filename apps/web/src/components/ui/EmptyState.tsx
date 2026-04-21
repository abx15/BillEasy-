'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'py-8',
  md: 'py-12',
  lg: 'py-16',
}

const iconSizes = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
  lg: 'w-20 h-20',
}

const titleSizes = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
  size = 'md',
}: EmptyStateProps) {
  return (
    <div className={cn(
      'text-center flex flex-col items-center justify-center',
      sizeClasses[size],
      className
    )}>
      {icon && (
        <div className={cn(
          'text-muted-foreground mb-4',
          iconSizes[size]
        )}>
          {icon}
        </div>
      )}
      
      <h3 className={cn(
        'font-semibold text-foreground mb-2',
        titleSizes[size]
      )}>
        {title}
      </h3>
      
      {description && (
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {description}
        </p>
      )}
      
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn btn-primary"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

// Specific empty state components for common use cases

export function NoDataEmptyState({ 
  message = 'No data available',
  description = 'Try adjusting your search or filters',
  onClearFilters,
  className 
}: {
  message?: string
  description?: string
  onClearFilters?: () => void
  className?: string
}) {
  return (
    <EmptyState
      icon={
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      }
      title={message}
      description={description}
      actionLabel={onClearFilters ? 'Clear filters' : undefined}
      onAction={onClearFilters || undefined}
      className={className}
    />
  )
}

export function NoCustomersEmptyState({ onAddCustomer, className }: {
  onAddCustomer?: () => void
  className?: string
}) {
  return (
    <EmptyState
      icon={
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      }
      title="No customers yet"
      description="Start by adding your first customer to begin creating bills"
      actionLabel="Add Customer"
      onAction={onAddCustomer}
      className={className}
    />
  )
}

export function NoProductsEmptyState({ onAddProduct, className }: {
  onAddProduct?: () => void
  className?: string
}) {
  return (
    <EmptyState
      icon={
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      }
      title="No products in inventory"
      description="Add products to your inventory to start billing"
      actionLabel="Add Product"
      onAction={onAddProduct}
      className={className}
    />
  )
}

export function NoBillsEmptyState({ onCreateBill, className }: {
  onCreateBill?: () => void
  className?: string
}) {
  return (
    <EmptyState
      icon={
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      }
      title="No bills created yet"
      description="Create your first bill to get started with billing"
      actionLabel="Create Bill"
      onAction={onCreateBill}
      className={className}
    />
  )
}

export function NoSearchResultsEmptyState({ 
  searchTerm,
  onClearSearch,
  className 
}: {
  searchTerm: string
  onClearSearch?: () => void
  className?: string
}) {
  return (
    <EmptyState
      icon={
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      }
      title="No results found"
      description={`No results found for "${searchTerm}". Try a different search term.`}
      actionLabel="Clear search"
      onAction={onClearSearch}
      className={className}
    />
  )
}

export function ErrorEmptyState({ 
  error,
  onRetry,
  className 
}: {
  error: string
  onRetry?: () => void
  className?: string
}) {
  return (
    <EmptyState
      icon={
        <svg className="w-full h-full text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      }
      title="Something went wrong"
      description={error}
      actionLabel={onRetry ? 'Try again' : undefined}
      onAction={onRetry || undefined}
      className={className}
    />
  )
}
