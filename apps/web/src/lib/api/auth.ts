import { apiClient, handleApiResponse, handleApiError } from '../api'
import { User } from '@/store/authStore'

// Types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  businessName: string
  gst: string
  address: string
  ownerName: string
  phone: string
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
}

// Auth API functions
export const authApi = {
  // Login user
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post('/auth/login', data)
      return handleApiResponse<AuthResponse>(response)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  // Register new user
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post('/auth/register', data)
      return handleApiResponse<AuthResponse>(response)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout')
    } catch (error) {
      // Don't throw error for logout, just log it
      console.error('Logout error:', handleApiError(error))
    }
  },

  // Refresh access token
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    try {
      const response = await apiClient.post('/auth/refresh', { refreshToken })
      return handleApiResponse<RefreshTokenResponse>(response)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  // Get current user
  getMe: async (): Promise<User> => {
    try {
      const response = await apiClient.get('/auth/me')
      return handleApiResponse<User>(response)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },
}
