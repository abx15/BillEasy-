'use client'

import { useState, useEffect } from 'react'
import { Download, Calendar, TrendingUp, FileText, Users, Package } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { reportsApi } from '@/lib/api/reports'
import { formatCurrency, formatDate } from '@/lib/utils/date'

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedReport, setSelectedReport] = useState('revenue')
  const [reportData, setReportData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchReport()
  }, [selectedPeriod, selectedReport])

  const fetchReport = async () => {
    setLoading(true)
    try {
      let data
      switch (selectedReport) {
        case 'revenue':
          data = await reportsApi.getRevenueReport(
            new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString().split('T')[0],
            new Date().toISOString().split('T')[0]
          )
          break
        case 'daily':
          data = await reportsApi.getDailyReport()
          break
        case 'monthly':
          data = await reportsApi.getMonthlyReport()
          break
        default:
          data = null
      }
      setReportData(data)
    } catch (error) {
      console.error('Failed to fetch report:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportReport = async () => {
    try {
      let url
      switch (selectedReport) {
        case 'gst':
          url = await reportsApi.exportGSTReport(
            new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString().split('T')[0],
            new Date().toISOString().split('T')[0]
          )
          break
        default:
          return
      }
      
      if (url) {
        const a = document.createElement('a')
        a.href = url
        a.download = `report-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Failed to export report:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground">
            Business analytics and financial insights
          </p>
        </div>
        <Button onClick={exportReport}>
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="card-content">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Report Period
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-border bg-background rounded-lg text-sm"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Report Type
              </label>
              <select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className="w-full px-3 py-2 border border-border bg-background rounded-lg text-sm"
              >
                <option value="revenue">Revenue Report</option>
                <option value="daily">Daily Summary</option>
                <option value="monthly">Monthly Summary</option>
                <option value="gst">GST Report</option>
                <option value="customers">Customer Analytics</option>
                <option value="products">Product Analytics</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Report Content */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="card-content">
              <div className="h-96 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            </div>
          </Card>
        </div>
      ) : reportData ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <div className="card-content">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold text-foreground">
                      {formatCurrency(reportData.totalRevenue || 0)}
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
                    <p className="text-sm text-muted-foreground">Total Bills</p>
                    <p className="text-2xl font-bold text-foreground">
                      {reportData.totalBills || 0}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="card-content">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Paid Bills</p>
                    <p className="text-2xl font-bold text-success">
                      {reportData.paidBills || 0}
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
                    <p className="text-sm text-muted-foreground">Pending Bills</p>
                    <p className="text-2xl font-bold text-warning">
                      {reportData.pendingBills || 0}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-warning/10">
                    <Calendar className="w-6 h-6 text-warning" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Chart Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card>
              <div className="card-header">
                <h3 className="text-lg font-semibold text-foreground">Revenue Trend</h3>
                <p className="text-sm text-muted-foreground">
                  Revenue over the selected period
                </p>
              </div>
              <div className="card-content">
                <div className="h-80 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 mx-auto mb-2" />
                    <p>Chart will be implemented with Recharts</p>
                    <p className="text-sm">Daily revenue: {formatCurrency(5000)}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Payment Methods */}
            <Card>
              <div className="card-header">
                <h3 className="text-lg font-semibold text-foreground">Payment Methods</h3>
                <p className="text-sm text-muted-foreground">
                  Revenue distribution by payment method
                </p>
              </div>
              <div className="card-content">
                <div className="space-y-4">
                  {reportData.paymentMethods ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Cash</span>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(reportData.paymentMethods.cash || 0)}</p>
                          <Badge status="success" size="sm">45%</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">UPI</span>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(reportData.paymentMethods.upi || 0)}</p>
                          <Badge status="primary" size="sm">35%</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Card</span>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(reportData.paymentMethods.card || 0)}</p>
                          <Badge status="warning" size="sm">15%</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Credit</span>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(reportData.paymentMethods.credit || 0)}</p>
                          <Badge status="destructive" size="sm">5%</Badge>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No payment data available</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Top Products */}
          {reportData.topProducts && reportData.topProducts.length > 0 && (
            <Card>
              <div className="card-header">
                <h3 className="text-lg font-semibold text-foreground">Top Products</h3>
                <p className="text-sm text-muted-foreground">
                  Best selling products this period
                </p>
              </div>
              <div className="card-content">
                <div className="space-y-3">
                  {reportData.topProducts.slice(0, 5).map((product: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.quantitySold} units sold
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(product.revenue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* GST Summary */}
          {reportData.gstSummary && (
            <Card>
              <div className="card-header">
                <h3 className="text-lg font-semibold text-foreground">GST Summary</h3>
                <p className="text-sm text-muted-foreground">
                  Tax breakdown for the period
                </p>
              </div>
              <div className="card-content">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Taxable Amount</p>
                    <p className="font-semibold">{formatCurrency(reportData.gstSummary.totalTaxableAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CGST</p>
                    <p className="font-semibold">{formatCurrency(reportData.gstSummary.cgst)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">SGST</p>
                    <p className="font-semibold">{formatCurrency(reportData.gstSummary.sgst)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">IGST</p>
                    <p className="font-semibold">{formatCurrency(reportData.gstSummary.igst)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total GST</p>
                    <p className="font-semibold text-lg">{formatCurrency(reportData.gstSummary.totalGST)}</p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      ) : (
        <Card>
          <div className="card-content">
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Select a report type to view analytics</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
