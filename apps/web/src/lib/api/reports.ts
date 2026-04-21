import { apiClient, handleApiResponse, handleApiError } from '../api'

// Types
export interface DailyReport {
  date: string
  totalRevenue: number
  totalBills: number
  paidBills: number
  pendingBills: number
  averageBillValue: number
  topProducts: Array<{
    productId: string
    name: string
    quantitySold: number
    revenue: number
  }>
  paymentMethods: {
    cash: number
    upi: number
    card: number
    credit: number
  }
}

export interface MonthlyReport {
  month: string
  year: number
  totalRevenue: number
  totalBills: number
  paidBills: number
  pendingBills: number
  averageBillValue: number
  dailyBreakdown: Array<{
    date: string
    revenue: number
    bills: number
  }>
  topProducts: Array<{
    productId: string
    name: string
    quantitySold: number
    revenue: number
  }>
  paymentMethods: {
    cash: number
    upi: number
    card: number
    credit: number
  }
  gstSummary: {
    totalTaxableAmount: number
    cgst: number
    sgst: number
    igst: number
    totalGST: number
  }
}

export interface RevenueReport {
  from: string
  to: string
  totalRevenue: number
  totalBills: number
  paidBills: number
  pendingBills: number
  averageBillValue: number
  dailyRevenue: Array<{
    date: string
    revenue: number
    bills: number
  }>
  topCustomers: Array<{
    customerId: string
    name: string
    totalAmount: number
    billCount: number
  }>
  topProducts: Array<{
    productId: string
    name: string
    quantitySold: number
    revenue: number
  }>
  paymentMethods: {
    cash: number
    upi: number
    card: number
    credit: number
  }
  gstSummary: {
    totalTaxableAmount: number
    cgst: number
    sgst: number
    igst: number
    totalGST: number
  }
}

export interface TopProduct {
  productId: string
  name: string
  sku: string
  quantitySold: number
  revenue: number
  category: string
}

// Reports API functions
export const reportsApi = {
  // Get daily report
  getDailyReport: async (date?: string): Promise<DailyReport> => {
    try {
      const searchParams = date ? `?date=${date}` : ''
      const response = await apiClient.get(`/reports/daily${searchParams}`)
      return handleApiResponse<DailyReport>(response)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  // Get monthly report
  getMonthlyReport: async (month?: number, year?: number): Promise<MonthlyReport> => {
    try {
      const searchParams = new URLSearchParams()
      if (month) searchParams.append('month', month.toString())
      if (year) searchParams.append('year', year.toString())

      const response = await apiClient.get(`/reports/monthly?${searchParams.toString()}`)
      return handleApiResponse<MonthlyReport>(response)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  // Get revenue report for date range
  getRevenueReport: async (from: string, to: string): Promise<RevenueReport> => {
    try {
      const searchParams = `?from=${from}&to=${to}`
      const response = await apiClient.get(`/reports/revenue${searchParams}`)
      return handleApiResponse<RevenueReport>(response)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  // Get top selling products
  getTopProducts: async (limit: number = 10, params: {
    from?: string
    to?: string
  } = {}): Promise<TopProduct[]> => {
    try {
      const searchParams = new URLSearchParams()
      searchParams.append('limit', limit.toString())
      if (params.from) searchParams.append('from', params.from)
      if (params.to) searchParams.append('to', params.to)

      const response = await apiClient.get(`/reports/top-products?${searchParams.toString()}`)
      return handleApiResponse<TopProduct[]>(response)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  // Get GST report for filing
  getGSTReport: async (from: string, to: string): Promise<{
    period: {
      from: string
      to: string
    }
    summary: {
      totalTaxableAmount: number
      cgst: number
      sgst: number
      igst: number
      totalGST: number
    }
    details: Array<{
      billId: string
      invoiceNumber: string
      date: string
      customerName: string
      taxableAmount: number
      cgst: number
      sgst: number
      igst: number
      totalGST: number
    }>
  }> => {
    try {
      const searchParams = `?from=${from}&to=${to}`
      const response = await apiClient.get(`/reports/gst${searchParams}`)
      return handleApiResponse(response)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  // Export GST report as CSV
  exportGSTReport: async (from: string, to: string): Promise<string> => {
    try {
      const searchParams = `?from=${from}&to=${to}`
      const response = await apiClient.get(`/reports/gst/export${searchParams}`, {
        responseType: 'blob'
      })
      
      // Create blob URL
      const blob = new Blob([response.data], { type: 'text/csv' })
      return URL.createObjectURL(blob)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  // Get customer analytics
  getCustomerAnalytics: async (params: {
    from?: string
    to?: string
    limit?: number
  } = {}): Promise<{
    totalCustomers: number
    newCustomers: number
    returningCustomers: number
    topCustomers: Array<{
      customerId: string
      name: string
      phone: string
      totalAmount: number
      billCount: number
      averageBillValue: number
      lastBillDate: string
    }>
    customerRetention: {
      new: number
      returning: number
      churned: number
    }
  }> => {
    try {
      const searchParams = new URLSearchParams()
      if (params.from) searchParams.append('from', params.from)
      if (params.to) searchParams.append('to', params.to)
      if (params.limit) searchParams.append('limit', params.limit.toString())

      const response = await apiClient.get(`/reports/customers?${searchParams.toString()}`)
      return handleApiResponse(response)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  // Get product analytics
  getProductAnalytics: async (params: {
    from?: string
    to?: string
    limit?: number
  } = {}): Promise<{
    totalProducts: number
    activeProducts: number
    lowStockProducts: number
    outOfStockProducts: number
    topCategories: Array<{
      category: string
      productCount: number
      totalRevenue: number
      quantitySold: number
    }>
    topProducts: Array<{
      productId: string
      name: string
      category: string
      quantitySold: number
      revenue: number
      profit: number
    }>
  }> => {
    try {
      const searchParams = new URLSearchParams()
      if (params.from) searchParams.append('from', params.from)
      if (params.to) searchParams.append('to', params.to)
      if (params.limit) searchParams.append('limit', params.limit.toString())

      const response = await apiClient.get(`/reports/products?${searchParams.toString()}`)
      return handleApiResponse(response)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  // Get payment analytics
  getPaymentAnalytics: async (params: {
    from?: string
    to?: string
  } = {}): Promise<{
    totalPayments: number
    paymentMethods: {
      cash: { count: number; amount: number; percentage: number }
      upi: { count: number; amount: number; percentage: number }
      card: { count: number; amount: number; percentage: number }
      credit: { count: number; amount: number; percentage: number }
    }
    dailyPayments: Array<{
      date: string
      cash: number
      upi: number
      card: number
      credit: number
      total: number
    }>
    pendingPayments: number
    overduePayments: number
  }> => {
    try {
      const searchParams = new URLSearchParams()
      if (params.from) searchParams.append('from', params.from)
      if (params.to) searchParams.append('to', params.to)

      const response = await apiClient.get(`/reports/payments?${searchParams.toString()}`)
      return handleApiResponse(response)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },
}
