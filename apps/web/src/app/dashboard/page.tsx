'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Package, 
  AlertTriangle,
  Plus,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { billingApi } from '@/lib/api/billing'
import { productsApi } from '@/lib/api/products'
import { customersApi } from '@/lib/api/customers'
import { formatCurrency, formatDate } from '@/lib/utils/date'

interface StatCard {
  title: string
  value: string
  change: number
  changeType: 'increase' | 'decrease'
  icon: React.ComponentType<{ className?: string }>
  color: 'primary' | 'success' | 'warning' | 'destructive'
}

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([])
  const [recentBills, setRecentBills] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [billStats, lowStock, bills] = await Promise.all([
          billingApi.getBillStats(),
          productsApi.getLowStockProducts(),
          billingApi.getBills({ limit: 5 })
        ])

        setStats(billStats)
        setLowStockProducts(lowStock)
        setRecentBills(bills.items)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const statCards: StatCard[] = stats ? [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      change: 12.5,
      changeType: 'increase',
      icon: TrendingUp,
      color: 'success'
    },
    {
      title: 'Total Bills',
      value: stats.totalBills.toString(),
      change: 8.2,
      changeType: 'increase',
      icon: FileText,
      color: 'primary'
    },
    {
      title: 'Total Customers',
      value: '248',
      change: 15.3,
      changeType: 'increase',
      icon: Users,
      color: 'primary'
    },
    {
      title: 'Low Stock Items',
      value: lowStockProducts.length.toString(),
      change: -5.2,
      changeType: 'decrease',
      icon: AlertTriangle,
      color: 'warning'
    }
  ] : []

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatsCardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-96" />
          </div>
          <div>
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your business today.
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Bill
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <div className="card-content">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}/10`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                </div>
              </div>
              <div className="flex items-center mt-4">
                {stat.changeType === 'increase' ? (
                  <ArrowUpRight className="w-4 h-4 text-success mr-1" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-destructive mr-1" />
                )}
                <span className={`text-sm ${
                  stat.changeType === 'increase' ? 'text-success' : 'text-destructive'
                }`}>
                  {Math.abs(stat.change)}% from last month
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2">
          <Card>
            <div className="card-header">
              <h3 className="text-lg font-semibold text-foreground">Revenue Overview</h3>
              <p className="text-sm text-muted-foreground">
                Monthly revenue for the last 6 months
              </p>
            </div>
            <div className="card-content">
              <div className="h-80 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-2" />
                  <p>Chart will be implemented with Recharts</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Low Stock Alert */}
        <div>
          <Card>
            <div className="card-header">
              <h3 className="text-lg font-semibold text-foreground">Low Stock Alert</h3>
              <Badge status="LOW" size="sm">
                {lowStockProducts.length} items
              </Badge>
            </div>
            <div className="card-content">
              {lowStockProducts.length > 0 ? (
                <div className="space-y-3">
                  {lowStockProducts.slice(0, 3).map((product) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Stock: {product.stock}
                        </p>
                      </div>
                      <Badge status="LOW" size="sm">
                        Low
                      </Badge>
                    </div>
                  ))}
                  {lowStockProducts.length > 3 && (
                    <Button variant="outline" size="sm" className="w-full">
                      View All ({lowStockProducts.length - 3} more)
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 mx-auto mb-2 text-success" />
                  <p className="text-muted-foreground">All products are in stock</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Bills */}
      <Card>
        <div className="card-header">
          <h3 className="text-lg font-semibold text-foreground">Recent Bills</h3>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        <div className="card-content">
          {recentBills.length > 0 ? (
            <div className="space-y-4">
              {recentBills.map((bill) => (
                <div key={bill.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{bill.invoiceNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {bill.customerName} • {formatDate(bill.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      {formatCurrency(bill.totalAmount)}
                    </p>
                    <Badge status={bill.status as any} size="sm">
                      {bill.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">No bills created yet</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

// Skeleton component for stats cards
function StatsCardSkeleton() {
  return (
    <Card>
      <div className="card-content">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton variant="text" width="80px" height="16px" />
            <Skeleton variant="text" width="120px" height="24px" />
          </div>
          <Skeleton variant="circular" width="48px" height="48px" />
        </div>
        <div className="mt-4">
          <Skeleton variant="text" width="100px" height="14px" />
        </div>
      </div>
    </Card>
  )
}
