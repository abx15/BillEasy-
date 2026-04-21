'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, User, Phone, Mail, MapPin, MoreVertical } from 'lucide-react'
import { Table, TableColumn } from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { customersApi, Customer } from '@/lib/api/customers'
import { formatCurrency, formatDate, formatPhoneNumber } from '@/lib/utils/date'

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  useEffect(() => {
    fetchCustomers()
  }, [searchQuery, pagination.page])

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const response = await customersApi.getCustomers({
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery,
      })
      setCustomers(response.items)
      setPagination(prev => ({
        ...prev,
        total: response.total,
        totalPages: response.totalPages,
      }))
    } catch (error) {
      console.error('Failed to fetch customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const columns: TableColumn<Customer>[] = [
    {
      key: 'name',
      label: 'Customer',
      render: (value, item) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground">{value}</p>
            <p className="text-sm text-muted-foreground">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (value) => (
        <span className="text-sm text-muted-foreground">
          {formatPhoneNumber(value)}
        </span>
      ),
    },
    {
      key: 'address',
      label: 'Address',
      render: (value) => (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span>{value || 'No address'}</span>
        </div>
      ),
    },
    {
      key: 'totalBills',
      label: 'Total Bills',
      render: (value) => (
        <span className="font-medium text-foreground">{value}</span>
      ),
    },
    {
      key: 'totalAmount',
      label: 'Total Amount',
      render: (value) => (
        <span className="font-semibold text-foreground">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: 'pendingAmount',
      label: 'Pending',
      render: (value) => (
        <span className={`font-medium ${
          value > 0 ? 'text-warning' : 'text-success'
        }`}>
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: 'actions' as any,
      label: 'Actions',
      render: (_, item) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            View
          </Button>
          <Button variant="ghost" size="sm">
            Edit
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
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
          <h1 className="text-3xl font-bold text-foreground">Customers</h1>
          <p className="text-muted-foreground">
            Manage your customer database and relationships
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Search */}
      <Card>
        <div className="card-content">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search customers by name, phone, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold text-foreground">
                  {pagination.total}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <User className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Customers</p>
                <p className="text-2xl font-bold text-foreground">
                  {customers.filter(c => c.totalBills > 0).length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-success/10">
                <Mail className="w-6 h-6 text-success" />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Payments</p>
                <p className="text-2xl font-bold text-warning">
                  {formatCurrency(
                    customers.reduce((sum, c) => sum + c.pendingAmount, 0)
                  )}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-warning/10">
                <Phone className="w-6 h-6 text-warning" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Customers Table */}
      <Card>
        <div className="card-content p-0">
          <Table
            columns={columns}
            data={customers}
            loading={loading}
            onRowClick={(customer) => {
              // Navigate to customer detail
              console.log('Navigate to customer:', customer.id)
            }}
          />
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {customers.length} of {pagination.total} customers
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
