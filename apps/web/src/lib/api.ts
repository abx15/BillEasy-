import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
})

// Track ongoing requests to prevent multiple token refresh attempts
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: AxiosError) => void
}> = []

// Process the queue after token refresh
const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token!)
    }
  })
  
  failedQueue = []
}

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for token refresh and error handling
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // If error is not 401 or original request already retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    // If we're already refreshing, add to queue
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((token) => {
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`
        }
        return apiClient(originalRequest)
      }).catch((err) => {
        return Promise.reject(err)
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      // Call refresh token endpoint
      const response = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        { refreshToken },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      const { accessToken } = response.data.data
      localStorage.setItem('accessToken', accessToken)

      // Process any queued requests
      processQueue(null, accessToken)

      // Retry the original request
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
      }
      return apiClient(originalRequest)

    } catch (refreshError) {
      // Refresh failed - clear tokens and redirect to login
      processQueue(refreshError as AxiosError, null)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      
      // Only redirect if we're in the browser
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

// Export API response types
export interface ApiResponse<T = any> {
  success: boolean
  data: T
  timestamp: string
}

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
  }
  timestamp: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: {
    items: T[]
    total: number
    page: number
    limit: number
    totalPages: number
  }
  timestamp: string
}

// Helper function to handle API responses
export const handleApiResponse = <T>(response: { data: ApiResponse<T> }) => {
  return response.data.data
}

// Helper function to handle API errors
export const handleApiError = (error: AxiosError): string => {
  if (error.response?.data && typeof error.response.data === 'object') {
    const errorData = error.response.data as ApiError
    return errorData.error?.message || 'An error occurred'
  }
  
  if (error.code === 'ECONNABORTED') {
    return 'Request timeout. Please check your connection.'
  }
  
  if (error.code === 'NETWORK_ERROR') {
    return 'Network error. Please check your internet connection.'
  }
  
  return error.message || 'An unexpected error occurred'
}
