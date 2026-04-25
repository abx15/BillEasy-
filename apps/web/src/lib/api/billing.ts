import { apiClient, handleApiResponse, handleApiError } from '../api'
import { AxiosError } from 'axios'
import { BillData } from '@/store/billingStore'

// Types
export interface Bill {
  id: string
  invoiceNumber: string
  customerId: string | null
  customerName?: string
  customerPhone?: string
  items: BillItem[]
  subtotal: number
  totalGST: number
  discountAmount: number
  totalAmount: number
  paymentMethod: 'cash' | 'upi' | 'card' | 'credit'
  status: 'PAID' | 'PENDING' | 'PARTIAL'
  notes: string
  createdAt: string
  updatedAt: string
  dueDate?: string
  paidAmount?: number
  pdfUrl?: string
  whatsappSent?: boolean
  emailSent?: boolean
}

export interface BillItem {
  id: string
  productId: string
  name: string
  sku: string
  quantity: number
  unitPrice: number
  gstPercentage: number
  gstAmount: number
  totalAmount: number
}

export interface CreateBillRequest extends BillData {}

export interface UpdatePaymentRequest {
  amount: number
  method: 'cash' | 'upi' | 'card' | 'credit'
  notes?: string
}

export interface GetBillsParams {
  page?: number
  limit?: number
  status?: Bill['status']
  from?: string
  to?: string
  search?: string
}

// Billing API functions
export const billingApi = {
  // Create new bill
  createBill: async (data: CreateBillRequest): Promise<Bill> => {
    try {
      const response = await apiClient.post('/bills', data)
      return handleApiResponse<Bill>(response)
    } catch (error) {
      throw new Error(handleApiError(error as AxiosError))
    }
  },

  // Get bills with pagination and filters
  getBills: async (params: GetBillsParams = {}): Promise<{
    items: Bill[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> => {
    try {
      const searchParams = new URLSearchParams()
      
      if (params.page) searchParams.append('page', params.page.toString())
      if (params.limit) searchParams.append('limit', params.limit.toString())
      if (params.status) searchParams.append('status', params.status)
      if (params.from) searchParams.append('from', params.from)
      if (params.to) searchParams.append('to', params.to)
      if (params.search) searchParams.append('search', params.search)

      const response = await apiClient.get(`/bills?${searchParams.toString()}`)
      return handleApiResponse(response)
    } catch (error) {
      throw new Error(handleApiError(error as AxiosError))
    }
  },

  // Get bill by ID
  getBillById: async (id: string): Promise<Bill> => {
    try {
      const response = await apiClient.get(`/bills/${id}`)
      return handleApiResponse<Bill>(response)
    } catch (error) {
      throw new Error(handleApiError(error as AxiosError))
    }
  },

  // Update bill payment
  updatePayment: async (id: string, data: UpdatePaymentRequest): Promise<Bill> => {
    try {
      const response = await apiClient.put(`/bills/${id}/payment`, data)
      return handleApiResponse<Bill>(response)
    } catch (error) {
      throw new Error(handleApiError(error as AxiosError))
    }
  },

  // Resend bill invoice
  resendBill: async (id: string): Promise<void> => {
    try {
      await apiClient.post(`/bills/${id}/send`)
    } catch (error) {
      throw new Error(handleApiError(error as AxiosError))
    }
  },

  // Download bill PDF
  downloadPDF: async (id: string): Promise<string> => {
    try {
      const response = await apiClient.get(`/bills/${id}/pdf`, {
        responseType: 'blob'
      })
      
      // Create blob URL
      const blob = new Blob([response.data], { type: 'application/pdf' })
      return URL.createObjectURL(blob)
    } catch (error) {
      throw new Error(handleApiError(error as AxiosError))
    }
  },

  // Delete bill
  deleteBill: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/bills/${id}`)
    } catch (error) {
      throw new Error(handleApiError(error as AxiosError))
    }
  },

  // Get bill statistics
  getBillStats: async (params: {
    from?: string
    to?: string
  } = {}): Promise<{
    totalRevenue: number
    totalBills: number
    paidBills: number
    pendingBills: number
    partialBills: number
    averageBillValue: number
  }> => {
    try {
      const searchParams = new URLSearchParams()
      if (params.from) searchParams.append('from', params.from)
      if (params.to) searchParams.append('to', params.to)

      const response = await apiClient.get(`/bills/stats?${searchParams.toString()}`)
      return handleApiResponse(response)
    } catch (error) {
      throw new Error(handleApiError(error as AxiosError))
    }
  },
}
