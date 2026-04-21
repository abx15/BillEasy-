import { apiClient, handleApiResponse, handleApiError } from '../api'

// Types
export interface Product {
  id: string
  name: string
  sku: string
  description?: string
  price: number
  gstPercentage: number
  stock: number
  lowStockThreshold: number
  category: string
  unit: string
  batchNumber?: string
  expiryDate?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateProductRequest {
  name: string
  sku?: string
  description?: string
  price: number
  gstPercentage: number
  stock: number
  lowStockThreshold: number
  category: string
  unit: string
  batchNumber?: string
  expiryDate?: string
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  isActive?: boolean
}

export interface GetProductsParams {
  page?: number
  limit?: number
  search?: string
  category?: string
  lowStock?: boolean
}

export interface StockAdjustmentRequest {
  quantity: number
  type: 'add' | 'remove'
  reason: string
  batchNumber?: string
  expiryDate?: string
}

// Products API functions
export const productsApi = {
  // Get products with pagination and filters
  getProducts: async (params: GetProductsParams = {}): Promise<{
    items: Product[]
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
      if (params.category) searchParams.append('category', params.category)
      if (params.lowStock !== undefined) searchParams.append('lowStock', params.lowStock.toString())

      const response = await apiClient.get(`/products?${searchParams.toString()}`)
      return handleApiResponse(response)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  // Get product by ID
  getProductById: async (id: string): Promise<Product> => {
    try {
      const response = await apiClient.get(`/products/${id}`)
      return handleApiResponse<Product>(response)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  // Search products for billing autocomplete
  searchProducts: async (query: string): Promise<Product[]> => {
    try {
      if (query.length < 2) return []
      
      const response = await apiClient.get(`/products/search?q=${encodeURIComponent(query)}`)
      return handleApiResponse<Product[]>(response)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  // Get low stock products
  getLowStockProducts: async (): Promise<Product[]> => {
    try {
      const response = await apiClient.get('/products/low-stock')
      return handleApiResponse<Product[]>(response)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  // Create new product
  createProduct: async (data: CreateProductRequest): Promise<Product> => {
    try {
      const response = await apiClient.post('/products', data)
      return handleApiResponse<Product>(response)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  // Update product
  updateProduct: async (id: string, data: UpdateProductRequest): Promise<Product> => {
    try {
      const response = await apiClient.put(`/products/${id}`, data)
      return handleApiResponse<Product>(response)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  // Delete product
  deleteProduct: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/products/${id}`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  // Adjust product stock
  adjustStock: async (id: string, data: StockAdjustmentRequest): Promise<Product> => {
    try {
      const response = await apiClient.put(`/products/${id}/stock`, data)
      return handleApiResponse<Product>(response)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  // Get product categories
  getCategories: async (): Promise<string[]> => {
    try {
      const response = await apiClient.get('/products/categories')
      return handleApiResponse<string[]>(response)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  // Get product statistics
  getProductStats: async (params: {
    from?: string
    to?: string
  } = {}): Promise<{
    totalProducts: number
    lowStockProducts: number
    outOfStockProducts: number
    totalStockValue: number
    topSellingProducts: Array<{
      productId: string
      name: string
      quantitySold: number
      revenue: number
    }>
  }> => {
    try {
      const searchParams = new URLSearchParams()
      if (params.from) searchParams.append('from', params.from)
      if (params.to) searchParams.append('to', params.to)

      const response = await apiClient.get(`/products/stats?${searchParams.toString()}`)
      return handleApiResponse(response)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  // Get product sales history
  getProductSalesHistory: async (id: string, params: {
    page?: number
    limit?: number
    from?: string
    to?: string
  } = {}): Promise<{
    items: Array<{
      billId: string
      invoiceNumber: string
      customerName: string
      quantity: number
      unitPrice: number
      totalAmount: number
      date: string
    }>
    total: number
    page: number
    limit: number
    totalPages: number
  }> => {
    try {
      const searchParams = new URLSearchParams()
      
      if (params.page) searchParams.append('page', params.page.toString())
      if (params.limit) searchParams.append('limit', params.limit.toString())
      if (params.from) searchParams.append('from', params.from)
      if (params.to) searchParams.append('to', params.to)

      const response = await apiClient.get(`/products/${id}/sales?${searchParams.toString()}`)
      return handleApiResponse(response)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  // Generate SKU
  generateSKU: async (name: string, category: string): Promise<string> => {
    try {
      const response = await apiClient.post('/products/generate-sku', { name, category })
      return handleApiResponse<string>(response)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },
}
