import { apiClient, handleApiResponse, handleApiError } from '../api'
import { AxiosError } from 'axios'

// Types
export interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  address?: string
  creditBalance: number
  totalBills: number
  totalAmount: number
  pendingAmount: number
  lastBillDate?: string
  createdAt: string
  updatedAt: string
}

export interface CreateCustomerRequest {
  name: string
  phone: string
  email?: string
  address?: string
}

export interface UpdateCustomerRequest extends Partial<CreateCustomerRequest> {}

export interface GetCustomersParams {
  page?: number
  limit?: number
  search?: string
}

// Customers API functions
export const customersApi = {
  // Get customers with pagination and search
  getCustomers: async (params: GetCustomersParams = {}): Promise<{
    items: Customer[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> => {
    try {
      const searchParams = new URLSearchParams()
      
      if (params.page) searchParams.append('page', params.page.toString())
      if (params.limit) searchParams.append('limit', params.limit.toString())
      if (params.search) searchParams.append('search', params.search)

      const response = await apiClient.get(`/customers?${searchParams.toString()}`)
      return handleApiResponse(response)
    } catch (error) {
      throw new Error(handleApiError(error as AxiosError))
    }
  },

  // Get customer by ID
  getCustomerById: async (id: string): Promise<Customer> => {
    try {
      const response = await apiClient.get(`/customers/${id}`)
      return handleApiResponse<Customer>(response)
    } catch (error) {
      throw new Error(handleApiError(error as AxiosError))
    }
  },

  // Create new customer
  createCustomer: async (data: CreateCustomerRequest): Promise<Customer> => {
    try {
      const response = await apiClient.post('/customers', data)
      return handleApiResponse<Customer>(response)
    } catch (error) {
      throw new Error(handleApiError(error as AxiosError))
    }
  },

  // Update customer
  updateCustomer: async (id: string, data: UpdateCustomerRequest): Promise<Customer> => {
    try {
      const response = await apiClient.put(`/customers/${id}`, data)
      return handleApiResponse<Customer>(response)
    } catch (error) {
      throw new Error(handleApiError(error as AxiosError))
    }
  },

  // Delete customer
  deleteCustomer: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/customers/${id}`)
    } catch (error) {
      throw new Error(handleApiError(error as AxiosError))
    }
  },

  // Get customer bills
  getCustomerBills: async (id: string, params: {
    page?: number
    limit?: number
  } = {}): Promise<{
    items: any[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> => {
    try {
      const searchParams = new URLSearchParams()
      
      if (params.page) searchParams.append('page', params.page.toString())
      if (params.limit) searchParams.append('limit', params.limit.toString())

      const response = await apiClient.get(`/customers/${id}/bills?${searchParams.toString()}`)
      return handleApiResponse(response)
    } catch (error) {
      throw new Error(handleApiError(error as AxiosError))
    }
  },

  // Update customer credit balance
  updateCreditBalance: async (id: string, data: {
    amount: number
    type: 'increase' | 'decrease'
    notes?: string
  }): Promise<Customer> => {
    try {
      const response = await apiClient.put(`/customers/${id}/credit`, data)
      return handleApiResponse<Customer>(response)
    } catch (error) {
      throw new Error(handleApiError(error as AxiosError))
    }
  },

  // Search customers for autocomplete
  searchCustomers: async (query: string): Promise<Customer[]> => {
    try {
      if (query.length < 2) return []
      
      const response = await apiClient.get(`/customers/search?q=${encodeURIComponent(query)}`)
      return handleApiResponse<Customer[]>(response)
    } catch (error) {
      throw new Error(handleApiError(error as AxiosError))
    }
  },

  // Get customer statistics
  getCustomerStats: async (id: string): Promise<{
    totalBills: number
    totalAmount: number
    paidAmount: number
    pendingAmount: number
    averageBillValue: number
    lastBillDate?: string
  }> => {
    try {
      const response = await apiClient.get(`/customers/${id}/stats`)
      return handleApiResponse(response)
    } catch (error) {
      throw new Error(handleApiError(error as AxiosError))
    }
  },
}
