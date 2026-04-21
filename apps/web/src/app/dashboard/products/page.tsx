'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Package, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react'
import { Table, TableColumn } from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { productsApi, Product } from '@/lib/api/products'
import { formatCurrency } from '@/lib/utils/date'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [stockFilter, setStockFilter] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [searchQuery, categoryFilter, stockFilter, pagination.page])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await productsApi.getProducts({
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery,
        category: categoryFilter,
        lowStock: stockFilter,
      })
      setProducts(response.items)
      setPagination(prev => ({
        ...prev,
        total: response.total,
        totalPages: response.totalPages,
      }))
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const cats = await productsApi.getCategories()
      setCategories(cats)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const columns: TableColumn<Product>[] = [
    {
      key: 'name',
      label: 'Product',
      render: (value, item) => (
        <div>
          <p className="font-medium text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (value) => (
        <Badge status="outline" size="sm">
          {value}
        </Badge>
      ),
    },
    {
      key: 'price',
      label: 'Price',
      render: (value) => (
        <span className="font-semibold text-foreground">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: 'stock',
      label: 'Stock',
      render: (value, item) => {
        const isLow = value <= item.lowStockThreshold
        return (
          <div className="flex items-center gap-2">
            <span className={`font-medium ${
              isLow ? 'text-warning' : 'text-success'
            }`}>
              {value}
            </span>
            {isLow && (
              <Badge status="LOW" size="sm">
                Low
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      key: 'gstPercentage',
      label: 'GST',
      render: (value) => (
        <span className="text-sm text-muted-foreground">
          {value}%
        </span>
      ),
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (value) => (
        <Badge status={value ? 'success' : 'destructive'} size="sm">
          {value ? 'Active' : 'Inactive'}
        </Badge>
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
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              // Quick stock adjustment
              console.log('Adjust stock for:', item.id)
            }}
          >
            Adjust Stock
          </Button>
        </div>
      ),
    },
  ]

  const lowStockCount = products.filter(p => p.stock <= p.lowStockThreshold).length
  const totalStockValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground">
            Manage your inventory and product catalog
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="card-content">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products by name, SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-border bg-background rounded-lg text-sm"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={stockFilter}
                onChange={(e) => setStockFilter(e.target.checked)}
                className="rounded border-border"
              />
              Low Stock Only
            </label>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold text-foreground">
                  {pagination.total}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <Package className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Products</p>
                <p className="text-2xl font-bold text-foreground">
                  {products.filter(p => p.isActive).length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-success/10">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low Stock Items</p>
                <p className="text-2xl font-bold text-warning">
                  {lowStockCount}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-warning/10">
                <AlertTriangle className="w-6 h-6 text-warning" />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Stock Value</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(totalStockValue)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <div className="card-content p-0">
          <Table
            columns={columns}
            data={products}
            loading={loading}
            onRowClick={(product) => {
              // Navigate to product detail
              console.log('Navigate to product:', product.id)
            }}
          />
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {products.length} of {pagination.total} products
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
