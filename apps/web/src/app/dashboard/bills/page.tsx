'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Download, Eye } from 'lucide-react'
import { Table, TableColumn } from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { billingApi, Bill } from '@/lib/api/billing'
import { formatCurrency, formatDate } from '@/lib/utils/date'

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  useEffect(() => {
    fetchBills()
  }, [searchQuery, statusFilter, pagination.page])

  const fetchBills = async () => {
    setLoading(true)
    try {
      const response = await billingApi.getBills({
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery,
        status: statusFilter as any,
      })
      setBills(response.items)
      setPagination(prev => ({
        ...prev,
        total: response.total,
        totalPages: response.totalPages,
      }))
    } catch (error) {
      console.error('Failed to fetch bills:', error)
    } finally {
      setLoading(false)
    }
  }

  const columns: TableColumn<Bill>[] = [
    {
      key: 'invoiceNumber',
      label: 'Invoice #',
      render: (value) => (
        <span className="font-medium text-foreground">{value}</span>
      ),
    },
    {
      key: 'customerName',
      label: 'Customer',
      render: (value, item) => (
        <div>
          <p className="font-medium text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">{item.customerPhone}</p>
        </div>
      ),
    },
    {
      key: 'totalAmount',
      label: 'Amount',
      render: (value) => (
        <span className="font-semibold text-foreground">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge status={value as any} size="sm">
          {value}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (value) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(value)}
        </span>
      ),
    },
    {
      key: 'actions' as any,
      label: 'Actions',
      render: (_, item) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bills</h1>
          <p className="text-muted-foreground">
            Manage and track all your billing records
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Bill
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="card-content">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by invoice number, customer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-border bg-background rounded-lg text-sm"
            >
              <option value="">All Status</option>
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="PARTIAL">Partial</option>
            </select>

            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Bills Table */}
      <Card>
        <div className="card-content p-0">
          <Table
            columns={columns}
            data={bills}
            loading={loading}
            onRowClick={(bill) => {
              // Navigate to bill detail
              console.log('Navigate to bill:', bill.id)
            }}
          />
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {bills.length} of {pagination.total} bills
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page === 1}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
          >
            Previous
          </Button>
          
          <span className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page === pagination.totalPages}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
