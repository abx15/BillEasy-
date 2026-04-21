'use client'

import { ReactNode } from 'react'

export interface TableColumn<T> {
  key: keyof T
  label: string
  render?: (value: any, item: T, index: number) => ReactNode
  className?: string
  sortable?: boolean
}

interface TableProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
  className?: string
  onRowClick?: (item: T, index: number) => void
  stickyHeader?: boolean
  hover?: boolean
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data available',
  className = '',
  onRowClick,
  stickyHeader = true,
  hover = true,
}: TableProps<T>) {
  if (loading) {
    return <TableSkeleton columns={columns.length} />
  }

  if (data.length === 0) {
    return (
      <div className={`text-center py-12 text-muted-foreground ${className}`}>
        <div className="text-lg font-medium mb-2">{emptyMessage}</div>
        <div className="text-sm">Try adjusting your search or filters</div>
      </div>
    )
  }

  return (
    <div className={`overflow-x-auto scrollbar-thin ${className}`}>
      <table className="w-full">
        <thead className={stickyHeader ? 'sticky top-0 bg-card z-10' : ''}>
          <tr className="border-b border-border">
            {columns.map((column) => (
              <th
                key={column.key as string}
                className={`text-left py-3 px-4 text-label font-medium text-muted-foreground uppercase tracking-wider ${
                  column.className || ''
                }`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={typeof item.id === 'string' ? item.id : index}
              className={`border-b border-border transition-colors ${
                hover ? 'hover:bg-muted/50' : ''
              } ${onRowClick ? 'cursor-pointer' : ''}`}
              onClick={() => onRowClick?.(item, index)}
            >
              {columns.map((column) => (
                <td
                  key={column.key as string}
                  className={`py-3 px-4 text-body ${column.className || ''}`}
                >
                  {column.render
                    ? column.render(item[column.key], item, index)
                    : item[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Skeleton loading state
function TableSkeleton({ columns }: { columns: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="sticky top-0 bg-card z-10">
          <tr className="border-b border-border">
            {Array.from({ length: columns }).map((_, index) => (
              <th
                key={index}
                className="text-left py-3 px-4 text-label font-medium text-muted-foreground uppercase tracking-wider"
              >
                <div className="h-4 bg-muted rounded animate-pulse" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <tr key={rowIndex} className="border-b border-border">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="py-3 px-4">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
